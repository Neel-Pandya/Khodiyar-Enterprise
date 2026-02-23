import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ForgotPassword, Login, ResetPassword, Signup } from './features/auth/pages'
import MainLayout from './layouts/MainLayout'
import LandingPage from './features/landing/pages/LandingPage'
import ProductPage from './features/products/pages/ProductPage'
import AboutPage from './features/about/pages/AboutPage'
import ContactPage from './features/contact/pages/ContactPage'

// Admin
import AdminLayout from './features/admin/layouts/AdminLayout'
import DashboardPage from './features/admin/pages/DashboardPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
