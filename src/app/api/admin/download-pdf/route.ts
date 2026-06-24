import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  PDFDocument, rgb, StandardFonts, type PDFPage,
  pushGraphicsState, popGraphicsState, rectangle, clip, endPath,
} from 'pdf-lib';

export const maxDuration = 60;

/**
 * Generate a print-ready PDF for a MemoReals order.
 * GET /api/admin/download-pdf?orderId=xxx
 *
 * Layout (proper prepress so the print shop can trim accurately):
 *  - Page 1: Cover — cream background, MemoReals title, child's name
 *  - Pages 2–N: Each selected character image appears TWICE (memory game pairs)
 *  - Every page: image fills the BLEED box (3mm past the cut line) and is clipped
 *    there, a white MARGIN holds CROP MARKS at the trim corners so the bleed is
 *    visible and the cutter knows exactly where to cut.
 *
 * Card (trim) size: 89×63mm landscape. + 3mm bleed + 6mm margin for crop marks.
 */

const MM = 2.8346; // 1mm in PDF points
const TRIM_W = 89 * MM;        // card cut size (landscape)
const TRIM_H = 63 * MM;
const BLEED = 3 * MM;          // image extends this far past the cut line
const MARGIN = 6 * MM;         // white border holding the crop marks
// Bleed box (the full-bleed image area):
const BLEED_W = TRIM_W + 2 * BLEED;
const BLEED_H = TRIM_H + 2 * BLEED;
// Full media (page) size = bleed box + crop-mark margin all around:
const PAGE_W = BLEED_W + 2 * MARGIN;
const PAGE_H = BLEED_H + 2 * MARGIN;
// Origins (bottom-left) of the bleed box and trim box within the page:
const BLEED_X = MARGIN, BLEED_Y = MARGIN;
const TRIM_X = MARGIN + BLEED, TRIM_Y = MARGIN + BLEED;

// Draw the 8 crop marks (2 per corner) in the white margin, aligned to the trim
// edges. They sit OUTSIDE the bleed box so they never overlap the image.
function drawCropMarks(page: PDFPage) {
  const t = 0.5; // line thickness (pt)
  const black = rgb(0, 0, 0);
  const L = MARGIN; // mark length = the margin width
  const xL = TRIM_X, xR = TRIM_X + TRIM_W;          // trim left / right
  const yB = TRIM_Y, yT = TRIM_Y + TRIM_H;          // trim bottom / top
  const bL = BLEED_X, bR = BLEED_X + BLEED_W;       // bleed left / right
  const bB = BLEED_Y, bT = BLEED_Y + BLEED_H;       // bleed bottom / top
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: t, color: black });
  // vertical marks (in top/bottom margins), aligned to trim left & right edges
  line(xL, 0, xL, bB); line(xL, bT, xL, PAGE_H);
  line(xR, 0, xR, bB); line(xR, bT, xR, PAGE_H);
  // horizontal marks (in left/right margins), aligned to trim bottom & top edges
  line(0, yB, bL, yB); line(bR, yB, PAGE_W, yB);
  line(0, yT, bL, yT); line(bR, yT, PAGE_W, yT);
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
  // Warm cream background — fills the bleed box only, so the crop-mark margin stays white.
  coverPage.drawRectangle({ x: BLEED_X, y: BLEED_Y, width: BLEED_W, height: BLEED_H, color: rgb(0.961, 0.945, 0.925) });
  drawCropMarks(coverPage);

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

    // Scale to COVER the bleed box (image fills 3mm past the trim on every side).
    const scale = Math.max(BLEED_W / embedded.width, BLEED_H / embedded.height);
    const scaledW = embedded.width * scale;
    const scaledH = embedded.height * scale;

    // Draw the image TWICE (memory game pair)
    for (let i = 0; i < 2; i++) {
      const page = pdf.addPage([PAGE_W, PAGE_H]);
      // Clip to the bleed box so the cover-scaled overflow can't spill onto the
      // white crop-mark margin.
      page.pushOperators(
        pushGraphicsState(),
        rectangle(BLEED_X, BLEED_Y, BLEED_W, BLEED_H),
        clip(),
        endPath(),
      );
      page.drawImage(embedded, {
        x: BLEED_X + (BLEED_W - scaledW) / 2,
        y: BLEED_Y + (BLEED_H - scaledH) / 2,
        width: scaledW,
        height: scaledH,
      });
      page.pushOperators(popGraphicsState());
      drawCropMarks(page);
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
