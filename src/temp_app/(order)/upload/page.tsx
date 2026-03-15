'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '@/context/AppContext';
import DropZone from '@/components/upload/DropZone';
import PhotoPreviewGrid from '@/components/upload/PhotoPreviewGrid';
import CropModal from '@/components/upload/CropModal';
import StepIndicator from '@/components/shared/StepIndicator';
import { Button } from '@/components/ui/button';
import type { UploadedPhoto } from '@/lib/types';

export default function PhotoUploadPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [reCropPhoto, setReCropPhoto] = useState<UploadedPhoto | null>(null);

  const validPhotos = state.photos.filter((p) => !!p.previewUrl);
  const canProceed = validPhotos.length >= 15;

  async function uploadBlob(blob: Blob, originalName: string, previewUrl: string) {
    const id = uuidv4();
    const file = new File([blob], originalName, { type: 'image/jpeg' });
    dispatch({ type: 'ADD_PHOTO_PENDING', photo: { id, url: '', originalName, previewUrl, uploading: true } });
    try {
      const formData = new FormData();
      formData.append('photos', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      const s = result.files[0];
      dispatch({ type: 'ADD_PHOTO_SUCCESS', tempId: id, serverPhoto: { id: s.id, url: s.url, originalName, previewUrl } });
    } catch (err: unknown) {
      dispatch({ type: 'ADD_PHOTO_ERROR', id, error: err instanceof Error ? err.message : 'Upload failed' });
    }
  }

  function handleFiles(files: File[]) {
    setCropQueue((q) => [...q, ...files]);
  }

  function handleCropDone(blob: Blob, croppedPreviewUrl: string) {
    uploadBlob(blob, cropQueue[0].name, croppedPreviewUrl);
    setCropQueue((q) => q.slice(1));
  }

  function handleCropSkip() {
    const file = cropQueue[0];
    uploadBlob(file, file.name, URL.createObjectURL(file));
    setCropQueue((q) => q.slice(1));
  }

  function handleReCropDone(blob: Blob, croppedPreviewUrl: string) {
    if (!reCropPhoto) return;
    dispatch({ type: 'REMOVE_PHOTO', id: reCropPhoto.id });
    uploadBlob(blob, reCropPhoto.originalName, croppedPreviewUrl);
    setReCropPhoto(null);
  }

  return (
    <div className="page" dir="rtl">
      <StepIndicator current={2} />
      <div className="page-header">
        <h2>העלאת תמונות</h2>
        <div className={`selection-counter ${canProceed ? 'complete' : ''}`}>
          {validPhotos.length} / 15+ תמונות
        </div>
      </div>

      <div className="photo-instructions">
        <p className="photo-instructions-title">הנחיות לתמונות:</p>
        <ul>
          <li><strong>העלו 15–25 תמונות</strong> של הדמות בלבד, ללא אנשים אחרים בתמונה</li>
          <li><strong>תמונות פנים ברורות</strong> — ללא משקפי שמש, כובע או מסיכה</li>
          <li><strong>זוויות שונות</strong> — חזית, צד ימין, צד שמאל</li>
          <li><strong>תאורה טובה</strong> — רצוי בחוץ או ליד חלון</li>
          <li><strong>איכות גבוהה</strong> — לא מטושטשות ולא חשוכות מדי</li>
        </ul>

        <div className="pro-tip-box">
          <p className="pro-tip-header">✂️ טיפ מקצועי: אין צורך להכין את התמונות מראש!</p>
          <p className="pro-tip-body">
            לאחר שתבחרו את התמונות, ייפתח עורך שבו תוכלו לחתוך אותן. זה הזמן להסיר אנשים אחרים מהרקע ולוודא שרק הדמות שלכם במרכז.
          </p>

          <div className="pro-tip-flow">
            <div className="flow-step">
              <div className="flow-icon flow-icon--group">
                <svg viewBox="0 0 64 64" aria-label="תמונת קבוצה">
                  <rect width="64" height="64" rx="10" fill="#dde3ea" />
                  <circle cx="12" cy="20" r="7" fill="#9aacba" />
                  <rect x="6" y="29" width="12" height="18" rx="3" fill="#9aacba" />
                  <circle cx="32" cy="18" r="9" fill="#667eea" />
                  <rect x="24" y="29" width="16" height="22" rx="4" fill="#667eea" />
                  <circle cx="52" cy="20" r="7" fill="#9aacba" />
                  <rect x="46" y="29" width="12" height="18" rx="3" fill="#9aacba" />
                </svg>
              </div>
              <p className="flow-label">תמונת קבוצה</p>
            </div>

            <div className="flow-arrow" aria-hidden="true">
              <svg viewBox="0 0 40 20" width="40" height="20">
                <line x1="2" y1="10" x2="30" y2="10" stroke="#667eea" strokeWidth="2.5" strokeLinecap="round" />
                <polyline points="22,4 30,10 22,16" fill="none" stroke="#667eea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="20" y="19" textAnchor="middle" fontSize="7" fill="#667eea" fontWeight="600">חתוך</text>
              </svg>
            </div>

            <div className="flow-step">
              <div className="flow-icon flow-icon--cropped">
                <svg viewBox="0 0 64 64" aria-label="דמות יחידה חתוכה">
                  <rect width="64" height="64" rx="10" fill="#ebf4ff" />
                  <rect x="1" y="1" width="62" height="62" rx="9" fill="none" stroke="#667eea" strokeWidth="2" strokeDasharray="5 3" />
                  <circle cx="32" cy="22" r="13" fill="#667eea" />
                  <rect x="20" y="37" width="24" height="24" rx="5" fill="#667eea" />
                  <circle cx="52" cy="14" r="9" fill="#48bb78" />
                  <polyline points="47,14 51,18 57,9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="flow-label">דמות בלבד</p>
            </div>
          </div>
        </div>
      </div>

      <DropZone onFiles={handleFiles} />
      <PhotoPreviewGrid
        photos={state.photos}
        onRemove={(id) => dispatch({ type: 'REMOVE_PHOTO', id })}
        onCrop={setReCropPhoto}
      />

      <div className="nav-buttons">
        <Button variant="brand" size="xl" disabled={!canProceed} onClick={() => router.push('/summary')}>
          המשך ←
        </Button>
        <Button variant="brand-outline" size="xl" onClick={() => router.push('/characters')}>
          → חזור
        </Button>
      </div>
      {!canProceed && (
        <p className="hint">
          יש להעלות לפחות 15 תמונות כדי להמשיך (נותרו {Math.max(0, 15 - validPhotos.length)})
        </p>
      )}

      {cropQueue.length > 0 && (
        <CropModal
          src={URL.createObjectURL(cropQueue[0])}
          originalName={cropQueue[0].name}
          queuePosition={{ current: state.photos.length + 1, total: state.photos.length + cropQueue.length }}
          onDone={handleCropDone}
          onSkip={handleCropSkip}
        />
      )}

      {reCropPhoto && (
        <CropModal
          src={reCropPhoto.previewUrl || reCropPhoto.url}
          originalName={reCropPhoto.originalName}
          onDone={handleReCropDone}
          onSkip={() => setReCropPhoto(null)}
        />
      )}
    </div>
  );
}
