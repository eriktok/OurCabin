/**
 * OurCabin - Professional Mobile App
 * A beautiful cabin sharing app built with React Native Paper
 * Following mobile app best practices for iOS and Android
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { getMaterialTheme } from './src/theme/materialTheme';
import { ServiceProvider } from './src/services/ServiceProvider';
import { MobileApp } from './src/components/MobileApp';

function App() {
  const theme = getMaterialTheme(false); // Start with light theme

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ServiceProvider>
          <MobileApp />
        </ServiceProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
