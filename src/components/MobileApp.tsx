import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, useTheme } from 'react-native-paper';
import { getMaterialTheme } from '../theme/materialTheme';
import { useAppStore } from '../stores/appStore';
import { SimpleAuthService } from '../services/SimpleAuthService';
import { NotificationService } from '../services/NotificationService';
import { PremiumAuthScreen } from '../screens/PremiumAuthScreen';
import { PremiumCabinGateScreen } from '../screens/PremiumCabinGateScreen';
import { PremiumHomeScreen } from '../screens/PremiumHomeScreen';
import { LogbookScreen } from '../screens/LogbookScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FamilySharingScreen } from '../screens/FamilySharingScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { OnboardingScreen } from '../screens/iOSOnboardingScreen';
import { MobileBottomNavigation } from './MobileBottomNavigation';
import { MaterialLoading } from './material/MaterialLoading';

interface MobileAppProps {
  children?: React.ReactNode;
}

export const MobileApp: React.FC<MobileAppProps> = ({ children }) => {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userId, setUserId] = useState<string | null>(null);
  const [cabinId, setCabinId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { setCurrentUser, setSelectedCabin, selectedCabin } = useAppStore();
  const authService = SimpleAuthService.getInstance();
  const theme = useTheme();

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

  // Loading state
  if (isCheckingAuth) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <MaterialLoading message="Initializing OurCabin..." />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // Onboarding
  if (!hasOnboarded) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <OnboardingScreen onContinue={() => setHasOnboarded(true)} />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // Authentication
  if (!userId) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <PremiumAuthScreen onSignedIn={(user) => {
            setUserId(user.id);
            setCurrentUser(user);
          }} />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // Cabin selection
  if (!cabinId) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <PremiumCabinGateScreen 
            userId={userId} 
            onCabinSelected={(cabin) => {
              setCabinId(cabin.id);
              setSelectedCabin(cabin);
            }} 
          />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // Main app with proper mobile navigation
  const navigationRoutes = [
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'logbook', title: 'Logbook', icon: 'book-open-variant' },
    { key: 'tasks', title: 'Tasks', icon: 'format-list-checks' },
    { key: 'calendar', title: 'Calendar', icon: 'calendar' },
    { key: 'family', title: 'Family', icon: 'account-multiple' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <PremiumHomeScreen />;
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
        return <MaterialHomeScreen />;
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar 
          barStyle={theme.dark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.colors.background}
        />
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <MobileBottomNavigation
          routes={navigationRoutes}
          activeRoute={activeTab}
          onRoutePress={setActiveTab}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
