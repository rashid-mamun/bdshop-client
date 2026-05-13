import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { useToast } from '../../../hooks/useToast';
import { Eye, EyeOff, Lock, Loader2, Check } from 'lucide-react';

function StrengthBar({ password }: { password: string }) {
  const checks = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  const score = checks.filter(r => r.test(password)).length;
  const levels = [
    { label: 'Too weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-400' },
    { label: 'Fair', color: 'bg-yellow-400' },
    { label: 'Good', color: 'bg-blue-500' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  const level = score === 0 ? null : levels[Math.min(score - 1, 4)];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < score ? level?.color : 'bg-gray-200'}`} />
        ))}
      </div>
      {level && <p className={`text-xs font-semibold ${level.color.replace('bg-', 'text-')}`}>{level.label}</p>}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, label }: any) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-10 h-11 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordTab() {
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (data: any) => apiClient.put('/users/change-password', data),
    onSuccess: () => {
      success('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to change password';
      if (msg.toLowerCase().includes('current')) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        toastError(msg);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (form.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <PasswordInput
              label="Current Password *"
              value={form.currentPassword}
              onChange={(e: any) => { setForm(f => ({ ...f, currentPassword: e.target.value })); setErrors(er => ({ ...er, currentPassword: '' })); }}
              placeholder="Enter current password"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
          </div>
          <div>
            <PasswordInput
              label="New Password *"
              value={form.newPassword}
              onChange={(e: any) => { setForm(f => ({ ...f, newPassword: e.target.value })); setErrors(er => ({ ...er, newPassword: '' })); }}
              placeholder="Enter new password"
            />
            <StrengthBar password={form.newPassword} />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <PasswordInput
              label="Confirm New Password *"
              value={form.confirmPassword}
              onChange={(e: any) => { setForm(f => ({ ...f, confirmPassword: e.target.value })); setErrors(er => ({ ...er, confirmPassword: '' })); }}
              placeholder="Confirm new password"
            />
            {form.confirmPassword && form.newPassword === form.confirmPassword && (
              <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><Check className="h-3 w-3" /> Passwords match</p>
            )}
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-11 bg-[#1a8a4a] text-white font-semibold rounded-xl hover:bg-[#157a3f] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
