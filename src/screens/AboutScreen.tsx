import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTheme, Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CONFIG from '../config/config';

const AboutScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dreaminterpreter.app');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{CONFIG.app.name}</Title>
          <Paragraph>Version {CONFIG.app.version}</Paragraph>
          <Text style={styles.description}>
            {CONFIG.app.description}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('about.how_it_works')}</Title>
          <Paragraph>{t('about.how_it_works_desc')}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('about.analysts')}</Title>
          {CONFIG.psychoanalysts.map(analyst => (
            <View key={analyst.id} style={styles.analystSection}>
              <Text style={styles.analystName}>{analyst.name}</Text>
              <Text style={styles.analystDesc}>{analyst.description}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('about.support')}</Title>
          <Paragraph>{t('about.support_desc')}</Paragraph>
          <Button
            mode="contained"
            onPress={handleContactSupport}
            style={styles.button}
          >
            {t('about.contact_support')}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
  },
  analystSection: {
    marginVertical: 8,
  },
  analystName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  analystDesc: {
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
});

export default AboutScreen; 