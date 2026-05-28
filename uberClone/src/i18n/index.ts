import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import type { Language } from '../store/slices/preferencesSlice';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: 'es',
  fallbackLng: 'es',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export function changeLanguage(lang: Language) {
  return i18n.changeLanguage(lang);
}

export default i18n;
