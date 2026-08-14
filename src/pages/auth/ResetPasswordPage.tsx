import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, Loader2, LockKeyhole, Package } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { toUserFriendlyError } from '../../utils/userFriendlyError';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!token) return setError('This password reset link is missing its token. Request a new link.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setIsSubmitting(true);
    try {
      await apiClient.post('/users/password-reset/confirm', { token, newPassword: password });
      setCompleted(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (requestError: unknown) {
      setError(toUserFriendlyError(requestError, 'This reset link is invalid or expired. Request a new one.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf7f2] px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-5 flex w-fit items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a8a4a] text-white"><Package className="h-5 w-5" /></span>
          <span className="text-2xl font-black text-gray-950">BD<span className="text-[#1a8a4a]">Shop</span></span>
        </Link>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
          {completed ? (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto h-14 w-14 text-[#1a8a4a]" />
              <h1 className="mt-4 text-2xl font-black text-gray-950">Password updated</h1>
              <p className="mt-2 text-sm font-medium text-gray-500">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]"><LockKeyhole className="h-6 w-6" /></div>
              <h1 className="mt-5 text-2xl font-black text-gray-950">Choose a new password</h1>
              <p className="mt-1 text-sm font-medium text-gray-500">Use at least 8 characters and avoid reusing an old password.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-black text-gray-800">New password</span>
                  <span className="relative block">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-gray-200 px-4 pr-12 text-sm font-medium outline-none focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-black text-gray-800">Confirm password</span>
                  <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm font-medium outline-none focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15" autoComplete="new-password" />
                </label>
                {error && <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
                <button type="submit" disabled={isSubmitting || !token} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1a8a4a] px-5 text-sm font-black text-white hover:bg-[#157a3f] disabled:opacity-60">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update password
                </button>
              </form>
              {!token && <Link to="/forgot-password" className="mt-4 block text-center text-sm font-black text-[#1a8a4a] hover:underline">Request a new reset link</Link>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
