import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { useToast } from '../../../hooks/useToast';
import { MapPin, Plus, Edit3, Trash2, Star, Loader2, X } from 'lucide-react';

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
    onError: (err: any) => toastError(err.response?.data?.message || 'Failed to add address'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiClient.put(`/addresses/${id}`, data),
    onSuccess: () => { success('Address updated!'); closeModal(); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: (err: any) => toastError(err.response?.data?.message || 'Failed to update address'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/addresses/${id}`),
    onSuccess: () => { success('Address deleted'); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: (err: any) => toastError(err.response?.data?.message || 'Cannot delete address'),
  });

  const defaultMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/addresses/${id}/set-default`),
    onSuccess: () => { success('Default address updated!'); queryClient.invalidateQueries({ queryKey: ['my-addresses'] }); },
    onError: () => toastError('Failed to set default'),
  });

  const openAdd = () => { setEditingAddress(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (addr: any) => { setEditingAddress(addr); setForm({ name: addr.name, phone: addr.phone, addressLine: addr.addressLine, district: addr.district, division: addr.division, postalCode: addr.postalCode || '', isDefault: addr.isDefault }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingAddress(null); setForm(emptyForm); };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.addressLine || !form.district || !form.division) {
      toastError('Please fill all required fields'); return;
    }
    if (editingAddress) updateMutation.mutate({ id: editingAddress._id, data: form });
    else createMutation.mutate(form);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Saved Addresses</h3>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#1a8a4a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#157a3f] transition-colors">
          <Plus className="h-4 w-4" /> Add New Address
        </button>
      </div>

      {isLoading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-32" />
        ))
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">No addresses saved</h3>
          <p className="text-gray-500 text-sm">Add a delivery address to get started</p>
        </div>
      ) : (
        addresses.map((addr: any) => (
          <div key={addr._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-[#1a8a4a] text-white text-xs font-bold px-2.5 py-1 rounded-full">DEFAULT</span>
            )}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-[#e8f5ee] rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-[#1a8a4a]" />
              </div>
              <div className="flex-1 min-w-0 pr-20">
                <p className="font-bold text-gray-900">{addr.name}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
                <p className="text-sm text-gray-600 mt-1">{addr.addressLine}</p>
                <p className="text-sm text-gray-600">{addr.district}, {addr.division} {addr.postalCode && `- ${addr.postalCode}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
              {!addr.isDefault && (
                <button onClick={() => defaultMutation.mutate(addr._id)} disabled={defaultMutation.isPending}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1a8a4a] border border-[#1a8a4a]/30 px-3 py-1.5 rounded-lg hover:bg-[#e8f5ee] transition-colors">
                  <Star className="h-3 w-3" /> Set Default
                </button>
              )}
              <button onClick={() => openEdit(addr)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => deleteMutation.mutate(addr._id)} disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors ml-auto">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={closeModal} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Phone Number *</label>
                <div className="flex">
                  <span className="px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl flex items-center text-gray-500 text-sm font-medium">+880</span>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-r-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="1XXXXXXXXX" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address Line *</label>
                <input value={form.addressLine} onChange={e => setForm(f => ({ ...f, addressLine: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Street, Building, Apt" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Division *</label>
                  <select value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                    <option value="">Select Division</option>
                    {BD_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">District *</label>
                  <select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                    <option value="">Select District</option>
                    {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Postal Code</label>
                <input value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="1200" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#1a8a4a]" />
                <span className="text-sm font-medium text-gray-700">Set as default address</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 h-11 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isSaving}
                className="flex-1 h-11 bg-[#1a8a4a] text-white rounded-xl text-sm font-semibold hover:bg-[#157a3f] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingAddress ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
