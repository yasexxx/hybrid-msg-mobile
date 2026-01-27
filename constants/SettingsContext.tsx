import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../services/i18n';
import { AUTH_KEYS } from './api-constants';

type ThemeMode = 'light' | 'dark';

interface SettingsContextType {
    theme: ThemeMode;
    language: string;
    toggleTheme: () => void;
    setLanguage: (lang: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [language, setLanguageState] = useState(i18n.language || 'en');

    useEffect(() => {
        const loadSettings = async () => {
            const storedTheme = await SecureStore.getItemAsync(AUTH_KEYS.THEME);
            if (storedTheme === 'light' || storedTheme === 'dark') {
                setTheme(storedTheme);
            }

            const storedLang = await SecureStore.getItemAsync('app_language');
            if (storedLang) {
                setLanguageState(storedLang);
                i18n.changeLanguage(storedLang);
            }
        };
        loadSettings();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await SecureStore.setItemAsync(AUTH_KEYS.THEME, newTheme);
    };

    const setLanguage = async (lang: string) => {
        setLanguageState(lang);
        i18n.changeLanguage(lang);
        await SecureStore.setItemAsync('app_language', lang);
    };

    return (
        <SettingsContext.Provider value={{ theme, language, toggleTheme, setLanguage }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
