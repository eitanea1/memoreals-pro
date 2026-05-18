import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { imageId } = await req.json();
  if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });

  // Get the image to find its order + character
  const image = await prisma.generatedImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

  // Deselect all images for this character in this order, then select the chosen one
  await prisma.generatedImage.updateMany({
    where: { orderId: image.orderId, characterName: image.characterName },
    data:  { isSelected: false },
  });
  await prisma.generatedImage.update({
    where: { id: imageId },
    data:  { isSelected: true },
  });

  return NextResponse.json({ success: true });
}
