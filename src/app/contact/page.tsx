export const metadata = { title: 'צור קשר — MemoReals' };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center" dir="rtl">
      <h1 className="text-3xl font-extrabold text-[var(--c-brand-text)] mb-4">צרו קשר</h1>
      <p className="text-[var(--c-mid)] mb-12">נשמח לענות על כל שאלה. בחרו את הדרך הנוחה לכם:</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* WhatsApp */}
        <a
          href="https://wa.me/972XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[var(--c-border)] bg-white hover:shadow-lg hover:border-green-300 transition-all"
        >
          <span className="text-4xl">💬</span>
          <span className="text-lg font-bold text-[var(--c-dark)]">WhatsApp</span>
          <span className="text-sm text-[var(--c-mid)]">תגובה מהירה בשעות הפעילות</span>
        </a>

        {/* Email */}
        <a
          href="mailto:hello@memoreals.com"
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[var(--c-border)] bg-white hover:shadow-lg hover:border-[var(--c-brand-mid)] transition-all"
        >
          <span className="text-4xl">📧</span>
          <span className="text-lg font-bold text-[var(--c-dark)]">אימייל</span>
          <span className="text-sm text-[var(--c-mid)]">hello@memoreals.com</span>
        </a>
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-[var(--c-brand-light)]">
        <h2 className="text-lg font-bold text-[var(--c-brand-text)] mb-3">שעות פעילות</h2>
        <p className="text-[var(--c-mid)]">ימים א׳–ה׳, 09:00–18:00</p>
        <p className="text-sm text-[var(--c-muted)] mt-2">פניות שיתקבלו מחוץ לשעות הפעילות ייענו ביום העסקים הבא.</p>
      </div>
    </div>
  );
}
