'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { buildPrompt, VARIATIONS, type PromptVariation } from '@/lib/prompts';
import type { SerializedOrder } from './page';

interface GeneratedImage {
  id: string;
  characterName: string;
  characterIndex: number;
  imageUrl: string;
  variation: string;
  isSample: boolean;
  isSelected: boolean;
}

export default function AiTab({ order }: { order: SerializedOrder }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [override, setOverride] = useState(order.aiOverride);
  const [error, setError] = useState('');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [expandedChar, setExpandedChar] = useState<string | null>(null);
  const [charPrompts, setCharPrompts] = useState<Record<string, Record<string, string>>>({});

  // Group generated images by character
  const imagesByChar: Record<string, GeneratedImage[]> = {};
  for (const img of order.generatedImages) {
    if (!imagesByChar[img.characterName]) imagesByChar[img.characterName] = [];
    imagesByChar[img.characterName].push(img);
  }

  const selectedCharacters = new Set(
    order.generatedImages.filter((img) => img.isSelected).map((img) => img.characterName)
  );
  const totalChars = order.characters.length;
  const selectedCount = selectedCharacters.size;

  const sampleChars = order.characters.slice(0, 5);
  const hasSamples = sampleChars.every((c) => (imagesByChar[c.name]?.length ?? 0) > 0);
  const hasFullSet = order.characters.every((c) => (imagesByChar[c.name]?.length ?? 0) > 0);

  const isTraining   = order.status === 'TRAINING';
  const isSampling   = order.status === 'SAMPLING';
  const isProcessing = order.status === 'PROCESSING_ALL';
  const isReady      = order.status === 'READY_FOR_PRINT';
  const isShipped    = order.status === 'SHIPPED';

  const VARIATION_LABELS: Record<string, string> = {
    variation_a: 'וריאציה A',
    variation_b: 'וריאציה B',
  };

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

  async function handleRegenerateChar(charName: string) {
    setLoading(`regen-${charName}`); setError('');
    try {
      const customPrompts = charPrompts[charName] ?? {};
      await post('/api/fal/generate', {
        orderId: order.id,
        mode: 'single',
        characterName: charName,
        customPrompts,
      });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירה מחדש');
    } finally { setLoading(null); }
  }

  async function handleSelectImage(imageId: string) {
    try {
      await post('/api/admin/select-image', { imageId });
      router.refresh();
    } catch {}
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await post('/api/admin/delete-image', { imageId });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה במחיקת תמונה');
    }
  }

  function getDefaultPrompt(charName: string, variation: PromptVariation): string {
    return buildPrompt({
      characterName: charName,
      aiLabel: order.aiLabel,
      aiOverride: order.aiOverride,
      variation,
    });
  }

  function togglePromptEditor(charName: string) {
    if (expandedChar === charName) { setExpandedChar(null); return; }
    if (!charPrompts[charName]) {
      const defaults: Record<string, string> = {};
      for (const v of VARIATIONS) defaults[v] = getDefaultPrompt(charName, v);
      setCharPrompts((prev) => ({ ...prev, [charName]: defaults }));
    }
    setExpandedChar(charName);
  }

  function updateCharPrompt(charName: string, variation: string, value: string) {
    setCharPrompts((prev) => ({
      ...prev,
      [charName]: { ...(prev[charName] ?? {}), [variation]: value },
    }));
  }

  function renderCharacterImages(char: { name: string; displayName: string }, showRegenerate: boolean) {
    const imgs = imagesByChar[char.name] ?? [];
    return (
      <div key={char.name} className="mb-6 border border-[var(--c-border)] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[var(--c-mid)]">
            {char.displayName}
            {selectedCharacters.has(char.name) && <span className="text-green-600 mr-2">✓ נבחרה</span>}
          </p>
          {showRegenerate && (
            <div className="flex gap-2">
              <Button variant="brand-outline" size="sm" onClick={() => togglePromptEditor(char.name)}>
                {expandedChar === char.name ? 'סגור פרומפטים' : 'ערוך פרומפטים'}
              </Button>
              <Button
                variant="brand" size="sm"
                disabled={loading === `regen-${char.name}`}
                onClick={() => handleRegenerateChar(char.name)}
              >
                {loading === `regen-${char.name}` ? '⏳ מייצר...' : '🔄 ג׳נרט מחדש'}
              </Button>
            </div>
          )}
        </div>

        {imgs.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {imgs.map((img) => (
              <div key={img.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.characterName}
                  className={`admin-gen-thumb cursor-pointer transition-all ${
                    img.isSelected
                      ? 'ring-3 ring-[var(--c-brand-mid)] shadow-lg scale-105'
                      : 'hover:ring-2 hover:ring-[var(--c-border-mid)]'
                  }`}
                  onClick={() => handleSelectImage(img.id)}
                  onDoubleClick={(e) => { e.stopPropagation(); setLightboxUrl(img.imageUrl); }}
                />
                {img.isSelected && (
                  <span className="absolute top-1 right-1 bg-[var(--c-brand-mid)] text-white text-xs rounded-full px-1.5 py-0.5">✓</span>
                )}
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] rounded px-1">
                  {img.variation}
                </span>
                <button
                  className="absolute top-1 left-1 bg-red-600/80 hover:bg-red-600 text-white text-[10px] rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                  title="מחק תמונה"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        {expandedChar === char.name && (
          <div className="flex flex-col gap-2 mt-3 p-3 bg-[var(--c-bg)] rounded-lg">
            {VARIATIONS.map((v) => (
              <div key={v} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[var(--c-muted)]">{VARIATION_LABELS[v] ?? v}</label>
                <textarea
                  value={charPrompts[char.name]?.[v] ?? ''}
                  onChange={(e) => updateCharPrompt(char.name, v, e.target.value)}
                  className="w-full h-20 px-2 py-1 text-xs border border-[var(--c-border)] rounded-lg focus:outline-none focus:border-[var(--c-brand-mid)] font-mono"
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Step 1: Train */}
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
            : order.trainingFailed
            ? '🔄 נסה שוב (נכשל)'
            : '🚀 התחל אימון'}
        </Button>
      </div>

      {/* AI Override */}
      {(isSampling || isProcessing || isReady) && (
        <div className="admin-ai-step flex-col !items-start gap-2">
          <span className="admin-step-label">הנחיות AI גלובליות (אופציונלי)</span>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={override}
              onChange={(e) => setOverride(e.target.value)}
              placeholder='לדוגמה: "keep him bald, he looks 40 years old"'
              className="flex-1 h-9 px-3 text-sm border border-[var(--c-border)] rounded-lg focus:outline-none focus:border-[var(--c-brand-mid)]"
              dir="ltr"
            />
            <Button variant="brand-outline" size="sm" onClick={handleSaveOverride} disabled={loading === 'override'}>
              {loading === 'override' ? '...' : 'שמור'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Samples */}
      {isSampling && (
        <div className="admin-ai-step">
          <span className="admin-step-label">שלב 2 — 5 דגימות (5 דמויות × 2 וריאציות)</span>
          <Button
            variant="brand" size="sm"
            disabled={!!loading || hasSamples}
            onClick={handleGenerateSamples}
          >
            {loading === 'samples' ? '⏳ מייצר דגימות...' : hasSamples ? '✓ דגימות מוכנות' : '🎨 צור 5 דגימות'}
          </Button>
        </div>
      )}

      {isSampling && hasSamples && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[var(--c-muted)]">בחר תמונה מועדפת לכל דמות (לבדיקת איכות):</p>
          {sampleChars.map((char) => renderCharacterImages(char, true))}
        </div>
      )}

      {/* Step 3: Full set */}
      {isSampling && hasSamples && (
        <div className="admin-ai-step">
          <span className="admin-step-label">שלב 3 — סט מלא ({totalChars} דמויות × 2 וריאציות)</span>
          <Button
            variant="brand" size="sm"
            disabled={!!loading || hasFullSet}
            onClick={handleGenerateFull}
          >
            {loading === 'full' ? '⏳ מייצר סט מלא...' : hasFullSet ? '✓ סט מלא מוכן' : '✅ אשר דגימות וצור הכל'}
          </Button>
        </div>
      )}

      {/* Full set results */}
      {(isProcessing || isReady) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-[var(--c-bg)] rounded-xl p-3">
            <span className="text-sm font-semibold text-[var(--c-mid)]">
              נבחרו: {selectedCount}/{totalChars} דמויות
            </span>
            <div className="w-48 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--c-brand-mid)] rounded-full transition-all duration-300"
                style={{ width: `${(selectedCount / totalChars) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-[var(--c-muted)]">בחר תמונה מנצחת לכל דמות:</p>
          {order.characters.map((char) => renderCharacterImages(char, true))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

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
            className="absolute top-4 left-4 text-white text-3xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
            onClick={() => setLightboxUrl(null)}
          >
            ×
          </button>
          <a
            href={lightboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 text-white text-sm bg-black/50 rounded-lg px-3 py-2 hover:bg-black/70"
            onClick={(e) => e.stopPropagation()}
          >
            פתח בטאב חדש ↗
          </a>
        </div>
      )}
    </div>
  );
}
