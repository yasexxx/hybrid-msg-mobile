import { PlanCard } from '@/components/subscription/PlanCard';
import { SubscriptionHeader } from '@/components/subscription/SubscriptionHeader';
import { SubscriptionInfo } from '@/components/subscription/SubscriptionInfo';
import { useSettings } from '@/constants/SettingsContext';
import { SUBSCRIPTION_PLANS } from '@/constants/app-constants';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
    const { theme } = useSettings();
    const { t } = useTranslation();
    const activeColors = Colors[theme];
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
            <SubscriptionHeader 
                onBack={() => router.back()} 
                activeColors={activeColors} 
                title={t('manage_subscription')} 
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SubscriptionInfo t={t} activeColors={activeColors} />

                {SUBSCRIPTION_PLANS.map((plan) => (
                    <PlanCard 
                        key={plan.id} 
                        t={t} 
                        plan={plan} 
                        activeColors={activeColors} 
                        onSelect={() => {
                            // Logic for plan selection can be added here
                        }}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        padding: 20,
    },
});
