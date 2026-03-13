import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminOrderRow from './AdminOrderRow';

const STATUS_HEBREW: Record<string, string> = {
  RECEIVED: 'התקבלה',
  TRAINING: 'מאמן...',
  SAMPLING: 'דגימות',
  PROCESSING_ALL: 'מייצר הכל',
  READY_FOR_PRINT: 'מוכנה להדפסה',
  SHIPPED: 'נשלחה',
  CANCELLED: 'בוטלה',
};
const STATUS_COLOR: Record<string, string> = {
  RECEIVED: 'bg-blue-100 text-blue-800',
  TRAINING: 'bg-orange-100 text-orange-700',
  SAMPLING: 'bg-purple-100 text-purple-800',
  PROCESSING_ALL: 'bg-yellow-100 text-yellow-800',
  READY_FOR_PRINT: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-teal-100 text-teal-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
const GENDER_HEBREW: Record<string, string> = { Male: 'זכר', Female: 'נקבה' };

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        uploads: true,
        characters: { orderBy: { position: 'asc' } },
        generatedImages: { orderBy: { characterIndex: 'asc' } },
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
        {orders !== null && <span className="admin-count">{orders.length} הזמנות סה״כ</span>}
      </div>

      {orders === null && (
        <Card className="border-0 shadow-sm rounded-2xl bg-red-50">
          <CardContent className="py-8 text-center text-red-600">
            ⚠️ לא ניתן להתחבר לבסיס הנתונים.
          </CardContent>
        </Card>
      )}

      {orders?.length === 0 && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="py-12 text-center text-[#718096]">אין הזמנות עדיין.</CardContent>
        </Card>
      )}

      {orders && orders.length > 0 && orders.map((order) => (
        <Card key={order.id} className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="pb-2 border-b border-[#f0f4f8]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base font-bold text-[#2d3748]">{order.subjectName}</CardTitle>
                <Badge className={`${STATUS_COLOR[order.status]} border-0 text-xs`}>
                  {STATUS_HEBREW[order.status]}
                </Badge>
                {order.trainingFailed && (
                  <Badge className="bg-red-100 text-red-700 border-0 text-xs">⚠ אימון נכשל</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#718096]">
                <span>{order.customerEmail}</span>
                <span>·</span>
                <span>גיל {order.subjectAge} · {GENDER_HEBREW[order.subjectGender]}</span>
                <span>·</span>
                <span>{new Date(order.createdAt).toLocaleDateString('he-IL')}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="admin-thumbs mb-4">
              {order.uploads.slice(0, 6).map((u) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={u.id} src={u.storageUrl} alt={u.originalName} className="admin-thumb" />
              ))}
              {order.uploads.length > 6 && (
                <div className="admin-thumb admin-thumb-more">+{order.uploads.length - 6}</div>
              )}
            </div>

            {/* Interactive controls */}
            <AdminOrderRow
              order={{
                id:             order.id,
                status:         order.status,
                trainingFailed: order.trainingFailed,
                loraUrl:        order.loraUrl,
                aiOverride:     order.aiOverride,
                aiLabel:        order.aiLabel,
                characters:     order.characters.map((c) => ({ name: c.name, displayName: c.displayName, position: c.position })),
                generatedImages: order.generatedImages.map((g) => ({
                  id: g.id, characterName: g.characterName, characterIndex: g.characterIndex,
                  imageUrl: g.imageUrl, variation: g.variation, isSample: g.isSample, isSelected: g.isSelected,
                })),
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
