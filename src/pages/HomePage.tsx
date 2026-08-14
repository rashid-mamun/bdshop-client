import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { ProductCard } from '../components/ProductCard';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import type { Product } from '../types/product';
import {
  Truck, RotateCcw, Headphones, ShieldCheck,
  ArrowRight, Cpu, Car, Puzzle, Zap, Star, ChevronRight, ChevronLeft, Package, BadgePercent, Store, CreditCard
} from 'lucide-react';

/* ─── Data constants ─────────────────────────── */
const TRUST_BADGES = [
  { icon: Truck, title: 'Free Delivery', sub: 'On orders over ৳5000', color: 'text-green-600 bg-green-50' },
  { icon: RotateCcw, title: 'Easy Returns', sub: '30-day return policy', color: 'text-blue-600 bg-blue-50' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always here for you', color: 'text-purple-600 bg-purple-50' },
  { icon: ShieldCheck, title: 'Secure Payment', sub: 'SSL encrypted checkout', color: 'text-orange-600 bg-orange-50' },
];

const HERO_CATEGORIES = [
  { icon: Cpu, label: 'Electronics', to: '/products?category=Electronics', bg: 'bg-blue-600', tone: 'from-blue-500 to-cyan-400' },
  { icon: Car, label: 'Vehicles', to: '/products?category=Vehicles', bg: 'bg-gray-700', tone: 'from-slate-700 to-slate-400' },
  { icon: Puzzle, label: 'Accessories', to: '/products?category=Accessories', bg: 'bg-purple-600', tone: 'from-violet-500 to-fuchsia-400' },
  { icon: Zap, label: 'New Arrivals', to: '/products?sort=newest', bg: 'bg-amber-500', tone: 'from-amber-400 to-orange-500' },
];

const CAMPAIGN_TILES = [
  {
    icon: BadgePercent,
    label: 'Today only',
    title: 'Mega deals on daily tech',
    sub: 'Save up to 35% on laptops, audio and smart gadgets.',
    to: '/products?sort=price_asc',
    tone: 'from-[#102819] via-[#14532d] to-[#1a8a4a]',
    accent: 'bg-emerald-300',
  },
  {
    icon: Store,
    label: 'Verified sellers',
    title: 'Curated marketplace picks',
    sub: 'Quality checked products with clear support.',
    to: '/products?featured=true',
    tone: 'from-slate-900 via-slate-700 to-slate-500',
    accent: 'bg-sky-300',
  },
  {
    icon: CreditCard,
    label: 'Flexible checkout',
    title: 'Pay your way',
    sub: 'Cards, COD and mobile wallet-ready flow.',
    to: '/products',
    tone: 'from-amber-500 via-orange-500 to-red-500',
    accent: 'bg-amber-100',
  },
];

const BRAND_NAMES = ['NovaTech', 'SoundCore', 'AeroFit', 'PixelMate', 'UrbanRide', 'DrivePro', 'ChargeMax', 'HomeHub'];

/* ─── Skeleton ───────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse min-w-[240px] md:min-w-0">
      <div className="aspect-[4/3] bg-gray-100 sm:aspect-square" />
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-7 min-w-0">
      <div className="min-w-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {cta && ctaTo && (
        <Link to={ctaTo} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#1a8a4a] hover:gap-2 transition-all">
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
      
      <div ref={scrollRef} className="flex max-w-full gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
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
  const navigate = useNavigate();
  const { items: recentlyViewed } = useRecentlyViewedStore();

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
      return (res.data.data?.reviews || []) as any[];
    },
  });

  const heroProduct = featuredProducts?.[0];
  const showHeroVisual = true;
  const flashDisplay = flashProducts || [];
  const newDisplay = newArrivals || [];
  const featuredDisplay = featuredProducts || [];

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2617] via-[#1a3d26] to-[#0d4019]">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="bd-container py-10 md:py-14 lg:py-16 relative">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left — Copy */}
            <div className="text-white space-y-5 lg:space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3.5 py-1 text-xs sm:text-sm text-white/90">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                New arrivals every week
              </div>

              <h1 className="max-w-[18rem] break-words text-3xl font-black leading-[1.1] tracking-tight sm:max-w-none sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
                Premium Shopping
                <span className="block text-[#4ade80] mt-1">Made Simple</span>
              </h1>

              <p className="max-w-[19rem] break-words text-base sm:text-lg leading-relaxed text-white/75 sm:max-w-md">
                Discover curated electronics, vehicles & accessories with guaranteed authenticity and fast delivery across Bangladesh.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold px-7 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-900/40 active:scale-95 text-sm sm:text-base"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products?sort=price_asc"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur text-sm sm:text-base"
                >
                  View Deals
                </Link>
              </div>

              <div className="flex gap-6 pt-1 text-sm">
                {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.8★', 'Avg Rating']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="font-bold text-white text-base sm:text-lg">{val}</div>
                    <div className="text-white/60 text-xs">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual (Dynamic) */}
            <div className="hidden md:flex justify-center">
              {showHeroVisual && (
                <div className="relative group cursor-pointer" onClick={() => navigate(heroProduct ? `/products/${heroProduct._id}` : '/products')}>
                  <div className="absolute inset-0 bg-[#1a8a4a] opacity-20 blur-[80px] rounded-full scale-75 group-hover:opacity-30 transition-opacity" />
                  <div className="relative w-[380px] rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-transform duration-300 hover:-translate-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      {HERO_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <div
                            key={cat.label}
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.tone} p-4 text-white shadow-lg shadow-black/10`}
                          >
                            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20" />
                            <Icon className="relative h-8 w-8" />
                            <p className="relative mt-6 text-sm font-black">{cat.label}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-white">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Featured drop</p>
                          <p className="mt-1 line-clamp-1 font-black">{heroProduct?.model || 'Curated deals for every lifestyle'}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#4ade80]/15 px-3 py-1 text-sm font-black text-[#4ade80]">
                          {heroProduct ? `৳${heroProduct.price.toLocaleString()}` : 'New'}
                        </span>
                      </div>
                    </div>
                    {(heroProduct?.isNewArrival || !heroProduct) && (
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
        <div className="bd-container py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <section className="bg-[#f8f9fa] py-8">
        <div className="bd-container grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <Link
            to={CAMPAIGN_TILES[0].to}
            className={`group relative min-h-[260px] overflow-hidden rounded-3xl bg-gradient-to-br ${CAMPAIGN_TILES[0].tone} p-6 text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:p-8`}
          >
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute bottom-0 right-6 hidden h-40 w-40 rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur md:block" />
            <div className="relative flex h-full max-w-xl flex-col justify-between gap-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-100">
                  <BadgePercent className="h-4 w-4" />
                  {CAMPAIGN_TILES[0].label}
                </span>
                <h2 className="mt-5 max-w-[15rem] break-words text-2xl font-black leading-tight sm:max-w-lg sm:text-3xl md:text-5xl">
                  {CAMPAIGN_TILES[0].title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/75 md:text-base">
                  {CAMPAIGN_TILES[0].sub}
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#14532d] transition-transform group-hover:translate-x-1">
                Shop campaign <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {CAMPAIGN_TILES.slice(1).map((tile) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.title}
                  to={tile.to}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${tile.tone} p-6 text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-125" />
                  <div className={`relative mb-8 flex h-11 w-11 items-center justify-center rounded-2xl ${tile.accent} text-slate-950`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/55">{tile.label}</p>
                  <h3 className="mt-2 text-xl font-black">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{tile.sub}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-5 border-y border-gray-100">
        <div className="bd-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-black uppercase tracking-widest text-gray-400">Popular brands</p>
          <div className="flex max-w-full gap-3 overflow-x-auto scrollbar-hide">
            {BRAND_NAMES.map((brand) => (
              <Link
                key={brand}
                to={`/products?search=${encodeURIComponent(brand)}`}
                className="shrink-0 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-[#1a8a4a]/30 hover:bg-[#e8f5ee] hover:text-[#1a8a4a]"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═════════════════════════════ */}
      <section className="bg-[#f8f9fa] py-5">
        <div className="bd-container grid gap-4 md:grid-cols-3">
          {[
            { title: 'Pay safely', sub: 'Cards, COD, bKash-ready checkout', tone: 'from-emerald-50 to-white border-emerald-100' },
            { title: 'Delivery estimate', sub: 'Fast dispatch across Bangladesh', tone: 'from-blue-50 to-white border-blue-100' },
            { title: 'Verified sellers', sub: 'Curated products with clear support', tone: 'from-amber-50 to-white border-amber-100' },
          ].map((item) => (
            <div key={item.title} className={`rounded-2xl border bg-gradient-to-br ${item.tone} p-5`}>
              <p className="text-sm font-black text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm text-gray-600">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bd-container py-12">
        <SectionHeader title="Shop by Category" subtitle="Browse our curated collections" />
        <div className="grid grid-cols-1 min-[460px]:grid-cols-2 sm:grid-cols-4 gap-4">
          {HERO_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                to={cat.to}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.tone} aspect-[4/3] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-125" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <Icon className="absolute right-5 top-5 h-14 w-14 text-white/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
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
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="bd-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7 min-w-0">
            <div className="flex min-w-0 items-center gap-4">
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
            <Link to="/products?sort=price_asc" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#1a8a4a] hover:gap-2 transition-all">
              All Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingFlash ? (
            <HorizontalScroller>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[220px] sm:min-w-[240px] md:min-w-[280px] snap-start">
                  <ProductSkeleton />
                </div>
              ))}
            </HorizontalScroller>
          ) : (
            <HorizontalScroller>
              {flashDisplay.map((product: Product) => (
                <div key={product._id} className="min-w-[220px] sm:min-w-[240px] md:min-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </HorizontalScroller>
          )}
        </div>
      </section>

      {/* ═══ NEW ARRIVALS (Row) ═════════════════════ */}
      <section className="bd-container py-12">
        <SectionHeader
          title="New Arrivals"
          subtitle="The latest and greatest just landed"
          cta="See All"
          ctaTo="/products?sort=newest"
        />
        {loadingNew ? (
          <HorizontalScroller>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[220px] sm:min-w-[240px] md:min-w-[280px] snap-start">
                <ProductSkeleton />
              </div>
            ))}
          </HorizontalScroller>
        ) : (
          <HorizontalScroller>
            {newDisplay.map((product: Product) => (
              <div key={product._id} className="min-w-[220px] sm:min-w-[240px] md:min-w-[280px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </HorizontalScroller>
        )}
      </section>

      {/* ═══ FEATURED PRODUCTS (Grid) ═══════════════ */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="bd-container">
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
              {featuredDisplay.map((p: Product) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ══════════════════════════ */}
      <section className="py-14 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="bd-container">
          <div className="text-center mb-12">
            <h2 className="mx-auto max-w-xs break-words text-2xl md:max-w-full md:text-3xl font-bold text-[#1a1a1a]">Why Thousands Choose BD Shop</h2>
            <p className="text-gray-500 mt-2 max-w-xs md:max-w-xl mx-auto">We don't just sell products — we deliver experiences worth coming back for</p>
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
                <p className="max-w-xs break-words text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER REVIEWS ═══════════════════════ */}
      {reviews && reviews.length > 0 && (
        <section className="bd-container py-12">
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
      {recentlyViewed.length > 0 && (
        <section className="py-12 bg-[#f8fbf9] border-y border-gray-100">
          <div className="bd-container">
            <SectionHeader
              title="Recently Viewed"
              subtitle="Quick jump back to products you opened"
              cta="Browse all"
              ctaTo="/products"
            />
            <div className="flex max-w-full gap-4 overflow-x-auto rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm scrollbar-hide md:p-5">
              {recentlyViewed.slice(0, 6).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group flex min-w-[300px] max-w-[340px] items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-[#1a8a4a]/30 hover:shadow-md sm:min-w-[360px]"
                >
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eefaf3] to-white text-[#1a8a4a]">
                      <Package className="h-8 w-8 opacity-70" />
                    </div>
                    <img
                      src={product.img}
                      alt={product.model}
                      className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {product.category && (
                      <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-[#1a8a4a]">
                        {product.category}
                      </p>
                    )}
                    <p className="line-clamp-2 text-base font-black leading-snug text-gray-950">
                      {product.model}
                    </p>
                    <p className="mt-2 text-lg font-black text-[#1a8a4a]">
                      ৳{product.price.toLocaleString()}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gray-500 transition-colors group-hover:text-[#1a8a4a]">
                      View product <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2617] to-[#1a4d2a]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-[#1a8a4a]/30 border border-[#1a8a4a]/40 text-green-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Limited Time Offer
          </span>
          <h2 className="mx-auto max-w-xs break-words text-3xl md:max-w-full md:text-4xl font-black text-white mb-4 leading-tight">
            Ready to Upgrade Your Life?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xs md:max-w-lg mx-auto">
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
