import { fal } from '@fal-ai/client';
import { writeFile as writeFileAsync } from 'fs/promises';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env.local') });
fal.config({ credentials: process.env.FAL_KEY });

const OUT_DIR = join(process.cwd(), 'public', 'characters', 'men');

const LOOKS = [
  '25-year-old man with short brown hair and light skin',
  '35-year-old man with dark skin and short black hair and trimmed beard',
  '45-year-old man with gray temples, olive skin and stubble',
  '55-year-old man with bald head, thick gray beard and dark skin',
  '65-year-old man with white hair, wrinkles and kind eyes',
  '30-year-old man with blonde hair and fair skin',
  '40-year-old chubby man with red beard and freckles',
  '50-year-old man with salt-and-pepper hair and tan skin',
  '70-year-old elderly man with white beard and glasses',
  '28-year-old man with East Asian features and black hair',
  '38-year-old muscular man with shaved head and olive skin',
  '60-year-old man with silver hair, mustache and distinguished look',
  '33-year-old man with curly dark hair and light brown skin',
  '48-year-old man with receding hairline and warm smile',
  '72-year-old man with deep wrinkles, white bushy eyebrows and cheerful expression',
  '27-year-old man with sandy blonde messy hair and tanned skin',
];

const CHARS = [
  // ── מקצועות (Professions) ──
  { file: 'bartender', scene: 'as a bartender, standing behind a luxurious bar shaking a cocktail. Wearing vest and bow tie, bottles and glasses gleaming behind. Looking at camera. Warm moody bar lighting with amber tones.' },
  { file: 'archaeologist', scene: 'as an archaeologist, standing in ancient ruins examining an artifact. Wearing khaki field outfit and hat, dusty surroundings. Looking at camera. Warm golden desert lighting.' },
  { file: 'yacht-captain', scene: 'as a yacht captain, standing at the helm of a luxury yacht on open ocean. Wearing white captain uniform with gold trim. Looking at camera. Bright ocean sunlight with blue water.' },
  { file: 'chef', scene: 'as a gourmet chef, standing in a professional kitchen with flames rising from a pan. Wearing white chef coat and tall toque. Looking at camera. Warm amber kitchen lighting.' },
  { file: 'dj', scene: 'as a DJ, standing behind turntables at a massive nightclub with colorful laser lights. Wearing headphones around neck, stylish outfit. Looking at camera. Neon purple and blue club lighting.' },
  { file: 'doctor', scene: 'as a doctor, standing in a modern hospital corridor. Wearing white coat with stethoscope. Looking at camera. Clean blue-white hospital lighting.' },
  { file: 'pilot', scene: 'as a pilot, standing next to a commercial jet on an airfield at sunrise. Wearing pilot uniform with cap and epaulettes. Looking at camera. Warm sunrise lighting.' },
  { file: 'photographer', scene: 'as a photographer, standing in a studio holding a professional camera. Wearing casual black outfit. Looking at camera. Dramatic studio lighting with softboxes visible.' },
  { file: 'jazz-musician', scene: 'as a jazz musician, standing on a dimly lit stage holding a saxophone. Wearing sharp suit and fedora. Looking at camera. Warm smoky jazz club lighting with spotlight.' },
  { file: 'winemaker', scene: 'as a winemaker, standing in a dark wine cellar surrounded by oak barrels, holding a glass of red wine up to the light. Wearing casual elegant blazer. Looking at camera. Moody warm cellar lighting.' },
  { file: 'golf-pro', scene: 'as a golf professional, standing on a pristine golf course holding a club. Wearing polo shirt and cap. Looking at camera. Golden afternoon sunlight on green grass.' },
  { file: 'professor', scene: 'as a university professor, standing in a grand lecture hall with chalkboard behind. Wearing tweed jacket with elbow patches. Looking at camera. Warm academic lighting.' },
  { file: 'architect', scene: 'as an architect, standing at a drafting table with blueprints and a modern building model. Wearing smart casual outfit with glasses. Looking at camera. Clean modern office lighting.' },
  { file: 'race-driver', scene: 'as a Formula 1 driver, standing next to a sleek race car. Wearing colorful racing suit, holding helmet. Looking at camera. Dramatic track lighting.' },
  { file: 'mountain-climber', scene: 'as a mountain climber, standing on a snowy peak with vast mountain range behind. Wearing climbing gear and harness. Looking at camera. Epic bright mountain sunlight.' },
  { file: 'football-star', scene: 'as a football champion, standing on a stadium pitch. Wearing team jersey, holding golden trophy. Looking at camera. Dramatic floodlights with confetti.' },
  { file: 'boxer', scene: 'as a boxer, standing in a boxing ring corner with gloves raised. Wearing boxing shorts and wraps, sweating. Looking at camera. Dramatic overhead ring lighting.' },
  { file: 'secret-agent', scene: 'as a secret agent, standing on a rooftop overlooking a city at night. Wearing sharp black suit with bow tie. Looking at camera. Cinematic blue night lighting.' },
  { file: 'motorcycle-rider', scene: 'as a motorcycle rider, standing next to a powerful motorcycle on a desert highway at sunset. Wearing leather jacket. Looking at camera. Warm sunset lighting.' },
  { file: 'surfer', scene: 'as a pro surfer, standing on a tropical beach holding a surfboard with a giant wave behind. Wearing board shorts. Looking at camera. Golden sunset with ocean spray.' },
  { file: 'fitness-trainer', scene: 'as a fitness trainer, standing in a modern gym holding dumbbells. Wearing athletic tank top, muscular build. Looking at camera. Bright gym lighting.' },
  { file: 'barber', scene: 'as a barber, standing in a vintage barbershop holding scissors and comb. Wearing apron, tattoos visible. Looking at camera. Warm retro lighting with mirrors.' },
  { file: 'police-officer', scene: 'as a police officer, standing by a patrol car at dusk. Wearing dark blue uniform with badge. Looking at camera. Red and blue light reflections.' },
  { file: 'firefighter', scene: 'as a firefighter, standing in front of a blazing fire with embers floating. Wearing yellow turnout coat and helmet. Looking at camera. Warm orange firelight.' },
  { file: 'lawyer', scene: 'as a lawyer, standing in an elegant courtroom with wooden paneling. Wearing sharp dark suit with tie. Looking at camera. Warm formal lighting.' },

  // ── מדע בדיוני (Sci-Fi / Fantasy) ──
  { file: 'superman', scene: 'as Superman, standing tall on a mountain peak above clouds. Wearing blue suit with red cape flowing. Looking at camera. Warm golden sunlight. Floating sparks fill the air.' },
  { file: 'batman', scene: 'as Batman, cowl off, standing on a gothic rooftop with Bat-Signal in the sky. Wearing dark armored batsuit. Looking at camera. Moody blue-gray night lighting.' },
  { file: 'spider-man', scene: 'as Spider-Man, mask off, standing on a rooftop above a glowing city at dusk. Wearing red and blue suit. Looking at camera. Golden hour lighting.' },
  { file: 'iron-man', scene: 'as Iron Man, helmet off, standing with one glowing repulsor raised. Wearing red and gold metallic suit. Looking at camera. Cinematic blue-orange lighting with sparks.' },
  { file: 'thor', scene: 'as Thor, standing on a cliff gripping a glowing hammer with lightning. Wearing Asgardian armor with red cape. Looking at camera. Dramatic stormy sky.' },
  { file: 'captain-america', scene: 'as Captain America, standing on a battlefield holding vibranium shield. Wearing navy suit with star emblem. Looking at camera. Golden sunset backlighting.' },
  { file: 'hulk', scene: 'as Hulk, standing powerfully in a destroyed city. Massive green muscular body, torn pants. Looking at camera. Dramatic sunset with embers.' },
  { file: 'aquaman', scene: 'as Aquaman, standing on ocean rocks holding golden trident, waves crashing. Wearing orange and green armor. Looking at camera. Stormy dramatic lighting.' },
  { file: 'the-flash', scene: 'as The Flash, standing with lightning trails behind. Wearing red suit with golden lightning bolt. Looking at camera. Dynamic blue-orange lighting.' },
  { file: 'sumo-wrestler', scene: 'as a sumo wrestler, standing in a traditional sumo ring. Wearing mawashi loincloth, massive build, in fighting stance. Looking at camera. Dramatic overhead lighting.' },
  { file: 'male-ballerina', scene: 'as a male ballerina, standing on a theater stage in a white tutu and ballet shoes, striking a dramatic pose. Looking at camera. Warm spotlight with pink theatrical lighting. Funny and endearing.' },
  { file: 'drunk-pirate', scene: 'as a drunk pirate, leaning on a barrel on a ship deck holding a rum bottle, silly grin. Wearing messy pirate outfit with crooked hat. Looking at camera. Warm sunset ocean lighting.' },
  { file: 'cowboy-mustache', scene: 'as a cowboy with an absurdly giant handlebar mustache, standing in a Wild West saloon. Wearing cowboy hat and leather vest. Looking at camera. Warm sepia-toned saloon lighting.' },
  { file: 'gladiator', scene: 'as a Roman gladiator, standing in a grand colosseum. Wearing bronze armor with leather sandals. Looking at camera. Dramatic warm sunlight.' },
  { file: 'viking', scene: 'as a viking with long braided hair and beard, standing on a longship at sea. Wearing fur cloak and leather armor, holding battle axe. Looking at camera. Dramatic stormy lighting.' },
  { file: 'samurai', scene: 'as a samurai warrior, standing in a bamboo forest at golden hour. Wearing traditional samurai armor with katana. Looking at camera. Warm golden light through bamboo.' },
  { file: 'swat', scene: 'as a SWAT operator, standing in an urban tactical scene. Wearing full black tactical gear with helmet and visor. Looking at camera. Dramatic blue tactical lighting.' },
  { file: 'indiana-jones', scene: 'as an adventurer, standing in an ancient temple with golden artifacts. Wearing leather jacket and fedora, carrying a whip. Looking at camera. Warm torchlight.' },
  { file: 'james-bond', scene: 'as a suave spy, standing in a casino next to a poker table. Wearing perfectly tailored tuxedo with bow tie. Looking at camera. Glamorous golden casino lighting.' },
  { file: 'jack-sparrow', scene: 'as a pirate captain, standing on a ship deck under starry sky. Wearing weathered pirate coat, tricorn hat, beaded braids. Looking at camera. Moody lantern light.' },
  { file: 'robin-hood', scene: 'as Robin Hood, standing in a misty forest holding a bow. Wearing green hooded tunic with leather details. Looking at camera. Soft forest light.' },
  { file: 'kung-fu-master', scene: 'as a kung fu master, standing in a misty mountain temple. Wearing traditional martial arts outfit. Looking at camera. Soft morning mist lighting.' },
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
console.log(`Generating ${CHARS.length} MEN thumbnails...`);
for (let i = 0; i < CHARS.length; i++) {
  await generateOne(CHARS[i], i);
}
console.log('Done!');
