'use client';

import type { SerializedOrder } from './page';
import AdminDeleteOrder from '@/app/admin/AdminDeleteOrder';

const GENDER_HEBREW: Record<string, string> = { Male: 'זכר', Female: 'נקבה' };

export default function DetailsTab({
  order,
  onDelete,
}: {
  order: SerializedOrder;
  onDelete: () => void;
}) {
  const date = new Date(order.createdAt);

  return (
    <div className="flex flex-col gap-6">
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <InfoField label="שם הילד/ה" value={order.subjectName} />
        <InfoField label="גיל" value={order.subjectAge} />
        <InfoField label="מין" value={GENDER_HEBREW[order.subjectGender] ?? order.subjectGender} />
        <InfoField label="אימייל" value={order.customerEmail || '—'} />
        <InfoField label="טלפון" value={order.customerPhone || '—'} />
        <InfoField
          label="תאריך הזמנה"
          value={date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        />
        {order.customerNote && (
          <div className="col-span-full">
            <InfoField label="הערה" value={order.customerNote} />
          </div>
        )}
        <div className="col-span-full">
          <InfoField label="מספר הזמנה" value={order.id} mono />
        </div>
      </div>

      {/* Uploaded photos */}
      {order.uploads.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-[#718096] mb-2">
            תמונות שהועלו ({order.uploads.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {order.uploads.map((u) => (
              <a key={u.id} href={u.storageUrl} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.storageUrl}
                  alt={u.originalName}
                  className="w-20 h-20 object-cover rounded-xl border border-[#e7e0d5] hover:scale-105 transition-transform"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Characters list */}
      <div>
        <p className="text-sm font-semibold text-[#718096] mb-2">
          דמויות ({order.characters.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {order.characters.map((c) => (
            <span key={c.id} className="admin-char-chip">
              {c.displayName}
            </span>
          ))}
        </div>
      </div>

      {/* Delete */}
      <div className="pt-2 border-t border-[#e7e0d5]">
        <AdminDeleteOrder orderId={order.id} onSuccess={onDelete} />
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#a8a29e] uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm text-[#2d3748] ${mono ? 'font-mono text-xs break-all' : 'font-medium'}`}>
        {value}
      </p>
    </div>
  );
}
