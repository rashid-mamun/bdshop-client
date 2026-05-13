import { useState } from 'react';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { useCartStore } from '../../../store/useCartStore';
import { useToast } from '../../../hooks/useToast';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';

export default function WishlistTab() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { success } = useToast();

  const handleAddToCart = (item: any) => {
    addItem({ _id: item._id, name: item.model || item.name, model: item.model, price: item.price, img: item.img, quantity: 1 });
    success(`${item.model || item.name} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-10 w-10 text-red-300" />
        </div>
        <h3 className="font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 text-sm mb-6">Save items you love for later</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-[#1a8a4a] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#157a3f] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative">
          {/* Remove button */}
          <button
            onClick={() => removeItem(item._id)}
            className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <Link to={`/products/${item._id}`}>
            <div className="relative h-40 bg-gray-50 overflow-hidden">
              <img
                src={item.img}
                alt={item.model}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=No+Image'; }}
              />
            </div>
          </Link>

          <div className="p-4">
            {item.category && <p className="text-xs font-medium text-[#1a8a4a] mb-1">{item.category}</p>}
            <Link to={`/products/${item._id}`}>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-[#1a8a4a] transition-colors">{item.model}</h3>
            </Link>

            <div className="mt-2">
              <p className="text-base font-black text-gray-900">৳{item.price?.toLocaleString()}</p>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-xs text-gray-400 line-through">৳{item.originalPrice?.toLocaleString()}</p>
              )}
            </div>

            <button
              onClick={() => handleAddToCart(item)}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
