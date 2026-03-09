import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EmotionalGrid from '../../../components/EmotionalGrid';

// Replace with your actual local IP if testing on physical device
const API_URL = 'http://10.0.2.2:3000';

export default function GridCheckinScreen() {
    const router = useRouter();
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [submitted, setSubmitted] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleValueChange = (x: number, y: number) => {
        setCoordinates({ x, y });
    };

    const handleConfirm = async () => {
        try {
            // In a real app, we'd get the token from SecureStore or Context
            // For this demo, we assume the user is "logged in" or we use a guest path
            // Since Point 1 says "Anonymous", the backend might need an anonymous mode
            // or we just send it to the existing /mood endpoint if we have a token.

            /* 
            await axios.post(`${API_URL}/mood`, {
              x: coordinates.x,
              y: coordinates.y,
              // Optional legacy fields
              emotion: 'Neutral',
              energy: (coordinates.y + 1) / 2,
              connection: 0,
              stress: 'peaceful'
            });
            */

            console.log('Submitted Mood:', coordinates);
            setSubmitted(true);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            // Navigate away after a short delay
            setTimeout(() => {
                router.push('/(tabs)/principal_screen/weather1');
            }, 2500);

        } catch (error) {
            console.error('Error submitting mood:', error);
            // Fallback for demo
            setSubmitted(true);
        }
    };

    const handleSkip = () => {
        router.back();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#E99F95', '#F2E8C0', '#A6D8C6']}
                    style={styles.background}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />

                {!submitted ? (
                    <View style={styles.content}>
                        <Text style={styles.subtitle}>
                            Anonymous Emotional Check-in
                        </Text>
                        <Text style={styles.title}>
                            Where are you right now?
                        </Text>

                        <EmotionalGrid onValueChange={handleValueChange} />

                        <View style={styles.buttonRow}>
                            <Pressable style={styles.skipButton} onPress={handleSkip}>
                                <Text style={styles.skipText}>Not now</Text>
                            </Pressable>

                            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                                <Text style={styles.confirmText}>Check In</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
                        <Text style={styles.feedbackTitle}>Check-in received.</Text>
                        <Text style={styles.feedbackSubtitle}>
                            Thank you for contributing to the community pulse.
                        </Text>
                    </Animated.View>
                )}
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 5,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 4,
    },
    confirmText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    },
    skipButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    skipText: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        fontSize: 15,
    },
    feedbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    feedbackTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    feedbackSubtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 26,
    }
});
