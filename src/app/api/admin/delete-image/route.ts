import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const { imageId } = await req.json();
  if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });

  const prisma = getPrisma();
  const image = await prisma.generatedImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

  // Delete from Vercel Blob if it's a blob URL (original + HD upscale)
  for (const url of [image.imageUrl, image.upscaledUrl]) {
    if (url && url.includes('blob.vercel-storage.com')) {
      try {
        await del(url);
      } catch (e) {
        console.warn('[delete-image] Failed to delete blob:', e);
      }
    }
  }

  await prisma.generatedImage.delete({ where: { id: imageId } });

  return NextResponse.json({ success: true });
}
