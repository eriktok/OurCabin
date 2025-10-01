import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeIcon } from './SafeIcon';
import { iOSDesignSystem } from '../../theme/iOSDesignSystem';

interface iOSListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  showChevron?: boolean;
  style?: any;
}

export const iOSListItem: React.FC<iOSListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  showChevron = true,
  style,
}) => {
  const content = (
    <View style={[styles.listItem, style]}>
      {leftIcon && (
        <View style={styles.leftIconContainer}>
          <SafeIcon
            name={leftIcon}
            size={24}
            color={iOSDesignSystem.colors.primary}
          />
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightIcon && (
          <SafeIcon
            name={rightIcon}
            size={20}
            color={iOSDesignSystem.colors.text.tertiary}
          />
        )}
        {showChevron && onPress && (
          <SafeIcon
            name="chevron-right"
            size={16}
            color={iOSDesignSystem.colors.text.tertiary}
            style={styles.chevron}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.touchable}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

interface iOSListProps {
  children: React.ReactNode;
  style?: any;
}

export const iOSList: React.FC<iOSListProps> = ({ children, style }) => {
  return (
    <View style={[styles.list, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderRadius: iOSDesignSystem.borderRadius.lg,
    overflow: 'hidden',
    ...iOSDesignSystem.shadows.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: iOSDesignSystem.spacing.md,
    paddingVertical: iOSDesignSystem.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: iOSDesignSystem.colors.separator.opaque,
    minHeight: iOSDesignSystem.components.listItem.height,
  },
  touchable: {
    // TouchableOpacity styles
  },
  leftIconContainer: {
    marginRight: iOSDesignSystem.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: iOSDesignSystem.typography.fontSize.body,
    fontWeight: iOSDesignSystem.typography.fontWeight.regular,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  subtitle: {
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
    color: iOSDesignSystem.colors.text.secondary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: iOSDesignSystem.spacing.sm,
  },
});
