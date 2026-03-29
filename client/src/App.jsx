import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Routes
import PublicRoutes from './routes/PublicRoutes'
import AuthRoutes from './routes/AuthRoutes'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'
import useAuthStore from './store/useAuthStore'

const AppContent = () => {
  const { getCurrentUser, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token and restore user state on app load
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser().catch(() => {
        // Silently handle token validation failure
        console.log('Token validation failed, user needs to login again');
      });
    }
  }, [getCurrentUser]);

  useEffect(() => {
    // Redirect admin users to dashboard on app load
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

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
