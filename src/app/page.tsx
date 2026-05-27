import Link from 'next/link';
import Image from 'next/image';
import BoomerangVideoBg from '@/components/BoomerangVideoBg';

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
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">משחק זיכרון אישי</span>

            <h1 className="hero-headline">
              הילד שלכם.
              <br />
              הגיבור של הסיפור.
            </h1>

            <p className="hero-hook">
              משחק זיכרון שעשוי במיוחד לילד שלכם. הפנים שלו הופכות לעשרים גיבורות וגיבורים, מודפסים על קלפים עבים בקופסה ממותגת, עד פתח הבית.
            </p>

            <div className="hero-cta-group">
              <Link href="/details" className="btn-primary-warm">
                <span>התחילו ליצור</span>
                <span className="btn-arrow" aria-hidden="true">&larr;</span>
              </Link>
              <div className="hero-price-line">
                <span className="hero-price">350 ₪</span>
                <span className="hero-price-meta">כולל הדפסה ומשלוח</span>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <BoomerangVideoBg
              src="/VIDEO.mp4"
              fallbackImage="/gallery/product-hero.png"
              fallbackAlt="קלפי MemoReals אישיים פרושים על שולחן"
              className="hero-photo"
            />
            <div className="hero-photo-tag">
              <span className="hero-photo-tag-dot" aria-hidden="true" />
              מודפס באהבה בישראל
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item">
            <span className="material-symbols-outlined" aria-hidden="true">verified</span>
            <span>הדפסה איכותית</span>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined" aria-hidden="true">local_shipping</span>
            <span>משלוח חינם</span>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined" aria-hidden="true">redeem</span>
            <span>קופסה ממותגת</span>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
            <span>בהתאמה אישית</span>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="packages-section">
        <div className="packages-inner">
          <div className="section-header">
            <span className="section-eyebrow-warm">בחרו את החבילה שלכם</span>
            <h2 className="section-heading-warm">שני עולמות, קסם אחד</h2>
            <p className="section-desc-warm">כל חבילה כוללת 20 זוגות קלפים, קופסה ממותגת, ומשלוח עד הבית.</p>
          </div>

          <div className="packages-grid">
            {/* Package 1 — Kids */}
            <article className="package-card package-card-kids">
              <div className="package-photo-wrap">
                <Image
                  src={KIDS_EXAMPLES[0].src}
                  alt={KIDS_EXAMPLES[0].alt}
                  width={520}
                  height={520}
                  className="package-photo"
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <span className="package-pick-ribbon">
                  <span className="material-symbols-outlined" aria-hidden="true">touch_app</span>
                  אתם בוחרים את כל הדמויות
                </span>
              </div>
              <div className="package-body">
                <span className="package-badge package-badge-kids">לגילאי 4–12</span>
                <h3 className="package-title">ילדים מהאגדות</h3>
                <p className="package-desc">הילד/ה שלכם כגיבור אמיתי. בוחרים 20 דמויות מתוך מאות אפשרויות — גיבורי על, נסיכות, ספורטאים, ועוד.</p>
                <div className="package-cta-row">
                  <Link href="/details" className="btn-primary-warm btn-primary-warm-sm">
                    בחרו דמויות
                    <span className="btn-arrow" aria-hidden="true">&larr;</span>
                  </Link>
                  <span className="package-price">350 ₪</span>
                </div>
              </div>
            </article>

            {/* Package 2 — What If */}
            <article className="package-card package-card-adults">
              <div className="package-photo-wrap">
                <Image
                  src={WHATIF_EXAMPLES[0].src}
                  alt={WHATIF_EXAMPLES[0].alt}
                  width={520}
                  height={520}
                  className="package-photo"
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <span className="package-pick-ribbon">
                  <span className="material-symbols-outlined" aria-hidden="true">touch_app</span>
                  אתם בוחרים את כל הדמויות
                </span>
              </div>
              <div className="package-body">
                <span className="package-badge package-badge-adults">למבוגרים</span>
                <h3 className="package-title">מה אם...?</h3>
                <p className="package-desc">מה היה קורה אם סבא היה סופרמן? אם אמא הייתה סוכנת חשאית? בוחרים 20 תפקידים — שיצחיקו את כל המשפחה.</p>
                <div className="package-cta-row">
                  <Link href="/details" className="btn-primary-warm btn-primary-warm-sm">
                    בחרו דמויות
                    <span className="btn-arrow" aria-hidden="true">&larr;</span>
                  </Link>
                  <span className="package-price">350 ₪</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-header">
            <span className="section-eyebrow-warm">איך זה עובד?</span>
            <h2 className="section-heading-warm">שלושה צעדים, ארבעה־עשר ימים</h2>
          </div>
          <ol className="how-flow">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.num} className="how-step">
                <div className="how-step-num" aria-hidden="true">{step.num}</div>
                <div className="how-step-body">
                  <h3 className="how-step-title">{step.title}</h3>
                  <p className="how-step-text">{step.body}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && <div className="how-step-connector" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="faq-inner">
          <div className="section-header">
            <span className="section-eyebrow-warm">שאלות נפוצות</span>
            <h2 className="section-heading-warm">כל מה שכדאי לדעת</h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'כמה זה עולה?', a: 'המחיר למשחק זיכרון אישי ומעוצב הוא 350 ₪, כולל את תהליך העיצוב בהתאמה אישית, הדפסה איכותית, אריזת מתנה ומשלוח מהיר עד פתח הבית. מחיר השקה מוגבל.' },
              { q: 'כמה זמן לוקח עד שהמשחק מגיע?', a: 'אנחנו משקיעים זמן בכל דמות ודמות כדי להבטיח תוצאה מושלמת. התהליך, הכולל עיבוד תמונה, הדפסה מקצועית ובקרת איכות, לוקח עד 14 ימי עסקים. שווה את ההמתנה.' },
              { q: 'מה בדיוק כוללת הערכה?', a: '40 קלפים קשיחים ועמידים (20 זוגות) עם דמויות ייחודיות שנוצרו במיוחד עבורכם, קופסה ממותגת ואיכותית, הוראות משחק וטיפים לחיזוק הזיכרון, ומשלוח חינם עד הבית.' },
              { q: 'למה כדאי לבחור ב-MemoReals?', a: 'מעבר למתנה אישית ומרגשת, המשחק שלנו נועד להחזיר את המשפחה לשולחן אחד. הזדמנות מושלמת להפסקה מהמסכים, לחדד את הזיכרון של הילדים, וליהנות מזמן איכות משותף.' },
              { q: 'האם ניתן לבטל הזמנה?', a: 'כיוון שכל משחק מיוצר בייצור אישי ועובר הדפסה ספציפית, לא ניתן לבטל את ההזמנה לאחר שהתחלנו בתהליך הייצור.' },
              { q: 'אפשר לבצע איסוף עצמי?', a: 'בוודאי. ניתן לבצע איסוף עצמי מקדימה-צורן בתיאום מראש. במעמד ההזמנה בחרו באופציה של "איסוף עצמי".' },
            ].map((faq, i) => (
              <details key={faq.q} className="faq-item" open={i === 0}>
                <summary className="faq-question">
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined faq-chevron" aria-hidden="true">expand_more</span>
                </summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">מוכנים להפתיע?</h2>
          <p className="cta-sub">תהליך ההזמנה לוקח פחות מחמש דקות. מתנת יום הולדת יצירתית, עם צחוק לכל המשפחה.</p>
          <Link href="/details" className="btn-primary-warm btn-primary-warm-lg">
            <span>התחילו עכשיו</span>
            <span className="btn-arrow" aria-hidden="true">&larr;</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
