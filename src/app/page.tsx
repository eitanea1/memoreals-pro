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

// Example images for each package
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
        <div className="hero-logo-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-clean.png" alt="MemoReals" />
        </div>
        <div className="hero-badge">✨ מופעל על ידי AI מתקדם</div>
        <h1 className="hero-headline">
          מתנת יום הולדת<br />
          <span className="hero-headline-accent">יצירתית עם צחוק</span>
        </h1>
        <p className="hero-hook">
          משחק זיכרון מותאם אישית עם AI — לילדים ולמבוגרים.<br />
          הפנים שלכם על כל דמות. הדפסת פרימיום בקופסה ממותגת.
        </p>

        {/* ── Flipping cards animation ── */}
        <div className="hero-cards-row">
          {[...KIDS_EXAMPLES.slice(0, 2), ...WHATIF_EXAMPLES.slice(0, 2)].map((img, i) => (
            <div key={img.src} className="flip-card" style={{ animationDelay: `${i * 0.8}s` }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-clean.png" alt="MemoReals" />
                </div>
                <div className="flip-card-back">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="hero-note">350 ₪ כולל משלוח · מחיר השקה</p>
      </section>

      {/* ── Packages ── */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--c-brand-light)] text-[var(--c-brand-text)] text-xs font-bold mb-4">בחרו את החבילה שלכם</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--c-brand-text)] mb-3">שני עולמות, קסם אחד</h2>
            <p className="text-[var(--c-mid)] max-w-lg mx-auto">כל חבילה כוללת 20 זוגות קלפים (40 קלפים), קופסה ממותגת ומשלוח עד הבית.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Package 1 — Kids */}
            <div className="group relative rounded-3xl overflow-hidden border border-[var(--c-border)] bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:border-[var(--c-brand-mid)]/40">
              {/* Image grid */}
              <div className="grid grid-cols-4 gap-0.5 p-1.5">
                {KIDS_EXAMPLES.map((img) => (
                  <div key={img.src} className="aspect-[4/3] rounded-xl overflow-hidden">
                    <Image src={img.src} alt={img.alt} width={300} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="p-6 text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--c-brand-light)] text-[var(--c-brand)] text-xs font-bold mb-3">לגילאי 4–12</div>
                <h3 className="text-2xl font-extrabold text-[var(--c-brand-text)] mb-2">ילדים מהאגדות</h3>
                <p className="text-[var(--c-mid)] text-sm mb-5">הילד/ה שלכם כגיבור אמיתי — 20 דמויות קסומות בקלפי זיכרון מודפסים</p>
                <Link href="/details" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--c-brand)] text-white font-bold text-sm shadow-[0_4px_20px_rgba(91,33,182,0.3)] hover:shadow-[0_6px_28px_rgba(91,33,182,0.45)] hover:scale-[1.02] transition-all">
                  הזמינו עכשיו ←
                </Link>
                <p className="text-xs text-[var(--c-muted)] mt-3">350 ₪ כולל משלוח</p>
              </div>
            </div>

            {/* Package 2 — What If */}
            <div className="group relative rounded-3xl overflow-hidden border border-[var(--c-border)] bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:border-[var(--c-brand-mid)]/40">
              {/* Image grid */}
              <div className="grid grid-cols-4 gap-0.5 p-1.5">
                {WHATIF_EXAMPLES.map((img) => (
                  <div key={img.src} className="aspect-[4/3] rounded-xl overflow-hidden">
                    <Image src={img.src} alt={img.alt} width={300} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="p-6 text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3">למבוגרים</div>
                <h3 className="text-2xl font-extrabold text-[var(--c-brand-text)] mb-2">מה אם...?</h3>
                <p className="text-[var(--c-mid)] text-sm mb-1">מה היה קורה אם סבא היה סופרמן? אם אמא הייתה סוכנת חשאית?</p>
                <p className="text-[var(--c-brand-text)] text-sm font-bold mb-5">משחק שיצחיק גם את סבא וסבתא.</p>
                <Link href="/details" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-l from-[var(--c-brand)] to-[var(--c-brand-mid)] text-white font-bold text-sm shadow-[0_4px_20px_rgba(91,33,182,0.3)] hover:shadow-[0_6px_28px_rgba(91,33,182,0.45)] hover:scale-[1.02] transition-all">
                  הזמינו עכשיו ←
                </Link>
                <p className="text-xs text-[var(--c-muted)] mt-3">350 ₪ כולל משלוח</p>
              </div>
            </div>
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

      {/* ── FAQ ── */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[var(--c-brand-text)] mb-3">שאלות נפוצות</h2>
          </div>
          {[
            { q: 'כמה עולה?', a: '350 ₪ למשחק כולל משלוח — מחיר השקה.' },
            { q: 'כמה זמן לוקח עד שמקבלים?', a: '14 ימי עסקים — יצירת הקסם, הדפסה, מיון ואריזה.' },
            { q: 'אפשר לבטל הזמנה?', a: 'לא ניתן לבטל מכיוון שמדובר בהזמנה שמודפסת במיוחד עבורכם.' },
            { q: 'אפשר איסוף עצמי?', a: 'כן, ניתן איסוף עצמי מקדימה.' },
            { q: 'מה כלול במשחק?', a: '20 זוגות קלפים (40 קלפים), קופסה ממותגת ומשלוח עד הבית.' },
          ].map((faq) => (
            <details key={faq.q} className="group mb-3 rounded-2xl border border-[var(--c-border)] bg-white overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-[var(--c-brand-text)] hover:bg-[var(--c-brand-light)]/30 transition-colors">
                {faq.q}
                <span className="material-symbols-outlined text-[var(--c-muted)] group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[var(--c-mid)] leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-title">מוכנים להפתיע?</h2>
        <p className="cta-sub">תהליך ההזמנה לוקח פחות מ-5 דקות.<br />מתנת יום הולדת יצירתית עם צחוק לכל המשפחה.</p>
        <Link href="/details" className="btn-hero-cta">
          התחילו עכשיו &larr;
        </Link>
      </section>

    </div>
  );
}
