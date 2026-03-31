'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { AppState, AppAction, UploadedPhoto } from '../lib/types';

const initialState: AppState = {
  subjectName: '',
  subjectAge: '',
  subjectGender: '',
  customerEmail: '',
  customerPhone: '',
  selectedCharacters: [],
  photos: [],
  orderId: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PERSONAL_DETAILS':
      return { ...state, subjectName: action.name, subjectAge: action.age, subjectGender: action.gender, customerEmail: action.email, customerPhone: action.phone };

    case 'SELECT_CHARACTER':
      if (state.selectedCharacters.length >= 20) return state;
      if (state.selectedCharacters.find((c) => c.id === action.character.id)) return state;
      return { ...state, selectedCharacters: [...state.selectedCharacters, action.character] };

    case 'DESELECT_CHARACTER':
      return {
        ...state,
        selectedCharacters: state.selectedCharacters.filter((c) => c.id !== action.id),
      };

    case 'ADD_PHOTO_PENDING':
      return { ...state, photos: [...state.photos, action.photo] };

    case 'ADD_PHOTO_SUCCESS':
      return {
        ...state,
        photos: state.photos.map((p) =>
          p.id === action.tempId
            ? { ...action.serverPhoto, uploading: false }
            : p
        ),
      };

    case 'ADD_PHOTO_ERROR':
      return {
        ...state,
        photos: state.photos.map((p) =>
          p.id === action.id ? { ...p, uploading: false, error: action.error } : p
        ),
      };

    case 'REMOVE_PHOTO': {
      const photo = state.photos.find((p) => p.id === action.id);
      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      return { ...state, photos: state.photos.filter((p) => p.id !== action.id) };
    }

    case 'SET_ORDER_ID':
      return { ...state, orderId: action.orderId };

    case 'RESET':
      state.photos.forEach((p) => { if (p.previewUrl) URL.revokeObjectURL(p.previewUrl); });
      return initialState;

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
