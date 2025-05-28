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
    apiKey: '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',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    assistantId: 'asst_uEwtZVZFuqDUzYAtyzbX92Zm',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Theme configuration
  theme: {
    light: {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        // Modern primary and accent colors
        primary: '#7C4DFF', // Rich purple for primary actions
        primaryContainer: '#EDE7FF', // Light purple for containers
        secondary: '#00BFA5', // Teal for secondary actions
        secondaryContainer: '#E0F7F5', // Light teal for containers
        
        // Neutral colors
        background: '#FFFFFF',
        surface: '#FAFAFA',
        surfaceVariant: '#F5F5F5',
        
        // Text colors
        text: '#1A1A1A',
        onSurface: '#1A1A1A',
        onSurfaceVariant: '#757575',
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        
        // Status colors
        error: '#FF5252',
        success: '#4CAF50',
        warning: '#FFC107',
        info: '#2196F3',
        
        // UI element colors
        outline: '#E0E0E0',
        disabled: '#BDBDBD',
        placeholder: '#9E9E9E',
        backdrop: 'rgba(0, 0, 0, 0.5)',
        
        // Card and elevation colors
        elevation: {
          level0: 'transparent',
          level1: '#FFFFFF',
          level2: '#FFFFFF',
          level3: '#FFFFFF',
          level4: '#FFFFFF',
          level5: '#FFFFFF',
        },
      },
      roundness: 12,
      animation: {
        scale: 1.0,
      },
    },
    dark: {
      ...MD3DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        // Modern dark theme colors
        primary: '#B388FF', // Lighter purple for dark theme
        primaryContainer: '#311B92', // Deep purple for containers
        secondary: '#1DE9B6', // Bright teal for secondary actions
        secondaryContainer: '#004D40', // Deep teal for containers
        
        // Dark theme neutral colors
        background: '#121212',
        surface: '#1E1E1E',
        surfaceVariant: '#2C2C2C',
        
        // Text colors for dark theme
        text: '#FFFFFF',
        onSurface: '#FFFFFF',
        onSurfaceVariant: '#BBBBBB',
        onPrimary: '#000000',
        onSecondary: '#000000',
        
        // Status colors for dark theme
        error: '#FF5252',
        success: '#69F0AE',
        warning: '#FFD740',
        info: '#448AFF',
        
        // UI element colors for dark theme
        outline: '#3E3E3E',
        disabled: '#6E6E6E',
        placeholder: '#9E9E9E',
        backdrop: 'rgba(0, 0, 0, 0.7)',
        
        // Card and elevation colors for dark theme
        elevation: {
          level0: '#121212',
          level1: '#1E1E1E',
          level2: '#232323',
          level3: '#252525',
          level4: '#272727',
          level5: '#2C2C2C',
        },
      },
      roundness: 12,
      animation: {
        scale: 1.0,
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