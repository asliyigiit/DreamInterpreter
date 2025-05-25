import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme, TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';

import { Message, Psychoanalyst } from '../types';
import OpenAIService from '../services/openai';
import AdService, { BannerAd } from '../services/ads';
import StorageService from '../services/storage';

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Psychoanalyst | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedAnalyst) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Show interstitial ad before getting response
      await AdService.showInterstitial();

      const response = await OpenAIService.interpretDream(
        inputText,
        selectedAnalyst.name,
        {} // Add pre-chat answers here
      );

      if (response.text) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: response.text,
          isUser: false,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);

        // Save conversation to storage
        await StorageService.addConversation({
          id: Date.now().toString(),
          analyst: selectedAnalyst,
          messages: [...messages, newMessage, aiMessage],
          preChatAnswers: {},
          timestamp: Date.now(),
        });
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
});

export default ChatScreen; 