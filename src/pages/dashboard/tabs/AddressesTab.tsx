import { useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Home, Loader2, MapPin, Plus, Star, Trash2, Truck, X } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useToast } from '../../../hooks/useToast';

const BD_DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
const BD_DISTRICTS = [
  'Bagerhat','Bandarban','Barguna','Barishal','Bhola','Bogura','Brahmanbaria','Chandpur','Chapai Nawabganj',
  'Chattogram','Chuadanga','Cox\'s Bazar','Cumilla','Dhaka','Dinajpur','Faridpur','Feni','Gaibandha',
  'Gazipur','Gopalganj','Habiganj','Jamalpur','Jashore','Jhalokathi','Jhenaidah','Joypurhat','Khagrachari',
  'Khulna','Kishoreganj','Kurigram','Kushtia','Lakshmipur','Lalmonirhat','Madaripur','Magura','Manikganj',
  'Meherpur','Moulvibazar','Munshiganj','Mymensingh','Naogaon','Narail','Narayanganj','Narsingdi','Natore',
  'Netrokona','Nilphamari','Noakhali','Pabna','Panchagarh','Patuakhali','Pirojpur','Rajbari','Rajshahi',
  'Rangamati','Rangpur','Satkhira','Shariatpur','Sherpur','Sirajganj','Sunamganj','Sylhet','Tangail',
  'Thakurgaon'
];

const emptyForm = { name: '', phone: '', addressLine: '', district: '', division: '', postalCode: '', isDefault: false };

export default function AddressesTab() {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/addresses');
      return res.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/addresses', data),
    onSuccess: () => { success('Address added!'); closeModal(); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Failed to add address'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiClient.put(`/addresses/${id}`, data),
    onSuccess: () => { success('Address updated!'); closeModal(); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Failed to update address'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/addresses/${id}`),
    onSuccess: () => { success('Address deleted'); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Cannot delete address'),
  });

  const defaultMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/addresses/${id}/set-default`),
    onSuccess: () => { success('Default address updated!'); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: () => toastError('Failed to set default'),
  });

  const openAdd = () => { setEditingAddress(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (addr: any) => {
    setEditingAddress(addr);
    setForm({
      name: addr.name,
      phone: addr.phone,
      addressLine: addr.addressLine,
      district: addr.district,
      division: addr.division,
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingAddress(null); setForm(emptyForm); };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.addressLine || !form.district || !form.division) {
      toastError('Please fill all required fields');
      return;
    }
    if (editingAddress) updateMutation.mutate({ id: editingAddress._id, data: form });
    else createMutation.mutate(form);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
              <Truck className="h-4 w-4" />
              Delivery book
            </div>
            <h2 className="text-2xl font-black tracking-tight text-gray-950">Saved addresses</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">Manage delivery locations for faster checkout.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-xl bg-[#1a8a4a] px-4 text-sm font-black text-white transition hover:bg-[#157a3f]"
          >
            <Plus className="h-4 w-4" />
            Add address
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
            <MapPin className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-black text-gray-900">No addresses saved</h3>
          <p className="mt-2 text-sm font-medium text-gray-500">Add a delivery address before checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {addresses.map((addr: any) => (
            <article key={addr._id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                    <Home className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-gray-950">{addr.name}</h3>
                      {addr.isDefault && (
                        <span className="rounded-full bg-[#1a8a4a] px-2.5 py-1 text-[10px] font-black uppercase text-white">Default</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-bold text-gray-600">{addr.phone}</p>
                    <p className="mt-3 text-sm font-medium leading-6 text-gray-500">{addr.addressLine}</p>
                    <p className="text-sm font-medium text-gray-500">{addr.district}, {addr.division} {addr.postalCode && `- ${addr.postalCode}`}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {!addr.isDefault && (
                  <button
                    onClick={() => defaultMutation.mutate(addr._id)}
                    disabled={defaultMutation.isPending}
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-[#1a8a4a]/25 px-3 text-xs font-black text-[#1a8a4a] hover:bg-[#e8f5ee]"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Set default
                  </button>
                )}
                <button onClick={() => openEdit(addr)} className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-black text-gray-700 hover:bg-gray-50">
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(addr._id)}
                  disabled={deleteMutation.isPending}
                  className="ml-auto inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-red-200 px-3 text-xs font-black text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-5">
              <div>
                <h3 className="text-lg font-black text-gray-950">{editingAddress ? 'Edit address' : 'Add address'}</h3>
                <p className="text-sm font-medium text-gray-500">Use accurate details for smooth delivery.</p>
              </div>
              <button onClick={closeModal} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Full name">
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputCls} placeholder="Your full name" />
              </Field>
              <Field label="Phone number">
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className={inputCls} placeholder="+880 1XXXXXXXXX" />
              </Field>
              <Field label="Address line" wide>
                <input value={form.addressLine} onChange={(event) => setForm((current) => ({ ...current, addressLine: event.target.value }))} className={inputCls} placeholder="Street, building, apartment" />
              </Field>
              <Field label="Division">
                <select value={form.division} onChange={(event) => setForm((current) => ({ ...current, division: event.target.value }))} className={inputCls}>
                  <option value="">Select division</option>
                  {BD_DIVISIONS.map((division) => <option key={division} value={division}>{division}</option>)}
                </select>
              </Field>
              <Field label="District">
                <select value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} className={inputCls}>
                  <option value="">Select district</option>
                  {BD_DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
                </select>
              </Field>
              <Field label="Postal code">
                <input value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))} className={inputCls} placeholder="1200" />
              </Field>
              <label className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 sm:col-span-2">
                <input type="checkbox" checked={form.isDefault} onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))} className="h-4 w-4 accent-[#1a8a4a]" />
                <span className="text-sm font-black text-gray-700">Set as default address</span>
              </label>
            </div>

            <div className="flex gap-3 border-t border-gray-100 p-5">
              <button onClick={closeModal} className="min-h-[44px] flex-1 rounded-xl border border-gray-200 text-sm font-black text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1a8a4a] text-sm font-black text-white hover:bg-[#157a3f] disabled:opacity-60"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingAddress ? 'Save changes' : 'Add address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15';

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={wide ? 'sm:col-span-2' : ''}>
      <span className="mb-1.5 block text-sm font-black text-gray-800">{label}</span>
      {children}
    </label>
  );
}
