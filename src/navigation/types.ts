import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator
export type RootStackParamList = {
  Main: NavigatorScreenParams<DrawerParamList>;
  Settings: undefined;
  About: undefined;
  Privacy: undefined;
  AnalystSettings: undefined;
  QuestionSettings: undefined;
  UserPreferences: undefined;
};

// Drawer Navigator
export type DrawerParamList = {
  Chat: { conversationId?: string } | undefined;
  ChatHistory: undefined;
};

// Combined Navigation Type
export type RootNavigationType = RootStackParamList & DrawerParamList; 