export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api', // Update to your machine IP for real device testing
    TIMEOUT: 10000,
    REVERB_APP_KEY: 'irnttpignnufnqy04gfz',
    REVERB_HOST: 'localhost',
    REVERB_PORT: 8080,
    REVERB_SCHEME: 'http',
};

export const ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_2FA_LOGIN: '/login/verify-2fa',
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
    HEARTBEAT: '/device/heartbeat',
    PASSWORD_EMAIL: '/password/email',
    PASSWORD_RESET: '/password/reset',
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
