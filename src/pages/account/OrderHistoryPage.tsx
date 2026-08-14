import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../services/apiClient';
import { Package, Search, ChevronRight, Filter } from 'lucide-react';

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders/my-orders');
      return res.data.data;
    },
    enabled: isAuthenticated,
  });

  const orders = ordersData?.orders || [];

  if (!isAuthenticated) {
    return (
      <div className="bg-[#f8f9fa] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-lg w-full text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
            <Package className="h-8 w-8 text-[#1a8a4a]" />
          </div>
          <h2 className="text-3xl font-black text-[#1a1a1a] mb-2">Order History</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Please log in to your account to view your complete order history and manage returns.</p>
          
          <Link to="/login" className="block w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-95 text-base mb-4">
            Login to View Orders
          </Link>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">OR</span></div>
          </div>

          <Link to="/track-order" className="block w-full bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-200 font-bold py-4 rounded-xl transition-all active:scale-95 text-base">
            Track a Guest Order
          </Link>
        </div>
      </div>
    );
  }

  const filteredOrders = statusFilter 
    ? orders.filter((o: any) => o.status === statusFilter)
    : orders;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'processing': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'shipped': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'delivered': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 px-4">
      <div className="bd-container max-w-5xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1a1a1a]">My Orders</h1>
            <p className="text-gray-500 mt-1">View and manage all your past purchases</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-semibold text-[#1a1a1a] py-1 pr-6"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading your orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link to="/products" className="inline-block bg-[#1a8a4a] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#157a3f] transition-all">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order: any) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-bold text-[#1a1a1a]">{order.orderNumber || order._id.substring(0, 10).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            {order.items?.length || 0} items
                          </span>
                        </td>
                        <td className="px-6 py-5 font-black text-[#1a8a4a]">
                          ৳{order.total?.toLocaleString()}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border} uppercase tracking-wider`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => navigate(`/track-order?orderId=${encodeURIComponent(order.orderNumber || order._id)}&email=${encodeURIComponent(order.email)}`)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#1a8a4a] hover:text-[#157a3f] transition-colors"
                          >
                            View <ChevronRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
