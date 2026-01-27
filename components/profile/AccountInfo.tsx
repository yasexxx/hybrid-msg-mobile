import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedTextInput } from '../ui/text-input';

interface AccountInfoProps {
    t: (key: string) => string;
    email: string;
    setEmail: (email: string) => void;
    activeColors: any;
    loading: boolean;
    onUpdateEmail: () => void;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
    t,
    email,
    setEmail,
    activeColors,
    loading,
    onUpdateEmail,
}) => {
    return (
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
            <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('account_info')}</Text>
            <View style={styles.inputContainer}>
                <ThemedTextInput
                    label={t('email_address')}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="admin@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>
            <TouchableOpacity
                onPress={onUpdateEmail}
                disabled={loading}
                style={[styles.primaryButton, { backgroundColor: activeColors.primary }]}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>{t('update_email')}</Text>}
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
        marginBottom: 4,
    },
    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 55,
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    primaryButton: {
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
