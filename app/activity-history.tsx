import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSettings } from '@/constants/SettingsContext';
import { Colors } from '@/constants/theme';
import { getAllActivity } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityHistoryScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme } = useSettings();
    const activeColors = Colors[theme];

    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchActivity = async (pageNum: number, isRefresh = false) => {
        try {
            if (!isRefresh && !hasMore) return;

            const response = await getAllActivity(pageNum);
            const newData = response.data;

            if (isRefresh) {
                setActivities(newData);
            } else {
                setActivities(prev => [...prev, ...newData]);
            }

            setHasMore(response.current_page < response.last_page);
            setPage(response.current_page);
        } catch (error) {
            console.error('Fetch activity error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchActivity(1, true);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchActivity(1, true);
    }, []);

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchActivity(page + 1);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.activityItem, { backgroundColor: activeColors.card }]}>
            <View style={[styles.activityIcon, { backgroundColor: item.status === 'sent' ? activeColors.success + '20' : activeColors.secondary }]}>
                <IconSymbol
                    name={item.status === 'sent' ? "paperplane.fill" : (item.status === 'failed' ? "exclamationmark.triangle.fill" : "clock.fill")}
                    size={20}
                    color={item.status === 'sent' ? activeColors.success : activeColors.primary}
                />
            </View>
            <View style={styles.activityDetails}>
                <Text style={[styles.activityTarget, { color: activeColors.text }]}>{item.phone_number}</Text>
                <Text style={[styles.activityTime, { color: activeColors.icon }]}>
                    {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'sent' ? activeColors.success : (item.status === 'failed' ? activeColors.accent : activeColors.primary) }]}>
                <Text style={styles.statusBadgeText}>{t(item.status)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: activeColors.secondary }]}
                >
                    <IconSymbol name="chevron.left" size={24} color={activeColors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: activeColors.text }]}>{t('recent_activity')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <FlatList
                data={activities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={activeColors.primary} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: activeColors.icon }]}>{t('no_activity_found')}</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    loading && page > 1 ? (
                        <ActivityIndicator size="small" color={activeColors.primary} style={{ marginVertical: 20 }} />
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    activityIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityDetails: {
        flex: 1,
    },
    activityTarget: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    statusBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
    }
});
