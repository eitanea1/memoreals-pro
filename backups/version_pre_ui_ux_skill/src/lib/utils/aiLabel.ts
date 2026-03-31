export function computeAiLabel(age: string, gender: string): string {
  const n = parseInt(age, 10);
  if (isNaN(n)) return '';
  const genderWord = gender === 'Male' ? 'boy' : gender === 'Female' ? 'girl' : 'child';
  if (n < 13) return `${n}-year-old ${genderWord}`;
  const adultWord = gender === 'Male' ? 'man' : gender === 'Female' ? 'woman' : 'person';
  return `${n}-year-old ${adultWord}`;
}
