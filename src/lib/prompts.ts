// ── Prompt Variations ─────────────────────────────────────────────────────────
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

// ── Character prompts (without trigger word and age — those are prepended) ───
// Template: "as {character}, {action + scene}. {outfit}. Looking at camera. {lighting}, 85mm lens, shallow depth of field."
const CHARACTER_PROMPTS: Record<string, string> = {
  // ── Superheroes ──
  'Spider-Man':
    'as Spider-Man, standing on a rooftop ledge above a glowing city at dusk, mask off. Wearing detailed red and blue suit with web pattern. Looking at camera. Golden hour lighting with city lights below, 85mm lens, shallow depth of field.',

  'Iron Man':
    'as Iron Man, standing with helmet off, one glowing repulsor raised. Wearing red and gold metallic suit with arc reactor glowing on chest. Looking at camera. Cinematic blue-orange lighting with sparks, 85mm lens, shallow depth of field.',

  'Captain America':
    'as Captain America, standing on a battlefield holding vibranium shield at his side. Wearing navy blue suit with star emblem and red stripes. Looking at camera. Golden sunset backlighting, 85mm lens, shallow depth of field.',

  'Thor':
    'as Thor, standing on a rocky cliff gripping Mjolnir with lightning crackling around it. Wearing Asgardian armor with red cape flowing behind. Looking at camera. Dramatic stormy sky lighting, 85mm lens, shallow depth of field.',

  'Doctor Strange':
    'as Doctor Strange, standing with glowing orange magical circles forming around hands. Wearing Cloak of Levitation with Eye of Agamotto. Looking at camera. Mystical warm golden lighting, 85mm lens, shallow depth of field.',

  'Superman':
    'as Superman, standing tall with fists at his sides on a mountain peak above clouds. Wearing blue suit with red cape flowing in the wind. Looking at camera. Warm golden sunlight from behind, 85mm lens, shallow depth of field.',

  'Batman':
    'as Batman, standing on a gothic rooftop with Bat-Signal glowing in the sky behind. Cowl off, wearing dark armored batsuit. Looking at camera. Moody blue-gray city night lighting, 85mm lens, shallow depth of field.',

  'The Flash':
    'as The Flash, standing mid-stride with lightning trails behind him on a city street. Wearing red suit with golden lightning bolt emblem. Looking at camera. Dynamic blue-orange speed effect lighting, 85mm lens, shallow depth of field.',

  'Green Arrow':
    'as Green Arrow, standing in a misty forest holding a bow with arrow drawn. Wearing green hooded suit with leather details. Looking at camera. Soft green forest light filtering through trees, 85mm lens, shallow depth of field.',

  'Black Panther':
    'as Black Panther, standing in a glowing Wakandan jungle, mask off. Wearing black vibranium suit with purple energy lines. Looking at camera. Bioluminescent purple and blue lighting, 85mm lens, shallow depth of field.',

  'Hulk':
    'as Hulk, standing powerfully in a destroyed city street with dust and embers floating. Massive green muscular body, torn pants. Looking at camera. Dramatic sunset backlighting with warm orange tones, 85mm lens, shallow depth of field.',

  'Aquaman':
    'as Aquaman, standing on ocean rocks holding a golden trident, waves crashing behind. Wearing orange and green scale armor. Looking at camera. Stormy dramatic lighting with ocean spray, 85mm lens, shallow depth of field.',

  'Wonder Woman':
    'as Wonder Woman, standing in ancient Greek temple ruins at golden hour. Wearing golden tiara, red and gold armor, blue skirt with stars, lasso at hip. Looking at camera. Warm golden light with dust particles, 85mm lens, shallow depth of field.',

  // ── Fantasy & Movies ──
  'Harry Potter':
    'as Harry Potter, standing in a grand magical library with floating candles and old books. Wearing Hogwarts robe with Gryffindor scarf, holding a wand. Looking at camera. Warm candlelight atmosphere, 85mm lens, shallow depth of field.',

  'Aladdin':
    'as Aladdin, standing on a magic carpet hovering above a moonlit Arabian city with domed palaces. Wearing white vest and baggy pants with red fez. Looking at camera. Warm moonlight and golden city glow, 85mm lens, shallow depth of field.',

  'Jack Sparrow':
    'as Jack Sparrow, standing on the deck of a pirate ship under a starry night sky. Wearing weathered pirate coat, tricorn hat, beaded braids. Looking at camera. Moody lantern light on deck, 85mm lens, shallow depth of field.',

  'Avatar':
    'as a Na\'vi Avatar, standing in a bioluminescent forest on Pandora at night. Blue skin with glowing patterns, tribal outfit. Looking at camera. Ethereal blue and purple bioluminescent lighting, 85mm lens, shallow depth of field.',

  'Dragon Rider':
    'as a dragon rider, sitting atop a massive dragon on a cliff edge with a vast landscape below. Wearing leather armor with dragon scale details. Looking at camera. Epic golden hour lighting with clouds, 85mm lens, shallow depth of field.',

  'Peter Pan':
    'as Peter Pan, hovering above moonlit London rooftops with Big Ben in the background. Wearing green tunic and pointed hat with feather, fairy dust trail. Looking at camera. Magical moonlight glow, 85mm lens, shallow depth of field.',

  // ── Professions ──
  'Pilot':
    'as a pilot, standing next to a modern jet on an airfield at sunrise. Wearing pilot uniform with patches, holding helmet under arm. Looking at camera. Warm sunrise lighting on tarmac, 85mm lens, shallow depth of field.',

  'Astronaut':
    'as an astronaut, standing on the moon surface with Earth visible in the dark sky behind. Wearing detailed white space suit, helmet visor up. Looking at camera. Dramatic space lighting with Earth glow, 85mm lens, shallow depth of field.',

  'Firefighter':
    'as a firefighter, standing in front of a blazing fire with embers floating in the air. Wearing yellow turnout coat and helmet. Looking at camera. Warm orange firelight on face, 85mm lens, shallow depth of field.',

  'Chef':
    'as a chef, standing in a professional kitchen with flames rising from a pan. Wearing white chef coat and tall toque hat, copper pots in background. Looking at camera. Warm amber kitchen lighting, 85mm lens, shallow depth of field.',

  'Police Officer':
    'as a police officer, standing by a patrol car at dusk in an urban street. Wearing dark blue uniform with badge and utility belt. Looking at camera. Red and blue light reflections, moody atmosphere, 85mm lens, shallow depth of field.',

  'Doctor':
    'as a doctor, standing in a modern hospital corridor with soft medical lighting. Wearing white coat with stethoscope around neck. Looking at camera. Clean blue-white hospital lighting, 85mm lens, shallow depth of field.',

  'Scientist':
    'as a scientist, standing in a high-tech laboratory with glowing screens and beakers. Wearing white lab coat and safety goggles on forehead. Looking at camera. Cool blue lab lighting with warm accent, 85mm lens, shallow depth of field.',

  'Teacher':
    'as a teacher, standing by a chalkboard covered in equations in a warm classroom. Wearing smart professional attire, holding chalk. Looking at camera. Warm golden light from tall windows, 85mm lens, shallow depth of field.',

  'Nurse':
    'as a nurse, standing in a modern hospital ward with soft warm lighting. Wearing teal medical scrubs with stethoscope. Looking at camera. Soft caring atmosphere lighting, 85mm lens, shallow depth of field.',

  'Engineer':
    'as an engineer, standing on a steel building framework at sunrise with city skyline below. Wearing hard hat and reflective vest, holding blueprints. Looking at camera. Golden sunrise with welding sparks nearby, 85mm lens, shallow depth of field.',

  'Veterinarian':
    'as a veterinarian, standing in a warm clinic gently holding a small puppy. Wearing scrubs with stethoscope. Looking at camera. Soft golden window light, 85mm lens, shallow depth of field.',

  'Artist':
    'as an artist, standing in a sunlit studio surrounded by large canvases. Wearing paint-splattered apron, holding palette and brush. Looking at camera. Golden afternoon light with colorful paint splashes, 85mm lens, shallow depth of field.',

  // ── Sports & Entertainment ──
  'Football Player':
    'as a football player, standing on a stadium pitch mid-celebration with arms raised. Wearing team jersey, shorts and cleats, stadium crowd blurred behind. Looking at camera. Dramatic stadium floodlights, 85mm lens, shallow depth of field.',

  'Basketball Player':
    'as a basketball player, standing on a polished indoor court holding a basketball. Wearing jersey and high-top sneakers, arena lights above. Looking at camera. Dramatic gym lighting with floor reflections, 85mm lens, shallow depth of field.',

  'Rock Singer':
    'as a rock singer, standing on a concert stage with spotlights and crowd silhouettes behind. Wearing leather jacket and band t-shirt, holding microphone. Looking at camera. Dramatic stage lighting with colored beams, 85mm lens, shallow depth of field.',

  // ── Fairy Tales ──
  'Cinderella':
    'as Cinderella, descending a grand marble staircase in a palace ballroom. Wearing shimmering light blue ball gown with glass slippers. Looking at camera. Magical golden sparkle lighting, 85mm lens, shallow depth of field.',

  'Snow White':
    'as Snow White, standing in an enchanted forest clearing with sunbeams breaking through. Wearing yellow and blue royal gown with red bow headband. Looking at camera. Soft fairytale golden light, 85mm lens, shallow depth of field.',

  'Little Red Riding Hood':
    'as Little Red Riding Hood, walking through a misty forest path holding a basket. Wearing flowing red hooded cape over white dress. Looking at camera. Atmospheric forest light breaking through trees, 85mm lens, shallow depth of field.',

  'Rapunzel':
    'as Rapunzel, standing at a tower window with long golden hair flowing down. Wearing purple dress, hundreds of floating lanterns rising in the twilight sky. Looking at camera. Warm lantern glow, 85mm lens, shallow depth of field.',

  'Pinocchio':
    'as Pinocchio, standing in an old Italian puppet workshop surrounded by wooden toys. Wearing Tyrolean hat and suspenders. Looking at camera. Warm candlelight atmosphere, 85mm lens, shallow depth of field.',

  'Beauty & the Beast':
    'as Belle, standing in an enchanted castle ballroom with a glowing rose under glass dome nearby. Wearing iconic golden ball gown. Looking at camera. Magical warm golden ballroom lighting, 85mm lens, shallow depth of field.',

  'The Little Mermaid':
    'as Ariel, sitting on rocks by the ocean shore at sunset with waves gently crashing. Wearing mermaid outfit with teal details. Looking at camera. Warm sunset ocean lighting with golden reflections, 85mm lens, shallow depth of field.',

  'Sleeping Beauty':
    'as Aurora, standing in an enchanted castle garden full of blooming roses. Wearing flowing pink and blue gown with golden crown. Looking at camera. Soft dreamy golden light, 85mm lens, shallow depth of field.',

  'Hansel & Gretel':
    'as Hansel, standing before a magical gingerbread house in a dark enchanted forest. Wearing Bavarian folk costume. Looking at camera. Warm magical glow from candy decorations, 85mm lens, shallow depth of field.',

  'Jack and the Beanstalk':
    'as Jack, climbing an enormous beanstalk high above the clouds. Wearing medieval peasant tunic. Looking at camera. Epic golden light above clouds, 85mm lens, shallow depth of field.',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MRLSSUBJ';

// ── Angle/composition per variation ──────────────────────────────────────────
const VARIATION_ANGLES: Record<PromptVariation, string> = {
  variation_a: 'full body shot',
  variation_b: 'upper body portrait, close framing',
};

// ── Build a full prompt for a single character + variation ─────────────────────
export function buildPrompt(params: {
  characterName: string;
  aiLabel: string;        // e.g. "5-year-old boy" from computeAiLabel()
  aiOverride?: string;    // admin global override
  loraTrigger?: string;   // per-order trigger word (falls back to LORA_TRIGGER)
  variation?: PromptVariation;
  customPrompt?: string;  // fully custom prompt (overrides everything)
}): string {
  if (params.customPrompt?.trim()) {
    return params.customPrompt.trim();
  }

  const trigger = params.loraTrigger?.trim() || LORA_TRIGGER;
  const angle = params.variation ? VARIATION_ANGLES[params.variation] : VARIATION_ANGLES.variation_a;

  const scene = CHARACTER_PROMPTS[params.characterName]
    ?? `${params.characterName}, in a cinematic ultra-realistic scene with dramatic lighting and golden sparks.`;

  const override = params.aiOverride?.trim()
    ? ` ${params.aiOverride.trim()}`
    : '';

  return `Cinematic portrait of ${trigger}, a ${params.aiLabel} ${scene} ${angle}.${override}`;
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
