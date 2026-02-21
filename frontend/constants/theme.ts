/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#3C92B7';
const tintColorDark = '#7AC1D6';

export const Colors = {
  light: {
    // Soft sky + ink palette
    text: '#111313',
    textMuted: '#556873',
    background: '#F5FCFE',
    surface: '#EAF3F6',
    inputBackground: 'rgba(255,255,255,0.72)',
    tint: tintColorLight,
    accent: '#58ACC8',
    icon: '#556873',
    tabIconDefault: '#6A8291',
    tabIconSelected: tintColorLight,

    // Feedback
    success: '#2E9B7E',
    warning: '#F28B4A',
    danger: '#E6557B',

    // Glassmorphism surfaces
    glassSurface: 'rgba(255,255,255,0.55)',
    glassSurfaceStrong: 'rgba(255,255,255,0.65)',
    glassBorder: 'rgba(255,255,255,0.4)',
    glassHighlight: 'rgba(255,255,255,0.65)',
    glassShadow: 'rgba(17,19,19,0.1)',

    // Atmospheric gradient stops
    gradientTop: '#CFE6EC',
    gradientMid: '#7AC1D6',
    gradientBottom: '#356789',
  },
  dark: {
    // Deepened sky + ink palette
    text: '#EAF3F6',
    textMuted: '#A8BCC5',
    background: '#152A34',
    surface: '#1D3642',
    inputBackground: 'rgba(255,255,255,0.10)',
    tint: tintColorDark,
    accent: '#58ACC8',
    icon: '#A8BCC5',
    tabIconDefault: '#8FA4AD',
    tabIconSelected: tintColorDark,

    // Feedback
    success: '#5FBFA3',
    warning: '#F6B37D',
    danger: '#F28CA6',

    // Glassmorphism surfaces
    glassSurface: 'rgba(20,43,56,0.62)',
    glassSurfaceStrong: 'rgba(27,53,68,0.78)',
    glassBorder: 'rgba(186,220,232,0.24)',
    glassHighlight: 'rgba(255,255,255,0.2)',
    glassShadow: 'rgba(5,12,18,0.5)',

    // Atmospheric gradient stops
    gradientTop: '#356789',
    gradientMid: '#234E64',
    gradientBottom: '#132E3D',
  },
};

export type ThemeMode = keyof typeof Colors;
export type ThemeColors = (typeof Colors)['light'];

// Shared visual tokens for glassmorphism layouts.
export const Glass = {
  radius: {
    chip: 14,
    input: 18,
    card: 24,
    modal: 28,
    pill: 999,
  },
  borderWidth: {
    thin: 1,
    regular: 1.2,
  },
  blur: {
    soft: 10,
    regular: 16,
    strong: 24,
  },
  opacity: {
    soft: 0.32,
    regular: 0.52,
    strong: 0.72,
  },
  shadow: {
    light: {
      shadowOpacity: 0.1,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 14 },
      elevation: 7,
    },
    dark: {
      shadowOpacity: 0.28,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8,
    },
  },
} as const;

// Helper for quickly styling translucent glass cards.
export function getGlassCardStyle(mode: ThemeMode, surface: 'regular' | 'strong' = 'regular') {
  const palette = Colors[mode];
  const shadow = Glass.shadow[mode];

  return {
    backgroundColor: surface === 'strong' ? palette.glassSurfaceStrong : palette.glassSurface,
    borderColor: palette.glassBorder,
    borderWidth: Glass.borderWidth.regular,
    borderRadius: Glass.radius.card,
    shadowColor: palette.glassShadow,
    ...shadow,
  };
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
