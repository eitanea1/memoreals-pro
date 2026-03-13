'use client';

import { Toggle } from '@/components/ui/toggle';
import type { Character } from '../../lib/types';

interface Props {
  character: Character;
  selected: boolean;
  disabled: boolean;
  onToggle: (character: Character) => void;
}

export default function CharacterCard({ character, selected, disabled, onToggle }: Props) {
  return (
    <Toggle
      pressed={selected}
      onPressedChange={() => !disabled && onToggle(character)}
      disabled={disabled && !selected}
      variant="outline"
      size="default"
      className="character-card data-[state=on]:bg-[#ebf4ff] data-[state=on]:text-[#434190] data-[state=on]:border-[#667eea] relative"
      aria-label={character.displayName}
    >
      <span className="character-name">{character.displayName}</span>
      {selected && <span className="check-mark">✓</span>}
    </Toggle>
  );
}
