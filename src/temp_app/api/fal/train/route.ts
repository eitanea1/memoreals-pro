import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { prisma } from '@/lib/prisma';
import { LORA_TRIGGER } from '@/lib/prompts';

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { uploads: true },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.uploads.length < 5) {
    return NextResponse.json({ error: 'Need at least 5 uploaded photos' }, { status: 400 });
  }

  // Build image URLs (absolute — fal.ai needs public URLs)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3002';
  const imageUrls = order.uploads.map((u) =>
    u.storageUrl.startsWith('http') ? u.storageUrl : `${baseUrl}${u.storageUrl}`
  );

  // Build webhook URL — fal.ai will POST here when training completes
  const webhookUrl = `${baseUrl}/api/fal/webhook`;

  try {
    // Submit training to the queue (returns immediately, no blocking)
    const { request_id } = await fal.queue.submit('fal-ai/flux-lora-fast-training', {
      input: {
        images_data_url: imageUrls,
        trigger_word: LORA_TRIGGER,
        steps: 1000,
        learning_rate: 0.0004,
        batch_size: 1,
        resolution: '512,768,1024',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      webhookUrl,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'TRAINING',
        trainingFailed: false,
        falRequestId: request_id,
      },
    });

    return NextResponse.json({ success: true, requestId: request_id });
  } catch (err) {
    console.error('[train] Error submitting to queue:', err);
    await prisma.order.update({
      where: { id: orderId },
      data: { trainingFailed: true },
    });
    return NextResponse.json({ error: 'Failed to submit training' }, { status: 500 });
  }
}
