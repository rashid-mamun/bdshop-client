import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../services/apiClient';
import { LayoutDashboard, ShoppingBag, Heart, MapPin, KeyRound, LogOut, Package, Star, Edit, Plus, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const BD_DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

export default function MyAccountPage() {
  const { user, logout } = useAuthStore();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders/my-orders');
      return res.data.data;
    },
  });

  const orders = ordersData?.orders || [];

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
  };

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'password', label: 'Change Password', icon: KeyRound },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
            
            {/* User Profile */}
            <div className="text-center mb-8 pb-8 border-b border-gray-100">
              <div className="h-20 w-20 bg-[#1a8a4a] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1a8a4a]/20">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="font-bold text-[#1a1a1a] text-lg">{user?.displayName}</h2>
              <p className="text-gray-500 text-sm mt-1 truncate">{user?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id 
                      ? 'bg-[#1a8a4a] text-white shadow-md shadow-[#1a8a4a]/20' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a8a4a]'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-semibold text-sm"
                >
                  <LogOut className="h-5 w-5 text-red-400" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-black text-[#1a1a1a]">Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Pending', value: orders.filter((o:any)=>o.status==='pending').length, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
                  { label: 'Completed', value: orders.filter((o:any)=>o.status==='delivered').length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
                  { label: 'Wishlist', value: '0', icon: Heart, color: 'text-pink-600 bg-pink-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1a1a1a]">{stat.value}</p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#1a1a1a]">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-[#1a8a4a] hover:underline">View All</button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No recent orders found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold">Total</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.slice(0, 5).map((order: any) => (
                          <tr key={order._id}>
                            <td className="py-4 text-sm font-bold text-[#1a1a1a]">{order._id.substring(0,8).toUpperCase()}</td>
                            <td className="py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 text-sm font-black text-[#1a8a4a]">৳{order.total?.toLocaleString()}</td>
                            <td className="py-4">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#1a1a1a]">My Addresses</h2>
                <button className="flex items-center gap-2 bg-[#1a8a4a] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#157a3f] transition-colors shadow-sm">
                  <Plus className="h-4 w-4" /> Add New
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border-2 border-[#1a8a4a] shadow-sm relative">
                  <span className="absolute top-4 right-4 bg-green-100 text-[#1a8a4a] text-[10px] font-bold px-2 py-1 rounded-md">DEFAULT</span>
                  <h3 className="font-bold text-[#1a1a1a] mb-1">{user?.displayName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{user?.phone || 'No phone added'}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    123 Main Street, Apt 4B<br/>
                    {user?.district || 'Dhaka'}, {user?.division || 'Dhaka'}<br/>
                    Bangladesh, 1200
                  </p>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-1 text-sm font-bold text-[#1a8a4a] hover:text-[#157a3f]"><Edit className="h-4 w-4" /> Edit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
              <h2 className="text-2xl font-black text-[#1a1a1a] mb-6">Change Password</h2>
              <form className="max-w-md space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" />
                </div>
                <button className="w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg active:scale-95 text-base mt-2">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Fallback for other tabs */}
          {['orders', 'wishlist', 'reviews'].includes(activeTab) && (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in duration-300">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Coming Soon</h3>
              <p className="text-gray-500">This section is currently under development.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

