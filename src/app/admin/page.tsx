export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';

const STATUS_HEBREW: Record<string, string> = {
  RECEIVED:        'התקבלה',
  TRAINING:        'מאמן...',
  SAMPLING:        'דגימות',
  PROCESSING_ALL:  'מייצר הכל',
  READY_FOR_PRINT: 'מוכנה להדפסה',
  SHIPPED:         'נשלחה',
  CANCELLED:       'בוטלה',
};
const STATUS_COLOR: Record<string, string> = {
  RECEIVED:        'bg-blue-100 text-blue-800',
  TRAINING:        'bg-orange-100 text-orange-700',
  SAMPLING:        'bg-purple-100 text-purple-800',
  PROCESSING_ALL:  'bg-yellow-100 text-yellow-800',
  READY_FOR_PRINT: 'bg-green-100 text-green-800',
  SHIPPED:         'bg-teal-100 text-teal-800',
  CANCELLED:       'bg-red-100 text-red-800',
};

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        uploads:    { take: 3 },
        characters: { select: { id: true } },
        generatedImages: { where: { isSelected: true }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch { return null; }
}

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <div dir="rtl" className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">לוח ניהול הזמנות</h1>
        {orders !== null && (
          <span className="admin-count">{orders.length} הזמנות</span>
        )}
      </div>

      {orders === null && (
        <div className="rounded-2xl bg-red-50 p-8 text-center text-red-600">
          ⚠️ לא ניתן להתחבר לבסיס הנתונים.
        </div>
      )}

      {orders?.length === 0 && (
        <div className="rounded-2xl bg-white shadow-sm p-12 text-center text-[var(--c-muted)]">
          אין הזמנות עדיין.
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>סטטוס</th>
                <th>לקוח</th>
                <th>תמונות</th>
                <th>נבחרו</th>
                <th>תאריך</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const date = new Date(order.createdAt);
                return (
                  <tr key={order.id}>
                    <td>
                      <span className="font-semibold text-[var(--c-dark)]">{order.subjectName}</span>
                      <span className="admin-sub block">{order.characters.length} דמויות</span>
                    </td>
                    <td>
                      <Badge className={`${STATUS_COLOR[order.status]} border-0 text-xs`}>
                        {STATUS_HEBREW[order.status]}
                      </Badge>
                      {order.trainingFailed && (
                        <Badge className="bg-red-100 text-red-700 border-0 text-xs mr-1">⚠ נכשל</Badge>
                      )}
                    </td>
                    <td>
                      <span className="admin-email">{order.customerEmail}</span>
                    </td>
                    <td>
                      {order.uploads.length > 0 ? (
                        <div className="admin-thumbs">
                          {order.uploads.map((u) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={u.id} src={u.storageUrl} alt="" className="admin-thumb" />
                          ))}
                        </div>
                      ) : (
                        <span className="admin-sub">—</span>
                      )}
                    </td>
                    <td>
                      <span className="font-semibold text-[var(--c-brand)]">
                        {order.generatedImages.length}/{order.characters.length}
                      </span>
                    </td>
                    <td className="admin-td-date">
                      {date.toLocaleDateString('he-IL')}
                      <span className="admin-time block">
                        {date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--c-brand)] text-white hover:bg-[var(--c-brand-text)] transition-colors whitespace-nowrap"
                      >
                        פתח →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
