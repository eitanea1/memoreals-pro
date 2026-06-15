'use client';

// Thin, safe wrapper over the Meta Pixel `fbq`. The pixel only loads when
// NEXT_PUBLIC_FB_PIXEL_ID is set (see components/Analytics.tsx), so every call
// here is a no-op until the pixel is live — nothing breaks in dev or without a
// configured pixel.

type FbqFn = (type: 'track', event: string, params?: Record<string, unknown>) => void;

function fbq(): FbqFn | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { fbq?: FbqFn }).fbq;
}

/** Customer viewed the product — the character-selection / configuration page. */
export function trackViewContent() {
  fbq()?.('track', 'ViewContent', {
    content_name: 'MemoReals Memory Game',
    content_type: 'product',
    currency: 'ILS',
  });
}

/**
 * Customer finished picking their 20 characters and moved forward in the funnel.
 * The closest analog to "add to cart" in this build — they've configured the
 * product and committed to proceeding.
 */
export function trackAddToCart(value: number, contents?: number) {
  fbq()?.('track', 'AddToCart', {
    value,
    currency: 'ILS',
    num_items: contents,
  });
}

/** Customer reached the order summary and is about to commit. */
export function trackInitiateCheckout(value: number, contents?: number) {
  fbq()?.('track', 'InitiateCheckout', {
    value,
    currency: 'ILS',
    num_items: contents,
  });
}

/**
 * Order was submitted. Payment is collected manually afterwards, so this is a
 * Lead (not a Purchase) — the right signal for Meta ad optimization in the
 * current funnel. Switch to a 'Purchase' event once online payment goes live.
 */
export function trackLead(value: number) {
  fbq()?.('track', 'Lead', {
    value,
    currency: 'ILS',
  });
}

/**
 * Payment completed. Fired when the customer returns from Grow's hosted page
 * to /thank-you after a successful charge — the real conversion event Meta
 * should optimize toward once the Grow success-redirect is configured.
 */
export function trackPurchase(value: number) {
  fbq()?.('track', 'Purchase', {
    value,
    currency: 'ILS',
  });
}
