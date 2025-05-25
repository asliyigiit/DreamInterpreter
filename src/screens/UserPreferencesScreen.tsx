import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type UserPreferencesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserPreferences'>;

const UserPreferencesScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<UserPreferencesScreenNavigationProp>();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>{t('preferences.settings')}</List.Subheader>
        <List.Item
          title={t('preferences.settings')}
          onPress={() => navigation.navigate('Settings')}
          left={props => <List.Icon {...props} icon="cog" />}
        />
        <List.Item
          title={t('preferences.manage_analysts')}
          onPress={() => navigation.navigate('AnalystSettings')}
          left={props => <List.Icon {...props} icon="account-cog" />}
        />
        <List.Item
          title={t('preferences.manage_questions')}
          onPress={() => navigation.navigate('QuestionSettings')}
          left={props => <List.Icon {...props} icon="format-list-checks" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>{t('preferences.info')}</List.Subheader>
        <List.Item
          title={t('preferences.about')}
          onPress={() => navigation.navigate('About')}
          left={props => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title={t('preferences.privacy')}
          onPress={() => navigation.navigate('Privacy')}
          left={props => <List.Icon {...props} icon="shield-account" />}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserPreferencesScreen; 