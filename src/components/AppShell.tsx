'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

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
            src="/logo.png"
            alt="MemoReals Logo"
            width={42}
            height={42}
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
                <a href="#">מדיניות פרטיות</a>
                <a href="#">תנאי שימוש</a>
                <a href="#">צרו קשר</a>
              </div>
              <span className="footer-copy">© 2025 MemoReals · כל הזכויות שמורות</span>
            </>
          ) : (
            <>
              <Image src="/logo.png" alt="" width={22} height={22} className="footer-logo" />
              <span>© 2025 MemoReals · כל הזכויות שמורות</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
