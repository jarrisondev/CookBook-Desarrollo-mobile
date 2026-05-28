import { colors } from './colors';
import { radii, spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
} as const;

export type Theme = typeof theme;

export { colors, radii, shadows, spacing, typography };
