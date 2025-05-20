import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, List, Switch, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { DrawerParamList } from '../navigation/types';

type SettingsScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const isDarkMode = theme.dark;

  const toggleTheme = () => {
    // Theme toggle logic will be implemented here
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>{t('settings.appearance')}</List.Subheader>
        <List.Item
          title={t('settings.dark_mode')}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              color={theme.colors.primary}
            />
          )}
        />
        <List.Item
          title={t('settings.language')}
          description={i18n.language === 'en' ? 'English' : 'Türkçe'}
          right={() => (
            <Switch
              value={i18n.language === 'tr'}
              onValueChange={toggleLanguage}
              color={theme.colors.primary}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>{t('settings.customization')}</List.Subheader>
        <List.Item
          title={t('settings.manage_analysts')}
          description={t('settings.manage_analysts_desc')}
          onPress={() => navigation.navigate('AnalystSettings')}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title={t('settings.manage_questions')}
          description={t('settings.manage_questions_desc')}
          onPress={() => navigation.navigate('QuestionSettings')}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>{t('settings.about')}</List.Subheader>
        <List.Item
          title={t('settings.about_app')}
          onPress={() => navigation.navigate('About')}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title={t('settings.privacy_policy')}
          onPress={() => navigation.navigate('Privacy')}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen; 