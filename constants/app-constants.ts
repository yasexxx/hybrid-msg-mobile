export const APP_CONFIG = {
    POLLING_INTERVAL: 3000,
    ANIMATION_DURATION: 300,
    DEFAULT_OPACITY: 0.7,
    PULSE_OPACITY: '20',
};

export const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ja', label: 'Japanese', native: '日本語' },
    { code: 'tl', label: 'Filipino', native: 'Tagalog' },
    { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
    { code: 'zh', label: 'Chinese', native: '中文' },
];

export const SUBSCRIPTION_PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: '/month',
        features: [
            'Basic SMS Forwarding',
            'Up to 100 messages/mo',
            'Single destination',
            'Email support'
        ],
        color: '#687076',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$9.99',
        period: '/month',
        features: [
            'Unlimited Forwarding',
            'Voice to Text',
            'Multiple destinations',
            'Priority support',
            'Advanced Rules'
        ],
        color: '#4E6AF3', // activeColors.primary
        popular: true,
    },
    {
        id: 'business',
        name: 'Business',
        price: '$29.99',
        period: '/month',
        features: [
            'Dedicated numbers',
            'API Access',
            'Team Management',
            'Custom Integrations',
            '24/7 Support'
        ],
        color: '#FF6C52',
    }
];
