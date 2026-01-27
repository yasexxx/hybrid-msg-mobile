import * as SMS from 'expo-sms';
import { useCallback, useEffect, useState } from 'react';
import { getPendingSms, markSmsAsSent } from '../services/api';

export const useSmsForwarder = (isActive: boolean, intervalSeconds: number = 10) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkAndSendSms = useCallback(async () => {
        if (!isActive || isProcessing) return;

        setIsProcessing(true);
        setError(null);

        try {
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
        let interval: NodeJS.Timeout;

        if (isActive) {
            // Initial check
            checkAndSendSms();

            interval = setInterval(() => {
                checkAndSendSms();
            }, intervalSeconds * 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, intervalSeconds, checkAndSendSms]);

    return { isProcessing, lastSync, error, forceCheck: checkAndSendSms };
};
