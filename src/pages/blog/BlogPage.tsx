import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronRight, Search, Tag } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface Blog {
  _id: string;
  title: string;
  img: string;
  description: string;
  date: string;
  category: string;
}

const CATEGORIES = ['All', 'Technology', 'Shopping', 'Deals', 'Lifestyle', 'News'];

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: async () => {
      const res = await apiClient.get('/public/blogs', { params: { page, limit: 9 } });
      return res.data.data;
    },
  });

  const blogs: Blog[] = data?.blogs || [];
  const pagination = data?.pagination;

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#0d5c30_0%,_#1a8a4a_50%,_#2ab567_100%)] py-10 md:py-14 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.07),transparent_60%)]" />
        <div className="bd-container relative text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs sm:text-sm font-bold text-white backdrop-blur-sm">
            <BookOpen className="h-3.5 w-3.5" />
            BDShop Blog
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Tips, Deals & Insights
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-green-100 font-medium leading-relaxed">
            Stay updated with the latest shopping tips, product guides, and exclusive deals from BDShop.
          </p>

          {/* Search */}
          <div className="mx-auto mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-white py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="bd-container flex gap-2 overflow-x-auto py-3 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a8a4a] text-white shadow-md shadow-green-100'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat !== 'All' && <Tag className="h-3.5 w-3.5" />}
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="bd-container py-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-white border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">📄</div>
            <h3 className="text-xl font-black text-gray-900">No articles found</h3>
            <p className="mt-2 text-gray-500 font-medium">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog, i) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-green-100/40 transition-all duration-300"
              >
                <Link to={`/blog/${blog._id}`} className="block">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={blog.img}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e8f5ee/1a8a4a?text=BDShop+Blog';
                      }}
                    />
                    {blog.category && (
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#1a8a4a] px-3 py-1 text-xs font-black text-white shadow-md">
                        <Tag className="h-3 w-3" />
                        {blog.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      {blog.date ? new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'}
                    </div>
                    <h2 className="font-black text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-[#1a8a4a] transition-colors">
                      {blog.title}
                    </h2>
                    {blog.description && (
                      <p className="mt-2 text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {blog.description}
                      </p>
                    )}
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#1a8a4a] group-hover:gap-2.5 transition-all">
                      Read more <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
