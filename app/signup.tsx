import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedTextInput } from '@/components/ui/text-input';
import { AUTH_KEYS } from '@/constants/api-constants';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { register, setAuthToken } from '../services/api';

export default function SignupScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const activeColors = Colors[colorScheme];

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            setError(t('fill_fields_error'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await register(name, email, password);
            
            await SecureStore.setItemAsync(AUTH_KEYS.TOKEN, data.token);
            setAuthToken(data.token);
            router.replace('/(tabs)');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || t('registration_failed'));
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
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <IconSymbol name="chevron.left" size={24} color={activeColors.primary} />
                </TouchableOpacity>

                <View style={[styles.logoContainer, { backgroundColor: activeColors.secondary }]}>
                    <IconSymbol name="paperplane.fill" size={40} color={activeColors.primary} />
                </View>

                <Text style={[styles.title, { color: activeColors.text }]}>
                    {t('create_account')}
                </Text>
                <Text style={[styles.subtitle, { color: activeColors.icon }]}>
                    {t('sign_in_to_continue')}
                </Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.inputGroup}>
                    <ThemedTextInput
                        icon="person"
                        placeholder={t('full_name')}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    <ThemedTextInput
                        icon="envelope"
                        placeholder={t('email_address')}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <ThemedTextInput
                        icon="lock"
                        placeholder={t('password')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: activeColors.primary }]}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('sign_up')}</Text>}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.signInButton}
                    onPress={() => router.back()}
                >
                    <Text style={[styles.signInText, { color: activeColors.icon }]}>
                        Already have an account? <Text style={{ color: activeColors.primary, fontWeight: 'bold' }}>{t('sign_in')}</Text>
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
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
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
    signInButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    signInText: {
        fontSize: 14,
    },
    errorText: {
        color: '#FF6C52',
        marginBottom: 20,
        fontSize: 14,
        fontWeight: '600',
    }
});
