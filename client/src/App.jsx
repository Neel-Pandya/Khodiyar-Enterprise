import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router'
import { useEffect, useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'

// Routes
import PublicRoutes from './routes/PublicRoutes'
import AuthRoutes from './routes/AuthRoutes'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'
import useAuthStore from './store/useAuthStore'

const AppContent = () => {
  const { getCurrentUser, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRedirectDone = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and restore user state on app load
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [getCurrentUser]);

  useEffect(() => {
    // Redirect admin users to dashboard on initial load, but not during admin navigation
    if (user?.role === 'admin' && !initialRedirectDone.current && !location.pathname.startsWith('/admin')) {
      navigate('/admin/dashboard');
      initialRedirectDone.current = true;
    }
  }, [user, navigate, location.pathname]);

  if (loading || (user === undefined)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-light">
        <Loader className="animate-spin text-[#fbc02d]" size={48} />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes()}

      {/* Auth Routes */}
      {AuthRoutes()}


      {/* User Routes */}
      {UserRoutes()}

      {/* Admin Routes */}
      {AdminRoutes()}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster />
    </BrowserRouter>
  )
}

export default App
