import { useEffect, useState } from 'react';
import client from '../api/client';

export type WeatherCondition = 'Sunny' | 'Rainy' | 'Stormy' | 'Cloudy';

export interface CommunityWeather {
    condition: WeatherCondition;
    temperature: number;
    emotion: string;
    count: number;
    colors: [string, string, string];
    teruFeeling: string;
}

const CONDITION_COLORS: Record<WeatherCondition, [string, string, string]> = {
    Sunny: ['#FF9A9E', '#FECFEF', '#F6D365'],
    Rainy: ['#2C3E50', '#000000', '#1a1a2e'],
    Stormy: ['#1F1C2C', '#928DAB', '#000000'],
    Cloudy: ['#E99F95', '#F2E8C0', '#A6D8C6'],
};

const getTeruFeeling = (condition: WeatherCondition, emotion: string) => {
    switch (condition) {
        case 'Sunny':
            return `Terubot feels radiant today because of our shared ${emotion.toLowerCase()}!`;
        case 'Rainy':
            return `Terubot is feeling a bit reflective as we share some ${emotion.toLowerCase()} vibes.`;
        case 'Stormy':
            return `Terubot is feeling the intensity of our collective ${emotion.toLowerCase()} energy.`;
        default:
            return `Terubot feels calm and connected with our community.`;
    }
};

export const useCommunityWeather = () => {
    const [data, setData] = useState<CommunityWeather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            const res = await client.get('/community-weather');
            const { condition, temperature, emotion, count } = res.data;

            const weatherCondition = (condition || 'Cloudy') as WeatherCondition;

            setData({
                condition: weatherCondition,
                temperature,
                emotion,
                count,
                colors: CONDITION_COLORS[weatherCondition],
                teruFeeling: getTeruFeeling(weatherCondition, emotion)
            });
            setError(null);
        } catch (e) {
            console.error("Failed to fetch community weather", e);
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error, refetch: fetchData };
};
