import { IconSymbol } from '@/components/ui/icon-symbol';
import { APP_CONFIG } from '@/constants/app-constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  t: (key: string) => string;
  activeColors: any;
  theme: string;
  toggleTheme: () => void;
  language: string;
  setIsLangModalVisible: (visible: boolean) => void;
  isConnected: boolean;
  router: any;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  activeColors,
  theme,
  toggleTheme,
  language,
  setIsLangModalVisible,
  isConnected,
  router,
}) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.welcomeText, { color: activeColors.text }]}>{t('welcome_back')},</Text>
        <View style={styles.nameRow}>
          <Text style={[styles.nameText, { color: activeColors.text }]}>FlavorFit</Text>
          <View style={[styles.pulseContainer, { backgroundColor: isConnected ? activeColors.success + APP_CONFIG.PULSE_OPACITY : '#808080' + APP_CONFIG.PULSE_OPACITY }]}>
            <View style={[styles.pulseCircle, { backgroundColor: isConnected ? activeColors.success : '#808080' }]} />
            <Text style={[styles.pulseText, { color: isConnected ? activeColors.success : '#808080' }]}>
              {isConnected ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={() => setIsLangModalVisible(true)}
          style={[styles.actionButton, { backgroundColor: activeColors.secondary }]}>
          <Text style={[styles.actionButtonText, { color: activeColors.primary }]}>{language.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.actionButton, { backgroundColor: activeColors.secondary }]}>
          <IconSymbol name={theme === 'dark' ? "sun.max.fill" : "moon.fill"} size={20} color={activeColors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={[styles.profileButton, { backgroundColor: activeColors.secondary }]}>
          <IconSymbol name="person.fill" size={24} color={activeColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    opacity: APP_CONFIG.DEFAULT_OPACITY,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pulseText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
