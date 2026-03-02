import { Route } from 'react-router';

// Layout
import MainLayout from '../layouts/MainLayout';

// Pages
import LandingPage from '../features/landing/pages/LandingPage';
import ProductPage from '../features/products/pages/ProductPage';
import AboutPage from '../features/about/pages/AboutPage';
import ContactPage from '../features/contact/pages/ContactPage';

const PublicRoutes = () => {
    return (
        <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
        </Route>
    );
};

export default PublicRoutes;
