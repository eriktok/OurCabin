export type ColorMode = 'light' | 'dark';

export const baseColors = {
  primary: '#2E7D32',
  primaryContainer: '#A5D6A7',
  secondary: '#1565C0',
  backgroundLight: '#F7F8FA',
  backgroundDark: '#0F1115',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#171A21',
  error: '#D32F2F',
  success: '#2E7D32',
  warning: '#ED6C02',
};

export const lightTheme = {
  dark: false,
  roundness: 10,
  colors: {
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    background: baseColors.backgroundLight,
    surface: baseColors.surfaceLight,
    error: baseColors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1A1F2C',
    onBackground: '#1A1F2C',
    outline: '#E5E7EB',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
      level4: '#FFFFFF',
      level5: '#FFFFFF',
    },
  },
};

export const darkTheme = {
  dark: true,
  roundness: 10,
  colors: {
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    background: baseColors.backgroundDark,
    surface: baseColors.surfaceDark,
    error: baseColors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#E5E7EB',
    onBackground: '#E5E7EB',
    outline: '#2A2F3A',
    elevation: {
      level0: 'transparent',
      level1: '#1B202A',
      level2: '#1D2230',
      level3: '#1F2536',
      level4: '#21283B',
      level5: '#232B40',
    },
  },
};

export const getTheme = (isDark: boolean) => (isDark ? darkTheme : lightTheme);
