export const metadata = { title: 'צור קשר — MemoReals' };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center" dir="rtl">
      <span className="inline-block px-3 py-1 rounded-full bg-[var(--c-brand-light)] text-[var(--c-brand)] text-xs font-bold mb-4">צור קשר</span>
      <h1 className="text-4xl font-extrabold text-[var(--c-brand-text)] mb-4">נשמח לשמוע מכם</h1>
      <p className="text-[var(--c-mid)] mb-12 text-lg">בחרו את הדרך הנוחה לכם ליצור איתנו קשר.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
        <a
          href="mailto:hello@memoreals.com"
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[var(--c-border)] bg-white hover:shadow-lg hover:border-[var(--c-brand-mid)]/30 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[var(--c-brand)] text-4xl">mail</span>
          <span className="text-lg font-bold text-[var(--c-brand-text)]">אימייל</span>
          <span className="text-sm text-[var(--c-mid)]">hello@memoreals.com</span>
        </a>
        <a
          href="tel:+972000000000"
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[var(--c-border)] bg-white hover:shadow-lg hover:border-[var(--c-brand-mid)]/30 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[var(--c-brand)] text-4xl">call</span>
          <span className="text-lg font-bold text-[var(--c-brand-text)]">טלפון</span>
          <span className="text-sm text-[var(--c-mid)]">בקרוב</span>
        </a>
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-white border border-[var(--c-border)]">
        <span className="material-symbols-outlined text-[var(--c-brand)] text-3xl mb-3 block">schedule</span>
        <h2 className="text-lg font-bold text-[var(--c-brand-text)] mb-3">שעות פעילות</h2>
        <p className="text-[var(--c-mid)]">ימים א׳–ה׳, 09:00–18:00</p>
        <p className="text-sm text-[var(--c-muted)] mt-2">פניות שיתקבלו מחוץ לשעות הפעילות ייענו ביום העסקים הבא.</p>
      </div>
    </div>
  );
}
