import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts, type PDFPage } from 'pdf-lib';

export const maxDuration = 60;

/**
 * Generate a print-ready PDF for a MemoReals order.
 * GET /api/admin/download-pdf?orderId=xxx
 *
 * Replicates the customer's "cards-6.3-8.9" template, LANDSCAPE so the 4:3 images
 * fill the card with no heavy cropping:
 *  - Page 1: Cover — cream background, MemoReals title, child's name
 *  - Pages 2–N: Each selected character image appears TWICE (memory game pairs)
 *  - Every page: LANDSCAPE card. The image fills the whole page (full bleed). A red
 *    dashed rounded rectangle marks the cut line (trim); everything outside it is
 *    the 1.5mm bleed that gets trimmed off.
 *
 * Geometry: trim 89×63mm landscape, 1.5mm bleed each side → media 92×66mm,
 * rounded corners r≈2.2mm, red long-dashed border.
 */

const MM = 2.8346; // 1mm in PDF points
const TRIM_W = 89 * MM;        // card cut size (LANDSCAPE)
const TRIM_H = 63 * MM;
const BLEED = 1.5 * MM;        // image extends this far past the cut line (per template)
const PAGE_W = TRIM_W + 2 * BLEED;  // 92mm media
const PAGE_H = TRIM_H + 2 * BLEED;  // 66mm media
const TRIM_X = BLEED, TRIM_Y = BLEED;
const CORNER = 2.2 * MM;       // rounded-corner radius (template adj 3536)

// Red dashed rounded-rectangle cut guide — the "red border" from the template.
function drawTrimGuide(page: PDFPage) {
  const r = CORNER, w = TRIM_W, h = TRIM_H;
  // Rounded-rect SVG path (path origin = top-left; pdf-lib flips y for us).
  const path =
    `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} ` +
    `A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} ` +
    `V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  page.drawSvgPath(path, {
    x: TRIM_X,
    y: TRIM_Y + TRIM_H, // top-left corner in PDF coordinates
    borderColor: rgb(1, 0, 0),
    borderWidth: 0.5,
    borderDashArray: [5, 3], // long dash, like the template's lgDash
  });
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      generatedImages: {
        where: { isSelected: true },
        orderBy: { characterIndex: 'asc' },
      },
      characters: { orderBy: { position: 'asc' } },
    },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const selectedImages = order.generatedImages;
  if (selectedImages.length === 0) {
    return NextResponse.json({ error: 'No images selected yet' }, { status: 400 });
  }

  const pdf = await PDFDocument.create();

  // ── Cover page ──────────────────────────────────────────────────────────────
  const coverPage = pdf.addPage([PAGE_W, PAGE_H]);
  // Warm cream background fills the whole page (full bleed).
  coverPage.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.961, 0.945, 0.925) });
  drawTrimGuide(coverPage);

  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica);

  // "MemoReals" brand title
  const brandText = 'MemoReals';
  const brandSize = 20;
  const brandW = boldFont.widthOfTextAtSize(brandText, brandSize);
  coverPage.drawText(brandText, {
    x: (PAGE_W - brandW) / 2,
    y: PAGE_H * 0.62,
    size: brandSize,
    font: boldFont,
    color: rgb(0.357, 0.129, 0.714), // deep purple
  });

  // Child's name
  const nameText = order.subjectName;
  const nameSize = 16;
  const nameW = regularFont.widthOfTextAtSize(nameText, nameSize);
  coverPage.drawText(nameText, {
    x: (PAGE_W - nameW) / 2,
    y: PAGE_H * 0.47,
    size: nameSize,
    font: regularFont,
    color: rgb(0.18, 0.18, 0.18),
  });

  // Thin divider line
  coverPage.drawLine({
    start: { x: PAGE_W * 0.25, y: PAGE_H * 0.55 },
    end:   { x: PAGE_W * 0.75, y: PAGE_H * 0.55 },
    thickness: 0.5,
    color: rgb(0.6, 0.5, 0.8),
  });

  // ── Character pages (each image × 2) ────────────────────────────────────────
  for (const img of selectedImages) {
    let imageBytes: Uint8Array;
    let contentType = '';
    try {
      // Prefer the HD upscale for print; fall back to the original.
      const res = await fetch(img.upscaledUrl ?? img.imageUrl, { redirect: 'follow' });
      if (!res.ok) {
        console.error(`[download-pdf] HTTP ${res.status} for image ${img.id}`);
        continue;
      }
      contentType = res.headers.get('content-type') ?? '';
      imageBytes = new Uint8Array(await res.arrayBuffer());
    } catch (err) {
      console.error(`[download-pdf] Failed to fetch image ${img.id}:`, err);
      continue;
    }

    // Detect format from content-type or magic bytes
    const isPng =
      contentType.includes('png') ||
      (imageBytes[0] === 0x89 && imageBytes[1] === 0x50);
    const isJpeg =
      contentType.includes('jpeg') ||
      contentType.includes('jpg') ||
      (imageBytes[0] === 0xff && imageBytes[1] === 0xd8);

    let embedded;
    try {
      if (isPng) {
        embedded = await pdf.embedPng(imageBytes);
      } else if (isJpeg) {
        embedded = await pdf.embedJpg(imageBytes);
      } else {
        // Unknown format — try JPEG then PNG
        try {
          embedded = await pdf.embedJpg(imageBytes);
        } catch {
          embedded = await pdf.embedPng(imageBytes);
        }
      }
    } catch (err2) {
      console.error(`[download-pdf] Could not embed image ${img.id} (type: ${contentType}):`, err2);
      continue;
    }

    // Scale to COVER the whole page (full bleed). Portrait card, no rotation —
    // the child stays upright. Overflow past the page edge is clipped by the
    // page MediaBox.
    const scale = Math.max(PAGE_W / embedded.width, PAGE_H / embedded.height);
    const scaledW = embedded.width * scale;
    const scaledH = embedded.height * scale;

    // Draw the image TWICE (memory game pair)
    for (let i = 0; i < 2; i++) {
      const page = pdf.addPage([PAGE_W, PAGE_H]);
      page.drawImage(embedded, {
        x: (PAGE_W - scaledW) / 2,
        y: (PAGE_H - scaledH) / 2,
        width: scaledW,
        height: scaledH,
      });
      drawTrimGuide(page); // red dashed cut line on top
    }
  }

  const pdfBytes = await pdf.save();
  const pdfBuffer = Buffer.from(pdfBytes);
  const safeName = order.subjectName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_');

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="MemoReals-${safeName}.pdf"`,
    },
  });
}
