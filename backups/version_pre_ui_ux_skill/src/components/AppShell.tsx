'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="app">
      {/* Premium Nav */}
      <header className="app-header" onClick={() => router.push('/')}>
        <div className="header-inner">
          <Image
            src="/logo-clean.png"
            alt="MemoReals Logo"
            width={64}
            height={64}
            className="header-logo-img"
            priority
          />
          <div className="brand-text">
            <span className="brand-logo">MemoReals</span>
            {!isHome && <span className="brand-slogan">זיכרונות אמיתיים בגרסה דמיונית</span>}
          </div>
        </div>
      </header>
      <main className={isHome ? 'app-main-home' : 'app-main'}>
        {children}
      </main>
      {/* Footer */}
      <footer className={isHome ? 'app-footer-premium' : 'app-footer'}>
        <div className={isHome ? 'footer-premium-inner' : 'footer-inner'}>
          {isHome ? (
            <>
              <div className="footer-brand">MemoReals</div>
              <div className="footer-links">
                <Link href="/about">אודות</Link>
                <Link href="/privacy">מדיניות פרטיות</Link>
                <Link href="/terms">תנאי שימוש</Link>
                <Link href="/contact">צרו קשר</Link>
              </div>
              <span className="footer-copy">© 2026 MemoReals · כל הזכויות שמורות</span>
            </>
          ) : (
            <>
              <Image src="/logo-clean.png" alt="" width={22} height={22} className="footer-logo" />
              <span>© 2026 MemoReals · כל הזכויות שמורות</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
