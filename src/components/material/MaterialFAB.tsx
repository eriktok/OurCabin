import React from 'react';
import { FAB } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { spacing } from '../../theme/spacing';

interface MaterialFABProps {
  icon: string;
  onPress: () => void;
  label?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const MaterialFAB: React.FC<MaterialFABProps> = ({
  icon,
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const theme = useTheme();


  const getFABStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      bottom: spacing.lg,
      right: spacing.lg,
    };

    return [baseStyle, style];
  };

  const getFABColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'tertiary':
        return theme.colors.tertiary;
      case 'surface':
        return theme.colors.surface;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <FAB
      icon={icon}
      label={label}
      onPress={onPress}
      style={getFABStyle()}
      color={getFABColor()}
      size={size}
    />
  );
};
