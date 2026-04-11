import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router'
import { Suspense, useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'

import PublicRoutes from './routes/PublicRoutes'
import AuthRoutes from './routes/AuthRoutes'
import UserRoutes from './routes/UserRoutes'
import AdminRoutes  from './routes/AdminRoutes'
import { useCurrentUserQuery } from './hooks/useAuthQueries'
import useAuthStore from './store/useAuthStore'

const AppContent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRedirectDone = useRef(false);
  const { isLoading } = useCurrentUserQuery();

  useEffect(() => {
    // Redirect admin users to dashboard on initial load, but not during admin navigation
    if (user?.role === 'admin' && !initialRedirectDone.current && !location.pathname.startsWith('/admin')) {
      navigate('/admin/dashboard');
      initialRedirectDone.current = true;
    }
  }, [user, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-light">
        <Loader className="animate-spin text-[#fbc02d]" size={48} />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-bg-light">
          <Loader className="animate-spin text-[#fbc02d]" size={48} />
        </div>
      }
    >
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
    </Suspense>
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
