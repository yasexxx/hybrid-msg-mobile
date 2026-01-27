import { NotificationSection } from '@/components/profile/NotificationSection';
import { PhoneVerificationSection } from '@/components/profile/PhoneVerificationSection';
import { PlanSection } from '@/components/profile/PlanSection';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AUTH_KEYS } from '@/constants/api-constants';
import { useSettings } from '@/constants/SettingsContext';
import { Colors } from '@/constants/theme';
import {
    confirm2fa,
    disable2fa,
    enable2fa,
    logout_api,
    sendPhoneOtp,
    updateEmail,
    updatePreferences,
    verifyPhoneOtp
} from '@/services/api';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { theme } = useSettings();
    const { t } = useTranslation();
    const activeColors = Colors[theme];
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [show2faSetup, setShow2faSetup] = useState(false);
    const [twoFaSecret, setTwoFaSecret] = useState('');
    const [qrUri, setQrUri] = useState('');
    const [twoFaCode, setTwoFaCode] = useState('');

    // Advanced Profile States
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [plan, setPlan] = useState('free');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [name, setName] = useState('');
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api'}/user`, {
                headers: {
                    'Authorization': `Bearer ${await SecureStore.getItemAsync(AUTH_KEYS.TOKEN)}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            setEmail(data.email);
            setName(data.name || 'User');
            setIs2faEnabled(!!data.two_factor_confirmed_at);
            setNotificationsEnabled(!!data.notifications_enabled);
            setPlan(data.plan || 'free');
            setPhoneNumber(data.phone_number || '');
            setIsPhoneVerified(!!data.phone_verified_at);
        } catch (err) {
            console.error('Failed to load user:', err);
        }
    };

    const handleUpdateEmail = async () => {
        if (!email) return;
        setLoading(true);
        try {
            await updateEmail(email);
            Alert.alert(t('success'), t('email_updated_success'));
        } catch (err: any) {
            Alert.alert(t('error'), err.response?.data?.message || t('update_failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggle2fa = async () => {
        if (is2faEnabled) {
            Alert.alert(
                t('disable_2fa'),
                t('disable_2fa_confirm'),
                [
                    { text: t('cancel'), style: 'cancel' },
                    {
                        text: t('disable'),
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await disable2fa();
                                setIs2faEnabled(false);
                                Alert.alert(t('success'), t('2fa_disabled'));
                            } catch (err) {
                                Alert.alert(t('error'), t('action_failed'));
                            }
                        }
                    }
                ]
            );
        } else {
            setLoading(true);
            try {
                const data = await enable2fa();
                setTwoFaSecret(data.secret);
                setQrUri(data.qr_code_url);
                setShow2faSetup(true);
            } catch (err) {
                Alert.alert(t('error'), t('action_failed'));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleConfirm2fa = async () => {
        if (twoFaCode.length !== 6) return;
        setLoading(true);
        try {
            await confirm2fa(twoFaCode);
            setIs2faEnabled(true);
            setShow2faSetup(false);
            setTwoFaCode('');
            Alert.alert(t('success'), t('2fa_enabled_success'));
        } catch (err: any) {
            Alert.alert(t('error'), err.response?.data?.message || t('invalid_code'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNotifications = async (value: boolean) => {
        const previousValue = notificationsEnabled;
        setNotificationsEnabled(value);
        setIsSavingPreferences(true);

        try {
            await updatePreferences(value);
        } catch (err) {
            console.log(err);
            setNotificationsEnabled(previousValue);
            Alert.alert(t('error'), t('action_failed'));
        } finally {
            setIsSavingPreferences(false);
        }
    };

    const handleSendPhoneOtp = async (phone: string) => {
        await sendPhoneOtp(phone);
    };

    const handleVerifyPhoneOtp = async (code: string) => {
        const response = await verifyPhoneOtp(code);
        setIsPhoneVerified(true);
    };

    const handleLogout = async () => {
        Alert.alert(
            t('logout'),
            t('logout_confirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('logout'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout_api();
                        } finally {
                            await SecureStore.deleteItemAsync(AUTH_KEYS.TOKEN);
                            router.replace('/login');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={activeColors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: activeColors.text }]}>{t('profile_settings')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Info Section */}
                <View style={styles.avatarSection}>
                    <View style={[styles.avatarContainer, { backgroundColor: activeColors.primary + '15' }]}>
                        <IconSymbol name="person.circle.fill" size={100} color={activeColors.primary} />
                    </View>
                    <Text style={[styles.userName, { color: activeColors.text }]}>{name}</Text>
                </View>

                {/* Account Settings */}
                <View style={[styles.card, { backgroundColor: activeColors.card }]}>
                    <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('account_info')}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: activeColors.icon }]}>{t('email_address')}</Text>
                        <TextInput
                            style={[styles.input, { color: activeColors.text, borderColor: activeColors.secondary }]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="admin@example.com"
                            placeholderTextColor={activeColors.icon}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleUpdateEmail}
                        disabled={loading}
                        style={[styles.primaryButton, { backgroundColor: activeColors.primary }]}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>{t('update_email')}</Text>}
                    </TouchableOpacity>
                </View>

                {/* Notifications */}
                <NotificationSection
                    enabled={notificationsEnabled}
                    onToggle={handleToggleNotifications}
                    activeColors={activeColors}
                    loading={isSavingPreferences}
                />

                {/* Phone Verification */}
                <PhoneVerificationSection
                    phoneNumber={phoneNumber}
                    isVerified={isPhoneVerified}
                    onSendOtp={handleSendPhoneOtp}
                    onVerifyOtp={handleVerifyPhoneOtp}
                    activeColors={activeColors}
                />

                {/* Billing & Plan */}
                <PlanSection
                    plan={plan}
                    activeColors={activeColors}
                />

                {/* 2FA Section */}
                <View style={[styles.card, { backgroundColor: activeColors.card }]}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('two_factor_auth')}</Text>
                            <Text style={[styles.cardSubtitle, { color: activeColors.icon }]}>
                                {is2faEnabled ? t('2fa_enabled_desc') : t('2fa_disabled_desc')}
                            </Text>
                        </View>
                        <Switch
                            value={is2faEnabled}
                            onValueChange={handleToggle2fa}
                            trackColor={{ false: '#767577', true: activeColors.primary }}
                        />
                    </View>

                    {show2faSetup && (
                        <View style={styles.setupContainer}>
                            <View style={styles.divider} />
                            <Text style={[styles.setupTitle, { color: activeColors.text }]}>{t('setup_2fa')}</Text>
                            <Text style={[styles.setupDesc, { color: activeColors.icon }]}>{t('setup_2fa_desc')}</Text>

                            {qrUri ? (
                                <View style={styles.qrPlaceholder}>
                                    {/* In a real app we'd use a QR component, here we show the secret */}
                                    <Text style={[styles.secretText, { color: activeColors.primary }]}>{twoFaSecret}</Text>
                                    <Text style={[styles.secretLabel, { color: activeColors.icon }]}>{t('manual_code')}</Text>
                                </View>
                            ) : null}

                            <TextInput
                                style={[styles.input, { color: activeColors.text, borderColor: activeColors.secondary, textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
                                value={twoFaCode}
                                onChangeText={setTwoFaCode}
                                placeholder="000000"
                                maxLength={6}
                                keyboardType="number-pad"
                            />

                            <TouchableOpacity
                                onPress={handleConfirm2fa}
                                disabled={loading || twoFaCode.length !== 6}
                                style={[styles.primaryButton, { backgroundColor: activeColors.primary, marginTop: 15 }]}>
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>{t('confirm_setup')}</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShow2faSetup(false)} style={styles.cancelButton}>
                                <Text style={{ color: activeColors.icon }}>{t('cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.logoutButton, { borderColor: activeColors.accent }]}>
                    <IconSymbol name="paperplane.fill" size={20} color={activeColors.accent} />
                    <Text style={[styles.logoutText, { color: activeColors.accent }]}>{t('logout')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
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
    setupContainer: {
        marginTop: 20,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 20,
    },
    setupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    setupDesc: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    qrPlaceholder: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(128,128,128,0.05)',
        borderRadius: 20,
        marginBottom: 20,
    },
    secretText: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 10,
    },
    secretLabel: {
        fontSize: 12,
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        borderRadius: 20,
        borderWidth: 1.5,
        marginTop: 20,
        marginBottom: 40,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});
