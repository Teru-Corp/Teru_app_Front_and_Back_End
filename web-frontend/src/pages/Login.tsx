import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const testConnection = async () => {
        try {
            const res = await client.get('/');
            alert(`Server says: ${res.data}`);
        } catch (e: any) {
            alert(`Connection Failed: ${e.message}`);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate('/app/weather', { replace: true });
        } catch (e: any) {
            alert(e.response?.data?.error || 'Login Failed. Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-gradient-overlay gradient-bg" />
            <div className="login-content">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Sign in to continue</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="footer-text">Don't have an account? </span>
                    {/* Add sign up link when ready */}
                    <Link to="/auth/register" className="link-text">Sign Up</Link>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button onClick={testConnection} className="debug-button">
                        Test Server Connection
                    </button>
                </div>
            </div>
        </div>
    );
}
