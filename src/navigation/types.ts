import { NavigatorScreenParams } from '@react-navigation/native';

// Main Stack Navigator
export type RootStackParamList = {
  Main: NavigatorScreenParams<DrawerParamList>;
  Chat: undefined;
  Settings: undefined;
  About: undefined;
  Privacy: undefined;
};

// Left Drawer Navigator (Chat History)
export type LeftDrawerParamList = {
  ChatHistory: undefined;
};

// Right Drawer Navigator (Settings)
export type RightDrawerParamList = {
  Settings: undefined;
  About: undefined;
  Privacy: undefined;
  AnalystSettings: undefined;
  QuestionSettings: undefined;
};

// Combined Drawer Navigator
export type DrawerParamList = {
  Chat: undefined;
} & LeftDrawerParamList & RightDrawerParamList; 