import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcon } from './MaterialIcon';

interface TabRoute {
  key: string;
  title: string;
  icon: string;
  badge?: string | number;
}

interface MobileBottomNavigationProps {
  routes: TabRoute[];
  activeRoute: string;
  onRoutePress: (route: string) => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  routes,
  activeRoute,
  onRoutePress,
}) => {
  const theme = useTheme();

  const navigationState = {
    index: routes.findIndex(route => route.key === activeRoute),
    routes: routes.map(route => ({
      key: route.key,
      title: route.title,
      icon: route.icon,
      badge: route.badge,
    })),
  };

  const renderScene = BottomNavigation.SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = () => null; // This will be handled by parent
      return acc;
    }, {} as Record<string, () => null>)
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <BottomNavigation
        navigationState={navigationState}
        onIndexChange={(index) => onRoutePress(routes[index].key)}
        renderScene={renderScene}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.onSurfaceVariant}
        barStyle={{
          backgroundColor: theme.colors.surface,
          borderTopWidth: Platform.OS === 'ios' ? 0.5 : 0,
          borderTopColor: theme.colors.outline,
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
          paddingTop: Platform.OS === 'ios' ? 8 : 0,
        }}
        theme={theme}
        style={styles.navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  navigation: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
