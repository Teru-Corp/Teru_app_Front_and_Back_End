import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

interface User {
    id: string;
    email: string;
    nom: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, mot_de_passe: string) => Promise<void>;
    register: (email: string, mot_de_passe: string, nom: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored token on app start
    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const userData = await SecureStore.getItemAsync('userData');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                    // Validate token or just assume valid for now? 
                    // Ideally call a /me endpoint if available.
                }
            } catch (e) {
                console.error('Failed to restore token', e);
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, []);

    const login = async (email: string, mot_de_passe: string) => {
        try {
            const response = await client.post('/connexion', { email, mot_de_passe });
            const { token, user } = response.data;

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));

            setUser(user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, mot_de_passe: string, nom: string) => {
        try {
            const response = await client.post('/inscription', { email, mot_de_passe, nom });
            // Depending on backend, might return token immediately or ask to login.
            // Backend code: returns { message, user }. Does NOT return token.
            // So we must redirect to login or auto-login.
            // For simplicity, we'll just return and let the UI navigate to Login.
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
