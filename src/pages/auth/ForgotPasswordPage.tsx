import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Package } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../hooks/useToast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devResetToken, setDevResetToken] = useState('');
  const { error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/users/password-reset/request', { email });
      setDevResetToken(response.data?.data?.resetToken || '');
      setSubmitted(true);
    } catch (err: any) {
      toastError(err.response?.data?.error || 'Unable to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f2617] via-[#1a3d26] to-[#0d4019] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative text-center max-w-md space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 bg-[#1a8a4a] rounded-2xl flex items-center justify-center">
              <Package className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-black text-white">BD<span className="text-[#4ade80]">Shop</span></span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Forgot Your<br />Password?
            </h2>
            <p className="text-white/60 leading-relaxed">
              Don't worry, it happens to the best of us. Let's get you back into your account securely.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Panel ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] px-6 py-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 bg-[#1a8a4a] rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-[#1a1a1a]">BD<span className="text-[#1a8a4a]">Shop</span></span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">
             {/* Back arrow */}
            {!submitted && (
              <Link to="/login" className="absolute top-8 right-8 text-gray-400 hover:text-[#1a8a4a] transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}

            <div className="mb-8">
              <div className="h-12 w-12 bg-[#e8f5ee] rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-[#1a8a4a]" />
              </div>
              <h1 className="text-2xl font-black text-[#1a1a1a]">Reset Password</h1>
              <p className="text-gray-500 text-sm mt-1">
                 {submitted
                  ? 'Check your inbox for instructions.'
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle className="h-14 w-14 text-[#1a8a4a] mb-2" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  If an account exists for <strong>{email}</strong>, you'll receive a password reset email shortly.
                </p>
                {devResetToken && (
                  <p className="w-full rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700">
                    Development reset token: {devResetToken}
                  </p>
                )}
                <Link
                  to="/login"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] font-bold py-3.5 rounded-xl transition-all mt-4 flex justify-center items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
