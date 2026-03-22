import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

// Routes
import PublicRoutes from './routes/PublicRoutes'
import AuthRoutes from './routes/AuthRoutes'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {PublicRoutes()}

        {/* Auth Routes */}
        {AuthRoutes()}

        {/* Admin Routes */}
        {AdminRoutes()}

        {/* User Routes */}
        {UserRoutes()}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
