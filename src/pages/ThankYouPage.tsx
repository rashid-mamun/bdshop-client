import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Home, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  const orderId = `BDS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return (
    <div className="bg-[#f8f9fa] min-h-[80vh] flex items-center justify-center px-6 py-16 pb-24 md:pb-16">
      <div className="max-w-lg w-full text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-[#e8f5ee] flex items-center justify-center">
              <CheckCircle className="h-14 w-14 text-[#1a8a4a]" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 h-9 w-9 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-8"
        >
          <h1 className="text-3xl font-black text-[#1a1a1a]">Order Confirmed!</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Thank you for shopping with BD Shop. Your order has been placed and is being processed.
          </p>
        </motion.div>

        {/* Order ID card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-left"
        >
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Order Details</p>
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">Order ID</span>
            <span className="font-bold text-[#1a1a1a] font-mono">{orderId}</span>
          </div>

          <div className="space-y-3">
            {[
              { icon: Package, text: 'Confirmation email sent to your inbox', color: 'text-[#1a8a4a] bg-[#e8f5ee]' },
              { icon: Clock, text: 'Processing usually takes 1–2 business days', color: 'text-blue-600 bg-blue-50' },
              { icon: Truck, text: 'Estimated delivery: 3–5 business days', color: 'text-purple-600 bg-purple-50' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-700 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
          >
            View My Orders <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-[#1a8a4a] text-[#1a1a1a] font-bold py-3.5 rounded-xl transition-all hover:shadow-sm"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-gray-400 mt-5"
        >
          Need help? <Link to="/about" className="text-[#1a8a4a] hover:underline">Contact our support team</Link>
        </motion.p>
      </div>
    </div>
  );
}
