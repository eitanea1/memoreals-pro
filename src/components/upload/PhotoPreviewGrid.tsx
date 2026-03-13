'use client';

import type { UploadedPhoto } from '../../lib/types';
import PhotoThumbnail from './PhotoThumbnail';

interface Props {
  photos: UploadedPhoto[];
  onRemove: (id: string) => void;
  onCrop?: (photo: UploadedPhoto) => void;
  showRemove?: boolean;
}

export default function PhotoPreviewGrid({ photos, onRemove, onCrop, showRemove = true }: Props) {
  if (photos.length === 0) return null;
  return (
    <div className="photo-grid">
      {photos.map((p) => (
        <PhotoThumbnail key={p.id} photo={p} onRemove={onRemove} onCrop={onCrop} showRemove={showRemove} />
      ))}
    </div>
  );
}
