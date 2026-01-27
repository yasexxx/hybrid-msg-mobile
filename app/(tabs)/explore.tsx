import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ServicesScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColors = Colors[colorScheme];

  const helpServices = [
    {
      id: 'support',
      title: 'Customer Support',
      icon: 'person.fill',
      description: 'Get help with your account or messages',
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: 'questionmark.circle.fill',
      description: 'Commonly asked questions and tips',
    },
    {
      id: 'guide',
      title: 'User Guide',
      icon: 'book.fill',
      description: 'Learn how to use SMS Forwarder',
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text }]}>{t('services')}</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.helpSection}>
          <Text style={[styles.sectionTitle, { color: activeColors.icon }]}>{t('help')}</Text>
          
          <View style={styles.cardsContainer}>
            {helpServices.map((service) => (
              <TouchableOpacity 
                key={service.id}
                style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.inputBorder }]}
              >
                <View style={[styles.iconContainer, { backgroundColor: activeColors.secondary }]}>
                  <IconSymbol name={service.icon as any} size={24} color={activeColors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: activeColors.text }]}>{service.title}</Text>
                  <Text style={[styles.cardDescription, { color: activeColors.icon }]}>{service.description}</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={activeColors.icon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  helpSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardsContainer: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
