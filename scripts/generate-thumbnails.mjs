import { fal } from '@fal-ai/client';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

fal.config({ credentials: process.env.FAL_KEY });

const OUT_DIR = join(process.cwd(), 'public', 'characters');

// 10 test images — diverse kids, mixed characters
const TEST_BATCH = [
  {
    filename: 'spider-man.jpg',
    prompt: 'Cinematic photorealistic portrait of a 8-year-old boy with short brown hair and light skin as Spider-Man, standing on a rooftop ledge above a glowing city at dusk, mask off. Wearing detailed red and blue suit with web pattern. Looking at camera. Golden hour lighting with city lights below. Floating sparks and glowing dust particles fill the air.',
  },
  {
    filename: 'iron-man.jpg',
    prompt: 'Cinematic photorealistic portrait of a 10-year-old boy with dark skin and short black hair as Iron Man, standing with helmet off, one glowing repulsor raised. Wearing red and gold metallic suit with arc reactor glowing on chest. Looking at camera. Cinematic blue-orange lighting with sparks.',
  },
  {
    filename: 'batman.jpg',
    prompt: 'Cinematic photorealistic portrait of a 7-year-old boy with olive skin and messy dark hair as Batman, cowl off, standing on a gothic rooftop with Bat-Signal glowing in the sky behind. Wearing dark armored batsuit. Looking at camera. Moody blue-gray city night lighting.',
  },
  {
    filename: 'wonder-woman.jpg',
    prompt: 'Cinematic photorealistic portrait of a 9-year-old girl with long black wavy hair and tan skin as Wonder Woman, standing in ancient Greek temple ruins at golden hour. Wearing golden tiara, red and gold armor, blue skirt with stars. Looking at camera. Warm golden light. Floating sparks and glowing dust particles fill the air.',
  },
  {
    filename: 'elsa.jpg',
    prompt: 'Cinematic photorealistic portrait of a 6-year-old girl with blonde braided hair and fair skin as Elsa from Frozen, standing on an icy mountain peak with snowflakes swirling around. Wearing shimmering ice-blue gown with crystal details. Looking at camera. Magical blue and white lighting. Floating ice sparkles fill the air.',
  },
  {
    filename: 'astronaut.jpg',
    prompt: 'Cinematic photorealistic portrait of a 11-year-old chubby boy with red curly hair and freckles as an astronaut, standing on the moon surface with Earth visible in the dark sky behind. Wearing detailed white space suit, helmet visor up. Looking at camera. Dramatic space lighting with Earth glow.',
  },
  {
    filename: 'dragon-ball.jpg',
    prompt: 'Cinematic photorealistic portrait of a 9-year-old boy with spiky black hair and light brown skin as a Dragon Ball Z fighter, standing in a rocky desert with energy aura glowing around him. Wearing orange martial arts gi with blue belt. Looking at camera. Dramatic golden energy lighting. Floating sparks and power particles fill the air.',
  },
  {
    filename: 'ninja-girl.jpg',
    prompt: 'Cinematic photorealistic portrait of a 8-year-old girl with short dark hair and East Asian features as a ninja warrior, standing on a moonlit Japanese rooftop with cherry blossoms. Wearing black ninja outfit with red accents. Looking at camera. Moody moonlight with pink blossom petals floating.',
  },
  {
    filename: 'cowboy.jpg',
    prompt: 'Cinematic photorealistic portrait of a 10-year-old boy with sandy blonde hair and tanned skin as a cowboy, standing in a dusty Wild West town at sunset. Wearing leather vest, cowboy hat, and boots. Looking at camera. Warm golden sunset lighting with dust particles in the air.',
  },
  {
    filename: 'ballerina.jpg',
    prompt: 'Cinematic photorealistic portrait of a 7-year-old girl with curly brown hair and dark skin as a ballerina, standing in an elegant theater stage with spotlights. Wearing a beautiful white tutu and ballet shoes. Looking at camera. Dramatic warm stage lighting with golden sparkles.',
  },
];

async function generateOne(item) {
  console.log(`Generating: ${item.filename}...`);
  try {
    const result = await fal.subscribe('fal-ai/flux-lora', {
      input: {
        prompt: item.prompt,
        num_images: 1,
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        enable_safety_checker: false,
      },
      logs: false,
    });

    const imageUrl = result.data.images[0].url;
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    const outPath = join(OUT_DIR, item.filename);
    await writeFile(outPath, buffer);
    console.log(`  Saved: ${outPath}`);
  } catch (err) {
    console.error(`  FAILED: ${item.filename}`, err.message);
  }
}

async function main() {
  console.log(`Generating ${TEST_BATCH.length} test thumbnails...`);
  for (const item of TEST_BATCH) {
    await generateOne(item);
  }
  console.log('Done!');
}

main();
