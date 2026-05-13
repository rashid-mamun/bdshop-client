import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, Package, Heart, Star, MapPin, 
  Lock, LogOut, Edit3, Settings, ChevronRight,
  Menu, X
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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'reviews', label: 'My Reviews', icon: Star },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'password', label: 'Security', icon: Lock },
];

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
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
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-500">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-black text-gray-900 tracking-tight">MY ACCOUNT</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="max-w-7xl mx-auto lg:px-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Overlay (Mobile) */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 w-72 bg-white lg:bg-transparent z-50 transform transition-transform duration-300 lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:w-80 shrink-0
          `}>
            <div className="h-full flex flex-col p-6 lg:p-0">
              {/* Mobile Close */}
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-6 right-6 p-2 text-gray-400">
                <X className="h-6 w-6" />
              </button>

              {/* Profile Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-2xl bg-[#1a8a4a] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-green-100 overflow-hidden">
                      {(user as any).profileImage ? (
                        <img src={(user as any).profileImage} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#1a8a4a] transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <h2 className="mt-4 font-black text-gray-900 text-lg leading-tight">{user.displayName}</h2>
                  <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                  
                  <div className="mt-4 w-full pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Member Since</span>
                    <span className="text-gray-900">{new Date(user.createdAt || '').getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Nav Menu */}
              <nav className="space-y-1.5 flex-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-[#1a8a4a] text-white shadow-lg shadow-green-100 translate-x-1' 
                        : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                      }
                    `}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="mt-6 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 px-4 lg:px-0">
            {/* Page Header (Desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight capitalize">
                  {activeTab.replace('-', ' ')}
                </h1>
                <p className="text-gray-500 text-sm mt-1 font-medium">
                  Manage your account settings and track your activities
                </p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <Settings className="h-4 w-4" /> Edit Profile
              </button>
            </div>

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
