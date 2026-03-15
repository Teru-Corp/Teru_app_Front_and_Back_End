import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import Chat from './pages/Chat';
import CheckIn from './pages/CheckIn';
import Garden from './pages/Garden';
import HistoryPage from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Weather from './pages/Weather';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              {/* Redirect /auth to /auth/login */}
              <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* App Routes (Requires Auth) */}
            <Route path="/app" element={<MainLayout />}>
              <Route path="weather" element={<Weather />} />
              <Route path="checkin" element={<CheckIn />} />
              <Route path="garden" element={<Garden />} />
              <Route path="chat" element={<Chat />} />
              <Route path="history" element={<HistoryPage />} />
              {/* Default app route */}
              <Route index element={<Navigate to="/app/weather" replace />} />
            </Route>

            {/* Root Redirect */}
            <Route path="/" element={<Navigate to="/app" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
