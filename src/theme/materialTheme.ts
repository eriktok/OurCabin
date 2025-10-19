import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Custom Material Design 3 Theme - Mobile Optimized
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32', // Forest Green
    primaryContainer: '#A5D6A7',
    secondary: '#1565C0', // Blue
    secondaryContainer: '#BBDEFB',
    tertiary: '#FF6F00', // Orange
    tertiaryContainer: '#FFE0B2',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    surfaceContainer: '#F1F3F4',
    surfaceContainerHigh: '#E8EAED',
    surfaceContainerHighest: '#E0E0E0',
    background: '#FFFFFF',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1B5E20',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#0D47A1',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#E65100',
    onSurface: '#1A1A1A',
    onSurfaceVariant: '#424242',
    onBackground: '#1A1A1A',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',
    outline: '#E0E0E0',
    outlineVariant: '#F5F5F5',
    inverseSurface: '#2F2F2F',
    inverseOnSurface: '#F5F5F5',
    inversePrimary: '#81C784',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: '#F5F5F5',
    onSurfaceDisabled: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
  roundness: 8, // More mobile-friendly rounded corners
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784', // Light Green
    primaryContainer: '#2E7D32',
    secondary: '#90CAF9', // Light Blue
    secondaryContainer: '#1565C0',
    tertiary: '#FFB74D', // Light Orange
    tertiaryContainer: '#FF6F00',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    surfaceContainer: '#1A1A1A',
    surfaceContainerHigh: '#2A2A2A',
    surfaceContainerHighest: '#3A3A3A',
    background: '#0F0F0F',
    error: '#F44336',
    errorContainer: '#B71C1C',
    onPrimary: '#000000',
    onPrimaryContainer: '#A5D6A7',
    onSecondary: '#000000',
    onSecondaryContainer: '#BBDEFB',
    onTertiary: '#000000',
    onTertiaryContainer: '#FFE0B2',
    onSurface: '#E0E0E0',
    onSurfaceVariant: '#BDBDBD',
    onBackground: '#E0E0E0',
    onError: '#000000',
    onErrorContainer: '#FFCDD2',
    outline: '#616161',
    outlineVariant: '#424242',
    inverseSurface: '#E0E0E0',
    inverseOnSurface: '#1A1A1A',
    inversePrimary: '#2E7D32',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: '#424242',
    onSurfaceDisabled: '#616161',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
  roundness: 12,
};

// Custom font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// Apply custom fonts to themes
lightTheme.fonts = configureFonts({ config: fontConfig });
darkTheme.fonts = configureFonts({ config: fontConfig });

export const getMaterialTheme = (isDark: boolean) => isDark ? darkTheme : lightTheme;
