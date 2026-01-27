import client from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { useCommunityWeather } from '@/hooks/useCommunityWeather';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import TeruIcon from "../../assets/icons/icon_teru_face.svg";

import ChatIcon from "../../assets/icons/chat_icon_bis.svg";
import HomeIcon from "../../assets/icons/home.svg";
import MoodIcon from "../../assets/icons/mood.svg";
import WeatherIcon from "../../assets/icons/weather.svg";

const { width, height } = Dimensions.get('window');

interface Message {
    _id: string;
    texte: string;
    utilisateur: string;
    date: string;
}

const BubbleMessage = ({ item, isMe }: { item: Message, isMe: boolean }) => {
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 3000 + Math.random() * 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000 + Math.random() * 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    const translateX = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, isMe ? -5 : 5],
    });

    return (
        <Animated.View
            style={[
                styles.messageBubble,
                isMe ? styles.myMessage : styles.theirMessage,
                { transform: [{ translateY }, { translateX }] }
            ]}
        >
            <View style={styles.bubbleCloudMain} />
            <View style={[styles.bubbleCloudSec, { left: -10, bottom: -5, width: 30, height: 30 }]} />
            <View style={[styles.bubbleCloudSec, { right: -5, top: -5, width: 25, height: 25 }]} />

            {!isMe && <Text style={styles.sender}>User {item.utilisateur?.slice(-4)}</Text>}
            <Text style={styles.messageText}>{item.texte}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </Animated.View>
    );
};

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { user } = useAuth();
    const router = useRouter();
    const { data: communityData } = useCommunityWeather();

    const fetchMessages = async () => {
        try {
            const response = await client.get('/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        setSending(true);
        try {
            await client.post('/message', { texte: inputText });
            setInputText('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const bgColors = communityData?.colors || ["#E19A93", "#E5B5A0", "#EDD7B8"];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={bgColors}
                style={styles.gradient}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← </Text>
                </TouchableOpacity>
                <View style={styles.headerTitleGroup}>
                    <Text style={styles.headerTitle}>Community Garden</Text>
                    <Text style={styles.headerSubtitle}>{communityData?.count || 0} spirits blossoming</Text>
                </View>
                <TeruIcon width={30} height={30} opacity={0.6} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => <BubbleMessage item={item} isMe={item.utilisateur === user?.id} />}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    inverted
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Whisper to the clouds..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                    <TouchableOpacity onPress={sendMessage} disabled={sending} style={styles.sendButton}>
                        {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Bottom Navigation */}
            <View style={styles.navBar}>
                <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")} hitSlop={15}>
                    <HomeIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/mood_check_in/checkin")} hitSlop={15}>
                    <MoodIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/garden")} hitSlop={15}>
                    <WeatherIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/chat")} hitSlop={15}>
                    <ChatIcon width={28} height={28} stroke="white" strokeWidth={1.5} fill="none" />
                </Pressable>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 24,
        color: '#fff',
    },
    headerTitleGroup: {
        flex: 1,
        marginLeft: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        marginBottom: 25,
        position: 'relative',
        justifyContent: 'center',
    },
    bubbleCloudMain: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    bubbleCloudSec: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    myMessage: {
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    sender: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '700',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    date: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
        paddingBottom: 90, // Lift up for nav bar
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginRight: 12,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sendButton: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    sendButtonText: {
        color: '#1a1a2e',
        fontWeight: '900',
        fontSize: 15,
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
        paddingBottom: 20, // for bottom safe area approximation
        backgroundColor: 'transparent', // Transparent as shown in ref, icons floating
        zIndex: 100, // Ensure high zIndex for clickability
    },
});

