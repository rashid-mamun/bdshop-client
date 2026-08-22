import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  PackageSearch,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import apiClient from '../../../services/apiClient';

const STATUS_CONFIG: Record<string, { label: string; classes: string; progress: number }> = {
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 border-amber-100', progress: 18 },
  confirmed: { label: 'Confirmed', classes: 'bg-blue-50 text-blue-700 border-blue-100', progress: 34 },
  processing: { label: 'Processing', classes: 'bg-purple-50 text-purple-700 border-purple-100', progress: 55 },
  shipped: { label: 'Shipped', classes: 'bg-indigo-50 text-indigo-700 border-indigo-100', progress: 78 },
  delivered: { label: 'Delivered', classes: 'bg-green-50 text-green-700 border-green-100', progress: 100 },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-700 border-red-100', progress: 100 },
};

const FILTERS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const TIMELINE_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const TIMELINE_META: Record<string, { label: string; desc: string; Icon: any }> = {
  pending: { label: 'Order Placed', desc: 'Your order has been submitted successfully', Icon: Clock },
  confirmed: { label: 'Confirmed', desc: 'Order confirmed and verified by our team', Icon: PackageCheck },
  processing: { label: 'Processing', desc: 'Items are being packed and prepared', Icon: PackageSearch },
  shipped: { label: 'Shipped', desc: 'Order is on its way with the courier', Icon: Truck },
  delivered: { label: 'Delivered', desc: 'Successfully delivered to your address', Icon: CheckCircle },
};

const formatDate = (date?: string) => {
  if (!date) return 'Recently';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

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
      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm xl:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
              <Truck className="h-3.5 w-3.5" />
              Order center
            </div>
            <h2 className="text-xl font-black tracking-tight text-gray-950">My orders</h2>
            <p className="mt-0.5 text-sm font-medium text-gray-500">Track purchases, delivery status and payment details.</p>
          </div>
          <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl bg-gray-50 p-1">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setStatusFilter(filter);
                  setPage(1);
                }}
                className={`min-h-[34px] shrink-0 rounded-xl px-3 text-xs font-black capitalize transition ${
                  statusFilter === filter ? 'bg-white text-[#1a8a4a] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {filter === 'all' ? 'All orders' : filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-black text-gray-900">No orders found</h3>
          <p className="mt-2 text-sm font-medium text-gray-500">
            {statusFilter !== 'all' ? `No ${statusFilter} orders yet.` : 'Start shopping to see orders here.'}
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-[#1a8a4a] px-5 text-sm font-black text-white hover:bg-[#157a3f]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedId === order._id;
            const currentStep = TIMELINE_STEPS.indexOf(order.status);
            const firstItem = order.items?.[0];

            return (
              <article key={order._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_200px] xl:items-center">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f8fbf9] ring-1 ring-gray-100">
                      {firstItem?.img ? (
                        <img
                          src={firstItem.img}
                          alt={firstItem.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <Package className="h-7 w-7 text-[#1a8a4a]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-gray-950">{order.orderNumber || `#ORD-${order._id?.slice(-6).toUpperCase()}`}</h3>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${status.classes}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-gray-700">
                        {firstItem?.name || 'BDShop order'}
                        {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-gray-500">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDate(order.createdAt)}</span>
                        {order.shippingAddress && (
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {order.shippingAddress.city || order.shippingAddress.district}</span>
                        )}
                        <span>{order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}</span>
                      </div>
                      <div className="mt-4 h-1.5 max-w-xl overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-[#1a8a4a]" style={{ width: `${status.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 xl:flex-col xl:items-end">
                    <p className="text-xl font-black text-gray-950">৳{order.total?.toLocaleString()}</p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-black text-gray-700 transition hover:border-[#1a8a4a]/30 hover:text-[#1a8a4a]"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/70 p-5">
                    {/* Order Items Breakdown */}
                    <div className="mb-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                      <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">Order Items</p>
                      <div className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                              {item.img ? (
                                <img src={item.img} alt={item.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
                              ) : (
                                <Package className="h-4 w-4 text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-gray-900">{item.name || item.model}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-black text-gray-900">৳{((item.price || 0) * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
                        <span className="text-sm font-black text-gray-500">Total</span>
                        <span className="text-sm font-black text-gray-950">৳{order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
                      <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Delivery Timeline</p>
                        {order.status === 'cancelled' ? (
                          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
                            <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                            <div>
                              <p className="text-sm font-black text-red-700">Order Cancelled</p>
                              <p className="text-xs text-red-500">This order has been cancelled</p>
                            </div>
                          </div>
                        ) : (
                          <ol className="relative space-y-0">
                            {TIMELINE_STEPS.map((step, idx) => {
                              const meta = TIMELINE_META[step];
                              const stepIdx = TIMELINE_STEPS.indexOf(step);
                              const isDone = currentStep >= stepIdx;
                              const isActive = currentStep === stepIdx;
                              const isLast = idx === TIMELINE_STEPS.length - 1;
                              const Icon = meta.Icon;
                              return (
                                <li key={step} className="flex gap-3">
                                  {/* Icon column */}
                                  <div className="flex flex-col items-center">
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 transition-all ${
                                      isDone
                                        ? 'bg-[#1a8a4a] ring-[#1a8a4a] text-white'
                                        : 'bg-white ring-gray-200 text-gray-300'
                                    } ${isActive ? 'shadow-lg shadow-green-200' : ''}`}>
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    {!isLast && (
                                      <div className={`w-0.5 flex-1 my-1 ${
                                        currentStep > stepIdx ? 'bg-[#1a8a4a]' : 'bg-gray-100'
                                      }`} style={{ minHeight: '20px' }} />
                                    )}
                                  </div>
                                  {/* Text column */}
                                  <div className={`pb-4 pt-1 min-w-0 flex-1 ${isLast ? '' : ''}`}>
                                    <p className={`text-sm font-black ${
                                      isDone ? (isActive ? 'text-[#1a8a4a]' : 'text-gray-700') : 'text-gray-400'
                                    }`}>
                                      {meta.label}
                                      {isActive && (
                                        <span className="ml-2 inline-flex items-center rounded-full bg-[#e8f5ee] px-2 py-0.5 text-[10px] font-black text-[#1a8a4a]">Current</span>
                                      )}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${
                                      isDone ? 'text-gray-500' : 'text-gray-300'
                                    }`}>{meta.desc}</p>
                                    {isActive && (
                                      <p className="text-[11px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {formatDate(order.updatedAt || order.createdAt)}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">Payment</p>
                          <div className="mt-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#1a8a4a]" />
                            <span className="text-sm font-black text-gray-900">{order.paymentStatus?.toUpperCase() || 'PENDING'}</span>
                          </div>
                        </div>
                        {order.shippingAddress && (
                          <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                            <p className="text-xs font-black uppercase tracking-wider text-gray-400">Ship to</p>
                            <p className="mt-2 text-sm font-bold text-gray-900">{order.shippingAddress.street}</p>
                            <p className="text-sm font-medium text-gray-500">
                              {order.shippingAddress.city || order.shippingAddress.district}, {order.shippingAddress.postalCode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-black text-gray-700">Page {page} of {pagination.pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
