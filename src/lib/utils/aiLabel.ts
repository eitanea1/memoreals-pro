export function computeAiLabel(age: string, gender: string): string {
  const n = parseInt(age, 10);
  if (isNaN(n)) return '';
  if (gender === 'Male') return n < 13 ? 'child_male' : 'adult_male';
  if (gender === 'Female') return n < 13 ? 'child_female' : 'adult_female';
  return n < 13 ? 'child_other' : 'adult_other';
}
