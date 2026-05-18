import Link from 'next/link';

export const metadata = { title: 'צור קשר — MemoReals' };

export default function ContactPage() {
  return (
    <div className="contact-page" dir="rtl">
      <header className="contact-header">
        <span className="section-eyebrow-warm">צרו קשר</span>
        <h1 className="contact-h1">נשמח לשמוע מכם</h1>
        <p className="contact-lede">בחרו את הדרך הנוחה לכם. אנחנו עונים תוך יום עסקים.</p>
      </header>

      <ul className="contact-channels">
        <li>
          <a href="https://wa.me/972555707594" className="contact-channel">
            <span className="contact-channel-label">וואטסאפ</span>
            <span className="contact-channel-value">055-570-7594</span>
            <span className="contact-channel-arrow" aria-hidden="true">&larr;</span>
          </a>
        </li>
        <li>
          <a href="mailto:hello@memoreals.com" className="contact-channel">
            <span className="contact-channel-label">אימייל</span>
            <span className="contact-channel-value">hello@memoreals.com</span>
            <span className="contact-channel-arrow" aria-hidden="true">&larr;</span>
          </a>
        </li>
      </ul>

      <div className="contact-meta">
        <p><strong>שעות פעילות:</strong> ימים א׳–ה׳, 09:00–18:00</p>
        <p className="contact-meta-fine">פניות שיתקבלו מחוץ לשעות הפעילות ייענו ביום העסקים הבא.</p>
      </div>

      <div className="contact-cta">
        <p>מעדיפים פשוט להתחיל?</p>
        <Link href="/details" className="btn-primary-warm">
          <span>התחילו ליצור</span>
          <span className="btn-arrow" aria-hidden="true">&larr;</span>
        </Link>
      </div>
    </div>
  );
}
