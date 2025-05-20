import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack/src/index';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import AnalystSettingsScreen from '../screens/AnalystSettingsScreen';
import QuestionSettingsScreen from '../screens/QuestionSettingsScreen';

import {
  RootStackParamList,
  DrawerParamList,
  LeftDrawerParamList,
  RightDrawerParamList,
} from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'slide',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onSurface,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Dream Interpreter',
        }}
      />
      <Drawer.Screen
        name="ChatHistory"
        component={ChatHistoryScreen}
        options={{
          title: 'Chat History',
          drawerPosition: 'left',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerPosition: 'right',
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          drawerPosition: 'right',
        }}
      />
      <Drawer.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{
          title: 'Privacy & Policy',
          drawerPosition: 'right',
        }}
      />
      <Drawer.Screen
        name="AnalystSettings"
        component={AnalystSettingsScreen}
        options={{
          title: 'Manage Analysts',
          drawerPosition: 'right',
        }}
      />
      <Drawer.Screen
        name="QuestionSettings"
        component={QuestionSettingsScreen}
        options={{
          title: 'Manage Questions',
          drawerPosition: 'right',
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 