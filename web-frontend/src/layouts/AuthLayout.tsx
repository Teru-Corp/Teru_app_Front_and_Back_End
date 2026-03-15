import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (user) {
        return <Navigate to="/app/weather" replace />; // Default tab
    }

    return (
        <div className="mobile-container">
            <main className="content-area" style={{ paddingBottom: 0 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
