'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const STEPS = [
  { icon: 'edit_note', label: 'פרטים' },
  { icon: 'auto_fix_high', label: 'בחירת דמויות' },
  { icon: 'add_a_photo', label: 'העלאת תמונות' },
  { icon: 'local_shipping', label: 'משלוח' },
];

export default function ShippingPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  const [recipientName, setRecipientName] = useState(state.recipientName);
  const [street, setStreet] = useState(state.shippingStreet);
  const [apartment, setApartment] = useState(state.shippingApartment);
  const [city, setCity] = useState(state.shippingCity);
  const [postalCode, setPostalCode] = useState(state.shippingPostalCode);
  const [notes, setNotes] = useState(state.shippingNotes);

  const recipientValid = recipientName.trim().length >= 2;
  const streetValid = street.trim().length >= 3;
  const cityValid = city.trim().length >= 2;
  const canProceed = recipientValid && streetValid && cityValid;

  function handleNext() {
    dispatch({
      type: 'SET_SHIPPING_ADDRESS',
      recipientName: recipientName.trim(),
      street: street.trim(),
      apartment: apartment.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      notes: notes.trim(),
    });
    router.push('/summary');
  }

  return (
    <div className="details-premium" dir="rtl">

      {/* ── Journey Tracker ── */}
      <div className="journey-tracker">
        <div className="journey-line" />
        {STEPS.map((step, i) => (
          <div key={step.label} className="journey-step">
            <div className={`journey-dot ${i === 3 ? 'active' : i < 3 ? 'active' : ''}`}>
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <span className={`journey-label ${i === 3 ? 'active' : ''}`}>{step.label}</span>
          </div>
        ))}
      </div>

      <div className="details-grid">

        {/* Form Card */}
        <div className="details-form-card">
          <h1 className="details-title">לאן לשלוח?</h1>
          <p className="details-subtitle">המשחק יגיע אליך הביתה תוך 14 ימי עסקים. מלא את פרטי המשלוח.</p>

          <form className="details-form" onSubmit={(e) => e.preventDefault()}>

            {/* Recipient name */}
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
                autoFocus
              />
              <p className="field-hint">השם שיופיע על האריזה ובמשלוח.</p>
            </div>

            {/* Street */}
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

            {/* Apartment (optional) */}
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

            {/* City */}
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

            {/* Postal code (optional) */}
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

            <div className="form-divider" />

            {/* Notes */}
            <div className="field-group">
              <label className="field-label" htmlFor="shipping-notes">
                הערות לשליח <span className="optional">(אופציונלי)</span>
              </label>
              <textarea
                id="shipping-notes"
                className="field-input"
                rows={2}
                placeholder="לדוגמה: השאר אצל השכנים בדירה 3, או התקשרו לפני הגעה"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical', minHeight: '70px', fontFamily: 'Heebo, sans-serif' }}
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
                המשך לסיכום ההזמנה
                <span className="material-symbols-outlined cta-arrow">arrow_back</span>
              </button>
              {!canProceed && (
                <p className="details-hint">יש למלא שם מקבל, רחוב + מספר בית, ועיר כדי להמשיך</p>
              )}
            </div>
          </form>
        </div>

        {/* Hero Side (Desktop) */}
        <div className="details-hero-side">
          <div className="details-hero-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gallery/product-2.jpg" alt="המשחק בעולם האמיתי" className="details-hero-img" />
          </div>
          <div className="details-floating-quote">
            <p>&ldquo;חבילה ממותגת, ישר עד פתח הבית&rdquo;</p>
          </div>
        </div>

      </div>
    </div>
  );
}
