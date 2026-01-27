import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface ForwardingToggleProps {
  t: (key: string) => string;
  activeColors: any;
  isForwarding: boolean;
  setIsForwarding: (value: boolean) => void;
}

export const ForwardingToggle: React.FC<ForwardingToggleProps> = ({
  t,
  activeColors,
  isForwarding,
  setIsForwarding,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});
