import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface TabRoute {
  key: string;
  title: string;
  icon: string;
  badge?: string | number;
}

interface MaterialBottomNavigationProps {
  routes: TabRoute[];
  activeRoute: string;
  onRoutePress: (route: string) => void;
}

export const MaterialBottomNavigation: React.FC<MaterialBottomNavigationProps> = ({
  routes,
  activeRoute,
  onRoutePress,
}) => {
  const theme = useTheme();

  const renderScene = BottomNavigation.SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = () => null; // This will be handled by parent
      return acc;
    }, {} as Record<string, () => null>)
  );

  const navigationState = {
    index: routes.findIndex(route => route.key === activeRoute),
    routes: routes.map(route => ({
      key: route.key,
      title: route.title,
      icon: route.icon,
      badge: route.badge,
    })),
  };

  return (
    <BottomNavigation
      navigationState={navigationState}
      onIndexChange={(index) => onRoutePress(routes[index].key)}
      renderScene={renderScene}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      barStyle={{
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
      }}
      theme={theme}
    />
  );
};
