import { fal } from '@fal-ai/client';
import { writeFile, mkdirSync as mkdirSyncFs } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { writeFile as writeFileAsync } from 'fs/promises';
import { mkdirSync } from 'fs';

config({ path: join(process.cwd(), '.env.local') });
fal.config({ credentials: process.env.FAL_KEY });

const OUT_DIR = join(process.cwd(), 'public', 'characters', 'girls');

const LOOKS = [
  '9-year-old girl with long black wavy hair and tan skin',
  '8-year-old girl with blonde straight hair and fair skin',
  '7-year-old girl with curly brown hair and dark skin',
  '10-year-old girl with ginger hair, freckles and light skin',
  '6-year-old girl with dark skin and braided black hair',
  '11-year-old girl with short brunette hair and olive skin',
  '8-year-old girl with East Asian features and straight black hair',
  '9-year-old girl with blonde curly hair and fair skin',
  '7-year-old girl with dark wavy hair and light brown skin',
  '10-year-old chubby girl with red curly hair and pale skin',
  '6-year-old girl with long straight black hair and olive skin',
  '11-year-old girl with tight curly dark hair and dark skin',
  '8-year-old girl with sandy brown hair and tanned skin',
  '9-year-old girl with auburn hair and light skin with freckles',
];

const CHARS = [
  // ── Heroines ──
  { file: 'wonder-woman', scene: 'as Wonder Woman, standing in ancient Greek temple ruins at golden hour. Wearing golden tiara, red and gold armor, blue skirt with stars. Looking at camera. Warm golden light. Floating sparks fill the air.' },
  { file: 'captain-marvel', scene: 'as Captain Marvel, hovering mid-air with glowing fists and energy aura. Wearing red, blue and gold suit with star emblem on chest. Looking at camera. Cinematic cosmic lighting with sparks.' },
  { file: 'black-widow', scene: 'as Black Widow, standing on a rooftop at night in a city. Wearing sleek black tactical suit with utility belt. Looking at camera. Moody blue-purple city lighting. Floating particles.' },
  { file: 'batgirl', scene: 'as Batgirl, standing on a gothic rooftop with city lights below. Wearing purple and black armored suit with bat emblem and cape. Looking at camera. Moody night lighting with golden sparks.' },
  { file: 'storm', scene: 'as Storm, floating mid-air with lightning crackling around her and white flowing hair. Wearing black and silver suit with cape. Looking at camera. Dramatic stormy sky with electric blue lighting.' },

  // ── Fairy Tales & Anime (costume descriptions, not character names) ──
  { file: 'cinderella', scene: 'wearing a shimmering light blue princess ball gown with glass slippers, descending a grand marble staircase in a palace ballroom. Looking at camera. Magical golden sparkle lighting. Fairy dust swirls around.' },
  { file: 'snow-white', scene: 'wearing a yellow and blue royal princess gown with red bow headband, standing in an enchanted forest clearing with sunbeams. Looking at camera. Soft fairytale golden light. Golden particles float like fireflies.' },
  { file: 'rapunzel', scene: 'wearing a purple princess dress with very long flowing golden hair cascading down, standing at a tower window. Hundreds of floating lanterns rise into the twilight sky. Looking at camera. Warm lantern glow.' },
  { file: 'elsa', scene: 'wearing a shimmering ice-blue queen gown with crystal snowflake details and a flowing translucent cape, standing on an icy mountain peak. Snowflakes swirl around. Looking at camera. Magical blue and white lighting. Ice sparkles fill the air.' },
  { file: 'moana', scene: 'wearing a Polynesian-inspired red and tan outfit with a glowing green pendant necklace, standing on the bow of a wooden sailing canoe on a turquoise ocean. Looking at camera. Warm tropical sunset lighting. Ocean spray sparkles.' },
  { file: 'mulan', scene: 'wearing Chinese warrior armor with a sword and flowing red cape, standing before the Great Wall at sunrise. Looking at camera. Dramatic golden sunrise lighting. Floating cherry blossom petals.' },
  { file: 'ariel', scene: 'wearing a teal mermaid-style outfit with seashell details, sitting on ocean rocks at sunset with waves gently crashing. Looking at camera. Warm sunset ocean lighting. Golden light sparkles on water.' },
  { file: 'aurora', scene: 'wearing a flowing pink and blue magical princess gown with golden crown, standing in an enchanted castle garden full of blooming roses. Looking at camera. Soft dreamy golden light. Fairy sparkles fill the air.' },
  { file: 'belle', scene: 'wearing an iconic golden ball gown, standing in an enchanted castle ballroom with a magical glowing rose under a glass dome nearby. Looking at camera. Magical warm golden lighting. Floating golden particles.' },
  { file: 'pocahontas', scene: 'wearing a fringed tan dress with nature-inspired details, standing by a river in a lush autumn forest with colorful leaves. Looking at camera. Warm golden autumn light. Floating leaves and sparks.' },
  { file: 'red-riding-hood', scene: 'wearing a flowing red hooded cape over a white dress, walking through a misty dark forest path holding a basket. Looking at camera. Atmospheric forest light breaking through tall trees. Golden sparks drift.' },
  { file: 'sailor-moon', scene: 'wearing a white and blue sailor-style warrior outfit with a golden tiara and red ribbon bow, standing on a moonlit city rooftop. Looking at camera. Magical moonlight with sparkles and star effects.' },
  { file: 'anime-warrior', scene: 'as a fierce anime-style warrior, standing on a cliff edge with wind blowing. Wearing stylized battle armor with glowing accents and a katana sword. Looking at camera. Dramatic sunset with floating cherry blossoms.' },

  // ── Adventures ──
  { file: 'hogwarts-witch', scene: 'as a young witch student, standing in a grand magical library with floating candles and spell books. Wearing dark school robes with red and gold scarf, holding a glowing wand. Looking at camera. Warm candlelight. Magical sparkles.' },
  { file: 'dragon-rider', scene: 'as a dragon rider, sitting atop a massive dragon soaring above clouds. Wearing fur-lined leather armor with braided hair. Looking at camera. Epic golden hour lighting. Wind and sparks swirl.' },

  // ── Premium ──
  { file: 'astronaut', scene: 'as an astronaut, standing on the moon surface with Earth visible in the dark sky. Wearing detailed white space suit, helmet visor up. Looking at camera. Dramatic space lighting with Earth glow.' },
  { file: 'princess-queen', scene: 'as a royal queen, standing in a grand throne room wearing an ornate red velvet gown with golden crown and jeweled scepter. Looking at camera. Warm golden chandelier lighting. Floating golden dust.' },
  { file: 'fairy', scene: 'as a fairy godmother, standing in an enchanted moonlit garden with glowing flowers. Wearing a shimmering silver and lavender gown with translucent glowing wings. Looking at camera. Magical bioluminescent lighting. Sparkles everywhere.' },
  { file: 'samurai', scene: 'as a samurai warrior, standing in a bamboo forest at golden hour. Wearing elegant female samurai armor with katana sword. Looking at camera. Warm golden light filtering through bamboo. Floating petals.' },
  { file: 'horse-rider', scene: 'as an equestrian rider, sitting on a majestic white horse in a green meadow at golden hour. Wearing riding jacket, helmet, and boots. Looking at camera. Warm golden sunset lighting.' },
  { file: 'ballerina', scene: 'as a prima ballerina, standing on an elegant theater stage with spotlights. Wearing a beautiful white tutu and silk ballet shoes, in a graceful pose. Looking at camera. Dramatic warm stage lighting. Golden sparkles.' },
  { file: 'hip-hop-dancer', scene: 'as a hip hop dancer, standing mid-pose on a graffiti-covered urban stage. Wearing colorful streetwear, sneakers, cap tilted. Looking at camera. Neon and colored stage lighting. Floating confetti.' },
  { file: 'rock-star', scene: 'as a rock star, standing on a concert stage with spotlights and crowd silhouettes. Wearing leather jacket with band patches, holding an electric guitar. Looking at camera. Dramatic colored stage lighting.' },
  { file: 'surfer', scene: 'as a pro surfer, standing on a tropical beach holding a surfboard with a giant wave behind. Wearing wetsuit. Looking at camera. Golden sunset lighting with ocean spray sparkles.' },
  { file: 'chef', scene: 'as a chef, standing in a professional kitchen with flames rising from a pan. Wearing white chef coat and tall toque hat. Looking at camera. Warm amber kitchen lighting.' },
  { file: 'doctor', scene: 'as a doctor, standing in a modern hospital corridor. Wearing white coat with stethoscope around neck. Looking at camera. Clean blue-white hospital lighting.' },
  { file: 'scientist', scene: 'as a scientist, standing in a high-tech laboratory with glowing screens and colorful beakers. Wearing white lab coat and safety goggles on forehead. Looking at camera. Cool blue lab lighting.' },
  { file: 'cowgirl', scene: 'as a cowgirl, standing in a dusty Wild West town at sunset. Wearing fringed leather vest, cowgirl hat, and boots. Looking at camera. Warm golden sunset with dust particles.' },
  { file: 'gladiator', scene: 'as a gladiator warrior, standing in a grand colosseum arena. Wearing bronze chest armor with leather straps and flowing red cape. Looking at camera. Dramatic warm sunlight. Sand particles float.' },
  { file: 'race-driver', scene: 'as a race car driver, standing next to a sleek race car. Wearing colorful racing suit, holding helmet under arm. Looking at camera. Dramatic stadium lighting with sparks.' },
  { file: 'secret-agent', scene: 'as a secret agent, standing on a rooftop overlooking a city at night. Wearing sleek black suit with gadget bracelet. Looking at camera. Cinematic blue night lighting. City lights bokeh.' },
  { file: 'football-star', scene: 'as a football champion, standing on a stadium pitch mid-celebration. Wearing team jersey, holding a golden trophy. Looking at camera. Dramatic stadium floodlights. Confetti floating.' },
  { file: 'pirate', scene: 'as a pirate captain, standing on a treasure ship deck with treasure chests. Wearing pirate coat with bandana and boots. Looking at camera. Warm sunset ocean lighting. Golden particles.' },
  { file: 'knight', scene: 'as a knight in shining silver armor, standing before a grand castle at dawn. Holding a sword with a shield. Looking at camera. Golden sunrise backlighting. Floating dust.' },
  { file: 'ninja', scene: 'as a ninja warrior, standing on a moonlit Japanese rooftop with cherry blossoms. Wearing black ninja outfit with red accents and mask. Looking at camera. Moody moonlight. Pink petals floating.' },
];

async function generateOne(item, index) {
  const look = LOOKS[index % LOOKS.length];
  const prompt = `Cinematic photorealistic portrait of a ${look} ${item.scene}`;
  console.log(`[${index + 1}/${CHARS.length}] ${item.file}...`);
  try {
    const result = await fal.subscribe('fal-ai/flux-lora', {
      input: { prompt, num_images: 1, image_size: 'landscape_4_3', num_inference_steps: 28, guidance_scale: 3.5, enable_safety_checker: false },
      logs: false,
    });
    const imageUrl = result.data.images[0].url;
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFileAsync(join(OUT_DIR, `${item.file}.jpg`), buffer);
    console.log(`  OK`);
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
  }
}

mkdirSync(OUT_DIR, { recursive: true });

console.log(`Generating ${CHARS.length} GIRL thumbnails...`);
for (let i = 0; i < CHARS.length; i++) {
  await generateOne(CHARS[i], i);
}
console.log('Done!');
