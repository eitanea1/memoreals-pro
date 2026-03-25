'use client';

import type { Character } from '../../lib/types';

// Emoji map for visual accent on each character card
const CHAR_EMOJI: Record<string, string> = {
  'Spider-Man': '🕷️', 'Wonder Woman': '🦸‍♀️', 'Batman': '🦇', 'Superman': '🦸',
  'Iron Man': '🤖', 'Black Panther': '🐾', 'Captain America': '🛡️', 'Thor': '⚡',
  'The Flash': '⚡', 'Aquaman': '🔱', 'Hulk': '💪', 'Doctor Strange': '🔮',
  'Green Arrow': '🏹',
  'Firefighter': '🚒', 'Nurse': '🏥', 'Astronaut': '🚀', 'Chef': '👨‍🍳',
  'Police Officer': '👮', 'Teacher': '👩‍🏫', 'Doctor': '🩺', 'Pilot': '✈️',
  'Engineer': '🔧', 'Veterinarian': '🐕', 'Artist': '🎨', 'Scientist': '🔬',
  'Football Player': '⚽', 'Basketball Player': '🏀', 'Rock Singer': '🎤',
  'Cinderella': '👗', 'Peter Pan': '🧚', 'Snow White': '🍎',
  'Little Red Riding Hood': '🐺', 'Rapunzel': '💇‍♀️', 'Pinocchio': '🤥',
  'Beauty & the Beast': '🌹', 'The Little Mermaid': '🧜‍♀️',
  'Sleeping Beauty': '😴', 'Hansel & Gretel': '🍬', 'Aladdin': '🧞',
  'Jack and the Beanstalk': '🌱', 'Harry Potter': '⚡', 'Jack Sparrow': '🏴‍☠️',
  'Avatar': '🌿', 'Dragon Rider': '🐉',
};

interface Props {
  character: Character;
  selected: boolean;
  disabled: boolean;
  onToggle: (character: Character) => void;
}

export default function CharacterCard({ character, selected, disabled, onToggle }: Props) {
  const emoji = CHAR_EMOJI[character.name] ?? '✨';

  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(character)}
      disabled={disabled && !selected}
      className={`
        char-card group relative flex flex-col items-center gap-1 p-2 rounded-2xl
        cursor-pointer transition-all duration-200
        ${selected
          ? 'bg-[var(--c-brand-light)] ring-2 ring-[var(--c-brand)] shadow-[0_0_16px_rgba(91,33,182,0.2)]'
          : 'bg-white hover:shadow-md hover:scale-[1.03]'}
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      {/* Emoji icon */}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center text-xl
        transition-transform duration-200 group-hover:scale-110
        ${selected ? 'bg-[var(--c-brand)] text-white' : 'bg-[#f5f1ec]'}
      `}>
        {emoji}
      </div>

      {/* Name */}
      <span className={`
        text-[11px] font-semibold text-center leading-tight line-clamp-2
        ${selected ? 'text-[var(--c-brand-text)]' : 'text-[var(--c-dark)]'}
      `}>
        {character.displayName}
      </span>

      {/* Selected badge */}
      {selected && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-[var(--c-brand)] rounded-full flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
    </button>
  );
}
