import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import EmotionalGrid from '../components/EmotionalGrid';

export default function CheckIn() {
    const navigate = useNavigate();
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [submitted, setSubmitted] = useState(false);

    const [step, setStep] = useState<number>(1); // 1: Grid, 2: Connection, 3: Stress
    const [connection, setConnection] = useState<number>(1);
    const [stress, setStress] = useState<string | null>(null);
    const CONNECTION_STATES = ["Isolated", "Distant", "Connected", "Supported"];
    const STRESS_LEVELS = [
        { key: "peaceful", label: "Peaceful" },
        { key: "tense", label: "Slightly tense" },
        { key: "stressed", label: "Stressed" },
        { key: "overwhelmed", label: "Overwhelmed" },
    ];

    const handleValueChange = (x: number, y: number) => {
        setCoordinates({ x, y });
    };

    const handleNextGrid = () => {
        setStep(2);
    };

    const handleNextConnection = () => {
        setStep(3);
    };

    const handleConfirmFinal = async () => {
        try {
            await client.post('/mood', {
                x: coordinates.x,
                y: coordinates.y,
                emotion: 'Neutral', // Defaults as per original checkin
                energy: (coordinates.y + 1) / 2,
                connection: connection,
                stress: stress || 'peaceful'
            });

            console.log('Submitted Mood:', coordinates);
            setSubmitted(true);

        } catch (error) {
            console.error('Error submitting mood:', error);
            setSubmitted(true);
        }
    };

    const handleSkip = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="checkin-container">
            <div className="checkin-gradient-overlay" />

            {!submitted ? (
                <>
                    {step === 1 && (
                        <div className="checkin-content slide-up">
                            <p className="checkin-subtitle">Anonymous Emotional Check-in</p>
                            <h1 className="checkin-title">Where are you right now?</h1>

                            <EmotionalGrid onValueChange={handleValueChange} />

                            <div className="button-row">
                                <button className="skip-btn" onClick={handleSkip}>
                                    Not now
                                </button>
                                <button className="confirm-btn" onClick={handleNextGrid}>
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="checkin-content slide-up">
                            <p className="checkin-subtitle">Anonymous Emotional Check-in</p>
                            <h1 className="checkin-title">How connected do you feel?</h1>

                            <div className="connection-labels">
                                {CONNECTION_STATES.map((label, index) => (
                                    <span key={label} className={`conn-label ${index === connection ? 'active' : ''}`}>
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    value={connection}
                                    onChange={(e) => setConnection(parseInt(e.target.value))}
                                    className="custom-slider"
                                />
                            </div>

                            <div className="button-row">
                                <button className="skip-btn" onClick={handleSkip}>
                                    ← Back
                                </button>
                                <button className="confirm-btn" onClick={handleNextConnection}>
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="checkin-content slide-up">
                            <p className="checkin-subtitle">Anonymous Emotional Check-in</p>
                            <h1 className="checkin-title">How stressed do you feel?</h1>

                            <div className="stress-grid">
                                {STRESS_LEVELS.map((level) => {
                                    const isActive = stress === level.key;
                                    return (
                                        <button
                                            key={level.key}
                                            className={`stress-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => setStress(level.key)}
                                        >
                                            {level.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="button-row">
                                <button className="skip-btn" onClick={handleSkip}>
                                    ← Back
                                </button>
                                <button
                                    className={`confirm-btn ${!stress ? 'disabled' : ''}`}
                                    onClick={handleConfirmFinal}
                                    disabled={!stress}
                                >
                                    Finish
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="feedback-container fade-in">
                    <h1 className="feedback-title">Check-in received.</h1>
                    <p className="feedback-subtitle" style={{ marginBottom: 40 }}>
                        Thank you for contributing to the community pulse.
                    </p>

                    <div className="button-column">
                        <button className="confirm-btn" onClick={() => navigate('/app/chat')} style={{ width: '100%', marginBottom: 15 }}>
                            Go to Chat
                        </button>
                        <button className="skip-btn" onClick={() => navigate('/app/garden')} style={{ width: '100%' }}>
                            Go to Garden
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
