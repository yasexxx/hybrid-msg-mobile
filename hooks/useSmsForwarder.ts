import * as SecureStore from 'expo-secure-store';
import * as SMS from 'expo-sms';
import { useCallback, useEffect, useState } from 'react';
import { AUTH_KEYS } from '../constants/api-constants';
import { getPendingSms, markSmsAsSent, sendHeartbeat } from '../services/api';
import { getEcho } from '../services/EchoService';

export const useSmsForwarder = (isActive: boolean, deviceId?: string, deviceName?: string, intervalSeconds: number = 3) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkAndSendSms = useCallback(async () => {
        if (!isActive || isProcessing) return;

        // Check for token to handle logout
        const token = await SecureStore.getItemAsync(AUTH_KEYS.TOKEN);
        if (!token) {
            console.log('No auth token found, stopping forwarding');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Heartbeat moved to Echo connection

            const response = await getPendingSms();
            const pendingMessages = response.data;

            if (pendingMessages && pendingMessages.length > 0) {
                console.log(`Found ${pendingMessages.length} pending messages`);

                for (const msg of pendingMessages) {
                    const isAvailable = await SMS.isAvailableAsync();
                    if (isAvailable) {
                        try {
                            const { result } = await SMS.sendSMSAsync(
                                [msg.phone_number],
                                msg.message_body
                            );

                            if (result === 'sent') {
                                await markSmsAsSent(msg.id);
                                console.log(`Message ${msg.id} sent and status updated`);
                            } else {
                                console.log(`Message ${msg.id} result: ${result}`);
                            }
                        } catch (smsErr: any) {
                            console.error(`Error sending message ${msg.id}:`, smsErr);
                        }
                    } else {
                        setError('SMS is not available on this device');
                        break;
                    }
                }
            }
            setLastSync(new Date());
        } catch (err: any) {
            console.error('Polling error:', err);
            setError(err.message || 'Failed to fetch pending messages');
        } finally {
            setIsProcessing(false);
        }
    }, [isActive, isProcessing]);

    useEffect(() => {
        let isSubscribed = true;

        const setupWebSocket = async () => {
            if (!isActive || !deviceId) return;

            const echo = await getEcho();
            if (!echo || !isSubscribed) return;

            console.log('Setting up WebSocket for device:', deviceId);

            // Join presence channel - acts as real-time heartbeat
            echo.join(`devices.${deviceId}`)
                .here((users: any) => {
                    console.log('Presence: Already in channel', users);
                    // Update status immediately on connection
                    sendHeartbeat(deviceId, deviceName).catch(console.error);
                })
                .joining((user: any) => console.log('Presence: User joined', user))
                .leaving((user: any) => console.log('Presence: User left', user))
                .error((error: any) => console.error('Presence error:', error));

            // Listen for new SMS notifications
            echo.private(`devices.${deviceId}`)
                .listen('.sms.queued', () => {
                    console.log('WS: New SMS queued, checking...');
                    checkAndSendSms();
                });

            // Initial check
            checkAndSendSms();
        };

        setupWebSocket();

        return () => {
            isSubscribed = false;
            if (deviceId) {
                getEcho().then(echo => {
                    if (echo) {
                        echo.leave(`devices.${deviceId}`);
                        echo.leave(`presence-devices.${deviceId}`);
                    }
                });
            }
        };
    }, [isActive, deviceId, deviceName, checkAndSendSms]);

    return { isProcessing, lastSync, error, forceCheck: checkAndSendSms };
};
