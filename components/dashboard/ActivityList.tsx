import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityItem } from './ActivityItem';

interface ActivityListProps {
  t: (key: string) => string;
  activeColors: any;
  activity: any[];
  onSeeAll: () => void;
  error: string | null;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  t,
  activeColors,
  activity,
  onSeeAll,
  error,
}) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>{t('recent_activity')}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAllText, { color: activeColors.primary }]}>{t('see_all')}</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.activityList}>
        {activity.length > 0 ? (
          activity.map((item: any) => (
            <ActivityItem 
               key={item.id} 
               t={t} 
               activeColors={activeColors} 
               item={item} 
            />
          ))
        ) : (
          <Text style={[styles.emptyText, { color: activeColors.icon }]}>
            {t('no_activity_found')}
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});
