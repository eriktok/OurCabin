/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { OnboardingScreen } from './src/screens/iOSOnboardingScreen';
import { LogbookScreen } from './src/screens/LogbookScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { CabinHomeScreen } from './src/screens/CabinHomeScreen';
import { FamilySharingScreen } from './src/screens/FamilySharingScreen';
import { ServiceProvider } from './src/services/ServiceProvider';
import { AuthScreen } from './src/screens/AuthScreen';
import { CabinGateScreen } from './src/screens/CabinGateScreen';
import { CabinSettingsScreen } from './src/screens/CabinSettingsScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { useAppStore } from './src/stores/appStore';
import { NotificationService } from './src/services/NotificationService';
import { SimpleAuthService } from './src/services/SimpleAuthService';
import { useEffect } from 'react';
import { SafeIcon } from './src/components/ui/SafeIcon';
import { NavigationHeader } from './src/components/navigation/iOSNavigationHeader';
import { TabBar } from './src/components/navigation/iOSTabBar';
import { Toast } from './src/components/ui/Toast';
import { useToast } from './src/hooks/useToast';
import { getTheme } from './src/theme/paperTheme';
import { iOSDesignSystem } from './src/theme/iOSDesignSystem';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = getTheme(isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.appBackground, { backgroundColor: theme.colors.background }]}>
        <AppContent />
      </View>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(true);
  const [tab, setTab] = useState<'home' | 'logbook' | 'tasks' | 'calendar' | 'family' | 'profile'>('home');
  const [userId, setUserId] = useState<string | null>(null);
  const [cabinId, setCabinId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { setCurrentUser, setSelectedCabin, selectedCabin } = useAppStore();
  const { toast, hideToast } = useToast();
  const authService = SimpleAuthService.getInstance();

  useEffect(() => {
    NotificationService.initialize();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserId(user.id);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <ServiceProvider>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </ServiceProvider>
    );
  }

  if (!hasOnboarded) {
    return (
      <ServiceProvider>
        <OnboardingScreen onContinue={() => setHasOnboarded(true)} />
      </ServiceProvider>
    );
  }

  if (!userId) {
    return (
      <ServiceProvider>
        <AuthScreen onSignedIn={(user) => {
          setUserId(user.id);
          setCurrentUser(user);
        }} />
      </ServiceProvider>
    );
  }

  if (!cabinId) {
    return (
      <ServiceProvider>
        <CabinGateScreen 
          userId={userId} 
          onCabinSelected={(cabin) => {
            setCabinId(cabin.id);
            setSelectedCabin(cabin);
          }} 
        />
      </ServiceProvider>
    );
  }

  const tabs = [
    { key: 'home', label: 'Home', icon: 'home', activeIcon: 'home-heart' },
    { key: 'logbook', label: 'Logbook', icon: 'post', activeIcon: 'post' },
    { key: 'tasks', label: 'Tasks', icon: 'check-circle-outline', activeIcon: 'check-circle' },
    { key: 'calendar', label: 'Calendar', icon: 'calendar-month', activeIcon: 'calendar-check' },
    { key: 'family', label: 'Family', icon: 'account-group', activeIcon: 'account-group' },
    { key: 'profile', label: 'Profile', icon: 'account-circle', activeIcon: 'account-circle' },
  ];

  const getScreenTitle = () => {
    switch (tab) {
      case 'home': return 'Cabin Home';
      case 'logbook': return 'Logbook';
      case 'tasks': return 'Tasks';
      case 'calendar': return 'Calendar';
      case 'family': return 'Family Sharing';
      case 'profile': return 'Profile';
      default: return 'OurCabin';
    }
  };

  const renderScreen = () => {
    switch (tab) {
      case 'home':
        return <CabinHomeScreen />;
      case 'logbook':
        return <LogbookScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'family':
        return <FamilySharingScreen />;
      case 'profile':
        return <UserProfileScreen />;
      default:
        return <CabinHomeScreen />;
    }
  };

  return (
    <ServiceProvider>
      <View style={styles.container}>
        <NavigationHeader
          title={getScreenTitle()}
          subtitle={selectedCabin?.name}
          rightButton={tab === 'profile' ? {
            icon: 'cog',
            onPress: () => setTab('home')
          } : undefined}
        />
        
        <View style={styles.content}>
          {renderScreen()}
        </View>
        
        <TabBar
          tabs={tabs}
          activeTab={tab}
          onTabPress={(tabKey: string) => setTab(tabKey as any)}
        />
        
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      </View>
    </ServiceProvider>
  );
}

function TabButton({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <SafeIcon name={icon} size={20} color={active ? '#2E7D32' : '#666'} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appBackground: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: iOSDesignSystem.colors.background.secondary,
  },
  content: { 
    flex: 1,
    backgroundColor: iOSDesignSystem.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: iOSDesignSystem.colors.background.secondary,
  },
  tabBar: { 
    flexDirection: 'row', 
    borderTopWidth: 0.5, 
    borderTopColor: iOSDesignSystem.colors.separator.opaque,
    backgroundColor: iOSDesignSystem.colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: iOSDesignSystem.spacing.sm, 
    alignItems: 'center',
    borderRadius: iOSDesignSystem.borderRadius.md,
    margin: iOSDesignSystem.spacing.xs,
    gap: 2,
  },
  tabButtonActive: { 
    backgroundColor: iOSDesignSystem.colors.primary + '20',
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.primary,
  },
  tabLabel: { 
    color: iOSDesignSystem.colors.text.tertiary,
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
    fontWeight: '500' as const,
  },
  tabLabelActive: { 
    color: iOSDesignSystem.colors.primary, 
    fontWeight: '600' as const,
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
  },
});

export default App;
