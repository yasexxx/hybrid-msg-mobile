import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PlanSectionProps {
    plan: string;
    activeColors: any;
}

export const PlanSection: React.FC<PlanSectionProps> = ({ plan, activeColors }) => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
            <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('billing_plan')}</Text>

            <View style={styles.planInfo}>
                <View style={[styles.planBadge, { backgroundColor: activeColors.primary + '20' }]}>
                    <Text style={[styles.planLabel, { color: activeColors.primary }]}>{plan.toUpperCase()}</Text>
                </View>
                <View style={styles.planDetails}>
                    <Text style={[styles.planTitle, { color: activeColors.text }]}>{t('current_plan')}</Text>
                    <Text style={[styles.planExpiry, { color: activeColors.icon }]}>Renews on Feb 27, 2026</Text>
                </View>
            </View>

            <TouchableOpacity 
                onPress={() => router.push('/subscription')}
                style={[styles.secondaryButton, { borderColor: activeColors.secondary }]}
            >
                <Text style={[styles.secondaryButtonText, { color: activeColors.text }]}>{t('manage_subscription')}</Text>
                <IconSymbol name="chevron.right" size={16} color={activeColors.icon} />
            </TouchableOpacity>
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    planInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    planBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 15,
    },
    planLabel: {
        fontSize: 14,
        fontWeight: '800',
    },
    planDetails: {
        flex: 1,
    },
    planTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    planExpiry: {
        fontSize: 12,
        marginTop: 2,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
