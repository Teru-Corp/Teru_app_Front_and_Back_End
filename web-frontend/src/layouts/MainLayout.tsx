import { Navigate, Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="mobile-container">
            <main className="content-area">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};

export default MainLayout;
