import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailsPage from '../pages/CourseDetailsPage';
import CartPage from '../pages/CartPage';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import AgilePage from '../pages/AgilePage';
import ContactPage from '../pages/ContactPage';
import OurNetworkPage from '../pages/OurNetworkPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import RefundPolicyPage from '../pages/RefundPolicyPage';
import ShippingPolicyPage from '../pages/ShippingPolicyPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/agile" element={<AgilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/our-network" element={<OurNetworkPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/shipping-delivery-policy" element={<ShippingPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}