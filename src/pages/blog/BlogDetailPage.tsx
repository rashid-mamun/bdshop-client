import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, BookOpen, ChevronRight } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface Blog {
  _id: string;
  title: string;
  img: string;
  description: string;
  date: string;
  category: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await apiClient.get(`/public/blogs/${id}`);
      return res.data.data as Blog;
    },
    enabled: !!id,
  });

  // Fetch more blogs for "Related" section
  const { data: relatedData } = useQuery({
    queryKey: ['blogs-related'],
    queryFn: async () => {
      const res = await apiClient.get('/public/blogs', { params: { limit: 4 } });
      return (res.data.data?.blogs || []) as Blog[];
    },
  });

  const related = (relatedData || []).filter((b) => b._id !== id).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <div className="bd-container py-10">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200 mb-8" />
          <div className="h-96 animate-pulse rounded-3xl bg-white border border-gray-100 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded-lg bg-gray-200" style={{ width: `${80 - i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center py-24">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">😕</div>
          <h2 className="text-2xl font-black text-gray-900">Blog not found</h2>
          <p className="mt-2 text-gray-500 font-medium">This article may have been removed.</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1a8a4a] px-6 py-3 text-sm font-bold text-white hover:bg-[#157a3f] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="bd-container flex items-center gap-2 py-3 text-sm text-gray-500 font-medium">
          <Link to="/" className="hover:text-[#1a8a4a] transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/blog" className="hover:text-[#1a8a4a] transition-colors">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-bold truncate max-w-xs">{blog.title}</span>
        </div>
      </div>

      <div className="bd-container py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0"
          >
            {/* Back Button */}
            <Link
              to="/blog"
              className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" /> All Articles
            </Link>

            {/* Card */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              {/* Hero Image */}
              <div className="relative h-72 md:h-96 overflow-hidden">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/1200x600/e8f5ee/1a8a4a?text=BDShop+Blog';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {blog.category && (
                  <div className="absolute left-6 bottom-6 inline-flex items-center gap-1.5 rounded-full bg-[#1a8a4a] px-4 py-1.5 text-sm font-black text-white shadow-lg">
                    <Tag className="h-3.5 w-3.5" />
                    {blog.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400 font-semibold">
                  <Calendar className="h-4 w-4" />
                  {blog.date ? new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Recently'}
                  <span className="mx-1">·</span>
                  <BookOpen className="h-4 w-4" />
                  {Math.ceil((blog.description?.split(' ').length || 100) / 200)} min read
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                  {blog.title}
                </h1>

                {blog.description && (
                  <div className="mt-6 prose prose-sm max-w-none">
                    <p className="text-gray-700 font-medium leading-relaxed text-base whitespace-pre-line">
                      {blog.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                  {['BDShop', blog.category, 'Bangladesh'].filter(Boolean).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-bold text-[#1a8a4a]">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Back to Blog */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black text-[#1a8a4a]">
                <BookOpen className="h-3.5 w-3.5" />
                More Articles
              </div>
              <h3 className="font-black text-gray-900 mb-4">Related Posts</h3>
              {related.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium">No related posts found.</p>
              ) : (
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r._id}
                      to={`/blog/${r._id}`}
                      className="group flex gap-3 items-start hover:bg-gray-50 rounded-2xl p-2 -mx-2 transition-colors"
                    >
                      <img
                        src={r.img}
                        alt={r.title}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/e8f5ee/1a8a4a?text=B';
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 line-clamp-2 group-hover:text-[#1a8a4a] transition-colors leading-snug">
                          {r.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 font-semibold">
                          {r.date ? new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/blog"
                className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-[#f8f9fa] py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                View all articles <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-3xl bg-[linear-gradient(135deg,_#0d5c30,_#1a8a4a)] p-5 text-white shadow-xl shadow-green-900/20">
              <div className="text-2xl mb-2">📬</div>
              <h3 className="font-black text-lg">Get deals in your inbox</h3>
              <p className="mt-1 text-sm text-green-100 font-medium">Subscribe for exclusive offers and blog updates.</p>
              <Link
                to="/#newsletter"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-black text-[#1a8a4a] hover:bg-green-50 transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
