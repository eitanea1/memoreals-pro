'use client';

import { useRouter } from 'next/navigation';

const STEPS = [
  { label: 'דמויות ופרטים',     path: '/details' },
  { label: 'תמונות פנים',       path: '/upload' },
  { label: 'משלוח ויצירת קשר',  path: '/shipping' },
  { label: 'סיכום הזמנה',       path: '/summary' },
];

interface Props {
  current: number; // 0-indexed
}

export default function StepIndicator({ current }: Props) {
  const router = useRouter();

  return (
    <div className="step-indicator">
      {STEPS.map((step, i) => (
        <div
          key={step.path}
          className={`step ${i === current ? 'active' : i < current ? 'done' : ''}`}
          onClick={() => i < current && router.push(step.path)}
          style={{ cursor: i < current ? 'pointer' : 'default' }}
        >
          <span className="step-num">{i + 1}</span>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
