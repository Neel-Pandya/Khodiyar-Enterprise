import React from 'react';
import { Route } from 'react-router';

// Layout
import MainLayout from '../layouts/MainLayout';

// Guard
import ProtectedRoute from './ProtectedRoute';

// Pages
import { ChangePasswordPage } from '../features/auth/pages';

const UserRoutes = () => {
    return (
        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>
        </Route>
    );
};

export default UserRoutes;
