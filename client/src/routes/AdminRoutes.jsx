import { Route, Navigate } from 'react-router';

// Layout
import AdminLayout from '@admin/layout/AdminLayout';

// Pages
import DashboardPage from '@admin/dashboard/pages/DashboardPage';
import CustomersPage from '@admin/customers/pages/CustomersPage';
import AddCustomerPage from '@admin/customers/pages/AddCustomerPage';
import EditCustomerPage from '@admin/customers/pages/EditCustomerPage';
import CategoriesPage from '@admin/categories/pages/CategoriesPage';
import AddCategoryPage from '@admin/categories/pages/AddCategoryPage';
import EditCategoryPage from '@admin/categories/pages/EditCategoryPage';
import ProductsPage from '@admin/products/pages/ProductsPage';
import AddProductPage from '@admin/products/pages/AddProductPage';
import EditProductPage from '@admin/products/pages/EditProductPage';
import OrdersPage from '@admin/orders/pages/OrdersPage';
import SettingsPage from '@admin/settings/pages/SettingsPage';
import AdminProtectedRoute from './AdminProtectedRoute';

const AdminRoutes = () => {
    return (
        <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/add" element={<AddCustomerPage />} />
                <Route path="customers/edit/:id" element={<EditCustomerPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/add" element={<AddCategoryPage />} />
                <Route path="categories/edit/:id" element={<EditCategoryPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/add" element={<AddProductPage />} />
                <Route path="products/edit/:id" element={<EditProductPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
        </Route>
    );
};

export default AdminRoutes;
