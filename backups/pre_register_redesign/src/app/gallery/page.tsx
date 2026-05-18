import Image from 'next/image';

export const metadata = { title: 'גלריה — MemoReals' };

const PRODUCT_PHOTOS = Array.from({ length: 11 }, (_, i) => ({
  src: `/gallery/product-${i + 1}.jpg`,
  alt: `MemoReals — תמונה ${i + 1}`,
}));

const CHARACTER_SHOWCASE = [
  // Boys
  { src: '/characters/boys/cowboy.jpg', alt: 'קאובוי' },
  { src: '/characters/boys/surfer.jpg', alt: 'גולש' },
  { src: '/characters/boys/horse-rider.jpg', alt: 'רוכב סוסים' },
  { src: '/characters/boys/transformer.jpg', alt: 'טרנספורמר' },
  { src: '/characters/boys/aladdin.jpg', alt: 'אלאדין' },
  // Girls
  { src: '/characters/girls/snow-white.jpg', alt: 'שלגיה' },
  { src: '/characters/girls/belle.jpg', alt: 'בל' },
  { src: '/characters/girls/knight.jpg', alt: 'אבירה' },
  { src: '/characters/girls/wonder-woman.jpg', alt: 'וונדר וומן' },
  { src: '/characters/girls/rapunzel.jpg', alt: 'רפונזל' },
  // Men
  { src: '/characters/men/fitness-trainer.jpg', alt: 'מאמן כושר' },
  { src: '/characters/men/jazz-musician.jpg', alt: 'מוזיקאי ג\'אז' },
  { src: '/characters/men/james-bond.jpg', alt: 'ג\'יימס בונד' },
  { src: '/characters/men/male-ballerina.jpg', alt: 'רקדן בלט' },
  { src: '/characters/men/thor.jpg', alt: 'ת\'ור' },
  // Women
  { src: '/characters/women/surfer.jpg', alt: 'גולשת' },
  { src: '/characters/women/bartender.jpg', alt: 'ברמנית' },
  { src: '/characters/women/motorcycle-rider.jpg', alt: 'רוכבת אופנוע' },
  { src: '/characters/women/lara-croft.jpg', alt: 'לארה קרופט' },
  { src: '/characters/women/fitness-trainer.jpg', alt: 'מאמנת כושר' },
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

      {/* Product Photos */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--c-brand-text)] mb-6">המשחק בעולם האמיתי</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {PRODUCT_PHOTOS.map((item) => (
          <div key={item.src} className="group relative rounded-2xl overflow-hidden border border-[var(--c-border)] bg-white shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Character Showcase */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--c-brand-text)] mb-2">דוגמאות דמויות</h2>
      <p className="text-[var(--c-mid)] mb-6">מאות דמויות לבחירה — הנה רק חלק מהן.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CHARACTER_SHOWCASE.map((item) => (
          <div key={item.src} className="group relative rounded-xl overflow-hidden border border-[var(--c-border)] bg-white shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white font-bold text-sm">{item.alt}</span>
              </div>
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
