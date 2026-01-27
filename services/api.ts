import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../constants/api-constants';

const BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const login = async (email: string, password: string, code?: string) => {
    const response = await api.post(ENDPOINTS.LOGIN, { email, password, code });
    return response.data;
};

export const register = async (name: string, email: string, password: string) => {
    const response = await api.post(ENDPOINTS.REGISTER, { name, email, password });
    return response.data;
};

export const verify2faLogin = async (code: string) => {
    const response = await api.post(ENDPOINTS.VERIFY_2FA_LOGIN, { code });
    return response.data;
};

export const getPendingSms = async () => {
    const response = await api.get(ENDPOINTS.PENDING_SMS);
    return response.data;
};

export const markSmsAsSent = async (id: number) => {
    const response = await api.patch(ENDPOINTS.UPDATE_STATUS(id));
    return response.data;
};

export const getStats = async () => {
    const response = await api.get(ENDPOINTS.SMS_STATS);
    return response.data;
};

export const getRecentActivity = async () => {
    const response = await api.get(ENDPOINTS.SMS_ACTIVITY);
    return response.data;
};

export const getAllActivity = async (page = 1) => {
    const response = await api.get(`${ENDPOINTS.ALL_ACTIVITY}?page=${page}`);
    return response.data;
};

export const updateEmail = async (email: string) => {
    const response = await api.post(ENDPOINTS.UPDATE_EMAIL, { email });
    return response.data;
};

export const updatePreferences = async (notifications_enabled: boolean) => {
    const response = await api.patch(ENDPOINTS.UPDATE_PREFERENCES, { notifications_enabled });
    return response.data;
};

export const sendPhoneOtp = async (phone_number: string) => {
    const response = await api.post(ENDPOINTS.SEND_PHONE_OTP, { phone_number });
    return response.data;
};

export const verifyPhoneOtp = async (otp_code: string) => {
    const response = await api.post(ENDPOINTS.VERIFY_PHONE_OTP, { otp_code });
    return response.data;
};

export const enable2fa = async () => {
    const response = await api.post(ENDPOINTS.ENABLE_2FA);
    return response.data;
};

export const confirm2fa = async (code: string) => {
    const response = await api.post(ENDPOINTS.CONFIRM_2FA, { code });
    return response.data;
};

export const disable2fa = async () => {
    const response = await api.post(ENDPOINTS.DISABLE_2FA);
    return response.data;
};

export const logout_api = async () => {
    const response = await api.post(ENDPOINTS.LOGOUT);
    return response.data;
};

export const sendHeartbeat = async (device_id: string, name?: string) => {
    const response = await api.post(ENDPOINTS.HEARTBEAT, { device_id, name });
    return response.data;
};

export const requestPasswordReset = async (email: string) => {
    const response = await api.post(ENDPOINTS.PASSWORD_EMAIL, { email });
    return response.data;
};

export const resetPassword = async (data: any) => {
    const response = await api.post(ENDPOINTS.PASSWORD_RESET, data);
    return response.data;
};

export default api;
