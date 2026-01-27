import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedTextInput } from '../ui/text-input';

interface PhoneVerificationSectionProps {
    phoneNumber: string;
    isVerified: boolean;
    onSendOtp: (phone: string) => Promise<void>;
    onVerifyOtp: (code: string) => Promise<void>;
    activeColors: any;
}

export const PhoneVerificationSection: React.FC<PhoneVerificationSectionProps> = ({
    phoneNumber,
    isVerified,
    onSendOtp,
    onVerifyOtp,
    activeColors
}) => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState(phoneNumber);
    const [otpMode, setOtpMode] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (phoneNumber) {
            setPhone(phoneNumber);
        }
    }, [phoneNumber]);

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert(t('error'), t('invalid_phone'));
            return;
        }
        setLoading(true);
        try {
            await onSendOtp(phone);
            setOtpMode(true);
        } catch (err: any) {
            Alert.alert(t('error'), err.response?.data?.message || t('action_failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (otpCode.length !== 6) return;
        setLoading(true);
        try {
            await onVerifyOtp(otpCode);
            setOtpMode(false);
            Alert.alert(t('success'), t('phone_verified'));
        } catch (err: any) {
            Alert.alert(t('error'), err.response?.data?.message || t('invalid_code'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: activeColors.text }]}>{t('phone_verification')}</Text>
                {isVerified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: '#4CAF5020' }]}>
                        <IconSymbol name="checkmark.circle.fill" size={14} color="#4CAF50" />
                        <Text style={[styles.verifiedText, { color: '#4CAF50' }]}>{t('verified')}</Text>
                    </View>
                )}
            </View>

            {!otpMode ? (
                <View style={styles.inputRow}>
                    <ThemedTextInput
                        containerStyle={{ flex: 1 }}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+1 234 567 890"
                        keyboardType="phone-pad"
                        editable={!isVerified}
                    />
                    {!isVerified && (
                        <TouchableOpacity
                            onPress={handleSendOtp}
                            disabled={loading}
                            style={[styles.actionButton, { backgroundColor: activeColors.primary }]}
                        >
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('verify_now')}</Text>}
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={styles.otpContainer}>
                    <Text style={[styles.otpLabel, { color: activeColors.icon }]}>
                        {t('otp_sent_to', { phone })}
                    </Text>
                    <ThemedTextInput
                        style={{ textAlign: 'center', fontSize: 24, letterSpacing: 10 }}
                        value={otpCode}
                        onChangeText={setOtpCode}
                        placeholder="000000"
                        maxLength={6}
                        keyboardType="number-pad"
                    />
                    <TouchableOpacity
                        onPress={handleVerify}
                        disabled={loading || otpCode.length !== 6}
                        style={[styles.primaryButton, { backgroundColor: activeColors.primary }]}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('verify')}</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOtpMode(false)} style={styles.cancelButton}>
                        <Text style={{ color: activeColors.icon }}>{t('cancel')}</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: '700',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 15,
    },
    actionButton: {
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    otpContainer: {
        alignItems: 'center',
    },
    otpLabel: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    otpInput: {
        width: '100%',
        height: 60,
        borderWidth: 2,
        borderRadius: 16,
        textAlign: 'center',
        fontSize: 24,
        letterSpacing: 10,
        marginBottom: 20,
    },
    primaryButton: {
        width: '100%',
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        marginTop: 15,
    }
});
