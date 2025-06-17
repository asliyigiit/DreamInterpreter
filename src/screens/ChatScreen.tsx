import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { 
  useTheme, 
  TextInput, 
  Button, 
  Text, 
  IconButton, 
  Portal, 
  Menu,
  Tooltip as PaperTooltip,
} from 'react-native-paper';
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

interface DropDownItem {
  label: string;
  value: string;
}

interface Styles {
  container: ViewStyle;
  messageList: ViewStyle;
  messageBubble: ViewStyle;
  userBubble: ViewStyle;
  aiBubble: ViewStyle;
  messageText: TextStyle;
  inputContainer: ViewStyle;
  input: ViewStyle;
  sendButton: ViewStyle;
  analystButton: ViewStyle;
  analystDialog: ViewStyle;
  dialogTitle: TextStyle;
  loadingIndicator: ViewStyle;
  typingIndicator: ViewStyle;
  typingText: TextStyle;
  analystSelector: ViewStyle;
  selectorsContainer: ViewStyle;
  emotionSelector: ViewStyle;
  emotionButton: ViewStyle;
}

interface ConversationData {
  id: string;
  analyst: Psychoanalyst;
  emotionId?: string;
  emotionEmoji?: string;
  messages: Message[];
  preChatAnswers: Record<string, string>;
  timestamp: number;
}

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Psychoanalyst | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionMenuVisible, setEmotionMenuVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Load existing conversation if provided through navigation
    if (route.params?.conversationId) {
      loadConversation(route.params.conversationId);
    } else {
      // Reset state for new conversation
      setMessages([]);
      setSelectedAnalyst(null);
      setCurrentConversationId(null);
    }
  }, [route.params?.conversationId]);

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

      const selectedEmotionData = selectedEmotion 
        ? CONFIG.emotions.find(e => e.id === selectedEmotion)
        : undefined;

      const response = currentConversationId 
        ? await OpenAIService.followUpQuestion(
            updatedMessages.map(m => m.text),
            inputText,
            selectedAnalyst.name,
          )
        : await OpenAIService.interpretDream(
            inputText,
            selectedAnalyst.name,
            {
              selectedEmotion: selectedEmotionData?.id,
              selectedEmotionEmoji: selectedEmotionData?.emoji,
            },
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

        const conversationData: ConversationData = {
          id: currentConversationId || Date.now().toString(),
          analyst: selectedAnalyst,
          emotionId: selectedEmotionData?.id,
          emotionEmoji: selectedEmotionData?.emoji,
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

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        { 
          backgroundColor: item.isUser 
            ? theme.colors.primary 
            : theme.colors.secondary,
        },
      ]}
    >
      <Text style={[
        styles.messageText,
        { color: item.isUser ? theme.colors.onPrimary : theme.colors.onSecondary }
      ]}>
        {item.text}
      </Text>
    </View>
  );

  const renderSelectors = () => (
    <View style={styles.selectorsContainer}>
      <View style={styles.analystSelector}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              disabled={currentConversationId !== null}
              style={styles.analystButton}
            >
              {selectedAnalyst ? selectedAnalyst.name : t('chat.select_analyst')}
            </Button>
          }
        >
          {CONFIG.psychoanalysts.map(analyst => (
            <Menu.Item
              key={analyst.id}
              title={analyst.name}
              onPress={() => {
                setSelectedAnalyst(analyst);
                setMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>

      <View style={styles.emotionSelector}>
        <Menu
          visible={emotionMenuVisible}
          onDismiss={() => setEmotionMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined"
              onPress={() => setEmotionMenuVisible(true)}
              disabled={currentConversationId !== null}
              style={styles.emotionButton}
            >
              {selectedEmotion ? CONFIG.emotions.find(e => e.id === selectedEmotion)?.emoji : t('chat.select_emotion')}
            </Button>
          }
        >
          {CONFIG.emotions.map(emotion => (
            <Menu.Item
              key={emotion.id}
              title={`${emotion.emoji}  ${t(`emotions.${emotion.id}`)}`}
              onPress={() => {
                setSelectedEmotion(emotion.id);
                setEmotionMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <BannerAd />
      {renderSelectors()}

      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />

      {isLoading && (
        <View style={[
          styles.loadingIndicator,
          { backgroundColor: theme.colors.primary }
        ]}>
          <ActivityIndicator color={theme.colors.onPrimary} />
        </View>
      )}

      <View style={[
        styles.inputContainer,
        { borderTopColor: theme.colors.outline }
      ]}>
        <TextInput
          mode="flat"
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('chat.type_dream')}
          style={styles.input}
          multiline
          dense
          right={<TextInput.Icon icon="microphone" onPress={startSpeechToText} />}
        />
        <PaperTooltip title={t('chat.select_analyst_first')}>
          <IconButton
            mode="contained"
            icon="send"
            size={24}
            onPress={handleSend}
            disabled={isLoading || !inputText.trim() || !selectedAnalyst}
            style={styles.sendButton}
          />
        </PaperTooltip>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    marginLeft: '20%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    marginRight: '20%',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 120,
    backgroundColor: 'transparent',
  },
  sendButton: {
    marginLeft: 8,
    marginBottom: 4,
  },
  selectorsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  analystSelector: {
    flex: 7,
    marginRight: 8,
  },
  emotionSelector: {
    flex: 5,
  },
  analystButton: {
    width: '100%',
  },
  emotionButton: {
    width: '100%',
  },
  analystDialog: {
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 24,
    padding: 8,
    elevation: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  typingText: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 8,
  },
});

export default ChatScreen; 