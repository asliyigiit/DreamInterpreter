import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack/src/index';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, IconButton, Text, Card, Title, Paragraph, Divider } from 'react-native-paper';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DrawerScreenProps } from '@react-navigation/drawer';

import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import AnalystSettingsScreen from '../screens/AnalystSettingsScreen';
import QuestionSettingsScreen from '../screens/QuestionSettingsScreen';
import UserPreferencesScreen from '../screens/UserPreferencesScreen';
import StorageService from '../services/storage';
import type { Conversation } from '../types';

import {
  RootStackParamList,
  DrawerParamList,
} from './types';

type DrawerNavigatorNavigationProp = StackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = () => {
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigatorNavigationProp>();
  const route = useRoute<DrawerScreenProps<DrawerParamList, 'Chat'>['route']>();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const initializeConversations = async () => {
      try {
        // Try to load real conversations first
        const savedConversations = await StorageService.getConversations();
        
        if (savedConversations && savedConversations.length > 0) {
          setConversations(savedConversations.sort((a, b) => b.timestamp - a.timestamp));
        } else {
          // If no real conversations exist, use mock data
          const mockConversations: Conversation[] = [
            {
              id: '1',
              timestamp: Date.now() - 86400000,
              analyst: { 
                id: 'a1', 
                name: 'Dream Guide Sarah',
                badgeColor: '#4CAF50',
                description: 'Specializes in lucid dreaming interpretation'
              },
              messages: [{ 
                id: 'm1',
                text: 'I had a dream about flying over a crystal-clear ocean...',
                timestamp: Date.now() - 86400000,
                isUser: true
              }],
              preChatAnswers: {}
            },
            {
              id: '2',
              timestamp: Date.now() - 172800000,
              analyst: { 
                id: 'a2', 
                name: 'Jung Bot',
                badgeColor: '#2196F3',
                description: 'Jungian psychology expert'
              },
              messages: [{ 
                id: 'm2',
                text: 'In my dream, I was walking through an ancient forest with glowing trees...',
                timestamp: Date.now() - 172800000,
                isUser: true
              }],
              preChatAnswers: {}
            },
            {
              id: '3',
              timestamp: Date.now() - 259200000,
              analyst: { 
                id: 'a3', 
                name: 'Dream Oracle Maya',
                badgeColor: '#9C27B0',
                description: 'Spiritual dream interpreter'
              },
              messages: [{ 
                id: 'm3',
                text: 'I dreamed about a mysterious door that kept appearing...',
                timestamp: Date.now() - 259200000,
                isUser: true
              }],
              preChatAnswers: {}
            },
            {
              id: '4',
              timestamp: Date.now() - 345600000,
              analyst: { 
                id: 'a4', 
                name: 'Dreamweaver Alex',
                badgeColor: '#FF9800',
                description: 'Archetypal dream analysis specialist'
              },
              messages: [{ 
                id: 'm4',
                text: 'Last night, I was in a library where all the books were written in symbols...',
                timestamp: Date.now() - 345600000,
                isUser: true
              }],
              preChatAnswers: {}
            },
            {
              id: '5',
              timestamp: Date.now() - 432000000,
              analyst: { 
                id: 'a5', 
                name: 'Spirit Guide Luna',
                badgeColor: '#E91E63',
                description: 'Shamanic dream guide'
              },
              messages: [{ 
                id: 'm5',
                text: 'I had a recurring dream about climbing an endless staircase...',
                timestamp: Date.now() - 432000000,
                isUser: true
              }],
              preChatAnswers: {}
            }
          ];
          setConversations(mockConversations);
        }
      } catch (error) {
        console.error('Failed to initialize conversations:', error);
        // Fallback to empty conversations array in case of error
        setConversations([]);
      }
    };

    initializeConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const savedConversations = await StorageService.getConversations();
      setConversations(savedConversations.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await StorageService.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleNewChat = () => {
    navigation.navigate('Main', {
      screen: 'Chat'
    });
  };

  const handleOpenChat = (conversation: Conversation) => {
    navigation.navigate('Main', {
      screen: 'Chat',
      params: {
        conversationId: conversation.id
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <View style={styles.newChatButton}>
          <TouchableOpacity 
            style={[styles.newChatTouchable, { backgroundColor: theme.colors.primary }]}
            onPress={handleNewChat}
          >
            <IconButton icon="plus" size={20} iconColor={theme.colors.onPrimary} />
            <Text style={[styles.newChatText, { color: theme.colors.onPrimary }]}> Dream </Text>
          </TouchableOpacity>
        </View>
        
        <Divider style={styles.divider} />
        
        {conversations.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No dreams yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap the Dream button to start</Text>
          </View>
        ) : (
          conversations.map((conversation) => {
            const firstMessage = conversation.messages[0]?.text || '';
            const truncatedMessage = firstMessage.length > 50
              ? `${firstMessage.substring(0, 50)}...`
              : firstMessage;

            const isSelected = conversation.id === route?.params?.conversationId;

            return (
              <TouchableOpacity
                key={conversation.id}
                style={[
                  styles.conversationItem,
                  isSelected && { backgroundColor: theme.colors.primaryContainer }
                ]}
                onPress={() => handleOpenChat(conversation)}
              >
                <View style={styles.conversationContent}>
                  <Text style={styles.analystName}>{conversation.analyst.name}</Text>
                  <Text style={styles.messagePreview}>{truncatedMessage}</Text>
                  <Text style={styles.dateText}>{formatDate(conversation.timestamp)}</Text>
                </View>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleDeleteConversation(conversation.id)}
                />
              </TouchableOpacity>
            );
          })
        )}
      </DrawerContentScrollView>
      
      <View style={styles.drawerPreferencesButton}>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('UserPreferences')}
        />
      </View>
    </View>
  );
};

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
      drawerContent={() => <CustomDrawerContent />}
    >
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Dream Interpreter',
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserPreferences"
          component={UserPreferencesScreen}
          options={{ title: 'User Preferences' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About' }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ title: 'Privacy & Policy' }}
        />
        <Stack.Screen
          name="AnalystSettings"
          component={AnalystSettingsScreen}
          options={{ title: 'Manage Analysts' }}
        />
        <Stack.Screen
          name="QuestionSettings"
          component={QuestionSettingsScreen}
          options={{ title: 'Manage Questions' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerPreferencesButton: {
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  newChatButton: {
    padding: 16,
  },
  newChatTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginHorizontal: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 8,
  },
  conversationContent: {
    flex: 1,
  },
  analystName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
  },
  emptyStateContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.5,
  },
});

export default Navigation; 