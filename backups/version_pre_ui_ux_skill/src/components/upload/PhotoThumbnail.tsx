'use client';

import type { UploadedPhoto } from '../../lib/types';

interface Props {
  photo: UploadedPhoto;
  onRemove: (id: string) => void;
  onCrop?: (photo: UploadedPhoto) => void;
  showRemove?: boolean;
}

export default function PhotoThumbnail({ photo, onRemove, onCrop, showRemove = true }: Props) {
  const src = photo.previewUrl || photo.url;

  return (
    <div className={`photo-thumb ${photo.uploading ? 'uploading' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={photo.originalName} />
      {photo.uploading && <div className="upload-overlay"><span className="spinner" /></div>}
      {showRemove && !photo.uploading && (
        <div className="photo-actions">
          {onCrop && !photo.error && (
            <button className="photo-action-btn crop-btn" onClick={() => onCrop(photo)} aria-label="Crop photo" title="Crop">
              ✂
            </button>
          )}
          <button className="photo-action-btn remove-btn" onClick={() => onRemove(photo.id)} aria-label="Remove photo" title="Remove">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
