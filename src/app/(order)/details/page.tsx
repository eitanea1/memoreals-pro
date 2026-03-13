'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import StepIndicator from '@/components/shared/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ENGLISH_ONLY = /^[A-Za-z\s]+$/;

const GENDER_OPTIONS = [
  { label: 'זכר', value: 'Male' },
  { label: 'נקבה', value: 'Female' },
];

export default function PersonalDetailsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  const [name, setName]   = useState(state.subjectName);
  const [age, setAge]     = useState(state.subjectAge);
  const [gender, setGender]   = useState(state.subjectGender);
  const [email, setEmail] = useState(state.customerEmail);
  const [phone, setPhone] = useState(state.customerPhone);
  const [nameTouched, setNameTouched] = useState(false);

  const nameIsValid = name.trim().length > 0 && ENGLISH_ONLY.test(name.trim());
  const nameError   = nameTouched && name.trim().length > 0 && !ENGLISH_ONLY.test(name.trim());
  const canProceed  = nameIsValid && age.trim().length > 0 && gender.length > 0 && email.trim().length > 0;

  function handleNext() {
    dispatch({ type: 'SET_PERSONAL_DETAILS', name: name.trim(), age: age.trim(), gender, email: email.trim(), phone: phone.trim() });
    router.push('/characters');
  }

  return (
    <div className="page" dir="rtl">
      <StepIndicator current={0} />

      <div className="page-header">
        <h2>פרטי המשתתף/ת</h2>
      </div>

      <Card className="max-w-xl w-full mx-auto bg-white shadow-sm border-0 ring-0 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-right">מי משתתף במשחק?</CardTitle>
          <CardDescription className="text-right">
            פרטים אלו נדרשים ליצירת תמונות AI מדויקות עבור משחק הזיכרון.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">

          {/* Subject Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject-name" className="font-semibold text-[#2d3748]">
              שם המשתתף/ת (באנגלית)
            </Label>
            <Input
              id="subject-name"
              type="text"
              placeholder="e.g. Emma"
              value={name}
              dir="ltr"
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              aria-invalid={nameError}
              autoFocus
              className="h-11 text-base rounded-xl border-[#e2e8f0] focus-visible:border-[#667eea]"
            />
            {nameError && (
              <p className="text-sm text-red-500">
                יש להזין את השם באנגלית בלבד (עבור עיצובי ה-AI)
              </p>
            )}
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject-age" className="font-semibold text-[#2d3748]">גיל</Label>
            <Input
              id="subject-age"
              type="number"
              placeholder="לדוגמה: 7"
              min={1}
              max={120}
              value={age}
              dir="ltr"
              onChange={(e) => setAge(e.target.value)}
              className="h-11 text-base rounded-xl border-[#e2e8f0] focus-visible:border-[#667eea]"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-semibold text-[#2d3748]">מין</Label>
            <div className="flex gap-3">
              {GENDER_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`gender-btn ${gender === value ? 'selected' : ''}`}
                  onClick={() => setGender(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-[#e2e8f0]" />
          <p className="text-sm font-semibold text-[#4a5568]">פרטי יצירת קשר</p>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customer-email" className="font-semibold text-[#2d3748]">
              אימייל <span className="text-red-400">*</span>
            </Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              dir="ltr"
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 text-base rounded-xl border-[#e2e8f0] focus-visible:border-[#667eea]"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customer-phone" className="font-semibold text-[#2d3748]">
              טלפון <span className="text-[#a0aec0] text-xs font-normal">(אופציונלי)</span>
            </Label>
            <Input
              id="customer-phone"
              type="tel"
              placeholder="05X-XXXXXXX"
              value={phone}
              dir="ltr"
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 text-base rounded-xl border-[#e2e8f0] focus-visible:border-[#667eea]"
            />
          </div>

        </CardContent>
      </Card>

      <div className="nav-buttons">
        <Button variant="brand" size="xl" disabled={!canProceed} onClick={handleNext}>
          המשך ←
        </Button>
      </div>
      {!canProceed && (
        <p className="hint">יש למלא שם, גיל, מין ואימייל כדי להמשיך</p>
      )}
    </div>
  );
}
