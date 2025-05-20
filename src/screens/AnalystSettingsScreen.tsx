import React, { useState } from 'react';
import type { FC } from 'react';
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
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { Psychoanalyst } from '../types';
import CONFIG from '../config/config';

const AnalystSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [analysts, setAnalysts] = React.useState<Psychoanalyst[]>(CONFIG.psychoanalysts);
  const [editingAnalyst, setEditingAnalyst] = React.useState<Psychoanalyst | null>(null);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleEdit = (analyst: Psychoanalyst) => {
    setEditingAnalyst({ ...analyst });
    setDialogVisible(true);
  };

  const handleAdd = () => {
    setEditingAnalyst({
      id: Date.now().toString(),
      name: '',
      badgeColor: '#000000',
      description: '',
    });
    setDialogVisible(true);
  };

  const handleSave = () => {
    if (!editingAnalyst) return;

    if (!editingAnalyst.name.trim() || !editingAnalyst.description.trim()) {
      showSnackbar(t('analyst_settings.fill_all_fields'));
      return;
    }

    setAnalysts(prev => {
      const index = prev.findIndex(a => a.id === editingAnalyst.id);
      if (index >= 0) {
        const newAnalysts = [...prev];
        newAnalysts[index] = editingAnalyst;
        return newAnalysts;
      }
      return [...prev, editingAnalyst];
    });

    setDialogVisible(false);
    showSnackbar(t('analyst_settings.saved_successfully'));
  };

  const handleDelete = (id: string) => {
    if (analysts.length <= 1) {
      showSnackbar(t('analyst_settings.minimum_required'));
      return;
    }
    setAnalysts(prev => prev.filter(a => a.id !== id));
    showSnackbar(t('analyst_settings.deleted_successfully'));
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
          {t('analyst_settings.add_analyst')}
        </Button>

        {analysts.map(analyst => (
          <Card key={analyst.id} style={styles.card}>
            <Card.Content>
              <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                  <Title>{analyst.name}</Title>
                  <View
                    style={[
                      styles.colorBadge,
                      { backgroundColor: analyst.badgeColor },
                    ]}
                  />
                </View>
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEdit(analyst)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(analyst.id)}
                  />
                </View>
              </View>
              <Text style={styles.description}>{analyst.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingAnalyst?.name
              ? t('analyst_settings.edit_analyst')
              : t('analyst_settings.add_analyst')}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('analyst_settings.name')}
              value={editingAnalyst?.name}
              onChangeText={text =>
                setEditingAnalyst(prev => prev ? { ...prev, name: text } : null)
              }
              style={styles.input}
            />
            <TextInput
              label={t('analyst_settings.badge_color')}
              value={editingAnalyst?.badgeColor}
              onChangeText={text =>
                setEditingAnalyst(prev => prev ? { ...prev, badgeColor: text } : null)
              }
              style={styles.input}
            />
            <TextInput
              label={t('analyst_settings.description')}
              value={editingAnalyst?.description}
              onChangeText={text =>
                setEditingAnalyst(prev => prev ? { ...prev, description: text } : null)
              }
              multiline
              numberOfLines={3}
              style={styles.input}
            />
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
  colorBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  description: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
});

export default AnalystSettingsScreen; 