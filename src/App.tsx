import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';
import { CartDrawer } from './components/cart/CartDrawer';
import { Toaster } from './components/ui/Toaster';
import { Navbar } from './components/layout/Navbar';
import { CategoryNav } from './components/layout/CategoryNav';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CompareBar } from './components/layout/CompareBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { isAdminUser } from './utils/auth';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const ProductCatalogPage = lazy(() => import('./pages/catalog/ProductCatalogPage'));
const ProductDetailsPage = lazy(() => import('./pages/catalog/ProductDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const OrderHistoryPage = lazy(() => import('./pages/account/OrderHistoryPage'));
const TrackOrderPage = lazy(() => import('./pages/account/TrackOrderPage'));
const ReturnsPage = lazy(() => import('./pages/info/ReturnsPage'));
const HelpCenterPage = lazy(() => import('./pages/info/HelpCenterPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/info/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/info/TermsPage'));
const CookiePolicyPage = lazy(() => import('./pages/info/CookiePolicyPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/blog/BlogDetailPage'));

const PageFallback = () => (
  <div className="min-h-[55vh] bg-[#f8f9fa] px-6 py-12">
    <div className="bd-container grid gap-6 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm" />
      ))}
    </div>
  </div>
);

/* ─── Guards ──────────────────────────────────── */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  if (isAdminUser(user)) return <AdminDashboard />;
  return <Navigate to={`/my-account${location.search}`} replace />;
};

const AccountRouter = () => {
  const { user } = useAuthStore();
  if (isAdminUser(user)) return <Navigate to="/dashboard" replace />;
  return <UserDashboard />;
};

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        const target = document.querySelector(location.hash);
        target?.scrollIntoView({ block: 'start' });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash, location.key]);

  return null;
};

/* ─── Auth layout — no navbar / footer ─────────── */
const AuthLayout = () => (
  <div className="min-h-screen">
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
    <Toaster />
  </div>
);

/* ─── Main layout — full chrome ─────────────────── */
const RootLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <ScrollToTop />
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
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <CompareBar />
      <Toaster />
    </div>
  );
};

/* ─── Router — correct nested layout pattern ─────── */
const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      /* Auth routes — own layout, no chrome */
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'reset-password', element: <ResetPasswordPage /> },
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
          { path: 'checkout', element: <CheckoutPage /> },
          {
            path: 'dashboard/*',
            element: <ProtectedRoute><DashboardRouter /></ProtectedRoute>,
          },
          {
            path: 'my-account',
            element: <ProtectedRoute><AccountRouter /></ProtectedRoute>,
          },
          { path: 'order-history', element: <OrderHistoryPage /> },
          { path: 'track-order', element: <TrackOrderPage /> },
          { path: 'returns', element: <ReturnsPage /> },
          { path: 'help', element: <HelpCenterPage /> },
          { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
          { path: 'terms', element: <TermsPage /> },
          { path: 'cookie-policy', element: <CookiePolicyPage /> },
          { path: 'blog', element: <BlogPage /> },
          { path: 'blog/:id', element: <BlogDetailPage /> },
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
