import { lazy } from 'react';
import { Route } from 'react-router';

// Guard
import UnauthenticatedRoute from './UnauthenticatedRoute';

const Login = lazy(() => import('../features/auth/pages/Login'));
const ForgotPassword = lazy(() => import('../features/auth/pages/ForgotPassword'));
const Signup = lazy(() => import('../features/auth/pages/Signup'));
const ResetPassword = lazy(() => import('../features/auth/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('../features/auth/pages/VerifyEmail'));

const AuthRoutes = () => {
    return (
        <Route element={<UnauthenticatedRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
        </Route>
    );
};

export default AuthRoutes;
