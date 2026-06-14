import { LAUNCH_PRICE } from '@/lib/pricing';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

// JSON-LD for rich results in Google. Product + Organization help the listing
// show price, currency and brand. Rendered server-side in the root layout.
export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'MemoReals',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.svg`,
      },
      {
        '@type': 'Product',
        name: 'MemoReals — משחק זיכרון אישי עם AI',
        description:
          'משחק זיכרון מותאם אישית: הילד/ה שלכם כגיבור אמיתי. 20 זוגות קלפים, קופסה ממותגת, משלוח עד הבית.',
        image: `${BASE_URL}/gallery/product-1.jpg`,
        brand: {
          '@type': 'Brand',
          name: 'MemoReals',
        },
        offers: {
          '@type': 'Offer',
          price: String(LAUNCH_PRICE),
          priceCurrency: 'ILS',
          availability: 'https://schema.org/InStock',
          url: BASE_URL,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe — no user input flows into this static schema.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
