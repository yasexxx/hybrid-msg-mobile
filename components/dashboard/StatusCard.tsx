import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusCardProps {
  t: (key: string) => string;
  activeColors: any;
  isForwarding: boolean;
  lastSync: Date | null;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  t,
  activeColors,
  isForwarding,
  lastSync,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});
