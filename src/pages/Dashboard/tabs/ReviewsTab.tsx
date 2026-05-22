import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Edit3, Loader2, MessageSquareText, ShoppingBag, Star } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../hooks/useToast';

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30"
        >
          <Star className={`h-6 w-6 transition-colors ${star <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
        </button>
      ))}
    </div>
  );
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ star: 5, title: '', description: '' });

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['my-reviews', user?.email],
    queryFn: async () => {
      const res = await apiClient.get('/reviews/my-reviews');
      return res.data.data.reviews || [];
    },
    enabled: !!user,
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

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-700">
              <Star className="h-4 w-4 fill-current" />
              Product feedback
            </div>
            <h2 className="text-2xl font-black tracking-tight text-gray-950">My reviews</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">Edit product reviews and help other shoppers decide.</p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-right">
            <p className="text-2xl font-black text-gray-950">{reviews.length}</p>
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">Reviews</p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-black text-gray-900">No reviews yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500">Purchase a product and share your experience after delivery.</p>
          <Link to="/products" className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-[#1a8a4a] px-5 text-sm font-black text-white hover:bg-[#157a3f]">
            Shop products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {reviews.map((review: any) => {
            const isEditing = editingId === review._id;
            const isSubmitting = updateMutation.isPending;

            return (
              <article key={review._id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                    <MessageSquareText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <RatingStars value={review.star} />
                        <h3 className="mt-2 font-black text-gray-950">{review.title || 'Product review'}</h3>
                        <p className="mt-1 text-xs font-semibold text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingId(review._id);
                            setForm({ star: review.star, title: review.title || '', description: review.description || '' });
                          }}
                          className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-black text-gray-700 hover:border-[#1a8a4a]/30 hover:text-[#1a8a4a]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      )}
                    </div>

                    {!isEditing ? (
                      <p className="mt-4 text-sm font-medium leading-6 text-gray-600">{review.description || 'No review details provided.'}</p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <StarSelector value={form.star} onChange={(value) => setForm((current) => ({ ...current, star: value }))} />
                        <input
                          value={form.title}
                          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                          placeholder="Review title"
                          className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15"
                        />
                        <textarea
                          value={form.description}
                          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                          placeholder="Share your experience"
                          rows={4}
                          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none focus:border-[#1a8a4a] focus:ring-2 focus:ring-[#1a8a4a]/15"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateMutation.mutate({ id: review._id, payload: form })}
                            disabled={isSubmitting || form.description.length < 20}
                            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#1a8a4a] px-4 text-sm font-black text-white hover:bg-[#157a3f] disabled:opacity-60"
                          >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Update review
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="min-h-[42px] rounded-xl border border-gray-200 px-4 text-sm font-black text-gray-600 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
