import { lazy } from 'react';
import { Navigate, Route } from 'react-router';

import AdminProtectedRoute from './AdminProtectedRoute';

// Layout
const AdminLayout = lazy(() => import('@admin/layout/AdminLayout'));

const DashboardPage = lazy(() => import('@admin/dashboard/pages/DashboardPage'));
const CustomersPage = lazy(() => import('@admin/customers/pages/CustomersPage'));
const AddCustomerPage = lazy(() => import('@admin/customers/pages/AddCustomerPage'));
const EditCustomerPage = lazy(() => import('@admin/customers/pages/EditCustomerPage'));
const CategoriesPage = lazy(() => import('@admin/categories/pages/CategoriesPage'));
const AddCategoryPage = lazy(() => import('@admin/categories/pages/AddCategoryPage'));
const EditCategoryPage = lazy(() => import('@admin/categories/pages/EditCategoryPage'));
const ProductsPage = lazy(() => import('@admin/products/pages/ProductsPage'));
const AddProductPage = lazy(() => import('@admin/products/pages/AddProductPage'));
const EditProductPage = lazy(() => import('@admin/products/pages/EditProductPage'));
const OrdersPage = lazy(() => import('@admin/orders/pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('@admin/orders/pages/OrderDetailsPage'));
const SettingsPage = lazy(() => import('@admin/settings/pages/SettingsPage'));

export const AdminRoutes = () => (
  <Route element={<AdminProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
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
      <Route path="orders/:orderId" element={<OrderDetailsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  </Route>
);  

export default AdminRoutes;
