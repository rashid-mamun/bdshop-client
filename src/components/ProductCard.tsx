import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCompareStore } from '../store/useCompareStore';
import { useToast } from '../hooks/useToast';
import { BarChart3, Heart, Package, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductProps {
  product: Product;
  discountPercent?: number;
}

export function ProductCard({ product, discountPercent }: ProductProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const { success } = useToast();
  const wishlisted = isInWishlist(product._id);
  const compared = isInCompare(product._id);

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
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      stock: product.stock,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleCompare({
      _id: product._id,
      name: product.name,
      model: product.model,
      price: product.price,
      img: product.img,
      category: product.category,
      originalPrice: product.originalPrice,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      stock: product.stock,
    });
  };

  const rating = product.averageRating || 0;
  const fullStars = Math.round(rating);
  const discount = discountPercent || product.discountPercent || 0;

  return (
    <Link to={`/products/${product._id}`} className="block group min-w-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden h-full flex min-w-0 flex-col">

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center p-4 sm:aspect-square">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#eefaf3] via-white to-[#f3f7ff] text-[#1a8a4a]">
            <Package className="h-12 w-12 opacity-70" />
          </div>
          <img
            src={product.img || 'https://via.placeholder.com/400x400'}
            alt={product.model}
            className="relative z-10 max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
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

          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`h-9 w-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0 ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500 hover:text-red-500'}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCompare}
              className={`h-9 w-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0 ${compared ? 'bg-[#e8f5ee] text-[#1a8a4a]' : 'bg-white text-gray-500 hover:text-[#1a8a4a]'}`}
              aria-label={compared ? 'Remove from compare' : 'Add to compare'}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>

          {/* Quick View */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
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
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-baseline gap-2">
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
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1">
              <Truck className="h-3.5 w-3.5 text-[#1a8a4a]" />
              24-72h delivery
            </span>
            {typeof product.stock === 'number' && product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-red-600">
                Only {product.stock} left
              </span>
            ) : (
              <span className="hidden items-center gap-1 rounded-full bg-[#e8f5ee] px-2 py-1 text-[#1a8a4a] sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
