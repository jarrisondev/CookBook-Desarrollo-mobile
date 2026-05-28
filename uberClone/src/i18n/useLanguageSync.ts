import { useEffect } from 'react';
import i18n from './index';
import { useAppSelector } from '../store';

export function useLanguageSync() {
  const language = useAppSelector((state) => state.preferences.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);
}
