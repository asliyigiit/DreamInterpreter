import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme, Card, Title, Paragraph, IconButton, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { DrawerParamList } from '../navigation/types';
import type { Conversation } from '../types';
import StorageService from '../services/storage';

type ChatHistoryScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'ChatHistory'>;

const ChatHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<ChatHistoryScreenNavigationProp>();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
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

  const handleOpenConversation = (conversation: Conversation) => {
    navigation.navigate('Chat', { conversationId: conversation.id });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const firstMessage = item.messages[0]?.text || '';
    const truncatedMessage = firstMessage.length > 100
      ? `${firstMessage.substring(0, 100)}...`
      : firstMessage;

    return (
      <Card style={styles.card} onPress={() => handleOpenConversation(item)}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Title>{item.analyst.name}</Title>
              <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
            </View>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteConversation(item.id)}
            />
          </View>
          <Paragraph>{truncatedMessage}</Paragraph>
          <View style={styles.statsContainer}>
            <Text style={styles.stats}>
              {t('chat_history.messages_count', { count: item.messages.length })}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>{t('chat_history.no_conversations')}</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  stats: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatHistoryScreen; 