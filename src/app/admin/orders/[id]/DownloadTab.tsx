'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DownloadTab({
  orderId,
  selectedCount,
  totalChars,
  allSelected,
}: {
  orderId: string;
  selectedCount: number;
  totalChars: number;
  allSelected: boolean;
}) {
  const [loading, setLoading] = useState<'pdf' | 'pptx' | 'zip' | null>(null);

  function handleDownloadPdf() {
    setLoading('pdf');
    window.open(`/api/admin/download-pdf?orderId=${orderId}`, '_blank');
    setTimeout(() => setLoading(null), 1500);
  }

  function handleDownloadPptx() {
    setLoading('pptx');
    window.open(`/api/admin/download-pptx?orderId=${orderId}`, '_blank');
    setTimeout(() => setLoading(null), 3000);
  }

  function handleDownloadZip() {
    setLoading('zip');
    window.open(`/api/admin/download-zip?orderId=${orderId}`, '_blank');
    setTimeout(() => setLoading(null), 1500);
  }

  if (!allSelected) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="text-4xl">🖼️</div>
        <p className="text-[#718096] text-sm">
          צריך לבחור תמונה לכל {totalChars} הדמויות לפני הורדה.
        </p>
        <div className="w-48 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#667eea] rounded-full transition-all"
            style={{ width: `${(selectedCount / totalChars) * 100}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-[#5b21b6]">
          {selectedCount}/{totalChars} נבחרו
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <span className="text-lg">🎉</span>
        <span className="font-semibold text-sm">כל {totalChars} הדמויות נבחרו — מוכן להדפסה!</span>
      </div>

      {/* PDF download — primary */}
      <div className="rounded-2xl border border-[#e7e0d5] bg-white p-6 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🖨️</span>
          <div>
            <p className="font-semibold text-[#2d3748]">PDF להדפסה</p>
            <p className="text-xs text-[#718096] mt-0.5">
              גודל קלף 63×89מ״מ, bleed 3מ״מ. כל תמונה מופיעה פעמיים (זוג לזיכרון).
            </p>
          </div>
        </div>
        <Button
          variant="brand"
          onClick={handleDownloadPdf}
          disabled={!!loading}
          className="w-full sm:w-auto"
        >
          {loading === 'pdf' ? '⏳ מכין PDF...' : '📄 הורד PDF להדפסה'}
        </Button>
      </div>

      {/* PowerPoint download */}
      <div className="rounded-2xl border border-[#e7e0d5] bg-white p-6 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-semibold text-[#2d3748]">PowerPoint להדפסה</p>
            <p className="text-xs text-[#718096] mt-0.5">
              שקופית לכל קלף, 95×69מ״מ עם bleed 3מ״מ. כל תמונה מופיעה פעמיים.
            </p>
          </div>
        </div>
        <Button
          variant="brand-outline"
          onClick={handleDownloadPptx}
          disabled={!!loading}
          className="w-full sm:w-auto"
        >
          {loading === 'pptx' ? '⏳ מכין PPTX...' : '📊 הורד PowerPoint'}
        </Button>
      </div>

      {/* ZIP download — secondary */}
      <div className="rounded-2xl border border-[#e7e0d5] bg-white p-6 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-semibold text-[#2d3748]">ZIP תמונות גולמיות</p>
            <p className="text-xs text-[#718096] mt-0.5">
              כל התמונות הנבחרות כקבצי PNG נפרדים.
            </p>
          </div>
        </div>
        <Button
          variant="brand-outline"
          onClick={handleDownloadZip}
          disabled={!!loading}
          className="w-full sm:w-auto"
        >
          {loading === 'zip' ? '⏳ מכין ZIP...' : '📦 הורד ZIP'}
        </Button>
      </div>
    </div>
  );
}
