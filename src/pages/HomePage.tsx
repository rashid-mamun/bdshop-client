import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { ProductCard } from '../components/ProductCard';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import {
  Truck, RotateCcw, Headphones, ShieldCheck,
  ArrowRight, Cpu, Car, Puzzle, Zap, Star, ChevronRight, ChevronLeft
} from 'lucide-react';

/* ─── Data constants ─────────────────────────── */
const TRUST_BADGES = [
  { icon: Truck, title: 'Free Delivery', sub: 'On orders over ৳5000', color: 'text-green-600 bg-green-50' },
  { icon: RotateCcw, title: 'Easy Returns', sub: '30-day return policy', color: 'text-blue-600 bg-blue-50' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always here for you', color: 'text-purple-600 bg-purple-50' },
  { icon: ShieldCheck, title: 'Secure Payment', sub: 'SSL encrypted checkout', color: 'text-orange-600 bg-orange-50' },
];

const HERO_CATEGORIES = [
  { icon: Cpu, label: 'Electronics', to: '/products?category=Electronics', bg: 'bg-blue-600', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=70' },
  { icon: Car, label: 'Vehicles', to: '/products?category=Vehicles', bg: 'bg-gray-700', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&q=70' },
  { icon: Puzzle, label: 'Accessories', to: '/products?category=Accessories', bg: 'bg-purple-600', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&q=70' },
  { icon: Zap, label: 'New Arrivals', to: '/products?sort=newest', bg: 'bg-amber-500', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=70' },
];

/* ─── Skeleton ───────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse min-w-[240px] md:min-w-0">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-3/5" />
        <div className="h-5 bg-gray-200 rounded w-1/2 mt-3" />
      </div>
    </div>
  );
}

/* ─── Section Header ─────────────────────────── */
function SectionHeader({ title, subtitle, cta, ctaTo }: { title: string; subtitle?: string; cta?: string; ctaTo?: string }) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {cta && ctaTo && (
        <Link to={ctaTo} className="flex items-center gap-1 text-sm font-semibold text-[#1a8a4a] hover:gap-2 transition-all">
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/* ─── Horizontal Scroll Container ────────────── */
function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white/90 border border-gray-200 shadow-lg text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-gray-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6 md:mx-0 md:px-0">
        {children}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white/90 border border-gray-200 shadow-lg text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-gray-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────── */
export default function HomePage() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await apiClient.get('/services', { params: { featured: true, limit: '8' } });
      return res.data.data.services as any[];
    },
  });

  const { data: flashProducts, isLoading: loadingFlash } = useQuery({
    queryKey: ['flash-products'],
    queryFn: async () => {
      const res = await apiClient.get('/services', { params: { flashDeal: true, limit: '8' } });
      return res.data.data.services as any[];
    },
  });

  const { data: newArrivals, isLoading: loadingNew } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const res = await apiClient.get('/services', { params: { newArrival: true, limit: '6' } });
      return res.data.data.services as any[];
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      const res = await apiClient.get('/reviews', { params: { limit: '6' } });
      return res.data.data as any[];
    },
  });

  const heroProduct = featuredProducts?.[0];

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">

      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2617] via-[#1a3d26] to-[#0d4019]">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left — Copy */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                New arrivals every week
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Premium Shopping
                <span className="block text-[#4ade80] mt-1">Made Simple</span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Discover curated electronics, vehicles & accessories with guaranteed authenticity and fast delivery across Bangladesh.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-900/40 active:scale-95"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products?sort=price_asc"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur"
                >
                  View Deals
                </Link>
              </div>

              <div className="flex gap-6 pt-2 text-sm">
                {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.8★', 'Avg Rating']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="font-bold text-white text-lg">{val}</div>
                    <div className="text-white/50 text-xs">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual (Dynamic) */}
            <div className="hidden md:flex justify-center">
              {heroProduct && (
                <div className="relative group cursor-pointer" onClick={() => window.location.href = `/products/${heroProduct._id}`}>
                  <div className="absolute inset-0 bg-[#1a8a4a] opacity-20 blur-[80px] rounded-full scale-75 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 w-80 hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-white/10 rounded-2xl aspect-square flex items-center justify-center mb-5 p-4">
                      <img
                        src={heroProduct.img}
                        alt={heroProduct.model}
                        className="w-full h-full object-contain drop-shadow-2xl mix-blend-screen"
                      />
                    </div>
                    <div className="text-white space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold line-clamp-2 pr-2">{heroProduct.model}</span>
                        <span className="text-[#4ade80] font-bold shrink-0">৳{heroProduct.price.toLocaleString()}</span>
                      </div>
                    </div>
                    {heroProduct.isNewArrival && (
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                        NEW
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BADGES ═══════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═════════════════════════════ */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader title="Shop by Category" subtitle="Browse our curated collections" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {HERO_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                to={cat.to}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                  <div>
                    <div className={`h-8 w-8 ${cat.bg} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">{cat.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ FLASH DEALS (Row) ══════════════════════ */}
      <section className="py-12 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">Flash Deals</h2>
                </div>
                <p className="text-gray-500 text-sm">Limited time offers — don't miss out!</p>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Ends in</div>
                <CountdownTimer targetHours={6} />
              </div>
            </div>
            <Link to="/products?sort=price_asc" className="flex items-center gap-1 text-sm font-semibold text-[#1a8a4a] hover:gap-2 transition-all">
              All Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingFlash ? (
            <HorizontalScroller>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[240px] md:min-w-[280px] snap-start">
                  <ProductSkeleton />
                </div>
              ))}
            </HorizontalScroller>
          ) : flashProducts?.length ? (
            <HorizontalScroller>
              {flashProducts.map((product: any) => (
                <div key={product._id} className="min-w-[240px] md:min-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </HorizontalScroller>
          ) : (
            <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No flash deals available right now. Check back later!
            </div>
          )}
        </div>
      </section>

      {/* ═══ NEW ARRIVALS (Row) ═════════════════════ */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader
          title="New Arrivals"
          subtitle="The latest and greatest just landed"
          cta="See All"
          ctaTo="/products?sort=newest"
        />
        {loadingNew ? (
          <HorizontalScroller>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[240px] md:min-w-[280px] snap-start">
                <ProductSkeleton />
              </div>
            ))}
          </HorizontalScroller>
        ) : newArrivals?.length ? (
          <HorizontalScroller>
            {newArrivals.map((product: any) => (
              <div key={product._id} className="min-w-[240px] md:min-w-[280px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </HorizontalScroller>
        ) : (
          <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No new arrivals yet.
          </div>
        )}
      </section>

      {/* ═══ FEATURED PRODUCTS (Grid) ═══════════════ */}
      <section className="py-12 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto w-full">
          <SectionHeader
            title="Featured Products"
            subtitle="Hand-picked for quality and value"
            cta="View all products"
            ctaTo="/products"
          />
          {loadingFeatured ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <div key={i}><ProductSkeleton /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts?.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ══════════════════════════ */}
      <section className="py-14 px-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">Why Thousands Choose BD Shop</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">We don't just sell products — we deliver experiences worth coming back for</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: '100% Authentic', desc: 'Every item is genuine and sourced directly from verified brands and manufacturers.', bg: 'bg-green-50 border-green-100' },
              { icon: '🚚', title: 'Fast Nationwide Delivery', desc: 'Get your orders delivered to any district within 24–72 hours.', bg: 'bg-blue-50 border-blue-100' },
              { icon: '🎧', title: 'Real Human Support', desc: 'Talk to our experts via live chat, phone or email — 24 hours a day.', bg: 'bg-purple-50 border-purple-100' },
              { icon: '↩️', title: '30-Day Returns', desc: 'Not happy? Return it within 30 days, no questions asked.', bg: 'bg-orange-50 border-orange-100' },
            ].map((item) => (
              <div
                key={item.title}
                className={`${item.bg} border rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a1a] text-base mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER REVIEWS ═══════════════════════ */}
      {reviews && reviews.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto w-full">
          <SectionHeader title="What Customers Say" subtitle="Verified reviews from real buyers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.slice(0, 6).map((review: any) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= review.star ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-[#1a1a1a] text-sm mb-1">{review.title}</p>
                {review.description && (
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">{review.description}</p>
                )}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50 mt-auto">
                  <img
                    src={review.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&size=40&background=e8f5ee&color=1a8a4a`}
                    alt={review.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{review.name}</p>
                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-[#1a8a4a] bg-[#e8f5ee] px-2 py-1 rounded-full font-semibold">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CTA BANNER ══════════════════════════════ */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2617] to-[#1a4d2a]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-[#1a8a4a]/30 border border-[#1a8a4a]/40 text-green-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Limited Time Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            Ready to Upgrade Your Life?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Join 10,000+ happy customers. New arrivals drop every week — don't miss the next one.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl shadow-green-900/40 active:scale-95"
            >
              Browse All Products <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl transition-all duration-200 backdrop-blur"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
