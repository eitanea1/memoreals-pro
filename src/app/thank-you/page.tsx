'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackPurchase } from '@/lib/analytics/track';
import { LAUNCH_PRICE } from '@/lib/pricing';

/**
 * Payment-success landing page. Grow's hosted checkout redirects here after a
 * successful charge (set the success-redirect URL to /thank-you in Grow).
 * Firing Purchase here is what lets Meta optimize for real buyers.
 */
export default function ThankYouPage() {
  useEffect(() => {
    // Fire Purchase once per browser session — guards against double-counting
    // if the customer refreshes the thank-you page.
    try {
      if (sessionStorage.getItem('mr_purchase_tracked') === '1') return;
      sessionStorage.setItem('mr_purchase_tracked', '1');
    } catch {
      /* sessionStorage unavailable (private mode) — fire anyway */
    }
    trackPurchase(LAUNCH_PRICE);
  }, []);

  return (
    <div
      dir="rtl"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          background: 'var(--surface, #fff)',
          borderRadius: 20,
          padding: '40px 28px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <span style={{ color: '#fff', fontSize: 32, lineHeight: 1 }}>✓</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>התשלום התקבל — תודה! 🎉</h1>
        <p style={{ color: 'var(--ink-2, #666)', lineHeight: 1.6, marginBottom: 24 }}>
          קיבלנו את התשלום וההזמנה שלכם נכנסה לייצור. נתחיל לעצב את הקלפים עם הפנים של הילד/ה, ונעדכן אתכם בכל שלב.
        </p>

        <div
          style={{
            background: 'var(--bg-2, #f7f7f5)',
            borderRadius: 12,
            padding: '16px 20px',
            textAlign: 'right',
            marginBottom: 24,
            fontSize: 14,
            color: 'var(--ink-2, #444)',
            lineHeight: 1.7,
          }}
        >
          <strong>מה עכשיו?</strong>
          <br />
          עיצוב הדמויות (יום-יומיים) → הדפסה → אריזה → משלוח עד פתח הבית. סך הכל עד 14 ימי עסקים.
        </div>

        <Link
          href="/"
          className="btn-primary-warm"
          style={{ display: 'inline-flex', justifyContent: 'center' }}
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
