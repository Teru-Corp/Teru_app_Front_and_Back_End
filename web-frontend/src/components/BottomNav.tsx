import { Cloud, Home, MessageCircle, Smile } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/app/weather" className="nav-item">
                <Home size={28} />
            </NavLink>
            <NavLink to="/app/checkin" className="nav-item">
                <Smile size={28} />
            </NavLink>
            <NavLink to="/app/garden" className="nav-item">
                <Cloud size={28} />
            </NavLink>
            <NavLink to="/app/chat" className="nav-item">
                <MessageCircle size={28} />
            </NavLink>
        </nav>
    );
};

export default BottomNav;
