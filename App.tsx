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
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LogbookScreen } from './src/screens/LogbookScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
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
import { Toast } from './src/components/ui/Toast';
import { useToast } from './src/hooks/useToast';
import { getTheme } from './src/theme/paperTheme';

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
  const [tab, setTab] = useState<'logbook' | 'tasks' | 'calendar' | 'cabin' | 'profile'>('logbook');
  const [userId, setUserId] = useState<string | null>(null);
  const [cabinId, setCabinId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { setCurrentUser, setSelectedCabin } = useAppStore();
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

  return (
    <ServiceProvider>
      <View style={styles.container}>
        <View style={[styles.content, { paddingTop: safeAreaInsets.top }]}>
          {tab === 'logbook' && <LogbookScreen />}
          {tab === 'tasks' && <TasksScreen />}
          {tab === 'calendar' && <CalendarScreen />}
          {tab === 'cabin' && <CabinSettingsScreen cabinId={cabinId!} onSignOut={() => {
            setUserId(null);
            setCurrentUser(null);
            setSelectedCabin(null);
          }} />}
          {tab === 'profile' && <UserProfileScreen />}
        </View>
        <View style={[styles.tabBar, { paddingBottom: safeAreaInsets.bottom }] }>
          <TabButton label="Logbook" icon="post" active={tab === 'logbook'} onPress={() => setTab('logbook')} />
          <TabButton label="Tasks" icon="check-circle-outline" active={tab === 'tasks'} onPress={() => setTab('tasks')} />
          <TabButton label="Calendar" icon="calendar-month" active={tab === 'calendar'} onPress={() => setTab('calendar')} />
          <TabButton label="Cabin" icon="home-outline" active={tab === 'cabin'} onPress={() => setTab('cabin')} />
          <TabButton label="Profile" icon="account-circle" active={tab === 'profile'} onPress={() => setTab('profile')} />
        </View>
        
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
    backgroundColor: '#f8f9fa',
  },
  content: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  tabBar: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderTopColor: '#e9ecef',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center',
    borderRadius: 8,
    margin: 4,
    gap: 2,
  },
  tabButtonActive: { 
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  tabLabel: { 
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
  },
  tabLabelActive: { 
    color: '#2E7D32', 
    fontWeight: '800',
    fontSize: 11,
  },
});

export default App;
