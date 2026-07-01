import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { LORA_TRIGGER } from '@/lib/prompts';

/**
 * Duplicate an order onto a different model family (default: FLUX.2) so the user
 * can train + generate it in parallel without touching the original. Copies the
 * subject details, uploaded photos and character list; resets all training state
 * so the copy is ready to train fresh.
 *
 * POST { orderId, modelVersion? }  →  { newOrderId }
 */
export async function POST(req: NextRequest) {
  const { orderId, modelVersion = 'flux2' } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const prisma = getPrisma();
  const src = await prisma.order.findUnique({
    where: { id: orderId },
    include: { uploads: true, characters: { orderBy: { position: 'asc' } } },
  });
  if (!src) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const copy = await prisma.order.create({
    data: {
      subjectName:   `${src.subjectName} (${modelVersion.toUpperCase()})`,
      subjectAge:    src.subjectAge,
      subjectGender: src.subjectGender,
      aiLabel:       src.aiLabel,
      aiOverride:    src.aiOverride,
      // loraScale left null → default 1.0 (a fresh FLUX.2 LoRA, not the FLUX.1 tuning)
      customerEmail: src.customerEmail,
      customerPhone: src.customerPhone,
      customerNote:  src.customerNote,
      recipientName: src.recipientName,
      shippingStreet: src.shippingStreet,
      shippingApartment: src.shippingApartment,
      shippingCity:   src.shippingCity,
      shippingPostalCode: src.shippingPostalCode,
      shippingNotes:  src.shippingNotes,
      // fresh training state on the new model family
      modelVersion,
      status:         'RECEIVED',
      loraUrl:        null,
      loraTrigger:    LORA_TRIGGER,
      trainingFailed: false,
      falRequestId:   null,
      // copy photos + characters
      uploads: {
        create: src.uploads.map((u) => ({
          filename: u.filename, originalName: u.originalName, mimeType: u.mimeType,
          sizeBytes: u.sizeBytes, storageUrl: u.storageUrl,
        })),
      },
      characters: {
        create: src.characters.map((c) => ({
          name: c.name, displayName: c.displayName, category: c.category, position: c.position,
        })),
      },
    },
  });

  return NextResponse.json({ success: true, newOrderId: copy.id });
}
