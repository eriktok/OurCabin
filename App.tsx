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
import { useCabinApi } from './src/services/ServiceProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(true);
  const [tab, setTab] = useState<'logbook' | 'tasks' | 'calendar'>('logbook');
  const [userId, setUserId] = useState<string | null>(null);
  const [cabinId, setCabinId] = useState<string | null>(null);

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
        <AuthScreen onSignedIn={() => setUserId('demo')} />
      </ServiceProvider>
    );
  }

  if (!cabinId) {
    return (
      <ServiceProvider>
        <CabinGateScreen userId={userId} onCabinSelected={(c) => setCabinId(c.id)} />
      </ServiceProvider>
    );
  }

  return (
    <ServiceProvider>
      <View style={styles.container}>
        <View style={[styles.content, { paddingTop: safeAreaInsets.top }] }>
          {tab === 'logbook' && <LogbookScreen />}
          {tab === 'tasks' && <TasksScreen />}
          {tab === 'calendar' && <CalendarScreen />}
        </View>
        <View style={[styles.tabBar, { paddingBottom: safeAreaInsets.bottom }] }>
          <TabButton label="Logbook" active={tab === 'logbook'} onPress={() => setTab('logbook')} />
          <TabButton label="Tasks" active={tab === 'tasks'} onPress={() => setTab('tasks')} />
          <TabButton label="Calendar" active={tab === 'calendar'} onPress={() => setTab('calendar')} />
        </View>
      </View>
    </ServiceProvider>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabButtonActive: { backgroundColor: '#f5f5f5' },
  tabLabel: { color: '#666' },
  tabLabelActive: { color: '#111', fontWeight: '600' },
});

export default App;
