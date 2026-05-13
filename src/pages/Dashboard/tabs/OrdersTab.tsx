import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { Link } from 'react-router-dom';
import { Package, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50 border border-amber-200' },
  confirmed:  { label: 'Confirmed',  color: 'text-blue-700',   bg: 'bg-blue-50 border border-blue-200' },
  processing: { label: 'Processing', color: 'text-purple-700', bg: 'bg-purple-50 border border-purple-200' },
  shipped:    { label: 'Shipped',    color: 'text-indigo-700', bg: 'bg-indigo-50 border border-indigo-200' },
  delivered:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-50 border border-green-200' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50 border border-red-200' },
};

const FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const TIMELINE_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrdersTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const res = await apiClient.get(`/orders/my-orders?${params}`);
      return res.data.data;
    },
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setStatusFilter(f); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              statusFilter === f
                ? 'bg-[#1a8a4a] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a8a4a] hover:text-[#1a8a4a]'
            }`}
          >
            {f === 'all' ? 'All Orders' : f}
          </button>
        ))}
      </div>

      {/* Orders */}
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="h-16 w-16 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">No orders found</h3>
          <p className="text-gray-500 text-sm mb-5">
            {statusFilter !== 'all' ? `No ${statusFilter} orders` : 'Start shopping to see your orders here'}
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-[#1a8a4a] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#157a3f] transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        orders.map((order: any) => {
          const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const isExpanded = expandedId === order._id;
          const currentStep = TIMELINE_STEPS.indexOf(order.status);

          return (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-[#e8f5ee] rounded-xl flex items-center justify-center shrink-0">
                      <Package className="h-7 w-7 text-[#1a8a4a]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {order.shippingAddress && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />{order.shippingAddress.city}
                        </p>
                      )}
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {order.items?.slice(0, 2).map((item: any, i: number) => (
                          <span key={i} className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                            {item.quantity}× {item.name}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-xs text-gray-400 px-2 py-1">+{order.items.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    <p className="font-black text-[#1a8a4a] text-lg">৳{order.total?.toLocaleString()}</p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a8a4a] transition-colors"
                    >
                      {isExpanded ? <><ChevronUp className="h-3.5 w-3.5" /> Hide Details</> : <><ChevronDown className="h-3.5 w-3.5" /> View Details</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-5">
                  {/* Timeline */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Timeline</p>
                    <div className="flex items-center gap-0">
                      {TIMELINE_STEPS.filter(s => s !== 'confirmed').map((step, i, arr) => {
                        const stepIdx = TIMELINE_STEPS.indexOf(step);
                        const done = currentStep >= stepIdx;
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done ? 'bg-[#1a8a4a] border-[#1a8a4a] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {done ? '✓' : i + 1}
                              </div>
                              <span className={`text-[9px] capitalize font-medium ${done ? 'text-[#1a8a4a]' : 'text-gray-400'}`}>{step}</span>
                            </div>
                            {i < arr.length - 1 && <div className={`flex-1 h-0.5 mb-4 mx-1 ${done && currentStep > stepIdx ? 'bg-[#1a8a4a]' : 'bg-gray-200'}`} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                            <span className="text-sm font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery + Payment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.shippingAddress && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Delivery Address</p>
                        <p className="text-sm text-gray-700">{order.shippingAddress.street}</p>
                        <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                      </div>
                    )}
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payment</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {order.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                      <p className="text-xl font-black text-gray-900 mt-2">৳{order.total?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
            className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
