export type OrderStatus = 'RECEIVED' | 'TRAINING' | 'SAMPLING' | 'PROCESSING_ALL' | 'READY_FOR_PRINT' | 'SHIPPED' | 'CANCELLED';

export interface Character {
  id: string;
  name: string;
  displayName: string;
  category: 'superheroes' | 'professions' | 'fairytales' | 'custom';
}
