'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface GeneratedImage {
  id: string;
  characterName: string;
  characterIndex: number;
  imageUrl: string;
  variation: string;
  isSample: boolean;
  isSelected: boolean;
}

interface OrderData {
  id: string;
  status: string;
  trainingFailed: boolean;
  loraUrl: string | null;
  aiOverride: string;
  aiLabel: string;
  characters: { name: string; displayName: string; position: number }[];
  generatedImages: GeneratedImage[];
}

export default function AdminOrderRow({ order }: { order: OrderData }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [override, setOverride] = useState(order.aiOverride);
  const [error, setError] = useState('');

  // Group generated images by character
  const imagesByChar: Record<string, GeneratedImage[]> = {};
  for (const img of order.generatedImages) {
    if (!imagesByChar[img.characterName]) imagesByChar[img.characterName] = [];
    imagesByChar[img.characterName].push(img);
  }

  // Count selections
  const selectedCharacters = new Set(
    order.generatedImages.filter((img) => img.isSelected).map((img) => img.characterName)
  );
  const totalChars = order.characters.length;
  const selectedCount = selectedCharacters.size;
  const allSelected = selectedCount === totalChars && totalChars > 0;

  // Check what images exist
  const sampleChars = order.characters.slice(0, 5);
  const hasSamples = sampleChars.every((c) => (imagesByChar[c.name]?.length ?? 0) > 0);
  const hasFullSet = order.characters.every((c) => (imagesByChar[c.name]?.length ?? 0) > 0);

  async function post(url: string, body: object) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'שגיאה' }));
      throw new Error(err.error ?? 'שגיאה');
    }
    return res.json();
  }

  async function handleTrain() {
    setLoading('train'); setError('');
    try {
      await post('/api/fal/train', { orderId: order.id });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה באימון');
    } finally { setLoading(null); }
  }

  async function handleSaveOverride() {
    setLoading('override'); setError('');
    try {
      await post('/api/admin/override', { orderId: order.id, aiOverride: override });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה בשמירה');
    } finally { setLoading(null); }
  }

  async function handleGenerateSamples() {
    setLoading('samples'); setError('');
    try {
      await post('/api/fal/generate', { orderId: order.id, mode: 'samples' });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירת דגימות');
    } finally { setLoading(null); }
  }

  async function handleGenerateFull() {
    setLoading('full'); setError('');
    try {
      await post('/api/fal/generate', { orderId: order.id, mode: 'full' });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירת הסט המלא');
    } finally { setLoading(null); }
  }

  async function handleSelectImage(imageId: string) {
    try {
      await post('/api/admin/select-image', { imageId });
      router.refresh();
    } catch {}
  }

  async function handleDownloadZip() {
    setLoading('zip');
    try {
      window.open(`/api/admin/download-zip?orderId=${order.id}`, '_blank');
    } finally { setLoading(null); }
  }

  // Determine which step is active based on order status
  const isReceived    = order.status === 'RECEIVED';
  const isTraining    = order.status === 'TRAINING';
  const isSampling    = order.status === 'SAMPLING';
  const isProcessing  = order.status === 'PROCESSING_ALL';
  const isReady       = order.status === 'READY_FOR_PRINT';
  const isShipped     = order.status === 'SHIPPED';

  // Helper to render images for a character grouped by variation
  function renderCharacterImages(char: { name: string; displayName: string }) {
    const imgs = imagesByChar[char.name] ?? [];
    if (imgs.length === 0) return null;

    return (
      <div key={char.name} className="mb-4">
        <p className="text-sm font-semibold text-[#4a5568] mb-2">
          {char.displayName}
          {selectedCharacters.has(char.name) && <span className="text-green-600 mr-2">✓ נבחרה</span>}
        </p>
        <div className="flex gap-2 flex-wrap">
          {imgs.map((img) => (
            <div key={img.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl}
                alt={img.characterName}
                className={`admin-gen-thumb cursor-pointer transition-all ${
                  img.isSelected
                    ? 'ring-3 ring-[#667eea] shadow-lg scale-105'
                    : 'hover:ring-2 hover:ring-[#a0aec0]'
                }`}
                onClick={() => handleSelectImage(img.id)}
              />
              {img.isSelected && (
                <span className="absolute top-1 right-1 bg-[#667eea] text-white text-xs rounded-full px-1.5 py-0.5">✓</span>
              )}
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] rounded px-1">
                {img.variation}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Step 1: Train ── */}
      <div className="admin-ai-step">
        <span className="admin-step-label">שלב 1 — אימון LoRA</span>
        <Button
          variant="brand" size="sm"
          disabled={!!loading || isTraining || isSampling || isProcessing || isReady || isShipped}
          onClick={handleTrain}
        >
          {loading === 'train'
            ? '⏳ שולח לאימון...'
            : isTraining
            ? '⏳ מאמן... (ממתין ל-webhook)'
            : isSampling || isProcessing || isReady || isShipped
            ? '✓ מאומן'
            : order.trainingFailed
            ? '🔄 נסה שוב (נכשל)'
            : '🚀 התחל אימון'}
        </Button>
      </div>

      {/* ── AI Override (visible once training started or beyond) ── */}
      {(isSampling || isProcessing || isReady) && (
        <div className="admin-ai-step flex-col !items-start gap-2">
          <span className="admin-step-label">הנחיות AI גלובליות (אופציונלי)</span>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={override}
              onChange={(e) => setOverride(e.target.value)}
              placeholder='לדוגמה: "keep him bald, he looks 40 years old"'
              className="flex-1 h-9 px-3 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#667eea]"
              dir="ltr"
            />
            <Button variant="brand-outline" size="sm" onClick={handleSaveOverride} disabled={loading === 'override'}>
              {loading === 'override' ? '...' : 'שמור'}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Generate Samples (5 chars × 3 variations = 15 images) ── */}
      {isSampling && (
        <div className="admin-ai-step">
          <span className="admin-step-label">שלב 2 — 5 דגימות (5 דמויות × 3 וריאציות = 15 תמונות)</span>
          <Button
            variant="brand" size="sm"
            disabled={!!loading || hasSamples}
            onClick={handleGenerateSamples}
          >
            {loading === 'samples' ? '⏳ מייצר דגימות...' : hasSamples ? '✓ דגימות מוכנות' : '🎨 צור 5 דגימות'}
          </Button>
        </div>
      )}

      {/* ── Sample results ── */}
      {isSampling && hasSamples && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#718096]">בחר תמונה מועדפת לכל דמות (לבדיקת איכות):</p>
          {sampleChars.map((char) => renderCharacterImages(char))}
        </div>
      )}

      {/* ── Step 3: Generate Full Set (20 chars × 3 variations = 60 images) ── */}
      {(isSampling && hasSamples) && (
        <div className="admin-ai-step">
          <span className="admin-step-label">שלב 3 — סט מלא (20 דמויות × 3 וריאציות = 60 תמונות)</span>
          <Button
            variant="brand" size="sm"
            disabled={!!loading || hasFullSet}
            onClick={handleGenerateFull}
          >
            {loading === 'full' ? '⏳ מייצר סט מלא...' : hasFullSet ? '✓ סט מלא מוכן' : '✅ אשר דגימות וצור הכל'}
          </Button>
        </div>
      )}

      {/* ── Full set results ── */}
      {(isProcessing || isReady) && hasFullSet && (
        <div className="flex flex-col gap-2">
          {/* Selection counter */}
          <div className="flex items-center justify-between bg-[#f7fafc] rounded-xl p-3">
            <span className="text-sm font-semibold text-[#4a5568]">
              נבחרו: {selectedCount}/{totalChars} דמויות
            </span>
            <div className="w-48 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#667eea] rounded-full transition-all duration-300"
                style={{ width: `${(selectedCount / totalChars) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-[#718096]">בחר תמונה מנצחת לכל דמות:</p>
          {order.characters.map((char) => renderCharacterImages(char))}
        </div>
      )}

      {/* ── Step 4: Download ZIP ── */}
      {(isProcessing || isReady) && allSelected && (
        <div className="admin-ai-step bg-green-50 border border-green-200 rounded-xl p-3">
          <span className="admin-step-label text-green-800">🎉 כל 20 הדמויות נבחרו — מוכן להדפסה!</span>
          <Button
            variant="brand" size="sm"
            onClick={handleDownloadZip}
            disabled={loading === 'zip'}
          >
            {loading === 'zip' ? '⏳ מכין ZIP...' : '📦 הורד ZIP להדפסה'}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
