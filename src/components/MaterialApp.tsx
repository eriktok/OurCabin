import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getMaterialTheme } from '../theme/materialTheme';

interface MaterialAppProps {
  children: React.ReactNode;
}

export const MaterialApp: React.FC<MaterialAppProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  
  const theme = getMaterialTheme(isDark);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        {children}
      </PaperProvider>
    </SafeAreaProvider>
  );
};
