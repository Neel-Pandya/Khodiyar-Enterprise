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
  const navigate = useNavigate();
  const setNavigate = useAuthStore(state => state.setNavigate);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes()}

      {/* Auth Routes */}
      {AuthRoutes()}

      {/* Admin Routes */}
      {AdminRoutes()}

      {/* User Routes */}
      {UserRoutes()}

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
