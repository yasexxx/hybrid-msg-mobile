import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AUTH_KEYS } from '@/constants/api-constants';
import { SettingsProvider, useSettings } from '@/constants/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '../services/i18n';

import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { setAuthToken } from '../services/api';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { theme } = useSettings();
  const systemColorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const colorScheme = theme || systemColorScheme;

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync(AUTH_KEYS.TOKEN);

      if (token) {
        setAuthToken(token);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="two-factor" />
          </>
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} /> */}
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
