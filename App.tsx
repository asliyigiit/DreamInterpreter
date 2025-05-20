import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { LogBox, StyleSheet } from 'react-native';

import Navigation from './src/navigation';
import i18n from './src/i18n';
import StorageService from './src/services/storage';
import { AppState } from './src/types';
import CONFIG from './src/config/config';

// Ignore specific warnings that might not be relevant
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    theme: CONFIG.theme.light,
    language: CONFIG.i18n.defaultLocale,
    analysts: CONFIG.psychoanalysts,
    preChatQuestions: CONFIG.preChatQuestions,
    conversations: [],
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const initialState = await StorageService.getInitialState();
        setAppState((prevState: AppState) => ({
          ...prevState,
          ...initialState,
        }));
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <I18nextProvider i18n={i18n}>
        <PaperProvider theme={appState.theme}>
          <Navigation />
          <StatusBar style={appState.theme.dark ? 'light' : 'dark'} />
        </PaperProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
} 