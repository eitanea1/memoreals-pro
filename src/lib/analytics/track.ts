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
