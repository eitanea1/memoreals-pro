import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://memoreals-pro.vercel.app'),
  title: 'MemoReals — משחק זיכרון אישי עם AI',
  description: 'הילד שלכם כגיבור אמיתי. משחק זיכרון מותאם אישית עם טכנולוגיית AI מתקדמת. 20 זוגות קלפים, קופסה ממותגת, משלוח עד הבית. 350 ₪.',
  openGraph: {
    title: 'MemoReals — משחק זיכרון אישי עם AI',
    description: 'הילד שלכם כגיבור אמיתי. 20 זוגות קלפים מותאמים אישית, קופסה ממותגת, משלוח עד הבית.',
    url: 'https://memoreals-pro.vercel.app',
    siteName: 'MemoReals',
    images: [
      {
        url: '/gallery/product-1.jpg',
        width: 1200,
        height: 630,
        alt: 'MemoReals — משחק זיכרון אישי',
      },
    ],
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemoReals — משחק זיכרון אישי עם AI',
    description: 'הילד שלכם כגיבור אמיתי. 350 ₪ כולל משלוח.',
    images: ['/gallery/product-1.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
