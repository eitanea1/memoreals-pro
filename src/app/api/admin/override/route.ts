import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { orderId, aiOverride } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  await prisma.order.update({
    where: { id: orderId },
    data:  { aiOverride: aiOverride ?? '' },
  });

  return NextResponse.json({ success: true });
}
