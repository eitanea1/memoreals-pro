'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

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
          <h2 className="conf-title">ההזמנה התקבלה!</h2>
          <p className="conf-body">
            איזה כיף! אנחנו כבר מתחילים לעבוד על הקסם שלכם. 🪄<br />
            הקלפים יהיו מוכנים בקרוב.
          </p>
        </div>

        {state.customerEmail && (
          <div className="conf-email-box">
            אישור ישלח לכתובת:{' '}
            <strong>{state.customerEmail}</strong>
          </div>
        )}

        {state.orderId && (
          <div className="order-id-box">
            <span>מספר הזמנה:</span>
            <code>{state.orderId}</code>
          </div>
        )}

        <Button variant="brand" size="xl" onClick={handleNewOrder} className="w-full mt-2">
          הזמנה חדשה
        </Button>
      </div>
    </div>
  );
}
