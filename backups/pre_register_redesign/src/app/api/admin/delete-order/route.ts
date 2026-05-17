import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { uploads: true, generatedImages: true },
  });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  // Delete blob files for uploads
  const blobUrls: string[] = [];
  for (const upload of order.uploads) {
    if (upload.storageUrl && upload.storageUrl.includes('blob.vercel-storage.com')) {
      blobUrls.push(upload.storageUrl);
    }
  }
  // Delete blob files for generated images
  for (const img of order.generatedImages) {
    if (img.imageUrl && img.imageUrl.includes('blob.vercel-storage.com')) {
      blobUrls.push(img.imageUrl);
    }
  }

  if (blobUrls.length > 0) {
    try {
      await del(blobUrls);
    } catch (e) {
      console.warn('[delete-order] Failed to delete some blobs:', e);
    }
  }

  // Delete related records (cascades handle GeneratedImage, OrderCharacter, Upload)
  await prisma.order.delete({ where: { id: orderId } });

  return NextResponse.json({ success: true });
}
