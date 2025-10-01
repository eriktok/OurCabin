import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeIcon } from '../ui/SafeIcon';
import { iOSDesignSystem } from '../../theme/iOSDesignSystem';

interface iOSNavigationHeaderProps {
  title: string;
  subtitle?: string;
  leftButton?: {
    icon: string;
    onPress: () => void;
  };
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
  rightButtons?: Array<{
    icon: string;
    onPress: () => void;
  }>;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
}

export const NavigationHeader: React.FC<iOSNavigationHeaderProps> = ({
  title,
  subtitle,
  leftButton,
  rightButton,
  rightButtons,
  showBackButton = false,
  onBackPress,
  backgroundColor = iOSDesignSystem.colors.background.primary,
  titleColor = iOSDesignSystem.colors.label.primary,
}) => {
  const renderLeftButton = () => {
    if (leftButton) {
      return (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={leftButton.onPress}
          activeOpacity={0.7}
        >
          <SafeIcon
            name={leftButton.icon}
            size={24}
            color={iOSDesignSystem.colors.primary}
          />
        </TouchableOpacity>
      );
    }

    if (showBackButton && onBackPress) {
      return (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <SafeIcon
            name="chevron-left"
            size={24}
            color={iOSDesignSystem.colors.primary}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.headerButton} />;
  };

  const renderRightButtons = () => {
    if (rightButtons && rightButtons.length > 0) {
      return (
        <View style={styles.rightButtonsContainer}>
          {rightButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.headerButton}
              onPress={button.onPress}
              activeOpacity={0.7}
            >
              <SafeIcon
                name={button.icon}
                size={24}
                color={iOSDesignSystem.colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (rightButton) {
      return (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={rightButton.onPress}
          activeOpacity={0.7}
        >
          <SafeIcon
            name={rightButton.icon}
            size={24}
            color={iOSDesignSystem.colors.primary}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.headerButton} />;
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={styles.headerContent}>
        {renderLeftButton()}
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {renderRightButtons()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? iOSDesignSystem.layout.safeArea.top : 0,
    borderBottomWidth: 0.5,
    borderBottomColor: iOSDesignSystem.colors.separator.opaque,
    ...iOSDesignSystem.shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: iOSDesignSystem.layout.navigationBar.height,
    paddingHorizontal: iOSDesignSystem.spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: iOSDesignSystem.borderRadius.lg,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: iOSDesignSystem.spacing.md,
  },
  title: {
    fontSize: iOSDesignSystem.typography.fontSize.headline,
    fontWeight: iOSDesignSystem.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
    color: iOSDesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginTop: iOSDesignSystem.spacing.xs,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
