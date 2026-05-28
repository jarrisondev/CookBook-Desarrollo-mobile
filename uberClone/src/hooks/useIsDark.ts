import { useAppSelector } from '../store';

export function useIsDark() {
  return useAppSelector((s) => s.preferences.darkMode);
}
