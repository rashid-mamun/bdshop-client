import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Check, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useToast } from '../../../hooks/useToast';

function StrengthBar({ password }: { password: string }) {
  const checks = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  const score = checks.filter((rule) => rule.test(password)).length;
  const levels = [
    { label: 'Too weak', color: 'bg-red-500', text: 'text-red-600' },
    { label: 'Weak', color: 'bg-orange-400', text: 'text-orange-600' },
    { label: 'Fair', color: 'bg-yellow-400', text: 'text-yellow-700' },
    { label: 'Good', color: 'bg-blue-500', text: 'text-blue-600' },
    { label: 'Strong', color: 'bg-green-500', text: 'text-green-600' },
  ];
  const level = score === 0 ? null : levels[Math.min(score - 1, 4)];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`h-1.5 flex-1 rounded-full ${index < score ? level?.color : 'bg-gray-200'}`} />
        ))}
      </div>
      {level && <p className={`text-xs font-black ${level.text}`}>{level.label}</p>}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, label }: any) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-black text-gray-800">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15"
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700"
        >
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
      if (msg.toLowerCase().includes('current')) setErrors({ currentPassword: 'Current password is incorrect' });
      else toastError(msg);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.currentPassword) nextErrors.currentPassword = 'Current password is required';
    if (form.newPassword.length < 6) nextErrors.newPassword = 'Password must be at least 6 characters';
    if (form.newPassword !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,620px)_minmax(300px,1fr)]">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
            <ShieldCheck className="h-4 w-4" />
            Security
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-950">Change password</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">Keep your BDShop account protected with a strong password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <PasswordInput
              label="Current password"
              value={form.currentPassword}
              onChange={(event: any) => {
                setForm((current) => ({ ...current, currentPassword: event.target.value }));
                setErrors((current) => ({ ...current, currentPassword: '' }));
              }}
              placeholder="Enter current password"
            />
            {errors.currentPassword && <p className="mt-1 text-xs font-bold text-red-500">{errors.currentPassword}</p>}
          </div>
          <div>
            <PasswordInput
              label="New password"
              value={form.newPassword}
              onChange={(event: any) => {
                setForm((current) => ({ ...current, newPassword: event.target.value }));
                setErrors((current) => ({ ...current, newPassword: '' }));
              }}
              placeholder="Enter new password"
            />
            <StrengthBar password={form.newPassword} />
            {errors.newPassword && <p className="mt-1 text-xs font-bold text-red-500">{errors.newPassword}</p>}
          </div>
          <div>
            <PasswordInput
              label="Confirm password"
              value={form.confirmPassword}
              onChange={(event: any) => {
                setForm((current) => ({ ...current, confirmPassword: event.target.value }));
                setErrors((current) => ({ ...current, confirmPassword: '' }));
              }}
              placeholder="Confirm new password"
            />
            {form.confirmPassword && form.newPassword === form.confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-green-600"><Check className="h-3 w-3" /> Passwords match</p>
            )}
            {errors.confirmPassword && <p className="mt-1 text-xs font-bold text-red-500">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1a8a4a] px-5 text-sm font-black text-white transition hover:bg-[#157a3f] disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </button>
        </form>
      </section>

      <aside className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102f20] text-white">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-lg font-black text-gray-950">Password tips</h3>
        <div className="mt-4 space-y-3">
          {['Use at least 8 characters', 'Mix uppercase, numbers and symbols', 'Avoid using your email or name'].map((tip) => (
            <div key={tip} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
              <Check className="h-4 w-4 text-[#1a8a4a]" />
              <span className="text-sm font-bold text-gray-600">{tip}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
