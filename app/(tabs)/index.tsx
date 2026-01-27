import { ActivityList } from '@/components/dashboard/ActivityList';
import { ForwardingToggle } from '@/components/dashboard/ForwardingToggle';
import { Header } from '@/components/dashboard/Header';
import { LanguageModal } from '@/components/dashboard/LanguageModal';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { AUTH_KEYS } from '@/constants/api-constants';
import { APP_CONFIG } from '@/constants/app-constants';
import { useSettings } from '@/constants/SettingsContext';
import { Colors } from '@/constants/theme';
import { useSmsForwarder } from '@/hooks/useSmsForwarder';
import { getRecentActivity, getStats } from '@/services/api';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { theme, toggleTheme, setLanguage, language } = useSettings();
  const { t } = useTranslation();
  const activeColors = Colors[theme];
  const router = useRouter();

  const [isForwarding, setIsForwarding] = useState(false);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [deviceName, setDeviceName] = useState<string | undefined>(undefined);

  const { isProcessing, lastSync, error } = useSmsForwarder(isForwarding, deviceId, deviceName);

  const [stats, setStats] = useState({ pending: 0, sent: 0, failed: 0 });
  const [activity, setActivity] = useState([]);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  useEffect(() => {
    initializeDevice();
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, APP_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const initializeDevice = async () => {
    try {
      const name = `${Device.brand} ${Device.modelName}`;
      const id = Device.osInternalBuildId || 'mobile-device';
      setDeviceId(id);
      setDeviceName(name);
    } catch (err) {
      console.error('Device info failed:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_KEYS.TOKEN);
      if (!token) return;

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

  const isConnected = isForwarding && !error;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header 
          t={t}
          activeColors={activeColors}
          theme={theme}
          toggleTheme={toggleTheme}
          language={language}
          setIsLangModalVisible={setIsLangModalVisible}
          isConnected={isConnected}
          router={router}
        />

        <StatusCard 
          t={t}
          activeColors={activeColors}
          isForwarding={isForwarding}
          lastSync={lastSync}
        />

        <ForwardingToggle 
          t={t}
          activeColors={activeColors}
          isForwarding={isForwarding}
          setIsForwarding={setIsForwarding}
        />

        <StatsSection 
          t={t}
          activeColors={activeColors}
          stats={stats}
        />

        <ActivityList 
          t={t}
          activeColors={activeColors}
          activity={activity}
          onSeeAll={() => router.push('/activity-history' as any)}
          error={error}
        />
      </ScrollView>

      <LanguageModal 
        t={t}
        activeColors={activeColors}
        isVisible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
        currentLanguage={language}
        onSelectLanguage={(code) => setLanguage(code as any)}
      />
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
});
