import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../hooks/useToast';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Edit3, Loader2 } from 'lucide-react';

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              s <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, onEdit }: { review: any; onEdit: () => void }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`h-4 w-4 ${s <= review.star ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
          ))}
        </div>
        <button onClick={onEdit} className="flex items-center gap-1 text-xs text-[#1a8a4a] hover:underline font-semibold">
          <Edit3 className="h-3 w-3" /> Edit
        </button>
      </div>
      {review.title && <p className="text-sm font-semibold text-gray-900 mb-1">{review.title}</p>}
      {review.description && <p className="text-sm text-gray-600">{review.description}</p>}
      <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default function ReviewsTab() {
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ star: 5, title: '', description: '' });
  const [openWriteFor, setOpenWriteFor] = useState<string | null>(null);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['my-reviews', user?.email],
    queryFn: async () => {
      const res = await apiClient.get('/reviews/my-reviews');
      return res.data.data.reviews || [];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post('/reviews', payload);
      return res.data;
    },
    onSuccess: () => {
      success('Review submitted!');
      setOpenWriteFor(null);
      setForm({ star: 5, title: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
    onError: (err: any) => toastError(err.response?.data?.message || 'Failed to submit review'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: any) => {
      const res = await apiClient.put(`/reviews/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      success('Review updated!');
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
    onError: (err: any) => toastError(err.response?.data?.message || 'Failed to update review'),
  });

  const reviews = reviewsData || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="h-16 w-16 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="font-bold text-gray-800 mb-2">No reviews yet</h3>
        <p className="text-gray-500 text-sm mb-6">Purchase products and share your experience</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-[#1a8a4a] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#157a3f] transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => {
        const isEditing = editingId === review._id;
        const isSubmitting = updateMutation.isPending;

        return (
          <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{review.title || 'Review'}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>

                {!isEditing ? (
                  <ReviewCard review={review} onEdit={() => {
                    setEditingId(review._id);
                    setForm({ star: review.star, title: review.title || '', description: review.description || '' });
                  }} />
                ) : (
                  <div className="mt-3 space-y-3">
                    <StarSelector value={form.star} onChange={(v) => setForm(f => ({ ...f, star: v }))} />
                    <input
                      value={form.title}
                      onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Review title"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Share your experience (min 20 characters)..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateMutation.mutate({ id: review._id, payload: form })}
                        disabled={isSubmitting || form.description.length < 20}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a8a4a] text-white text-sm font-semibold rounded-lg hover:bg-[#157a3f] disabled:opacity-60 transition-colors"
                      >
                        {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Update Review
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
