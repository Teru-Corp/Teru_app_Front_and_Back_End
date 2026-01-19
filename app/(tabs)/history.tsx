import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import client from "../../api/client";

// Import components correctly

export default function HistoryScreen() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        try {
            setLoading(true);
            const res = await client.get('/history');
            setHistory(res.data);
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const date = new Date(item.date).toLocaleDateString();
        const time = new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Determine color based on emotion (simple logic)
        let color = "#ddd";
        if (item.emotion === 'Joyful' || item.emotion === 'Energetic') color = "#FFD700"; // Gold
        if (item.emotion === 'Sad') color = "#87CEEB"; // Blue
        if (item.emotion === 'Calm') color = "#98FB98"; // Green
        if (item.emotion === 'Anxious') color = "#D8BFD8"; // Purple
        if (item.stress === 'overwhelmed') color = "#FF6347"; // Redish

        return (
            <View style={styleHistory.card}>
                <View style={[styleHistory.indicator, { backgroundColor: color }]} />
                <View style={styleHistory.info}>
                    <Text style={styleHistory.date}>{date} at {time}</Text>
                    <Text style={styleHistory.emotion}>{item.emotion || 'Unknown'}</Text>
                    <Text style={styleHistory.details}>Energy: {item.energy} | Stress: {item.stress}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styleHistory.container}>
            <ImageBackground
                source={require("../../assets/images/bg_welcome.png")}
                style={styleHistory.bg}
                resizeMode="cover"
            >
                <View style={styleHistory.header}>
                    <Pressable onPress={() => router.back()} style={styleHistory.backBtn}>
                        <Text style={styleHistory.backText}>‹ Back</Text>
                    </Pressable>
                    <Text style={styleHistory.title}>My History</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={<Text style={styleHistory.empty}>No entries yet.</Text>}
                    />
                )}
            </ImageBackground>
        </View>
    );
}

const styleHistory = StyleSheet.create({
    container: { flex: 1 },
    bg: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
    header: { marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 15, padding: 5 },
    backText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    title: { fontSize: 24, fontWeight: "bold", color: "white" },
    card: {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    indicator: {
        width: 10,
        height: 50,
        borderRadius: 5,
        marginRight: 15
    },
    info: { flex: 1 },
    date: { fontSize: 12, color: '#666' },
    emotion: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    details: { fontSize: 14, color: '#444' },
    empty: { textAlign: 'center', color: 'white', marginTop: 20, fontSize: 16 }
});
