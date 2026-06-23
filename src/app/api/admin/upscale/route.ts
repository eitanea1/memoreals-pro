import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { upscaleImage } from '@/lib/upscale';

// GPT Image high-quality edits take ~20-60s each. We upscale ONE image per
// request so we stay well under the serverless timeout; the client loops over
// the selected images for "upscale all", exactly like the generation flow.
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { imageId, force } = await req.json();
  if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });

  const prisma = getPrisma();
  const image = await prisma.generatedImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

  // Idempotent: skip if already upscaled (unless force=true), so an "upscale all"
  // loop can be re-run cheaply without paying for images that are already done.
  if (image.upscaledUrl && !force) {
    return NextResponse.json({ success: true, skipped: true, upscaledUrl: image.upscaledUrl });
  }

  try {
    const upscaledUrl = await upscaleImage(image.imageUrl, `upscaled/${image.id}.png`);
    await prisma.generatedImage.update({
      where: { id: imageId },
      data: { upscaledUrl },
    });
    return NextResponse.json({ success: true, upscaledUrl });
  } catch (err) {
    console.error('[upscale] Error:', err);
    return NextResponse.json({ error: 'Upscale failed', detail: String(err) }, { status: 500 });
  }
}
