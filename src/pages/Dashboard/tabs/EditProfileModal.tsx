import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera, Loader2, UserRound, X } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../hooks/useToast';

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
    mutationFn: async (data: typeof form) => {
      const res = await apiClient.put('/users/profile/me', data);
      return res.data.data;
    },
    onSuccess: (data) => {
      setUser({ ...user!, ...data });
      success('Profile updated successfully!');
      onClose();
    },
    onError: (err: any) => toastError(err.response?.data?.message || 'Failed to update profile'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toastError('Image must be under 2MB');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toastError('Only JPG/PNG allowed');
      return;
    }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.displayName.trim()) {
      toastError('Name is required');
      return;
    }
    if (avatar) {
      toastError('Profile photo upload is not available for user profiles yet.');
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="bg-[#102f20] p-6 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white md:hidden">
            <X className="h-4 w-4" />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <UserRound className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight">Edit profile</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-white/70">
            Keep your account details updated for faster checkout and order support.
          </p>
          <div className="mt-8 rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-white/55">Signed in as</p>
            <p className="mt-1 truncate text-sm font-black">{user?.email}</p>
          </div>
        </aside>

        <section className="max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 hidden items-center justify-end border-b border-gray-100 bg-white p-4 md:flex">
            <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-[#1a8a4a] text-2xl font-black text-white ring-4 ring-[#e8f5ee]">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    user?.displayName?.charAt(0).toUpperCase()
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a8a4a] text-white shadow-md hover:bg-[#157a3f]"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
              </div>
              <div>
                <p className="font-black text-gray-950">Profile photo</p>
                <p className="mt-1 text-sm font-medium text-gray-500">JPG or PNG, max 2MB.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input value={form.displayName} onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))} className={inputCls} placeholder="Your full name" />
              </Field>
              <Field label="Email">
                <input value={user?.email || ''} readOnly className={`${inputCls} cursor-not-allowed bg-gray-50 text-gray-400`} />
              </Field>
              <Field label="Phone number">
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className={inputCls} placeholder="+880 1XXXXXXXXX" />
              </Field>
              <Field label="Date of birth">
                <input type="date" value={form.dob} onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))} className={inputCls} />
              </Field>
              <div className="sm:col-span-2">
                <p className="mb-1.5 text-sm font-black text-gray-800">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, gender }))}
                      className={`min-h-[42px] rounded-xl border px-4 text-sm font-black transition ${
                        form.gender === gender ? 'border-[#1a8a4a] bg-[#1a8a4a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-[#1a8a4a]/40'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-100 p-5 sm:p-6">
            <button onClick={onClose} className="min-h-[44px] flex-1 rounded-xl border border-gray-200 text-sm font-black text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1a8a4a] text-sm font-black text-white hover:bg-[#157a3f] disabled:opacity-60"
            >
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const inputCls = 'h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-black text-gray-800">{label}</span>
      {children}
    </label>
  );
}
