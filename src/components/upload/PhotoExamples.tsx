import React from 'react';

// Illustrated "good vs bad photo" guide for the upload step. Placeholder SVG
// illustrations for now — swap for real example photos later.

const GREEN = '#16a34a';
const RED = '#dc2626';

/** A small framed "photo" with a corner ✓/✗ badge. */
function Frame({
  border,
  bg = '#e9eef4',
  badge,
  children,
}: {
  border: string;
  bg?: string;
  badge: '✓' | '✗';
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 64 64" style={{ width: '100%', display: 'block', borderRadius: 12 }}>
        <rect x="1.5" y="1.5" width="61" height="61" rx="10" fill={bg} stroke={border} strokeWidth="3" />
        {children}
      </svg>
      <span
        style={{
          position: 'absolute', top: -7, insetInlineStart: -7,
          width: 20, height: 20, borderRadius: '50%', background: border, color: '#fff',
          fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}
      >
        {badge}
      </span>
    </div>
  );
}

/** A simple face. r controls size; sunglasses/blur/opacity toggle the bad variants. */
function Face({ r = 14, cy = 28, sunglasses = false, opacity = 1 }: { r?: number; cy?: number; sunglasses?: boolean; opacity?: number }) {
  const cx = 32;
  return (
    <g opacity={opacity}>
      <rect x={cx - r * 0.85} y={cy + r * 0.55} width={r * 1.7} height={r * 1.5} rx={r * 0.4} fill="#5b7a99" />
      <circle cx={cx} cy={cy} r={r} fill="#f1c9a5" />
      {sunglasses ? (
        <rect x={cx - r * 0.62} y={cy - r * 0.28} width={r * 1.24} height={r * 0.4} rx="2" fill="#222" />
      ) : (
        <>
          <circle cx={cx - r * 0.36} cy={cy - r * 0.1} r={Math.max(1.3, r * 0.12)} fill="#3a2a1a" />
          <circle cx={cx + r * 0.36} cy={cy - r * 0.1} r={Math.max(1.3, r * 0.12)} fill="#3a2a1a" />
        </>
      )}
      <path
        d={`M${cx - r * 0.4} ${cy + r * 0.32} Q${cx} ${cy + r * 0.66} ${cx + r * 0.4} ${cy + r * 0.32}`}
        stroke="#9a6a4a" strokeWidth={Math.max(1, r * 0.1)} fill="none" strokeLinecap="round"
      />
    </g>
  );
}

function Example({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div style={{ width: 84, textAlign: 'center' }}>
      {children}
      <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--ink-2, #555)', lineHeight: 1.3 }}>{caption}</p>
    </div>
  );
}

export default function PhotoExamples() {
  return (
    <div
      style={{
        background: 'var(--surface, #fff)', border: '1px solid var(--line, #e7e0d5)',
        borderRadius: 16, padding: '18px 20px', margin: '0 0 24px',
      }}
      dir="rtl"
    >
      {/* GOOD */}
      <p style={{ margin: '0 0 10px', fontWeight: 800, color: GREEN, fontSize: 14 }}>✅ ככה כן — תמונות טובות</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        <Example caption="פנים גדולות ומקרוב">
          <Frame border={GREEN} badge="✓"><Face r={18} cy={30} /></Frame>
        </Example>
        <Example caption="תאורה טובה">
          <Frame border={GREEN} bg="#fff4dd" badge="✓">
            <circle cx="51" cy="14" r="6" fill="#fbbf24" />
            <Face r={14} />
          </Frame>
        </Example>
        <Example caption="חזית, ישירות למצלמה">
          <Frame border={GREEN} badge="✓"><Face r={14} /></Frame>
        </Example>
      </div>

      {/* BAD */}
      <p style={{ margin: '0 0 10px', fontWeight: 800, color: RED, fontSize: 14 }}>❌ ככה לא</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Example caption="מטושטש">
          <Frame border={RED} badge="✗">
            <defs>
              <filter id="ex-blur"><feGaussianBlur stdDeviation="1.4" /></filter>
            </defs>
            <g filter="url(#ex-blur)"><Face r={14} /></g>
          </Frame>
        </Example>
        <Example caption="פנים רחוקות / קטנות">
          <Frame border={RED} badge="✗"><Face r={6} cy={24} /></Frame>
        </Example>
        <Example caption="חשוך מדי">
          <Frame border={RED} bg="#2a2f3a" badge="✗"><Face r={14} opacity={0.45} /></Frame>
        </Example>
        <Example caption="משקפי שמש / כובע">
          <Frame border={RED} badge="✗"><Face r={14} sunglasses /></Frame>
        </Example>
      </div>
    </div>
  );
}
