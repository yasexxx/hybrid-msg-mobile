import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
    onBack: () => void;
    activeColors: any;
    title: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    onBack,
    activeColors,
    title,
}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <IconSymbol name="chevron.left" size={28} color={activeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: activeColors.text }]}>{title}</Text>
            <View style={{ width: 40 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
