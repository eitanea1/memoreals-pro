export const metadata = { title: 'אודות — MemoReals' };

export default function AboutPage() {
  return (
    <article className="about-page" dir="rtl">
      <header className="about-header">
        <span className="section-eyebrow-warm">אודות MemoReals</span>
        <h1 className="about-h1">הסיפור שלנו</h1>
      </header>

      <div className="about-body">
        <p>
          הכל התחיל ביום הולדת אחד של הילד שלנו, כשחיפשנו דרך להפוך אותו למרכז העניינים בצורה שעוד לא נראתה.
          רצינו משהו אישי, מרגש ומחוץ לקופסה. לקחנו תמונה שלו, ובעזרת טכנולוגיה הפכנו אותו לדמות מאוירת ומרהיבה
          שמופיעה לאורך כל המשחק.
        </p>

        <blockquote className="about-quote">
          <p>כשראינו את הניצוץ בעיניים שלו וההתלהבות של כולם מסביב, הבנו שזה הרבה יותר מסתם משחק.</p>
        </blockquote>

        <p>
          מאותו רגע, החלטנו לקחת את זה צעד קדימה. השקענו מאמצים כדי לרתום את הטכנולוגיות המתקדמות ביותר בתחום,
          כדי שכל ילד יוכל להפוך לדמות איכותית, מלאת אופי ומרשימה באמת.
        </p>

        <p>
          ב-MemoReals, הילד שלכם ירגיש מיוחד מתמיד, ובו בזמן יפתח את יכולות הזיכרון והריכוז שלו בדרך חווייתית.
          אנחנו מאמינים שהגיע הזמן להניח את המסכים בצד, ולחזור לזמן איכות משפחתי אמיתי סביב השולחן.
        </p>

        <p>
          חיפשנו את הספקים הטובים ביותר כדי להבטיח לכם משחק איכותי, עמיד ומעוצב, כי כשמדובר בזיכרונות שלכם,{' '}
          <strong className="about-strong">אתם הגיבורים.</strong>
        </p>
      </div>

      <footer className="about-footer">
        <dl className="about-facts">
          <div className="about-fact">
            <dt>הדפסה</dt>
            <dd>קלפים עבים 350gsm, ציפוי מט עמיד</dd>
          </div>
          <div className="about-fact">
            <dt>אריזה</dt>
            <dd>קופסה ממותגת באיכות מתנה</dd>
          </div>
          <div className="about-fact">
            <dt>זמן ייצור</dt>
            <dd>עד 14 ימי עסקים, ישירות הביתה</dd>
          </div>
        </dl>
      </footer>
    </article>
  );
}
