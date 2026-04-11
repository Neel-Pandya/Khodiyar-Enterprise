import { lazy } from 'react';
import { Route } from 'react-router';

// Layout
const MainLayout = lazy(() => import('../layouts/MainLayout'));

const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'));
const ProductPage = lazy(() => import('../features/products/pages/ProductPage'));
const ProductDetailsPage = lazy(() => import('../features/products/pages/ProductDetailsPage'));
const AboutPage = lazy(() => import('../features/about/pages/AboutPage'));
const ContactPage = lazy(() => import('../features/contact/pages/ContactPage'));
const CartPage = lazy(() => import('../features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage'));

const PublicRoutes = () => {
    return (
        <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
    );
};

export default PublicRoutes;
