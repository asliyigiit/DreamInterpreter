import type { Psychoanalyst, PreChatQuestion } from '../config/config';
import type { MD3Theme } from 'react-native-paper';

export type { Psychoanalyst, PreChatQuestion };

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface Conversation {
  id: string;
  analyst: Psychoanalyst;
  messages: Message[];
  preChatAnswers: Record<string, string>;
  timestamp: number;
}

export type Theme = MD3Theme;

export interface AppState {
  theme: Theme;
  language: string;
  analysts: Psychoanalyst[];
  preChatQuestions: PreChatQuestion[];
  conversations: Conversation[];
}

export interface DreamInterpretationParams {
  selectedEmotion?: string;
  selectedEmotionEmoji?: string;
}

export interface ChatResponse {
  text: string;
  error?: string;
  threadId?: string;
} 