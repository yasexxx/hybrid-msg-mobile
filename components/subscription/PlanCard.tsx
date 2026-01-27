import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PlanCardProps {
    t: (key: string) => string;
    plan: {
        id: string;
        name: string;
        price: string;
        period: string;
        features: string[];
        color: string;
        popular?: boolean;
    };
    activeColors: any;
    onSelect?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    t,
    plan,
    activeColors,
    onSelect,
}) => {
    const getButtonText = () => {
        if (plan.id === 'free') return t('current_plan');
        if (plan.id === 'pro') return t('upgrade_to_pro');
        return t('contact_sales');
    };

    return (
        <View 
            style={[
                styles.planCard, 
                { 
                    backgroundColor: activeColors.card,
                    borderColor: plan.popular ? activeColors.primary : activeColors.inputBorder,
                    borderWidth: plan.popular ? 2 : 1
                }
            ]}
        >
            {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: activeColors.primary }]}>
                    <Text style={styles.popularText}>{t('most_popular').toUpperCase()}</Text>
                </View>
            )}

            <View style={styles.planHeader}>
                <View>
                    <Text style={[styles.planName, { color: activeColors.text }]}>{plan.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.planPrice, { color: activeColors.text }]}>{plan.price}</Text>
                        <Text style={[styles.planPeriod, { color: activeColors.icon }]}>{plan.period}</Text>
                    </View>
                </View>
                <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
                    <IconSymbol 
                        name={plan.id === 'free' ? 'paperplane.fill' : plan.id === 'pro' ? 'star.fill' : 'building.2.fill'} 
                        size={30} 
                        color={plan.color} 
                    />
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <IconSymbol name="checkmark.circle.fill" size={18} color="#4CAF50" />
                        <Text style={[styles.featureText, { color: activeColors.text }]}>{feature}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity 
                onPress={onSelect}
                style={[
                    styles.planButton, 
                    { 
                        backgroundColor: plan.id === 'free' ? 'transparent' : plan.color,
                        borderColor: plan.color,
                        borderWidth: plan.id === 'free' ? 1.5 : 0
                    }
                ]}
            >
                <Text style={[
                    styles.planButtonText, 
                    { color: plan.id === 'free' ? activeColors.text : '#FFF' }
                ]}>
                    {getButtonText()}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    planCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        position: 'relative',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 24,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    planName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    planPrice: {
        fontSize: 32,
        fontWeight: '900',
    },
    planPeriod: {
        fontSize: 16,
        marginLeft: 2,
    },
    planIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 20,
    },
    featuresList: {
        marginBottom: 25,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    featureText: {
        fontSize: 15,
    },
    planButton: {
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    planButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
