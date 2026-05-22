import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-[75vh] flex items-center justify-center px-6 py-16 pb-24 md:pb-16">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* 404 */}
          <div className="relative inline-block mb-8">
            <p className="text-[140px] font-black text-gray-100 leading-none select-none">404</p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#1a8a4a] shadow-sm ring-1 ring-gray-100">
                <Search className="h-10 w-10" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#1a1a1a] mb-3">Page Not Found</h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-[#1a8a4a] text-[#1a1a1a] font-bold px-8 py-3.5 rounded-xl transition-all hover:text-[#1a8a4a]"
            >
              <Search className="h-4 w-4" /> Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
