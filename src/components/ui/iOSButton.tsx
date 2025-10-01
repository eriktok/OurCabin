import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { SafeIcon } from './SafeIcon';
import { iOSDesignSystem } from '../../theme/iOSDesignSystem';

interface iOSButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: any;
}

export const Button: React.FC<iOSButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[`${variant}Button`]];
    
    if (size === 'small') baseStyle.push(styles.smallButton);
    if (size === 'large') baseStyle.push(styles.largeButton);
    if (fullWidth) baseStyle.push(styles.fullWidthButton);
    if (disabled) baseStyle.push(styles.disabledButton);
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text, styles[`${variant}Text`]];
    
    if (size === 'small') baseStyle.push(styles.smallText);
    if (size === 'large') baseStyle.push(styles.largeText);
    if (disabled) baseStyle.push(styles.disabledText);
    
    return baseStyle;
  };

  const getIconColor = () => {
    if (disabled) return iOSDesignSystem.colors.text.quaternary;
    
    switch (variant) {
      case 'primary':
        return iOSDesignSystem.colors.background.primary;
      case 'secondary':
        return iOSDesignSystem.colors.primary;
      case 'tertiary':
        return iOSDesignSystem.colors.primary;
      case 'destructive':
        return iOSDesignSystem.colors.background.primary;
      default:
        return iOSDesignSystem.colors.background.primary;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
          style={iconPosition === 'right' ? styles.iconRight : styles.iconLeft}
        />
      );
    }

    if (icon) {
      return (
        <SafeIcon
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
          style={iconPosition === 'right' ? styles.iconRight : styles.iconLeft}
        />
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {iconPosition === 'left' && renderIcon()}
        <Text style={getTextStyle()}>{title}</Text>
        {iconPosition === 'right' && renderIcon()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: iOSDesignSystem.borderRadius.lg,
    paddingHorizontal: iOSDesignSystem.spacing.md,
    paddingVertical: iOSDesignSystem.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: iOSDesignSystem.components.button.height,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primaryButton: {
    backgroundColor: iOSDesignSystem.colors.primary,
  },
  secondaryButton: {
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.primary,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  destructiveButton: {
    backgroundColor: iOSDesignSystem.colors.error,
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: iOSDesignSystem.spacing.sm,
    paddingVertical: iOSDesignSystem.spacing.sm,
    minHeight: 32,
  },
  largeButton: {
    paddingHorizontal: iOSDesignSystem.spacing.lg,
    paddingVertical: iOSDesignSystem.spacing.lg,
    minHeight: 56,
  },
  
  // States
  disabledButton: {
    backgroundColor: iOSDesignSystem.colors.fill.primary,
    borderColor: iOSDesignSystem.colors.fill.primary,
  },
  fullWidthButton: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontSize: iOSDesignSystem.typography.fontSize.callout,
    fontWeight: iOSDesignSystem.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: iOSDesignSystem.colors.background.primary,
  },
  secondaryText: {
    color: iOSDesignSystem.colors.primary,
  },
  tertiaryText: {
    color: iOSDesignSystem.colors.primary,
  },
  destructiveText: {
    color: iOSDesignSystem.colors.background.primary,
  },
  
  // Text sizes
  smallText: {
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
  },
  largeText: {
    fontSize: iOSDesignSystem.typography.fontSize.title3,
  },
  
  // Text states
  disabledText: {
    color: iOSDesignSystem.colors.text.quaternary,
  },
  
  // Icon styles
  iconLeft: {
    marginRight: iOSDesignSystem.spacing.xs,
  },
  iconRight: {
    marginLeft: iOSDesignSystem.spacing.xs,
  },
});
