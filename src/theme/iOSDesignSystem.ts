import { Platform } from 'react-native';

export const iOSDesignSystem = {
  // iOS Human Interface Guidelines Colors
  colors: {
    // System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D92',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    
    // Semantic Colors
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    
    // Neutral Colors
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Surface Colors
    surface: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F1F3F4',
    },
    
    // Background Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#FFFFFF',
      grouped: '#F2F2F7',
    },
    
    // Fill Colors
    fill: {
      primary: '#C7C7CC',
      secondary: '#AEAEB2',
      tertiary: '#8E8E93',
      quaternary: '#636366',
    },
    
    // Label Colors
    label: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#3C3C43',
      quaternary: '#2C2C2E',
    },
    
    // Separator Colors
    separator: {
      opaque: '#C6C6C8',
      nonOpaque: '#38383A',
    },
    
    // Link Colors
    link: '#007AFF',
    
    // Text Colors
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#3C3C43',
      quaternary: '#2C2C2E',
      placeholder: '#3C3C43',
      disabled: '#3C3C43',
    },
  },
  
  // iOS Typography
  typography: {
    // Font Sizes (iOS Dynamic Type)
    fontSize: {
      xs: 11,
      sm: 12,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      largeTitle: 34,
      title1: 28,
      title2: 22,
      title3: 20,
      headline: 17,
      body: 17,
      callout: 16,
      subhead: 15,
      footnote: 13,
      caption1: 12,
      caption2: 11,
    },
    
    // Font Weights
    fontWeight: {
      ultraLight: '100' as const,
      thin: '200' as const,
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
      black: '900' as const,
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  // iOS Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // iOS Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },
  
  // iOS Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // iOS Layout
  layout: {
    // Safe Area
    safeArea: {
      top: Platform.OS === 'ios' ? 44 : 0,
      bottom: Platform.OS === 'ios' ? 34 : 0,
    },
    
    // Tab Bar
    tabBar: {
      height: 83, // 49 + 34 (safe area)
      iconSize: 25,
      labelSize: 10,
    },
    
    // Navigation Bar
    navigationBar: {
      height: 44,
      titleSize: 17,
    },
    
    // Status Bar
    statusBar: {
      height: Platform.OS === 'ios' ? 44 : 24,
    },
  },
  
  // iOS Animation
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
    },
  },
  
  // iOS Components
  components: {
    // Button
    button: {
      height: 44,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 17,
      fontWeight: '600',
    },
    
    // Input
    input: {
      height: 44,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 17,
      borderWidth: 1,
      borderColor: '#C7C7CC',
    },
    
    // Card
    card: {
      borderRadius: 12,
      padding: 16,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    
    // List Item
    listItem: {
      height: 44,
      paddingHorizontal: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0.5,
      borderBottomColor: '#C6C6C8',
    },
  },
};

// iOS Dynamic Type Support
export const getDynamicFontSize = (baseSize: number, accessibilityScale: number = 1): number => {
  return Math.round(baseSize * accessibilityScale);
};

// iOS Color Scheme Support
export const getColorScheme = (isDark: boolean) => {
  if (isDark) {
    return {
      background: {
        primary: '#000000',
        secondary: '#1C1C1E',
        tertiary: '#2C2C2E',
        grouped: '#1C1C1E',
      },
      label: {
        primary: '#FFFFFF',
        secondary: '#EBEBF5',
        tertiary: '#EBEBF5',
        quaternary: '#EBEBF5',
      },
      separator: {
        opaque: '#38383A',
        nonOpaque: '#38383A',
      },
    };
  }
  
  return iOSDesignSystem.colors;
};
