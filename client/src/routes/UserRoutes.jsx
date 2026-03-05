import { Route } from 'react-router';

// Layout
import MainLayout from '../layouts/MainLayout';

// Guard
import ProtectedRoute from './ProtectedRoute';

// Pages
import { ChangePasswordPage } from '../features/auth/pages';
import { EditProfilePage } from '../features/profile/pages';
import { FavoritesPage } from '../features/favorites/pages';

const UserRoutes = () => {
    return (
        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="/profile" element={<EditProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
        </Route>
    );
};

export default UserRoutes;
