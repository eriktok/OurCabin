import React from 'react';
import { Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { spacing } from '../../theme/spacing';

interface MaterialCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: any;
  onPress?: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  style,
  onPress,
}) => {
  const theme = useTheme();
  
  const paddingMap = {
    none: 0,
    small: spacing.sm,
    medium: spacing.md,
    large: spacing.lg,
  };

  const getCardStyle = () => {
    const baseStyle = {
      marginVertical: spacing.xs,
      marginHorizontal: spacing.sm,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surfaceVariant,
        };
      default: // elevated
        return {
          ...baseStyle,
        };
    }
  };

  return (
    <Card
      mode={variant === 'outlined' ? 'outlined' : 'contained'}
      style={[getCardStyle(), style]}
      onPress={onPress}
    >
      <Card.Content style={{ padding: paddingMap[padding] }}>
        {children}
      </Card.Content>
    </Card>
  );
};
