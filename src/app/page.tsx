import Link from 'next/link';
import Image from 'next/image';

const HOW_IT_WORKS = [
  {
    num: '01',
    icon: 'upload_file',
    title: 'מזינים פרטים ובוחרים דמויות',
    body: 'בוחרים שם, גיל ומין — ואז בוחרים 20 דמויות שאהובות על הילד: גיבורי-על, מקצועות, דמויות מסרטים ועוד.',
  },
  {
    num: '02',
    icon: 'auto_awesome',
    title: 'מעלים 15 תמונות פנים',
    body: 'מעלים תמונות ברורות של הפנים, ה-AI לומד את הפנים של הילד ויוצר דמויות שנראות ממש כמוהו.',
  },
  {
    num: '03',
    icon: 'auto_stories',
    title: 'מקבלים קלפים מדהימים',
    body: 'ה-AI מייצר תמונות קולנועיות באיכות גבוהה, ואנחנו מדפיסים את הקלפים ושולחים אליכם הביתה.',
  },
];

const WHY_FEATURES = [
  { icon: 'verified', text: 'הפנים שלו — על הגיבורים שלו' },
  { icon: 'local_shipping', text: 'הדפסת פרימיום + משלוח עד הבית' },
];

const WHY_CARDS = [
  {
    title: 'צחוק מובטח',
    body: 'לראות את הילד כספיידרמן, כאסטרונאוט או כשף? זה משחק שמצחיק ומרגש בכל פעם מחדש.',
  },
  {
    title: 'המתנה המושלמת',
    body: 'יום הולדת, חנוכה, פסח — או סתם כי אפשר. מתנה שאי-אפשר לקנות בשום חנות.',
  },
];

const GALLERY_IMAGES = [
  { src: '/example (1).jpg', alt: 'קלף משחק זיכרון 1', title: 'גיבורי-על', desc: 'הילד שלכם כגיבור-על אמיתי בסגנון קולנועי.' },
  { src: '/example (2).jpg', alt: 'קלף משחק זיכרון 2', title: 'דמויות אהובות', desc: 'החיבור המושלם בין דמיון למציאות.' },
  { src: '/example (3).jpg', alt: 'קלף משחק זיכרון 3', title: 'מקצועות', desc: 'כל קלף הוא רגע קסום שנשאר לתמיד.' },
  { src: '/example (4).jpg', alt: 'קלף משחק זיכרון 4' },
  { src: '/example (5).png', alt: 'קלף משחק זיכרון 5' },
  { src: '/example (6).png', alt: 'קלף משחק זיכרון 6' },
];

export default function HomePage() {
  return (
    <div className="home-page" dir="rtl">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-logo-mark">
          <Image src="/logo.png" alt="MemoReals" width={100} height={100} priority />
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

        {/* ── Flipping cards animation ── */}
        <div className="hero-cards-row">
          {GALLERY_IMAGES.slice(0, 4).map((img, i) => (
            <div key={img.src} className="flip-card" style={{ animationDelay: `${i * 0.8}s` }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <Image src="/logo.png" alt="MemoReals" width={60} height={60} />
                </div>
                <div className="flip-card-back">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/details" className="btn-hero-cta">
          צרו את המשחק שלכם &larr;
        </Link>
        <p className="hero-note">350 ₪ כולל משלוח · מתאים לגילאים 2–99</p>
      </section>

      {/* ── Gallery ── */}
      <section className="gallery-section">
        <div className="gallery-inner">
          <span className="section-eyebrow">הקלפים שלנו</span>
          <h2 className="section-title">כך נראית המתנה</h2>
          <p className="section-sub">כל קלף בגודל 8.9×6.4 ס&quot;מ — הדפסת פרימיום, סגנון קולנועי</p>
          <div className="gallery-grid">
            {GALLERY_IMAGES.slice(0, 3).map((img) => (
              <div key={img.src} className="gallery-card">
                <div className="gallery-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
                {img.title && (
                  <div className="gallery-card-body">
                    <h3>{img.title}</h3>
                    <p>{img.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="how-inner">
          <div className="how-header">
            <h2>שלושה צעדים פשוטים</h2>
            <div className="how-header-line" />
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="how-card">
                <div className="how-num">{step.num}</div>
                <div className="how-icon">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      <section className="why-section">
        <div className="why-glow" />
        <div className="why-inner">
          <div className="why-content">
            <h2>למה לבחור ב-<span className="accent">MemoReals</span>?</h2>
            <p>
              אנחנו הופכים את הסיפורים היפים ביותר שלכם ליצירות אמנות מוחשיות.
              ה-AI לומד את הפנים של הילד ומרכיב אותן על גיבורי-על, מלכות ומקצועות בצורה שנראית אמיתית לגמרי.
            </p>
            <div className="why-features">
              {WHY_FEATURES.map((f) => (
                <div key={f.icon} className="why-feature">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="why-cards">
            {WHY_CARDS.map((card) => (
              <div key={card.title} className="why-card">
                <h4>{card.title}</h4>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-title">מוכנים להפתיע?</h2>
        <p className="cta-sub">תהליך ההזמנה לוקח פחות מ-5 דקות. הצטרפו למאות משפחות שכבר שומרות על הזיכרונות שלהן בדרך הכי יפה שיש.</p>
        <Link href="/details" className="btn-hero-cta">
          התחילו עכשיו &larr;
        </Link>
        <p className="cta-social-proof">500+ משפחות כבר הזמינו</p>
      </section>

    </div>
  );
}
