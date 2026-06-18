'use client';

import { useRef, useState } from 'react';
import ReactCrop, { centerCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
  src: string;
  originalName: string;
  queuePosition?: { current: number; total: number };
  onDone: (blob: Blob, previewUrl: string) => void;
  onSkip: () => void;
}

// Warn (don't block) when the training image would be too low-resolution.
// Faces below these sizes produce soft, blurry LoRA results.
const MIN_CROP_PX = 600; // shortest side of the cropped output
const MIN_ORIG_PX = 800; // shortest side of the original photo

export default function CropModal({ src, originalName, queuePosition, onDone, onSkip }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [origLowRes, setOrigLowRes] = useState(false);
  // When the cropped area is too small we pause to warn before exporting.
  const [pending, setPending] = useState<{ canvas: HTMLCanvasElement; w: number; h: number } | null>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    setCrop(centerCrop({ unit: '%', width: 75, height: 75 }, el.width, el.height));
    setOrigLowRes(Math.min(el.naturalWidth, el.naturalHeight) < MIN_ORIG_PX);
  }

  function buildCanvas(): { canvas: HTMLCanvasElement; w: number; h: number } | null {
    if (!completedCrop || !imgRef.current) return null;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(completedCrop.width * scaleX);
    canvas.height = Math.round(completedCrop.height * scaleY);

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      canvas.width,
      canvas.height,
    );
    return { canvas, w: canvas.width, h: canvas.height };
  }

  function exportCanvas(canvas: HTMLCanvasElement) {
    canvas.toBlob(
      (blob) => {
        if (blob) onDone(blob, canvas.toDataURL('image/jpeg', 0.9));
      },
      'image/jpeg',
      0.92,
    );
  }

  function handleApply() {
    const built = buildCanvas();
    if (!built) return;
    // Too small → warn first; the customer can re-crop or proceed anyway.
    if (Math.min(built.w, built.h) < MIN_CROP_PX) {
      setPending(built);
      return;
    }
    exportCanvas(built.canvas);
  }

  return (
    <div className="crop-overlay" onClick={(e) => e.target === e.currentTarget && onSkip()}>
      <div className="crop-modal">
        <div className="crop-modal-header">
          <div>
            <h3>חיתוך תמונה</h3>
            <p className="crop-filename">{originalName}</p>
          </div>
          {queuePosition && (
            <span className="crop-queue-badge">
              {queuePosition.current} / {queuePosition.total}
            </span>
          )}
        </div>

        <p className="crop-instructions">
          גררו לבחירת האזור לשמירה. מומלץ להתמקד בפנים ובגוף ולהסיר הסחות רקע.
        </p>

        {origLowRes && (
          <div style={{
            background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e',
            borderRadius: 10, padding: '10px 14px', margin: '0 0 12px', fontSize: 13, lineHeight: 1.5,
          }}>
            ⚠️ התמונה המקורית ברזולוציה נמוכה — התוצאה עלולה לצאת מטושטשת. עדיף תמונה חדה, מוארת ומקרוב.
          </div>
        )}

        <div className="crop-canvas-wrapper">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            minWidth={20}
            minHeight={20}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="crop-image"
            />
          </ReactCrop>
        </div>

        {pending ? (
          <div style={{
            background: '#fff7ed', border: '1px solid #fb923c', borderRadius: 12, padding: '14px 16px', marginTop: 4,
          }}>
            <p style={{ margin: '0 0 10px', fontSize: 14, color: '#9a3412', lineHeight: 1.6 }}>
              ⚠️ האזור שבחרת קטן ({pending.w}×{pending.h} פיקסלים) — התוצאה עלולה לצאת מטושטשת.
              עדיף לחתוך פחות צמוד, או להשתמש בתמונה חדה ומקרוב יותר.
            </p>
            <div className="crop-modal-actions">
              <button className="btn btn-secondary" onClick={() => setPending(null)}>
                חתוך מחדש
              </button>
              <button className="btn btn-primary" onClick={() => exportCanvas(pending.canvas)}>
                המשך בכל זאת
              </button>
            </div>
          </div>
        ) : (
          <div className="crop-modal-actions">
            <button className="btn btn-secondary" onClick={onSkip}>
              דלג — השתמש בתמונה המלאה
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApply}
              disabled={!completedCrop?.width || !completedCrop?.height}
            >
              התחל חיתוך ועיבוד ✂️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
