import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import client from "../../api/client";

const { width } = Dimensions.get("window");

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

    // --- DATA PREPARATION FOR CHARTS ---

    // 1. Line Chart: Last 6 Energy Levels (reversed to show oldest to newest left-to-right)
    const recentEntries = history.slice(0, 6).reverse();
    const energyData = {
        labels: recentEntries.map((item) => {
            const date = new Date(item.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }),
        datasets: [
            {
                data: recentEntries.map((item) => item.energy * 10), // Scale 0-1 to 0-10
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White line
                strokeWidth: 3
            }
        ],
        legend: ["Energy Level"]
    };

    // 2. Pie Chart: Mood Distribution
    const moodCounts: any = {};
    history.forEach((h) => {
        const mood = h.emotion || 'Neutral';
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    const pieColors: any = {
        Joyful: '#FFD700',
        Energetic: '#FF8C00',
        Calm: '#98FB98',
        Anxious: '#D8BFD8',
        Sad: '#87CEEB',
        Neutral: '#D3D3D3'
    };

    const moodData = Object.keys(moodCounts).map((key) => ({
        name: key,
        population: moodCounts[key],
        color: pieColors[key] || '#ccc',
        legendFontColor: "#fff",
        legendFontSize: 12
    }));


    return (
        <View style={styleHistory.container}>
            <ImageBackground
                source={require("../../assets/images/bg_welcome.png")}
                style={styleHistory.bg}
                resizeMode="cover"
            >
                {/* Header */}
                <View style={styleHistory.header}>
                    <Pressable onPress={() => router.back()} style={styleHistory.backBtn}>
                        <Text style={styleHistory.backText}>‹ Back</Text>
                    </Pressable>
                    <Text style={styleHistory.title}>My Patterns</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                        {/* Section 1: Energy Trend */}
                        <Text style={styleHistory.sectionTitle}>Energy Trend</Text>
                        <View style={styleHistory.chartCard}>
                            {history.length > 1 ? (
                                <LineChart
                                    data={energyData}
                                    width={width - 60} // from react-native
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: "transparent",
                                        backgroundGradientFrom: "transparent",
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientTo: "transparent",
                                        backgroundGradientToOpacity: 0,
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: { borderRadius: 16 },
                                        propsForDots: {
                                            r: "5",
                                            strokeWidth: "2",
                                            stroke: "#ffa726"
                                        }
                                    }}
                                    bezier
                                    style={{ marginVertical: 8, borderRadius: 16 }}
                                />
                            ) : (
                                <Text style={styleHistory.noDataText}>Not enough data yet.</Text>
                            )}
                        </View>

                        {/* Section 2: Emotional Balance */}
                        <Text style={styleHistory.sectionTitle}>Emotional Distribution</Text>
                        <View style={styleHistory.chartCard}>
                            {history.length > 0 ? (
                                <PieChart
                                    data={moodData}
                                    width={width - 60}
                                    height={200}
                                    chartConfig={{
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    }}
                                    accessor={"population"}
                                    backgroundColor={"transparent"}
                                    paddingLeft={"15"}
                                    center={[10, 0]}
                                    absolute
                                />
                            ) : (
                                <Text style={styleHistory.noDataText}>No moods recorded.</Text>
                            )}
                        </View>

                        {/* Section 3: Recent Log Summary */}
                        <Text style={styleHistory.sectionTitle}>Recent Logs</Text>
                        <View style={styleHistory.listContainer}>
                            {history.slice(0, 5).map((item, index) => (
                                <View key={index} style={styleHistory.listItem}>
                                    <View style={[styleHistory.dot, { backgroundColor: pieColors[item.emotion] || '#ccc' }]} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styleHistory.listDate}>{new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                        <Text style={styleHistory.listFeeling}>{item.emotion} & {item.stress}</Text>
                                    </View>
                                    <Text style={styleHistory.listEnergy}>⚡ {Math.round(item.energy * 10)}/10</Text>
                                </View>
                            ))}
                        </View>

                    </ScrollView>
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
    title: { fontSize: 28, fontWeight: "900", color: "white" },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginTop: 20,
        marginBottom: 10,
        opacity: 0.9
    },

    chartCard: {
        backgroundColor: "transparent",
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 150
    },

    noDataText: {
        color: 'rgba(255,255,255,0.6)',
        fontStyle: 'italic'
    },

    listContainer: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: 15,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 10
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 15
    },
    listDate: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 2
    },
    listFeeling: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15
    },
    listEnergy: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    }
});
