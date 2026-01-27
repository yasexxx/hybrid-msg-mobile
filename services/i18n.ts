import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../lang/en.json';
import ja from '../lang/ja.json';
import tl from '../lang/tl.json';
import vi from '../lang/vi.json';
import zh from '../lang/zh.json';

const resources = {
    en: { translation: en },
    ja: { translation: ja },
    tl: { translation: tl },
    vi: { translation: vi },
    zh: { translation: zh },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already safe from XSS
        },
    });

export default i18n;
