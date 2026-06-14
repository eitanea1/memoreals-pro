// Canonical public site URL — single source of truth for SEO, canonical tags,
// Open Graph URLs, sitemap and robots. Override per-environment (e.g. preview
// deploys) by setting NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://memoreals.com';
