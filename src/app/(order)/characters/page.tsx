'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  BOYS_HEROES, BOYS_ANIME, BOYS_ADVENTURES, BOYS_PREMIUM,
  GIRLS_HEROES, GIRLS_ANIME, GIRLS_ADVENTURES, GIRLS_PREMIUM,
  MEN_HEROES, MEN_ADVENTURES, MEN_PROFESSIONS,
  WOMEN_HEROES, WOMEN_ADVENTURES, WOMEN_PROFESSIONS,
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
  { key: 'premium', label: 'מקצועות/אחר' },
];

export default function CharacterSelectPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const isBoy = state.subjectGender.toLowerCase() !== 'female';

  const heroes = [...(isBoy ? BOYS_HEROES : GIRLS_HEROES), ...(isBoy ? MEN_HEROES : WOMEN_HEROES)];
  const anime = isBoy ? BOYS_ANIME : GIRLS_ANIME;
  const adventures = [...(isBoy ? BOYS_ADVENTURES : GIRLS_ADVENTURES), ...(isBoy ? MEN_ADVENTURES : WOMEN_ADVENTURES)];
  const premium = [...(isBoy ? BOYS_PREMIUM : GIRLS_PREMIUM), ...(isBoy ? MEN_PROFESSIONS : WOMEN_PROFESSIONS)];

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
    if (wasSelected) dispatch({ type: 'DESELECT_CHARACTER', id: prevId });
    const updated = customInputs.map((v, i) => (i === index ? value : v));
    setCustomInputs(updated);
    const trimmed = value.trim();
    const effectiveTotal = wasSelected ? total - 1 : total;
    if (trimmed && effectiveTotal < 20) {
      dispatch({ type: 'SELECT_CHARACTER', character: { id: prevId, name: trimmed, displayName: trimmed, category: 'premium' } });
    }
  }

  return (
    <div className="min-h-screen pb-44" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <StepIndicator current={1} />

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--c-brand-text)] mb-3 tracking-tight">
            בחרו 20 דמויות קסומות
          </h1>
          <p className="text-base text-[var(--c-mid)] max-w-lg mx-auto leading-relaxed">
            הדמויות שתבחרו יהפכו לקלפים המיוחדים שלכם.<br className="hidden sm:block" />
            כל דמות היא סיפור חדש שמחכה להתגלות.
          </p>
        </div>

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <nav className="flex justify-center gap-2 mb-10 overflow-x-auto py-1 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap
                ${filter === tab.key
                  ? 'bg-[var(--c-brand)] text-white shadow-[0_4px_20px_rgba(91,33,182,0.3)]'
                  : 'bg-white text-[var(--c-brand-text)] border border-[var(--c-border)] hover:bg-[var(--c-brand-light)] hover:border-[var(--c-brand-mid)]/30'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ── Main content: Grid + Sidebar ────────────────────────────────── */}
        <div className="flex gap-8">
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

          {/* ── Sidebar — desktop only ──────────────────────────────────── */}
          <div className="hidden lg:flex flex-col w-56 shrink-0 sticky top-24 self-start gap-5">
            {/* Hero image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60">
              <Image
                src={isBoy ? '/characters/boys/superman.jpg' : '/characters/girls/wonder-woman.jpg'}
                alt="Hero"
                width={400}
                height={300}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-brand)]/90 via-[var(--c-brand)]/10 to-transparent flex flex-col items-center justify-end p-5 text-center">
                <p className="text-white font-extrabold text-xl leading-tight">
                  {isBoy ? 'הגיבור שלך' : 'הגיבורה שלך'}
                </p>
                <p className="text-white/70 text-xs mt-1.5">מחכה להיחשף</p>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--c-border)] shadow-sm text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[var(--c-brand-light)] flex items-center justify-center text-lg">🃏</div>
              <p className="text-[var(--c-brand-text)] font-bold text-sm mb-1">20 קלפים מותאמים</p>
              <p className="text-[var(--c-mid)] text-xs leading-relaxed">כל דמות שתבחרו תהפוך לקלף עם הפנים של הילד/ה שלכם</p>
            </div>

            {/* Progress mini */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--c-border)] shadow-sm text-center">
              <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="#e7e0d5" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke={isComplete ? '#16a34a' : '#5b21b6'} strokeWidth="3" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - progress / 100)} strokeLinecap="round" className="transition-all duration-500" />
                </svg>
                <span className={`absolute text-sm font-extrabold ${isComplete ? 'text-green-600' : 'text-[var(--c-brand)]'}`}>{total}/20</span>
              </div>
              <p className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-[var(--c-brand-text)]'}`}>
                {isComplete ? 'מוכן!' : `נותרו ${20 - total}`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Custom Characters — Premium Box ────────────────────────────── */}
        <div className="mt-12 mb-8 rounded-3xl border border-[var(--c-brand-mid)]/20 bg-gradient-to-br from-[var(--c-brand-light)]/60 via-white to-[var(--c-brand-light)]/30 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--c-brand)] flex items-center justify-center text-white text-lg">✨</div>
            <div>
              <h3 className="text-lg font-extrabold text-[var(--c-brand-text)]">רוצים דמויות שלא מופיעות כאן?</h3>
              <p className="text-xs text-[var(--c-mid)]">הוסיפו עד {CUSTOM_SLOTS} דמויות מותאמות אישית</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {customInputs.map((val, i) => {
              const id = `custom-${i}`;
              const isSelected = selectedIds.has(id);
              const isFull = total >= 20 && !isSelected;
              return (
                <div
                  key={i}
                  className={`
                    relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 border
                    ${isSelected
                      ? 'bg-white ring-2 ring-[var(--c-brand)] border-[var(--c-brand)] shadow-md'
                      : 'bg-white/80 border-[var(--c-border)] hover:border-[var(--c-brand-mid)]/40 hover:shadow-sm'}
                  `}
                >
                  <span className={`
                    w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0
                    ${isSelected ? 'bg-[var(--c-brand)] text-white' : 'bg-[var(--c-brand-light)] text-[var(--c-brand-text)]'}
                  `}>
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--c-muted)] placeholder:font-normal"
                    placeholder={`דמות מותאמת ${i + 1}`}
                    value={val}
                    disabled={isFull && !val}
                    onChange={(e) => handleCustomChange(i, e.target.value)}
                    dir="rtl"
                  />
                  {isSelected && (
                    <div className="w-5 h-5 bg-[var(--c-brand)] rounded-full flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Bar ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-t border-[var(--c-border)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4" dir="rtl">
          {/* Progress — mobile only (desktop has sidebar) */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center lg:hidden">
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

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/details')}
              className="px-5 py-3 rounded-full text-sm font-bold text-[var(--c-brand)] border border-[var(--c-brand)] hover:bg-[var(--c-brand-light)] transition-all"
            >
              חזור
            </button>
            <button
              onClick={() => router.push('/upload')}
              disabled={!isComplete}
              className={`
                px-8 py-3 rounded-full text-sm font-bold transition-all duration-300
                ${isComplete
                  ? 'bg-gradient-to-l from-[var(--c-brand)] to-[var(--c-brand-mid)] text-white shadow-[0_4px_20px_rgba(91,33,182,0.35)] hover:shadow-[0_6px_28px_rgba(91,33,182,0.45)] hover:scale-[1.02]'
                  : 'bg-[var(--c-border)] text-[var(--c-muted)] cursor-not-allowed'}
              `}
            >
              {isComplete ? '✨ בואו נעלה תמונות' : 'בואו נעלה תמונות'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
