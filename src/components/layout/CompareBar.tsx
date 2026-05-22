import { Link } from 'react-router-dom';
import { BarChart3, X } from 'lucide-react';
import { useCompareStore } from '../../store/useCompareStore';

export function CompareBar() {
  const { items, removeItem, clear } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <div className="fixed left-4 right-4 bottom-20 md:bottom-5 z-50 mx-auto max-w-3xl">
      <div className="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-black text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#1a8a4a]">
              <BarChart3 className="h-4 w-4" />
            </span>
            Compare {items.length}/3
          </div>
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {items.map((item) => (
              <div key={item._id} className="flex min-w-[150px] items-center gap-2 rounded-xl bg-gray-50 p-2">
                <img src={item.img} alt={item.model} className="h-9 w-9 rounded-lg object-contain bg-white" />
                <span className="truncate text-xs font-semibold text-gray-700">{item.model}</span>
                <button onClick={() => removeItem(item._id)} className="ml-auto text-gray-400 hover:text-red-500" aria-label="Remove from compare">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Link to="/products?compare=true" className="rounded-xl bg-[#1a8a4a] px-4 py-2 text-sm font-bold text-white hover:bg-[#157a3f]">
              Compare
            </Link>
            <button onClick={clear} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
