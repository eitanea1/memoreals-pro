import Link from 'next/link';
import Image from 'next/image';

const HOW_IT_WORKS = [
  {
    num: '01',
    icon: '🧒',
    title: 'מזינים פרטים ובוחרים דמויות',
    body: 'בוחרים שם, גיל ומין — ואז בוחרים 20 דמויות שאהובות על הילד: גיבורי-על, מקצועות, דמויות מסרטים ועוד.',
  },
  {
    num: '02',
    icon: '📸',
    title: 'מעלים 15 תמונות פנים',
    body: 'מעלים תמונות ברורות של הפנים, ה-AI לומד את הפנים של הילד ויוצר דמויות שנראות ממש כמוהו.',
  },
  {
    num: '03',
    icon: '✨',
    title: 'מקבלים קלפים מדהימים',
    body: 'ה-AI מייצר תמונות קולנועיות באיכות גבוהה, ואנחנו מדפיסים את הקלפים ושולחים אליכם הביתה.',
  },
];

const WHY_ITEMS = [
  {
    icon: '🎭',
    title: 'הפנים שלו — על הגיבורים שלו',
    body: 'ה-AI לומד את הפנים של הילד ומרכיב אותן על גיבורי-על, מלכות ומקצועות בצורה שנראית אמיתית לגמרי.',
  },
  {
    icon: '🖨️',
    title: 'הדפסת פרימיום',
    body: 'קלפים עמידים בגודל 8.9×6.4 ס"מ, מצולמים בסגנון קולנועי. מתנה שתישאר בתיבה לשנים.',
  },
  {
    icon: '😂',
    title: 'צחוק מובטח',
    body: 'לראות את הילד כספיידרמן, כאסטרונאוט או כשף? זה משחק שמצחיק ומרגש בכל פעם מחדש.',
  },
  {
    icon: '🎁',
    title: 'המתנה המושלמת',
    body: 'יום הולדת, חנוכה, פסח — או סתם כי אפשר. מתנה שאי-אפשר לקנות בשום חנות.',
  },
];

const GALLERY_IMAGES = [
  { src: '/example (1).jpg', alt: 'קלף משחק זיכרון 1' },
  { src: '/example (2).jpg', alt: 'קלף משחק זיכרון 2' },
  { src: '/example (3).jpg', alt: 'קלף משחק זיכרון 3' },
  { src: '/example (4).jpg', alt: 'קלף משחק זיכרון 4' },
  { src: '/example (5).png', alt: 'קלף משחק זיכרון 5' },
  { src: '/example (6).png', alt: 'קלף משחק זיכרון 6' },
];

export default function HomePage() {
  return (
    <div className="home-page" dir="rtl">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-logo-mark">
          <Image src="/logo.svg" alt="MemoReals" width={42} height={42} priority />
        </div>
        <div className="hero-badge">✨ מופעל על ידי AI מתקדם</div>
        <h1 className="hero-headline">
          הילד שלך<br />
          <span className="hero-headline-accent">כגיבור אמיתי</span>
        </h1>
        <p className="hero-hook">
          משחק זיכרון מותאם אישית — הפנים שלו, על כל דמות שיבחר.<br />
          ספיידרמן, אסטרונאוט, שף, קפטן אמריקה — הכל בהדפסת פרימיום.
        </p>
        <Link href="/details" className="btn-hero-cta">
          צרו את המשחק שלכם &larr;
        </Link>
        <p className="hero-note">מתאים לגילאים 2–99 · משלוח לכל הארץ</p>
      </section>

      {/* ── Gallery ── */}
      <section className="gallery-section">
        <div className="section-eyebrow">הקלפים שלנו</div>
        <h2 className="section-title">כך נראית המתנה</h2>
        <p className="section-sub">כל קלף בגודל 8.9×6.4 ס&quot;מ — הדפסת פרימיום, סגנון קולנועי</p>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img) => (
            <div key={img.src} className="gallery-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="section-eyebrow">איך זה עובד</div>
        <h2 className="section-title">שלושה צעדים פשוטים</h2>
        <div className="how-grid">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.num} className="how-card">
              <div className="how-num">{step.num}</div>
              <div className="how-icon">{step.icon}</div>
              <h3 className="how-title">{step.title}</h3>
              <p className="how-body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why ── */}
      <section className="why-section">
        <div className="section-eyebrow">למה MemoReals</div>
        <h2 className="section-title">לא סתם מתנה</h2>
        <div className="why-grid">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="why-card">
              <div className="why-icon">{item.icon}</div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <Image src="/logo.svg" alt="" width={52} height={52} className="cta-logo" />
        <h2 className="cta-title">מוכנים להפתיע?</h2>
        <p className="cta-sub">תהליך ההזמנה לוקח פחות מ-5 דקות</p>
        <Link href="/details" className="btn-hero-cta">
          התחילו עכשיו &larr;
        </Link>
      </section>

    </div>
  );
}
