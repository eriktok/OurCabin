import React from 'react';
import { List } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface MaterialListItemProps {
  title: string;
  description?: string;
  left?: (props: any) => React.ReactNode;
  right?: (props: any) => React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export const MaterialListItem: React.FC<MaterialListItemProps> = ({
  title,
  description,
  left,
  right,
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <List.Item
      title={title}
      description={description}
      left={left}
      right={right}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline,
        },
        style,
      ]}
      titleStyle={{
        fontSize: theme.fonts.bodyLarge.fontSize,
        color: theme.colors.onSurface,
      }}
      descriptionStyle={{
        fontSize: theme.fonts.bodyMedium.fontSize,
        color: theme.colors.onSurfaceVariant,
      }}
    />
  );
};

interface MaterialListSectionProps {
  title?: string;
  children: React.ReactNode;
  style?: any;
}

export const MaterialListSection: React.FC<MaterialListSectionProps> = ({
  title,
  children,
  style,
}) => {
  const theme = useTheme();

  return (
    <List.Section
      title={title}
      style={[
        {
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
      titleStyle={{
        fontSize: theme.fonts.titleMedium.fontSize,
        fontWeight: theme.fonts.titleMedium.fontWeight,
        color: theme.colors.onSurface,
        paddingHorizontal: theme.spacing.md,
      }}
    >
      {children}
    </List.Section>
  );
};
