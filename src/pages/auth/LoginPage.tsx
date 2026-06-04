import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Package,
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/useToast';
import { getPostAuthRedirect, getRouteFromLocationState, normalizeAuthUser } from '../../utils/auth';
import { toUserFriendlyError } from '../../utils/userFriendlyError';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

function GoogleLoginButton({
  handleOAuthSuccess,
  isOAuthLoading,
  isDisabled,
}: {
  handleOAuthSuccess: (endpoint: string, payload: { token: string }) => void;
  isOAuthLoading: boolean;
  isDisabled: boolean;
}) {
  const { error } = useToast();
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleOAuthSuccess('google', { token: tokenResponse.access_token }),
    onError: () => error('Google login failed. Please try again.'),
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isDisabled || isOAuthLoading}
      className="flex min-h-[46px] w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 2xl:min-h-[52px]"
    >
      {isOAuthLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-500" /> : <GoogleIcon />}
      Continue with Google
    </button>
  );
}

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();

  const from = getRouteFromLocationState(location.state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiClient.post('/users/login', data);
      return res.data;
    },
    onSuccess: (res) => {
      const authUser = normalizeAuthUser(res);
      if (!authUser) {
        setErrorMsg('Login succeeded, but account data could not be loaded. Please try again.');
        return;
      }

      setUser(authUser);
      success(`Welcome back, ${authUser.displayName}!`);
      navigate(getPostAuthRedirect(authUser, from), { replace: true });
    },
    onError: (err: any) => setErrorMsg(toUserFriendlyError(err, 'Invalid email or password. Please try again.')),
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg('');
    mutation.mutate(data);
  };

  const handleOAuthSuccess = async (endpoint: string, payload: { token: string }) => {
    setIsOAuthLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.post(`/auth/${endpoint}`, payload);
      const authUser = normalizeAuthUser(res.data);
      if (!authUser) {
        setErrorMsg('Login succeeded, but account data could not be loaded. Please try again.');
        return;
      }

      setUser(authUser);
      success(`Welcome back, ${authUser.displayName}!`);
      navigate(getPostAuthRedirect(authUser, from), { replace: true });
    } catch (err: any) {
      error('Login failed. Please try again.');
      setErrorMsg(toUserFriendlyError(err, 'Login failed. Please try again.'));
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const inputClass =
    'min-h-[42px] w-full rounded-2xl border border-gray-200 bg-[#fbfcfd] px-4 text-sm font-bold text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-[#1a8a4a]/30 hover:bg-white hover:shadow-sm focus:border-[#1a8a4a]/60 focus:bg-white focus:shadow-[0_14px_30px_rgba(26,138,74,0.12)] focus:ring-4 focus:ring-[#1a8a4a]/10 2xl:min-h-[50px]';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#edf7f2] px-4 py-4 md:px-8 lg:px-10 [@media(max-height:600px)]:items-start">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#d8f2e5_0%,rgba(216,242,229,0.55)_28%,rgba(248,250,252,0)_58%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.32]" style={{ backgroundImage: 'linear-gradient(rgba(26,138,74,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(26,138,74,0.08) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-[#1a8a4a]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-[410px] sm:max-w-[440px] 2xl:max-w-[500px]">
        <Link to="/" className="mx-auto mb-3 flex w-fit items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a8a4a] text-white shadow-sm 2xl:h-11 2xl:w-11">
            <Package className="h-5 w-5 2xl:h-6 2xl:w-6" />
          </div>
          <span className="text-xl font-black text-gray-950 2xl:text-2xl">
            BD<span className="text-[#1a8a4a]">Shop</span>
          </span>
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:rounded-[2rem] lg:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
              <div className="border-b border-gray-100 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] px-4 py-4 text-center 2xl:px-8">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a8a4a] text-white shadow-sm">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <h1 className="mt-2 text-xl font-black tracking-tight text-gray-950">Welcome back</h1>
                <p className="mt-1 text-xs font-semibold text-gray-500">Sign in to manage orders, wishlist, and checkout.</p>
                <div className="mt-2 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
                  {['Secure login', 'Fast checkout', 'Order tracking'].map((item) => (
                    <div key={item} className="flex min-h-[30px] items-center justify-center rounded-xl border border-[#1a8a4a]/10 bg-[#f8fbf9] px-2 py-1.5 text-[10px] sm:text-xs font-black text-[#1a8a4a]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 2xl:p-8">
                <div className="mb-3">
                  {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                    <GoogleLoginButton handleOAuthSuccess={handleOAuthSuccess} isOAuthLoading={isOAuthLoading} isDisabled={mutation.isPending} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => error('Google sign-in is not available right now. Please use email login.')}
                      className="flex min-h-[42px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs sm:text-sm font-black text-gray-500 opacity-60 grayscale"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                  )}
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-gray-400">or continue with email</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs sm:text-sm font-black text-gray-800">Email Address</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="john@example.com"
                        className={`${inputClass} pl-10 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-[10px] sm:text-xs font-bold text-red-500">{errors.email.message}</p>}
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <label className="block text-xs sm:text-sm font-black text-gray-800">Password</label>
                      <Link to="/forgot-password" className="text-[10px] sm:text-xs font-black text-[#1a8a4a] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Enter your password"
                        className={`${inputClass} pl-10 pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((value) => !value)}
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[10px] sm:text-xs font-bold text-red-500">{errors.password.message}</p>}
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs sm:text-sm font-bold text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={mutation.isPending || isOAuthLoading}
                    className="group flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1a8a4a] px-5 text-xs sm:text-sm font-black text-white shadow-[0_16px_34px_rgba(26,138,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#157a3f] hover:shadow-[0_20px_42px_rgba(26,138,74,0.28)] active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 2xl:min-h-[54px]"
                  >
                    {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                    {!mutation.isPending && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs sm:text-sm font-semibold text-gray-500">
                  Do not have an account?{' '}
                  <Link to="/register" className="font-black text-[#1a8a4a] hover:underline">
                    Create one free
                  </Link>
                </p>
              </div>
            </div>
        <p className="mt-3 text-center text-[10px] sm:text-xs font-bold leading-5 text-gray-400">Protected checkout and account access for BDShop customers.</p>
      </div>
    </div>
  );
}
