import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { getPrisma } from '@/lib/prisma';

export const maxDuration = 60;

/**
 * Admin upload of a custom image (not from the AI options).
 * POST multipart/form-data:
 *   file       — the image
 *   orderId    — target order
 *   mode       — 'character' | 'newCharacter' | 'logo'
 *   characterName  (mode=character)      — existing character to add an option to
 *   characterIndex (mode=character)      — that character's index
 *   displayName    (mode=newCharacter)   — Hebrew name for a brand-new character
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const orderId = form.get('orderId') as string | null;
    const mode = (form.get('mode') as string | null) ?? 'character';

    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const prisma = getPrisma();
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Upload to Vercel Blob.
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
    const blob = await put(`custom/${orderId}/${uuidv4()}.${ext}`, file, {
      access: 'public',
      contentType: file.type || 'image/png',
    });

    // ── Logo / cover image ──
    if (mode === 'logo') {
      await prisma.order.update({ where: { id: orderId }, data: { coverImageUrl: blob.url } });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // ── Brand-new character ──
    if (mode === 'newCharacter') {
      const displayName = ((form.get('displayName') as string | null) ?? '').trim();
      if (!displayName) return NextResponse.json({ error: 'displayName required' }, { status: 400 });

      const last = await prisma.orderCharacter.findFirst({
        where: { orderId }, orderBy: { position: 'desc' },
      });
      const position = (last?.position ?? -1) + 1;
      // English name for the AI label is irrelevant for a custom upload; reuse displayName.
      await prisma.orderCharacter.create({
        data: { orderId, name: displayName, displayName, category: 'custom', position },
      });
      await prisma.generatedImage.create({
        data: {
          orderId, characterName: displayName, characterIndex: position,
          imageUrl: blob.url, variation: 'custom', isSample: false, isSelected: true,
        },
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // ── Custom option for an existing character (replace flow) ──
    const characterName = (form.get('characterName') as string | null) ?? '';
    const characterIndex = Number(form.get('characterIndex') ?? 0);
    if (!characterName) return NextResponse.json({ error: 'characterName required' }, { status: 400 });

    await prisma.generatedImage.create({
      data: {
        orderId, characterName, characterIndex,
        imageUrl: blob.url, variation: 'custom', isSample: false, isSelected: false,
      },
    });
    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('[upload-image] Error:', err);
    return NextResponse.json({ error: 'Upload failed', detail: String(err) }, { status: 500 });
  }
}
