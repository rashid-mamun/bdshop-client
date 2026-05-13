import { Link, useSearchParams } from 'react-router-dom';
import { Cpu, Car, Puzzle, Tag, Sparkles, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Products', icon: <ChevronRight className="h-3.5 w-3.5" />, value: '' },
  { label: 'Electronics', icon: <Cpu className="h-3.5 w-3.5" />, value: 'Electronics' },
  { label: 'Vehicles', icon: <Car className="h-3.5 w-3.5" />, value: 'Vehicles' },
  { label: 'Accessories', icon: <Puzzle className="h-3.5 w-3.5" />, value: 'Accessories' },
  { label: '🔥 Deals', icon: <Tag className="h-3.5 w-3.5" />, value: '', special: 'deals', className: 'text-orange-600 font-semibold' },
  { label: '✨ New Arrivals', icon: <Sparkles className="h-3.5 w-3.5" />, value: '', special: 'new', className: 'text-purple-600 font-semibold' },
];

export function CategoryNav() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value && !cat.special;
            const href = cat.special === 'deals'
              ? '/products?sort=price-asc'
              : cat.special === 'new'
              ? '/products?sort=newest'
              : cat.value
              ? `/products?category=${encodeURIComponent(cat.value)}`
              : '/products';

            return (
              <Link
                key={cat.label}
                to={href}
                className={`
                  flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-all duration-200
                  ${isActive
                    ? 'border-[#1a8a4a] text-[#1a8a4a] font-semibold'
                    : 'border-transparent text-gray-600 hover:text-[#1a8a4a] hover:border-[#1a8a4a]/40'
                  }
                  ${cat.className || ''}
                `}
              >
                {cat.icon}
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
