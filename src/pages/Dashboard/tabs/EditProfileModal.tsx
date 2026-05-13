import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../hooks/useToast';
import { Camera, X, Loader2 } from 'lucide-react';

const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export default function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { user, setUser } = useAuthStore();
  const { success, error: toastError } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    dob: (user as any)?.dob || '',
    gender: (user as any)?.gender || '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>((user as any)?.profileImage || '');

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiClient.put('/users/profile/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setUser({ ...user!, ...data });
      success('Profile updated successfully!');
      onClose();
    },
    onError: (err: any) => toastError(err.response?.data?.message || 'Failed to update profile'),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toastError('Image must be under 2MB'); return; }
    if (!['image/jpeg', 'image/png'].includes(file.type)) { toastError('Only JPG/PNG allowed'); return; }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.displayName.trim()) { toastError('Name is required'); return; }
    const fd = new FormData();
    fd.append('displayName', form.displayName);
    fd.append('phone', form.phone);
    fd.append('dob', form.dob);
    fd.append('gender', form.gender);
    if (avatar) fd.append('avatar', avatar);
    mutation.mutate(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Avatar upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#1a8a4a] flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-2xl">{user?.displayName?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#1a8a4a] text-white flex items-center justify-center shadow-md hover:bg-[#157a3f] transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 -mt-3 mb-5">JPG or PNG, max 2MB</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Full Name *</label>
            <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email</label>
            <input value={user?.email || ''} readOnly
              className="w-full border border-gray-100 rounded-xl px-4 h-11 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Phone Number</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="+880 1XXXXXXXXX" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Date of Birth</label>
            <input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Gender</label>
            <div className="flex gap-2 flex-wrap">
              {GENDERS.map(g => (
                <button key={g} type="button" onClick={() => setForm(f => ({ ...f, gender: g }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${form.gender === g ? 'bg-[#1a8a4a] text-white border-[#1a8a4a]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a8a4a]'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-11 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={mutation.isPending}
            className="flex-1 h-11 bg-[#1a8a4a] text-white rounded-xl text-sm font-semibold hover:bg-[#157a3f] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
