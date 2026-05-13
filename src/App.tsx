import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ThankYouPage from './pages/ThankYouPage';
import ProductCatalogPage from './pages/catalog/ProductCatalogPage';
import ProductDetailsPage from './pages/catalog/ProductDetailsPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import MyAccountPage from './pages/account/MyAccountPage';
import OrderHistoryPage from './pages/account/OrderHistoryPage';
import TrackOrderPage from './pages/account/TrackOrderPage';
import ReturnsPage from './pages/info/ReturnsPage';
import HelpCenterPage from './pages/info/HelpCenterPage';
import PrivacyPolicyPage from './pages/info/PrivacyPolicyPage';
import TermsPage from './pages/info/TermsPage';
import CookiePolicyPage from './pages/info/CookiePolicyPage';
import { useAuthStore } from './store/useAuthStore';
import { CartDrawer } from './components/cart/CartDrawer';
import { Toaster } from './components/ui/Toaster';
import { Navbar } from './components/layout/Navbar';
import { CategoryNav } from './components/layout/CategoryNav';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

/* ─── Guards ──────────────────────────────────── */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuthStore();
  if (user?.role === 'admin' || user?.role === 'superadmin') return <AdminDashboard />;
  return <Navigate to="/my-account" replace />;
};

/* ─── Auth layout — no navbar / footer ─────────── */
const AuthLayout = () => (
  <div className="min-h-screen">
    <Outlet />
    <Toaster />
  </div>
);

/* ─── Main layout — full chrome ─────────────────── */
const RootLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <CategoryNav />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <Toaster />
    </div>
  );
};

/* ─── Router — correct nested layout pattern ─────── */
const router = createBrowserRouter([
  {
    path: '/',
    children: [
      /* Auth routes — own layout, no chrome */
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
      /* Main routes — full layout with Navbar + Footer */
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'products', element: <ProductCatalogPage /> },
          { path: 'products/:id', element: <ProductDetailsPage /> },
          { path: 'thank-you', element: <ThankYouPage /> },
          {
            path: 'checkout',
            element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>,
          },
          {
            path: 'dashboard/*',
            element: <ProtectedRoute><DashboardRouter /></ProtectedRoute>,
          },
          {
            path: 'my-account',
            element: <ProtectedRoute><UserDashboard /></ProtectedRoute>,
          },
          { path: 'order-history', element: <OrderHistoryPage /> },
          { path: 'track-order', element: <TrackOrderPage /> },
          { path: 'returns', element: <ReturnsPage /> },
          { path: 'help', element: <HelpCenterPage /> },
          { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
          { path: 'terms', element: <TermsPage /> },
          { path: 'cookie-policy', element: <CookiePolicyPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
