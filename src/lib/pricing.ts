// Central pricing + payment config — single source of truth.
// Change the price or the Grow payment link here and it updates everywhere
// (hero, packages, FAQ, metadata, structured data, analytics, confirmation).

/** Regular (anchor) price, shown struck-through. */
export const REGULAR_PRICE = 350;

/** Limited-time launch price the customer actually pays. */
export const LAUNCH_PRICE = 300;

export const PRICE_CURRENCY = 'ILS';

/**
 * Grow hosted payment page (fixed launch price, includes shipping).
 * Replace this if the Grow link changes.
 */
export const PAYMENT_LINK =
  'https://pay.grow.link/MTAxNjEx~a4555c64352dcc9cca69fc66e8a7262c-MzU0ODkwNw';
