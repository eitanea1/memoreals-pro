export interface Character {
  id: string;
  name: string;        // English — used for AI prompt / saved to order
  displayName: string; // Hebrew — shown in the UI
  category: 'superheroes' | 'professions' | 'fairytales' | 'anime' | 'adventures' | 'premium';
  thumbnail?: string; // path to thumbnail image
}

export interface UploadedPhoto {
  id: string;
  url: string;
  originalName: string;
  previewUrl?: string;
  uploading: boolean;
  error?: string;
}

export interface AppState {
  subjectName: string;
  subjectAge: string;
  subjectGender: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string;
  selectedCharacters: Character[];
  photos: UploadedPhoto[];
  orderId: string | null;
}

export type AppAction =
  | { type: 'SET_PERSONAL_DETAILS'; name: string; age: string; gender: string; email: string; phone: string; note: string }
  | { type: 'SELECT_CHARACTER'; character: Character }
  | { type: 'DESELECT_CHARACTER'; id: string }
  | { type: 'ADD_PHOTO_PENDING'; photo: UploadedPhoto }
  | { type: 'ADD_PHOTO_SUCCESS'; tempId: string; serverPhoto: Omit<UploadedPhoto, 'uploading'> }
  | { type: 'ADD_PHOTO_ERROR'; id: string; error: string }
  | { type: 'REMOVE_PHOTO'; id: string }
  | { type: 'SET_ORDER_ID'; orderId: string }
  | { type: 'RESET' };
