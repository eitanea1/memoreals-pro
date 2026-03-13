import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const brandXl =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent ' +
  'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-md ' +
  'h-12 px-8 text-base font-semibold ' +
  'transition-all hover:opacity-90 active:opacity-80 select-none outline-none';

const GALLERY_IMAGES = [
  { src: '/example (1).jpg', alt: 'דוגמה לקלף משחק זיכרון 1' },
  { src: '/example (2).jpg', alt: 'דוגמה לקלף משחק זיכרון 2' },
  { src: '/example (3).jpg', alt: 'דוגמה לקלף משחק זיכרון 3' },
  { src: '/example (4).jpg', alt: 'דוגמה לקלף משחק זיכרון 4' },
  { src: '/example (5).png', alt: 'דוגמה לקלף משחק זיכרון 5' },
  { src: '/example (6).png', alt: 'דוגמה לקלף משחק זיכרון 6' },
];

const WHY_ITEMS = [
  {
    emoji: '😂',
    title: 'צחוק מובטח',
    body: 'כי לראות את סבא לוחם סומו זה משהו שלא שוכחים. כל קלף הוא הפתעה חדשה.',
  },
  {
    emoji: '⭐',
    title: 'הילד הוא הכוכב',
    body: 'תחפושות שקמות לתחייה בעזרת ה-AI הכי מתקדם בעולם — כל תמונה מותאמת אישית.',
  },
  {
    emoji: '🏆',
    title: 'איכות פרימיום',
    body: 'קלפי משחק עמידים שיישארו איתכם שנים. מתנה שאי אפשר לשכוח.',
  },
];

export default function HomePage() {
  return (
    <div className="home-page" dir="rtl">

      {/* ── Hero ── */}
      <section className="hero-section">
        <h2 className="hero-headline">
          להפוך את אבא לאסטרונאוט<br />ואת הילד לקוסם
        </h2>
        <p className="hero-sub">הכירו את <span className="hero-brand">MemoReals</span></p>
        <p className="hero-hook">
          משחק הזיכרון האישי שלכם מעולם לא נראה ככה.<br />
          המתנה המושלמת לימי הולדת, חגים, או פשוט כדי לצחוק ביחד.
        </p>
        <Link href="/details" className={brandXl}>
          צרו את המשחק שלכם ←
        </Link>
      </section>

      {/* ── Gallery ── */}
      <section className="gallery-section">
        <h3 className="gallery-title">כך נראים הקלפים שלנו</h3>
        <p className="gallery-subtitle">כל משחק מותאם אישית — לאדם שלכם, בדמויות שבחרתם</p>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img) => (
            <Card key={img.src} className="gallery-card overflow-hidden border-0 shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 aspect-square">
              <CardContent className="p-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover block" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Why ── */}
      <section className="why-section">
        <h3 className="why-title">למה MemoReals?</h3>
        <div className="why-grid">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="why-card">
              <span className="why-emoji">{item.emoji}</span>
              <h4 className="why-card-title">{item.title}</h4>
              <p className="why-card-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <p className="cta-text">מוכנים להפוך זיכרון למציאות?</p>
        <Link href="/details" className={brandXl}>
          התחילו עכשיו — בחינם ←
        </Link>
      </section>

    </div>
  );
}
