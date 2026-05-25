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

interface ShippingAddress {
  recipientName: string;
  shippingStreet: string;
  shippingApartment?: string;
  shippingCity: string;
  shippingPostalCode?: string;
  shippingNotes?: string;
}

interface OrderPayload extends PersonalDetails, ShippingAddress {
  characters: { name: string; displayName: string; category: string }[];
  photos: { id: string; url: string; originalName: string }[];
}

/**
 * Saves the full order to Postgres.
 * Falls back gracefully if the DB is unreachable (e.g. Docker not running).
 */
export async function submitOrder(payload: OrderPayload): Promise<{ orderId: string; displayNumber: number }> {
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
        recipientName:      payload.recipientName,
        shippingStreet:     payload.shippingStreet,
        shippingApartment:  payload.shippingApartment || '',
        shippingCity:       payload.shippingCity,
        shippingPostalCode: payload.shippingPostalCode || '',
        shippingNotes:      payload.shippingNotes || '',
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

    // Send confirmation email — awaited so the serverless function doesn't
    // get killed mid-flight. The email helper has its own try/catch, so an
    // email failure here will never throw and never block the order from
    // returning successfully.
    await sendOrderConfirmationEmail({
      to:            payload.email,
      subjectName:   payload.name,
      orderId:       order.id,
      displayNumber: order.displayNumber,
      characters:    payload.characters.map((c) => c.displayName),
      photoCount:    payload.photos.length,
      recipientName:      payload.recipientName,
      shippingStreet:     payload.shippingStreet,
      shippingApartment:  payload.shippingApartment,
      shippingCity:       payload.shippingCity,
      shippingPostalCode: payload.shippingPostalCode,
    });

    return { orderId: order.id, displayNumber: order.displayNumber };
  } catch (err) {
    console.error('[submitOrder] DB unavailable:', err);
    throw new Error('לא ניתן לשמור את ההזמנה. נסו שוב מאוחר יותר.');
  }
}
