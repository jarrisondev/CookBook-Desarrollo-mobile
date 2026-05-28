import { useEffect } from 'react';
import { colorScheme } from 'nativewind';
import { useAppSelector } from '../store';

export function useThemeSync() {
  const darkMode = useAppSelector((s) => s.preferences.darkMode);

  useEffect(() => {
    colorScheme.set(darkMode ? 'dark' : 'light');
  }, [darkMode]);
}
