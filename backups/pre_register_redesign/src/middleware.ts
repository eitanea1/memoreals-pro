import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Only protect /admin routes
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (user === 'admin' && pass === process.env.ADMIN_PASSWORD) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="MemoReals Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
