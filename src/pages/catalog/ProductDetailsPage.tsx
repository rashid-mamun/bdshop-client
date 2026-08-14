import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../../services/apiClient';
import { Textarea } from '../../components/ui/textarea';
import { Skeleton } from '../../components/ui/skeleton';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/useToast';
import { ProductCard } from '../../components/ProductCard';
import {
  Heart, ShoppingCart, Star, ChevronLeft, ChevronRight,
  Truck, RotateCcw, ShieldCheck, Share2, Minus, Plus,
  ChevronRight as ChevRight, CheckCircle2, Zap, Ruler, Mail, X, Package
} from 'lucide-react';

type Tab = 'description' | 'specs' | 'reviews';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addRecentlyViewed } = useRecentlyViewedStore();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [currentImg, setCurrentImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [reviewForm, setReviewForm] = useState({ title: '', description: '', star: 5 });
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');

  // Reset image and qty when id changes
  useEffect(() => {
    setCurrentImg(0);
    setQty(1);
    setActiveTab('description');
  }, [id]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/services/${id}`);
      return res.data.data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await apiClient.get('/reviews', { params: { serviceId: id } });
      return (res.data.data?.reviews || []) as any[];
    },
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ['related', product?.category],
    queryFn: async () => {
      const res = await apiClient.get('/services', { params: { category: product.category, limit: '5' } });
      return res.data.data.services as any[];
    },
    enabled: !!product?.category,
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: typeof reviewForm) =>
      apiClient.post('/reviews', {
        ...data, serviceId: id,
        name: user?.displayName,
        email: user?.email,
        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=e8f5ee&color=1a8a4a`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['canReview', id] });
      setReviewForm({ title: '', description: '', star: 5 });
      success('Review submitted!');
    },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Could not submit review.'),
  });

  // Check if logged-in user has a delivered order for this product
  const { data: canReviewData } = useQuery({
    queryKey: ['canReview', id],
    queryFn: async () => {
      const res = await apiClient.get(`/reviews/can-review/${id}`);
      return res.data.data as { canReview: boolean; alreadyReviewed: boolean };
    },
    enabled: !!user && !!id,
    retry: false,
  });
  const canReview = canReviewData?.canReview ?? false;
  const alreadyReviewed = canReviewData?.alreadyReviewed ?? false;

  const notifyMutation = useMutation({
    mutationFn: async (email: string) =>
      apiClient.post(`/services/${id}/notify`, { email }),
    onSuccess: () => {
      success('Back-in-stock alert saved!');
      setNotifyEmail('');
    },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Could not save alert.'),
  });

  const wishlisted = isInWishlist(id!);
  const images = product?.images?.length > 0 ? product.images : (product?.img ? [product.img] : []);
  const avgRating = product?.averageRating || 0;
  const reviewCount = product?.reviewCount || 0;
  const inStock = (product?.stock ?? 10) > 0;
  const lowStock = inStock && (product?.stock ?? 10) <= 5;

  useEffect(() => {
    if (!product?._id) return;
    addRecentlyViewed({
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
  }, [addRecentlyViewed, product]);

  const addCurrentToCart = () => {
    addItem({ _id: product._id, name: product.name, model: product.model, price: product.price, img: product.img, quantity: qty });
    success(`${product.model} added to cart!`);
  };

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="bd-container py-8 md:py-12 bg-[#f8f9fa] min-h-screen">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl w-full" />
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="w-20 h-20 rounded-xl shrink-0" />)}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-48 mt-4" />
            <div className="space-y-2 mt-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-14 w-full mt-8 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-[#f8f9fa] px-4">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-[#1a8a4a]">
          <Package className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-black text-[#1a1a1a]">Product Not Found</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-sm text-lg">This product may have been removed or doesn't exist.</p>
        <Link to="/products" className="bg-[#1a8a4a] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#157a3f] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.model,
        text: `Check out ${product.model} on BDShop!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      success("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16 md:pb-0">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="bd-container py-3.5 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-[#1a8a4a] transition-colors font-medium">Home</Link>
          <ChevRight className="h-4 w-4 text-gray-300 shrink-0" />
          <Link to="/products" className="hover:text-[#1a8a4a] transition-colors font-medium">Products</Link>
          {product.category && (
            <>
              <ChevRight className="h-4 w-4 text-gray-300 shrink-0" />
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#1a8a4a] transition-colors font-medium">{product.category}</Link>
            </>
          )}
          <ChevRight className="h-4 w-4 text-gray-300 shrink-0" />
          <span className="text-[#1a1a1a] font-bold truncate">{product.model}</span>
        </div>
      </div>

      <div className="bd-container py-5 md:py-7">
        {/* ── Main Product Grid ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">

          {/* Left: Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden aspect-square group flex items-center justify-center">
              <img
                src={images[currentImg] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop'}
                alt={product.model}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(event) => {
                  event.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop';
                }}
              />
              
              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); setCurrentImg((p) => (p === 0 ? images.length - 1 : p - 1)); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white text-gray-800 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); setCurrentImg((p) => (p === images.length - 1 ? 0 : p + 1)); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white text-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3.5 right-3.5 flex flex-col gap-2">
                <button 
                  onClick={handleShare}
                  className="h-9 w-9 bg-white/90 shadow-md rounded-full flex items-center justify-center hover:bg-white transition-all text-gray-600 hover:text-[#1a1a1a]"
                  title="Share product"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleItem({ _id: product._id, name: product.name, model: product.model, price: product.price, img: product.img, category: product.category })}
                  className={`h-9 w-9 bg-white/90 shadow-md rounded-full flex items-center justify-center hover:bg-white transition-all ${wishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                  title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                {product.isNewArrival && (
                  <span className="bg-[#1a8a4a] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide uppercase">
                    New Arrival
                  </span>
                )}
                {product.isFlashDeal && (
                  <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wide">
                    <Zap className="h-3 w-3 fill-current" /> Flash Deal
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center transition-all snap-center ${currentImg === i ? 'border-[#1a8a4a] shadow-md ring-2 ring-[#1a8a4a]/20' : 'border-transparent hover:border-gray-200 shadow-sm opacity-70 hover:opacity-100'}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-4 sm:space-y-5">
            {/* Category + Stock status */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {product.category && (
                <span className="text-xs font-bold text-[#1a8a4a] uppercase tracking-wider">
                  {product.category}
                </span>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              {inStock ? (
                <span className="text-xs sm:text-sm font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-bold text-red-500 flex items-center gap-1">
                  Out of Stock
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-3xl font-black text-[#1a1a1a] leading-snug tracking-tight">{product.model}</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1 font-medium">{product.name}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                <span className="text-xs sm:text-sm font-bold text-amber-600 ml-1.5">{avgRating.toFixed(1)}</span>
              </div>
              <a href="#reviews" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Read {reviewCount} Reviews
              </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3.5 py-4 border-y border-gray-100">
              <span className="text-3xl sm:text-4xl font-black text-[#1a8a4a]">৳{product.price?.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg sm:text-xl font-medium text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>
                  <span className="text-xs sm:text-sm font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quick specs */}
            {product.config && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-[#1a1a1a] whitespace-nowrap">Key Features:</span>
                  <span className="font-medium">{product.config}</span>
                </div>
              </div>
            )}

            {lowStock && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                Only {product.stock} left. Order now before this batch sells out.
              </div>
            )}

            <button
              onClick={() => setSizeGuideOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1a8a4a] hover:text-[#157a3f]"
            >
              <Ruler className="h-4 w-4" /> Product buying guide
            </button>

            {/* Add to cart section */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1a1a1a]">Quantity</span>
                <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 active:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-14 text-center font-bold text-[#1a1a1a] text-lg select-none">{qty}</span>
                  <button
                    disabled={qty >= (product.stock || 99)}
                    onClick={() => setQty((q) => q + 1)}
                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 active:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!inStock}
                  onClick={addCurrentToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!inStock}
                  onClick={() => {
                    addItem({ _id: product._id, name: product.name, model: product.model, price: product.price, img: product.img, quantity: qty });
                    navigate('/checkout');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Buy Now
                </motion.button>
              </div>
              {!inStock && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-bold text-blue-900">Get notified when it is back</p>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Email address"
                      className="min-w-0 flex-1 rounded-xl border border-blue-100 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                    <button
                      disabled={notifyMutation.isPending}
                      onClick={() => {
                        if (!notifyEmail.trim()) return;
                        notifyMutation.mutate(notifyEmail);
                      }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {notifyMutation.isPending ? '...' : <Mail className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Trust strips */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: 'Fast Delivery', sub: 'Across BD' },
                { icon: RotateCcw, text: '30-Day Return', sub: 'Hassle-free' },
                { icon: ShieldCheck, text: '100% Genuine', sub: 'Verified product' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center justify-center text-center bg-white border border-gray-100 shadow-sm rounded-xl p-4 transition-transform hover:-translate-y-1">
                  <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 text-[#1a8a4a]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-[#1a1a1a] mb-0.5">{text}</p>
                  <p className="text-[10px] font-medium text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Specs / Reviews ── */}
        <div id="details-section" className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {(['description', 'specs', 'reviews'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] py-5 text-sm font-bold capitalize transition-all border-b-2 ${activeTab === tab ? 'border-[#1a8a4a] text-[#1a8a4a] bg-green-50/30' : 'border-transparent text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50'}`}
              >
                {tab}
                {tab === 'reviews' && reviewCount > 0 && (
                  <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-[#1a8a4a] text-white' : 'bg-gray-100 text-gray-600'}`}>{reviewCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10">
            {/* Description */}
            {activeTab === 'description' && (
              <div className="prose prose-green max-w-none">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">Product Overview</h3>
                <p className="text-gray-600 leading-relaxed text-base font-medium whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Technical Specifications</h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { label: 'Brand/Manufacturer', value: product.name },
                        { label: 'Model', value: product.model },
                        { label: 'Category', value: product.category },
                        { label: 'Configuration', value: product.config },
                        ...Object.entries(product.specifications || {}).map(([label, value]) => ({ label, value })),
                        { label: 'Made In', value: product.madeIn },
                        { label: 'Release Date', value: product.date ? new Date(product.date).toLocaleDateString() : '-' },
                      ].filter((r) => r.value).map((row, i) => (
                        <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-4 pl-6 pr-4 text-gray-500 font-bold w-1/3">{row.label}</td>
                          <td className="py-4 pr-6 text-[#1a1a1a] font-semibold">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="grid md:grid-cols-5 gap-10">
                {/* Review list */}
                <div className="md:col-span-3 space-y-5">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                    Customer Reviews <span className="bg-gray-100 text-gray-600 text-sm px-2.5 py-0.5 rounded-full">{reviewCount}</span>
                  </h3>
                  
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <div key={review._id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=e8f5ee&color=1a8a4a`}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-50"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div>
                                <p className="font-bold text-[#1a1a1a] text-base">{review.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star key={s} className={`h-3.5 w-3.5 ${s <= review.star ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`} />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                              </div>
                              {review.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1a8a4a] bg-[#e8f5ee] px-2.5 py-1 rounded-md uppercase tracking-wider self-start">
                                  <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-[#1a1a1a] mt-3">{review.title}</h4>
                            {review.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">{review.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <div className="text-5xl mb-4 opacity-50">💬</div>
                      <h4 className="text-lg font-bold text-[#1a1a1a]">No reviews yet</h4>
                      <p className="text-gray-500 font-medium mt-1">Be the first to review this product!</p>
                    </div>
                  )}
                </div>

                {/* Write review */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 sticky top-24">
                    {!user ? (
                      <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl mb-2">🔐</div>
                        <div>
                          <h4 className="font-bold text-[#1a1a1a] text-lg">Sign in to review</h4>
                          <p className="text-sm text-gray-500 font-medium mt-1 mb-6">Your opinion matters to the community</p>
                        </div>
                        <Link
                          to="/login"
                          className="bg-[#1a8a4a] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#157a3f] transition-colors shadow-md shadow-green-900/20 w-full"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    ) : alreadyReviewed ? (
                      <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
                        <div className="h-16 w-16 bg-[#e8f5ee] rounded-full flex items-center justify-center text-3xl mb-1">✅</div>
                        <h4 className="font-bold text-[#1a1a1a] text-lg">You've already reviewed this product</h4>
                        <p className="text-sm text-gray-500 font-medium">You can edit your review from <Link to="/my-account?tab=reviews" className="text-[#1a8a4a] underline font-bold">My Reviews</Link>.</p>
                      </div>
                    ) : canReview ? (
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-black text-[#1a1a1a] text-xl">Write a Review</h3>
                          <p className="text-sm text-gray-500 font-medium mt-1">Share your experience with this product to help other buyers make the right choice.</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black text-[#1a8a4a]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verified Purchase
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-sm font-bold text-[#1a1a1a] block mb-3">Overall Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => setReviewForm((f) => ({ ...f, star: s }))} type="button" className="focus:outline-none hover:scale-110 transition-transform">
                                <Star className={`h-8 w-8 transition-colors ${s <= reviewForm.star ? 'text-amber-400 fill-current drop-shadow-sm' : 'text-gray-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-bold text-[#1a1a1a] block mb-2">Review Title</label>
                          <input
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all shadow-sm"
                            placeholder="Brief summary of your review"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-bold text-[#1a1a1a] block mb-2">Detailed Feedback</label>
                          <Textarea
                            placeholder="What did you like or dislike? What should others know before buying?"
                            value={reviewForm.description}
                            onChange={(e) => setReviewForm((f) => ({ ...f, description: e.target.value }))}
                            rows={5}
                            className="w-full bg-white border border-gray-200 focus:border-[#1a8a4a] rounded-xl px-4 py-3 text-sm font-medium transition-all shadow-sm resize-none"
                          />
                        </div>

                        <button
                          disabled={!reviewForm.title || reviewMutation.isPending}
                          onClick={() => reviewMutation.mutate(reviewForm)}
                          className="w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-md shadow-green-900/20 mt-2"
                        >
                          {reviewMutation.isPending ? 'Submitting Review...' : 'Post Review'}
                        </button>
                      </div>
                    ) : (
                      // Logged in but no delivered order
                      <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                        <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-1">
                          <Package className="h-7 w-7 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1a1a1a] text-lg">Purchase required to review</h4>
                          <p className="text-sm text-gray-500 font-medium mt-1">Only customers who have received this product can leave a review. This keeps our reviews honest and trustworthy.</p>
                        </div>
                        <button
                          onClick={() => { addItem({ _id: id!, name: product?.model || product?.name, model: product?.model, price: product?.price, img: product?.img, quantity: 1 }); success('Added to cart!'); }}
                          className="mt-2 inline-flex items-center gap-2 bg-[#1a8a4a] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#157a3f] transition-colors shadow-md shadow-green-900/20"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy this product
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedData && relatedData.filter((p: any) => p._id !== id).length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a]">You May Also Like</h2>
                <p className="text-gray-500 font-medium mt-1 text-sm">Similar products in {product.category}</p>
              </div>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm font-bold text-[#1a8a4a] hover:text-[#157a3f] hover:underline flex items-center gap-1">
                View more <ChevRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {relatedData.filter((p: any) => p._id !== id).slice(0, 5).map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">Buying Guide</h3>
                <p className="mt-1 text-sm text-gray-500">Quick checks before you buy this product.</p>
              </div>
              <button onClick={() => setSizeGuideOpen(false)} className="rounded-xl bg-gray-100 p-2 text-gray-500 hover:text-gray-900" aria-label="Close buying guide">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {[
                ['Compatibility', 'Check model, configuration, voltage, and accessory support.'],
                ['Warranty', 'Keep invoice and packaging until warranty period starts.'],
                ['Delivery', 'Inspect product condition before accepting delivery.'],
                ['Returns', 'Return window applies only when product is unused and complete.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="font-black text-gray-900">{title}</p>
                  <p className="mt-1 text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {inStock && (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-gray-200 bg-white p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-500">{product.model}</p>
              <p className="text-lg font-black text-[#1a8a4a]">৳{product.price?.toLocaleString()}</p>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={addCurrentToCart} className="rounded-xl bg-[#1a8a4a] px-5 py-3 text-sm font-black text-white">
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                addCurrentToCart();
                navigate('/checkout');
              }}
              className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-black text-white"
            >
              Buy
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
