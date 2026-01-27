export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api', // Update to your machine IP for real device testing
    TIMEOUT: 10000,
};

export const ENDPOINTS = {
    LOGIN: '/login',
    PENDING_SMS: '/sms/pending',
    UPDATE_STATUS: (id: number) => `/sms/update-status/${id}`,
    SMS_STATS: '/sms/stats',
    SMS_ACTIVITY: '/sms/activity',
    ALL_ACTIVITY: '/sms/activity-all',
    UPDATE_EMAIL: '/profile/email',
    UPDATE_PREFERENCES: '/profile/preferences',
    SEND_PHONE_OTP: '/profile/phone/send-otp',
    VERIFY_PHONE_OTP: '/profile/phone/verify-otp',
    ENABLE_2FA: '/profile/2fa/enable',
    CONFIRM_2FA: '/profile/2fa/confirm',
    DISABLE_2FA: '/profile/2fa/disable',
    LOGOUT: '/logout',
};

export const AUTH_KEYS = {
    TOKEN: 'userToken',
    THEME: 'userTheme',
    LANGUAGE: 'userLanguage',
};

export const SMS_STATUS = {
    PENDING: 'pending',
    SENT: 'sent',
    FAILED: 'failed',
};
