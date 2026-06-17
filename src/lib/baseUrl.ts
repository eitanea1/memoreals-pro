import type { NextRequest } from 'next/server';

/**
 * Public base URL of the current deployment, derived from the incoming request.
 *
 * fal.ai callbacks — the training webhook and the self-chained generate batches —
 * must point at the real, reachable host. The code used to read
 * NEXT_PUBLIC_BASE_URL, which was never set in production and silently fell back
 * to http://localhost:3002, so every fal webhook and batch-continuation POST was
 * dropped (training jobs finished on fal but the order stayed stuck on "TRAINING").
 *
 * The request's own host header is always correct; the env var and localhost are
 * only last-resort fallbacks (e.g. non-HTTP contexts).
 */
export function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get('host');
  if (host) {
    const proto =
      req.headers.get('x-forwarded-proto') ??
      (host.startsWith('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3002';
}
