import client from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
    _id: string;
    texte: string;
    utilisateur: string;
    date: string;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { user } = useAuth();
    const router = useRouter();

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
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        setSending(true);
        try {
            await client.post('/message', { texte: inputText });
            setInputText('');
            fetchMessages(); // Refresh immediately
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.utilisateur === user?.id;
        return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
                {!isMe && <Text style={styles.sender}>User {item.utilisateur?.slice(-4)}</Text>}
                <Text style={styles.messageText}>{item.texte}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#E19A93", "#E5B5A0", "#EDD7B8"]}
                style={styles.gradient}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← </Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Community Chat</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    inverted
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="rgba(0,0,0,0.4)"
                />
                <TouchableOpacity onPress={sendMessage} disabled={sending} style={styles.sendButton}>
                    {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        padding: 16,
        paddingTop: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)'
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        color: '#2B2B2B',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2B2B2B',
        marginLeft: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
        flexDirection: 'column-reverse' // Inverted list needs this? No, FlatList inverted handles it.
        // Actually if inverted is true, data[0] is at bottom.
        // My backend sorts by date desc (newest first).
        // So messages[0] is newest. Inverted FlatList shows index 0 at bottom. Correct.
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#9DCFBE',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 4,
    },
    sender: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.5)',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#2B2B2B',
    },
    date: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.4)',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#2B2B2B',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
