import { fal } from '@fal-ai/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env.local') });
fal.config({ credentials: process.env.FAL_KEY });

const OUT_DIR = join(process.cwd(), 'public', 'characters', 'boys');

// Kid appearance variety — cycles through these
const LOOKS = [
  '8-year-old boy with short brown hair and light skin',
  '10-year-old boy with dark skin and short black hair',
  '7-year-old boy with olive skin and messy dark brown hair',
  '9-year-old boy with blonde hair and fair skin',
  '11-year-old chubby boy with red curly hair and freckles',
  '6-year-old boy with light brown skin and spiky black hair',
  '8-year-old boy with dark skin and a shaved head',
  '10-year-old boy with tan skin and wavy brown hair',
  '7-year-old boy with East Asian features and straight black hair',
  '9-year-old boy with sandy blonde hair and tanned skin',
  '11-year-old boy with dark curly hair and olive skin',
  '6-year-old boy with red hair, pale skin and freckles',
  '8-year-old boy with medium brown skin and tight curly hair',
  '10-year-old boy with straight black hair and light skin',
];

const CHARS = [
  // ── Core Heroes ──
  { file: 'spider-man', scene: 'as Spider-Man, mask off, standing on a rooftop ledge above a glowing city at dusk. Wearing detailed red and blue suit with web pattern. Looking at camera. Golden hour lighting. Floating sparks fill the air.' },
  { file: 'iron-man', scene: 'as Iron Man, helmet off, standing with one glowing repulsor raised. Wearing red and gold metallic suit with arc reactor glowing on chest. Looking at camera. Cinematic blue-orange lighting with sparks.' },
  { file: 'batman', scene: 'as Batman, cowl off, standing on a gothic rooftop with Bat-Signal in the sky. Wearing dark armored batsuit. Looking at camera. Moody blue-gray night lighting. Floating sparks in the air.' },
  { file: 'superman', scene: 'as Superman, standing tall on a mountain peak above clouds. Wearing blue suit with red cape flowing in the wind. Looking at camera. Warm golden sunlight. Floating sparks fill the air.' },
  { file: 'thor', scene: 'as Thor, standing on a rocky cliff gripping a glowing hammer with lightning crackling. Wearing Asgardian armor with red cape. Looking at camera. Dramatic stormy sky lighting. Floating sparks fill the air.' },
  { file: 'captain-america', scene: 'as Captain America, standing on a battlefield holding a vibranium shield. Wearing navy suit with star emblem. Looking at camera. Golden sunset backlighting. Floating sparks and dust particles.' },
  { file: 'hulk', scene: 'as Hulk, standing powerfully in a destroyed city street. Massive green muscular body, torn pants. Looking at camera. Dramatic sunset backlighting. Floating embers in the air.' },
  { file: 'the-flash', scene: 'as The Flash, standing mid-stride with lightning trails behind. Wearing red suit with golden lightning bolt emblem. Looking at camera. Dynamic blue-orange lighting. Electric sparks crackle around.' },
  { file: 'aquaman', scene: 'as Aquaman, standing on ocean rocks holding a golden trident, waves crashing behind. Wearing orange and green scale armor. Looking at camera. Stormy dramatic lighting.' },

  // ── Anime & Content (described as costumes, not character names) ──
  { file: 'dragon-ball-z', scene: 'as a powerful martial arts fighter, standing in a rocky desert with golden energy aura glowing around him. Wearing orange martial arts gi with blue undershirt and belt. Looking at camera. Dramatic golden energy lighting. Power particles swirl around.' },
  { file: 'vegeta', scene: 'as an elite warrior prince, standing with arms crossed on a rocky cliff. Wearing white and gold battle armor with blue bodysuit underneath. Looking at camera. Intense blue energy aura. Floating power sparks.' },
  { file: 'naruto', scene: 'as a young ninja warrior, standing on a tree branch in a misty forest. Wearing orange and black ninja outfit with metal headband on forehead. Looking at camera. Dramatic sunset lighting through trees. Floating leaves and sparks.' },
  { file: 'pokemon-trainer', scene: 'as a young monster trainer on an adventure, standing on a grassy hill at sunrise. Wearing red cap turned sideways, blue vest over black shirt, holding a red and white sphere. Looking at camera. Warm golden morning light.' },
  { file: 'avatar-navi', scene: 'with blue body paint and tribal glowing markings, standing in a bioluminescent alien forest at night. Wearing tribal outfit with beads. Looking at camera. Ethereal blue and purple lighting. Floating glowing particles.' },
  { file: 'avatar-airbender', scene: 'as a young air monk, standing on a mountain temple with clouds below. Wearing orange and yellow monk robes, with a blue arrow symbol painted on forehead. Looking at camera. Warm golden light. Wind and sparks swirl around.' },
  { file: 'harry-potter', scene: 'as a young wizard student, standing in a grand magical library with floating candles. Wearing dark school robes with red and gold scarf, holding a glowing wand. Looking at camera. Warm candlelight. Magical sparkles drift in the air.' },

  // ── Adventures ──
  { file: 'jack-sparrow', scene: 'as a pirate captain, standing on the deck of a pirate ship under a starry sky. Wearing weathered pirate coat, tricorn hat, beaded braids. Looking at camera. Moody lantern light. Floating golden dust particles.' },
  { file: 'aladdin', scene: 'as a street adventurer, standing on a magic carpet hovering above a moonlit Arabian city with domed palaces. Wearing white vest and baggy pants. Looking at camera. Warm moonlight and golden city glow.' },
  { file: 'peter-pan', scene: 'as a flying boy adventurer, hovering above moonlit London rooftops with Big Ben behind. Wearing green tunic and pointed hat with feather. Looking at camera. Magical moonlight glow. Fairy dust sparkles trail behind.' },
  { file: 'hercules', scene: 'as a young Greek hero, standing in an ancient arena with columns and torches. Wearing bronze armor with leather straps and red cape. Looking at camera. Warm golden torch lighting. Floating embers.' },
  { file: 'mowgli', scene: 'as a jungle boy, standing in a lush tropical jungle with ancient ruins. Wearing simple loincloth, wild messy hair. Looking at camera. Dappled golden sunlight through dense canopy. Floating jungle particles.' },
  { file: 'robin-hood', scene: 'as a forest archer hero, standing in a misty enchanted forest holding a bow. Wearing green hooded tunic with leather details and quiver of arrows. Looking at camera. Soft green forest light filtering through trees.' },
  { file: 'ninja-turtle', scene: 'as a young ninja warrior with a colored mask, standing in a neon-lit city alley at night. Wearing green armor-like outfit with a colored bandana mask. Looking at camera. Neon green and purple lighting. Floating sparks.' },
  { file: 'transformer', scene: 'as a powerful robot warrior, standing in a futuristic metallic landscape. Wearing red and blue robotic mech armor with glowing chest. Looking at camera. Cinematic blue and orange lighting. Sparks and energy crackle.' },
  { file: 'indiana-jones', scene: 'as a young adventurer explorer, standing in an ancient temple filled with golden artifacts. Wearing leather jacket, fedora hat, and carrying a whip. Looking at camera. Warm torchlight with dust particles floating.' },

  // ── Premium ──
  { file: 'astronaut', scene: 'as an astronaut, standing on the moon surface with Earth visible in the dark sky. Wearing detailed white space suit, helmet visor up. Looking at camera. Dramatic space lighting with Earth glow.' },
  { file: 'knight', scene: 'as a medieval knight in shining silver armor, standing before a grand castle at dawn. Holding a sword with a shield bearing a lion crest. Looking at camera. Golden sunrise backlighting. Floating dust particles.' },
  { file: 'prince-king', scene: 'as a young prince, standing in a grand throne room. Wearing royal velvet cape with golden crown and ornate tunic. Looking at camera. Warm golden chandelier lighting. Floating golden dust.' },
  { file: 'viking-dragon-rider', scene: 'as a viking dragon rider, sitting atop a massive dragon on a cliff at sunset. Wearing fur-lined leather armor with horned helmet. Looking at camera. Epic golden hour lighting with clouds.' },
  { file: 'kung-fu-master', scene: 'as a kung fu master, standing in a misty mountain temple courtyard. Wearing traditional Chinese martial arts outfit with black belt. Looking at camera. Soft morning mist lighting. Floating cherry blossom petals.' },
  { file: 'detective', scene: 'as a young detective, standing in a foggy London street at night under a gas lamp. Wearing long coat, deerstalker hat, holding a magnifying glass. Looking at camera. Moody atmospheric lighting.' },
  { file: 'pirate', scene: 'as a pirate captain on a treasure ship deck with treasure chests and gold coins. Wearing pirate coat with skull emblem, eyepatch, and bandana. Looking at camera. Warm sunset ocean lighting.' },
  { file: 'race-driver', scene: 'as a Formula 1 race driver, standing next to a sleek race car on a track. Wearing colorful racing suit with sponsor logos, holding helmet. Looking at camera. Dramatic stadium lighting.' },
  { file: 'football-star', scene: 'as a football champion, standing on a stadium pitch mid-celebration. Wearing team jersey with number 10, holding a golden trophy. Looking at camera. Dramatic stadium floodlights. Confetti floating.' },
  { file: 'secret-agent', scene: 'as a young secret agent, standing on a rooftop overlooking a city at night. Wearing sharp black suit with bow tie and gadget watch. Looking at camera. Cinematic blue night lighting. City lights bokeh.' },
  { file: 'samurai', scene: 'as a samurai warrior, standing in a bamboo forest at golden hour. Wearing traditional samurai armor with katana sword. Looking at camera. Warm golden light filtering through bamboo. Floating leaves.' },
  { file: 'cowboy', scene: 'as a cowboy, standing in a dusty Wild West town at sunset. Wearing leather vest, cowboy hat, and boots with spurs. Looking at camera. Warm golden sunset with dust particles in the air.' },
  { file: 'gladiator', scene: 'as a Roman gladiator, standing in a grand colosseum arena. Wearing bronze chest armor with leather straps, holding a gladius sword and shield. Looking at camera. Dramatic warm sunlight. Sand particles float.' },
  { file: 'motorcycle-rider', scene: 'as a motorcycle rider, standing next to a powerful motorcycle on a desert highway at sunset. Wearing leather jacket with patches, boots, and holding a helmet. Looking at camera. Warm sunset lighting.' },
  { file: 'surfer', scene: 'as a pro surfer, standing on a tropical beach holding a surfboard with a giant wave behind. Wearing board shorts and rash guard. Looking at camera. Golden sunset lighting with ocean spray.' },
  { file: 'viking', scene: 'as a fierce viking warrior, standing on the bow of a longship at sea. Wearing fur cloak, leather armor, and holding a battle axe. Looking at camera. Dramatic stormy ocean lighting. Sea spray particles.' },
  { file: 'horse-rider', scene: 'as a knight on horseback, sitting on a majestic horse in full gallop across a green field. Wearing light armor with a flowing cape. Looking at camera. Epic golden hour lighting.' },
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
    await writeFile(join(OUT_DIR, `${item.file}.jpg`), buffer);
    console.log(`  OK`);
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
  }
}

import { mkdirSync } from 'fs';
mkdirSync(OUT_DIR, { recursive: true });

console.log(`Generating ${CHARS.length} BOY thumbnails...`);
for (let i = 0; i < CHARS.length; i++) {
  await generateOne(CHARS[i], i);
}
console.log('Done!');
