import { IconSymbol } from '@/components/ui/icon-symbol';
import { AUTH_KEYS } from '@/constants/api-constants';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login, setAuthToken } from '../services/api';
import '../services/i18n';

export default function LoginScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const activeColors = Colors[colorScheme];

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError(t('fill_fields_error'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await login(email, password);
            await SecureStore.setItemAsync(AUTH_KEYS.TOKEN, data.token);
            setAuthToken(data.token);
            router.replace('/(tabs)');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || t('login_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: activeColors.background }]}
        >
            <View style={styles.content}>
                <View style={[styles.logoContainer, { backgroundColor: activeColors.secondary }]}>
                    <IconSymbol name="paperplane.fill" size={40} color={activeColors.primary} />
                </View>

                <Text style={[styles.title, { color: activeColors.text }]}>{t('welcome_back')}</Text>
                <Text style={[styles.subtitle, { color: activeColors.icon }]}>
                    {t('sign_in_to_continue')}
                </Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.inputGroup}>
                    <View style={[styles.inputContainer, { backgroundColor: activeColors.card }]}>
                        <IconSymbol name="envelope" size={20} color={activeColors.icon} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: activeColors.text }]}
                            placeholder={t('email_address')}
                            placeholderTextColor={activeColors.icon}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: activeColors.card }]}>
                        <IconSymbol name="lock" size={20} color={activeColors.icon} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: activeColors.text }]}
                            placeholder={t('password')}
                            placeholderTextColor={activeColors.icon}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: activeColors.primary }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>{t('sign_in')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotButton}>
                    <Text style={[styles.forgotText, { color: activeColors.primary }]}>
                        {t('forgot_password')}
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
        height: 55,
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
        fontSize: 16,
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
    forgotButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    forgotText: {
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
