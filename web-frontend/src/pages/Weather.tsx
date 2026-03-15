import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCommunityWeather } from "../hooks/useCommunityWeather";

import TeruBotWeatherIcon from "../assets/icons/icon_teru_face.svg";

export default function Weather() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 18) greeting = "Good afternoon";
    if (hour >= 18) greeting = "Good evening";

    const [personalWeather, setPersonalWeather] = useState({ temp: '--', label: 'Loading...' });
    const { data: communityData } = useCommunityWeather();

    const fetchPersonalWeather = useCallback(async () => {
        try {
            const res = await client.get('/weather-stats');
            if (res.data.temperature !== null) {
                setPersonalWeather({
                    temp: `${res.data.temperature}°C`,
                    label: `Feeling ${res.data.label}`
                });
            } else {
                setPersonalWeather({ temp: '--', label: 'No Data' });
            }
        } catch (e) {
            console.error("Failed to fetch personal weather", e);
        }
    }, []);

    useEffect(() => {
        fetchPersonalWeather();
    }, [fetchPersonalWeather]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out of the garden?")) {
            logout();
        }
    };

    const bgColors = communityData?.colors || ['#E99F95', '#F2E8C0', '#A6D8C6'];
    const gradientStyle = {
        background: `linear-gradient(180deg, ${bgColors[0]} 0%, ${bgColors[1]} 50%, ${bgColors[2]} 100%)`
    };

    return (
        <div className="weather-container" style={gradientStyle}>
            <div className="weather-content">

                {/* Header */}
                <div className="weather-header">
                    <div>
                        <span className="weather-welcome">{greeting},</span>
                        <h1 className="weather-name">{user?.nom || 'Teru'}</h1>
                    </div>
                    <button onClick={handleLogout} className="weather-logout-btn">
                        Logout
                    </button>
                </div>

                {/* Title */}
                <h2 className="weather-title">
                    What is your emotional weather today?
                </h2>

                {/* Hero */}
                <div className="weather-hero">
                    <div className="weather-logo-wrapper">
                        <div className="weather-glass-circle">
                            <img src={TeruBotWeatherIcon} alt="TeruBot Weather" className="terubot-img" />
                        </div>
                        {/* Teru's Speech Bubble */}
                        <div className="weather-feeling-bubble">
                            <span className="weather-bubble-text">{personalWeather.label}</span>
                        </div>
                    </div>
                </div>

                {/* Main action */}
                <button
                    className="weather-main-card"
                    onClick={() => navigate("/app/checkin")}
                >
                    <div className="weather-card-text">
                        <span className="weather-card-subtitle">Start your day</span>
                        <h3 className="weather-card-title">Mood check-in</h3>
                    </div>
                    <span className="weather-arrow">›</span>
                </button>

                {/* Quick actions */}
                <div className="weather-actions">
                    <button
                        className="weather-action-card"
                        onClick={() => navigate("/app/history")}
                    >
                        History
                    </button>
                    <button
                        className="weather-action-card"
                        onClick={() => navigate("/app/garden")}
                    >
                        Community
                    </button>
                </div>
            </div>
        </div>
    );
}
