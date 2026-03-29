import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/store/useAuthStore';

/**
 * AdminProtectedRoute component that guards admin routes based on authentication status and admin role.
 * It checks localStorage for the 'token' and verifies the user has admin role.
 */
const AdminProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const { user } = useAuthStore();

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        // Redirect to home if authenticated but not admin
        return <Navigate to="/" replace />;
    }

    // Render the child routes if authenticated and admin
    return <Outlet />;
};

export default AdminProtectedRoute;