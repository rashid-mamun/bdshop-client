import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { 
  LayoutDashboard, Package, Heart, Star, MapPin, 
  Lock, LogOut, Edit3, ChevronRight,
  Menu, X, BadgeCheck, ShieldCheck
} from 'lucide-react';

// Tabs
import DashboardTab from './tabs/DashboardTab';
import OrdersTab from './tabs/OrdersTab';
import WishlistTab from './tabs/WishlistTab';
import ReviewsTab from './tabs/ReviewsTab';
import AddressesTab from './tabs/AddressesTab';
import ChangePasswordTab from './tabs/ChangePasswordTab';
import EditProfileModal from './tabs/EditProfileModal';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', description: 'Account overview', icon: LayoutDashboard },
  { id: 'orders', label: 'My Orders', description: 'Track and manage orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', description: 'Saved products', icon: Heart },
  { id: 'reviews', label: 'My Reviews', description: 'Ratings and feedback', icon: Star },
  { id: 'addresses', label: 'Addresses', description: 'Delivery locations', icon: MapPin },
  { id: 'password', label: 'Security', description: 'Password and access', icon: Lock },
];

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const activeTabMeta = TABS.find((tab) => tab.id === activeTab) || TABS[0];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync tab scroll on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fbf9_0%,_#f8fafc_260px,_#f8fafc_100%)]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 relative z-30 flex items-center justify-between shadow-sm">
        <button onClick={() => setIsSidebarOpen(true)} className="min-h-[44px] min-w-[44px] -ml-2 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center">
          <Menu className="h-6 w-6" />
        </button>
        <div className="text-center">
          <h1 className="font-black text-gray-900 tracking-tight">{activeTabMeta.label}</h1>
          <p className="text-[11px] font-semibold text-gray-400">{activeTabMeta.description}</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="bd-container py-4 lg:py-5 xl:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-5 xl:gap-6 2xl:gap-8">
          
          {/* Sidebar Overlay (Mobile) */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 w-72 bg-white lg:bg-transparent z-50 transform transition-transform duration-300 lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:w-[220px] xl:w-[250px] 2xl:w-[280px] shrink-0
          `}>
            <div className="h-full flex flex-col bg-white p-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:rounded-[1.75rem] lg:border lg:border-gray-100 lg:p-3 lg:shadow-sm xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:p-4 2xl:top-28 2xl:max-h-[calc(100vh-8rem)] 2xl:p-5">
              {/* Mobile Close */}
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-6 right-6 p-2 text-gray-400">
                <X className="h-6 w-6" />
              </button>

              {/* Profile Card */}
              <div className="relative mb-3 overflow-hidden rounded-3xl border border-[#1a8a4a]/10 bg-[radial-gradient(circle_at_top_left,_#e8f5ee,_transparent_40%),#ffffff] p-4 lg:mb-2 lg:rounded-2xl lg:p-3 2xl:p-4">
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#e8f5ee] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a8a4a] lg:hidden 2xl:inline-flex">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </div>
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-2.5 lg:text-left 2xl:flex-col 2xl:text-center">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-3xl bg-[#1a8a4a] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-green-100 overflow-hidden ring-4 ring-white lg:h-10 lg:w-10 lg:rounded-xl lg:text-sm 2xl:h-16 2xl:w-16 2xl:rounded-2xl 2xl:text-2xl">
                      {(user as any).profileImage ? (
                        <img src={(user as any).profileImage} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#1a8a4a] transition-colors lg:h-6 lg:w-6 2xl:h-8 2xl:w-8"
                      title="Edit profile"
                    >
                      <Edit3 className="h-4 w-4 lg:h-3.5 lg:w-3.5 2xl:h-4 2xl:w-4" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="hidden items-center gap-1.5 rounded-full bg-[#e8f5ee] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#1a8a4a] lg:inline-flex 2xl:hidden">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </div>
                    <h2 className="mt-4 font-black text-gray-900 text-lg leading-tight lg:mt-1 lg:truncate lg:text-sm 2xl:mt-4 2xl:text-lg">{user.displayName}</h2>
                    <p className="max-w-full truncate text-sm text-gray-500 font-medium lg:text-[11px] 2xl:text-sm">{user.email}</p>
                  </div>
                  
                  <div className="mt-4 grid w-full grid-cols-2 gap-2 lg:hidden 2xl:grid">
                    <div className="rounded-2xl bg-white/80 px-3 py-3 text-left ring-1 ring-gray-100 lg:rounded-xl lg:px-2.5 lg:py-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 lg:text-[9px]">Member</p>
                      <p className="mt-1 text-sm font-black text-gray-900 lg:text-xs 2xl:text-sm">
                        {user.createdAt && !isNaN(new Date(user.createdAt).getTime()) ? new Date(user.createdAt).getFullYear() : 2026}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 px-3 py-3 text-left ring-1 ring-gray-100 lg:rounded-xl lg:px-2.5 lg:py-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 lg:text-[9px]">Saved</p>
                      <p className="mt-1 text-sm font-black text-gray-900 lg:text-xs 2xl:text-sm">{wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav Menu */}
              <nav className="space-y-0.5 flex-1 overflow-y-auto pr-1 lg:space-y-0.5 xl:space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200
                      lg:gap-2.5 lg:px-3 lg:py-2 lg:text-xs lg:rounded-xl
                      xl:gap-3 xl:px-3.5 xl:py-2.5 xl:text-sm xl:rounded-2xl
                      2xl:px-4 2xl:py-3 2xl:text-sm
                      ${activeTab === tab.id 
                        ? 'bg-[#1a8a4a] text-white shadow-lg shadow-green-100' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl lg:h-7 lg:w-7 lg:rounded-lg xl:h-8 xl:w-8 xl:rounded-xl ${activeTab === tab.id ? 'bg-white/15 text-white' : 'bg-gray-50 text-gray-400'}`}>
                      <tab.icon className="h-4 w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block">{tab.label}</span>
                      {/* Hide description on compact lg viewports, show on xl+ */}
                      <span className={`hidden xl:block truncate text-[11px] font-semibold ${activeTab === tab.id ? 'text-white/70' : 'text-gray-400'}`}>{tab.description}</span>
                    </span>
                    {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${activeTab === tab.id ? 'bg-white text-[#1a8a4a]' : 'bg-red-50 text-red-600'}`}>
                        {wishlistItems.length}
                      </span>
                    )}
                    {activeTab === tab.id && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                  </button>
                ))}
              </nav>

              {/* Secure account badge - hidden at lg to save space */}
              <div className="hidden xl:block mt-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#1a8a4a] shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Secure account</p>
                    <p className="text-[10px] font-semibold text-gray-400">Protected checkout</p>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 xl:mt-3 xl:gap-3.5 xl:px-4 xl:py-3 xl:text-sm xl:rounded-2xl"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Page Header (Desktop) */}
            {/*
            <div className="hidden lg:flex items-center justify-between mb-6 rounded-3xl border border-gray-100 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1a8a4a]">
                  <Sparkles className="h-3.5 w-3.5" />
                  My BDShop
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {activeTabMeta.label}
                </h1>
                <p className="text-gray-500 text-sm mt-1 font-medium">
                  {activeTabMeta.description}
                </p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <Settings className="h-4 w-4" /> Edit Profile
              </button>
            </div>
            */}

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'dashboard' && <DashboardTab onTabChange={handleTabChange} />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'wishlist' && <WishlistTab />}
              {activeTab === 'reviews' && <ReviewsTab />}
              {activeTab === 'addresses' && <AddressesTab />}
              {activeTab === 'password' && <ChangePasswordTab />}
            </div>
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
}
