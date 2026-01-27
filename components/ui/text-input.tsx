import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface ThemedTextInputProps extends TextInputProps {
    icon?: string;
    error?: string | null;
    label?: string;
    containerStyle?: any;
}

export function ThemedTextInput({ icon, error, label, style, containerStyle, ...props }: ThemedTextInputProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const activeColors = Colors[colorScheme];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: activeColors.text }]}>{label}</Text>}
            <View 
                style={[
                    styles.inputContainer, 
                    { 
                        backgroundColor: activeColors.card, 
                        borderColor: error ? '#FF6C52' : activeColors.inputBorder 
                    }
                ]}
            >
                {icon && (
                    <IconSymbol 
                        name={icon as any} 
                        size={20} 
                        color={error ? '#FF6C52' : activeColors.icon} 
                        style={styles.inputIcon} 
                    />
                )}
                <TextInput
                    style={[styles.input, { color: activeColors.text }, style]}
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1.5,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    errorText: {
        color: '#FF6C52',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 4,
        fontWeight: '500',
    },
});
