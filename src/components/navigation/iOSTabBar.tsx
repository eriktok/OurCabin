import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeIcon } from '../ui/SafeIcon';
import { iOSDesignSystem } from '../../theme/iOSDesignSystem';

const { width } = Dimensions.get('window');

interface TabItem {
  key: string;
  label: string;
  icon: string;
  activeIcon?: string;
}

interface iOSTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

export const TabBar: React.FC<iOSTabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.tabBar}>
      <View style={styles.tabBarContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.activeTabItem,
            ]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.tabIconContainer}>
              <SafeIcon
                name={activeTab === tab.key ? (tab.activeIcon || tab.icon) : tab.icon}
                size={iOSDesignSystem.layout.tabBar.iconSize}
                color={
                  activeTab === tab.key
                    ? iOSDesignSystem.colors.primary
                    : iOSDesignSystem.colors.text.tertiary
                }
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderTopWidth: 0.5,
    borderTopColor: iOSDesignSystem.colors.separator.opaque,
    paddingBottom: iOSDesignSystem.layout.safeArea.bottom,
    ...iOSDesignSystem.shadows.sm,
  },
  tabBarContent: {
    flexDirection: 'row',
    height: iOSDesignSystem.layout.tabBar.height - iOSDesignSystem.layout.safeArea.bottom,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: iOSDesignSystem.spacing.sm,
    paddingHorizontal: iOSDesignSystem.spacing.xs,
  },
  activeTabItem: {
    // iOS doesn't typically highlight the entire tab area
  },
  tabIconContainer: {
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  tabLabel: {
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
    color: iOSDesignSystem.colors.text.tertiary,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: iOSDesignSystem.colors.primary,
    fontWeight: iOSDesignSystem.typography.fontWeight.semibold,
  },
});
