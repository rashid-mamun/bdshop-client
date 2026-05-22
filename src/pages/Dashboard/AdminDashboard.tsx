import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Plus, Pencil, Trash2,
  X, Check, Search, TrendingUp, DollarSign, UserCheck, Shield
} from 'lucide-react';

type Tab = 'overview' | 'products' | 'orders' | 'customers';

const ORDER_STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  confirmed:  { label: 'Confirmed',  color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  processing: { label: 'Processing', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  shipped:    { label: 'Shipped',    color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  delivered:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
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
    img: initial?.img || '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all";

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
      <div>
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Price (৳)</label>
        <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} min="0" />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} rows={3} />
      </div>
      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-200 transition-colors flex items-center gap-2">
          <X className="h-4 w-4" /> Cancel
        </button>
        <button onClick={() => onSave({ ...form, price: Number(form.price) })} disabled={isPending} className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#1a8a4a] hover:bg-[#157a3f] transition-colors flex items-center gap-2 disabled:opacity-50">
          <Check className="h-4 w-4" /> {isPending ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Queries
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders');
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
      const res = await apiClient.get('/users');
      return res.data.data.users as any[];
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/services', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); setShowProductForm(false); success('Product created!'); },
    onError: (e: any) => toastError(e.response?.data?.message || 'Create failed'),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.put(`/services/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); setEditingProduct(null); success('Product updated!'); },
    onError: (e: any) => toastError(e.response?.data?.message || 'Update failed'),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/services/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); success('Product deleted'); },
    onError: () => toastError('Delete failed'),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiClient.put(`/orders/${id}`, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); success('Order status updated!'); },
    onError: () => toastError('Status update failed'),
  });

  const makeAdminMutation = useMutation({
    mutationFn: (email: string) => apiClient.put('/users/admin', { email }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); success('User promoted to admin!'); },
    onError: () => toastError('Failed to update role'),
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (email: string) => apiClient.put(`/users/${email}/deactivate`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); success('User deactivated'); },
  });

  // Analytics
  const totalRevenue = ordersData?.filter((o) => o.paymentStatus === 'paid').reduce((s: number, o: any) => s + (o.total || 0), 0) || 0;
  const totalOrders = ordersData?.length || 0;
  const totalProducts = productsData?.length || 0;
  const totalCustomers = usersData?.length || 0;

  const monthlyRevenue: Record<string, number> = {};
  ordersData?.filter((o: any) => o.paymentStatus === 'paid').forEach((o: any) => {
    const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (o.total || 0);
  });
  const chartData = Object.entries(monthlyRevenue).map(([name, sales]) => ({ name, sales }));

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
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 md:pb-6">
      {/* Header banner */}
      <div className="bg-gradient-to-br from-[#0f2617] to-[#1a3d26] py-10 px-6">
        <div className="bd-container flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-amber-400 flex items-center justify-center text-[#1a1a1a] shadow-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-black">Admin Portal</h1>
              <p className="text-white/60 text-sm mt-0.5">Manage store, products, and users</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3">
             <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
               {user?.displayName?.charAt(0).toUpperCase()}
             </div>
             <div className="mr-2">
               <p className="text-sm font-bold text-white leading-tight">{user?.displayName}</p>
               <p className="text-xs text-amber-400 font-semibold">{user?.role?.toUpperCase()}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bd-container -mt-1">
        {/* Tab nav */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 flex overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'border-[#1a8a4a] text-[#1a8a4a]'
                  : 'border-transparent text-gray-500 hover:text-[#1a1a1a]'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50 border-green-100' },
                { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                { label: 'Customers', value: totalCustomers, icon: UserCheck, color: 'text-orange-600 bg-orange-50 border-orange-100' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-black text-[#1a1a1a] mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#1a8a4a]" /> Monthly Revenue
                </h3>
                {chartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} tick={{fill: '#6b7280'}} />
                        <Tooltip formatter={(v) => [`৳${Number(v).toLocaleString()}`, 'Revenue']} cursor={{ fill: '#f8f9fa' }} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="sales" fill="#1a8a4a" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">No revenue data yet</div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Products Inventory</h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); }} className="bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            <div className="p-5">
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
                <div className="overflow-x-auto mt-4 border border-gray-100 rounded-xl">
                  <table className="w-full text-sm text-left">
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Order Management</h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search by email, ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all bg-gray-50"
                />
              </div>
            </div>

            <div className="p-5">
              {ordersLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 w-full bg-gray-50 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-4 rounded-tl-xl">Order ID</th>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right rounded-tr-xl">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders?.map((order: any) => {
                        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                        return (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3 font-mono text-xs text-gray-500 uppercase">#{order._id.slice(-8)}</td>
                            <td className="px-5 py-3">
                              <p className="font-semibold text-[#1a1a1a]">{order.email}</p>
                              <p className="text-xs text-gray-500">{order.shippingAddress?.city || 'No address'}</p>
                            </td>
                            <td className="px-5 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-5 py-3 font-bold text-[#1a1a1a]">৳{order.total?.toLocaleString()}</td>
                            <td className="px-5 py-3">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {order.paymentStatus?.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderMutation.mutate({ id: order._id, status: e.target.value })}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1a8a4a] bg-white font-medium text-gray-700"
                              >
                                {ORDER_STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Customer Directory</h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all bg-gray-50"
                />
              </div>
            </div>

            <div className="p-5">
              {usersLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 w-full bg-gray-50 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-4 rounded-tl-xl">Customer</th>
                        <th className="px-5 py-4">Location</th>
                        <th className="px-5 py-4">Role & Status</th>
                        <th className="px-5 py-4 text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCustomers?.map((u: any) => (
                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#1a8a4a] font-bold">
                                {u.displayName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-[#1a1a1a]">{u.displayName}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {u.district || u.division ? `${u.district || ''}${u.district && u.division ? ', ' : ''}${u.division || ''}` : 'Not provided'}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${u.role === 'admin' || u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                {u.role?.toUpperCase() || 'USER'}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {u.role !== 'admin' && u.role !== 'superadmin' && (
                                <button
                                  onClick={() => makeAdminMutation.mutate(u.email)}
                                  disabled={makeAdminMutation.isPending}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
                                >
                                  Make Admin
                                </button>
                              )}
                              {u.isActive ? (
                                <button
                                  onClick={() => deactivateUserMutation.mutate(u.email)}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => apiClient.put(`/users/${u.email}/reactivate`).then(() => queryClient.invalidateQueries({ queryKey: ['admin-users'] }))}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                                >
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
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
