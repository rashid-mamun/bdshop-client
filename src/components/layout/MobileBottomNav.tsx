import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export function MobileBottomNav() {
  const location = useLocation();
  const { items, toggleCart } = useCartStore();
  const { user } = useAuthStore();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const tabs = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Search, label: 'Search', to: '/products' },
    { icon: ShoppingCart, label: 'Cart', action: toggleCart, count: cartCount },
    { icon: User, label: 'Account', to: user ? '/dashboard' : '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.to ? location.pathname === tab.to : false;

          if (tab.action) {
            return (
              <button
                key={tab.label}
                onClick={tab.action}
                className="flex-1 flex flex-col items-center justify-center py-2.5 relative"
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#1a8a4a]' : 'text-gray-500'}`} />
                  {tab.count && tab.count > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 min-w-[16px] px-0.5 bg-[#1a8a4a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#1a8a4a]' : 'text-gray-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              to={tab.to!}
              className="flex-1 flex flex-col items-center justify-center py-2.5"
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#1a8a4a]' : 'text-gray-500'}`} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#1a8a4a]' : 'text-gray-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1a8a4a] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
