import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ForgotPassword, Login, ResetPassword, Signup } from './features/auth/pages'
import MainLayout from './layouts/MainLayout'
import LandingPage from './features/landing/pages/LandingPage'
import ProductPage from './features/products/pages/ProductPage'

import AboutPage from './features/about/pages/AboutPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<div>Contact Page (Coming Soon)</div>} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
