import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Package, Star, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '../../hooks/useToast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

function GoogleLoginButton({ handleOAuthSuccess, isOAuthLoading, isDisabled }: any) {
  const { error } = useToast();
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleOAuthSuccess('google', { token: tokenResponse.access_token }),
    onError: () => error('Google login failed. Please try again.')
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isDisabled || isOAuthLoading}
      className="flex items-center justify-center gap-2 w-full h-11 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all disabled:opacity-60"
    >
      {isOAuthLoading ? <Loader2 className="h-4 w-4 animate-spin text-gray-500" /> : (
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
      )}
      <span className="text-sm font-medium text-gray-700">Continue with Google</span>
    </button>
  );
}

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();
  
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiClient.post('/users/login', data);
      return res.data;
    },
    onSuccess: (res) => { 
      setUser(res.data); 
      success(`Welcome back, ${res.data.displayName}!`);
      navigate(from, { replace: true }); 
    },
    onError: (err: any) => setErrorMsg(err.response?.data?.message || 'Invalid email or password'),
  });

  const onSubmit = (data: LoginFormValues) => { setErrorMsg(''); mutation.mutate(data); };

  const handleOAuthSuccess = async (endpoint: string, payload: any) => {
    setIsOAuthLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.post(`/auth/${endpoint}`, payload);
      setUser(res.data.data.user);
      success(`Welcome back, ${res.data.data.user.displayName}!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      error('Login failed. Please try again.');
      setErrorMsg(err.response?.data?.message || 'OAuth login failed');
    } finally {
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* ─── Left Panel ──────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 text-center max-w-md space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 bg-[#1a8a4a] rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-black text-white">BD<span className="text-[#4ade80]">Shop</span></span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Bangladesh's #1<br />Premium Marketplace
            </h2>
            <p className="text-white/60 leading-relaxed">
              Join over 10,000 happy customers discovering quality electronics, vehicles & accessories.
            </p>
          </div>

          <div className="flex justify-center gap-1 mb-1">
            {[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 text-amber-400 fill-current" />)}
          </div>
          <p className="text-white/50 text-sm">Trusted by 10,000+ customers</p>

          <div className="space-y-3 text-left">
            {[
              { icon: ShieldCheck, text: '100% authentic products, guaranteed' },
              { icon: Truck, text: 'Fast nationwide delivery in 24–72 hrs' },
              { icon: Package, text: '30-day hassle-free returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/70 text-sm">
                <div className="h-7 w-7 bg-[#1a8a4a]/30 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-[#4ade80]" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="absolute bottom-6 text-green-600 text-xs z-10">© 2026 BD Shop</p>
      </div>

      {/* ─── Right Panel ─────────────────────────── */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center min-h-screen p-6 md:p-8 relative">
        <div className="w-full max-w-md bg-white rounded-2xl md:shadow-xl md:border md:border-gray-100 p-8">
          
          <div className="flex justify-center mb-6">
            <div className="h-10 w-10 bg-[#1a8a4a] rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <GoogleLoginButton 
                handleOAuthSuccess={handleOAuthSuccess} 
                isOAuthLoading={isOAuthLoading} 
                isDisabled={mutation.isPending} 
              />
            ) : (
              <button
                type="button"
                onClick={() => error('Please set VITE_GOOGLE_CLIENT_ID in your .env file')}
                className="flex items-center justify-center gap-2 w-full h-11 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all opacity-50 grayscale cursor-not-allowed"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className={`w-full border rounded-lg px-4 h-11 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 ${errors.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-700 hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full border rounded-lg px-4 h-11 pr-11 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 ${errors.password ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.password.message}</p>}
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <span className="text-red-500 text-lg leading-none">⚠</span>
                <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending || isOAuthLoading}
              className="w-full bg-[#1a8a4a] hover:bg-green-700 text-white font-semibold h-11 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center mt-2"
            >
              {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
