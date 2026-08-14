import { useEffect, useState, type ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { toUserFriendlyError } from '../../utils/userFriendlyError';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Plus, Pencil, Trash2,
  X, Check, Search, TrendingUp, DollarSign, UserCheck, Shield, Link, Upload
} from 'lucide-react';

type Tab = 'overview' | 'products' | 'orders' | 'customers';

const ORDER_STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS_OPTIONS = ['pending', 'paid', 'failed', 'refunded'];
const ADMIN_TABS: Tab[] = ['overview', 'products', 'orders', 'customers'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  confirmed:  { label: 'Confirmed',  color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  processing: { label: 'Processing', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  shipped:    { label: 'Shipped',    color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  delivered:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  paid:     { label: 'Paid',     color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  pending:  { label: 'Pending',  color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  failed:   { label: 'Failed',   color: 'text-red-700',   bg: 'bg-red-50 border-red-200' },
  refunded: { label: 'Refunded', color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200' },
};

const formatCurrency = (value: number) => `৳${value.toLocaleString()}`;
const formatCompactCurrency = (value: number) => {
  if (value >= 1000000) return `৳${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `৳${Math.round(value / 1000)}k`;
  return `৳${value}`;
};

function ProductForm({ initial, onSave, onCancel, isPending }: {
  initial?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    model: initial?.model || '',
    price: initial?.price || '',
    category: initial?.category || '',
    description: initial?.description || '',
    config: initial?.config || '',
    madeIn: initial?.madeIn || '',
    originalPrice: initial?.originalPrice || '',
    stock: initial?.stock ?? 0,
    discountPercent: initial?.discountPercent || '',
    isFeatured: Boolean(initial?.isFeatured),
    isFlashDeal: Boolean(initial?.isFlashDeal),
    isNewArrival: Boolean(initial?.isNewArrival),
    tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : '',
    img: initial?.img || '',
    imgPublicId: initial?.imgPublicId || '',
    imgStorage: initial?.imgStorage || '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageUploadInfo, setImageUploadInfo] = useState('');

  const set = (k: string, v: string) =>
    setForm((f) => (
      k === 'img'
        ? { ...f, img: v, imgPublicId: '', imgStorage: v ? 'external' : '' }
        : { ...f, [k]: v }
    ));
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all";
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setImageUploadError('');
    setImageUploadInfo('');

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      const res = await apiClient.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = res.data?.data?.url;
      if (!imageUrl) throw new Error('Upload completed without an image URL');
      const storage = res.data?.data?.storage;
      setForm((f) => ({
        ...f,
        img: imageUrl,
        imgPublicId: res.data?.data?.public_id || '',
        imgStorage: storage || '',
      }));
      setImageUploadInfo(storage === 'local' ? 'Uploaded locally and URL filled.' : 'Uploaded to Cloudinary and URL filled.');
    } catch (error: any) {
      setImageUploadError(toUserFriendlyError(error, 'Image upload failed. Please try another image.'));
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const saveForm = () => {
    const primaryImage = form.img.trim();
    onSave({
      ...form,
      img: primaryImage,
      images: primaryImage ? [primaryImage] : [],
      imgPublicId: form.imgPublicId,
      imgStorage: form.imgStorage,
      price: Number(form.price),
      originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
      stock: Number(form.stock),
      discountPercent: form.discountPercent === '' ? undefined : Number(form.discountPercent),
      tags: String(form.tags).split(',').map((tag) => tag.trim()).filter(Boolean),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-gray-50 border border-gray-100 rounded-2xl my-2">
      {([
        ['name', 'Brand Name'],
        ['model', 'Model Name'],
        ['category', 'Category'],
        ['config', 'Configuration'],
        ['madeIn', 'Made In'],
        ['img', 'Image URL'],
      ] as [string, string][]).map(([k, label]) => (
        <div key={k}>
          <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">{label}</label>
          <input value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} className={inputCls} />
        </div>
      ))}
      <div className="md:col-span-2 grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          {form.img ? (
            <img src={form.img} alt="" className="h-full w-full object-cover" />
          ) : (
            <Package className="h-8 w-8 text-gray-300" />
          )}
        </div>
        <div className="min-w-0">
          <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Image Preview</label>
          <p className="mb-3 text-xs font-semibold text-gray-500">Paste a direct image URL, or upload a JPG, PNG, WebP, or GIF to fill the URL automatically. Saving updates the product gallery.</p>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-xl border border-[#1a8a4a]/30 px-4 text-xs font-black text-[#1a8a4a] transition-colors hover:bg-[#e8f5ee]">
              <Upload className="h-4 w-4" />
              {isUploadingImage ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} disabled={isUploadingImage} className="hidden" />
            </label>
            {form.img && (
              <a href={form.img} target="_blank" rel="noreferrer" className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-[#1a8a4a]/30 px-4 text-xs font-black text-[#1a8a4a] transition-colors hover:bg-[#e8f5ee]">
              <Link className="h-4 w-4" />
              Open Image URL
              </a>
            )}
          </div>
          {imageUploadInfo && <p className="mt-2 text-xs font-semibold text-green-700">{imageUploadInfo}</p>}
          {imageUploadError && <p className="mt-2 text-xs font-semibold text-red-600">{imageUploadError}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Price (৳)</label>
        <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} min="0" />
      </div>
      <div>
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Original Price (optional)</label>
        <input type="number" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} className={inputCls} min="0" />
      </div>
      <div>
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Stock</label>
        <input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} className={inputCls} min="0" step="1" />
      </div>
      <div>
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Discount % (optional)</label>
        <input type="number" value={form.discountPercent} onChange={(e) => set('discountPercent', e.target.value)} className={inputCls} min="0" max="100" />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Tags (comma separated)</label>
        <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="audio, wireless, bestseller" />
      </div>
      <div className="md:col-span-2 grid gap-3 sm:grid-cols-3">
        {([
          ['isFeatured', 'Featured product'],
          ['isFlashDeal', 'Flash deal'],
          ['isNewArrival', 'New arrival'],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700">
            <input type="checkbox" checked={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))} className="h-4 w-4 accent-[#1a8a4a]" />
            {label}
          </label>
        ))}
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} rows={3} />
      </div>
      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-200 transition-colors flex items-center gap-2">
          <X className="h-4 w-4" /> Cancel
        </button>
        <button onClick={saveForm} disabled={isPending || isUploadingImage} className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#1a8a4a] hover:bg-[#157a3f] transition-colors flex items-center gap-2 disabled:opacity-50">
          <Check className="h-4 w-4" /> {isPending ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const initialTab = searchParams.get('tab') as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(initialTab && ADMIN_TABS.includes(initialTab) ? initialTab : 'overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab | null;
    if (tab && ADMIN_TABS.includes(tab) && tab !== activeTab) {
      setActiveTab(tab);
    }
    if (!tab && activeTab !== 'overview') {
      setActiveTab('overview');
    }
  }, [activeTab, searchParams]);

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      setSearchParams({}, { replace: true });
      return;
    }
    setSearchParams({ tab }, { replace: true });
  };

  // Queries
  const { data: summaryStats } = useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/orders/stats/summary');
      return res.data.data;
    },
  });

  const { data: serviceStats } = useQuery({
    queryKey: ['admin-service-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/services/stats/overview');
      return res.data.data;
    },
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders', { params: { limit: '50' } });
      return res.data.data.orders as any[];
    },
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await apiClient.get('/services', { params: { limit: '100' } });
      return res.data.data.services as any[];
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await apiClient.get('/users', { params: { limit: '100' } });
      return res.data.data.users as any[];
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/services', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); queryClient.invalidateQueries({ queryKey: ['admin-service-stats'] }); setShowProductForm(false); success('Product created!'); },
    onError: (e: any) => toastError(toUserFriendlyError(e, 'Product could not be created. Please try again.')),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.put(`/services/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); setEditingProduct(null); success('Product updated!'); },
    onError: (e: any) => toastError(toUserFriendlyError(e, 'Product could not be updated. Please try again.')),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/services/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); queryClient.invalidateQueries({ queryKey: ['admin-service-stats'] }); success('Product deleted'); },
    onError: () => toastError('Delete failed'),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status, paymentStatus }: { id: string; status?: string; paymentStatus?: string }) => apiClient.put(`/orders/${id}`, { status, paymentStatus }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); queryClient.invalidateQueries({ queryKey: ['admin-order-stats'] }); success('Order updated!'); },
    onError: (e: any) => toastError(toUserFriendlyError(e, 'Order could not be updated. Please try again.')),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => apiClient.put('/users/role', { email, role }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); success('User role updated!'); },
    onError: (e: any) => toastError(toUserFriendlyError(e, 'Failed to update user role')),
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (email: string) => apiClient.put(`/users/${email}/deactivate`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); success('User deactivated'); },
    onError: (e: any) => toastError(toUserFriendlyError(e, 'User could not be deactivated. Please try again.')),
  });

  // Analytics
  const totalRevenue = summaryStats?.totalRevenue ?? (ordersData?.filter((o) => o.paymentStatus === 'paid').reduce((s: number, o: any) => s + (o.total || 0), 0) || 0);
  const totalOrders = summaryStats?.totalOrders ?? (ordersData?.length || 0);
  const totalProducts = serviceStats?.totalServices ?? (productsData?.length || 0);
  const totalCustomers = usersData?.length || 0;

  const monthBuckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    return {
      key,
      name: date.toLocaleString('default', { month: 'short' }),
      revenue: 0,
      orders: 0,
    };
  });
  const monthlyRevenue = new Map(monthBuckets.map((bucket) => [bucket.key, { ...bucket }]));
  ordersData?.filter((o: any) => o.paymentStatus === 'paid').forEach((o: any) => {
    const date = new Date(o.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = monthlyRevenue.get(key);
    if (!bucket) return;
    bucket.revenue += o.total || 0;
    bucket.orders += 1;
  });
  const chartData = Array.from(monthlyRevenue.values());
  const chartHasRevenue = chartData.some((item) => item.revenue > 0);
  const bestRevenueMonth = chartData.reduce((best, item) => (item.revenue > best.revenue ? item : best), chartData[0]);
  const latestRevenue = chartData[chartData.length - 1]?.revenue || 0;
  const paidOrdersCount = chartData.reduce((sum, item) => sum + item.orders, 0);

  const filteredOrders = ordersData?.filter((o: any) => {
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return o.email?.toLowerCase().includes(q) || o._id?.toLowerCase().includes(q) || o.status?.toLowerCase().includes(q);
  });

  const filteredCustomers = usersData?.filter((u: any) => {
    if (!customerSearch) return true;
    const q = customerSearch.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.displayName?.toLowerCase().includes(q);
  });

  const TABS = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'customers', label: 'Customers', icon: Users },
  ];

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <Navigate to="/my-account" replace />;
  }

  return (
    <div className="bg-[#f4f7f5] min-h-screen pb-20 md:pb-8">
      {/* Header banner */}
      <div className="bg-gradient-to-br from-[#0f2617] to-[#1a3d26] px-4 py-8 sm:px-5 lg:py-10">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 sm:px-1 md:flex-row md:items-center md:justify-between xl:max-w-[1240px] 2xl:max-w-[1320px]">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-[#1a1a1a] shadow-lg sm:h-16 sm:w-16">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Admin Portal</h1>
              <p className="mt-1 text-sm font-medium text-white/65">Manage store, products, orders and users</p>
            </div>
          </div>
          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur md:w-auto">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 font-bold text-white">
               {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
             </div>
             <div className="min-w-0 pr-2">
               <p className="truncate text-sm font-bold leading-tight text-white">{user?.displayName}</p>
               <p className="text-xs font-black uppercase tracking-wide text-amber-400">{user?.role}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-1 w-full max-w-[1180px] px-4 sm:px-5 lg:px-6 xl:max-w-[1240px] 2xl:max-w-[1320px]">
        {/* Tab nav */}
        <div className="mb-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm scrollbar-hide md:mb-8">
          <div className="grid min-w-[560px] grid-cols-4">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => selectTab(key as Tab)}
              className={`flex min-h-[52px] items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'border-[#1a8a4a] bg-[#f8fbf9] text-[#1a8a4a]'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50 border-green-100' },
                { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                { label: 'Customers', value: totalCustomers, icon: UserCheck, color: 'text-orange-600 bg-orange-50 border-orange-100' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex min-h-[112px] items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border sm:h-14 sm:w-14 ${color}`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="mt-1 truncate text-2xl font-black text-[#1a1a1a]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-black text-[#1a8a4a]">
                      <TrendingUp className="h-4 w-4" /> Revenue trend
                    </p>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-gray-950">Last 6 months performance</h3>
                    <p className="mt-1 text-sm font-semibold text-gray-500">Paid order revenue by month</p>
                  </div>
                  <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-wide text-green-700">This month</p>
                    <p className="mt-1 text-lg font-black text-gray-950">{formatCurrency(latestRevenue)}</p>
                  </div>
                </div>
                {chartHasRevenue ? (
                  <div className="h-[280px] sm:h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 14, right: 18, left: 0, bottom: 8 }}>
                        <defs>
                          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1a8a4a" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="#1a8a4a" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} width={54} tickFormatter={(v) => formatCompactCurrency(Number(v))} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                        <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Revenue']} cursor={{ stroke: '#1a8a4a', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 18px 40px rgba(15,23,42,0.12)', fontWeight: 800 }} />
                        <Area type="monotone" dataKey="revenue" stroke="#1a8a4a" strokeWidth={4} fill="url(#revenueFill)" dot={{ r: 4, strokeWidth: 3, fill: '#ffffff', stroke: '#1a8a4a' }} activeDot={{ r: 7, strokeWidth: 4, fill: '#1a8a4a', stroke: '#dcfce7' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm font-semibold text-gray-400 sm:h-[300px]">No paid revenue data yet</div>
                )}
                <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">Paid orders</p>
                    <p className="mt-1 text-xl font-black text-gray-950">{paidOrdersCount}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">Peak revenue</p>
                    <p className="mt-1 text-xl font-black text-gray-950">{formatCurrency(bestRevenueMonth?.revenue || 0)}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">Range</p>
                    <p className="mt-1 text-xl font-black text-gray-950">6 months</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="font-bold text-[#1a1a1a] mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {ordersData?.slice(0, 6).map((order: any) => {
                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={order._id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <div className="min-w-0 flex-1 pr-4">
                          <p className="font-semibold text-sm text-[#1a1a1a] truncate">{order.email}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#1a1a1a] text-sm">৳{order.total?.toLocaleString()}</p>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  }) || <p className="text-gray-400 text-sm">No orders yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === 'products' && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Products Inventory</h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); }} className="bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {showProductForm && !editingProduct && (
                <ProductForm
                  onSave={(data) => createProductMutation.mutate(data)}
                  onCancel={() => setShowProductForm(false)}
                  isPending={createProductMutation.isPending}
                />
              )}

              {productsLoading ? (
                <div className="space-y-3 mt-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 w-full bg-gray-50 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-4 rounded-tl-xl">Product</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Price</th>
                        <th className="px-5 py-4 text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productsData?.map((product: any) => (
                        editingProduct?._id === product._id ? (
                          <tr key={product._id} className="bg-gray-50/50">
                            <td colSpan={4} className="p-0">
                              <ProductForm
                                initial={product}
                                onSave={(data) => updateProductMutation.mutate({ id: product._id, data })}
                                onCancel={() => setEditingProduct(null)}
                                isPending={updateProductMutation.isPending}
                              />
                            </td>
                          </tr>
                        ) : (
                          <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img src={product.img} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100" />
                                <div>
                                  <p className="font-bold text-[#1a1a1a] line-clamp-1">{product.model}</p>
                                  <p className="text-xs text-gray-500 line-clamp-1">{product.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs font-semibold text-[#1a8a4a] bg-[#e8f5ee] px-2.5 py-1 rounded-md">{product.category || 'N/A'}</span>
                            </td>
                            <td className="px-5 py-3 font-bold text-[#1a1a1a]">৳{product.price?.toLocaleString()}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => setEditingProduct(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => { if (confirm('Delete this product?')) deleteProductMutation.mutate(product._id); }}
                                  disabled={deleteProductMutation.isPending}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === 'orders' && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-gray-950">Order Management</h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">{filteredOrders?.length || 0} orders ready for review</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search by email, ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-[#1a8a4a]/30 hover:shadow-sm focus:border-[#1a8a4a]/60 focus:ring-4 focus:ring-[#1a8a4a]/10"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {ordersLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 w-full bg-gray-50 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full min-w-[1120px] text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50 text-xs font-black uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4 rounded-tl-2xl">Order ID</th>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Product Status</th>
                        <th className="px-5 py-4">Payment Status</th>
                        <th className="px-5 py-4 text-right rounded-tr-2xl">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders?.map((order: any) => {
                        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                        const paymentStatus = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.pending;
                        return (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 font-mono text-xs font-bold uppercase text-gray-500">#{order._id.slice(-8)}</td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-[#1a1a1a]">{order.email}</p>
                              <p className="text-xs text-gray-500">{order.shippingAddress?.city || 'No address'}</p>
                            </td>
                            <td className="px-5 py-4 font-semibold text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-5 py-4 font-black text-[#1a1a1a]">৳{order.total?.toLocaleString()}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex min-h-[28px] items-center rounded-full border px-3 text-xs font-black ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex min-h-[28px] items-center rounded-full border px-3 text-xs font-black ${paymentStatus.bg} ${paymentStatus.color}`}>
                                {paymentStatus.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <select
                                  aria-label="Update order status"
                                  value={order.status}
                                  onChange={(e) => updateOrderMutation.mutate({ id: order._id, status: e.target.value })}
                                  className="min-h-[38px] rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 outline-none transition-all hover:border-[#1a8a4a]/40 focus:border-[#1a8a4a] focus:ring-4 focus:ring-[#1a8a4a]/10"
                                >
                                  {ORDER_STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                  ))}
                                </select>
                                <select
                                  aria-label="Update payment status"
                                  value={order.paymentStatus || 'pending'}
                                  onChange={(e) => updateOrderMutation.mutate({ id: order._id, paymentStatus: e.target.value })}
                                  className="min-h-[38px] rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 outline-none transition-all hover:border-[#1a8a4a]/40 focus:border-[#1a8a4a] focus:ring-4 focus:ring-[#1a8a4a]/10"
                                >
                                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredOrders?.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No orders found matching "{orderSearch}"</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {activeTab === 'customers' && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-gray-950">Customer Directory</h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">{filteredCustomers?.length || 0} customers in this view</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-[#1a8a4a]/30 hover:shadow-sm focus:border-[#1a8a4a]/60 focus:ring-4 focus:ring-[#1a8a4a]/10"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {usersLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 w-full bg-gray-50 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50 text-xs font-black uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4 rounded-tl-2xl">Customer</th>
                        <th className="px-5 py-4">Location</th>
                        <th className="px-5 py-4">Role</th>
                        <th className="px-5 py-4">Account Status</th>
                        <th className="px-5 py-4 text-right rounded-tr-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCustomers?.map((u: any) => {
                        const isCurrentUser = user?.email?.toLowerCase() === u.email?.toLowerCase();
                        return (
                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] font-black text-[#1a8a4a]">
                                {u.displayName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-[#1a1a1a]">{u.displayName}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-600">
                            {u.district || u.division ? `${u.district || ''}${u.district && u.division ? ', ' : ''}${u.division || ''}` : 'Not provided'}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex min-h-[28px] items-center rounded-full border px-3 text-xs font-black uppercase ${
                              u.role === 'admin' || u.role === 'superadmin'
                                ? 'border-purple-200 bg-purple-50 text-purple-700'
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                            }`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex min-h-[28px] items-center rounded-full border px-3 text-xs font-black ${
                              u.isActive
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                            }`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isCurrentUser ? (
                                <span className="min-h-[34px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-500">
                                  Current Admin
                                </span>
                              ) : (
                                <>
                              {u.role !== 'admin' && u.role !== 'superadmin' ? (
                                <button
                                  onClick={() => updateRoleMutation.mutate({ email: u.email, role: 'admin' })}
                                  disabled={updateRoleMutation.isPending}
                                  className="min-h-[34px] rounded-xl border border-purple-200 px-3 text-xs font-black text-purple-600 transition-colors hover:bg-purple-50 disabled:opacity-50"
                                >
                                  Make Admin
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateRoleMutation.mutate({ email: u.email, role: 'user' })}
                                  disabled={updateRoleMutation.isPending}
                                  className="min-h-[34px] rounded-xl border border-gray-200 px-3 text-xs font-black text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                                >
                                  Demote to User
                                </button>
                              )}
                              {u.isActive ? (
                                <button
                                  onClick={() => deactivateUserMutation.mutate(u.email)}
                                  className="min-h-[34px] rounded-xl border border-red-200 px-3 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => apiClient.put(`/users/${u.email}/reactivate`).then(() => queryClient.invalidateQueries({ queryKey: ['admin-users'] }))}
                                  className="min-h-[34px] rounded-xl border border-green-200 px-3 text-xs font-black text-green-600 transition-colors hover:bg-green-50"
                                >
                                  Reactivate
                                </button>
                              )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredCustomers?.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No customers found matching "{customerSearch}"</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
