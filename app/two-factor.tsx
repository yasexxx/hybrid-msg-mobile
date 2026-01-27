import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedTextInput } from '@/components/ui/text-input';
import { AUTH_KEYS } from '@/constants/api-constants';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setAuthToken, verify2faLogin } from '../services/api';
import '../services/i18n';

export default function TwoFactorScreen() {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token: string }>();
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const activeColors = Colors[colorScheme];

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            setError(t('invalid_otp_error', 'Please enter a valid OTP'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await verify2faLogin(otp);
            if (token) {
                await saveTokenAndNavigate(token);
            } else {
                // Fallback: check if token is already in secure store or just proceed if verify2faLogin succeeded
                const storedToken = await SecureStore.getItemAsync(AUTH_KEYS.TOKEN);
                if (storedToken) {
                    router.replace('/(tabs)');
                } else {
                   setError(t('session_error', 'Session expired. Please login again.'));
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || t('invalid_code'));
        } finally {
            setLoading(false);
        }
    };

    const saveTokenAndNavigate = async (tokenToSave: string) => {
        await SecureStore.setItemAsync(AUTH_KEYS.TOKEN, tokenToSave);
        setAuthToken(tokenToSave);
        router.replace('/(tabs)');
    };

    const handleBackToLogin = () => {
        setAuthToken(null);
        router.replace('/login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: activeColors.background }]}
        >
            <View style={styles.content}>
                <View style={[styles.logoContainer, { backgroundColor: activeColors.secondary }]}>
                    <IconSymbol name="lock.fill" size={40} color={activeColors.primary} />
                </View>

                <Text style={[styles.title, { color: activeColors.text }]}>
                    {t('two_factor_auth')}
                </Text>
                <Text style={[styles.subtitle, { color: activeColors.icon }]}>
                    {t('enter_otp_desc', 'Please enter the 6-digit code from your authenticator app to continue')}
                </Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.inputGroup}>
                    <ThemedTextInput
                        icon="lock"
                        placeholder="000000"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                        style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: activeColors.primary }]}
                    onPress={handleVerifyOtp}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('verify_code')}</Text>}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleBackToLogin}
                >
                    <Text style={[styles.backText, { color: activeColors.primary }]}>
                        {t('back_to_login', 'Back to Login')}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        lineHeight: 22,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 65,
        borderWidth: 1.5,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
    },
    button: {
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF6C52',
        marginBottom: 20,
        fontSize: 14,
        fontWeight: '600',
    }
});
