import React from 'react';
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface MaterialAppBarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  actions?: Array<{
    icon: string;
    onPress: () => void;
    label?: string;
  }>;
  elevated?: boolean;
}

export const MaterialAppBar: React.FC<MaterialAppBarProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  actions = [],
  elevated = true,
}) => {
  const theme = useTheme();

  return (
    <Appbar.Header
      elevated={elevated}
      style={{
        backgroundColor: theme.colors.surface,
        elevation: elevated ? 4 : 0,
      }}
    >
      {showBackButton && (
        <Appbar.BackAction onPress={onBackPress} />
      )}
      
      <Appbar.Content
        title={title}
        subtitle={subtitle}
        titleStyle={{
          fontSize: theme.fonts.titleLarge.fontSize,
          fontWeight: theme.fonts.titleLarge.fontWeight,
          color: theme.colors.onSurface,
        }}
        subtitleStyle={{
          fontSize: theme.fonts.bodyMedium.fontSize,
          color: theme.colors.onSurfaceVariant,
        }}
      />
      
      {actions.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.label}
        />
      ))}
    </Appbar.Header>
  );
};
