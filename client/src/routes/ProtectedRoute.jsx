import { Navigate, Outlet } from 'react-router';

/**
 * ProtectedRoute component that guards routes based on authentication status.
 * It checks localStorage for the 'token'.
 */
const ProtectedRoute = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
