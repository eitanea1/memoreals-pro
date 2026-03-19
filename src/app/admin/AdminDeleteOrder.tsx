'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDeleteOrder({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm('למחוק את ההזמנה לגמרי?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/delete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'שגיאה' }));
        alert(err.error ?? 'שגיאה במחיקה');
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium disabled:opacity-50 transition-colors"
    >
      {loading ? '...' : '🗑 מחק הזמנה'}
    </button>
  );
}
