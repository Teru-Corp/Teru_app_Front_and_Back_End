import axios from 'axios';

// Dynamically use the current hostname but port 3000 for the backend.
// This allows accessing from localhost or the PC's IP address from a phone.
const API_URL = "https://teru-app-front-and-back-end.onrender.com";

const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Add a request interceptor to add the auth token to every request
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
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
