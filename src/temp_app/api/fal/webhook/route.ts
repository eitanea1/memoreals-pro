import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Webhook handler for fal.ai training completion.
 *
 * fal.ai POSTs here when a queued training job finishes.
 * Payload shape: { request_id, status: "OK"|"ERROR", payload, error }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request_id, status, payload, error: falError } = body;

    console.log('[fal/webhook] Received:', { request_id, status });

    if (!request_id) {
      return NextResponse.json({ error: 'Missing request_id' }, { status: 400 });
    }

    // Find the order that initiated this training
    const order = await prisma.order.findFirst({
      where: { falRequestId: request_id },
    });

    if (!order) {
      console.warn('[fal/webhook] No order found for request_id:', request_id);
      return NextResponse.json({ error: 'Order not found for request_id' }, { status: 404 });
    }

    if (status === 'OK') {
      // Training succeeded — extract the LoRA URL and advance status
      const loraUrl = payload?.diffusers_lora_file?.url ?? null;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'SAMPLING',
          loraUrl,
          trainingFailed: false,
        },
      });

      console.log('[fal/webhook] Training complete for order:', order.id, '→ SAMPLING');
    } else {
      // Training failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'RECEIVED',
          trainingFailed: true,
        },
      });

      console.error('[fal/webhook] Training failed for order:', order.id, falError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[fal/webhook] Error processing webhook:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
