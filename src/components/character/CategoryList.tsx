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
    <div className="mb-6">
      <h3 className="text-sm font-bold text-[var(--c-brand-text)] mb-3 pr-1">{title}</h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
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
    </div>
  );
}
