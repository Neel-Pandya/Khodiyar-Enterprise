import { Route } from 'react-router';

// Pages
import { ForgotPassword, Login, ResetPassword, Signup, VerifyEmail } from '../features/auth/pages';

const AuthRoutes = () => {
    return (
        <>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
        </>
    );
};

export default AuthRoutes;
