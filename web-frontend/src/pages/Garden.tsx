import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import TeruIcon from "../assets/icons/icon_teru_face.svg";
import { useCommunityWeather } from "../hooks/useCommunityWeather";

const IRL_CHALLENGES = [
    { icon: "😊", text: "Smile at three strangers today." },
    { icon: "📱", text: "Text a friend you haven't spoken to in a while." },
    { icon: "🚶", text: "Take a 15-minute walk outside without your phone." },
    { icon: "📝", text: "Write down 3 things you are grateful for today." },
    { icon: "🤝", text: "Give a genuine compliment to someone." },
    { icon: "☕", text: "Buy a coffee or treat for someone else." },
    { icon: "🌱", text: "Spend 10 minutes outside just observing nature." },
];

export default function Garden() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([]);
    const { data: communityData, loading: commLoading } = useCommunityWeather();

    // Select a rotating daily challenge
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const dailyChallenge = IRL_CHALLENGES[dayOfYear % IRL_CHALLENGES.length];

    const fetchMessages = async () => {
        try {
            const res = await client.get('/messages');
            // Take only the latest 4 messages for the atmosphere clouds
            const msgs = res.data.slice(0, 4);
            setMessages(msgs);
        } catch (e) {
            console.error("Garden messages error", e);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const bgColors = communityData?.colors || ['#1a1a2e', '#16213e', '#0f3460'];
    const gradientStyle = {
        background: `linear-gradient(180deg, ${bgColors[0]} 0%, ${bgColors[1]} 50%, ${bgColors[2]} 100%)`
    };

    const renderAtmosphere = () => {
        if (!communityData) return null;
        const { condition, teruFeeling } = communityData;
        const isSunny = condition === "Sunny" || teruFeeling === "Joyful" || teruFeeling === "Energetic";
        const isStormy = condition === "Stormy" || teruFeeling === "Angry" || teruFeeling === "Anxious";
        const isRainy = condition === "Rainy" || teruFeeling === "Sad";
        const isCalm = teruFeeling === "Calm";

        return (
            <div className="garden-atmosphere">
                {isSunny && <div className="garden-sun"></div>}
                {isStormy && <div className="garden-lightning"></div>}
                {(isStormy || isRainy) && (
                    <div className="garden-rain">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="rain-drop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }} />
                        ))}
                    </div>
                )}
                {(isSunny || isCalm) && (
                    <div className="garden-fireflies">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="firefly" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (commLoading && !communityData) {
        return <div className="garden-container" style={{ justifyContent: 'center', backgroundColor: '#000' }}>Loading...</div>;
    }

    return (
        <div className="garden-container" style={gradientStyle}>
            {renderAtmosphere()}

            {/* Messages Floating in the Sky */}
            <div className="garden-clouds-area">
                {messages.map((msg, idx) => (
                    <div key={msg._id} className="garden-message-cloud" style={{ animationDelay: `${idx * 0.5}s`, left: `${10 + (idx % 2) * 40}%`, top: `${15 + idx * 10}%` }}>
                        <span className="garden-cloud-text">{msg.texte}</span>
                    </div>
                ))}
            </div>

            <div className="garden-content">
                <div className="garden-header">
                    <h1 className="garden-title">The Garden</h1>
                    <p className="garden-subtitle">Welcome to the emotional weather of the community</p>
                </div>

                <div className="garden-weather-display">
                    <h2 className="garden-temp">{communityData?.temperature}°C</h2>
                    <span className="garden-condition">{communityData?.condition}</span>
                </div>

                {/* Part 2: Collective Visualization */}
                <div className="garden-collective-viz">
                    <div className="viz-header">
                        <span className="viz-title">Community Mirror</span>
                        <span className="garden-plus-text">{communityData?.count || 0} check-ins </span>
                    </div>
                    <div className="viz-metrics">
                        <div className="metric-item">
                            <div className="metric-label-row">
                                <span>Collective Energy</span>
                                <span>{Math.round(((communityData?.avgY || 0) + 1) * 50)}%</span>
                            </div>
                            <div className="metric-bar-bg">
                                <div
                                    className="metric-bar-fill"
                                    style={{
                                        width: `${((communityData?.avgY || 0) + 1) * 50}%`,
                                        background: 'linear-gradient(90deg, #8A2BE2, #FFD700)'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-label-row">
                                <span>Collective Feeling</span>
                                <span>{Math.round(((communityData?.avgX || 0) + 1) * 50)}%</span>
                            </div>
                            <div className="metric-bar-bg">
                                <div
                                    className="metric-bar-fill"
                                    style={{
                                        width: `${((communityData?.avgX || 0) + 1) * 50}%`,
                                        background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Part 2: Community Challenge */}
                <div className="challenge-card">
                    <div className="challenge-icon">{dailyChallenge.icon}</div>
                    <div className="challenge-info">
                        <span className="challenge-label">Daily IRL Challenge</span>
                        <p className="challenge-text">{dailyChallenge.text}</p>
                    </div>
                </div>

                <div className="garden-bottom-stats">
                    <div className="garden-minimal-stats">
                        <div className="garden-teru-wrapper">
                            <img src={TeruIcon} alt="TeruBot" className="garden-teru-icon" />
                        </div>
                        <p className="garden-stats-desc">
                            {communityData?.teruFeeling || `A collective mood of ${communityData?.condition?.toLowerCase()}`}
                        </p>
                    </div>

                    <button className="garden-action-btn" onClick={() => navigate("/app/chat")}>
                        Enter conversation
                    </button>
                </div>
            </div>
        </div>
    );
}
