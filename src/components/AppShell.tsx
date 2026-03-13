'use client';

import { useRouter } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="app">
      <header className="app-header" onClick={() => router.push('/')}>
        <div className="brand-logo">MemoReals</div>
        <p className="brand-slogan">זיכרונות אמיתיים בגרסה דמיונית</p>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
