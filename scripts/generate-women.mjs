import { fal } from '@fal-ai/client';
import { writeFile as writeFileAsync } from 'fs/promises';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env.local') });
fal.config({ credentials: process.env.FAL_KEY });

const OUT_DIR = join(process.cwd(), 'public', 'characters', 'women');

const LOOKS = [
  '25-year-old woman with long brown hair and light skin',
  '35-year-old woman with dark skin and braided black hair',
  '45-year-old woman with shoulder-length gray-streaked hair and olive skin',
  '55-year-old woman with short silver hair and warm dark skin',
  '65-year-old woman with white curly hair, wrinkles and kind smile',
  '30-year-old woman with blonde hair and fair skin',
  '40-year-old curvy woman with red hair and freckles',
  '50-year-old woman with salt-and-pepper bob and tan skin',
  '70-year-old elderly woman with white hair in a bun and glasses',
  '28-year-old woman with East Asian features and straight black hair',
  '38-year-old woman with curly dark hair and olive skin',
  '60-year-old woman with elegant silver hair and distinguished look',
  '33-year-old woman with wavy auburn hair and light brown skin',
  '48-year-old woman with short dark hair and warm expression',
  '72-year-old woman with deep smile lines, white hair and cheerful eyes',
  '27-year-old woman with long wavy blonde hair and tanned skin',
];

const CHARS = [
  // ── מקצועות (Professions) ──
  { file: 'bartender', scene: 'as a bartender, standing behind a luxurious bar shaking a cocktail. Wearing stylish black outfit with vest, bottles gleaming behind. Looking at camera. Warm moody bar lighting.' },
  { file: 'archaeologist', scene: 'as an archaeologist, standing in ancient ruins examining an artifact. Wearing khaki field outfit and hat. Looking at camera. Warm golden desert lighting.' },
  { file: 'yacht-captain', scene: 'as a yacht captain, standing at the helm of a luxury yacht on open ocean. Wearing white captain uniform. Looking at camera. Bright ocean sunlight.' },
  { file: 'chef', scene: 'as a gourmet chef, standing in a professional kitchen with flames from a pan. Wearing white chef coat and toque. Looking at camera. Warm amber kitchen lighting.' },
  { file: 'dj', scene: 'as a DJ, standing behind turntables at a nightclub with laser lights. Wearing headphones and stylish outfit. Looking at camera. Neon purple and blue lighting.' },
  { file: 'doctor', scene: 'as a doctor, standing in a modern hospital corridor. Wearing white coat with stethoscope. Looking at camera. Clean blue-white lighting.' },
  { file: 'pilot', scene: 'as a pilot, standing next to a jet on an airfield at sunrise. Wearing pilot uniform with cap. Looking at camera. Warm sunrise lighting.' },
  { file: 'photographer', scene: 'as a photographer, standing in a studio holding a camera. Wearing casual black outfit. Looking at camera. Dramatic studio lighting.' },
  { file: 'jazz-musician', scene: 'as a jazz singer, standing on a dimly lit stage holding a vintage microphone. Wearing elegant dress. Looking at camera. Warm smoky jazz club spotlight.' },
  { file: 'winemaker', scene: 'as a winemaker, standing in a wine cellar with oak barrels, holding a glass of red wine. Wearing elegant casual outfit. Looking at camera. Moody warm cellar lighting.' },
  { file: 'golf-pro', scene: 'as a golf professional, standing on a golf course holding a club. Wearing polo and visor. Looking at camera. Golden afternoon sunlight.' },
  { file: 'professor', scene: 'as a professor, standing in a lecture hall with chalkboard behind. Wearing smart blazer. Looking at camera. Warm academic lighting.' },
  { file: 'architect', scene: 'as an architect, standing at a drafting table with blueprints and building model. Wearing smart casual with glasses. Looking at camera. Modern office lighting.' },
  { file: 'race-driver', scene: 'as a race car driver, standing next to a sleek race car. Wearing colorful racing suit. Looking at camera. Dramatic track lighting.' },
  { file: 'mountain-climber', scene: 'as a mountain climber, standing on a snowy peak. Wearing climbing gear. Looking at camera. Epic mountain sunlight.' },
  { file: 'football-star', scene: 'as a football star, standing on a stadium pitch. Wearing team jersey, holding trophy. Looking at camera. Dramatic floodlights.' },
  { file: 'boxer', scene: 'as a boxer, standing in a boxing ring with gloves raised. Wearing boxing outfit. Looking at camera. Dramatic overhead ring lighting.' },
  { file: 'secret-agent', scene: 'as a secret agent, standing on a rooftop at night. Wearing sleek black suit. Looking at camera. Cinematic blue night lighting.' },
  { file: 'motorcycle-rider', scene: 'as a motorcycle rider, standing next to a motorcycle on a desert highway at sunset. Wearing leather jacket. Looking at camera. Warm sunset lighting.' },
  { file: 'surfer', scene: 'as a pro surfer, standing on a beach holding a surfboard with a wave behind. Wearing wetsuit. Looking at camera. Golden sunset.' },
  { file: 'fitness-trainer', scene: 'as a fitness trainer, standing in a gym holding dumbbells. Wearing athletic outfit. Looking at camera. Bright gym lighting.' },
  { file: 'barber', scene: 'as a hairstylist, standing in a modern salon holding scissors. Wearing stylish apron. Looking at camera. Warm salon lighting.' },
  { file: 'police-officer', scene: 'as a police officer, standing by a patrol car at dusk. Wearing dark blue uniform with badge. Looking at camera. Red and blue light reflections.' },
  { file: 'firefighter', scene: 'as a firefighter, standing before a blazing fire with embers. Wearing yellow turnout coat and helmet. Looking at camera. Warm orange firelight.' },
  { file: 'lawyer', scene: 'as a lawyer, standing in an elegant courtroom. Wearing sharp dark suit. Looking at camera. Warm formal lighting.' },

  // ── מדע בדיוני (Sci-Fi / Fantasy) ──
  { file: 'wonder-woman', scene: 'as Wonder Woman, standing in ancient Greek temple ruins at golden hour. Wearing golden tiara, red and gold armor, blue skirt with stars. Looking at camera. Warm golden light. Floating sparks.' },
  { file: 'captain-marvel', scene: 'as Captain Marvel, hovering with glowing fists and energy aura. Wearing red, blue and gold suit. Looking at camera. Cinematic cosmic lighting.' },
  { file: 'black-widow', scene: 'as Black Widow, standing on a rooftop at night. Wearing black tactical suit. Looking at camera. Moody blue-purple city lighting.' },
  { file: 'supergirl', scene: 'as Supergirl, standing on a mountain peak with cape flowing. Wearing blue suit with red cape and S emblem. Looking at camera. Warm golden sunlight.' },
  { file: 'batgirl', scene: 'as Batgirl, standing on a gothic rooftop with city lights. Wearing purple and black suit with bat cape. Looking at camera. Moody night lighting.' },
  { file: 'storm', scene: 'as Storm, floating mid-air with lightning crackling and white hair flowing. Wearing black and silver suit. Looking at camera. Dramatic stormy sky.' },
  { file: 'scarlet-witch', scene: 'as Scarlet Witch, standing with red magical energy swirling around hands. Wearing red outfit with crown headpiece. Looking at camera. Dramatic red magical lighting.' },
  { file: 'valkyrie', scene: 'as a Valkyrie warrior, standing on a cliff in Asgardian armor with sword and winged helmet. Looking at camera. Epic golden light. Floating sparks.' },
  { file: 'sumo-wrestler', scene: 'as a sumo wrestler, standing in a sumo ring in fighting stance. Wearing traditional mawashi. Looking at camera. Dramatic overhead lighting. Funny and endearing.' },
  { file: 'ballerina-funny', scene: 'in an absurdly over-the-top ballerina outfit on a grand theater stage, striking a dramatic diva pose with massive tutu. Looking at camera. Pink theatrical spotlight. Funny and glamorous.' },
  { file: 'drunk-pirate', scene: 'as a drunk pirate, leaning on a barrel on ship deck holding a rum bottle with a silly grin. Wearing messy pirate outfit. Looking at camera. Warm sunset ocean lighting.' },
  { file: 'cowgirl-mustache', scene: 'as a cowgirl with a comedically drawn-on mustache, standing in a Wild West saloon. Wearing cowgirl hat and fringed vest. Looking at camera. Warm sepia saloon lighting.' },
  { file: 'gladiator', scene: 'as a gladiator warrior, standing in a colosseum. Wearing bronze armor with red cape. Looking at camera. Dramatic warm sunlight.' },
  { file: 'viking', scene: 'as a viking shieldmaiden with braided hair, standing on a longship. Wearing fur cloak and leather armor with shield. Looking at camera. Dramatic stormy lighting.' },
  { file: 'samurai', scene: 'as a samurai warrior, standing in a bamboo forest at golden hour. Wearing elegant samurai armor with katana. Looking at camera. Warm golden bamboo light.' },
  { file: 'swat', scene: 'as a SWAT operator, standing in an urban scene. Wearing full black tactical gear with helmet. Looking at camera. Dramatic blue tactical lighting.' },
  { file: 'lara-croft', scene: 'as an adventurer explorer, standing in an ancient temple with artifacts. Wearing tactical outfit with dual holsters. Looking at camera. Warm torchlight.' },
  { file: 'spy', scene: 'as a glamorous spy, standing in a casino in an elegant evening gown. Looking at camera. Glamorous golden casino lighting.' },
  { file: 'pirate-captain', scene: 'as a pirate captain, standing on ship deck. Wearing elegant pirate coat with feathered hat. Looking at camera. Moody lantern light.' },
  { file: 'robin-hood', scene: 'as Robin Hood, standing in a misty forest with bow. Wearing green hooded tunic. Looking at camera. Soft forest light.' },
  { file: 'kung-fu-master', scene: 'as a kung fu master, standing in a mountain temple. Wearing traditional martial arts outfit. Looking at camera. Morning mist lighting.' },
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
console.log(`Generating ${CHARS.length} WOMEN thumbnails...`);
for (let i = 0; i < CHARS.length; i++) {
  await generateOne(CHARS[i], i);
}
console.log('Done!');
