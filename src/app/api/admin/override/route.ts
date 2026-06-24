import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { orderId, aiOverride, aiLabel, loraScale } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const data: Record<string, string | number | null> = {};
  if (aiOverride !== undefined) data.aiOverride = aiOverride ?? '';
  if (aiLabel !== undefined) data.aiLabel = aiLabel ?? '';
  if (loraScale !== undefined) {
    // clamp to a sane band; null clears it (back to default 1.0)
    data.loraScale = loraScale === null ? null : Math.min(1, Math.max(0.4, Number(loraScale)));
  }

  await prisma.order.update({
    where: { id: orderId },
    data,
  });

  return NextResponse.json({ success: true });
}
