import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useToast } from '../hooks/useToast';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

interface ProductProps {
  product: {
    _id: string;
    name: string;
    model: string;
    price: number;
    img: string;
    description: string;
    category?: string;
    config?: string;
    averageRating?: number;
    reviewCount?: number;
    originalPrice?: number;
    isFeatured?: boolean;
    isFlashDeal?: boolean;
    discountPercent?: number;
    isNewArrival?: boolean;
  };
  discountPercent?: number; // Kept for backward compatibility if passed directly
}

export function ProductCard({ product, discountPercent }: ProductProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { success } = useToast();
  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: product._id,
      name: product.name,
      model: product.model,
      price: product.price,
      img: product.img,
      quantity: 1,
    });
    success(`${product.model} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      _id: product._id,
      name: product.name,
      model: product.model,
      price: product.price,
      img: product.img,
      category: product.category,
    });
  };

  const rating = product.averageRating || 0;
  const fullStars = Math.round(rating);
  const discount = discountPercent || product.discountPercent || 0;

  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden h-full flex flex-col">

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.img || 'https://via.placeholder.com/400x400'}
            alt={product.model}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-[#1a8a4a] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm animate-pulse">
                NEW
              </span>
            )}
          </div>

          {/* Overlay Actions — appear on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`
              absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full flex items-center justify-center shadow-md
              transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
              ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500 hover:text-red-500'}
            `}
            aria-label="Toggle wishlist"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a8a4a] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#157a3f] transition-colors shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1 bg-white relative z-10">
          {/* Category tag */}
          {product.category && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              {product.category}
            </span>
          )}

          {/* Name */}
          <h3 className="font-semibold text-[#1a1a1a] text-sm leading-snug line-clamp-1 mb-2">
            {product.model}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${s <= fullStars ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount || 0})</span>
          </div>

          {/* Price Row */}
          <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#1a8a4a]">
                  ৳{product.price.toLocaleString()}
                </span>
                {(product.originalPrice && product.originalPrice > product.price) ? (
                  <span className="text-xs font-medium text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
