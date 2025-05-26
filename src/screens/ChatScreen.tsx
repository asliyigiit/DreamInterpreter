import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTheme, TextInput, Button, Text, IconButton, Dialog, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { useRoute, RouteProp } from '@react-navigation/native';

import { Message, Psychoanalyst } from '../types';
import OpenAIService from '../services/openai';
import AdService, { BannerAd } from '../services/ads';
import StorageService from '../services/storage';
import { DrawerParamList } from '../navigation/types';
import { CONFIG } from '../config/config';

type ChatScreenRouteProp = RouteProp<DrawerParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Psychoanalyst | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showAnalystDialog, setShowAnalystDialog] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Load existing conversation if provided through navigation
    if (route.params?.conversationId) {
      loadConversation(route.params.conversationId);
    }
  }, [route.params?.conversationId]);

  useEffect(() => {
    // Show analyst selection dialog if no analyst is selected
    if (!selectedAnalyst && !route.params?.conversationId) {
      setShowAnalystDialog(true);
    }
  }, [selectedAnalyst, route.params?.conversationId]);

  const loadConversation = async (conversationId: string) => {
    try {
      const conversations = await StorageService.getConversations();
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setMessages(conversation.messages);
        setSelectedAnalyst(conversation.analyst);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedAnalyst) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      //await AdService.showInterstitial();

      const response = currentConversationId 
        ? await OpenAIService.followUpQuestion(
            updatedMessages.map(m => m.text),
            inputText,
            selectedAnalyst.name,
          )
        : await OpenAIService.interpretDream(
            inputText,
            selectedAnalyst.name,
            {},
          );

      if (response.text) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: response.text,
          isUser: false,
          timestamp: Date.now(),
        };
        
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        const conversationData = {
          id: currentConversationId || Date.now().toString(),
          analyst: selectedAnalyst,
          messages: finalMessages,
          preChatAnswers: {},
          timestamp: Date.now(),
        };

        if (currentConversationId) {
          await StorageService.updateConversation(conversationData);
        } else {
          await StorageService.addConversation(conversationData);
          setCurrentConversationId(conversationData.id);
        }
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSpeechToText = async () => {
    try {
      // Implement speech-to-text functionality
    } catch (error) {
      console.error('Speech to text error:', error);
    }
  };

  const handleAnalystSelection = (analyst: Psychoanalyst) => {
    setSelectedAnalyst(analyst);
    setShowAnalystDialog(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        { backgroundColor: item.isUser ? theme.colors.primary : theme.colors.secondary },
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <BannerAd />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('chat.type_dream')}
          style={styles.input}
          multiline
        />
        <IconButton
          mode="contained"
          onPress={handleSend}
          disabled={isLoading || !inputText.trim() || !selectedAnalyst}
          style={styles.sendButton}
          icon="send"
        />
        <IconButton
          mode="outlined"
          onPress={startSpeechToText}
          disabled={isLoading}
          icon="microphone"
        />
      </View>

      <Modal visible={showAnalystDialog} onDismiss={() => setShowAnalystDialog(false)}>
        <Dialog.Title>{t('chat.select_analyst')}</Dialog.Title>
        <Dialog.Content>
            {CONFIG.psychoanalysts.map((analyst: Psychoanalyst) => (
              <Button
                key={analyst.id}
                mode="outlined"
                onPress={() => handleAnalystSelection(analyst)}
                style={styles.analystButton}
                labelStyle={{ color: analyst.badgeColor }}
              >
                {analyst.name}
              </Button>
            ))}
          </Dialog.Content>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  analystButton: {
    marginVertical: 4,
  },
});

export default ChatScreen; 