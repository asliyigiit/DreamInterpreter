import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Conversation, Psychoanalyst, PreChatQuestion } from '../types';
import { MD3Theme } from 'react-native-paper';
import CONFIG from '../config/config';

const STORAGE_KEYS = {
  THEME: '@theme',
  LANGUAGE: '@language',
  ANALYSTS: '@analysts',
  QUESTIONS: '@questions',
  CONVERSATIONS: '@conversations',
} as const;

class StorageService {
  // Theme
  async getTheme(): Promise<'light' | 'dark'> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return theme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Language
  async getLanguage(): Promise<string> {
    try {
      const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return lang || CONFIG.i18n.defaultLocale;
    } catch {
      return CONFIG.i18n.defaultLocale;
    }
  }

  async setLanguage(language: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  // Analysts
  async getAnalysts(): Promise<Psychoanalyst[]> {
    try {
      const analysts = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSTS);
      return analysts ? JSON.parse(analysts) : CONFIG.psychoanalysts;
    } catch {
      return CONFIG.psychoanalysts;
    }
  }

  async setAnalysts(analysts: Psychoanalyst[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ANALYSTS, JSON.stringify(analysts));
  }

  // Pre-chat Questions
  async getQuestions(): Promise<PreChatQuestion[]> {
    try {
      const questions = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return questions ? JSON.parse(questions) : CONFIG.preChatQuestions;
    } catch {
      return CONFIG.preChatQuestions;
    }
  }

  async setQuestions(questions: PreChatQuestion[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    try {
      const conversations = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return conversations ? JSON.parse(conversations) : [];
    } catch {
      return [];
    }
  }

  async setConversations(conversations: Conversation[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }

  async addConversation(conversation: Conversation): Promise<void> {
    const conversations = await this.getConversations();
    conversations.unshift(conversation);
    await this.setConversations(conversations);
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const conversations = await this.getConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);
    await this.setConversations(filtered);
  }

  // Initialize app state
  async getInitialState(): Promise<Partial<AppState>> {
    const [theme, language, analysts, questions, conversations] = await Promise.all([
      this.getTheme(),
      this.getLanguage(),
      this.getAnalysts(),
      this.getQuestions(),
      this.getConversations(),
    ]);
    return {
      theme: theme === 'dark' ? CONFIG.theme.dark as MD3Theme : CONFIG.theme.light as MD3Theme,
      language,
      analysts,
      preChatQuestions: questions,
      conversations,
    };
  }
}

export default new StorageService(); 