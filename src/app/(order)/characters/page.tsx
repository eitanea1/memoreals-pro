'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SUPERHEROES, PROFESSIONS, FAIRY_TALES } from '@/lib/data/characters';
import CategoryList from '@/components/character/CategoryList';
import StepIndicator from '@/components/shared/StepIndicator';
import { Button } from '@/components/ui/button';
import type { Character } from '@/lib/types';

const CUSTOM_SLOTS = 5;

const CATEGORY_LABELS: Record<string, string> = {
  Superheroes: 'גיבורי על',
  Professions: 'מקצועות',
  'Fairy Tales': 'אגדות',
};

export default function CharacterSelectPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  const [customInputs, setCustomInputs] = useState<string[]>(() => {
    const existing = state.selectedCharacters
      .filter((c) => c.category === 'fairytales' && c.id.startsWith('custom-'))
      .map((c) => c.displayName);
    return Array.from({ length: CUSTOM_SLOTS }, (_, i) => existing[i] ?? '');
  });

  const selectedIds = new Set(state.selectedCharacters.map((c) => c.id));
  const total = state.selectedCharacters.length;

  function handleToggle(character: Character) {
    if (selectedIds.has(character.id)) {
      dispatch({ type: 'DESELECT_CHARACTER', id: character.id });
    } else {
      dispatch({ type: 'SELECT_CHARACTER', character });
    }
  }

  function handleCustomChange(index: number, value: string) {
    const prev = customInputs[index].trim();
    const prevId = `custom-${index}`;
    const wasSelected = prev !== '' && selectedIds.has(prevId);

    if (wasSelected) {
      dispatch({ type: 'DESELECT_CHARACTER', id: prevId });
    }

    const updated = customInputs.map((v, i) => (i === index ? value : v));
    setCustomInputs(updated);

    const trimmed = value.trim();
    const effectiveTotal = wasSelected ? total - 1 : total;
    if (trimmed && effectiveTotal < 20) {
      const customChar: Character = {
        id: prevId,
        name: trimmed,
        displayName: trimmed,
        category: 'fairytales',
      };
      dispatch({ type: 'SELECT_CHARACTER', character: customChar });
    }
  }

  return (
    <div className="page" dir="rtl">
      <StepIndicator current={1} />
      <div className="page-header">
        <h2>בחירת דמויות</h2>
        <div className={`selection-counter ${total === 20 ? 'complete' : ''}`}>
          {total} / 20 נבחרו
        </div>
      </div>
      <div className="categories-wrapper">
        <CategoryList
          title={CATEGORY_LABELS['Superheroes']}
          characters={SUPERHEROES}
          selectedIds={selectedIds}
          totalSelected={total}
          onToggle={handleToggle}
        />
        <CategoryList
          title={CATEGORY_LABELS['Professions']}
          characters={PROFESSIONS}
          selectedIds={selectedIds}
          totalSelected={total}
          onToggle={handleToggle}
        />
        <CategoryList
          title={CATEGORY_LABELS['Fairy Tales']}
          characters={FAIRY_TALES}
          selectedIds={selectedIds}
          totalSelected={total}
          onToggle={handleToggle}
        />
      </div>
      <div className="custom-characters-section">
        <h3 className="category-title">דמויות לבחירה חופשית (עד {CUSTOM_SLOTS})</h3>
        <p className="custom-characters-hint">הזינו שמות דמויות שאינן ברשימה — לדוגמה: &quot;ספיידרמן&quot;, &quot;אנה ואלסה&quot;</p>
        <div className="custom-characters-grid">
          {customInputs.map((val, i) => {
            const id = `custom-${i}`;
            const isSelected = selectedIds.has(id);
            const isFull = total >= 20 && !isSelected;
            return (
              <div key={i} className={`custom-character-input-wrap ${isSelected ? 'selected' : ''}`}>
                <span className="custom-char-num">{i + 1}</span>
                <input
                  type="text"
                  className="custom-character-input"
                  placeholder={`דמות ${i + 1}`}
                  value={val}
                  disabled={isFull && !val}
                  onChange={(e) => handleCustomChange(i, e.target.value)}
                  dir="rtl"
                />
                {isSelected && <span className="check-mark">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="nav-buttons">
        <Button variant="brand" size="xl" disabled={total !== 20} onClick={() => router.push('/upload')}>
          המשך ←
        </Button>
        <Button variant="brand-outline" size="xl" onClick={() => router.push('/details')}>
          → חזור
        </Button>
      </div>
      {total !== 20 && (
        <p className="hint">יש לבחור בדיוק 20 דמויות כדי להמשיך (נותרו {20 - total})</p>
      )}
    </div>
  );
}
