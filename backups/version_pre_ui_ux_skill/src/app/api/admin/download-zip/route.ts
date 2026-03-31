import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Download all selected (winner) images for an order as a ZIP file.
 * GET /api/admin/download-zip?orderId=xxx
 *
 * Uses JSZip to bundle images fetched from fal.ai CDN.
 */
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
      characters: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const selectedImages = order.generatedImages;
  if (selectedImages.length === 0) {
    return NextResponse.json({ error: 'No images selected yet' }, { status: 400 });
  }

  // Dynamically import JSZip (only needed here)
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  // Build a character name lookup by position
  const charNameByPosition: Record<number, string> = {};
  for (const c of order.characters) {
    charNameByPosition[c.position] = c.name;
  }

  // Download each image and add to ZIP
  for (const img of selectedImages) {
    try {
      const res = await fetch(img.imageUrl);
      if (!res.ok) continue;
      const buffer = await res.arrayBuffer();

      // Name: 01-SpiderMan.png, 02-Chef.png, etc.
      const index = String(img.characterIndex + 1).padStart(2, '0');
      const safeName = img.characterName.replace(/[^a-zA-Z0-9]/g, '');
      const filename = `${index}-${safeName}.png`;

      zip.file(filename, buffer);
    } catch (err) {
      console.error(`[download-zip] Failed to fetch image ${img.id}:`, err);
    }
  }

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  const sanitizedSubjectName = order.subjectName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_');

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="MemoReals-${sanitizedSubjectName}.zip"`,
    },
  });
}
