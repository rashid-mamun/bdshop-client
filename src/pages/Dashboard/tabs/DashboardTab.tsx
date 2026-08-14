import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  MapPin,
  Package,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  TicketPercent,
  Truck,
} from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useWishlistStore } from '../../../store/useWishlistStore';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  processing: 'bg-purple-50 text-purple-700 border-purple-100',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  delivered: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
};

const STATUS_PROGRESS: Record<string, number> = {
  pending: 18,
  confirmed: 36,
  processing: 56,
  shipped: 78,
  delivered: 100,
  cancelled: 100,
};

const formatDate = (date?: string) => {
  if (!date) return 'Recently';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
      const res = await apiClient.get('/orders/my-orders?limit=4');
      return res.data.data;
    },
    enabled: !!user,
  });

  const orders = ordersData?.orders || [];
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const stats = [
    { label: 'Orders', value: statsData?.total || 0, helper: 'All purchases', icon: Package, tab: 'orders' },
    { label: 'Active', value: statsData?.pending || 0, helper: 'Need tracking', icon: Clock, tab: 'orders' },
    { label: 'Completed', value: statsData?.completed || 0, helper: 'Delivered', icon: CheckCircle, tab: 'orders' },
    { label: 'Saved', value: wishlistItems.length, helper: 'Wishlist items', icon: Heart, tab: 'wishlist' },
  ];

  const quickActions = [
    { label: 'Track order', helper: 'Live delivery status', icon: Truck, to: '/track-order' },
    { label: 'Delivery addresses', helper: 'Update saved locations', icon: MapPin, tab: 'addresses' },
    { label: 'Returns', helper: 'Start a request', icon: RefreshCcw, to: '/returns' },
    { label: 'Wishlist', helper: `${wishlistItems.length} saved`, icon: Heart, tab: 'wishlist' },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:p-6">
          <div className="rounded-3xl bg-[#102f20] p-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white/85">
                <ShieldCheck className="h-4 w-4" />
                Secure account
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white/85">
                BDShop member
              </span>
            </div>
            <h2 className="mt-6 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {firstName}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70">
              Manage orders, saved products, delivery addresses and account security from one focused workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onTabChange('orders')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102f20] transition hover:bg-[#f8fbf9]"
              >
                View orders <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/products"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
              >
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-3xl border border-gray-100 bg-[#f8fbf9] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1a8a4a] shadow-sm">
                  <TicketPercent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-950">Member deal</p>
                  <p className="text-xs font-semibold text-gray-500">Use BDSHOP10 at checkout</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-950">Review rewards</p>
                  <p className="text-xs font-semibold text-gray-500">Review delivered products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onTabChange(stat.tab)}
            className="group rounded-3xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                <stat.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#1a8a4a]" />
            </div>
            <p className="mt-5 text-3xl font-black text-gray-950">{stat.value}</p>
            <p className="mt-1 text-sm font-black text-gray-900">{stat.label}</p>
            <p className="mt-1 text-xs font-semibold text-gray-400">{stat.helper}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-950">Recent orders</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Latest purchases with current status.</p>
            </div>
            <button
              onClick={() => onTabChange('orders')}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#e8f5ee] px-3 py-2 text-xs font-black text-[#1a8a4a]"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse p-5">
                  <div className="h-16 rounded-2xl bg-gray-100" />
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-black text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm font-medium text-gray-500">Your first order will appear here.</p>
              </div>
            ) : (
              orders.map((order: any) => {
                const firstItem = order.items?.[0];
                const status = order.status || 'pending';
                const progress = STATUS_PROGRESS[status] ?? 20;

                return (
                  <article key={order._id} className="p-5 transition hover:bg-gray-50/70">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-[#f8fbf9]">
                          <Package className="h-7 w-7 text-[#1a8a4a]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-gray-950">{order.orderNumber || `#ORD-${order._id?.slice(-6).toUpperCase()}`}</p>
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
                              {status}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm font-bold text-gray-700">
                            {firstItem?.name || 'BDShop order'}
                            {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-gray-500">
                            <span>{formatDate(order.createdAt)}</span>
                            <span>{order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}</span>
                          </div>
                          <div className="mt-3 h-1.5 max-w-sm overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-[#1a8a4a]" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 xl:flex-col xl:items-end">
                        <p className="text-lg font-black text-gray-950">৳{order.total?.toLocaleString()}</p>
                        <button
                          onClick={() => onTabChange('orders')}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 transition hover:border-[#1a8a4a]/30 hover:text-[#1a8a4a]"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="font-black text-gray-950">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const content = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-gray-900">{action.label}</span>
                    <span className="block truncate text-xs font-semibold text-gray-400">{action.helper}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </>
              );

              if (action.to) {
                return (
                  <Link key={action.label} to={action.to} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 text-left transition hover:bg-[#f8fbf9]">
                    {content}
                  </Link>
                );
              }
              return (
                <button key={action.label} onClick={() => onTabChange(action.tab!)} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 text-left transition hover:bg-[#f8fbf9]">
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
