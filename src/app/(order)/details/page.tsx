'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const ENGLISH_ONLY = /^[A-Za-z\s]+$/;

const STEPS = [
  { icon: 'edit_note', label: 'פרטים' },
  { icon: 'auto_fix_high', label: 'בחירת דמויות' },
  { icon: 'add_a_photo', label: 'העלאת תמונות' },
];

type GenderOption = 'Male' | 'Female';
export default function PersonalDetailsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  const [name, setName] = useState(state.subjectName);
  const [age, setAge] = useState(state.subjectAge);
  const [gender, setGender] = useState<GenderOption | ''>((state.subjectGender as GenderOption) || '');
  const [email, setEmail] = useState(state.customerEmail);
  const [nameTouched, setNameTouched] = useState(false);

  const nameIsValid = name.trim().length > 0 && ENGLISH_ONLY.test(name.trim());
  const nameError = nameTouched && name.trim().length > 0 && !ENGLISH_ONLY.test(name.trim());
  const ageNum = parseInt(age, 10);
  const ageIsValid = age.trim().length > 0 && ageNum >= 1 && ageNum <= 120;
  const canProceed = nameIsValid && ageIsValid && gender.length > 0 && email.trim().length > 0;

  function handleNext() {
    dispatch({ type: 'SET_PERSONAL_DETAILS', name: name.trim(), age: age.trim(), gender, email: email.trim(), phone: '' });
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

            {/* Gender */}
            <div className="field-group">
              <span className="field-label">מגדר</span>
              <div className="gender-grid">
                <label className="gender-card-label">
                  <input type="radio" name="gender" className="sr-only" checked={gender === 'Male'} onChange={() => setGender('Male')} />
                  <div className={`gender-card ${gender === 'Male' ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined gender-icon">face</span>
                    <span className="gender-text">זכר</span>
                  </div>
                </label>
                <label className="gender-card-label">
                  <input type="radio" name="gender" className="sr-only" checked={gender === 'Female'} onChange={() => setGender('Female')} />
                  <div className={`gender-card ${gender === 'Female' ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined gender-icon">face_3</span>
                    <span className="gender-text">נקבה</span>
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
                <p className="details-hint">יש למלא שם, מגדר, גיל ואימייל כדי להמשיך</p>
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
