import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const STYLES = {
  success: {
    container: 'bg-white border border-green-200 shadow-lg shadow-green-50',
    icon: 'text-[#1a8a4a] bg-[#e8f5ee]',
    text: 'text-[#1a1a1a]',
    IconComp: CheckCircle,
  },
  error: {
    container: 'bg-white border border-red-200 shadow-lg shadow-red-50',
    icon: 'text-red-600 bg-red-50',
    text: 'text-[#1a1a1a]',
    IconComp: XCircle,
  },
  info: {
    container: 'bg-white border border-blue-200 shadow-lg shadow-blue-50',
    icon: 'text-blue-600 bg-blue-50',
    text: 'text-[#1a1a1a]',
    IconComp: Info,
  },
};

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = STYLES[toast.type] || STYLES.info;
          const Icon = style.IconComp;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl ${style.container}`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${style.icon}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className={`text-sm font-medium flex-1 mt-1 ${style.text}`}>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
