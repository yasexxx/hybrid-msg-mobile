import { useSettings } from '@/constants/SettingsContext';

export function useColorScheme() {
    const { theme } = useSettings();
    return theme;
}
