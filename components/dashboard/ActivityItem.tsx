import { IconSymbol } from '@/components/ui/icon-symbol';
import { APP_CONFIG } from '@/constants/app-constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ActivityItemProps {
  t: (key: string) => string;
  activeColors: any;
  item: {
    id: string | number;
    phone_number: string;
    created_at: string;
    status: 'sent' | 'failed' | 'pending' | string;
  };
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  t,
  activeColors,
  item,
}) => {
  const getStatusColor = () => {
    switch (item.status) {
      case 'sent':
        return activeColors.success;
      case 'failed':
        return activeColors.accent;
      default:
        return activeColors.primary;
    }
  };

  return (
    <View style={[styles.activityItem, { backgroundColor: activeColors.card }]}>
      <View style={[styles.activityIcon, { backgroundColor: item.status === 'sent' ? activeColors.success + APP_CONFIG.PULSE_OPACITY : activeColors.secondary }]}>
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
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusBadgeText}>{t(item.status)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
