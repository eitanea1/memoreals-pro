'use client';

import Image from 'next/image';
import type { Character } from '../../lib/types';

interface Props {
  character: Character;
  selected: boolean;
  disabled: boolean;
  onToggle: (character: Character) => void;
}

export default function CharacterCard({ character, selected, disabled, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(character)}
      disabled={disabled && !selected}
      className={`
        group relative flex flex-col items-center rounded-2xl overflow-hidden
        cursor-pointer transition-all duration-200
        ${selected
          ? 'ring-[3px] ring-[var(--c-brand)] shadow-[0_0_16px_rgba(91,33,182,0.25)]'
          : 'hover:shadow-lg hover:scale-[1.03]'}
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] bg-[#f0ede9] overflow-hidden">
        {character.thumbnail ? (
          <Image
            src={character.thumbnail}
            alt={character.displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl bg-[var(--c-brand-light)]">
            ✨
          </div>
        )}

        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-brand)]/80 to-transparent flex items-end justify-center pb-2">
            <div className="bg-white text-[var(--c-brand)] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              נבחר
            </div>
          </div>
        )}

        {/* Hover add icon */}
        {!selected && (
          <div className="absolute top-1.5 left-1.5 bg-white/80 backdrop-blur-sm w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[var(--c-brand)] font-bold text-sm">
            +
          </div>
        )}
      </div>

      {/* Name */}
      <div className={`
        w-full py-1.5 px-1 text-center text-[10px] font-semibold leading-tight
        ${selected ? 'bg-[var(--c-brand-light)] text-[var(--c-brand-text)]' : 'bg-white text-[var(--c-dark)]'}
      `}>
        {character.displayName}
      </div>
    </button>
  );
}
