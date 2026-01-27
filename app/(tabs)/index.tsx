import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSettings } from '@/constants/SettingsContext';
import { Colors } from '@/constants/theme';
import { useSmsForwarder } from '@/hooks/useSmsForwarder';
import { getRecentActivity, getStats } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'tl', label: 'Filipino', native: 'Tagalog' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'zh', label: 'Chinese', native: '中文' },
];

export default function DashboardScreen() {
  const { theme, toggleTheme, setLanguage, language } = useSettings();
  const { t } = useTranslation();
  const activeColors = Colors[theme];
  const router = useRouter();

  const [isForwarding, setIsForwarding] = useState(false);
  const { isProcessing, lastSync, error } = useSmsForwarder(isForwarding);

  const [stats, setStats] = useState({ pending: 0, sent: 0, failed: 0 });
  const [activity, setActivity] = useState([]);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        getStats(),
        getRecentActivity()
      ]);
      setStats(statsData);
      setActivity(activityData.data);
    } catch (err) {
      console.error('Dashboard poll failed:', err);
    }
  };

  // Connection pulse logic (mocked for now, but linked to service state)
  const isConnected = isForwarding && !error;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: activeColors.text }]}>{t('welcome_back')},</Text>
            <View style={styles.nameRow}>
              <Text style={[styles.nameText, { color: activeColors.text }]}>FlavorFit</Text>
              <View style={[styles.pulseContainer, { backgroundColor: isConnected ? activeColors.success + '20' : '#80808020' }]}>
                <View style={[styles.pulseCircle, { backgroundColor: isConnected ? activeColors.success : '#808080' }]} />
                <Text style={[styles.pulseText, { color: isConnected ? activeColors.success : '#808080' }]}>
                  {isConnected ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerActions}>
            {/* Language Switcher */}
            {/* Language Picker Button */}
            <TouchableOpacity
              onPress={() => setIsLangModalVisible(true)}
              style={[styles.actionButton, { backgroundColor: activeColors.secondary }]}>
              <Text style={[styles.actionButtonText, { color: activeColors.primary }]}>{language.toUpperCase()}</Text>
            </TouchableOpacity>

            {/* Theme Toggle */}
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

        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: activeColors.primary }]}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>{t('service_status')}</Text>
            <Text style={styles.statusValue}>{isForwarding ? t('active_running') : t('inactive')}</Text>
            <Text style={styles.syncText}>
              {t('last_sync')}: {lastSync ? lastSync.toLocaleTimeString() : t('never')}
            </Text>
          </View>
          <View style={styles.statusIconContainer}>
            <IconSymbol
              name={isForwarding ? "antenna.radiowaves.left.and.right" : "antenna.radiowaves.left.and.right.slash"}
              size={50}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Control Action */}
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: activeColors.secondary }]}>
              <IconSymbol name="command" size={20} color={activeColors.primary} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('forwarding_toggle')}</Text>
              <Text style={[styles.cardSubtitle, { color: activeColors.icon }]}>{t('activate_sync')}</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: activeColors.primary }}
              thumbColor={isForwarding ? '#f4f3f4' : '#f4f3f4'}
              onValueChange={setIsForwarding}
              value={isForwarding}
            />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: activeColors.card }]}>
            <Text style={[styles.statValue, { color: activeColors.primary }]}>{stats.pending}</Text>
            <Text style={[styles.statLabel, { color: activeColors.icon }]}>{t('pending')}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: activeColors.card }]}>
            <Text style={[styles.statValue, { color: activeColors.success }]}>{stats.sent}</Text>
            <Text style={[styles.statLabel, { color: activeColors.icon }]}>{t('sent')}</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>{t('recent_activity')}</Text>
          <TouchableOpacity onPress={() => router.push('/activity-history' as any)}>
            <Text style={[styles.seeAllText, { color: activeColors.primary }]}>{t('see_all')}</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Dynamic Activity List */}
        <View style={styles.activityList}>
          {activity.length > 0 ? (
            activity.map((item: any) => (
              <View key={item.id} style={[styles.activityItem, { backgroundColor: activeColors.card }]}>
                <View style={[styles.activityIcon, { backgroundColor: item.status === 'sent' ? activeColors.success + '20' : activeColors.secondary }]}>
                  <IconSymbol
                    name={item.status === 'sent' ? "paperplane.fill" : (item.status === 'failed' ? "exclamationmark.triangle.fill" : "clock.fill")}
                    size={20}
                    color={item.status === 'sent' ? activeColors.success : activeColors.primary}
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityTarget, { color: activeColors.text }]}>{item.phone_number}</Text>
                  <Text style={[styles.activityTime, { color: activeColors.icon }]}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'sent' ? activeColors.success : (item.status === 'failed' ? activeColors.accent : activeColors.primary) }]}>
                  <Text style={styles.statusBadgeText}>{t(item.status)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: activeColors.icon }]}>
              {t('no_activity_found')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLangModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>{t('select_language')}</Text>
              <TouchableOpacity onPress={() => setIsLangModalVisible(false)}>
                <IconSymbol name="xmark.circle.fill" size={24} color={activeColors.icon} />
              </TouchableOpacity>
            </View>

            <View style={styles.langList}>
              {LANGUAGES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  onPress={() => {
                    setLanguage(item.code as any);
                    setIsLangModalVisible(false);
                  }}
                  style={[
                    styles.langItem,
                    language === item.code && { backgroundColor: activeColors.primary + '10' }
                  ]}
                >
                  <View style={styles.langInfo}>
                    <Text style={[styles.langNative, { color: activeColors.text }]}>{item.native}</Text>
                    <Text style={[styles.langLabel, { color: activeColors.icon }]}>{item.label}</Text>
                  </View>
                  {language === item.code && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={activeColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.7,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#4E6AF3',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  statusValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  syncText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  statusIconContainer: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 0.48,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTarget: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  langList: {
    gap: 12,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  langInfo: {
    flexDirection: 'column',
  },
  langNative: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  langLabel: {
    fontSize: 12,
    marginTop: 2,
  }
});
