'use client';

import { useRouter } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="app">
      <header className="app-header" onClick={() => router.push('/')}>
        <div className="header-inner">
          <div className="brand-mark">M</div>
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
        <p>© 2025 MemoReals · כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
