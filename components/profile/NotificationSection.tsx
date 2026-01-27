import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';

interface NotificationSectionProps {
    enabled: boolean;
    onToggle: (value: boolean) => Promise<void>;
    activeColors: any;
    loading?: boolean;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
    enabled,
    onToggle,
    activeColors,
    loading = false
}) => {
    const { t } = useTranslation();

    const handleToggle = async (value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await onToggle(value);
    };

    return (
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('notifications')}</Text>
                    <Text style={[styles.cardSubtitle, { color: activeColors.icon }]}>
                        {enabled ? t('active_running') : t('inactive')}
                    </Text>
                </View>
                <View style={styles.actionContainer}>
                    {loading && <ActivityIndicator size="small" color={activeColors.primary} style={{ marginRight: 10 }} />}
                    <Switch
                        value={enabled}
                        onValueChange={handleToggle}
                        disabled={loading}
                        trackColor={{ false: '#767577', true: activeColors.primary }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
    },
});
