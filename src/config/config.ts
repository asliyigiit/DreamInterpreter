import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export interface Psychoanalyst {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
}

export interface PreChatQuestion {
  id: string;
  label: string;
  type: 'text' | 'dropdown';
  options?: string[]; // For dropdown type
}

export const CONFIG = {
  app: {
    version: '1.0.0',
    name: 'Dream Interpreter',
    description: 'A psychoanalytic dream interpretation app powered by AI',
  },
  
  // Default psychoanalysts
  psychoanalysts: [
    {
      id: 'freud',
      name: 'Sigmund Freud',
      badgeColor: '#FF6B6B',
      description: 'Father of Psychoanalysis - Focuses on unconscious desires and repressed memories',
    },
    {
      id: 'jung',
      name: 'Carl Jung',
      badgeColor: '#4ECDC4',
      description: 'Explores archetypal symbols and collective unconscious',
    },
    {
      id: 'fromm',
      name: 'Erich Fromm',
      badgeColor: '#45B7D1',
      description: 'Specializes in social psychology and human nature',
    },
  ] as Psychoanalyst[],

  // Pre-chat questions
  preChatQuestions: [
    {
      id: 'dreamTime',
      label: 'When did you have this dream?',
      type: 'dropdown',
      options: ['Last night', 'Few days ago', 'Last week', 'Longer ago'],
    },
    {
      id: 'sleepQuality',
      label: 'How well did you sleep?',
      type: 'dropdown',
      options: ['Very well', 'Okay', 'Poorly', 'Very poorly'],
    },
    {
      id: 'emotions',
      label: 'What emotions did you feel during the dream?',
      type: 'text',
    },
  ] as PreChatQuestion[],

  // Ad configuration
  ads: {
    // CUSTOM_CONFIG HERE - Replace with actual ad unit IDs
    bannerAdUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    interstitialAdUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    bannerRefreshRate: 60000, // 60 seconds
    testDeviceId: 'SIMULATOR',
  },

  // OpenAI configuration
  openai: {
    // CUSTOM_CONFIG HERE - Replace with actual API key and endpoint
    apiKey: 'your-api-key-here',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Theme configuration
  theme: {
    light: {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#6200ee',
        secondary: '#03dac6',
        background: '#f6f6f6',
        surface: '#ffffff',
        error: '#B00020',
        text: '#000000',
        onSurface: '#000000',
        disabled: '#000000',
        placeholder: '#000000',
        backdrop: '#000000',
      },
    },
    dark: {
      ...MD3DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        primary: '#BB86FC',
        secondary: '#03DAC6',
        background: '#121212',
        surface: '#121212',
        error: '#CF6679',
        onSurface: '#FFFFFF',
        text: '#FFFFFF',
      },
    },
  },

  // i18n configuration
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'tr'],
    fallbackLocale: 'en',
    namespaces: ['common', 'chat', 'settings'],
  },
} as const;

// Type-safe config accessor
export type Config = typeof CONFIG;
export default CONFIG; 