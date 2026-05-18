import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { orderId, aiOverride, aiLabel } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const data: Record<string, string> = {};
  if (aiOverride !== undefined) data.aiOverride = aiOverride ?? '';
  if (aiLabel !== undefined) data.aiLabel = aiLabel ?? '';

  await prisma.order.update({
    where: { id: orderId },
    data,
  });

  return NextResponse.json({ success: true });
}
