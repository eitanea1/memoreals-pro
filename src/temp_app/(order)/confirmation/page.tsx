'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ConfirmationPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  function handleNewOrder() {
    dispatch({ type: 'RESET' });
    router.push('/');
  }

  return (
    <div className="page confirmation-page" dir="rtl">
      <Card className="bg-white border-0 shadow-lg rounded-3xl ring-0 max-w-md w-full mx-auto">
        <CardContent className="flex flex-col items-center gap-5 py-10 px-8 text-center">
          <div className="text-7xl">🎉</div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold text-[#2d3748]">ההזמנה התקבלה!</h2>
            <p className="text-[#4a5568] text-base leading-relaxed">
              איזה כיף, אנחנו כבר מתחילים לעבוד על יצירת הקסם שלכם. 🪄
            </p>
          </div>

          {state.customerEmail && (
            <div className="w-full bg-[#f0fff4] border border-[#c6f6d5] rounded-xl px-4 py-3 text-sm text-[#276749]">
              אישור ישלח בקרוב לכתובת:{' '}
              <span className="font-semibold">{state.customerEmail}</span>
            </div>
          )}

          {state.orderId && (
            <div className="order-id-box w-full">
              <span>מספר הזמנה:</span>
              <code>{state.orderId}</code>
            </div>
          )}

          <Button variant="brand" size="xl" onClick={handleNewOrder} className="w-full mt-2">
            הזמנה חדשה
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
