export const metadata = { title: 'תנאי שימוש — MemoReals' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16" dir="rtl">
      <h1 className="text-3xl font-extrabold text-[var(--c-brand-text)] mb-8">תנאי שימוש</h1>
      <p className="text-sm text-[var(--c-muted)] mb-8">עדכון אחרון: מרץ 2026</p>

      <div className="space-y-8 text-[var(--c-mid)] leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">1. כללי</h2>
          <p>
            ברוכים הבאים לאתר MemoReals (להלן: &quot;האתר&quot;). השימוש באתר ובשירותים המוצעים בו מהווה הסכמה
            לתנאי שימוש אלה. אם אינכם מסכימים לתנאים, אנא הימנעו משימוש באתר.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">2. תיאור השירות</h2>
          <p>
            MemoReals מספקת שירות יצירת משחקי זיכרון מותאמים אישית באמצעות טכנולוגיית AI.
            הלקוח מעלה תמונות פנים, בוחר דמויות, והמערכת יוצרת קלפי זיכרון מודפסים ומשלוחים עד הבית.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">3. הזמנה ותשלום</h2>
          <ul className="list-disc pr-5 space-y-2">
            <li>מחיר המשחק הוא 350 ₪ כולל משלוח.</li>
            <li>התשלום מתבצע בעת ביצוע ההזמנה.</li>
            <li>לאחר ביצוע התשלום תישלח אליכם הודעת אישור למייל.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">4. ביטולים והחזרות</h2>
          <ul className="list-disc pr-5 space-y-2">
            <li>מכיוון שמדובר במוצר מותאם אישית שמודפס במיוחד עבורכם, לא ניתן לבטל הזמנה לאחר שהחלה ההפקה.</li>
            <li>במקרה של פגם בהדפסה או נזק במשלוח, נשלח מוצר חדש ללא עלות.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">5. זמני אספקה</h2>
          <p>
            זמן האספקה הוא עד 14 ימי עסקים מרגע ביצוע ההזמנה. הזמן כולל יצירת התמונות, הדפסה, בקרת איכות ומשלוח.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">6. קניין רוחני</h2>
          <p>
            כל התכנים באתר, לרבות עיצובים, טקסטים, לוגו ותמונות, הם רכוש MemoReals.
            התמונות שנוצרות עבור הלקוח הן לשימוש אישי בלבד.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">7. הגבלת אחריות</h2>
          <p>
            MemoReals אינה אחראית לשימוש לרעה בתמונות שהועלו על ידי הלקוח.
            הלקוח מצהיר שהוא בעל הזכויות בתמונות שהוא מעלה ושקיבל את הסכמת המצולמים.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">8. יצירת קשר</h2>
          <p>לשאלות ופניות: <a href="mailto:hello@memoreals.com" className="text-[var(--c-brand)] hover:underline">hello@memoreals.com</a></p>
        </section>
      </div>
    </div>
  );
}
