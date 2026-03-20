import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import PptxGenJS from 'pptxgenjs';

export const maxDuration = 60;

// Card 89×63mm landscape + 3mm bleed on all sides = 95×69mm
const SLIDE_W_MM = 95;
const SLIDE_H_MM = 69;

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
    },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const selectedImages = order.generatedImages;
  if (selectedImages.length === 0) {
    return NextResponse.json({ error: 'No images selected yet' }, { status: 400 });
  }

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'CARD', width: SLIDE_W_MM / 25.4, height: SLIDE_H_MM / 25.4 });
  pptx.layout = 'CARD';

  // ── Cover slide ──────────────────────────────────────────────────────────────
  const cover = pptx.addSlide();
  cover.background = { color: 'F6F1EC' };
  cover.addText('MemoReals', {
    x: 0, y: '35%', w: '100%',
    fontSize: 28, bold: true, color: '5B21B6', align: 'center',
  });
  cover.addText(order.subjectName, {
    x: 0, y: '52%', w: '100%',
    fontSize: 20, color: '2D3748', align: 'center',
  });

  // ── Character slides (each image × 2) ────────────────────────────────────────
  for (const img of selectedImages) {
    let imageData: string;
    try {
      const res = await fetch(img.imageUrl, { redirect: 'follow' });
      if (!res.ok) {
        console.error(`[download-pptx] HTTP ${res.status} for image ${img.id}`);
        continue;
      }
      const contentType = res.headers.get('content-type') ?? 'image/jpeg';
      const bytes = await res.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const ext = contentType.includes('png') ? 'png' : 'jpg';
      imageData = `data:image/${ext};base64,${base64}`;
    } catch (err) {
      console.error(`[download-pptx] Failed to fetch image ${img.id}:`, err);
      continue;
    }

    // Add the slide TWICE (memory game pair)
    for (let i = 0; i < 2; i++) {
      const slide = pptx.addSlide();
      slide.addImage({
        data: imageData,
        x: 0, y: 0,
        w: SLIDE_W_MM / 25.4,
        h: SLIDE_H_MM / 25.4,
        sizing: { type: 'cover', w: SLIDE_W_MM / 25.4, h: SLIDE_H_MM / 25.4 },
      });
    }
  }

  const pptxBuffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
  const safeName = order.subjectName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_');

  return new NextResponse(pptxBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="MemoReals-${safeName}.pptx"`,
    },
  });
}
