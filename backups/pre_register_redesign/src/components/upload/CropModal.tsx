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

export default function CropModal({ src, originalName, queuePosition, onDone, onSkip }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop({ unit: '%', width: 75, height: 75 }, width, height));
  }

  function handleApply() {
    if (!completedCrop || !imgRef.current) return;
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

    canvas.toBlob(
      (blob) => {
        if (blob) onDone(blob, canvas.toDataURL('image/jpeg', 0.9));
      },
      'image/jpeg',
      0.92,
    );
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
      </div>
    </div>
  );
}
