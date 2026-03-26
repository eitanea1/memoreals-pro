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
        group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300
        border
        ${selected
          ? 'ring-[3px] ring-[var(--c-brand)] border-[var(--c-brand)] shadow-[0_0_24px_rgba(91,33,182,0.2)] scale-[1.02]'
          : 'border-[var(--c-border)] shadow-sm hover:shadow-xl hover:scale-[1.04] hover:border-[var(--c-brand-mid)]/40'}
        ${disabled && !selected ? 'opacity-35 cursor-not-allowed saturate-0' : 'cursor-pointer'}
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] bg-[#f0ede9] overflow-hidden">
        {character.thumbnail ? (
          <Image
            src={character.thumbnail}
            alt={character.displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-[var(--c-brand-light)] to-white">
            ✨
          </div>
        )}

        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-brand)]/85 via-[var(--c-brand)]/20 to-transparent flex items-end justify-center pb-3">
            <div className="bg-white text-[var(--c-brand)] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              נבחר
            </div>
          </div>
        )}

        {/* Hover add icon */}
        {!selected && !disabled && (
          <div className="absolute inset-0 bg-[var(--c-brand)]/0 group-hover:bg-[var(--c-brand)]/10 transition-all duration-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg text-[var(--c-brand)] font-bold text-xl scale-75 group-hover:scale-100">
              +
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <div className={`
        w-full py-2.5 px-2 text-center text-sm font-bold leading-tight transition-colors
        ${selected ? 'bg-[var(--c-brand-light)] text-[var(--c-brand-text)]' : 'bg-white text-[var(--c-dark)]'}
      `}>
        {character.displayName}
      </div>
    </button>
  );
}
