import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import client from "../../api/client";
import TeruIcon from "../../assets/icons/teru_icon_1.svg";

// Nav Icons
import ChatIcon from "../../assets/icons/chat.svg";
import HomeIcon from "../../assets/icons/home.svg";
import MoodIcon from "../../assets/icons/mood.svg";
import GardenIcon from "../../assets/icons/weather.svg";

const { width, height } = Dimensions.get("window");

const MOOD_COLORS: any = {
    Joyful: '#FFD700',
    Energetic: '#FF4500',
    Calm: '#98FB98',
    Anxious: '#ADD8E6',
    Sad: '#4682B4'
};

const Mountain = ({ style }: { style: any }) => (
    <View style={[styles.mountain, style]} />
);

export default function CommunityGarden() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            const res = await client.get('/community-weather');
            setData(res.data);
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        } catch (e) {
            console.error("Failed to fetch community garden", e);
            setLoading(false);
        }
    };

    const getGradientColors = (): [string, string, ...string[]] => {
        if (!data) return ['#E99F95', '#F2E8C0', '#A6D8C6'];
        switch (data.condition) {
            case "Sunny": return ['#FF9A9E', '#FECFEF', '#F6D365'];
            case "Rainy": return ['#BDC3C7', '#2C3E50'];
            case "Stormy": return ['#1F1C2C', '#928DAB'];
            default: return ['#E99F95', '#F2E8C0', '#A6D8C6'];
        }
    };

    const renderGardenParticles = () => {
        if (!data) return null;
        const particles: React.ReactNode[] = [];

        Object.keys(data.distribution).forEach((mood) => {
            const count = data.distribution[mood];
            for (let i = 0; i < Math.min(count, 15); i++) {
                particles.push(
                    <Animated.View
                        key={`${mood}-${i}`}
                        style={[
                            styles.particle,
                            {
                                backgroundColor: MOOD_COLORS[mood] || '#fff',
                                left: Math.random() * (width - 40) + 20,
                                top: Math.random() * 200 + 40,
                                opacity: 0.8,
                            }
                        ]}
                    />
                );
            }
        });
        return particles;
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={getGradientColors()}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* Landscape - Mountains */}
            <View style={styles.landscapeContainer}>
                <Mountain style={styles.mountainBack} />
                <Mountain style={styles.mountainFront} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>The Community Garden</Text>
                <Text style={styles.subtitle}>Together, we are feeling {data?.condition.toLowerCase()}</Text>

                <View style={styles.canvas}>
                    {renderGardenParticles()}
                </View>

                {/* Community Visualization Grid */}
                <View style={styles.gardenGrid}>
                    <Text style={styles.statsText}>{data?.count} gardeners check-in today</Text>

                    <View style={styles.teruCircle}>
                        <TeruIcon width={100} height={100} />
                        <Text style={styles.tempText}>{data?.temperature}°</Text>
                    </View>

                    <View style={styles.distributionContainer}>
                        {Object.keys(data?.distribution || {}).map((emo) => (
                            <View key={emo} style={styles.emoRow}>
                                <Text style={styles.emoLabel}>{emo}</Text>
                                <View style={styles.barContainer}>
                                    <View style={[styles.bar, { width: `${data.count > 0 ? (data.distribution[emo] / data.count) * 100 : 0}%`, backgroundColor: MOOD_COLORS[emo] || '#fff' }]} />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <Pressable
                    style={styles.actionButton}
                    onPress={() => router.push("/(tabs)/chat")}
                >
                    <Text style={styles.actionButtonText}>Talk to the Community</Text>
                </Pressable>
            </Animated.View>

            {/* Bottom Navigation */}
            <View style={styles.navBar}>
                <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")} hitSlop={15}>
                    <HomeIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/mood_check_in/checkin")} hitSlop={15}>
                    <MoodIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => { }} hitSlop={15}>
                    <GardenIcon width={28} height={28} fill="rgba(255,255,255,1)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/chat")} hitSlop={15}>
                    <ChatIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E99F95" },
    background: { ...StyleSheet.absoluteFillObject },
    canvas: {
        height: 150,
        width: '100%',
        marginTop: 20,
    },
    particle: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flex: 1,
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 8,
        textAlign: 'center',
    },
    gardenGrid: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        padding: 24,
    },
    statsText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
    },
    teruCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    tempText: {
        position: 'absolute',
        bottom: 10,
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
    },
    distributionContainer: {
        width: '100%',
    },
    emoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    emoLabel: {
        width: 80,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    barContainer: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    actionButton: {
        marginTop: 30,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    actionButtonText: {
        color: '#E99F95',
        fontWeight: '700',
        fontSize: 16,
    },
    navBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        zIndex: 100,
    },
    // Landscape
    landscapeContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        justifyContent: 'flex-end',
    },
    mountain: {
        position: 'absolute',
        bottom: 0,
        width: width * 1.5,
        height: 300,
        backgroundColor: 'rgba(255,255,255,0.2)',
        transform: [{ rotate: '45deg' }],
        borderRadius: 50,
    },
    mountainBack: {
        left: -100,
        bottom: -150,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    mountainFront: {
        right: -50,
        bottom: -180,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
});
