import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ForgotPassword, Login, ResetPassword, Signup } from './features/auth/pages'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
