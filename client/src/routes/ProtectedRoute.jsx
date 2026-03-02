import React from 'react';
import { Navigate, Outlet } from 'react-router';

/**
 * ProtectedRoute component that guards routes based on authentication status.
 * It checks sessionStorage for the 'isLoggedIn' flag.
 */
const ProtectedRoute = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
