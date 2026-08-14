import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { ProductCard } from '../../components/ProductCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  Search, SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight,
  Star, X, ChevronDown, ChevronUp, ShoppingCart, Package, ShieldCheck, Truck, BadgePercent, BarChart3
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCompareStore } from '../../store/useCompareStore';
import { useToast } from '../../hooks/useToast';

/* ─── Product skeleton card ──────────────────── */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
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

/* ─── Filter section toggle ──────────────────── */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-sm font-bold text-[#1a1a1a] mb-3"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

export default function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { items: compareItems, removeItem: removeCompareItem } = useCompareStore();
  const showCompareModal = searchParams.get('compare') === 'true';

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const closeCompareModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('compare');
    setSearchParams(next);
  };

  const { addItem } = useCartStore();
  const { success } = useToast();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const ratingFilter = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') === 'true';

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ? parseInt(minPrice) : 0,
    maxPrice ? parseInt(maxPrice) : 500000
  ]);

  useEffect(() => {
    setPriceRange([
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : 500000
    ]);
  }, [minPrice, maxPrice]);

  const setParams = (updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value); else next.delete(key);
      });
      if (!('page' in updates)) next.set('page', '1');
      return next;
    });
  };

  const setParam = (key: string, value: string) => {
    setParams({ [key]: value });
  };

  const clearAll = () => {
    setSearchInput('');
    setSearchParams({});
    setPriceRange([0, 500000]);
  };

  const handlePriceChangeComplete = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setParams({
        minPrice: value[0] > 0 ? String(value[0]) : '',
        maxPrice: value[1] < 500000 ? String(value[1]) : '',
      });
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, category, sort, search, minPrice, maxPrice, ratingFilter, inStock],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: '12', sort };
      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (ratingFilter) params.rating = ratingFilter;
      if (inStock) params.inStock = 'true';
      const res = await apiClient.get('/services', { params });
      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/services/categories/all');
      return res.data.data as string[];
    },
  });

  const hasActiveFilters = !!(search || category || sort || minPrice || maxPrice || ratingFilter || inStock);
  const apiProducts = (data?.services || []) as any[];
  const products = apiProducts;
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalCount = pagination?.total || products.length;
  const categories = categoriesData?.length ? categoriesData : ['Electronics', 'Vehicles', 'Accessories'];

  // Client-side filtering removed - now handled by backend

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParam('search', searchInput);
  };

  const handleListAddToCart = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: p._id,
      name: p.name,
      model: p.model,
      price: p.price,
      img: p.img,
      quantity: 1,
    });
    success(`${p.model} added to cart!`);
  };

  /* ─── Sidebar Component ─── */
  const Sidebar = () => (
    <aside className="w-full space-y-0">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
            <X className="h-3 w-3" /> Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-1.5 mt-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => setParam('category', '')}
              className="accent-[#1a8a4a] h-4 w-4"
            />
            <span className={`text-sm ${!category ? 'text-[#1a8a4a] font-bold' : 'text-gray-700 group-hover:text-[#1a8a4a]'}`}>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={category === cat}
                onChange={() => setParam('category', cat)}
                className="accent-[#1a8a4a] h-4 w-4"
              />
              <span className={`text-sm ${category === cat ? 'text-[#1a8a4a] font-bold' : 'text-gray-700 group-hover:text-[#1a8a4a]'}`}>{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-2 mt-4 mb-8">
          <Slider
            range
            min={0}
            max={500000}
            step={1000}
            value={priceRange}
            onChange={(val) => setPriceRange(val as [number, number])}
            onChangeComplete={handlePriceChangeComplete}
            trackStyle={[{ backgroundColor: '#1a8a4a' }]}
            handleStyle={[
              { borderColor: '#1a8a4a', backgroundColor: 'white', opacity: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
              { borderColor: '#1a8a4a', backgroundColor: 'white', opacity: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
            ]}
          />
        </div>
        <div className="flex items-center justify-between text-sm font-semibold text-[#1a1a1a] mb-4 px-1">
          <span>৳{priceRange[0].toLocaleString()}</span>
          <span>৳{priceRange[1].toLocaleString()}{priceRange[1] === 500000 ? '+' : ''}</span>
        </div>
        
        {/* Quick price range pills */}
        <div className="flex flex-wrap gap-2">
          {[['0', '5000', 'Under ৳5K'], ['5000', '20000', '৳5K–৳20K'], ['20000', '50000', '৳20K–৳50K'], ['50000', '500000', '৳50K+']].map(([mn, mx, lbl]) => (
            <button
              key={lbl}
              onClick={() => setParams({ minPrice: mn, maxPrice: mx })}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${minPrice === mn && maxPrice === mx ? 'bg-[#1a8a4a] text-white border-[#1a8a4a]' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#1a8a4a] hover:text-[#1a8a4a]'}`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-3 cursor-pointer group mt-1">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setParam('inStock', e.target.checked ? 'true' : '')}
            className="accent-[#1a8a4a] h-4 w-4 rounded"
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a8a4a]">In Stock Only</span>
        </label>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2.5 mt-1">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={ratingFilter === String(r)}
                onChange={() => setParam('rating', String(r))}
                className="accent-[#1a8a4a] h-4 w-4"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= r ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`} />
                ))}
                <span className="text-sm font-medium text-gray-600 ml-1">& up</span>
              </div>
            </label>
          ))}
          {ratingFilter && (
            <button onClick={() => setParam('rating', '')} className="text-xs font-semibold text-red-500 hover:text-red-600 mt-2 inline-block">
              Clear rating filter
            </button>
          )}
        </div>
      </FilterSection>
    </aside>
  );

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16 md:pb-0">
      <section className="border-b border-gray-100 bg-white">
        <div className="bd-container grid gap-6 py-6 md:grid-cols-[1.25fr_0.75fr] md:py-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1a8a4a]/15 bg-[#e8f5ee] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#1a8a4a]">
              <ShieldCheck className="h-4 w-4" />
              Verified marketplace
            </div>
            <h1 className="max-w-[19rem] break-words text-2xl font-black leading-tight text-gray-950 sm:max-w-2xl sm:text-3xl md:text-4xl">
              {category ? `${category} collection` : 'Shop products that feel worth the scroll'}
            </h1>
            <p className="mt-2.5 max-w-[20rem] break-words text-sm leading-relaxed text-gray-500 sm:max-w-xl">
              Compare curated products, filter by price and rating, and checkout with clear delivery and stock signals.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 self-end">
            {[
              { icon: Package, label: 'Products', value: isLoading ? '...' : totalCount.toLocaleString() },
              { icon: Truck, label: 'Delivery', value: '24-72h' },
              { icon: BadgePercent, label: 'Deals', value: 'Live' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#1a8a4a]" />
                  <p className="mt-2.5 sm:mt-3 text-base sm:text-lg font-black text-gray-950">{item.value}</p>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="bd-container py-6 md:py-8">

        {/* Page title row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a]">
              {category ? `${category}` : 'All Products'}
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">{isLoading ? 'Loading...' : `${totalCount} products found`}</p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1a1a1a] shadow-sm w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-[#1a8a4a]" />}
          </button>
        </div>

        <div className="flex gap-8">
          {/* ─── Desktop Sidebar ─── */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
              <Sidebar />
            </div>
          </div>

          {/* ─── Mobile Sidebar Drawer ─── */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                  <span className="font-bold text-[#1a1a1a] text-lg">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="bg-white p-1.5 rounded-lg text-gray-500 hover:text-gray-800 shadow-sm border border-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-5 pb-8">
                  <Sidebar />
                </div>
              </div>
            </div>
          )}

          {/* ─── Main Content ─── */}
          <div className="flex-1 min-w-0">

            {/* Sort + View + Search bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] px-4 py-3 mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-0 sm:min-w-[200px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]"
                  />
                </div>
                <button type="submit" className="bg-[#1a8a4a] text-white px-4 rounded-xl hover:bg-[#157a3f] transition-colors font-semibold text-sm">
                  Search
                </button>
              </form>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="w-full text-sm font-medium border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] text-[#1a1a1a] sm:w-auto"
              >
                <option value="">Sort: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>

              {/* View mode toggle */}
              <div className="flex gap-1 ml-auto bg-gray-50 p-1 rounded-xl border border-gray-200 hidden sm:flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-[#1a8a4a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-[#1a8a4a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {search && (
                  <span className="flex items-center gap-1.5 bg-[#e8f5ee] text-[#1a8a4a] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1a8a4a]/20">
                    Search: "{search}"
                    <button onClick={() => { setSearchInput(''); setParam('search', ''); }} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
                {category && (
                  <span className="flex items-center gap-1.5 bg-[#e8f5ee] text-[#1a8a4a] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1a8a4a]/20">
                    {category}
                    <button onClick={() => setParam('category', '')} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
                {inStock && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                    In Stock Only
                    <button onClick={() => setParam('inStock', '')} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
                {sort && (
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                    Sort: {sort.replace('_', ' ')}
                    <button onClick={() => setParam('sort', '')} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200">
                    ৳{(minPrice || '0')} - ৳{(maxPrice || '500000')}
                    <button onClick={() => setParams({ minPrice: '', maxPrice: '' })} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
                {ratingFilter && (
                  <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-200">
                    {ratingFilter}+ stars
                    <button onClick={() => setParam('rating', '')} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid / List */}
            {isLoading ? (
              <div className={`grid gap-4 md:gap-5 ${viewMode === 'grid' ? 'grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 min-[1500px]:grid-cols-4' : 'grid-cols-1'}`}>
                {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <>
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    {products.map((p: any) => (
                      <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-5 hover:shadow-md transition-shadow group">
                        <div className="relative w-28 h-28 sm:w-40 sm:h-40 shrink-0 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                          <img
                            src={p.img || p.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop'}
                            alt={p.model}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(event) => {
                              event.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
                            }}
                          />
                          {p.isNewArrival && (
                            <span className="absolute top-2 left-2 bg-[#1a8a4a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col py-1">
                          {p.category && <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{p.category}</span>}
                          <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] line-clamp-2 leading-snug">{p.model}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-2 hidden sm:block">{p.description}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                            <span className="text-xs font-medium text-gray-700">{p.averageRating || 0}</span>
                            <span className="text-xs text-gray-400 ml-1">({p.reviewCount || 0} reviews)</span>
                          </div>
                          <div className="flex items-end justify-between mt-auto pt-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl sm:text-2xl font-black text-[#1a8a4a]">৳{p.price?.toLocaleString()}</span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">৳{p.originalPrice?.toLocaleString()}</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleListAddToCart(p, e)}
                              className="bg-[#1a8a4a] text-white text-sm font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-[#157a3f] transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span className="hidden sm:block">Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 min-[1500px]:grid-cols-4 gap-4 md:gap-5">
                    {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="h-20 w-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mb-5 text-[#1a8a4a]">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">No products found</h3>
                <p className="text-gray-500 mt-2 max-w-sm">We couldn't find anything matching your current filters. Try adjusting them or clear all filters.</p>
                <button
                  onClick={clearAll}
                  className="mt-6 bg-[#1a8a4a] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#157a3f] transition-all shadow-md shadow-green-900/10 active:scale-95"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 mb-8">
                <button
                  disabled={page <= 1}
                  onClick={() => setParam('page', String(page - 1))}
                  className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1a8a4a] hover:text-[#1a8a4a] hover:shadow-sm transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                    return (
                      <button
                        key={p}
                        onClick={() => setParam('page', String(p))}
                        className={`h-10 min-w-[40px] px-2 rounded-xl text-sm font-bold transition-all ${
                          page === p
                            ? 'bg-[#1a8a4a] text-white shadow-md shadow-green-900/20 border-transparent'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-[#1a8a4a] hover:text-[#1a8a4a]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (Math.abs(p - page) === 2) return <span key={p} className="text-gray-400 font-bold px-1">...</span>;
                  return null;
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setParam('page', String(page + 1))}
                  className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1a8a4a] hover:text-[#1a8a4a] hover:shadow-sm transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={closeCompareModal} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-950">Product Comparison</h2>
                  <p className="text-xs font-semibold text-gray-500">Comparing up to 3 selected products</p>
                </div>
              </div>
              <button
                onClick={closeCompareModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {compareItems.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-base font-bold text-gray-500">No products in compare list.</p>
                <button
                  onClick={closeCompareModal}
                  className="mt-4 rounded-xl bg-[#1a8a4a] px-5 py-2.5 text-xs font-black text-white hover:bg-[#157a3f]"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {compareItems.map((item) => (
                  <div key={item._id} className="relative rounded-2xl border border-gray-100 bg-[#f8fbf9] p-5">
                    <button
                      onClick={() => removeCompareItem(item._id)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-white p-4">
                      <img src={item.img} alt={item.model} className="h-full w-full object-contain" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <span className="rounded-md bg-white px-2 py-1 text-[10px] font-black uppercase text-[#1a8a4a]">
                        {item.category}
                      </span>
                      <h4 className="text-base font-black text-gray-950">{item.model}</h4>
                      <p className="text-lg font-black text-[#1a8a4a]">৳{item.price.toLocaleString()}</p>
                      {item.specifications && Object.keys(item.specifications).length > 0 && (
                        <div className="mt-3 space-y-1 border-t border-gray-200/60 pt-3 text-xs">
                          {Object.entries(item.specifications).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-gray-600">
                              <span className="font-medium capitalize">{k}:</span>
                              <span className="font-bold text-gray-900">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={(e) => handleListAddToCart(item, e)}
                        className="mt-3 w-full rounded-xl bg-[#1a8a4a] py-2.5 text-center text-xs font-black text-white hover:bg-[#157a3f]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
