import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { isAdminUser } from '../../utils/auth';
import apiClient from '../../services/apiClient';
import { useToast } from '../../hooks/useToast';

const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'All Products' },
  { to: '/products?category=Electronics', label: 'Electronics' },
  { to: '/products?category=Vehicles', label: 'Vehicles' },
  { to: '/about', label: 'About Us' },
];

const SOCIALS = [
  { icon: <FacebookIcon />, href: '#', label: 'Facebook', hoverCls: 'hover:bg-blue-600 hover:border-blue-600' },
  { icon: <TwitterIcon />, href: '#', label: 'Twitter', hoverCls: 'hover:bg-gray-700 hover:border-gray-700' },
  { icon: <InstagramIcon />, href: '#', label: 'Instagram', hoverCls: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent' },
  { icon: <YoutubeIcon />, href: '#', label: 'YouTube', hoverCls: 'hover:bg-red-600 hover:border-red-600' },
];

const PAYMENTS = [
  { name: 'Visa', bg: 'bg-[#1A1F71]' },
  { name: 'Mastercard', bg: 'bg-[#EB001B]' },
  { name: 'bKash', bg: 'bg-[#E2136E]' },
  { name: 'Nagad', bg: 'bg-[#F26522]' },
  { name: 'DBBL', bg: 'bg-green-700' },
];

const DELIVERY = [
  { name: 'Pathao', bg: 'bg-[#E4002B]' },
  { name: 'Paperfly', bg: 'bg-[#FF6B00]' },
  { name: 'Sundarban', bg: 'bg-[#006838]' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { success, error: toastError } = useToast();
  const user = useAuthStore((state) => state.user);
  const adminUser = isAdminUser(user);
  const customerLinks = [
    { to: adminUser ? '/dashboard' : '/my-account', label: adminUser ? 'Admin Dashboard' : 'My Account' },
    { to: adminUser ? '/dashboard?tab=orders' : '/order-history', label: adminUser ? 'Manage Orders' : 'Order History' },
    { to: '/track-order', label: 'Track Order' },
    { to: '/returns', label: 'Returns & Refunds' },
    { to: '/help', label: 'Help Center' },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await apiClient.post('/public/newsletter', { email, source: 'footer' });
      setSubscribed(true);
      setEmail('');
      success('Subscribed successfully.');
    } catch (err: any) {
      toastError(err.response?.data?.error || 'Subscription failed.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      {/* Newsletter Banner */}
      <div className="bg-[#1a8a4a] py-10 px-6">
        <div className="bd-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Get exclusive deals in your inbox</h3>
            <p className="text-green-100 text-sm mt-1">Subscribe now and get 10% off your first order</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="text-2xl">✓</span> You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-0">
              <div className="relative flex-1 md:w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  name="bdshop-newsletter-email"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white text-gray-900 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#1a8a4a] text-sm font-bold rounded-r-xl hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {subscribing ? 'Sending...' : 'Subscribe'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="bd-container py-14 border-t-2 border-green-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-[#1a8a4a] rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                BD<span className="text-[#1a8a4a]">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bangladesh's premium destination for electronics, vehicles & accessories. Quality products, trusted service.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2 group hover:text-green-400 transition-colors">
                <MapPin className="h-4 w-4 text-green-400 shrink-0 group-hover:text-green-300 transition-colors" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-green-400 transition-colors">
                <Phone className="h-4 w-4 text-green-400 shrink-0 group-hover:text-green-300 transition-colors" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-green-400 transition-colors">
                <Mail className="h-4 w-4 text-green-400 shrink-0 group-hover:text-green-300 transition-colors" />
                <span>support@bdshop.com</span>
              </div>
            </div>
            {/* Socials */}
            <div className="flex gap-3 pt-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`h-9 w-9 rounded-full border border-gray-600 flex items-center justify-center transition-all duration-300 ${s.hoverCls}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 after:block after:w-8 after:h-0.5 after:bg-green-500 after:mt-2">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group text-sm text-gray-400 hover:text-green-400 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <span className="text-[#1a8a4a] text-xs group-hover:text-green-400 transition-colors group-hover:translate-x-1">›</span> 
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 after:block after:w-8 after:h-0.5 after:bg-green-500 after:mt-2">Customer Service</h4>
            <ul className="space-y-3">
              {customerLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group text-sm text-gray-400 hover:text-green-400 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <span className="text-[#1a8a4a] text-xs group-hover:text-green-400 transition-colors group-hover:translate-x-1">›</span> 
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App & Payment */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 after:block after:w-8 after:h-0.5 after:bg-green-500 after:mt-2">Secure Payments</h4>
            <p className="text-sm text-gray-400 mb-4">We accept all major payment methods</p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENTS.map((pm) => (
                <div
                  key={pm.name}
                  className={`${pm.bg} text-white h-9 rounded-lg px-2 text-[11px] font-bold flex items-center justify-center hover:scale-105 hover:brightness-110 transition-all duration-200 shadow-sm cursor-pointer`}
                >
                  {pm.name}
                </div>
              ))}
              <div className="bg-gray-600 text-white h-9 rounded-lg px-2 text-[11px] font-bold flex items-center justify-center hover:scale-105 hover:brightness-110 transition-all duration-200 shadow-sm cursor-pointer gap-1">
                <span>💵</span> COD
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-white font-medium text-sm mb-3">Delivery Partners</h5>
              <div className="flex flex-wrap gap-2">
                {DELIVERY.map((dl) => (
                  <div
                    key={dl.name}
                    className={`${dl.bg} text-white h-8 rounded-lg px-3 text-[11px] font-bold flex items-center justify-center hover:scale-105 hover:brightness-110 transition-all duration-200 shadow-sm cursor-pointer`}
                  >
                    {dl.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-5 px-6">
        <div className="bd-container flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} BD Shop. All rights reserved.</span>
          <div className="flex items-center">
            <Link to="/privacy-policy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <span className="text-gray-700 mx-2">·</span>
            <Link to="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <span className="text-gray-700 mx-2">·</span>
            <Link to="/cookie-policy" className="hover:text-green-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
