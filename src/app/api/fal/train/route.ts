import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { prisma } from '@/lib/prisma';
import { put, head } from '@vercel/blob';
import JSZip from 'jszip';
import { LORA_TRIGGER } from '@/lib/prompts';
import { getBaseUrl } from '@/lib/baseUrl';

fal.config({ credentials: process.env.FAL_KEY });

export const maxDuration = 60; // Allow up to 60s for ZIP creation

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
  const baseUrl = getBaseUrl(req);
  const imageUrls = order.uploads.map((u) =>
    u.storageUrl.startsWith('http') ? u.storageUrl : `${baseUrl}${u.storageUrl}`
  );

  // Build webhook URL — fal.ai will POST here when training completes
  const webhookUrl = `${baseUrl}/api/fal/webhook`;

  try {
    // Check if ZIP already exists in Blob (retraining case)
    const zipPath = `training/${orderId}.zip`;
    let zipUrl: string;

    try {
      const existing = await head(zipPath);
      zipUrl = existing.url;
      console.log('[train] Reusing existing ZIP:', zipUrl);
    } catch {
      // ZIP doesn't exist — create it
      console.log('[train] Creating ZIP from', imageUrls.length, 'images');
      const zip = new JSZip();
      await Promise.all(
        imageUrls.map(async (url, i) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch image ${i}: ${res.status}`);
          const buffer = await res.arrayBuffer();
          const ext = url.split('.').pop()?.toLowerCase() ?? 'jpg';
          zip.file(`image_${i}.${ext}`, buffer);
        })
      );

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      const blob = await put(zipPath, zipBuffer, {
        access: 'public',
        contentType: 'application/zip',
      });
      zipUrl = blob.url;
    }

    // Submit training to the queue (returns immediately, no blocking)
    // NOTE: these inputs mirror the manual fal training run that produced great
    // results at scale 1.0 (full likeness AND full scene). The previous config
    // diverged in 4 ways that overbaked the LoRA and locked the subject to the
    // training background — see each inline comment.
    const { request_id } = await fal.queue.submit('fal-ai/flux-lora-portrait-trainer', {
      input: {
        images_data_url: zipUrl,
        trigger_phrase: LORA_TRIGGER,    // was `trigger_word` — wrong param name, so the trigger was ignored
        steps: 1000,
        learning_rate: 0.0002,           // was 0.0004 — double LR overbaked the LoRA (narrow scale band)
        subject_crop: true,              // was missing — without it the room/background bakes into the subject
        create_masks: false,
        multiresolution_training: true,  // was `resolution: '512,768,1024'` — wrong param, silently ignored
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
        loraTrigger: LORA_TRIGGER,
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
