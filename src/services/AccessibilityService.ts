import { AccessibilityInfo, Platform } from 'react-native';

export interface AccessibilitySettings {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
}

export class AccessibilityService {
  private static instance: AccessibilityService;
  private settings: AccessibilitySettings | null = null;
  private listeners: Array<() => void> = [];

  static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  // Initialize accessibility service
  async initialize() {
    await this.loadAccessibilitySettings();
    this.setupListeners();
  }

  // Load current accessibility settings
  private async loadAccessibilitySettings() {
    try {
      const [
        isScreenReaderEnabled,
        isReduceMotionEnabled,
        isBoldTextEnabled,
        isGrayscaleEnabled,
        isInvertColorsEnabled,
      ] = await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isBoldTextEnabled(),
        AccessibilityInfo.isGrayscaleEnabled(),
        AccessibilityInfo.isInvertColorsEnabled(),
      ]);

      this.settings = {
        isScreenReaderEnabled,
        isReduceMotionEnabled,
        isBoldTextEnabled,
        isGrayscaleEnabled,
        isInvertColorsEnabled,
        fontSize: 'medium', // Default, would need custom implementation
        highContrast: false, // Default, would need custom implementation
      };
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  // Setup accessibility listeners
  private setupListeners() {
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isEnabled) => {
        if (this.settings) {
          this.settings.isScreenReaderEnabled = isEnabled;
        }
        this.notifyListeners();
      }
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        if (this.settings) {
          this.settings.isReduceMotionEnabled = isEnabled;
        }
        this.notifyListeners();
      }
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      (isEnabled) => {
        if (this.settings) {
          this.settings.isBoldTextEnabled = isEnabled;
        }
        this.notifyListeners();
      }
    );

    const grayscaleListener = AccessibilityInfo.addEventListener(
      'grayscaleChanged',
      (isEnabled) => {
        if (this.settings) {
          this.settings.isGrayscaleEnabled = isEnabled;
        }
        this.notifyListeners();
      }
    );

    const invertColorsListener = AccessibilityInfo.addEventListener(
      'invertColorsChanged',
      (isEnabled) => {
        if (this.settings) {
          this.settings.isInvertColorsEnabled = isEnabled;
        }
        this.notifyListeners();
      }
    );

    // Store listeners for cleanup
    this.listeners.push(
      () => screenReaderListener.remove(),
      () => reduceMotionListener.remove(),
      () => boldTextListener.remove(),
      () => grayscaleListener.remove(),
      () => invertColorsListener.remove()
    );
  }

  // Get current accessibility settings
  getSettings(): AccessibilitySettings | null {
    return this.settings;
  }

  // Check if screen reader is enabled
  isScreenReaderEnabled(): boolean {
    return this.settings?.isScreenReaderEnabled || false;
  }

  // Check if reduce motion is enabled
  isReduceMotionEnabled(): boolean {
    return this.settings?.isReduceMotionEnabled || false;
  }

  // Check if bold text is enabled
  isBoldTextEnabled(): boolean {
    return this.settings?.isBoldTextEnabled || false;
  }

  // Check if grayscale is enabled
  isGrayscaleEnabled(): boolean {
    return this.settings?.isGrayscaleEnabled || false;
  }

  // Check if invert colors is enabled
  isInvertColorsEnabled(): boolean {
    return this.settings?.isInvertColorsEnabled || false;
  }

  // Get accessibility-friendly styles
  getAccessibleStyles() {
    const settings = this.getSettings();
    if (!settings) return {};

    return {
      // Text styles
      text: {
        fontSize: this.getFontSize(settings.fontSize),
        fontWeight: settings.isBoldTextEnabled ? 'bold' : 'normal' as const,
      },
      
      // Button styles
      button: {
        minHeight: 44, // Minimum touch target size
        paddingVertical: 12,
        paddingHorizontal: 16,
      },
      
      // Input styles
      input: {
        minHeight: 44,
        fontSize: this.getFontSize(settings.fontSize),
        fontWeight: settings.isBoldTextEnabled ? 'bold' : 'normal' as const,
      },
      
      // Card styles
      card: {
        borderRadius: settings.isReduceMotionEnabled ? 4 : 8,
        shadowOpacity: settings.isReduceMotionEnabled ? 0.1 : 0.2,
      },
      
      // Animation styles
      animation: {
        duration: settings.isReduceMotionEnabled ? 0 : 300,
        useNativeDriver: true,
      },
    };
  }

  // Get accessibility props for components
  getAccessibilityProps(label: string, hint?: string, role?: string) {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityRole: role || 'button',
      accessibilityState: {
        disabled: false,
      },
    };
  }

  // Get screen reader announcement
  announceForAccessibility(message: string) {
    if (this.isScreenReaderEnabled()) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }

  // Get high contrast colors
  getHighContrastColors() {
    const isHighContrast = this.settings?.highContrast || false;
    
    if (isHighContrast) {
      return {
        primary: '#000000',
        secondary: '#FFFFFF',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#000000',
        textSecondary: '#333333',
        border: '#000000',
        error: '#CC0000',
        success: '#006600',
      };
    }
    
    return {
      primary: '#2E7D32',
      secondary: '#4CAF50',
      background: '#F7F8FA',
      surface: '#FFFFFF',
      text: '#1A1F2C',
      textSecondary: '#666666',
      border: '#E5E7EB',
      error: '#D32F2F',
      success: '#2E7D32',
    };
  }

  // Get motion-friendly animation config
  getAnimationConfig() {
    const isReduceMotion = this.isReduceMotionEnabled();
    
    return {
      duration: isReduceMotion ? 0 : 300,
      useNativeDriver: true,
      easing: isReduceMotion ? undefined : undefined,
    };
  }

  // Get font size based on accessibility setting
  private getFontSize(fontSize: string): number {
    const baseSize = 16;
    
    switch (fontSize) {
      case 'small':
        return baseSize * 0.875;
      case 'medium':
        return baseSize;
      case 'large':
        return baseSize * 1.125;
      case 'extra-large':
        return baseSize * 1.25;
      default:
        return baseSize;
    }
  }

  // Get default settings
  private getDefaultSettings(): AccessibilitySettings {
    return {
      isScreenReaderEnabled: false,
      isReduceMotionEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isInvertColorsEnabled: false,
      fontSize: 'medium',
      highContrast: false,
    };
  }

  // Notify listeners of changes
  private notifyListeners() {
    // In a real app, you might want to notify components of accessibility changes
    console.log('Accessibility settings updated:', this.settings);
  }

  // Cleanup listeners
  cleanup() {
    this.listeners.forEach(remove => remove());
    this.listeners = [];
  }
}
