import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsSectionProps {
  t: (key: string) => string;
  activeColors: any;
  stats: {
    pending: number;
    sent: number;
    failed: number;
  };
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  t,
  activeColors,
  stats,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});
