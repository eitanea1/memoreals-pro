'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const ENGLISH_ONLY = /^[A-Za-z\s]+$/;
const PHONE_DIGITS_ONLY = /\D/g;

const STEPS = [
  { icon: 'edit_note', label: 'פרטים' },
  { icon: 'auto_fix_high', label: 'בחירת דמויות' },
  { icon: 'add_a_photo', label: 'העלאת תמונות' },
  { icon: 'local_shipping', label: 'משלוח' },
];

type GenderOption = 'Male' | 'Female';
export default function PersonalDetailsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  // If a previous order was already submitted (orderId is set), the user is
  // starting a fresh order. Wipe stale state so old character selections,
  // photos, address etc. don't leak into the new order.
  useEffect(() => {
    if (state.orderId !== null) {
      dispatch({ type: 'RESET' });
    }
    // intentional empty dep array — only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [name, setName] = useState(state.subjectName);
  const [age, setAge] = useState(state.subjectAge);
  const [gender, setGender] = useState<GenderOption | ''>((state.subjectGender as GenderOption) || '');
  const [email, setEmail] = useState(state.customerEmail);
  const [phone, setPhone] = useState(state.customerPhone || '');
  const [notes, setNotes] = useState(state.customerNote || '');
  const [consent, setConsent] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const nameIsValid = name.trim().length > 0 && ENGLISH_ONLY.test(name.trim());
  const nameError = nameTouched && name.trim().length > 0 && !ENGLISH_ONLY.test(name.trim());
  const ageNum = parseInt(age, 10);
  const ageIsValid = age.trim().length > 0 && ageNum >= 1 && ageNum <= 120;
  const phoneDigits = phone.replace(PHONE_DIGITS_ONLY, '');
  const phoneIsValid = phoneDigits.startsWith('0') && phoneDigits.length >= 9 && phoneDigits.length <= 10;
  const emailIsValid = email.trim().length > 0 && email.includes('@');
  const canProceed = nameIsValid && ageIsValid && gender.length > 0 && emailIsValid && phoneIsValid && consent;

  function handleNext() {
    // If the user changed gender (or subject name) since the last visit to
    // this page, wipe characters + photos because they were chosen for a
    // different persona. We keep the consent state local to this form and
    // re-collect it implicitly on next submit.
    const personaChanged =
      state.subjectGender !== '' && state.subjectGender !== gender;
    if (personaChanged) {
      state.selectedCharacters.forEach((c) =>
        dispatch({ type: 'DESELECT_CHARACTER', id: c.id }),
      );
      state.photos.forEach((p) =>
        dispatch({ type: 'REMOVE_PHOTO', id: p.id }),
      );
    }
    dispatch({ type: 'SET_PERSONAL_DETAILS', name: name.trim(), age: age.trim(), gender, email: email.trim(), phone: phoneDigits, note: notes.trim() });
    router.push('/characters');
  }

  return (
    <div className="details-premium" dir="rtl">

      {/* ── Journey Tracker ── */}
      <div className="journey-tracker">
        <div className="journey-line" />
        {STEPS.map((step, i) => (
          <div key={step.label} className="journey-step">
            <div className={`journey-dot ${i === 0 ? 'active' : ''}`}>
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <span className={`journey-label ${i === 0 ? 'active' : ''}`}>{step.label}</span>
          </div>
        ))}
      </div>

      {/* ── Content Grid ── */}
      <div className="details-grid">

        {/* Form Card */}
        <div className="details-form-card">
          <h1 className="details-title">פרטי המשתתף/ת</h1>
          <p className="details-subtitle">בואו נתחיל את הקסם. ספרו לנו קצת על הגיבור או הגיבורה של הסיפור.</p>

          <form className="details-form" onSubmit={(e) => e.preventDefault()}>

            {/* Name */}
            <div className="field-group">
              <label className="field-label" htmlFor="child-name">שם (באנגלית)</label>
              <input
                id="child-name"
                type="text"
                className={`field-input ${nameError ? 'error' : ''}`}
                placeholder="e.g. Emma"
                value={name}
                dir="ltr"
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setNameTouched(true)}
                autoFocus
              />
              {nameError && (
                <p className="field-error">יש להזין את השם באנגלית בלבד (עבור עיצובי ה-AI)</p>
              )}
            </div>

            {/* Character Style */}
            <div className="field-group">
              <span className="field-label">סגנון דמויות</span>
              <div className="gender-grid">
                <label className="gender-card-label">
                  <input type="radio" name="gender" className="sr-only" checked={gender === 'Male'} onChange={() => setGender('Male')} />
                  <div className={`gender-card ${gender === 'Male' ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined gender-icon">face</span>
                    <span className="gender-text">דמויות גבריות</span>
                  </div>
                </label>
                <label className="gender-card-label">
                  <input type="radio" name="gender" className="sr-only" checked={gender === 'Female'} onChange={() => setGender('Female')} />
                  <div className={`gender-card ${gender === 'Female' ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined gender-icon">face_3</span>
                    <span className="gender-text">דמויות נשיות</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Age */}
            <div className="field-group field-short">
              <label className="field-label" htmlFor="child-age">גיל</label>
              <input
                id="child-age"
                type="number"
                className="field-input"
                placeholder="לדוגמה: 7"
                min={1}
                max={120}
                value={age}
                dir="ltr"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            {/* Divider */}
            <div className="form-divider" />

            {/* Email */}
            <div className="field-group">
              <label className="field-label" htmlFor="customer-email">
                אימייל <span className="required">*</span>
              </label>
              <input
                id="customer-email"
                type="email"
                className="field-input"
                placeholder="your@email.com"
                value={email}
                dir="ltr"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="field-group">
              <label className="field-label" htmlFor="customer-phone">
                טלפון (לוואטסאפ) <span className="required">*</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="tel"
                className="field-input"
                placeholder="050-1234567"
                value={phone}
                dir="ltr"
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="field-hint">ניצור איתך קשר בוואטסאפ לאישור התשלום ועדכוני סטטוס.</p>
            </div>

            {/* Notes */}
            <div className="field-group">
              <label className="field-label" htmlFor="customer-notes">
                הערות ובקשות מיוחדות <span className="optional">(אופציונלי)</span>
              </label>
              <textarea
                id="customer-notes"
                className="field-input"
                rows={3}
                placeholder="לדוגמה: תמונות צנועות בלבד (ללא גופיות/מכנסיים קצרים), פנים עם משקפיים, שיער ארוך..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'Heebo, sans-serif' }}
              />
            </div>

            {/* Consent */}
            <div className="field-group">
              <label className="consent-row">
                <input
                  type="checkbox"
                  className="consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span className="consent-text">
                  אני ההורה או האפוטרופוס, ומאשר/ת את העלאת תמונות הילד/ה ל-MemoReals
                  לצורך יצירת המשחק. קראתי ואני מסכים/ה ל
                  <Link href="/terms" target="_blank" className="consent-link">תנאי השימוש</Link>
                  {' '}ול
                  <Link href="/privacy" target="_blank" className="consent-link">מדיניות הפרטיות</Link>.
                </span>
              </label>
            </div>

            {/* CTA */}
            <div className="details-cta-wrap">
              <button
                type="button"
                className="details-cta"
                disabled={!canProceed}
                onClick={handleNext}
              >
                בואו נבחר את הדמויות
                <span className="material-symbols-outlined cta-arrow">arrow_back</span>
              </button>
              {!canProceed && (
                <p className="details-hint">יש למלא את כל השדות ולאשר את התנאים כדי להמשיך</p>
              )}
            </div>
          </form>
        </div>

        {/* Hero Illustration (Desktop) */}
        <div className="details-hero-side">
          <div className="details-hero-glow-1" />
          <div className="details-hero-glow-2" />
          <div className="details-hero-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/example (1).jpg" alt="דוגמה לקלף" className="details-hero-img" />
            <div className="details-hero-overlay" />
          </div>
          <div className="details-floating-quote">
            <p>&ldquo;כל אחד הוא גיבור בסיפור משלו&rdquo;</p>
          </div>
        </div>

      </div>
    </div>
  );
}
