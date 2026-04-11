import { lazy } from 'react';
import { Route } from 'react-router';

// Layout
const MainLayout = lazy(() => import('../layouts/MainLayout'));

// Guard
import ProtectedRoute from './ProtectedRoute';

const ChangePasswordPage = lazy(() => import('../features/auth/pages/ChangePasswordPage'));
const EditProfilePage = lazy(() => import('../features/profile/pages/EditProfilePage'));
const OrderHistoryPage = lazy(() => import('../features/orders/pages/OrderHistory'));
const OrderDetailsPage = lazy(() => import('../features/orders/pages/OrderDetailsPage'));
const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage'));

const UserRoutes = () => {
    return (
        
        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="/profile" element={<EditProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/orders/:id" element={<OrderDetailsPage />} />
            </Route>
        </Route>
    );
};

export default UserRoutes;
