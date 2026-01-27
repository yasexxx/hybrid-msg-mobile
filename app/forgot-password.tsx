import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedTextInput } from '@/components/ui/text-input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { requestPasswordReset, resetPassword } from '../services/api';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const activeColors = Colors[colorScheme];

    const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendCode = async () => {
        if (!email) {
            setError(t('email_required'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await requestPasswordReset(email);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || t('failed_to_send_code'));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!code || !password || !passwordConfirmation) {
            setError(t('fill_fields_error'));
            return;
        }

        if (password !== passwordConfirmation) {
            setError(t('passwords_dont_match'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await resetPassword({
                email,
                code,
                password,
                password_confirmation: passwordConfirmation
            });
            router.replace('/login');
            // Show success message (maybe a toast or simply navigate back)
        } catch (err: any) {
            setError(err.response?.data?.message || t('password_reset_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: activeColors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => step === 2 ? setStep(1) : router.back()}
                >
                    <IconSymbol name="chevron.left" size={24} color={activeColors.text} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={[styles.logoContainer, { backgroundColor: activeColors.secondary }]}>
                        <IconSymbol name="lock" size={40} color={activeColors.primary} />
                    </View>

                    <Text style={[styles.title, { color: activeColors.text }]}>
                        {step === 1 ? t('forgot_password') : t('reset_password')}
                    </Text>
                    <Text style={[styles.subtitle, { color: activeColors.icon }]}>
                        {step === 1 
                            ? t('forgot_password_instruction')
                            : t('reset_password_instruction')}
                    </Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.inputGroup}>
                        {step === 1 ? (
                            <ThemedTextInput
                                icon="envelope"
                                placeholder={t('email_address')}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        ) : (
                            <>
                                <ThemedTextInput
                                    icon="command" // Using command as a stand-in for code icon if needed
                                    placeholder={t('verification_code')}
                                    value={code}
                                    onChangeText={setCode}
                                    keyboardType="number-pad"
                                />
                                <ThemedTextInput
                                    icon="lock"
                                    placeholder={t('new_password')}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <ThemedTextInput
                                    icon="lock"
                                    placeholder={t('confirm_password')}
                                    value={passwordConfirmation}
                                    onChangeText={setPasswordConfirmation}
                                    secureTextEntry
                                />
                            </>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: activeColors.primary }]}
                        onPress={step === 1 ? handleSendCode : handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : (
                            <Text style={styles.buttonText}>
                                {step === 1 ? t('send_code') : t('update_password')}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    backButton: {
        marginTop: 60,
        marginLeft: 30,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: 30,
        paddingTop: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
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
    button: {
        height: 55,
        borderRadius: 16,
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
    errorText: {
        color: '#FF6C52',
        marginBottom: 20,
        fontSize: 14,
        fontWeight: '600',
    }
});
