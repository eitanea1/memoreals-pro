// ── Prompt Variations ─────────────────────────────────────────────────────────
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

// ── Winning prompt formula (restored) ──────────────────────────────────────────
// These are the customer's ORIGINAL proven prompts (scripts/"פרומפטים גיבורי על"),
// the ones that always produced rich cinematic, magical results. The doc shape was:
//
//   "{Name}, a ten-year-old {Character}, {dynamic action}, ultra-realistic {costume
//    + texture}, {magical atmosphere}, {detailed cinematic background}."
//
// We template that for the LoRA pipeline: {Name} → trigger (MRLSSUBJ) and
// "ten-year-old" → {aiLabel} (so it works for any kid / age / gender). Each
// CHARACTER_PROMPTS entry is the part AFTER "a {aiLabel} as " — it starts with the
// character noun and packs action + ultra-realistic costume + magical atmosphere +
// vivid background, all in one flowing narrative. Phrasing is gender-neutral (no
// he/she/his) so shared names (Chef, Samurai, …) work for everyone — gender comes
// from {aiLabel}. The 22 from the doc are ported faithfully; the rest are written
// in the same winning voice.

// Shared quality + magic tail — the "make it magical and photoreal" closer that
// rode on every winning prompt. Per-scene text already carries its own atmosphere,
// so this just reinforces realism, the real face, and the signature glow.
const QUALITY_TAIL =
  'Glowing magical light particles and sparkling embers drift through the air, ' +
  'dreamy glowing bokeh and dramatic cinematic lighting. ' +
  'Hyper-detailed and photorealistic, ultra-realistic skin texture and a natural ' +
  'realistic face with expressive eyes, cinematic movie-poster quality, magical.';

// ── Character scenes (winning narrative: action + costume + atmosphere + bg) ─────
const CHARACTER_PROMPTS: Record<string, string> = {
  // ── Superheroes (shared boys / girls / men / women) ──
  'Spider-Man':
    'Spider-Man with the mask off and face fully visible, swinging between glowing skyscrapers at dusk in an agile dynamic pose, ultra-realistic suit showcasing detailed webbing and vibrant red and blue colors, the spotlight reflecting off the suit, magical glowing webs leaving shimmering trails in the air, city lights twinkling brightly below for a dramatic and captivating background',
  'Iron Man':
    'Iron Man with the helmet off and face fully visible, hovering in mid-air with arms extended and glowing repulsors charging in the hands, ultra-realistic red and gold suit shining with reflective metallic textures and a bright arc reactor, sparks of magical energy all around, a futuristic city illuminated by neon lights and glowing blue energy trails in the background',
  'Captain America':
    'Captain America standing in a heroic stance on a glowing battlefield, holding a vibranium shield that pulses with a radiant blue glow, ultra-realistic blue suit detailed with subtle metallic accents and a star emblem, illuminated by golden light from the setting sun, floating sparks and glowing dust particles filling the air',
  'Thor':
    'Thor standing atop a rocky mountain gripping a glowing Mjolnir that crackles with vibrant blue lightning, ultra-realistic Asgardian armor gleaming with intricate metallic designs and a red cape flowing majestically behind, swirling storm clouds illuminated by magical streaks of energy and glowing stars',
  'Doctor Strange':
    'Doctor Strange hovering mid-air with glowing magical symbols forming around the hands, ultra-realistic cloak flowing dramatically with edges faintly glowing in golden light, a swirling mystical portal surrounded by glowing runes and vibrant cosmic energy in the background',
  'Superman':
    'Superman soaring in a heroic pose above a magical valley bathed in golden sunlight, ultra-realistic blue suit glowing faintly with reflective details and the iconic chest emblem, a red cape flowing powerfully behind, radiant beams of light streaming from the sky with glowing fireflies and sparkling clouds',
  'Batman':
    'Batman with the cowl pulled back so the face is fully visible, standing in a heroic stance on a glowing rooftop overlooking a fantastical Gotham City, ultra-realistic dark armored batsuit reflecting the faint glow of the Bat-Signal in the sky, a flowing cape, mystical fog and glowing bats all around',
  'The Flash':
    'the Flash running through a futuristic street in dynamic motion, surrounded by glowing lightning trails, ultra-realistic red suit featuring golden lightning bolts that pulse with energy, vibrant streaks of light and crackling magical electric energy flowing all around',
  'Green Arrow':
    'Green Arrow drawing a glowing radiant arrow ready to strike, standing in an enchanted forest filled with glowing plants and magical mist, ultra-realistic green suit detailed with leather textures and metallic accents, shimmering light surrounding the scene',
  'Hulk':
    'the Hulk, a massive muscular green-skinned hero with the face fully visible and recognizable, standing powerfully in a destroyed city street at sunset, torn purple shorts, dramatic sunset backlighting with floating embers in the air',
  'Aquaman':
    'Aquaman standing on ocean rocks holding a glowing golden trident with waves crashing dramatically behind, ultra-realistic green and gold scale armor gleaming with water droplets, a stormy dramatic sky and glowing sea spray',
  'Wonder Woman':
    'Wonder Woman standing confidently in a strong heroic pose on an ancient battlefield at golden sunrise, holding a glowing Lasso of Truth, intricately detailed gold and red armor gleaming with polished metallic highlights, glowing dust and warm radiant light all around',
  'Captain Marvel':
    'Captain Marvel hovering in a powerful pose with glowing cosmic energy radiating from the hands, ultra-realistic red, blue and gold suit glowing with energy, set against a starry cosmic sky streaked with magical light',
  'Black Widow':
    'Black Widow in a confident action pose in a moody industrial setting at night, ultra-realistic sleek black tactical suit with utility belts, dramatic rim lighting and floating sparks in the air',
  'Batgirl':
    'Batgirl standing confidently in a heroic pose on a gothic city rooftop at night with the glowing Bat-Signal lighting up the dark sky, sleek intricately detailed black batsuit with a glowing yellow bat emblem, a flowing dark cape and utility belt, the cowl pulled back so the face is fully visible, mystical fog and glowing bats around',
  'Storm':
    'Storm floating in mid-air with glowing white eyes and crackling lightning, hair billowing in the wind, ultra-realistic sleek black suit with a flowing cape, a dramatic stormy sky alive with magical streaks of energy',
  'Supergirl':
    'Supergirl flying in a heroic pose above a glowing city skyline at golden hour, ultra-realistic blue suit with the iconic emblem and a red cape flowing behind, radiant beams of light and sparkling clouds',
  'Scarlet Witch':
    'the Scarlet Witch in a powerful pose with glowing crimson magic energy swirling around the hands, ultra-realistic red coat and crimson headpiece, a dark mystical setting alive with radiant magical particles',
  'Valkyrie':
    'an Asgardian Valkyrie warrior standing on a misty battlefield holding a glowing sword, ultra-realistic blue and silver armor with a flowing cape, magical light beams piercing the mist',

  // ── Boys anime ──
  'Dragon Ball Z Fighter':
    'a Super Saiyan fighter in a powerful pose with glowing golden spiky hair and a blazing golden aura of energy, orange and blue martial-arts gi, on a rocky battlefield with power particles swirling and dramatic golden energy lighting',
  'Vegeta Dragon Ball':
    'Vegeta in a proud powerful stance with a glowing blue aura of energy and spiky black hair, ultra-realistic blue and white Saiyan battle armor, floating power sparks on a rocky cliff',
  'Naruto Ninja':
    'a Naruto-style ninja in a dynamic pose with glowing chakra energy swirling, ultra-realistic orange and black ninja outfit with a metal headband, a hidden ninja village at dusk with floating leaves and sparks',
  'Pokemon Trainer':
    'a young monster trainer standing confidently on a grassy hill at sunrise holding a glowing red and white Poke Ball, ultra-realistic cap, jacket and backpack, warm golden morning light with sparkles drifting',
  'Avatar Navi':
    "a tall blue-skinned Na'vi from Pandora with the face fully visible, standing in a lush glowing bioluminescent jungle at night, ultra-realistic blue skin detailed with glowing bioluminescent patterns, holding a bow of glowing materials, luminous plants and floating seeds of Eywa all around under a glowing night sky",
  'Avatar Airbender':
    'an airbending master in a dynamic pose with swirling glowing air currents and blue arrow tattoos, ultra-realistic orange and yellow air-nomad robes, on a mountaintop temple with clouds and sparks swirling around',
  'Harry Potter':
    'a young wizard like Harry Potter standing in a grand glowing magical Hogwarts library with floating candles, ultra-realistic Hogwarts robe detailed with fine textures and a Gryffindor scarf, holding a glowing wand, surrounded by floating books and radiant golden sparks with a vibrant magical aura',

  // ── Adventures (shared) ──
  'Jack Sparrow':
    'a charismatic pirate captain like Jack Sparrow standing on the deck of a glowing pirate ship under a starry sky, ultra-realistic weathered pirate coat with leather textures, a detailed tricorn hat, beaded braids and shimmering golden details, holding a glowing sword, surrounded by radiant treasure chests and floating magical lanterns, the ocean reflecting the starlight',
  'Aladdin':
    'Aladdin standing atop a glowing magic carpet flying high above a moonlit Arabian city with domed palaces, ultra-realistic embroidered vest and baggy pants with shimmering accents, glowing stars and a crescent moon in a magical night sky, radiant golden dust trailing behind the carpet',
  'Peter Pan':
    'Peter Pan hovering above moonlit London rooftops with Big Ben in the background, ultra-realistic green tunic and feathered cap, a glowing fairy-dust trail sparkling behind under a magical moonlit glow',
  'Hercules':
    'the legendary hero Hercules in a powerful heroic pose at an ancient Greek temple at golden hour, ultra-realistic bronze and leather armor with a red cape, warm golden torchlight and floating embers',
  'Mowgli':
    'Mowgli standing in a lush glowing jungle at dawn beside a friendly wolf, a simple red loincloth, surrounded by fireflies with dappled golden sunlight through the dense canopy',
  'Robin Hood':
    'Robin Hood drawing a bow with a glowing arrow in a misty enchanted forest, ultra-realistic green hooded tunic with leather details and a quiver of arrows, soft green light filtering through the trees',
  'Ninja Turtle Fighter':
    'a heroic ninja-turtle warrior in a dynamic action pose in a neon-lit city alley at night, a colored eye mask and ninja gear with weapons, vibrant neon green and purple lighting with floating sparks',
  'Optimus Prime':
    'a giant heroic Transformer robot like Optimus Prime standing in a futuristic city with glowing blue eyes, ultra-realistic red and blue metallic armor plating, cinematic blue and orange lighting with sparks and energy crackling',
  'Indiana Jones':
    'an adventurous archaeologist explorer like Indiana Jones in an ancient torch-lit temple ruin filled with golden artifacts, holding a whip, ultra-realistic leather jacket and fedora, warm torchlight with dust particles floating',
  'James Bond':
    'a suave secret agent like James Bond in a sleek black tuxedo at a glamorous casino at night, holding a pistol, dramatic moody lighting with warm bokeh',
  'Drunk Pirate':
    'a jolly tipsy pirate with a comedic grin stumbling on a tavern ship deck holding a bottle, ultra-realistic weathered pirate coat and hat, warm lantern light with floating golden dust',
  'Lara Croft':
    'an adventurous explorer like Lara Croft in an ancient jungle temple, holding dual pistols, a tank top and cargo shorts with adventure gear, shafts of golden light and floating dust through the ruins',
  'Spy':
    'a sleek elegant spy in a glamorous gown at a high-society event at night, holding a small concealed pistol, dramatic moody lighting with shimmering bokeh',
  'Pirate Captain':
    'a bold pirate captain at the helm of a ship under a dramatic stormy sky, ultra-realistic ornate pirate coat and feathered hat, sea spray and glowing lanterns swinging in the wind',

  // ── Boys premium ──
  'Astronaut':
    "an astronaut standing proudly on the moon's surface with Earth glowing in the dark starry sky behind, ultra-realistic detailed white space suit with the helmet visor up and a flag patch, holding a small planted flag, the vastness of space with glowing stars and distant planets",
  'Medieval Knight':
    'a medieval knight in shining silver plate armor standing in a grand castle courtyard at golden hour, holding a gleaming sword, golden sunrise backlighting with floating dust particles',
  'Prince King':
    'a royal prince in a grand palace throne room, ultra-realistic ornate royal outfit with a golden crown and a regal velvet cape, warm golden chandelier light and floating golden dust',
  'Viking Dragon Rider':
    'a young Viking dragon rider sitting confidently atop a majestic dragon on a cliff at sunset, ultra-realistic fur-lined leather armor with dragon-scale details, the dragon\'s glowing eyes lighting the scene under epic golden-hour clouds',
  'Kung Fu Master':
    'a kung fu master in a powerful martial-arts stance in a misty ancient temple courtyard at dawn, ultra-realistic traditional martial-arts robe, floating cherry-blossom petals in soft morning mist',
  'Sherlock Detective':
    'a clever detective like Sherlock Holmes on a foggy Victorian London street at night under a glowing gas lamp, holding a magnifying glass, ultra-realistic tweed coat and deerstalker cap, moody atmospheric light',
  'Race Driver':
    'a race-car driver standing confidently beside a sleek formula race car on a track, holding a helmet, ultra-realistic racing suit covered in sponsor patches, dramatic stadium lighting',
  'Football Champion':
    'a football champion captured mid-celebration after scoring a goal, arms raised triumphantly while running along the pitch, ultra-realistic team jersey with matching shorts and cleats, a packed stadium with waving flags, cheering fans and bright floodlights, confetti drifting in the air',
  'Secret Agent':
    'a sharp secret agent in a sleek black tuxedo in a glamorous casino at night, holding a pistol, dramatic moody lighting with warm bokeh',
  'Samurai Warrior':
    'a samurai warrior in a blossoming cherry-blossom courtyard holding a gleaming katana, ultra-realistic traditional samurai armor, falling pink petals and soft golden light',
  'Cowboy':
    'a cowboy standing in a golden desert canyon at sunset, ultra-realistic cowboy hat, leather vest and boots, warm dusty light with drifting particles',
  'Roman Gladiator':
    'a Roman gladiator standing in a sunlit Colosseum arena with dust in the air, holding a sword and shield, ultra-realistic leather and bronze armor, dramatic golden light',
  'Motorcycle Rider':
    'a cool motorcycle rider beside a powerful motorcycle on a neon-lit city street at night, ultra-realistic black leather riding jacket, vibrant neon reflections and floating sparks',
  'Pro Surfer':
    'a pro surfer standing on the beach at golden sunset holding a tall surfboard upright beside them, big ocean waves breaking behind, a wetsuit with water droplets glistening, warm radiant backlight',
  'Viking Berserker':
    'a fierce Viking warrior on a rugged northern shore with stormy seas, holding a battle axe, ultra-realistic fur cloak and iron armor with braided hair, dramatic storm light and sea spray',
  'Horse Rider Knight':
    'a knight riding a majestic horse galloping through a grand field at golden hour, ultra-realistic armor gleaming, dust and golden light kicked up around the gallop',

  // ── Girls — princesses & fairy tales ──
  'Cinderella':
    'Cinderella on a grand marble staircase inside a magnificent palace ballroom with golden chandeliers and ornate columns, an exquisitely detailed shimmering light-blue ball gown with layered tulle and sparkling glass slippers, hair in an elegant updo, glowing golden light and floating sparkles',
  'Snow White':
    'Snow White in an enchanted sunlit forest clearing with birds and deer, ultra-realistic yellow and blue royal gown with a red bow headband, soft magical light and drifting glowing pollen',
  'Rapunzel':
    'Rapunzel at a tower window with long flowing golden hair, hundreds of glowing floating lanterns rising into the twilight sky, ultra-realistic purple dress, warm radiant lantern glow',
  'Elsa Frozen':
    'Elsa inside a vast glowing ice palace with towering frozen crystal pillars and shimmering frost-covered walls, glowing frost magic swirling from the hands, a sparkling ice-blue gown and a long flowing translucent cape glowing with magical light, platinum-blonde hair in a side braid',
  'Moana':
    'Moana on a tropical beach at golden sunset with ocean waves curling behind, long dark wavy hair flowing, ultra-realistic red and tan island outfit with a shell necklace, warm glowing light and sea sparkle',
  'Mulan':
    'Mulan in a blossoming pink cherry-blossom courtyard, ultra-realistic elegant traditional Hanfu robe with an ornate hair ornament, falling petals and soft golden light',
  'Ariel Little Mermaid':
    'Ariel the little mermaid sitting on ocean rocks at sunset with waves gently crashing, long flowing red hair, ultra-realistic mermaid outfit with a teal sequined tail glistening, glowing sea spray and warm light',
  'Aurora Sleeping Beauty':
    'Princess Aurora in an enchanted castle garden full of blooming roses, long blonde hair, ultra-realistic flowing pink gown with a golden crown, soft magical light and floating petals',
  'Belle Beauty Beast':
    'Belle in an enchanted castle ballroom with a glowing magical rose under a glass dome, hair in an elegant updo, ultra-realistic iconic golden ball gown, warm chandelier glow and drifting sparkles',
  'Pocahontas':
    'Pocahontas on a cliff above a forest river at golden hour with wind swirling autumn leaves, long black flowing hair, ultra-realistic tan buckskin dress with a turquoise necklace, warm radiant light',
  'Little Red Riding Hood':
    'Little Red Riding Hood on a misty enchanted forest path holding a basket, ultra-realistic flowing red hooded cape over a white dress, soft beams of light through the trees and glowing mist',
  'Sailor Moon':
    'a Sailor Moon-style magical girl in a dynamic pose with glowing crescent-moon magic and sparkles, ultra-realistic sailor-style uniform with a red bow, against a starry night sky alive with magical light',
  'Anime Warrior Girl':
    'an anime warrior girl in a dynamic pose with glowing energy on a dramatic battlefield, ultra-realistic stylized fantasy armor, swirling magical particles and dramatic light',

  // ── Girls adventures ──
  'Hogwarts Witch':
    'a young witch in a grand glowing magical Hogwarts library with floating candles, holding a glowing wand, ultra-realistic Hogwarts robe with a house scarf, floating books and radiant golden sparks with a vibrant magical aura',
  'Dragon Rider Girl':
    'a young dragon rider sitting confidently atop a majestic dragon on a cliff at golden hour, ultra-realistic leather armor with dragon-scale details, the dragon\'s glowing eyes and epic clouds behind',

  // ── Girls premium ──
  'Astronaut Girl':
    "an astronaut standing proudly on the moon's surface with Earth glowing in the dark starry sky behind, ultra-realistic detailed white space suit with the helmet visor up and a flag patch, the vastness of space with glowing stars and distant planets",
  'Princess Queen':
    'a regal princess queen on an ornate golden throne in a grand palace hall, ultra-realistic luxurious royal gown with a golden crown and jewels, warm golden light and floating sparkles',
  'Fairy Godmother':
    'a magical fairy with glowing translucent wings in an enchanted glowing forest at night, holding a sparkling magic wand, surrounded by swirling fairy dust, a shimmering gown glowing with magical light',
  'Samurai Girl':
    'a samurai warrior in a blossoming cherry-blossom courtyard holding a gleaming katana, ultra-realistic traditional samurai armor, falling pink petals and soft golden light',
  'Horse Rider Girl':
    'an equestrian rider on a majestic horse galloping through a grand field at golden hour, ultra-realistic equestrian attire, dust and golden light around the gallop',
  'Ballerina':
    'a graceful ballerina mid-pose on a grand theater stage under a soft glowing spotlight, ultra-realistic elegant tutu, sparkling dust drifting through the warm light',
  'Hip Hop Dancer':
    'a cool hip hop dancer in a dynamic pose on a neon-lit urban street at night, ultra-realistic stylish streetwear, vibrant neon glow and floating sparks',
  'Rock Star Girl':
    'a rock star performing on a concert stage with dramatic spotlights and cheering crowd silhouettes, holding a microphone, ultra-realistic leather jacket, dynamic red, blue and white stage lighting',
  'Pro Surfer Girl':
    'a pro surfer standing on the beach at golden sunset holding a tall surfboard upright beside them, big ocean waves breaking behind, a wetsuit with water droplets glistening, warm radiant backlight',
  'Chef Girl':
    "a chef in a professional kitchen with flames rising from a pan, ultra-realistic white chef's coat and tall toque hat, warm glowing light and floating embers",
  'Doctor Girl':
    'a doctor in a modern hospital corridor, ultra-realistic white coat with a stethoscope around the neck, clean bright cinematic light',
  'Scientist Girl':
    'a scientist in a high-tech laboratory surrounded by glowing equipment and bubbling beakers, ultra-realistic white lab coat with goggles and gloves, carefully pouring a radiant glowing liquid into a test tube, advanced monitors and instruments behind',
  'Cowgirl':
    'a cowgirl in a golden desert canyon at sunset, ultra-realistic cowboy hat, leather vest and boots, warm dusty light with drifting particles',
  'Gladiator Girl':
    'a gladiator standing in a sunlit Colosseum arena with dust in the air, holding a sword and shield, ultra-realistic leather and bronze armor, dramatic golden light',
  'Race Driver Girl':
    'a race-car driver standing confidently beside a sleek formula race car on a track, holding a helmet, ultra-realistic racing suit covered in sponsor patches, dramatic stadium lighting',
  'Secret Agent Girl':
    'a sharp secret agent in an elegant outfit at a glamorous casino at night, holding a pistol, dramatic moody lighting with warm bokeh',
  'Football Star Girl':
    'a football star captured mid-celebration on a stadium pitch, arms raised triumphantly, ultra-realistic team jersey, bright floodlights, cheering fans and confetti drifting in the air',
  'Pirate Girl':
    'a bold pirate captain at the helm of a ship under a dramatic stormy sky, ultra-realistic ornate pirate coat and feathered hat, sea spray and glowing swinging lanterns',
  'Knight Girl':
    'a knight in shining silver plate armor standing in a grand castle courtyard at golden hour, holding a gleaming sword, golden backlight with floating dust',
  'Ninja Girl':
    'a ninja in a dynamic stealth pose on a moonlit rooftop at night, holding a katana, ultra-realistic black ninja outfit, glowing moonlight and floating sparks',

  // ── Professions & content (shared men / women) ──
  'Basketball Player':
    'a basketball player dribbling a basketball on a polished indoor court, ultra-realistic team jersey with matching shorts and high-top sneakers, the hardwood floor reflecting the gym lights, cheering fans in the stands and a hoop in the distance',
  'Rock Singer':
    'a rock singer performing passionately on a concert stage, ultra-realistic leather jacket, ripped jeans and a band t-shirt, holding a microphone with a guitar strapped across the back, dynamic red, blue and white spotlights, silhouettes of a cheering crowd with raised hands in the foreground',
  'Scientist':
    'a scientist standing in a high-tech laboratory surrounded by glowing equipment and bubbling beakers, ultra-realistic white lab coat with goggles and gloves, carefully pouring a radiant glowing liquid into a test tube, advanced monitors and shelves of instruments behind',
  'Dragon Rider':
    'a dragon rider sitting confidently atop a massive ultra-realistic dragon, detailed leather armor with embedded dragon scales, the dragon\'s glowing eyes and fiery breath lighting up the scene, a stormy sky and a distant burning castle in the background',
  'Chef':
    "a chef in a professional kitchen with flames rising from a pan, ultra-realistic white chef's coat and tall toque hat, warm glowing light and floating embers",
  'Doctor':
    'a doctor in a modern hospital corridor, ultra-realistic white coat with a stethoscope around the neck, clean bright cinematic light',
  'Pilot':
    'a pilot standing proudly next to a modern jet on an expansive airfield, a perfectly detailed ultra-realistic pilot uniform complete with patches and a helmet under the arm, a clear blue sky with other jets preparing for takeoff',
  'Firefighter':
    'a firefighter in front of a blazing fire with glowing embers in the air, ultra-realistic yellow turnout coat and helmet, dramatic warm firelight',
  'Police Officer':
    'a police officer beside a patrol car on an urban street at dusk with red and blue light reflections, ultra-realistic uniform with a badge, moody cinematic light',
  'Lawyer':
    'a confident lawyer in a grand wood-paneled courtroom holding documents, ultra-realistic sharp tailored suit, warm dramatic light',
  'Professor':
    'a distinguished professor in a classic library with tall bookshelves holding a book, ultra-realistic tweed jacket, warm golden reading light and floating dust',
  'DJ':
    'a DJ at the turntables in a nightclub with vibrant neon lights and a dancing crowd, ultra-realistic headphones and a stylish outfit, glowing neon haze',
  'Bartender':
    'a stylish bartender behind an elegant bar mixing a cocktail with flair, a vest with rolled sleeves, warm moody lighting with glints off the glassware',
  'Barber':
    'a skilled barber in a vintage barbershop holding scissors, ultra-realistic apron, warm nostalgic light',
  'Photographer':
    'a photographer holding a professional camera on a vibrant city street at golden hour, a stylish casual outfit, warm bokeh lights behind',
  'Jazz Musician':
    'a jazz musician playing a golden saxophone on a moody dimly-lit stage with a single spotlight, ultra-realistic sharp suit, soft glowing haze',
  'Architect':
    'an architect at a drafting desk with blueprints in a modern studio overlooking a city skyline, holding a building model, a smart outfit, soft cinematic light',
  'Archaeologist':
    'an archaeologist carefully brushing an ancient artifact at a sunlit desert dig site surrounded by stone ruins, a wide-brimmed safari hat and a rugged shirt, warm light and floating dust',
  'Winemaker':
    'a winemaker in a sunlit vineyard at golden hour holding a glass of red wine with rows of grapevines behind, a rustic shirt, warm radiant light',
  'Fitness Trainer':
    'a fit fitness trainer in a modern gym with dramatic lighting, confident and athletic, athletic gear, moody rim light',
  'Golf Pro':
    'a golf pro mid-swing on a lush green golf course at golden hour, ultra-realistic polo shirt and cap, warm radiant light',
  'Yacht Captain':
    "a yacht captain on the deck of a luxury yacht on turquoise ocean water, a crisp white captain's uniform and cap, bright sea sparkle",
  'Mountain Climber':
    'a mountain climber at a snowy summit with epic mountain vistas at sunrise, ultra-realistic climbing gear and ropes, glowing golden dawn light',
  'SWAT Operator':
    'a SWAT operator in full tactical gear during a dramatic urban night operation, ultra-realistic armored vest and helmet, moody lighting with floating sparks',
  'Boxer':
    'a boxer in a dramatic boxing ring under bright spotlights, intense and powerful, boxing gloves and shorts, dust and light haze in the air',
  'Surfer':
    'a surfer standing on the beach at golden sunset holding a tall surfboard upright beside them, big ocean waves breaking behind, a wetsuit with water droplets glistening, warm radiant backlight',
  'Cowboy Mustache':
    'a cowboy with a thick mustache standing in a golden desert canyon at sunset, ultra-realistic cowboy hat, leather vest and boots, warm dusty light',
  'Gladiator':
    'a gladiator standing in a sunlit Colosseum arena with dust in the air, holding a sword and shield, ultra-realistic leather and bronze armor, dramatic golden light',
  'Samurai':
    'a samurai warrior in a blossoming cherry-blossom courtyard holding a gleaming katana, ultra-realistic traditional samurai armor, falling pink petals and soft golden light',
  'Viking':
    'a fierce Viking warrior on a rugged northern shore with stormy seas, holding a battle axe, ultra-realistic fur cloak and iron armor with braided hair, dramatic storm light and sea spray',
  'Sumo Wrestler':
    'a sumo wrestler in a powerful stance in a traditional sumo ring inside a dramatic arena, a traditional mawashi belt, atmospheric overhead light',
  'Male Ballerina':
    'a graceful ballet dancer mid-leap on a grand theater stage under a soft glowing spotlight, ultra-realistic ballet outfit, sparkling dust drifting through the light',
  'Funny Ballerina':
    'a ballerina in a comedic exaggerated pose with a playful funny expression on a theater stage under a spotlight, a tutu, warm glowing light',
  'Cowgirl Mustache':
    'a cowgirl wearing a funny fake mustache standing in a golden desert canyon at sunset, ultra-realistic cowboy hat, leather vest and boots, warm dusty light',
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

  // The scene IS the winning narrative; it leads so it overpowers the LoRA's
  // indoor/training bias. Strip a leading article ("a chef" → "chef") so
  // "{aiLabel} as {scene}" reads cleanly.
  const scene = (CHARACTER_PROMPTS[params.characterName]
    ?? `${params.characterName} in an epic cinematic fantasy scene with magical glowing light and a dramatic captivating background`)
    .replace(/^(an?|the)\s+/i, '');

  const override = params.aiOverride?.trim()
    ? ` ${params.aiOverride.trim()}`
    : '';

  // Framing per variation, appended as a clause so the winning narrative keeps
  // leading (matches the proven doc shape: name + character + scene first).
  const framing = params.variation === 'variation_b'
    ? 'shown in a cinematic ultra-realistic close-up portrait, head and shoulders'
    : 'shown full-body from head to toe in a cinematic ultra-realistic photograph';

  // "{trigger}, a {aiLabel} as {scene}, {framing}, real face fully visible. {tail}"
  return `${trigger}, a ${params.aiLabel} as ${scene}, ${framing}, the real face fully visible and recognizable. ${QUALITY_TAIL}${override}`;
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
