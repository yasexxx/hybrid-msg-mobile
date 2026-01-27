import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedTextInput } from '../ui/text-input';

interface TwoFactorSetupProps {
    t: (key: string) => string;
    activeColors: any;
    is2faEnabled: boolean;
    onToggle2fa: () => void;
    show2faSetup: boolean;
    setShow2faSetup: (show: boolean) => void;
    qrUri: string;
    twoFaSecret: string;
    twoFaCode: string;
    setTwoFaCode: (code: string) => void;
    onConfirm2fa: () => void;
    onCopySecret: () => void;
    loading: boolean;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
    t,
    activeColors,
    is2faEnabled,
    onToggle2fa,
    show2faSetup,
    setShow2faSetup,
    qrUri,
    twoFaSecret,
    twoFaCode,
    setTwoFaCode,
    onConfirm2fa,
    onCopySecret,
    loading,
}) => {
    return (
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
                    onValueChange={onToggle2fa}
                    trackColor={{ false: '#767577', true: activeColors.primary }}
                />
            </View>

            {show2faSetup && (
                <View style={styles.setupContainer}>
                    <View style={styles.divider} />
                    <Text style={[styles.setupTitle, { color: activeColors.text }]}>{t('setup_2fa')}</Text>
                    <Text style={[styles.setupDesc, { color: activeColors.icon }]}>{t('setup_2fa_desc')}</Text>

                    {qrUri ? (
                        <View style={styles.qrContainer}>
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={qrUri}
                                    size={200}
                                    color={activeColors.text}
                                    backgroundColor={activeColors.card}
                                />
                            </View>
                            <View style={styles.secretTextContainer}>
                                <Text style={[styles.secretText, { color: activeColors.primary }]}>{twoFaSecret}</Text>
                                <TouchableOpacity 
                                    onPress={onCopySecret}
                                    style={[styles.copyButton, { backgroundColor: activeColors.primary + '15' }]}
                                >
                                    <IconSymbol name="doc.on.doc.fill" size={16} color={activeColors.primary} />
                                    <Text style={[styles.copyButtonText, { color: activeColors.primary }]}>{t('copy_code')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.secretLabel, { color: activeColors.icon }]}>{t('manual_code_desc')}</Text>
                        </View>
                    ) : null}

                    <ThemedTextInput
                        style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
                        value={twoFaCode}
                        onChangeText={setTwoFaCode}
                        placeholder="000000"
                        maxLength={6}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity
                        onPress={onConfirm2fa}
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
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
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
    qrContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    qrWrapper: {
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    secretTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    secretText: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    copyButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    secretLabel: {
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.7,
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
    cancelButton: {
        alignItems: 'center',
        marginTop: 15,
    },
});
