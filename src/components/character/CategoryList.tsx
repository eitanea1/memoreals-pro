'use client';

import type { Character } from '../../lib/types';
import CharacterCard from './CharacterCard';

interface Props {
  title: string;
  characters: Character[];
  selectedIds: Set<string>;
  totalSelected: number;
  onToggle: (character: Character) => void;
}

export default function CategoryList({ title, characters, selectedIds, totalSelected, onToggle }: Props) {
  return (
    <section className="py-8 first:pt-0">
      {/* Category header */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-extrabold text-[var(--c-brand-text)] whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--c-border)] to-transparent" />
        <span className="text-xs font-semibold text-[var(--c-muted)]">{characters.length} דמויות</span>
      </div>

      {/* Grid — 2 on mobile, 3 on sm, 4 on md, 5 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
        {characters.map((c) => {
          const selected = selectedIds.has(c.id);
          const disabled = totalSelected >= 20 && !selected;
          return (
            <CharacterCard
              key={c.id}
              character={c}
              selected={selected}
              disabled={disabled}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </section>
  );
}
