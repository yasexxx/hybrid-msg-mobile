import { AccountInfo } from '@/components/profile/AccountInfo';
import { NotificationSection } from '@/components/profile/NotificationSection';
import { PhoneVerificationSection } from '@/components/profile/PhoneVerificationSection';
import { PlanSection } from '@/components/profile/PlanSection';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TwoFactorSetup } from '@/components/profile/TwoFactorSetup';
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
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
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

    const handleCopySecret = async () => {
        await Clipboard.setStringAsync(twoFaSecret);
        Alert.alert(t('success'), t('secret_copied'));
    };

    const handleToggleNotifications = async (value: boolean) => {
        const previousValue = notificationsEnabled;
        setNotificationsEnabled(value);
        setIsSavingPreferences(true);
        try {
            await updatePreferences(value);
        } catch (err) {
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
        await verifyPhoneOtp(code);
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
            <ProfileHeader 
                onBack={() => router.back()} 
                activeColors={activeColors} 
                title={t('profile_settings')} 
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ProfileAvatar name={name} activeColors={activeColors} />

                <AccountInfo 
                    t={t}
                    email={email}
                    setEmail={setEmail}
                    activeColors={activeColors}
                    loading={loading}
                    onUpdateEmail={handleUpdateEmail}
                />

                <NotificationSection
                    enabled={notificationsEnabled}
                    onToggle={handleToggleNotifications}
                    activeColors={activeColors}
                    loading={isSavingPreferences}
                />

                <PhoneVerificationSection
                    phoneNumber={phoneNumber}
                    isVerified={isPhoneVerified}
                    onSendOtp={handleSendPhoneOtp}
                    onVerifyOtp={handleVerifyPhoneOtp}
                    activeColors={activeColors}
                />

                <PlanSection
                    plan={plan}
                    activeColors={activeColors}
                />

                <TwoFactorSetup 
                    t={t}
                    activeColors={activeColors}
                    is2faEnabled={is2faEnabled}
                    onToggle2fa={handleToggle2fa}
                    show2faSetup={show2faSetup}
                    setShow2faSetup={setShow2faSetup}
                    qrUri={qrUri}
                    twoFaSecret={twoFaSecret}
                    twoFaCode={twoFaCode}
                    setTwoFaCode={setTwoFaCode}
                    onConfirm2fa={handleConfirm2fa}
                    onCopySecret={handleCopySecret}
                    loading={loading}
                />

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
    scrollContent: {
        padding: 20,
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
