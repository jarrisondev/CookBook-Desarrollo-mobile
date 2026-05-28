import type { TextStyle } from 'react-native';

export const typography = {
  displayLg: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  displayMd: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h1: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySm: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  label: { fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 0.4 },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
