'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  BOYS_HEROES, BOYS_ANIME, BOYS_ADVENTURES, BOYS_PREMIUM,
  GIRLS_HEROES, GIRLS_ANIME, GIRLS_ADVENTURES, GIRLS_PREMIUM,
} from '@/lib/data/characters';
import CategoryList from '@/components/character/CategoryList';
import StepIndicator from '@/components/shared/StepIndicator';
import type { Character } from '@/lib/types';

const CUSTOM_SLOTS = 5;

type CategoryFilter = 'all' | 'superheroes' | 'anime' | 'adventures' | 'premium';

const TABS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'הכל' },
  { key: 'superheroes', label: 'גיבורי על' },
  { key: 'anime', label: 'אגדות ואנימה' },
  { key: 'adventures', label: 'הרפתקאות' },
  { key: 'premium', label: 'פרימיום' },
];

export default function CharacterSelectPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const isBoy = state.subjectGender.toLowerCase() !== 'female';
  const heroes = isBoy ? BOYS_HEROES : GIRLS_HEROES;
  const anime = isBoy ? BOYS_ANIME : GIRLS_ANIME;
  const adventures = isBoy ? BOYS_ADVENTURES : GIRLS_ADVENTURES;
  const premium = isBoy ? BOYS_PREMIUM : GIRLS_PREMIUM;

  const [customInputs, setCustomInputs] = useState<string[]>(() => {
    const existing = state.selectedCharacters
      .filter((c) => c.id.startsWith('custom-'))
      .map((c) => c.displayName);
    return Array.from({ length: CUSTOM_SLOTS }, (_, i) => existing[i] ?? '');
  });

  const selectedIds = new Set(state.selectedCharacters.map((c) => c.id));
  const total = state.selectedCharacters.length;
  const isComplete = total === 20;
  const progress = (total / 20) * 100;

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
        category: 'premium',
      };
      dispatch({ type: 'SELECT_CHARACTER', character: customChar });
    }
  }

  return (
    <div className="min-h-screen pb-40" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <StepIndicator current={1} />

        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--c-brand-text)] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            בחרו 20 דמויות קסומות
          </h1>
          <p className="text-sm text-[var(--c-mid)] max-w-md mx-auto">
            הדמויות שתבחרו יהפכו לקלפים המיוחדים שלכם. כל דמות היא סיפור חדש.
          </p>
        </div>

        {/* Category Tabs */}
        <nav className="flex justify-center gap-2 mb-6 overflow-x-auto py-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                ${filter === tab.key
                  ? 'bg-[var(--c-brand)] text-white shadow-lg'
                  : 'bg-[var(--c-brand-light)] text-[var(--c-brand-text)] hover:bg-[#ddd6fe]'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main content: Grid + Side Banner */}
        <div className="flex gap-6">
          {/* Character Grids */}
          <div className="flex-1 min-w-0">
            {(filter === 'all' || filter === 'superheroes') && (
              <CategoryList title="גיבורי על" characters={heroes} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
            )}
            {(filter === 'all' || filter === 'anime') && (
              <CategoryList title="אגדות ואנימה" characters={anime} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
            )}
            {(filter === 'all' || filter === 'adventures') && (
              <CategoryList title="הרפתקאות" characters={adventures} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
            )}
            {(filter === 'all' || filter === 'premium') && (
              <CategoryList title="פרימיום" characters={premium} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
            )}
          </div>

          {/* Side Hero Banner — desktop only */}
          <div className="hidden lg:flex flex-col w-52 shrink-0 sticky top-24 self-start gap-4">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={isBoy ? '/characters/boys/superman.jpg' : '/characters/girls/wonder-woman.jpg'}
                alt="Hero"
                width={400}
                height={300}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-brand)]/90 via-transparent to-transparent flex flex-col items-center justify-end p-4 text-center">
                <p className="text-white font-extrabold text-lg leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {isBoy ? 'הגיבור שלך' : 'הגיבורה שלך'}
                </p>
                <p className="text-white/80 text-xs mt-1">מחכה להיחשף</p>
              </div>
            </div>
            <div className="bg-[var(--c-brand-light)] rounded-2xl p-4 text-center">
              <p className="text-[var(--c-brand-text)] font-bold text-sm mb-1">20 קלפים מותאמים</p>
              <p className="text-[var(--c-mid)] text-xs">כל דמות שתבחרו תהפוך לקלף עם הפנים של הילד/ה שלכם</p>
            </div>
          </div>
        </div>

        {/* Custom characters */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[var(--c-brand-text)] mb-3 pr-1">
            דמויות לבחירה חופשית (עד {CUSTOM_SLOTS})
          </h3>
          <p className="text-xs text-[var(--c-mid)] mb-3 pr-1">הזינו שמות דמויות שאינן ברשימה</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {customInputs.map((val, i) => {
              const id = `custom-${i}`;
              const isSelected = selectedIds.has(id);
              const isFull = total >= 20 && !isSelected;
              return (
                <div
                  key={i}
                  className={`
                    relative flex items-center gap-2 rounded-2xl px-3 py-2 transition-all
                    ${isSelected ? 'bg-[var(--c-brand-light)] ring-2 ring-[var(--c-brand)]' : 'bg-white'}
                  `}
                >
                  <span className="text-xs font-bold text-[var(--c-muted)]">{i + 1}</span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--c-muted)]"
                    placeholder={`דמות ${i + 1}`}
                    value={val}
                    disabled={isFull && !val}
                    onChange={(e) => handleCustomChange(i, e.target.value)}
                    dir="rtl"
                  />
                  {isSelected && (
                    <div className="w-4 h-4 bg-[var(--c-brand)] rounded-full flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-[var(--c-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#e7e0d5" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="transparent" stroke={isComplete ? '#16a34a' : '#5b21b6'} strokeWidth="4" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - progress / 100)} strokeLinecap="round" className="transition-all duration-300" />
              </svg>
              <span className={`absolute text-xs font-bold ${isComplete ? 'text-green-600' : 'text-[var(--c-brand)]'}`}>{total}/20</span>
            </div>
            <div>
              <p className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-[var(--c-brand-text)]'}`}>{total} / 20 נבחרו</p>
              <p className="text-xs text-[var(--c-mid)]">{isComplete ? 'מוכן להמשיך!' : `בחרו עוד ${20 - total} דמויות`}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/details')} className="px-4 py-2.5 rounded-full text-sm font-bold text-[var(--c-brand)] border border-[var(--c-brand)] hover:bg-[var(--c-brand-light)] transition-all">חזור</button>
            <button onClick={() => router.push('/upload')} disabled={!isComplete} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${isComplete ? 'bg-[var(--c-brand)] text-white shadow-lg hover:opacity-90' : 'bg-[var(--c-border)] text-[var(--c-muted)] cursor-not-allowed'}`}>
              בואו נעלה תמונות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
