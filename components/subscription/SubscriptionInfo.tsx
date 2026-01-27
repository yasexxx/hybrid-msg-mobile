import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SubscriptionInfoProps {
    t: (key: string, defaultValue?: string) => string;
    activeColors: any;
}

export const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
    t,
    activeColors,
}) => {
    return (
        <View style={[styles.infoCard, { backgroundColor: activeColors.primary + '10' }]}>
            <IconSymbol name="info.circle.fill" size={24} color={activeColors.primary} />
            <Text style={[styles.infoText, { color: activeColors.text }]}>
                {t('subscription_info_desc', 'Your current plan is Free. Upgrade to unlock more features.')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 25,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});
