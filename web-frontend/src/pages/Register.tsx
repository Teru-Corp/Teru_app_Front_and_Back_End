import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name);
            alert('Account created! Please login.');
            navigate('/auth/login');
        } catch (e: any) {
            alert(e.response?.data?.error || 'Registration Failed. Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-gradient-overlay gradient-bg" />
            <div className="login-content">
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Sign up to get started</p>

                <form onSubmit={handleRegister} className="login-form">
                    <div className="input-group">
                        <label className="input-label">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

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
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="footer-text">Already have an account? </span>
                    <Link to="/auth/login" className="link-text">Login</Link>
                </div>
            </div>
        </div>
    );
}
