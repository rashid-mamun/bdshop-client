import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, ChevronDown, Package, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { CategoryNav } from './CategoryNav';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const wishCount = wishlistItems.length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

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
              <span className="text-xl font-bold text-[#1a1a1a] tracking-tight hidden sm:block">
                BD<span className="text-[#1a8a4a]">Shop</span>
              </span>
            </Link>

            {/* Search Bar — Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative flex w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">

              {/* Wishlist */}
              <Link
                to="/dashboard"
                className="relative flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
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

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                title="Cart"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-[#1a8a4a] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 h-4.5 min-w-[18px] px-1 bg-[#1a8a4a] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
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
                      {user.displayName?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                        <p className="text-sm font-bold text-[#1a1a1a] truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1a8a4a] transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" /> My Account
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1a8a4a] transition-colors"
                      >
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-4 w-4" /> Wishlist
                      </Link>
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
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
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">My Account</h3>
                <div className="space-y-1">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Package className="h-4 w-4" /> Orders
                  </Link>
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
