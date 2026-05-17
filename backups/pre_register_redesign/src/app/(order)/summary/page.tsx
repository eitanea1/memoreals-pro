'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PhotoPreviewGrid from '@/components/upload/PhotoPreviewGrid';
import StepIndicator from '@/components/shared/StepIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { submitOrder } from '@/app/actions/order';

const CATEGORY_HEBREW: Record<string, string> = {
  superheroes: 'גיבורי על',
  professions: 'מקצועות',
  fairytales: 'אגדות',
};

const GENDER_HEBREW: Record<string, string> = {
  Male: 'זכר',
  Female: 'נקבה',
};

export default function SummaryPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const grouped = {
    superheroes: state.selectedCharacters.filter((c) => c.category === 'superheroes'),
    professions: state.selectedCharacters.filter((c) => c.category === 'professions'),
    fairytales:  state.selectedCharacters.filter((c) => c.category === 'fairytales'),
  };

  const validPhotos = state.photos.filter((p) => !!p.previewUrl);

  async function handlePlaceOrder() {
    setLoading(true);
    setError('');
    try {
      const result = await submitOrder({
        name:       state.subjectName,
        age:        state.subjectAge,
        gender:     state.subjectGender,
        email:      state.customerEmail,
        phone:      state.customerPhone,
        note:       state.customerNote,
        characters: state.selectedCharacters.map((c) => ({
          name:        c.name,
          displayName: c.displayName,
          category:    c.category,
        })),
        photos: validPhotos.map((p) => ({
          id:           p.id,
          url:          p.url,
          originalName: p.originalName,
        })),
      });
      dispatch({ type: 'SET_ORDER_ID', orderId: result.orderId });
      router.push('/confirmation');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בשליחת ההזמנה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" dir="rtl">
      <StepIndicator current={3} />
      <h2 className="text-2xl font-bold">סיכום הזמנה</h2>

      {/* Personal details */}
      <Card className="bg-white border-0 shadow-sm rounded-2xl ring-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-right text-[var(--c-dark)]">פרטי המשתתף/ת</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="personal-details-summary">
            {[
              { label: 'שם',    value: state.subjectName },
              { label: 'גיל',   value: state.subjectAge },
              { label: 'מין',   value: GENDER_HEBREW[state.subjectGender] ?? state.subjectGender },
              { label: 'אימייל', value: state.customerEmail },
              ...(state.customerPhone ? [{ label: 'טלפון', value: state.customerPhone }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="detail-row">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Characters */}
      <Card className="bg-white border-0 shadow-sm rounded-2xl ring-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-right text-[var(--c-dark)]">
            דמויות שנבחרו ({state.selectedCharacters.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {(['superheroes', 'professions', 'fairytales'] as const).map((cat) =>
            grouped[cat].length > 0 ? (
              <div key={cat} className="summary-category">
                <h4 className="summary-cat-title">{CATEGORY_HEBREW[cat]}</h4>
                <div className="flex flex-wrap gap-2">
                  {grouped[cat].map((c) => (
                    <Badge key={c.id} variant="secondary" className="bg-[var(--c-brand-light)] text-[var(--c-brand-text)] hover:bg-[var(--c-brand-light)] text-sm px-3 py-1">
                      {c.displayName}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </CardContent>
      </Card>

      {/* Photos */}
      <Card className="bg-white border-0 shadow-sm rounded-2xl ring-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-right text-[var(--c-dark)]">
            תמונות ({validPhotos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoPreviewGrid photos={validPhotos} onRemove={() => {}} showRemove={false} />
        </CardContent>
      </Card>

      {error && <p className="error-banner">{error}</p>}

      <div className="nav-buttons">
        <Button variant="brand" size="xl" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? 'שולח הזמנה...' : 'שלח הזמנה ✓'}
        </Button>
        <Button variant="brand-outline" size="xl" onClick={() => router.push('/upload')}>
          → חזור
        </Button>
      </div>
    </div>
  );
}
