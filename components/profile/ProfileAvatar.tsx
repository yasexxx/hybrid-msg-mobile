import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileAvatarProps {
    name: string;
    activeColors: any;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    name,
    activeColors,
}) => {
    return (
        <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: activeColors.primary + '15' }]}>
                <IconSymbol name="person.circle.fill" size={100} color={activeColors.primary} />
            </View>
            <Text style={[styles.userName, { color: activeColors.text }]}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatarSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});
