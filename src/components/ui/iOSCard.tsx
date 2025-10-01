import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { iOSDesignSystem } from '../../theme/iOSDesignSystem';

interface iOSCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export const Card: React.FC<iOSCardProps> = ({
  children,
  onPress,
  style,
  padding = 'medium',
  shadow = 'small',
  borderRadius = 'medium',
  backgroundColor = iOSDesignSystem.colors.background.primary,
  borderColor,
  borderWidth = 0,
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return iOSDesignSystem.spacing.sm;
      case 'medium': return iOSDesignSystem.spacing.md;
      case 'large': return iOSDesignSystem.spacing.lg;
      default: return iOSDesignSystem.spacing.md;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'small': return iOSDesignSystem.borderRadius.sm;
      case 'medium': return iOSDesignSystem.borderRadius.lg;
      case 'large': return iOSDesignSystem.borderRadius.xl;
      default: return iOSDesignSystem.borderRadius.lg;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'none': return {};
      case 'small': return iOSDesignSystem.shadows.sm;
      case 'medium': return iOSDesignSystem.shadows.md;
      case 'large': return iOSDesignSystem.shadows.lg;
      default: return iOSDesignSystem.shadows.sm;
    }
  };

  const cardStyle = [
    styles.card,
    {
      padding: getPadding(),
      borderRadius: getBorderRadius(),
      backgroundColor,
      borderColor,
      borderWidth,
      ...getShadow(),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base card styles are applied dynamically
  },
});
