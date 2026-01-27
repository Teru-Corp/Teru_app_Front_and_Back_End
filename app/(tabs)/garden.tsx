import { useCommunityWeather } from "@/hooks/useCommunityWeather";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
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

// ... (SunRay, Petal, EtherealBloom, MessageCloud, RainDrop, MistLayer components remain the same or slightly adjusted if needed)
// I'll keep them as they are for now as they match the aesthetic well.

const SunRay = ({ color }: { color: string }) => {
    const pulseAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <Animated.View
            style={[
                styles.sunRay,
                {
                    backgroundColor: color,
                    transform: [{ rotate: '-30deg' }, { scaleX: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
                    opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.2] })
                }
            ]}
        />
    );
};

const Petal = ({ color, delay }: { color: string; delay: number }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const startX = useRef(Math.random() * width).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: 6000 + Math.random() * 4000,
                delay,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, height + 50],
    });

    const translateX = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 40, 0],
    });

    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
    });

    return (
        <Animated.View
            style={[
                styles.petal,
                {
                    backgroundColor: color,
                    left: startX,
                    transform: [{ translateY }, { translateX }, { rotate }],
                    opacity: anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.6, 0.6, 0] }),
                },
            ]}
        />
    );
};

const EtherealBloom = ({ color, x, scale }: { color: string; x: number; scale: number }) => {
    const sway = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(sway, { toValue: 1, duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(sway, { toValue: -1, duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={[styles.bloomWrapper, { left: x, transform: [{ scale }] }]}>
            <Animated.View style={[styles.bloomHead, { backgroundColor: color, transform: [{ rotate: sway.interpolate({ inputRange: [-1, 1], outputRange: ['-20deg', '20deg'] }) }] }]}>
                <View style={styles.bloomCenter} />
            </Animated.View>
            <View style={styles.bloomStem} />
        </View>
    );
};

const MessageCloud = ({ text }: { text: string }) => {
    const drift = useRef(new Animated.Value(0)).current;
    const startX = useRef(Math.random() * (width - 150)).current;
    const startY = useRef(height * 0.15 + Math.random() * (height * 0.35)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(drift, { toValue: 1, duration: 15000 + Math.random() * 10000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(drift, { toValue: 0, duration: 15000 + Math.random() * 10000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.messageCloudContainer,
                {
                    left: startX,
                    top: startY,
                    transform: [{ translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] }) }, { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) }],
                    opacity: drift.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.9, 0.9, 0] }),
                },
            ]}
        >
            <View style={styles.cloudBubbleMain} />
            <View style={[styles.cloudBubbleSec, { left: -15, bottom: -5, width: 50, height: 50 }]} />
            <View style={[styles.cloudBubbleSec, { right: -10, top: -5, width: 40, height: 40 }]} />

            <Text style={styles.messageText}>{text}</Text>
        </Animated.View>
    );
};

const RainDrop = ({ delay }: { delay: number }) => {
    const fall = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(Animated.timing(fall, { toValue: 1, duration: 1000 + Math.random() * 500, delay, easing: Easing.linear, useNativeDriver: true })).start();
    }, []);
    return (
        <Animated.View style={[styles.rain, { left: Math.random() * width, transform: [{ translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [-100, height] }) }] }]} />
    );
};

const MistLayer = ({ color, duration }: { color: string; duration: number }) => {
    const move = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(Animated.timing(move, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })).start();
    }, []);
    return (
        <Animated.View style={[styles.mist, { backgroundColor: color, transform: [{ translateX: move.interpolate({ inputRange: [0, 1], outputRange: [-width, width] }) }] }]} />
    );
};

export default function CommunityGarden() {
    const router = useRouter();
    const [msgLoading, setMsgLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const { data: communityData, loading: commLoading } = useCommunityWeather();
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        fetchMessages();
        Animated.timing(fadeAnim, { toValue: 1, duration: 2500, useNativeDriver: true }).start();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await client.get('/messages');
            setMessages(res.data.slice(0, 10));
            setMsgLoading(false);
        } catch (e) {
            console.error("Garden messages error", e);
            setMsgLoading(false);
        }
    };

    const renderLayers = () => {
        if (!communityData) return null;
        const els = [];
        const { condition } = communityData;

        if (condition === "Sunny") {
            els.push(<SunRay key="ray" color="#fff" />);
        } else {
            els.push(<MistLayer key="mist1" color="rgba(255,255,255,0.05)" duration={40000} />);
            els.push(<MistLayer key="mist2" color="rgba(0,0,0,0.05)" duration={60000} />);
        }

        if (condition === "Rainy" || condition === "Stormy") {
            for (let i = 0; i < 30; i++) els.push(<RainDrop key={`rain-${i}`} delay={i * 100} />);
        }

        const density = Math.min((communityData.count || 0) * 2, 40);
        for (let i = 0; i < density; i++) {
            const mood = Object.keys(MOOD_COLORS)[i % 5];
            els.push(<Petal key={`p-${i}`} color={MOOD_COLORS[mood]} delay={i * 200} />);
        }

        messages.forEach((m, idx) => {
            if (m.texte) els.push(<MessageCloud key={`msg-${idx}`} text={m.texte} />);
        });

        return els;
    };

    if (commLoading && !communityData) return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#fff" /></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={communityData?.colors || ['#1a1a2e', '#16213e', '#0f3460']} style={styles.background} />

            <View style={StyleSheet.absoluteFill}>
                {renderLayers()}
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>The Garden</Text>
                    <View style={styles.tempChip}>
                        <Text style={styles.tempText}>{communityData?.temperature}°C</Text>
                        <View style={styles.statusIndicator} />
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                <View style={styles.minimalStats}>
                    <TeruIcon width={40} height={40} opacity={0.6} />
                    <Text style={styles.statsDesc}>
                        {communityData?.teruFeeling || `A collective mood of ${communityData?.condition.toLowerCase()}`}
                    </Text>
                    <View style={styles.presenceDots}>
                        {[...Array(Math.min(communityData?.count || 0, 5))].map((_, i) => (
                            <View key={i} style={styles.dot} />
                        ))}
                        {(communityData?.count || 0) > 5 && <Text style={styles.plusText}>+</Text>}
                    </View>
                </View>

                <Pressable style={styles.actionBtn} onPress={() => router.push("/(tabs)/chat")}>
                    <Text style={styles.actionText}>Enter the conversation</Text>
                </Pressable>
            </Animated.View>

            <View style={styles.navWrap}>
                <View style={styles.glassNav}>
                    <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")}><HomeIcon width={22} height={22} fill="#fff" opacity={0.5} /></Pressable>
                    <Pressable onPress={() => router.replace("/(tabs)/mood_check_in/checkin")}><MoodIcon width={22} height={22} fill="#fff" opacity={0.5} /></Pressable>
                    <Pressable><GardenIcon width={22} height={22} fill="#fff" /></Pressable>
                    <Pressable onPress={() => router.replace("/(tabs)/chat")}><ChatIcon width={22} height={22} fill="#fff" opacity={0.5} /></Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 120 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    tempChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    tempText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    statusIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#98FB98', marginLeft: 10, shadowColor: '#fff', shadowRadius: 5, shadowOpacity: 0.5 },

    sunRay: { position: 'absolute', top: -height * 0.2, left: -width * 0.3, width: 250, height: height * 2, borderRadius: 100 },
    petal: { position: 'absolute', width: 6, height: 10, borderRadius: 3 },
    bloomWrapper: { position: 'absolute', alignItems: 'center', width: 20, bottom: 0 },
    bloomHead: { width: 14, height: 14, borderRadius: 7, zIndex: 2, shadowColor: '#fff', shadowRadius: 10, shadowOpacity: 0.3 },
    bloomCenter: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
    bloomStem: { width: 1, height: 120, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: -2 },

    rain: { position: 'absolute', width: 1.5, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
    mist: { position: 'absolute', width: width * 3, height: 400, top: height * 0.2, borderRadius: 200, opacity: 0.2 },

    messageCloudContainer: { position: 'absolute', paddingVertical: 12, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', minWidth: 100 },
    cloudBubbleMain: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    cloudBubbleSec: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    messageText: { color: '#fff', fontSize: 13, fontWeight: '700', fontStyle: 'italic', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 3, textAlign: 'center' },

    minimalStats: { alignItems: 'center', marginBottom: 30 },
    statsDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600', marginVertical: 10, textAlign: 'center', paddingHorizontal: 20 },
    presenceDots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff', opacity: 0.4 },
    plusText: { color: '#fff', fontSize: 12, opacity: 0.6 },

    actionBtn: { backgroundColor: '#fff', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
    actionText: { color: '#1a1a2e', fontSize: 16, fontWeight: '800' },

    navWrap: { position: 'absolute', bottom: 35, left: 0, right: 0, alignItems: 'center' },
    glassNav: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)', paddingVertical: 15, paddingHorizontal: 35, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 40 },
});

