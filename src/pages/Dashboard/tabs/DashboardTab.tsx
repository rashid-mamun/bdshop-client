import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { Package, Clock, CheckCircle, Heart, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_BADGES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  processing: 'bg-blue-50 text-blue-700 border-blue-100',
  shipped: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
};

export default function DashboardTab({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  const { data: statsData } = useQuery({
    queryKey: ['my-stats', user?.email],
    queryFn: async () => {
      const res = await apiClient.get('/orders/my-stats');
      return res.data.data;
    },
    enabled: !!user,
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders-summary', user?.email],
    queryFn: async () => {
      const res = await apiClient.get('/orders/my-orders?limit=5');
      return res.data.data;
    },
    enabled: !!user,
  });

  const orders = ordersData?.orders || [];
  
  const stats = [
    { label: 'Total Orders', value: statsData?.total || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: statsData?.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed', value: statsData?.completed || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Wishlist', value: wishlistItems.length, icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <button onClick={() => onTabChange('orders')} className="text-xs font-bold text-[#1a8a4a] hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded-lg w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingBag className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-sm font-medium text-gray-500">No orders yet</p>
                      <Link to="/products" className="mt-3 text-xs font-bold text-[#1a8a4a] bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">#ORD-{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">৳{order.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${STATUS_BADGES[order.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onTabChange('orders')}
                        className="text-xs font-bold text-[#1a8a4a] hover:bg-green-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-green-100 transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
