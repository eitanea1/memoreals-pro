'use client';

import { useState } from 'react';
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
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

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
          <p className="text-sm font-semibold text-[var(--c-muted)] mb-2">
            תמונות שהועלו ({order.uploads.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {order.uploads.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setLightboxUrl(u.storageUrl)}
                className="cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.storageUrl}
                  alt={u.originalName}
                  className="w-20 h-20 object-cover rounded-xl border border-[var(--c-border)] hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Characters list */}
      <div>
        <p className="text-sm font-semibold text-[var(--c-muted)] mb-2">
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
      <div className="pt-2 border-t border-[var(--c-border)]">
        <AdminDeleteOrder orderId={order.id} onSuccess={onDelete} />
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute top-4 left-4 text-white text-3xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
            onClick={() => setLightboxUrl(null)}
            aria-label="סגור"
          >
            ×
          </button>
        </div>
      )}
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
      <p className="text-xs font-semibold text-[var(--c-muted)] uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm text-[var(--c-dark)] ${mono ? 'font-mono text-xs break-all' : 'font-medium'}`}>
        {value}
      </p>
    </div>
  );
}
