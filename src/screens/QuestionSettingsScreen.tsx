import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  useTheme,
  Card,
  Title,
  TextInput,
  Button,
  IconButton,
  Text,
  Portal,
  Dialog,
  Snackbar,
  SegmentedButtons,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { PreChatQuestion } from '../types';
import CONFIG from '../config/config';

const QuestionSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [questions, setQuestions] = useState<PreChatQuestion[]>(CONFIG.preChatQuestions);
  const [editingQuestion, setEditingQuestion] = useState<PreChatQuestion | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [optionsText, setOptionsText] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleEdit = (question: PreChatQuestion) => {
    setEditingQuestion({ ...question });
    setOptionsText(question.options?.join('\n') || '');
    setDialogVisible(true);
  };

  const handleAdd = () => {
    setEditingQuestion({
      id: Date.now().toString(),
      label: '',
      type: 'text',
      options: [],
    });
    setOptionsText('');
    setDialogVisible(true);
  };

  const handleSave = () => {
    if (!editingQuestion) return;

    if (!editingQuestion.label.trim()) {
      showSnackbar(t('question_settings.fill_all_fields'));
      return;
    }

    if (editingQuestion.type === 'dropdown' && !optionsText.trim()) {
      showSnackbar(t('question_settings.add_options'));
      return;
    }

    const updatedQuestion = {
      ...editingQuestion,
      options: editingQuestion.type === 'dropdown'
        ? optionsText.split('\n').filter(opt => opt.trim())
        : undefined,
    };

    setQuestions(prev => {
      const index = prev.findIndex(q => q.id === updatedQuestion.id);
      if (index >= 0) {
        const newQuestions = [...prev];
        newQuestions[index] = updatedQuestion;
        return newQuestions;
      }
      return [...prev, updatedQuestion];
    });

    setDialogVisible(false);
    showSnackbar(t('question_settings.saved_successfully'));
  };

  const handleDelete = (id: string) => {
    if (questions.length <= 1) {
      showSnackbar(t('question_settings.minimum_required'));
      return;
    }
    setQuestions(prev => prev.filter(q => q.id !== id));
    showSnackbar(t('question_settings.deleted_successfully'));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button
          mode="contained"
          onPress={handleAdd}
          style={styles.addButton}
          icon="plus"
        >
          {t('question_settings.add_question')}
        </Button>

        {questions.map(question => (
          <Card key={question.id} style={styles.card}>
            <Card.Content>
              <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                  <Title>{question.label}</Title>
                  <Text style={styles.type}>({question.type})</Text>
                </View>
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEdit(question)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(question.id)}
                  />
                </View>
              </View>
              {question.options && (
                <View style={styles.optionsContainer}>
                  {question.options.map((option, index) => (
                    <Text key={index} style={styles.option}>
                      • {option}
                    </Text>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingQuestion?.label
              ? t('question_settings.edit_question')
              : t('question_settings.add_question')}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('question_settings.label')}
              value={editingQuestion?.label}
              onChangeText={text =>
                setEditingQuestion(prev => prev ? { ...prev, label: text } : null)
              }
              style={styles.input}
            />
            <SegmentedButtons
              value={editingQuestion?.type || 'text'}
              onValueChange={value =>
                setEditingQuestion(prev =>
                  prev ? { ...prev, type: value as 'text' | 'dropdown' } : null
                )
              }
              buttons={[
                { value: 'text', label: t('question_settings.text_type') },
                { value: 'dropdown', label: t('question_settings.dropdown_type') },
              ]}
              style={styles.segmentedButtons}
            />
            {editingQuestion?.type === 'dropdown' && (
              <TextInput
                label={t('question_settings.options')}
                value={optionsText}
                onChangeText={setOptionsText}
                multiline
                numberOfLines={4}
                style={styles.input}
                placeholder={t('question_settings.options_placeholder')}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button onPress={handleSave}>{t('common.save')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  addButton: {
    marginBottom: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    marginLeft: 8,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    marginLeft: 16,
    marginVertical: 2,
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
});

export default QuestionSettingsScreen; 