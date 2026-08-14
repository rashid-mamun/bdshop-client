import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Search, User, Package, LogOut, LayoutDashboard, Menu, X, TrendingUp, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import apiClient from '../../services/apiClient';
import type { Product } from '../../types/product';
import { isAdminUser } from '../../utils/auth';

const TRENDING_SEARCHES = ['Laptop', 'iPhone', 'Bike', 'Headphone'];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const wishCount = wishlistItems.length;
  const adminUser = isAdminUser(user);
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    try {
      setRecentSearches(JSON.parse(localStorage.getItem('bdshop-recent-searches') || '[]'));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const { data: suggestions = [] } = useQuery({
    queryKey: ['search-suggestions', searchQuery],
    queryFn: async () => {
      const res = await apiClient.get('/services', { params: { search: searchQuery, limit: '5' } });
      return (res.data.data.services || []) as Product[];
    },
    enabled: searchQuery.trim().length >= 2,
    staleTime: 60_000,
  });

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const commitSearch = (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    const next = [clean, ...recentSearches.filter((q) => q.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem('bdshop-recent-searches', JSON.stringify(next));
    setSearchQuery(clean);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(clean)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    commitSearch(searchQuery);
  };

  const SearchDropdown = () => {
    if (!searchOpen) return null;
    const hasSuggestions = suggestions.length > 0;
    return (
      <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {hasSuggestions && (
          <div className="py-2">
            <p className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-gray-400">Products</p>
            {suggestions.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => navigate(`/products/${product._id}`)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50"
              >
                <img
                  src={product.img || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop'}
                  alt={product.model}
                  className="h-10 w-10 rounded-lg bg-gray-50 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop';
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-gray-900">{product.model}</span>
                  <span className="text-xs font-semibold text-[#1a8a4a]">৳{product.price?.toLocaleString()}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="border-t border-gray-50 py-2">
          <p className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-gray-400">
            {recentSearches.length ? 'Recent searches' : 'Trending searches'}
          </p>
          {(recentSearches.length ? recentSearches : TRENDING_SEARCHES).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => commitSearch(q)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1a8a4a]"
            >
              {recentSearches.length ? <Clock className="h-4 w-4 text-gray-400" /> : <TrendingUp className="h-4 w-4 text-gray-400" />}
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="bd-container">
          <div className="flex items-center justify-start md:justify-between h-16 gap-4">

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 mr-2 md:mr-8">
              <div className="h-8 w-8 bg-[#1a8a4a] rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1a1a1a] tracking-tight">
                BD<span className="text-[#1a8a4a]">Shop</span>
              </span>
            </Link>

            {/* Search Bar — Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div ref={searchRef} className="relative flex w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-6 bg-[#1a8a4a] text-white text-sm font-semibold rounded-r-xl hover:bg-[#157a3f] transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
                <SearchDropdown />
              </div>
            </form>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">

              {adminUser ? (
                <Link
                  to="/dashboard"
                  className="relative hidden sm:flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  title="Admin dashboard"
                >
                  <LayoutDashboard className="h-6 w-6 text-gray-600 group-hover:text-[#1a8a4a] transition-colors" />
                  <span className="text-[10px] text-gray-500 hidden md:block mt-1 font-medium">Admin</span>
                </Link>
              ) : (
                <Link
                  to="/my-account?tab=wishlist"
                  className="relative hidden sm:flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  title="Wishlist"
                >
                  <div className="relative">
                    <Heart className="h-6 w-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                    {wishCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 h-4.5 min-w-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {wishCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 hidden md:block mt-1 font-medium">Wishlist</span>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                title="Cart"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-[#1a8a4a] transition-colors" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute -top-1.5 -right-2 h-4.5 min-w-[18px] px-1 bg-[#1a8a4a] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[10px] text-gray-500 hidden md:block mt-1 font-medium">Cart</span>
              </button>

              {/* User */}
              {user ? (
                <div className="relative ml-1 md:ml-2" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center p-1 rounded-full hover:bg-gray-50 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-full bg-[#1a8a4a] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {userInitial}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full z-[80] mt-3 w-72 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.02]">
                      <div className="bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1a8a4a] text-lg font-black text-white shadow-sm">
                            {userInitial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-gray-950">{user.displayName}</p>
                            <p className="mt-0.5 truncate text-xs font-semibold text-gray-500">{user.email}</p>
                            {adminUser && (
                              <span className="mt-2 inline-flex rounded-full bg-[#e8f5ee] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1a8a4a]">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                      {adminUser ? (
                        <>
                          <Link
                            to="/dashboard"
                            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-[#f8fbf9] hover:text-[#1a8a4a]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-[#e8f5ee] group-hover:text-[#1a8a4a]">
                              <LayoutDashboard className="h-4 w-4" />
                            </span>
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/dashboard?tab=products"
                            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-[#f8fbf9] hover:text-[#1a8a4a]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-[#e8f5ee] group-hover:text-[#1a8a4a]">
                              <Package className="h-4 w-4" />
                            </span>
                            Manage Store
                          </Link>
                          <Link
                            to="/dashboard?tab=orders"
                            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-[#f8fbf9] hover:text-[#1a8a4a]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-[#e8f5ee] group-hover:text-[#1a8a4a]">
                              <ShoppingCart className="h-4 w-4" />
                            </span>
                            Manage Orders
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/my-account"
                            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-[#f8fbf9] hover:text-[#1a8a4a]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-[#e8f5ee] group-hover:text-[#1a8a4a]">
                              <LayoutDashboard className="h-4 w-4" />
                            </span>
                            My Account
                          </Link>
                          <Link
                            to="/my-account?tab=orders"
                            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-[#f8fbf9] hover:text-[#1a8a4a]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-[#e8f5ee] group-hover:text-[#1a8a4a]">
                              <Package className="h-4 w-4" />
                            </span>
                            My Orders
                          </Link>
                          <Link
                            to="/my-account?tab=wishlist"
                            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-red-100 group-hover:text-red-500">
                              <Heart className="h-4 w-4" />
                            </span>
                            Wishlist
                          </Link>
                        </>
                      )}
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={logout}
                          className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-100">
                            <LogOut className="h-4 w-4" />
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 ml-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] font-semibold rounded-xl transition-colors min-h-[40px]">
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden sm:block">Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search - visible only on small screens */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#1a8a4a] text-white rounded-r-xl hover:bg-[#157a3f] transition-colors min-h-[44px]"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="h-8 w-8 bg-[#1a8a4a] rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1a1a1a] tracking-tight">
                BD<span className="text-[#1a8a4a]">Shop</span>
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1">
                {['Electronics', 'Vehicles', 'Accessories', 'Deals', 'New Arrivals'].map(cat => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1a8a4a] hover:bg-[#1a8a4a]/5 rounded-lg transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {user ? (
              <div className="p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{adminUser ? 'Admin' : 'My Account'}</h3>
                <div className="space-y-1">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    <LayoutDashboard className="h-4 w-4" /> {adminUser ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  {!adminUser && (
                    <Link to="/my-account?tab=orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Package className="h-4 w-4" /> Orders
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full py-3 bg-[#1a8a4a] text-white font-bold rounded-xl">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full py-3 bg-gray-100 text-[#1a1a1a] font-bold rounded-xl">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
