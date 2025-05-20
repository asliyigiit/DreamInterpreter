import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme, Text, Card, Title, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const PrivacyScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.title')}</Title>
          <Paragraph style={styles.lastUpdated}>
            {t('privacy.last_updated', { date: 'March 15, 2024' })}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.data_collection')}</Title>
          <Paragraph>{t('privacy.data_collection_desc')}</Paragraph>
          <Text style={styles.bulletPoint}>• {t('privacy.data_dreams')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.data_preferences')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.data_usage')}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.data_use')}</Title>
          <Paragraph>{t('privacy.data_use_desc')}</Paragraph>
          <Text style={styles.bulletPoint}>• {t('privacy.use_improve')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.use_personalize')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.use_research')}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.data_sharing')}</Title>
          <Paragraph>{t('privacy.data_sharing_desc')}</Paragraph>
          <Text style={styles.bulletPoint}>• {t('privacy.share_openai')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.share_analytics')}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.data_security')}</Title>
          <Paragraph>{t('privacy.data_security_desc')}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.user_rights')}</Title>
          <Paragraph>{t('privacy.user_rights_desc')}</Paragraph>
          <Text style={styles.bulletPoint}>• {t('privacy.right_access')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.right_delete')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.right_export')}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('privacy.contact')}</Title>
          <Paragraph>{t('privacy.contact_desc')}</Paragraph>
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
  lastUpdated: {
    fontStyle: 'italic',
    marginTop: 8,
  },
  bulletPoint: {
    marginTop: 8,
    marginLeft: 16,
  },
});

export default PrivacyScreen; 