'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { formatOrderId } from '@/lib/utils/orderId';

export default function ConfirmationPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  function handleNewOrder() {
    dispatch({ type: 'RESET' });
    router.push('/');
  }

  return (
    <div className="page confirmation-page" dir="rtl">
      <div className="confirmation-card">
        <Image src="/logo.svg" alt="MemoReals" width={64} height={64} className="conf-logo" />

        <div className="conf-icon-wrap">
          <span className="conf-check">✓</span>
        </div>

        <div className="conf-text">
          <h2 className="conf-title">קיבלנו את ההזמנה</h2>
          <p className="conf-body">
            תודה! הפרטים נשמרו אצלנו והייצור עומד להתחיל.
          </p>
        </div>

        <div className="conf-next">
          <div className="conf-step">
            <span className="conf-step-num">1</span>
            <div className="conf-step-body">
              <strong>ניצור איתך קשר בוואטסאפ תוך שעה</strong>
              <span>לאישור הזמנה ושליחת לינק לתשלום (Bit / העברה / אשראי). אנחנו עובדים בשעות א׳–ה׳ 09:00–18:00.</span>
            </div>
          </div>
          <div className="conf-step">
            <span className="conf-step-num">2</span>
            <div className="conf-step-body">
              <strong>אחרי אישור התשלום — מתחילים</strong>
              <span>תהליך עיצוב הדמויות (יום-יומיים) → הדפסה → אריזה → משלוח עד פתח הבית. סך הכל עד 14 ימי עסקים.</span>
            </div>
          </div>
        </div>

        {state.shippingStreet && (
          <div className="conf-address-box">
            <span className="conf-address-label">כתובת המשלוח שמסרת:</span>
            <span className="conf-address-value">
              <strong>{state.recipientName}</strong><br />
              {state.shippingStreet}{state.shippingApartment && `, ${state.shippingApartment}`}<br />
              {state.shippingCity}{state.shippingPostalCode && ` ${state.shippingPostalCode}`}
            </span>
          </div>
        )}

        {state.customerPhone && (
          <div className="conf-phone-box">
            ניצור איתך קשר ל: <strong dir="ltr">{state.customerPhone}</strong>
          </div>
        )}

        {state.customerEmail && (
          <div className="conf-email-box">
            אישור נשלח גם ל: <strong>{state.customerEmail}</strong>
          </div>
        )}

        {state.orderDisplayNumber != null && (
          <div className="order-id-box">
            <span>מספר הזמנה (לשמירה):</span>
            <code>{formatOrderId(state.orderDisplayNumber)}</code>
          </div>
        )}

        <a
          href={`https://wa.me/972555707594?text=${encodeURIComponent(`היי, ביצעתי הזמנה ב-MemoReals (מס׳ ${formatOrderId(state.orderDisplayNumber)})`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="conf-wa-cta"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
          </svg>
          לחצו כדי לדבר איתנו בוואטסאפ
        </a>

        <Button variant="brand" size="xl" onClick={handleNewOrder} className="w-full mt-2">
          הזמנה חדשה
        </Button>
      </div>
    </div>
  );
}
