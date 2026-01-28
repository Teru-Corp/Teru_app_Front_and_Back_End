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
import TeruIcon from "../../assets/icons/icon_teru_face.svg";
import LivingLightning from "../../components/living_elements/LivingLightning";
import LivingSun from "../../components/living_elements/LivingSun";
import OrganicParticles from "../../components/living_elements/OrganicParticles";

// Nav Icons
import ChatIcon from "../../assets/icons/chat_icon_bis.svg";
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

const MessageCloud = ({ text, index, total }: { text: string; index: number; total: number }) => {
    const drift = useRef(new Animated.Value(0)).current;

    // Slot System: Divide the screen vertically
    // Use the middle 60% of the screen (from 20% to 80%)
    // Slot System: Divide the bottom area of the screen
    // Target the lower third, avoiding the absolute bottom (nav/button)
    const safeTop = height * 0.55; // Start below the middle
    const safeHeight = height * 0.25; // Use 25% of height
    const slotSize = safeHeight / 5; // Fixed 5 slots

    // Calculate precise Y based on index to prevent overlap
    const startY = safeTop + (index * slotSize) + (Math.random() * (slotSize * 0.5));

    const startX = useRef(Math.random() * (width - 150)).current;

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
                    transform: [{ translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) }, { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-5, 5] }) }],
                    opacity: drift.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.9, 0.9, 0] }),
                    zIndex: 100 + index
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
            setMessages(res.data.slice(0, 5));
            setMsgLoading(false);
        } catch (e) {
            console.error("Garden messages error", e);
            setMsgLoading(false);
        }
    };

    const renderLayers = () => {
        if (!communityData) return null;
        const els = [];
        const { condition, teruFeeling } = communityData;

        // Base Atmosphere (always present, scales with hooks)
        const density = Math.min((communityData.count || 0) * 2, 40);

        // --- 1. SKY / SUN ---
        if (condition === "Sunny" || teruFeeling === "Joyful" || teruFeeling === "Energetic") {
            // Living Sun (Centered as requested)
            els.push(
                <View key="sun" style={{ position: 'absolute', top: (height - (width * 0.8)) / 2, left: (width - width * 0.8) / 2, zIndex: -1 }}>
                    <LivingSun
                        size={width * 0.8}
                        color={teruFeeling === "Energetic" ? "#FF4500" : "#FFD700"}
                    />
                </View>
            );
        }

        // --- 2. STORM / LIGHTNING ---
        if (condition === "Stormy" || teruFeeling === "Angry" || teruFeeling === "Anxious") {
            // Lightning strikes randomly
            els.push(
                <LivingLightning
                    key="lightning"
                    intensity={teruFeeling === "Angry" ? 1 : 0.6}
                    color={teruFeeling === "Anxious" ? "#E0FFFF" : "#FFD700"} // Cold blue or Shock yellow
                />
            );
            // Stormy Rain (Reduced density)
            els.push(<OrganicParticles key="storm-rain" type="Rain" count={100} color="rgba(255, 255, 255, 0.5)" />);
        }

        // --- 3. PARTICLES / ORGANIC LIFE ---
        if (teruFeeling === "Sad" || condition === "Rainy") {
            // Rain / Tears
            els.push(<OrganicParticles key="rain" type="Rain" count={80} color="rgba(255, 255, 255, 0.4)" />);
        } else if (teruFeeling === "Calm") {
            // Fireflies (Reduced)
            els.push(<OrganicParticles key="firefly" type="Firefly" count={20} color="#90EE90" />);

            // Living Field of Blooms
            els.push(<EtherealBloom key="bloom1" color="#4CAF50" x={width * 0.1} scale={0.6} />);
            els.push(<EtherealBloom key="bloom2" color="#8BC34A" x={width * 0.3} scale={0.8} />);
            els.push(<EtherealBloom key="bloom3" color="#2E7D32" x={width * 0.6} scale={0.7} />);
            els.push(<EtherealBloom key="bloom4" color="#689F38" x={width * 0.85} scale={0.5} />);

            // Drifting Organic Petals (Greenish/Leaf-like)
            for (let i = 0; i < 4; i++) {
                els.push(<Petal key={`calm-petal-${i}`} color="rgba(144, 238, 144, 0.4)" delay={i * 1800} />);
            }

            // Low-lying Mist
            els.push(<MistLayer key="mist1" color="rgba(255, 255, 255, 0.05)" duration={25000} />);
            els.push(<MistLayer key="mist2" color="rgba(144, 238, 144, 0.03)" duration={35000} />);
        } else if (teruFeeling === "Joyful" || teruFeeling === "Energetic" || condition === "Sunny") {
            // Pollen / Petals (Reduced)
            els.push(<OrganicParticles key="pollen" type="Pollen" count={5} color="#FFFACD" />);
            // Joyful Sparks (White/Gold Fireflies) - Much more subtle
            els.push(<OrganicParticles key="joy-sparks" type="Firefly" count={25} color="#FFFFFF" />);
        } else if (teruFeeling === "Default") {
            // Gentle atmosphere
            els.push(<OrganicParticles key="firefly-def" type="Firefly" count={8} color="#FFF" />);
        }



        return els;
    };

    if (commLoading && !communityData) return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#fff" /></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={(communityData?.colors as any) || ['#1a1a2e', '#16213e', '#0f3460']} style={styles.background} />

            <View style={StyleSheet.absoluteFill}>
                {renderLayers()}
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>The Garden</Text>
                        <Text style={styles.subtitle}>Welcome to the emotional weather of the community</Text>
                    </View>
                </View>

                {/* Central Temperature Display - Centered by Flex as requested */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.weatherContainer}>
                        <Text style={styles.mainTemp}>{communityData?.temperature}°C</Text>
                        <Text style={styles.mainCondition}>{communityData?.condition}</Text>
                    </View>
                </View>

                {/* Bottom Section: Stats & Action */}
                <View style={{ marginBottom: 40, width: '100%' }}>
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
                        <Text style={styles.actionText}>Enter conversation</Text>
                    </Pressable>
                </View>
            </Animated.View>

            {/* Bottom Navigation */}
            <View style={styles.navBar}>
                <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")} hitSlop={15}>
                    <HomeIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/mood_check_in/checkin")} hitSlop={15}>
                    <MoodIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/garden")} hitSlop={15} style={{ alignItems: 'center' }}>
                    <GardenIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                    <View style={styles.activeLine} />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/chat")} hitSlop={15}>
                    <ChatIcon width={28} height={28} stroke="white" strokeWidth={1.5} fill="none" />
                </Pressable>
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
    subtitle: { fontSize: 18, color: '#fff', marginTop: 10, fontWeight: '600', opacity: 0.9 },
    weatherContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    mainTemp: { fontSize: 86, fontWeight: '200', color: '#fff', textShadowColor: 'rgba(0,0,0,0.2)', textShadowRadius: 10 },
    mainCondition: { fontSize: 24, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginTop: -5, letterSpacing: 1 },
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

    actionBtn: { backgroundColor: '#fff', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, elevation: 8, marginHorizontal: 20 },
    actionText: { color: '#000', fontSize: 18, fontWeight: '700' },

    navBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20, // for bottom safe area approximation
        backgroundColor: 'transparent', // Transparent as shown in ref, icons floating
        zIndex: 100, // Ensure high zIndex for clickability
    },
    activeLine: {
        width: 20,
        height: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        marginTop: 5,
    },
});

