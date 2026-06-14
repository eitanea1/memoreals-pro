import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://memoreals-pro.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep the admin panel and the multi-step order funnel out of the index —
      // they hold no marketing value and the funnel pages have no standalone content.
      disallow: ['/admin', '/upload', '/characters', '/details', '/shipping', '/summary', '/confirmation'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
