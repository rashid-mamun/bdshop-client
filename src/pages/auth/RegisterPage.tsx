import { useState, useEffect } from 'react';
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
  Phone,
  User,
  ShieldCheck,
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/useToast';
import { getPostAuthRedirect, getRouteFromLocationState, normalizeAuthUser } from '../../utils/auth';
import { toUserFriendlyError } from '../../utils/userFriendlyError';

const registerSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(11, { message: 'Phone number must be at least 11 digits' }).max(15, { message: 'Phone number cannot exceed 15 digits' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();

  const from = getRouteFromLocationState(location.state);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    let score = 0;
    if (passwordValue.length > 7) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    setPasswordStrength(score);
  }, [passwordValue]);

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const res = await apiClient.post('/users/register', data);
      return res.data;
    },
    onSuccess: (res) => {
      const authUser = normalizeAuthUser(res);
      if (!authUser) {
        setErrorMsg('Account created, but account data could not be loaded. Please sign in.');
        return;
      }

      setUser(authUser);
      success('Account created successfully!');
      navigate(getPostAuthRedirect(authUser, from), { replace: true });
    },
    onError: (err: any) => setErrorMsg(toUserFriendlyError(err, 'Registration failed. Please check your details and try again.')),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsOAuthLoading(true);
      setErrorMsg('');
      try {
        const res = await apiClient.post('/auth/google', { token: tokenResponse.access_token });
        const authUser = normalizeAuthUser(res.data);
        if (!authUser) {
          setErrorMsg('Account created, but account data could not be loaded. Please sign in.');
          return;
        }

        setUser(authUser);
        success('Account created successfully with Google!');
        navigate(getPostAuthRedirect(authUser, from), { replace: true });
      } catch (err: any) {
        error('Google registration failed. Please try again.');
        setErrorMsg(toUserFriendlyError(err, 'Registration failed. Please try again.'));
      } finally {
        setIsOAuthLoading(false);
      }
    },
    onError: () => error('Google registration failed. Please try again.'),
  });

  const onSubmit = (data: RegisterFormValues) => {
    setErrorMsg('');
    mutation.mutate(data);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-400';
    if (passwordStrength === 2) return 'bg-orange-400';
    if (passwordStrength === 3) return 'bg-yellow-400';
    return 'bg-[#1a8a4a]';
  };

  const getPasswordStrengthText = () => {
    if (passwordValue.length === 0) return '';
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const inputClass =
    'min-h-[42px] w-full rounded-2xl border border-gray-200 bg-[#fbfcfd] px-4 text-sm font-bold text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-[#1a8a4a]/30 hover:bg-white hover:shadow-sm focus:border-[#1a8a4a]/60 focus:bg-white focus:shadow-[0_14px_30px_rgba(26,138,74,0.12)] focus:ring-4 focus:ring-[#1a8a4a]/10 2xl:min-h-[50px]';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#edf7f2] px-4 py-4 md:px-8 lg:px-10 [@media(max-height:600px)]:items-start">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#d8f2e5_0%,rgba(216,242,229,0.55)_28%,rgba(248,250,252,0)_58%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage: 'linear-gradient(rgba(26,138,74,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(26,138,74,0.08) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-[#1a8a4a]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-[440px] sm:max-w-[480px] 2xl:max-w-[540px]">
        {/* Logo */}
        <Link to="/" className="mx-auto mb-3 flex w-fit items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a8a4a] text-white shadow-sm 2xl:h-11 2xl:w-11">
            <Package className="h-5 w-5 2xl:h-6 2xl:w-6" />
          </div>
          <span className="text-xl font-black text-gray-950 2xl:text-2xl">
            BD<span className="text-[#1a8a4a]">Shop</span>
          </span>
        </Link>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:rounded-[2rem] lg:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
          {/* Header */}
          <div className="border-b border-gray-100 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] px-4 py-4 text-center 2xl:px-8">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a8a4a] text-white shadow-sm">
              <User className="h-4 w-4" />
            </div>
            <h1 className="mt-2 text-xl font-black tracking-tight text-gray-950">Create an account</h1>
            <p className="mt-1 text-xs font-semibold text-gray-500">Join BDShop to start shopping with exclusive benefits.</p>

            {/* Pills */}
            <div className="mt-2 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
              {['Member discounts', 'Faster checkout', 'Order history'].map((item) => (
                <div key={item} className="flex min-h-[30px] items-center justify-center rounded-xl border border-[#1a8a4a]/10 bg-[#f8fbf9] px-2 py-1.5 text-[10px] sm:text-xs font-black text-[#1a8a4a]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 2xl:p-8">
            {/* Google OAuth */}
            <div className="mb-3">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={mutation.isPending || isOAuthLoading}
                  className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs sm:text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 2xl:min-h-[52px]"
                >
                  {isOAuthLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-500" /> : <GoogleIcon />}
                  Sign up with Google
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => error('Google sign-up is not available right now. Please use email registration.')}
                  className="flex min-h-[42px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs sm:text-sm font-black text-gray-500 opacity-60 grayscale"
                >
                  <GoogleIcon />
                  Sign up with Google
                </button>
              )}
            </div>

            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-gray-400">or register with email</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-black text-gray-800">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('displayName')}
                      placeholder="John Doe"
                      className={`${inputClass} pl-10 ${errors.displayName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.displayName && <p className="mt-1 text-[10px] sm:text-xs font-bold text-red-500">{errors.displayName.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-black text-gray-800">Phone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="01XXXXXXXXX"
                      className={`${inputClass} pl-10 ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-[10px] sm:text-xs font-bold text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-black text-gray-800">Password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {passwordValue.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-1 flex-1 gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`h-full flex-1 rounded-full transition-colors duration-300 ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider ${passwordStrength >= 3 ? 'text-[#1a8a4a]' : 'text-gray-400'}`}>{getPasswordStrengthText()}</span>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-[10px] sm:text-xs font-bold text-red-500">{errors.password.message}</p>}
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs sm:text-sm font-bold text-red-600">
                  {errorMsg}
                </div>
              )}

              {/* Security Note */}
              <div className="flex items-start gap-2 rounded-xl border border-[#1a8a4a]/10 bg-[#1a8a4a]/[0.02] p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1a8a4a]" />
                <p className="text-[10px] sm:text-xs font-semibold leading-relaxed text-gray-600">
                  Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link to="/privacy-policy" className="font-black text-[#1a8a4a] hover:underline">privacy policy</Link>.
                </p>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || isOAuthLoading}
                className="group flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1a8a4a] px-5 text-xs sm:text-sm font-black text-white shadow-[0_16px_34px_rgba(26,138,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#157a3f] hover:shadow-[0_20px_42px_rgba(26,138,74,0.28)] active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 2xl:min-h-[54px]"
              >
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                {!mutation.isPending && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
              </button>
            </form>

            <p className="mt-4 text-center text-xs sm:text-sm font-semibold text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-[#1a8a4a] hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] sm:text-xs font-bold leading-5 text-gray-400">Protected checkout and account access for BDShop customers.</p>
      </div>
    </div>
  );
}
