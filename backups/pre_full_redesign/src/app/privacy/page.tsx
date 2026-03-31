export const metadata = { title: 'מדיניות פרטיות — MemoReals' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16" dir="rtl">
      <h1 className="text-3xl font-extrabold text-[var(--c-brand-text)] mb-8">מדיניות פרטיות</h1>
      <p className="text-sm text-[var(--c-muted)] mb-8">עדכון אחרון: מרץ 2026</p>

      <div className="space-y-8 text-[var(--c-mid)] leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">1. מידע שאנחנו אוספים</h2>
          <ul className="list-disc pr-5 space-y-2">
            <li><strong>פרטים אישיים:</strong> שם, כתובת מייל, מספר טלפון — לצורך ביצוע ההזמנה ויצירת קשר.</li>
            <li><strong>תמונות פנים:</strong> התמונות שאתם מעלים משמשות אך ורק ליצירת הדמויות למשחק שלכם.</li>
            <li><strong>פרטי הזמנה:</strong> בחירת דמויות, גיל המשתתף/ת ופרטים נוספים הנדרשים לייצור המשחק.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">2. כיצד אנחנו משתמשים במידע</h2>
          <ul className="list-disc pr-5 space-y-2">
            <li>ייצור המשחק המותאם אישית שלכם.</li>
            <li>שליחת עדכונים על סטטוס ההזמנה.</li>
            <li>יצירת קשר במקרה הצורך.</li>
            <li>שיפור השירות שלנו.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">3. אחסון תמונות</h2>
          <p>
            התמונות שאתם מעלים מאוחסנות בשרתים מאובטחים. אנחנו משתמשים בתמונות אך ורק לצורך יצירת
            הדמויות עבור המשחק שלכם. התמונות נמחקות באופן אוטומטי תוך 90 יום ממועד השלמת ההזמנה.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">4. שיתוף מידע עם צדדים שלישיים</h2>
          <p>
            אנחנו לא מוכרים, משכירים או משתפים את המידע האישי שלכם עם צדדים שלישיים, למעט:
          </p>
          <ul className="list-disc pr-5 space-y-2 mt-2">
            <li>ספקי שירות הכרחיים (עיבוד תמונות AI, הדפסה, משלוח).</li>
            <li>כאשר נדרש על פי חוק.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">5. אבטחת מידע</h2>
          <p>
            אנחנו נוקטים באמצעי אבטחה מקובלים כדי להגן על המידע שלכם, כולל הצפנת נתונים ואחסון מאובטח.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">6. הזכויות שלכם</h2>
          <ul className="list-disc pr-5 space-y-2">
            <li>לבקש לראות את המידע שאנחנו מחזיקים עליכם.</li>
            <li>לבקש מחיקת המידע שלכם.</li>
            <li>לבקש מחיקה מוקדמת של התמונות.</li>
          </ul>
          <p className="mt-2">לכל בקשה, פנו אלינו: <a href="mailto:hello@memoreals.com" className="text-[var(--c-brand)] hover:underline">hello@memoreals.com</a></p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--c-dark)] mb-3">7. עוגיות (Cookies)</h2>
          <p>
            האתר משתמש בעוגיות טכניות הכרחיות בלבד לצורך תפעול תקין. אנחנו לא משתמשים בעוגיות שיווקיות או מעקב.
          </p>
        </section>
      </div>
    </div>
  );
}
