export const metadata = { title: 'אודות — MemoReals' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20" dir="rtl">
      {/* Header */}
      <div className="mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--c-brand-light)] text-[var(--c-brand)] text-xs font-bold mb-4">אודות MemoReals</span>
        <h1 className="text-4xl font-extrabold text-[var(--c-brand-text)] mb-4 leading-tight">הסיפור שלנו</h1>
        <div className="w-16 h-1 bg-[var(--c-brand)] rounded-full" />
      </div>

      <div className="space-y-6 text-[var(--c-mid)] leading-[1.85] text-[1.05rem]">
        <p>
          הכל התחיל ביום הולדת אחד של הילד שלנו, כשחיפשנו דרך להפוך אותו למרכז העניינים בצורה שעוד לא נראתה.
          רצינו משהו אישי, מרגש ומחוץ לקופסה. לקחנו תמונה שלו, ובעזרת טכנולוגיית AI הפכנו אותו לדמות מאוירת
          ומרהיבה שמופיעה לאורך כל המשחק.
        </p>

        {/* Highlight quote */}
        <div className="border-r-4 border-[var(--c-brand)] pr-6 py-2 my-8">
          <p className="text-xl font-bold text-[var(--c-brand-text)] leading-relaxed">
            כשראינו את הניצוץ בעיניים שלו וההתלהבות של כולם מסביב — הבנו שזה הרבה יותר מסתם משחק.
          </p>
        </div>

        <p>
          מאותו רגע, החלטנו לקחת את זה צעד קדימה. לא הסתפקנו ברעיון ראשוני, אלא השקענו מאמצים כדי לשפר
          ולרתום את הטכנולוגיות המתקדמות ביותר בתחום ה-AI, כדי שכל ילד יוכל להפוך לדמות איכותית, מלאת אופי
          ומרשימה באמת.
        </p>
        <p>
          ב-MemoReals, הילד שלכם ירגיש מיוחד מתמיד, ובו בזמן יפתח את יכולות הזיכרון והריכוז שלו בדרך חווייתית.
          אנחנו מאמינים שהגיע הזמן להניח את המסכים בצד ולחזור לזמן איכות משפחתי אמיתי סביב השולחן.
        </p>
        <p>
          חיפשנו את הספקים הטובים ביותר כדי להבטיח לכם משחק איכותי, עמיד ומעוצב, כי כשמדובר בזיכרונות שלכם —
          <strong className="text-[var(--c-brand-text)]"> פה אתם הגיבורים.</strong>
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[
          { icon: 'auto_awesome', title: 'טכנולוגיה מתקדמת', desc: 'AI שלומד את הפנים ויוצר דמויות קולנועיות' },
          { icon: 'favorite', title: 'זמן איכות משפחתי', desc: 'מניחים את המסכים וחוזרים לשולחן' },
          { icon: 'verified', title: 'איכות פרימיום', desc: 'הדפסה מקצועית, קופסה ממותגת, משלוח עד הבית' },
        ].map((v) => (
          <div key={v.title} className="text-center p-6 rounded-2xl bg-white border border-[var(--c-border)] hover:shadow-lg hover:border-[var(--c-brand-mid)]/20 transition-all duration-300">
            <span className="material-symbols-outlined text-[var(--c-brand)] text-3xl mb-3 block">{v.icon}</span>
            <h3 className="font-bold text-[var(--c-brand-text)] mb-1">{v.title}</h3>
            <p className="text-sm text-[var(--c-mid)]">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
