import { useIsDark } from './useIsDark';

export function useIconColor() {
  const isDark = useIsDark();
  return {
    primary: isDark ? '#FFFFFF' : '#0F1115',
    muted: isDark ? '#9CA3AF' : '#6B7280',
    inverse: isDark ? '#0F1115' : '#FFFFFF',
  };
}
