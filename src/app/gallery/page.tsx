import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'גלריה — MemoReals' };

const PACKING_PHOTOS = Array.from({ length: 4 }, (_, i) => ({
  src: `/gallery/packing-${i + 1}.jpeg`,
  alt: `קופסת MemoReals — צילום ${i + 1}`,
}));

const PRODUCT_PHOTOS = Array.from({ length: 11 }, (_, i) => ({
  src: `/gallery/product-${i + 1}.jpg`,
  alt: `MemoReals — תמונה ${i + 1}`,
}));

const CHARACTER_SHOWCASE = [
  { src: '/characters/boys/cowboy.jpg', alt: 'קאובוי' },
  { src: '/characters/boys/surfer.jpg', alt: 'גולש' },
  { src: '/characters/boys/horse-rider.jpg', alt: 'רוכב סוסים' },
  { src: '/characters/boys/transformer.jpg', alt: 'טרנספורמר' },
  { src: '/characters/boys/aladdin.jpg', alt: 'אלאדין' },
  { src: '/characters/girls/snow-white.jpg', alt: 'שלגיה' },
  { src: '/characters/girls/belle.jpg', alt: 'בל' },
  { src: '/characters/girls/knight.jpg', alt: 'אבירה' },
  { src: '/characters/girls/wonder-woman.jpg', alt: 'וונדר וומן' },
  { src: '/characters/girls/rapunzel.jpg', alt: 'רפונזל' },
  { src: '/characters/men/fitness-trainer.jpg', alt: 'מאמן כושר' },
  { src: '/characters/men/jazz-musician.jpg', alt: "מוזיקאי ג'אז" },
  { src: '/characters/men/james-bond.jpg', alt: "ג'יימס בונד" },
  { src: '/characters/men/male-ballerina.jpg', alt: 'רקדן בלט' },
  { src: '/characters/men/thor.jpg', alt: "ת'ור" },
  { src: '/characters/women/surfer.jpg', alt: 'גולשת' },
  { src: '/characters/women/bartender.jpg', alt: 'ברמנית' },
  { src: '/characters/women/motorcycle-rider.jpg', alt: 'רוכבת אופנוע' },
  { src: '/characters/women/lara-croft.jpg', alt: 'לארה קרופט' },
  { src: '/characters/women/fitness-trainer.jpg', alt: 'מאמנת כושר' },
];

export default function GalleryPage() {
  return (
    <div className="gallery-page" dir="rtl">
      <header className="gallery-header">
        <span className="section-eyebrow-warm">גלריה</span>
        <h1 className="gallery-h1">המשחק שלנו בעולם האמיתי</h1>
        <p className="gallery-lede">
          כל משחק יוצא ייחודי, מותאם אישית, מודפס באיכות פרימיום. הנה איך זה נראה אצל המשפחות שלנו.
        </p>
      </header>

      <section className="gallery-block">
        <h2 className="gallery-h2">הקופסה הממותגת</h2>
        <p className="gallery-block-sub">כל הזמנה מגיעה בקופסה אישית מודפסת, מוכנה למתנה.</p>
        <div className="gallery-products">
          {PACKING_PHOTOS.map((item) => (
            <figure key={item.src} className="gallery-product-card">
              <div className="gallery-product-imgwrap">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="gallery-product-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section className="gallery-block">
        <h2 className="gallery-h2">המשחק בעולם האמיתי</h2>
        <div className="gallery-products">
          {PRODUCT_PHOTOS.map((item) => (
            <figure key={item.src} className="gallery-product-card">
              <div className="gallery-product-imgwrap">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="gallery-product-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section className="gallery-block">
        <h2 className="gallery-h2">דוגמאות דמויות</h2>
        <p className="gallery-block-sub">מאות דמויות לבחירה. הנה רק חלק קטן מהן.</p>
        <div className="gallery-characters">
          {CHARACTER_SHOWCASE.map((item) => (
            <figure key={item.src} className="gallery-char-card">
              <div className="gallery-char-imgwrap">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="gallery-char-img"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <figcaption className="gallery-char-caption">{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="gallery-cta">
        <p className="gallery-cta-text">רוצים שגם המשפחה שלכם תהיה פה?</p>
        <Link href="/details" className="btn-primary-warm">
          <span>התחילו להזמין</span>
          <span className="btn-arrow" aria-hidden="true">&larr;</span>
        </Link>
      </section>
    </div>
  );
}
