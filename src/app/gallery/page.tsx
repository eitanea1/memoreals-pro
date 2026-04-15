import Image from 'next/image';

export const metadata = { title: 'גלריה — MemoReals' };

const GALLERY = [
  { src: '/gallery/product-1.jpg', alt: 'המשחק המלא פרוש על שולחן', caption: 'המשחק המלא — 20 זוגות קלפים בקופסה ממותגת' },
  { src: '/gallery/product-2.jpg', alt: 'תקריב של קלף איירון מן', caption: 'איכות הדפסה פרימיום — כל פרט מרהיב' },
  { src: '/gallery/product-3.jpg', alt: 'גב הקלפים עם הלוגו', caption: 'לוגו MemoReals מוטבע על גב כל קלף' },
  { src: '/gallery/playing-1.jpg', alt: 'ילדים משחקים ביחד', caption: 'זמן איכות משפחתי — בלי מסכים' },
  { src: '/gallery/playing-2.jpg', alt: 'יד הופכת קלף', caption: 'הרגע שבו הופכים את הקלף ומגלים את הגיבור' },
  { src: '/gallery/cards-grid.jpg', alt: 'קלפים עם דמויות שונות', caption: 'מאות דמויות לבחירה — לכל ילד, לכל משפחה' },
];

export default function GalleryPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20" dir="rtl">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--c-brand-light)] text-[var(--c-brand)] text-xs font-bold mb-4">גלריה</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--c-brand-text)] mb-4">המשחק שלנו בעולם האמיתי</h1>
        <p className="text-[var(--c-mid)] text-lg max-w-2xl mx-auto">
          כל משחק יוצא ייחודי, מותאם אישית ומודפס באיכות פרימיום.
          <br />
          הנה איך זה נראה אצל המשפחות שלנו.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GALLERY.map((item) => (
          <div key={item.src} className="group relative rounded-2xl overflow-hidden border border-[var(--c-border)] bg-white shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt || ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="absolute bottom-4 right-4 left-4 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <p className="text-[var(--c-mid)] mb-4">רוצים שגם המשפחה שלכם תהיה פה?</p>
        <a
          href="/details"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-l from-[var(--c-brand)] to-[var(--c-brand-mid)] text-white font-bold shadow-[0_4px_20px_rgba(91,33,182,0.35)] hover:shadow-[0_6px_28px_rgba(91,33,182,0.5)] hover:scale-[1.02] transition-all"
        >
          התחילו להזמין ←
        </a>
      </div>
    </div>
  );
}
