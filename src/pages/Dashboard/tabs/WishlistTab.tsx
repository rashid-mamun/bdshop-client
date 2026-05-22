import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Package, ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '../../../store/useWishlistStore';
import { useCartStore } from '../../../store/useCartStore';
import { useToast } from '../../../hooks/useToast';

export default function WishlistTab() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { success } = useToast();

  const handleAddToCart = (item: WishlistItem) => {
    addItem({ _id: item._id, name: item.model || item.name, model: item.model, price: item.price, img: item.img, quantity: 1 });
    success(`${item.model || item.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-red-600">
              <Heart className="h-4 w-4 fill-current" />
              Saved products
            </div>
            <h2 className="text-2xl font-black tracking-tight text-gray-950">Wishlist</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {items.length ? `${items.length} item${items.length === 1 ? '' : 's'} saved for later.` : 'Save products you want to revisit.'}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-xl bg-[#1a8a4a] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#157a3f]"
          >
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-400">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-black text-gray-900">Your wishlist is empty</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500">
            Tap the heart on product cards and your saved picks will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <article key={item._id} className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <Link to={`/products/${item._id}`} className="block">
                <div className="relative aspect-[4/3] bg-[#f8fbf9]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#1a8a4a]">
                    <Package className="h-12 w-12 opacity-35" />
                  </div>
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.model || item.name}
                      className="relative h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a8a4a] shadow-sm">
                    Saved
                  </span>
                </div>
              </Link>

              <div className="p-4">
                {item.category && <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">{item.category}</p>}
                <Link to={`/products/${item._id}`}>
                  <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm font-black leading-5 text-gray-950 transition hover:text-[#1a8a4a]">
                    {item.model || item.name}
                  </h3>
                </Link>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-gray-950">Tk {item.price?.toLocaleString()}</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-xs font-semibold text-gray-400 line-through">Tk {item.originalPrice?.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#1a8a4a]" />
                    Verified
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#1a8a4a] px-3 text-sm font-black text-white transition hover:bg-[#157a3f]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
