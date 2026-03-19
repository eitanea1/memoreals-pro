'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="app">
      <header className="app-header" onClick={() => router.push('/')}>
        <div className="header-inner">
          <Image
            src="/logo.svg"
            alt="MemoReals Logo"
            width={42}
            height={42}
            className="header-logo-img"
            priority
          />
          <div className="brand-text">
            <span className="brand-logo">MemoReals</span>
            <span className="brand-slogan">זיכרונות אמיתיים בגרסה דמיונית</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <div className="footer-inner">
          <Image src="/logo.svg" alt="" width={22} height={22} className="footer-logo" />
          <span>© 2025 MemoReals · כל הזכויות שמורות</span>
        </div>
      </footer>
    </div>
  );
}
