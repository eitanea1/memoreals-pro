'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const ENGLISH_ONLY = /^[A-Za-z\s]+$/;
const CUSTOM_SLOTS = 5;

type CategoryFilter = 'all' | 'superheroes' | 'anime' | 'adventures' | 'premium';
type GenderOption = 'Male' | 'Female';

const TABS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'הכל' },
  { key: 'superheroes', label: 'גיבורי על' },
  { key: 'anime', label: 'אגדות ואנימה' },
  { key: 'adventures', label: 'הרפתקאות' },
  { key: 'premium', label: 'מקצועות/אחר' },
];

export default function DetailsAndCharactersPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  // Fresh-start reset: if a previous order was already submitted (orderId set),
  // wipe all stale state so the new order starts clean.
  useEffect(() => {
    if (state.orderId !== null) {
      dispatch({ type: 'RESET' });
    }
    // intentional: run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persona form
  const [name, setName] = useState(state.subjectName);
  const [age, setAge] = useState(state.subjectAge);
  const [gender, setGender] = useState<GenderOption | ''>((state.subjectGender as GenderOption) || '');
  const [nameTouched, setNameTouched] = useState(false);

  // Character filters
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');

  // Custom character inputs
  const [customInputs, setCustomInputs] = useState<string[]>(() => {
    const existing = state.selectedCharacters
      .filter((c) => c.id.startsWith('custom-'))
      .map((c) => c.displayName);
    return Array.from({ length: CUSTOM_SLOTS }, (_, i) => existing[i] ?? '');
  });

  // Persona validation
  const nameIsValid = name.trim().length > 0 && ENGLISH_ONLY.test(name.trim());
  const nameError = nameTouched && name.trim().length > 0 && !ENGLISH_ONLY.test(name.trim());
  const ageNum = parseInt(age, 10);
  const ageIsValid = age.trim().length > 0 && ageNum >= 1 && ageNum <= 120;
  const detailsValid = nameIsValid && ageIsValid && gender.length > 0;

  // Persona-aware character lists. We split the set by age so the same hero
  // doesn't appear twice (once as kid-version, once as adult-version): ages
  // 12 and under get the kid-style images, 13+ get the adult-style images.
  // Empty arrays until both gender and a valid age are provided.
  const isBoy = gender === 'Male';
  const isAdult = ageIsValid && ageNum >= 13;
  const showCharacters = gender !== '' && ageIsValid;

  const heroes: Character[] = !showCharacters
    ? []
    : isAdult
      ? (isBoy ? MEN_HEROES : WOMEN_HEROES)
      : (isBoy ? BOYS_HEROES : GIRLS_HEROES);
  const anime: Character[] = !showCharacters
    ? []
    : isAdult
      ? [] // adults don't have a separate anime category
      : (isBoy ? BOYS_ANIME : GIRLS_ANIME);
  const adventures: Character[] = !showCharacters
    ? []
    : isAdult
      ? (isBoy ? MEN_ADVENTURES : WOMEN_ADVENTURES)
      : (isBoy ? BOYS_ADVENTURES : GIRLS_ADVENTURES);
  const premium: Character[] = !showCharacters
    ? []
    : isAdult
      ? (isBoy ? MEN_PROFESSIONS : WOMEN_PROFESSIONS)
      : (isBoy ? BOYS_PREMIUM : GIRLS_PREMIUM);

  const selectedIds = new Set(state.selectedCharacters.map((c) => c.id));
  const total = state.selectedCharacters.length;
  const isComplete = total === 20;
  const progress = (total / 20) * 100;
  const canProceed = detailsValid && isComplete;

  function filterBySearch(list: Character[]): Character[] {
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (c) => c.displayName.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }

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
      dispatch({
        type: 'SELECT_CHARACTER',
        character: { id: prevId, name: trimmed, displayName: trimmed, category: 'premium' },
      });
    }
  }

  function clearAllCharacters() {
    state.selectedCharacters.forEach((c) =>
      dispatch({ type: 'DESELECT_CHARACTER', id: c.id }),
    );
  }

  function handleGenderChange(newGender: GenderOption) {
    // When gender flips, the previously-picked characters belong to the other set —
    // clear them so the user starts the picks fresh for the new persona.
    if (gender && gender !== newGender) clearAllCharacters();
    setGender(newGender);
  }

  function handleAgeChange(newAge: string) {
    // If age crosses the kid/adult boundary (12 to 13 or vice versa), the
    // character grid switches between kid-style and adult-style images, so any
    // previously-picked characters now have IDs that don't exist in the new
    // visible grid. Clear so the counter and grid stay in sync.
    const newAgeNum = parseInt(newAge, 10);
    const oldAgeNum = parseInt(age, 10);
    const wasAdult = !isNaN(oldAgeNum) && oldAgeNum >= 13;
    const willBeAdult = !isNaN(newAgeNum) && newAgeNum >= 13;
    if (!isNaN(oldAgeNum) && !isNaN(newAgeNum) && wasAdult !== willBeAdult) {
      clearAllCharacters();
    }
    setAge(newAge);
  }

  function handleNext() {
    dispatch({
      type: 'SET_PERSONAL_DETAILS',
      name: name.trim(),
      age: age.trim(),
      gender,
      email: state.customerEmail,
      phone: state.customerPhone,
      note: state.customerNote,
    });
    router.push('/upload');
  }

  return (
    <div className="min-h-screen pb-32" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <StepIndicator current={0} />

        {/* ── Hero header ── */}
        <div className="text-center mt-8 mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-1)] mb-3 tracking-tight" style={{ letterSpacing: '-0.025em' }}>
            בואו ניצור משחק לילד שלכם
          </h1>
          <p className="text-base text-[var(--ink-2)] max-w-xl mx-auto leading-relaxed">
            ספרו לנו על הילד/ה ובחרו 20 דמויות. הדמויות שלכם יהפכו לקלפים מודפסים עם הפנים האמיתיות.
          </p>
        </div>

        {/* ── Compact details form ── */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 sm:p-6 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Gender (toggle) */}
            <div className="field-group">
              <span className="field-label">סגנון הדמויות <span className="required">*</span></span>
              <div className="gender-grid">
                <label className="gender-card-label">
                  <input type="radio" name="gender" className="sr-only" checked={gender === 'Male'} onChange={() => handleGenderChange('Male')} />
                  <div className={`gender-card ${gender === 'Male' ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined gender-icon" aria-hidden="true">face</span>
                    <span className="gender-text">ילד</span>
                  </div>
                </label>
                <label className="gender-card-label">
                  <input type="radio" name="gender" className="sr-only" checked={gender === 'Female'} onChange={() => handleGenderChange('Female')} />
                  <div className={`gender-card ${gender === 'Female' ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined gender-icon" aria-hidden="true">face_3</span>
                    <span className="gender-text">ילדה</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="field-group">
              <label className="field-label" htmlFor="child-name">
                שם (באנגלית) <span className="required">*</span>
              </label>
              <input
                id="child-name"
                type="text"
                className={`field-input ${nameError ? 'error' : ''}`}
                placeholder="e.g. Emma"
                value={name}
                dir="ltr"
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setNameTouched(true)}
              />
              {nameError && (
                <p className="field-error">יש להזין את השם באנגלית בלבד (עבור עיצובי ה-AI)</p>
              )}
            </div>

            {/* Age */}
            <div className="field-group">
              <label className="field-label" htmlFor="child-age">
                גיל <span className="required">*</span>
              </label>
              <input
                id="child-age"
                type="number"
                className="field-input"
                placeholder="לדוגמה: 7"
                min={1}
                max={120}
                value={age}
                dir="ltr"
                onChange={(e) => handleAgeChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Empty state: pick gender + age first ── */}
        {!showCharacters && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-2)] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[var(--accent)]" aria-hidden="true">touch_app</span>
            </div>
            <p className="text-base text-[var(--ink-2)]">
              {!gender
                ? <>בחרו <strong className="text-[var(--ink-1)]">ילד</strong> או <strong className="text-[var(--ink-1)]">ילדה</strong> וגם <strong className="text-[var(--ink-1)]">גיל</strong> למעלה כדי לראות את הדמויות הזמינות</>
                : <>מלאו את <strong className="text-[var(--ink-1)]">הגיל</strong> כדי לראות את הדמויות המתאימות</>}
            </p>
          </div>
        )}

        {/* ── Character section (only shown after gender + age are filled) ── */}
        {showCharacters && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--ink-1)] mb-2" style={{ letterSpacing: '-0.02em' }}>
                בחרו 20 דמויות
              </h2>
              <p className="text-sm text-[var(--ink-2)]">
                כל דמות תהפוך לקלף עם הפנים של {name || (isBoy ? 'הילד' : 'הילדה') + ' שלכם'}
              </p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-3)] pointer-events-none" style={{ fontSize: '20px' }} aria-hidden="true">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חיפוש דמות... (למשל: ספיידרמן, שף, טייס)"
                  className="w-full pr-12 pl-4 py-3 rounded-full border border-[var(--line)] bg-[var(--surface)] text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 transition-all"
                />
              </div>
            </div>

            {/* Tabs */}
            <nav className="flex justify-center gap-2 mb-10 overflow-x-auto py-1 no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap
                    ${filter === tab.key
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'bg-[var(--surface)] text-[var(--ink-1)] border border-[var(--line)] hover:bg-[var(--bg-2)]'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Character grids */}
            <div className="flex-1 min-w-0">
              {(filter === 'all' || filter === 'superheroes') && filterBySearch(heroes).length > 0 && (
                <CategoryList title="גיבורי על" characters={filterBySearch(heroes)} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
              )}
              {(filter === 'all' || filter === 'anime') && filterBySearch(anime).length > 0 && (
                <CategoryList title="אגדות ואנימה" characters={filterBySearch(anime)} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
              )}
              {(filter === 'all' || filter === 'adventures') && filterBySearch(adventures).length > 0 && (
                <CategoryList title="הרפתקאות" characters={filterBySearch(adventures)} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
              )}
              {(filter === 'all' || filter === 'premium') && filterBySearch(premium).length > 0 && (
                <CategoryList title="מקצועות/אחר" characters={filterBySearch(premium)} selectedIds={selectedIds} totalSelected={total} onToggle={handleToggle} />
              )}
              {search.trim() && filterBySearch(heroes).length === 0 && filterBySearch(anime).length === 0 && filterBySearch(adventures).length === 0 && filterBySearch(premium).length === 0 && (
                <div className="text-center py-12 text-[var(--ink-3)]">
                  <span className="material-symbols-outlined text-4xl mb-2 block" aria-hidden="true">search_off</span>
                  <p className="text-sm">לא נמצאו דמויות התואמות לחיפוש &ldquo;{search}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Custom characters block */}
            <div className="mt-12 mb-8 rounded-3xl border border-[var(--line)] bg-[var(--bg-2)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white text-lg" aria-hidden="true">✨</div>
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--ink-1)]">רוצים דמויות שלא מופיעות כאן?</h3>
                  <p className="text-xs text-[var(--ink-2)]">הוסיפו עד {CUSTOM_SLOTS} דמויות מותאמות אישית</p>
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
                      className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 border
                        ${isSelected
                          ? 'bg-[var(--surface)] ring-2 ring-[var(--accent)] border-[var(--accent)] shadow-md'
                          : 'bg-[var(--surface)]/80 border-[var(--line)] hover:border-[var(--accent)]/40 hover:shadow-sm'}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0
                        ${isSelected ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-3)] text-[var(--ink-1)]'}`}>
                        {i + 1}
                      </span>
                      <input
                        type="text"
                        className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--ink-3)] placeholder:font-normal"
                        placeholder={`דמות מותאמת ${i + 1}`}
                        value={val}
                        disabled={isFull && !val}
                        onChange={(e) => handleCustomChange(i, e.target.value)}
                        dir="rtl"
                      />
                      {isSelected && (
                        <div className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center shrink-0" aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-1)]/90 backdrop-blur-2xl border-t border-[var(--line)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#e7e0d5" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="transparent" stroke={isComplete ? '#16a34a' : '#c66a2e'} strokeWidth="4" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - progress / 100)} strokeLinecap="round" className="transition-all duration-300" />
              </svg>
              <span className={`absolute text-xs font-bold ${isComplete ? 'text-green-600' : 'text-[var(--accent-ink)]'}`}>{total}/20</span>
            </div>
            <div>
              <p className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-[var(--ink-1)]'}`}>
                {total} / 20 דמויות
              </p>
              <p className="text-xs text-[var(--ink-2)]">
                {!gender
                  ? 'בחרו ילד או ילדה למעלה'
                  : !ageIsValid
                  ? 'הזינו גיל למעלה'
                  : !nameIsValid
                  ? 'הזינו שם באנגלית'
                  : isComplete
                  ? '✨ מוכן להמשיך'
                  : `בחרו עוד ${20 - total} דמויות`}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-7 sm:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300
                ${canProceed
                  ? 'bg-[var(--accent)] text-white shadow-md hover:bg-[var(--accent-hover)] hover:scale-[1.02]'
                  : 'bg-[var(--bg-3)] text-[var(--ink-3)] cursor-not-allowed'}`}
            >
              נמשיך לתמונות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
