import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use special IP for Android Emulator, otherwise localhost
// HTTPS necessary for tunnel
const API_URL = 'https://07d60f0d21cd9d60-83-141-143-49.serveousercontent.com';

const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'bypass-tunnel-reminder': 'true',
    }
});

// Add a request interceptor to add the auth token to every request
client.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
