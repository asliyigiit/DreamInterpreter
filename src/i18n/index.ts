import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import tr from './tr.json';
import CONFIG from '../config/config';

const LANGUAGE_KEY = '@language';

// Get device locale, default to 'en' if not Turkish
const getDeviceLocale = () => {
  const locale = Localization.locale.split('-')[0];
  return locale === 'tr' ? 'tr' : 'en';
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      tr: {
        translation: tr
      }
    },
    lng: getDeviceLocale(),
    fallbackLng: CONFIG.i18n.fallbackLocale,
    interpolation: {
      escapeValue: false,
    },
  });

// Load saved language preference
AsyncStorage.getItem(LANGUAGE_KEY).then((language) => {
  if (language) {
    i18n.changeLanguage(language);
  }
});

// Helper function to change language
export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

export default i18n; 