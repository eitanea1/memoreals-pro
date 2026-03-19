import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const maxDuration = 60;

/**
 * Generate a print-ready PDF for a MemoReals order.
 * GET /api/admin/download-pdf?orderId=xxx
 *
 * Layout:
 *  - Page 1: Cover — cream background, MemoReals title, child's name
 *  - Pages 2–N: Each selected character image appears TWICE (memory game pairs)
 *               Source images are landscape (1424×1024); rotated 90° CW to portrait.
 *
 * Card size: 63×89mm portrait + 3mm bleed on all sides = 69×95mm per page
 */

const MM = 2.8346; // 1mm in PDF points
const BLEED = 3 * MM;
const CARD_W = 63 * MM; // 178.6 pt
const CARD_H = 89 * MM; // 252.3 pt
const PAGE_W = CARD_W + BLEED * 2; // 195.6 pt
const PAGE_H = CARD_H + BLEED * 2; // 269.3 pt

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
  // Warm cream background
  coverPage.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.961, 0.945, 0.925) });

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
      const res = await fetch(img.imageUrl, { redirect: 'follow' });
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

    // Images are generated as portrait (768×1024). Scale to cover the card, centre-crop.
    const scale = Math.max(PAGE_W / embedded.width, PAGE_H / embedded.height);
    const scaledW = embedded.width * scale;
    const scaledH = embedded.height * scale;
    const dx = (PAGE_W - scaledW) / 2;
    const dy = (PAGE_H - scaledH) / 2;

    // Draw the image TWICE (memory game pair)
    for (let i = 0; i < 2; i++) {
      const page = pdf.addPage([PAGE_W, PAGE_H]);
      page.drawImage(embedded, {
        x: dx,
        y: dy,
        width: scaledW,
        height: scaledH,
      });
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
