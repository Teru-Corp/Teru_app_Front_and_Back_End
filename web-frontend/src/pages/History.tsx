import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import client from "../api/client";

export default function History() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const res = await client.get('/history');
            setHistory(res.data);
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setLoading(false);
        }
    };

    // --- DATA PREPARATION FOR CHARTS ---
    const recentEntries = history.slice(0, 6).reverse();
    const energyData = recentEntries.map((item) => {
        const date = new Date(item.date);
        return {
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            energy: item.energy * 10
        };
    });

    const moodCounts: any = {};
    history.forEach((h) => {
        const mood = h.emotion || 'Neutral';
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    const pieColors: any = {
        Joyful: '#FFD700',
        Energetic: '#FF8C00',
        Calm: '#98FB98',
        Anxious: '#D8BFD8',
        Sad: '#87CEEB',
        Neutral: '#D3D3D3'
    };

    const moodData = Object.keys(moodCounts).map((key) => ({
        name: key,
        value: moodCounts[key],
        color: pieColors[key] || '#ccc'
    }));

    return (
        <div className="history-container">
            <div className="history-bg gradient-bg">
                {/* Header */}
                <div className="history-header">
                    <button onClick={() => navigate(-1)} className="history-back-btn">
                        ‹ Back
                    </button>
                    <h1 className="history-title">My Patterns</h1>
                </div>

                {loading ? (
                    <div className="history-loading">Loading...</div>
                ) : (
                    <div className="history-scroll-area">
                        {/* Section 1: Energy Trend */}
                        <h2 className="history-section-title">Energy Trend</h2>
                        <div className="history-chart-card">
                            {history.length > 1 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.8)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#333', borderColor: '#555', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="energy"
                                            stroke="#ffa726"
                                            strokeWidth={3}
                                            dot={{ r: 5, strokeWidth: 2, fill: '#ffa726' }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="history-no-data">Not enough data yet.</p>
                            )}
                        </div>

                        {/* Section 2: Emotional Distribution */}
                        <h2 className="history-section-title">Emotional Distribution</h2>
                        <div className="history-chart-card pie-chart-container">
                            {history.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={moodData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {moodData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#333', borderColor: '#555', borderRadius: '8px', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="history-no-data">No moods recorded.</p>
                            )}
                        </div>

                        {/* Section 3: Recent Log Summary */}
                        <h2 className="history-section-title">Recent Logs</h2>
                        <div className="history-list-container">
                            {history.slice(0, 5).map((item, index) => (
                                <div key={index} className="history-list-item">
                                    <div className="history-dot" style={{ backgroundColor: pieColors[item.emotion] || '#ccc' }} />
                                    <div className="history-list-content">
                                        <span className="history-list-date">
                                            {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="history-list-feeling">
                                            {item.emotion} &amp; {item.stress}
                                        </span>
                                    </div>
                                    <span className="history-list-energy">
                                        ⚡ {Math.round(item.energy * 10)}/10
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
