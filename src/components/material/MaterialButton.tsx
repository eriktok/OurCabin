import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { spacing } from '../../theme/spacing';

interface MaterialButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  ...props
}) => {
  const theme = useTheme();

  const getButtonMode = () => {
    switch (variant) {
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.roundness,
    };

    if (fullWidth) {
      return {
        ...baseStyle,
        width: '100%',
      };
    }

    return baseStyle;
  };


  const getContentStyle = () => {
    const sizeMap = {
      small: { paddingVertical: spacing.xs },
      medium: { paddingVertical: spacing.sm },
      large: { paddingVertical: spacing.md },
    };

    return sizeMap[size];
  };

  return (
    <Button
      mode={getButtonMode()}
      style={[getButtonStyle(), style]}
      contentStyle={getContentStyle()}
      buttonColor={variant === 'primary' ? theme.colors.primary : undefined}
      textColor={
        variant === 'primary' 
          ? theme.colors.onPrimary 
          : variant === 'secondary'
          ? theme.colors.secondary
          : undefined
      }
      {...props}
    >
      {children}
    </Button>
  );
};
