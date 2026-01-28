import * as SecureStore from 'expo-secure-store';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { API_CONFIG, AUTH_KEYS } from '../constants/api-constants';

// Set Pusher on window for Echo
if (typeof (window as any) !== 'undefined') {
    (window as any).Pusher = Pusher;
}

let echoInstance: any = null;

export const getEcho = async () => {
    if (echoInstance) return echoInstance;

    const token = await SecureStore.getItemAsync(AUTH_KEYS.TOKEN);
    if (!token) {
        console.warn('Echo initialization failed: No auth token found');
        return null;
    }

    try {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: API_CONFIG.REVERB_APP_KEY,
            wsHost: API_CONFIG.REVERB_HOST,
            wsPort: API_CONFIG.REVERB_PORT,
            wssPort: API_CONFIG.REVERB_PORT,
            forceTLS: API_CONFIG.REVERB_SCHEME === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${API_CONFIG.BASE_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
        });
        
        console.log('Echo initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Echo:', error);
        return null;
    }

    return echoInstance;
};

export const disconnectEcho = () => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        console.log('Echo disconnected');
    }
};
