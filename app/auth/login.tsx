import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const testConnection = async () => {
        try {
            const res = await client.get('/');
            Alert.alert('Connection Success', `Server says: ${res.data}`);
        } catch (e: any) {
            Alert.alert('Connection Failed', e.message);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            // AuthContext will update user state, which triggers a re-render in RootLayout.
            // RootLayout should handle navigation to (tabs) if user is present.
            // However, sometimes explicit navigation is safer if effect is not immediate.
            // For now, let's rely on RootLayout or add a replace here.
            router.replace('/(tabs)');
        } catch (e: any) {
            Alert.alert('Login Failed', e.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#E19A93", "#E5B5A0", "#EDD7B8"]}
                style={styles.gradient}
            />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )
                    }
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/auth/register" asChild>
                        <TouchableOpacity>
                            <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <TouchableOpacity style={styles.debugButton} onPress={testConnection}>
                    <Text style={styles.debugText}>Test Server Connection</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2B2B2B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#4F4F4F',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
        gap: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2B2B2B',
        marginBottom: 4,
    },
    debugButton: {
        marginTop: 40,
        alignSelf: 'center',
    },
    debugText: {
        color: 'rgba(0,0,0,0.4)',
        fontSize: 12,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    button: {
        backgroundColor: '#9DCFBE',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#4F4F4F',
        fontSize: 14,
    },
    link: {
        color: '#2B2B2B',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
