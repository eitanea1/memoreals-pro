export function formatOrderId(displayNumber: number | null | undefined): string {
  if (displayNumber == null) return '';
  return `MR-${displayNumber}`;
}
