'use server';

import { computeAiLabel } from '@/lib/utils/aiLabel';
import { sendOrderConfirmationEmail } from '@/lib/email';

interface PersonalDetails {
  name: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  note?: string;
}

interface OrderPayload extends PersonalDetails {
  characters: { name: string; displayName: string; category: string }[];
  photos: { id: string; url: string; originalName: string }[];
}

/**
 * Saves the full order to Postgres.
 * Falls back gracefully if the DB is unreachable (e.g. Docker not running).
 */
export async function submitOrder(payload: OrderPayload): Promise<{ orderId: string }> {
  const aiLabel = computeAiLabel(payload.age, payload.gender);

  try {
    const { prisma } = await import('@/lib/prisma');

    // Upsert the user by email
    const user = await prisma.user.upsert({
      where:  { email: payload.email },
      update: { phone: payload.phone || undefined, name: payload.name },
      create: { email: payload.email, phone: payload.phone || undefined, name: payload.name },
    });

    // Create the order with characters
    const order = await prisma.order.create({
      data: {
        subjectName:   payload.name,
        subjectAge:    payload.age,
        subjectGender: payload.gender,
        aiLabel,
        customerEmail: payload.email,
        customerPhone: payload.phone,
        customerNote:  payload.note || '',
        userId:        user.id,
        characters: {
          create: payload.characters.map((c, i) => ({
            name:        c.name,
            displayName: c.displayName,
            category:    c.category,
            position:    i,
          })),
        },
        uploads: {
          create: payload.photos.map((p) => ({
            id:          p.id,
            filename:    p.url.split('/').pop() ?? p.id,
            originalName: p.originalName,
            mimeType:    'image/jpeg',
            sizeBytes:   0,
            storageUrl:  p.url,
          })),
        },
      },
    });

    // Send confirmation email (fire-and-forget — never blocks the order)
    sendOrderConfirmationEmail({
      to:          payload.email,
      subjectName: payload.name,
      orderId:     order.id,
      characters:  payload.characters.map((c) => c.displayName),
      photoCount:  payload.photos.length,
    });

    return { orderId: order.id };
  } catch (err) {
    console.error('[submitOrder] DB unavailable:', err);
    throw new Error('לא ניתן לשמור את ההזמנה. נסו שוב מאוחר יותר.');
  }
}
