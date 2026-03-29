import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/store/useAuthStore';

/**
 * UnauthenticatedRoute component that guards auth routes.
 * If user is authenticated, redirects to appropriate page based on role.
 * If not authenticated, allows access to auth pages.
 */
const UnauthenticatedRoute = () => {
    const token = localStorage.getItem('token');
    const { user } = useAuthStore();

    if (token && user) {
        // User is authenticated, redirect based on role
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        // Regular user, redirect to home
        return <Navigate to="/" replace />;
    }

    // User is not authenticated, allow access to auth pages
    return <Outlet />;
};

export default UnauthenticatedRoute;