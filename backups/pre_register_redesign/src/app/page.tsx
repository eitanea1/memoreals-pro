import Link from 'next/link';
import Image from 'next/image';

const HOW_IT_WORKS = [
  {
    num: '01',
    icon: 'upload_file',
    title: 'בוחרים חבילה ודמויות',
    body: 'בוחרים את החבילה, מזינים פרטים ובוחרים 20 דמויות מתוך מאות אפשרויות.',
  },
  {
    num: '02',
    icon: 'auto_awesome',
    title: 'מעלים 15 תמונות פנים',
    body: 'מעלים תמונות ברורות של הפנים, ה-AI לומד אותן ויוצר דמויות שנראות ממש כמו המקור.',
  },
  {
    num: '03',
    icon: 'auto_stories',
    title: 'מקבלים קלפים מדהימים',
    body: 'ה-AI מייצר תמונות קולנועיות באיכות גבוהה, ואנחנו מדפיסים ושולחים אליכם הביתה.',
  },
];

const KIDS_EXAMPLES = [
  { src: '/characters/boys/spider-man.jpg', alt: 'ספיידרמן' },
  { src: '/characters/girls/elsa.jpg', alt: 'אלזה' },
  { src: '/characters/boys/iron-man.jpg', alt: 'איירון מן' },
  { src: '/characters/girls/wonder-woman.jpg', alt: 'וונדר וומן' },
];

const WHATIF_EXAMPLES = [
  { src: '/characters/men/superman.jpg', alt: 'סופרמן' },
  { src: '/characters/women/chef.jpg', alt: 'שפית' },
  { src: '/characters/men/sumo-wrestler.jpg', alt: 'סומו' },
  { src: '/characters/women/secret-agent.jpg', alt: 'סוכנת חשאית' },
];

export default function HomePage() {
  return (
    <div className="home-page" dir="rtl">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-glow-secondary" />

        {/* Floating particles */}
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`hero-particle hero-particle-${i + 1}`} />
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            מופעל על ידי AI מתקדם
          </div>

          <h1 className="hero-headline">
            הילד שלכם.
            <br />
            <span className="hero-headline-accent">הגיבור של הסיפור.</span>
          </h1>

          <p className="hero-hook">
            משחק זיכרון מותאם אישית שבו הפנים שלכם הופכות לדמויות קסומות.
            <br />
            טכנולוגיית AI מתקדמת. הדפסת פרימיום. קופסה ממותגת עד הבית.
          </p>

          <div className="hero-cta-group">
            <Link href="/details" className="btn-hero-primary">
              <span>התחילו ליצור</span>
              <span className="btn-arrow">&larr;</span>
            </Link>
            <span className="hero-price-tag">350 ₪ כולל משלוח</span>
          </div>
        </div>

        {/* ── Showcase cards ── */}
        <div className="hero-showcase">
          {[...KIDS_EXAMPLES.slice(0, 2), ...WHATIF_EXAMPLES.slice(0, 2)].map((img, i) => (
            <div key={img.src} className={`showcase-card showcase-card-${i + 1}`}>
              <Image src={img.src} alt={img.alt} width={280} height={380} className="showcase-card-img" />
              <div className="showcase-card-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item">
            <span className="material-symbols-outlined">verified</span>
            <span>הדפסת פרימיום</span>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined">local_shipping</span>
            <span>משלוח חינם</span>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>AI מתקדם</span>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined">favorite</span>
            <span>בהתאמה אישית</span>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="packages-section">
        <div className="packages-inner">
          <div className="section-header">
            <span className="section-tag">בחרו את החבילה שלכם</span>
            <h2 className="section-heading">שני עולמות, קסם אחד</h2>
            <p className="section-desc">כל חבילה כוללת 20 זוגות קלפים (40 קלפים), קופסה ממותגת ומשלוח עד הבית.</p>
          </div>

          <div className="packages-grid">
            {/* Package 1 — Kids */}
            <div className="package-card">
              <div className="package-images">
                {KIDS_EXAMPLES.map((img) => (
                  <div key={img.src} className="package-img-wrap">
                    <Image src={img.src} alt={img.alt} width={300} height={225} className="package-img" />
                  </div>
                ))}
              </div>
              <div className="package-body">
                <span className="package-badge package-badge-kids">לגילאי 4-12</span>
                <h3 className="package-title">ילדים מהאגדות</h3>
                <p className="package-desc">הילד/ה שלכם כגיבור אמיתי — 20 דמויות קסומות בקלפי זיכרון מודפסים</p>
                <Link href="/details" className="package-cta">
                  הזמינו עכשיו
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                </Link>
                <p className="package-price">350 ₪ כולל משלוח</p>
              </div>
            </div>

            {/* Package 2 — What If */}
            <div className="package-card">
              <div className="package-images">
                {WHATIF_EXAMPLES.map((img) => (
                  <div key={img.src} className="package-img-wrap">
                    <Image src={img.src} alt={img.alt} width={300} height={225} className="package-img" />
                  </div>
                ))}
              </div>
              <div className="package-body">
                <span className="package-badge package-badge-adults">למבוגרים</span>
                <h3 className="package-title">מה אם...?</h3>
                <p className="package-desc">מה היה קורה אם סבא היה סופרמן? אם אמא הייתה סוכנת חשאית?</p>
                <p className="package-highlight">משחק שיצחיק גם את סבא וסבתא.</p>
                <Link href="/details" className="package-cta package-cta-gradient">
                  הזמינו עכשיו
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                </Link>
                <p className="package-price">350 ₪ כולל משלוח</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-header">
            <span className="section-tag">איך זה עובד?</span>
            <h2 className="section-heading">שלושה צעדים פשוטים</h2>
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

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="faq-inner">
          <div className="section-header">
            <h2 className="section-heading">שאלות נפוצות</h2>
          </div>
          {[
            { q: 'כמה זה עולה?', a: 'המחיר למשחק זיכרון אישי ומעוצב הוא 350 ₪. המחיר כולל את תהליך העיצוב המבוסס על מודל מתקדם בהתאמה אישית, הדפסה איכותית, אריזת מתנה ומשלוח מהיר עד פתח הבית (מחיר השקה מוגבל).' },
            { q: 'כמה זמן לוקח עד שהמשחק אצלי?', a: 'אנחנו משקיעים זמן בכל דמות ודמות כדי להבטיח תוצאה מושלמת. תהליך ה"קסם" – הכולל עיבוד תמונה בטכנולוגיה חדשנית, הדפסה מקצועית ובקרת איכות – לוקח עד 14 ימי עסקים. אנחנו מבטיחים שזה שווה את ההמתנה!' },
            { q: 'מה בדיוק כוללת הערכה?', a: '40 קלפים קשיחים ועמידים (20 זוגות) עם דמויות ייחודיות שנוצרו במיוחד עבורכם, קופסה ממותגת ואיכותית, הוראות משחק וטיפים לחיזוק הזיכרון, ומשלוח חינם עד הבית.' },
            { q: 'למה כדאי לבחור ב-MemoReals?', a: 'מעבר למתנה אישית ומרגשת, המשחק שלנו נועד להחזיר את המשפחה לשולחן אחד. זו הזדמנות מושלמת לקחת הפסקה מהמסכים, לחדד את יכולות הזיכרון והקוגניציה של הילדים (וגם של המבוגרים!) ופשוט ליהנות מזמן איכות משותף.' },
            { q: 'האם ניתן לבטל הזמנה?', a: 'מכיוון שכל משחק מיוצר בייצור מיוחד ואישי עבורכם (Custom Made) ועובר הדפסה ספציפית המבוססת על התמונה שלכם, לא ניתן לבטל את ההזמנה לאחר שהתחלנו בתהליך הייצור.' },
            { q: 'אפשר לבצע איסוף עצמי?', a: 'בוודאי! ניתן לבצע איסוף עצמי מקדימה-צורן בתיאום מראש. במעמד ההזמנה פשוט בחרו באופציה של "איסוף עצמי".' },
          ].map((faq) => (
            <details key={faq.q} className="faq-item">
              <summary className="faq-question">
                {faq.q}
                <span className="material-symbols-outlined faq-chevron">expand_more</span>
              </summary>
              <div className="faq-answer">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <h2 className="cta-title">מוכנים להפתיע?</h2>
        <p className="cta-sub">
          תהליך ההזמנה לוקח פחות מ-5 דקות.
          <br />
          מתנת יום הולדת יצירתית עם צחוק לכל המשפחה.
        </p>
        <Link href="/details" className="btn-hero-primary btn-hero-primary-light">
          <span>התחילו עכשיו</span>
          <span className="btn-arrow">&larr;</span>
        </Link>
      </section>

    </div>
  );
}
