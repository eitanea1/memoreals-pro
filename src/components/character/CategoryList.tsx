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
    <div className="category-list">
      <h3 className="category-title">{title}</h3>
      <div className="character-grid">
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
