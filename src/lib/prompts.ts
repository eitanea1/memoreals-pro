// ── Prompt Variations ─────────────────────────────────────────────────────────
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

// ── Winning prompt formula ─────────────────────────────────────────────────────
// Reverse-engineered from the proven manual fal runs (Wonder Woman / Iron Man /
// Batgirl) that produced rich cinematic, magical results at scale 1.0.
//
// Final prompt shape:
//   "An ultra-realistic photographic portrait of {trigger}, a {aiLabel} fully
//    transformed into a real-life {SCENE}. {MAGIC_GLOW} {QUALITY_TAIL} {angle}{override}"
//
// Each CHARACTER_PROMPTS entry is the {SCENE} — it MUST start with the character
// noun (NOT with "a/an", because "a real-life " already precedes it) and pack the
// vivid environment + detailed costume + prop. The scene leads so it overpowers
// the LoRA's indoor bias (otherwise enclosed scenes revert to "a kid's room").
// Phrasing is gender-neutral (no he/she) so shared names (Chef, Samurai, …) work
// for boys, girls, men and women — gender comes from {aiLabel}.

// Shared "magic layer" — adds the glow/sparkle/bokeh feel to every character.
const MAGIC_GLOW =
  'Glowing magical light particles and sparkling embers drift through the air, ' +
  'a subtle shimmering magical aura, dreamy glowing bokeh and soft ethereal light bloom, ' +
  'dramatic cinematic lighting.';

// Shared quality/realism tail.
const QUALITY_TAIL =
  'Hyper-detailed and photorealistic, cinematic movie-poster quality. make it realistic and magical.';

// ── Character scenes (costume + environment + prop) ─────────────────────────────
const CHARACTER_PROMPTS: Record<string, string> = {
  // ── Superheroes (shared boys / girls / men / women) ──
  'Spider-Man':
    'Spider-Man with the mask off and face fully visible, crouched in a dynamic pose on a skyscraper ledge above a glowing city at dusk, wearing an ultra-realistic red and blue suit with intricate black webbing detail',
  'Iron Man':
    'Iron Man with the helmet off and face fully visible, hovering in a powerful flight pose above a futuristic neon city skyline at night, wearing an ultra-realistic glowing red and gold armored suit with a bright arc reactor on the chest',
  'Batman':
    'Batman with the cowl pulled back so the face is fully visible, standing on a gothic rooftop with the glowing Bat-Signal lighting the night sky, wearing an ultra-realistic dark armored batsuit with a flowing cape',
  'Superman':
    'Superman standing tall in a heroic pose on a mountain peak above the clouds at golden hour, wearing an ultra-realistic blue suit with the iconic chest emblem and a red cape flowing in the wind',
  'Thor':
    'Thor standing on a rocky cliff gripping the glowing hammer Mjolnir crackling with blue lightning, wearing ultra-realistic Asgardian armor with a flowing red cape under a dramatic stormy sky',
  'Captain America':
    'Captain America standing in a strong heroic stance on a dark rubble-strewn battlefield at dusk, holding the iconic glowing vibranium shield, wearing an ultra-realistic rugged blue tactical suit with a metallic star emblem',
  'Hulk':
    'the Hulk, a massive muscular green-skinned hero with the face fully visible and recognizable, standing powerfully in a destroyed city street at sunset, wearing torn purple shorts',
  'The Flash':
    'the Flash in a dynamic running pose with glowing electric lightning trails on a city street at night, wearing an ultra-realistic red suit with a glowing golden lightning emblem',
  'Aquaman':
    'Aquaman standing on ocean rocks holding a glowing golden trident with waves crashing behind under a dramatic sky, wearing ultra-realistic green and gold scale armor',
  'Wonder Woman':
    'Wonder Woman standing confidently in a strong heroic pose on an ancient battlefield at golden sunrise, holding a glowing Lasso of Truth, wearing intricately detailed gold and red armor that gleams with polished metallic highlights',
  'Captain Marvel':
    'Captain Marvel hovering in a powerful pose with glowing cosmic energy radiating from the hands, against a starry cosmic sky, wearing an ultra-realistic red, blue and gold suit glowing with energy',
  'Black Widow':
    'Black Widow in a confident action pose in a moody industrial setting at night, wearing an ultra-realistic sleek black tactical suit with utility belts',
  'Batgirl':
    'Batgirl standing confidently in a heroic pose on a gothic city rooftop at night with the glowing Bat-Signal lighting up the dark sky, wearing a sleek intricately detailed black batsuit with a glowing yellow bat emblem, a flowing dark cape and utility belt, the cowl pulled back so the face is fully visible',
  'Storm':
    'Storm floating in mid-air with glowing white eyes and crackling lightning in a dramatic stormy sky, wearing an ultra-realistic sleek black suit with a flowing cape, hair billowing in the wind',
  'Supergirl':
    'Supergirl flying in a heroic pose above a glowing city skyline at golden hour, wearing an ultra-realistic blue suit with the iconic emblem and a red cape',
  'Scarlet Witch':
    'the Scarlet Witch in a powerful pose with glowing crimson magic energy swirling around the hands, in a dark mystical setting, wearing an ultra-realistic red coat and crimson headpiece',
  'Valkyrie':
    'an Asgardian Valkyrie warrior standing on a misty battlefield holding a glowing sword, wearing ultra-realistic blue and silver armor with a flowing cape',

  // ── Boys anime ──
  'Dragon Ball Z Fighter':
    'a Super Saiyan fighter from Dragon Ball Z in a powerful pose with glowing golden spiky hair and a blazing golden aura of energy, on a rocky battlefield, wearing an orange and blue martial-arts gi',
  'Vegeta Dragon Ball':
    'Vegeta from Dragon Ball in a proud powerful stance with a glowing blue aura of energy and spiky black hair, wearing ultra-realistic blue and white Saiyan battle armor',
  'Naruto Ninja':
    'a Naruto-style ninja in a dynamic pose with glowing chakra energy swirling, in a hidden ninja village at dusk, wearing an ultra-realistic orange and black ninja outfit with a headband',
  'Pokemon Trainer':
    'a Pokemon trainer standing confidently in a grassy field at sunrise holding a glowing Poke Ball, wearing an ultra-realistic cap, jacket and backpack',
  'Avatar Navi':
    "a tall blue-skinned Na'vi from Pandora with the face fully visible, standing in a glowing bioluminescent jungle at night, wearing tribal Na'vi attire with beads",
  'Avatar Airbender':
    'an airbending master in a dynamic pose with swirling glowing air currents and blue arrow tattoos, on a mountaintop temple, wearing ultra-realistic orange and yellow air-nomad robes',
  'Harry Potter':
    'a young wizard in a grand magical Hogwarts library with floating glowing candles, holding a glowing magic wand, wearing an ultra-realistic Hogwarts robe with a Gryffindor scarf',

  // ── Adventures (shared) ──
  'Jack Sparrow':
    'a charismatic pirate captain in the style of Jack Sparrow on the deck of a pirate ship under a starry night sky, wearing an ultra-realistic weathered pirate coat, tricorn hat and beaded braids',
  'Aladdin':
    'Aladdin on a flying magic carpet hovering above a moonlit Arabian city with domed palaces, wearing an ultra-realistic embroidered vest and baggy pants',
  'Peter Pan':
    'Peter Pan hovering above moonlit London rooftops with Big Ben in the background and a glowing fairy-dust trail, wearing an ultra-realistic green tunic and feathered cap',
  'Hercules':
    'the legendary hero Hercules in a powerful heroic pose at an ancient Greek temple at golden hour, wearing ultra-realistic bronze and leather armor',
  'Mowgli':
    'Mowgli standing in a lush glowing jungle at dawn beside a friendly wolf, surrounded by fireflies, wearing a simple red loincloth',
  'Robin Hood':
    'Robin Hood drawing a bow with an arrow in a misty enchanted forest, wearing an ultra-realistic green hooded tunic with leather details',
  'Ninja Turtle Fighter':
    'a heroic ninja-turtle warrior in a dynamic action pose in a neon-lit city alley at night, wearing a colored eye mask and ninja gear with weapons',
  'Optimus Prime':
    'a giant heroic Transformer robot in the style of Optimus Prime standing in a futuristic city with glowing blue eyes, ultra-realistic red and blue metallic armor plating',
  'Indiana Jones':
    'an adventurous archaeologist explorer in the style of Indiana Jones in an ancient torch-lit temple ruin, holding a whip, wearing an ultra-realistic leather jacket and fedora',
  'James Bond':
    'a suave secret agent in the style of James Bond in a sleek black tuxedo at a glamorous casino at night, holding a pistol, dramatic moody lighting',
  'Drunk Pirate':
    'a jolly tipsy pirate with a comedic grin stumbling on a tavern ship deck holding a bottle, wearing an ultra-realistic weathered pirate coat and hat',
  'Lara Croft':
    'an adventurous explorer in the style of Lara Croft in an ancient jungle temple, holding dual pistols, wearing a tank top and cargo shorts with adventure gear',
  'Spy':
    'a sleek elegant spy in a glamorous gown at a high-society event at night, dramatic moody lighting, holding a small concealed pistol',
  'Pirate Captain':
    'a bold pirate captain at the helm of a ship under a dramatic stormy sky, wearing an ultra-realistic ornate pirate coat and feathered hat',

  // ── Boys premium ──
  'Astronaut':
    "an astronaut standing on the moon's surface with Earth glowing in the dark starry sky behind, wearing an ultra-realistic detailed white space suit with the helmet visor up",
  'Medieval Knight':
    'a medieval knight in shining silver plate armor standing in a grand castle courtyard at golden hour, holding a gleaming sword',
  'Prince King':
    'a royal prince in a grand palace throne room, wearing an ultra-realistic ornate royal outfit with a golden crown and a regal cape',
  'Viking Dragon Rider':
    'a young Viking dragon rider standing on a cliff beside a majestic dragon at golden hour, wearing ultra-realistic leather and fur armor with dragon-scale details',
  'Kung Fu Master':
    'a kung fu master in a powerful martial-arts stance in a misty ancient temple courtyard at dawn, wearing an ultra-realistic traditional martial-arts robe',
  'Sherlock Detective':
    'a clever detective in the style of Sherlock Holmes on a foggy Victorian London street at night, holding a magnifying glass, wearing an ultra-realistic tweed coat and cap',
  'Race Driver':
    'a race-car driver standing confidently beside a sleek formula race car on a track, holding a helmet, wearing an ultra-realistic racing suit covered in sponsor patches',
  'Football Champion':
    'a football champion celebrating on a stadium pitch under bright floodlights with confetti falling, wearing an ultra-realistic team jersey',
  'Secret Agent':
    'a sharp secret agent in a sleek black tuxedo in a glamorous casino at night, holding a pistol, dramatic moody lighting',
  'Samurai Warrior':
    'a samurai warrior in a blossoming cherry-blossom courtyard holding a gleaming katana, wearing ultra-realistic traditional samurai armor',
  'Cowboy':
    'a cowboy standing in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots',
  'Roman Gladiator':
    'a Roman gladiator standing in a sunlit Colosseum arena with dust in the air, holding a sword and shield, wearing ultra-realistic leather and bronze armor',
  'Motorcycle Rider':
    'a cool motorcycle rider beside a powerful motorcycle on a neon-lit city street at night, wearing an ultra-realistic black leather riding jacket',
  'Pro Surfer':
    'a pro surfer standing on the beach at golden sunset holding a tall surfboard upright beside them, big ocean waves breaking behind, wearing a wetsuit, water droplets glistening',
  'Viking Berserker':
    'a fierce Viking warrior on a rugged northern shore with stormy seas, holding a battle axe, wearing ultra-realistic fur cloak and iron armor with braided hair',
  'Horse Rider Knight':
    'a knight riding a majestic horse galloping through a grand field at golden hour, wearing ultra-realistic armor',

  // ── Girls — princesses & fairy tales ──
  'Cinderella':
    'Cinderella on a grand marble staircase inside a magnificent palace ballroom with golden chandeliers and ornate columns, wearing an exquisitely detailed shimmering light-blue ball gown with layered tulle and sparkling glass slippers, hair in an elegant updo',
  'Snow White':
    'Snow White in an enchanted sunlit forest clearing with birds and deer, wearing an ultra-realistic yellow and blue royal gown with a red bow headband',
  'Rapunzel':
    'Rapunzel at a tower window with long flowing golden hair, hundreds of glowing floating lanterns rising into the twilight sky, wearing an ultra-realistic purple dress',
  'Elsa Frozen':
    'Elsa from Frozen inside a vast glowing ice palace with towering frozen crystal pillars and shimmering frost-covered walls, glowing frost magic swirling from the hands, wearing a sparkling ice-blue gown and a long flowing translucent cape glowing with magical light, platinum-blonde hair in a side braid',
  'Moana':
    'Moana on a tropical beach at golden sunset with ocean waves curling behind, long dark wavy hair flowing, wearing an ultra-realistic red and tan island outfit with a shell necklace',
  'Mulan':
    'Mulan in a blossoming pink cherry-blossom courtyard, wearing an ultra-realistic elegant traditional Hanfu robe with an ornate hair ornament',
  'Ariel Little Mermaid':
    'Ariel the little mermaid sitting on ocean rocks at sunset with waves gently crashing, long flowing red hair, wearing an ultra-realistic mermaid outfit with a teal sequined tail',
  'Aurora Sleeping Beauty':
    'Princess Aurora in an enchanted castle garden full of blooming roses, long blonde hair, wearing an ultra-realistic flowing pink gown with a golden crown',
  'Belle Beauty Beast':
    'Belle in an enchanted castle ballroom with a glowing magical rose under a glass dome, hair in an elegant updo, wearing an ultra-realistic iconic golden ball gown',
  'Pocahontas':
    'Pocahontas on a cliff above a forest river at golden hour with wind swirling autumn leaves, long black flowing hair, wearing an ultra-realistic tan buckskin dress with a turquoise necklace',
  'Little Red Riding Hood':
    'Little Red Riding Hood on a misty enchanted forest path holding a basket, wearing an ultra-realistic flowing red hooded cape over a white dress',
  'Sailor Moon':
    'a Sailor Moon-style magical girl in a dynamic pose with glowing crescent-moon magic and sparkles, against a starry night sky, wearing an ultra-realistic sailor-style uniform with a red bow',
  'Anime Warrior Girl':
    'an anime warrior girl in a dynamic pose with glowing energy on a dramatic battlefield, wearing ultra-realistic stylized fantasy armor',

  // ── Girls adventures ──
  'Hogwarts Witch':
    'a young witch in a grand magical Hogwarts library with floating glowing candles, holding a glowing wand, wearing an ultra-realistic Hogwarts robe with a house scarf',
  'Dragon Rider Girl':
    'a young dragon rider on a cliff beside a majestic dragon at golden hour, wearing ultra-realistic leather armor with dragon-scale details',

  // ── Girls premium ──
  'Astronaut Girl':
    "an astronaut standing on the moon's surface with Earth glowing in the dark starry sky behind, wearing an ultra-realistic detailed white space suit with the helmet visor up",
  'Princess Queen':
    'a regal princess queen on an ornate golden throne in a grand palace hall, wearing an ultra-realistic luxurious royal gown with a golden crown and jewels',
  'Fairy Godmother':
    'a magical fairy with glowing translucent wings in an enchanted glowing forest at night, holding a sparkling magic wand, surrounded by fairy dust, wearing a shimmering gown',
  'Samurai Girl':
    'a samurai warrior in a blossoming cherry-blossom courtyard holding a gleaming katana, wearing ultra-realistic traditional samurai armor',
  'Horse Rider Girl':
    'an equestrian rider on a majestic horse galloping through a grand field at golden hour, wearing ultra-realistic equestrian attire',
  'Ballerina':
    'a graceful ballerina mid-pose on a grand theater stage under a soft glowing spotlight, wearing an ultra-realistic elegant tutu',
  'Hip Hop Dancer':
    'a cool hip hop dancer in a dynamic pose on a neon-lit urban street at night, wearing ultra-realistic stylish streetwear',
  'Rock Star Girl':
    'a rock star on a concert stage with dramatic spotlights and crowd silhouettes, holding a microphone, wearing an ultra-realistic leather jacket',
  'Pro Surfer Girl':
    'a pro surfer standing on the beach at golden sunset holding a tall surfboard upright beside them, big ocean waves breaking behind, wearing a wetsuit, water droplets glistening',
  'Chef Girl':
    "a chef in a professional kitchen with flames rising from a pan, wearing an ultra-realistic white chef's coat and tall toque hat",
  'Doctor Girl':
    'a doctor in a modern hospital corridor, wearing an ultra-realistic white coat with a stethoscope around the neck',
  'Scientist Girl':
    'a scientist in a high-tech laboratory with glowing screens and beakers, wearing an ultra-realistic white lab coat and safety goggles',
  'Cowgirl':
    'a cowgirl in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots',
  'Gladiator Girl':
    'a gladiator standing in a sunlit Colosseum arena with dust in the air, holding a sword and shield, wearing ultra-realistic leather and bronze armor',
  'Race Driver Girl':
    'a race-car driver standing confidently beside a sleek formula race car on a track, holding a helmet, wearing an ultra-realistic racing suit covered in sponsor patches',
  'Secret Agent Girl':
    'a sharp secret agent in an elegant outfit at a glamorous casino at night, holding a pistol, dramatic moody lighting',
  'Football Star Girl':
    'a football star celebrating on a stadium pitch under bright floodlights with confetti falling, wearing an ultra-realistic team jersey',
  'Pirate Girl':
    'a bold pirate captain at the helm of a ship under a dramatic stormy sky, wearing an ultra-realistic ornate pirate coat and feathered hat',
  'Knight Girl':
    'a knight in shining silver plate armor standing in a grand castle courtyard at golden hour, holding a gleaming sword',
  'Ninja Girl':
    'a ninja in a dynamic stealth pose on a moonlit rooftop at night, holding a katana, wearing an ultra-realistic black ninja outfit',

  // ── Professions (shared men / women) ──
  'Chef':
    "a chef in a professional kitchen with flames rising from a pan, wearing an ultra-realistic white chef's coat and tall toque hat",
  'Doctor':
    'a doctor in a modern hospital corridor, wearing an ultra-realistic white coat with a stethoscope around the neck',
  'Pilot':
    'an airline pilot beside a modern jet on a runway at sunrise, holding a helmet, wearing an ultra-realistic pilot uniform with cap',
  'Firefighter':
    'a firefighter in front of a blazing fire with glowing embers in the air, wearing an ultra-realistic yellow turnout coat and helmet',
  'Police Officer':
    'a police officer beside a patrol car on an urban street at dusk with red and blue light reflections, wearing an ultra-realistic uniform with a badge',
  'Lawyer':
    'a confident lawyer in a grand wood-paneled courtroom, holding documents, wearing an ultra-realistic sharp tailored suit',
  'Professor':
    'a distinguished professor in a classic library with tall bookshelves, holding a book, wearing an ultra-realistic tweed jacket',
  'DJ':
    'a DJ at the turntables in a nightclub with vibrant neon lights and a crowd, wearing ultra-realistic headphones and a stylish outfit',
  'Bartender':
    'a stylish bartender behind an elegant bar mixing a cocktail with flair, warm moody lighting, wearing a vest with rolled sleeves',
  'Barber':
    'a skilled barber in a vintage barbershop holding scissors, warm lighting, wearing an ultra-realistic apron',
  'Photographer':
    'a photographer holding a professional camera on a vibrant city street at golden hour, wearing a stylish casual outfit',
  'Jazz Musician':
    'a jazz musician playing a golden saxophone on a moody dimly-lit stage with a single spotlight, wearing an ultra-realistic sharp suit',
  'Architect':
    'an architect at a drafting desk with blueprints in a modern studio overlooking a city skyline, holding a building model, wearing a smart outfit',
  'Archaeologist':
    'an archaeologist carefully brushing an ancient artifact at a sunlit desert dig site surrounded by stone ruins, wearing a wide-brimmed safari hat and a rugged shirt',
  'Winemaker':
    'a winemaker in a sunlit vineyard at golden hour holding a glass of red wine with rows of grapevines behind, wearing a rustic shirt',
  'Fitness Trainer':
    'a fit fitness trainer in a modern gym with dramatic lighting, confident and athletic, wearing athletic gear',
  'Golf Pro':
    'a golf pro mid-swing on a lush green golf course at golden hour, wearing an ultra-realistic polo shirt and cap',
  'Yacht Captain':
    "a yacht captain on the deck of a luxury yacht on turquoise ocean water, wearing a crisp white captain's uniform and cap",
  'Mountain Climber':
    'a mountain climber at a snowy summit with epic mountain vistas at sunrise, wearing ultra-realistic climbing gear and ropes',
  'SWAT Operator':
    'a SWAT operator in full tactical gear during a dramatic urban night operation, wearing an ultra-realistic armored vest and helmet',
  'Boxer':
    'a boxer in a dramatic boxing ring under bright spotlights, intense and powerful, wearing boxing gloves and shorts',
  'Surfer':
    'a surfer standing on the beach at golden sunset holding a tall surfboard upright beside them, big ocean waves breaking behind, wearing a wetsuit, water droplets glistening',
  'Cowboy Mustache':
    'a cowboy with a thick mustache standing in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots',
  'Gladiator':
    'a gladiator standing in a sunlit Colosseum arena with dust in the air, holding a sword and shield, wearing ultra-realistic leather and bronze armor',
  'Samurai':
    'a samurai warrior in a blossoming cherry-blossom courtyard holding a gleaming katana, wearing ultra-realistic traditional samurai armor',
  'Viking':
    'a fierce Viking warrior on a rugged northern shore with stormy seas, holding a battle axe, wearing ultra-realistic fur cloak and iron armor with braided hair',
  'Sumo Wrestler':
    'a sumo wrestler in a powerful stance in a traditional sumo ring inside a dramatic arena, wearing a traditional mawashi belt',
  'Male Ballerina':
    'a graceful ballet dancer mid-leap on a grand theater stage under a soft glowing spotlight, wearing an ultra-realistic ballet outfit',
  'Funny Ballerina':
    'a ballerina in a comedic exaggerated pose with a playful funny expression on a theater stage under a spotlight, wearing a tutu',
  'Cowgirl Mustache':
    'a cowgirl wearing a funny fake mustache standing in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MRLSSUBJ';

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

  // Scene leads the prompt so it overpowers the LoRA's indoor/training bias.
  // Strip a leading article ("a chef" → "chef") so "...real-life {scene}" reads
  // correctly instead of "real-life a chef".
  const scene = (CHARACTER_PROMPTS[params.characterName]
    ?? `${params.characterName} in an epic cinematic fantasy scene with dramatic lighting`)
    .replace(/^(an?|the)\s+/i, '');

  const override = params.aiOverride?.trim()
    ? ` ${params.aiOverride.trim()}`
    : '';

  // Front-load the framing. For the full-body shot we deliberately avoid the word
  // "portrait" — it biases the model toward a face close-up and fights the
  // "head to toe" instruction (CLIP truncates the prompt tail, so a trailing
  // "full body shot" loses to the opening word).
  const opening = params.variation === 'variation_b'
    ? `An ultra-realistic cinematic close-up portrait, head and shoulders, of ${trigger}`
    : `A full-body ultra-realistic cinematic photograph of ${trigger} shown in full from head to toe`;

  return `${opening}, a ${params.aiLabel} fully transformed into a real-life ${scene}. ${MAGIC_GLOW} ${QUALITY_TAIL}${override}`;
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
