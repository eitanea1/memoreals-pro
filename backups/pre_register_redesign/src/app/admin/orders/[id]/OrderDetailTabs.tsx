'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import type { SerializedOrder } from './page';
import DetailsTab from './DetailsTab';
import AiTab from './AiTab';
import DownloadTab from './DownloadTab';

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
const GENDER_HEBREW: Record<string, string> = { Male: 'זכר', Female: 'נקבה' };

type Tab = 'details' | 'ai' | 'download';
const TABS: { key: Tab; label: string }[] = [
  { key: 'details',  label: 'פרטים' },
  { key: 'ai',       label: 'AI ועיבוד' },
  { key: 'download', label: 'הורדה' },
];

export default function OrderDetailTabs({ order }: { order: SerializedOrder }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('details');

  const selectedCount = new Set(
    order.generatedImages.filter((g) => g.isSelected).map((g) => g.characterName)
  ).size;
  const allSelected = selectedCount === order.characters.length && order.characters.length > 0;

  return (
    <div dir="rtl" className="admin-page">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[var(--c-brand)] hover:text-[var(--c-brand-text)] font-medium w-fit"
      >
        ← חזרה לרשימה
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="admin-title">{order.subjectName}</h1>
        <Badge className={`${STATUS_COLOR[order.status]} border-0`}>
          {STATUS_HEBREW[order.status]}
        </Badge>
        {order.trainingFailed && (
          <Badge className="bg-red-100 text-red-700 border-0">⚠ אימון נכשל</Badge>
        )}
        <span className="text-sm text-[var(--c-muted)]">
          גיל {order.subjectAge} · {GENDER_HEBREW[order.subjectGender]}
        </span>
      </div>

      {/* Tab bar */}
      <div className="admin-tabs-bar">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`admin-tab ${activeTab === key ? 'admin-tab--active' : ''}`}
          >
            {label}
            {key === 'download' && allSelected && (
              <span className="admin-tab-dot" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="admin-tab-content">
        {activeTab === 'details' && (
          <DetailsTab order={order} onDelete={() => router.push('/admin')} />
        )}
        {activeTab === 'ai' && (
          <AiTab order={order} />
        )}
        {activeTab === 'download' && (
          <DownloadTab
            orderId={order.id}
            selectedCount={selectedCount}
            totalChars={order.characters.length}
            allSelected={allSelected}
          />
        )}
      </div>
    </div>
  );
}
