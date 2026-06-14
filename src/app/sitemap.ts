import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://memoreals-pro.vercel.app';

// Public, indexable marketing pages. The order funnel and admin are excluded
// here (and in robots.ts) — they carry no SEO value.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '',         priority: 1.0,  changeFrequency: 'weekly'  as const },
    { path: '/gallery', priority: 0.9,  changeFrequency: 'weekly'  as const },
    { path: '/about',   priority: 0.7,  changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7,  changeFrequency: 'monthly' as const },
    { path: '/terms',   priority: 0.3,  changeFrequency: 'yearly'  as const },
    { path: '/privacy', priority: 0.3,  changeFrequency: 'yearly'  as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
