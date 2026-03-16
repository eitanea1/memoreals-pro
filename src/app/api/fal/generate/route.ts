import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { prisma } from '@/lib/prisma';
import { buildPrompt, VARIATIONS, type PromptVariation } from '@/lib/prompts';

fal.config({ credentials: process.env.FAL_KEY });

type FalImageResult = { data: { images: { url: string }[] } };

async function generateForCharacterVariation(params: {
  characterName: string;
  characterIndex: number;
  loraUrl: string;
  aiLabel: string;
  aiOverride: string;
  orderId: string;
  isSample: boolean;
  variation: PromptVariation;
}) {
  const prompt = buildPrompt({
    characterName: params.characterName,
    aiLabel: params.aiLabel,
    aiOverride: params.aiOverride,
    variation: params.variation,
  });

  const result = await fal.subscribe('fal-ai/flux-lora', {
    input: {
      prompt,
      loras: [{ path: params.loraUrl, scale: 0.9 }],
      num_images: 1,  // 1 image per variation (3 variations = 3 images total)
      image_size: 'portrait_4_3',
      num_inference_steps: 28,
      guidance_scale: 3.5,
      enable_safety_checker: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    logs: false,
    onQueueUpdate: () => {},
  }) as FalImageResult;

  const images = result.data?.images ?? [];

  await prisma.generatedImage.createMany({
    data: images.map((img) => ({
      orderId:        params.orderId,
      characterName:  params.characterName,
      characterIndex: params.characterIndex,
      imageUrl:       img?.url ?? '',
      variation:      params.variation,
      isSample:       params.isSample,
      isSelected:     false,
    })),
  });
}

export async function POST(req: NextRequest) {
  const { orderId, mode } = await req.json();
  // mode: 'samples' (first 5 characters) | 'full' (all 20 characters)

  if (!orderId || !mode) {
    return NextResponse.json({ error: 'orderId and mode required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { characters: { orderBy: { position: 'asc' } } },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (!order.loraUrl) return NextResponse.json({ error: 'LoRA not trained yet' }, { status: 400 });

  // Determine which characters to generate
  const allChars = order.characters;
  const isSample = mode === 'samples';
  const charsToGenerate = isSample ? allChars.slice(0, 5) : allChars;

  try {
    // Generate sequentially to avoid rate limits
    for (const char of charsToGenerate) {
      // 3 different prompt variations per character
      for (const variation of VARIATIONS) {
        await generateForCharacterVariation({
          characterName:  char.name,
          characterIndex: char.position,
          loraUrl:        order.loraUrl,
          aiLabel:        order.aiLabel,
          aiOverride:     order.aiOverride,
          orderId:        order.id,
          isSample,
          variation,
        });
      }
    }

    // Update order status
    if (mode === 'full') {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: 'PROCESSING_ALL' },
      });
    }

    const totalGenerated = charsToGenerate.length * VARIATIONS.length;
    return NextResponse.json({ success: true, generated: totalGenerated });
  } catch (err) {
    console.error('[generate] Error:', err);
    return NextResponse.json({ error: 'Generation failed', detail: String(err) }, { status: 500 });
  }
}
