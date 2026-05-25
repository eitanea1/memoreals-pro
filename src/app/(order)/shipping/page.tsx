'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import StepIndicator from '@/components/shared/StepIndicator';

const PHONE_DIGITS_ONLY = /\D/g;

export default function ShippingPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  // Contact details (moved here from old /details)
  const [email, setEmail] = useState(state.customerEmail);
  const [phone, setPhone] = useState(state.customerPhone || '');
  const [notes, setNotes] = useState(state.customerNote || '');
  const [consent, setConsent] = useState(false);

  // Shipping fields
  const [recipientName, setRecipientName] = useState(state.recipientName);
  const [street, setStreet] = useState(state.shippingStreet);
  const [apartment, setApartment] = useState(state.shippingApartment);
  const [city, setCity] = useState(state.shippingCity);
  const [postalCode, setPostalCode] = useState(state.shippingPostalCode);
  const [shippingNotes, setShippingNotes] = useState(state.shippingNotes);

  // Validation
  const emailIsValid = email.trim().length > 0 && email.includes('@');
  const phoneDigits = phone.replace(PHONE_DIGITS_ONLY, '');
  const phoneIsValid = phoneDigits.startsWith('0') && phoneDigits.length >= 9 && phoneDigits.length <= 10;
  const recipientValid = recipientName.trim().length >= 2;
  const streetValid = street.trim().length >= 3;
  const cityValid = city.trim().length >= 2;
  const canProceed = emailIsValid && phoneIsValid && recipientValid && streetValid && cityValid && consent;

  function handleNext() {
    // Persist customer contact details, keeping persona fields from the previous step.
    dispatch({
      type: 'SET_PERSONAL_DETAILS',
      name: state.subjectName,
      age: state.subjectAge,
      gender: state.subjectGender,
      email: email.trim(),
      phone: phoneDigits,
      note: notes.trim(),
    });
    dispatch({
      type: 'SET_SHIPPING_ADDRESS',
      recipientName: recipientName.trim(),
      street: street.trim(),
      apartment: apartment.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      notes: shippingNotes.trim(),
    });
    router.push('/summary');
  }

  return (
    <div className="page" dir="rtl">
      <StepIndicator current={2} />

      <div className="details-form-card" style={{ marginTop: '1.5rem' }}>
        <h1 className="details-title">משלוח ויצירת קשר</h1>
        <p className="details-subtitle">איך נשיג אותך, ולאן לשלוח את המשחק.</p>

        <form className="details-form" onSubmit={(e) => e.preventDefault()}>

          {/* ── Contact ── */}
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
            <p className="field-hint">נשלח את אישור ההזמנה לכתובת זו.</p>
          </div>

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

          <div className="form-divider" />

          {/* ── Shipping address ── */}
          <div className="field-group">
            <label className="field-label" htmlFor="recipient-name">
              שם המקבל <span className="required">*</span>
            </label>
            <input
              id="recipient-name"
              type="text"
              className="field-input"
              placeholder="שם פרטי + משפחה"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <p className="field-hint">השם שיופיע על האריזה ובמשלוח.</p>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="shipping-street">
              רחוב ומספר בית <span className="required">*</span>
            </label>
            <input
              id="shipping-street"
              type="text"
              className="field-input"
              placeholder="לדוגמה: הרצל 25"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="shipping-apartment">
              דירה / כניסה <span className="optional">(אופציונלי)</span>
            </label>
            <input
              id="shipping-apartment"
              type="text"
              className="field-input"
              placeholder="לדוגמה: דירה 4, כניסה ב"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="shipping-city">
              עיר <span className="required">*</span>
            </label>
            <input
              id="shipping-city"
              type="text"
              className="field-input"
              placeholder="לדוגמה: תל אביב"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="field-group field-short">
            <label className="field-label" htmlFor="shipping-postal">
              מיקוד <span className="optional">(אופציונלי)</span>
            </label>
            <input
              id="shipping-postal"
              type="text"
              inputMode="numeric"
              className="field-input"
              placeholder="לדוגמה: 6100002"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="shipping-notes">
              הערות לשליח <span className="optional">(אופציונלי)</span>
            </label>
            <textarea
              id="shipping-notes"
              className="field-input"
              rows={2}
              placeholder="לדוגמה: השאר אצל השכנים בדירה 3, או התקשרו לפני הגעה"
              value={shippingNotes}
              onChange={(e) => setShippingNotes(e.target.value)}
              style={{ resize: 'vertical', minHeight: '70px', fontFamily: 'Heebo, sans-serif' }}
            />
          </div>

          <div className="form-divider" />

          {/* ── Order notes ── */}
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
              המשך לסיכום ההזמנה
              <span className="material-symbols-outlined cta-arrow" aria-hidden="true">arrow_back</span>
            </button>
            {!canProceed && (
              <p className="details-hint">יש למלא את כל השדות החובה ולאשר את התנאים כדי להמשיך</p>
            )}
          </div>
        </form>
      </div>

      <div className="nav-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push('/upload')}
        >
          → חזור לתמונות
        </button>
      </div>
    </div>
  );
}
