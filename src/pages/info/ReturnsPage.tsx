import { useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Loader2,
  PackageX,
  ShieldCheck,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../hooks/useToast';

const FAQS = [
  { q: 'What is the return window?', a: 'You have 30 days from the date of delivery to initiate a return for most items.' },
  { q: 'Which items are eligible for return?', a: 'Items must be unused, in their original packaging, and with all tags attached. Electronics must be unopened unless defective.' },
  { q: 'How long does a refund take?', a: 'Once we receive and inspect your item, refunds are processed within 5-7 business days to your original payment method.' },
  { q: 'What if my item arrived damaged?', a: "Please initiate a return immediately and select 'Damaged Item' as the reason. We will arrange a free pickup." },
  { q: 'How do I initiate a return?', a: "Fill out the form on this page or go to your account's order history and choose Return Item." },
];

const STEPS = [
  { icon: PackageX, title: 'Request Return', desc: 'Submit your order details and reason for return.' },
  { icon: Truck, title: 'Pickup Review', desc: 'We verify eligibility and arrange pickup if needed.' },
  { icon: CreditCard, title: 'Refund Processed', desc: 'Refund is issued after item inspection is complete.' },
];

const InputClass = 'h-12 w-full rounded-xl border border-gray-200 bg-[#fbfcfd] px-4 text-sm font-semibold text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:-translate-y-0.5 hover:border-[#1a8a4a]/25 hover:bg-white hover:shadow-sm focus:-translate-y-0.5 focus:border-[#1a8a4a]/60 focus:bg-white focus:shadow-[0_12px_28px_rgba(26,138,74,0.12)] focus:ring-4 focus:ring-[#1a8a4a]/10';

export default function ReturnsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    orderId: '',
    email: '',
    itemScope: '',
    reason: '',
    details: '',
    imageUrl: '',
  });
  const { success, error: toastError } = useToast();

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toastError('Image must be under 5MB');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    setUploadingPhoto(true);
    try {
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data?.url || res.data.data?.secure_url;
      if (url) {
        setForm((prev) => ({ ...prev, imageUrl: url }));
        success('Photo attached to return request');
      }
    } catch (err: any) {
      toastError(err.response?.data?.message || err.response?.data?.error || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleReturnSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/public/returns', form);
      setSubmitted(true);
      success('Return request submitted.');
      setForm({ orderId: '', email: '', itemScope: '', reason: '', details: '', imageUrl: '' });
    } catch (err: any) {
      toastError(err.response?.data?.error || 'Return request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <main className="bd-container py-8 lg:py-10">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm lg:p-6">
          <section className="rounded-[1.75rem] bg-white p-4 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <ShieldCheck className="h-4 w-4" />
                Easy returns
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                Returns & Refunds
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-gray-500">
                Start a return, understand eligibility, and follow the refund timeline from one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#return-form" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1a8a4a] px-6 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#157a3f] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1a8a4a]/15">
                  Start Return
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#return-policy" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#1a8a4a]/25 bg-transparent px-6 text-base font-black text-[#1a8a4a] transition hover:-translate-y-0.5 hover:bg-[#e8f5ee] focus:outline-none focus:ring-4 focus:ring-[#1a8a4a]/10">
                  View Policy
                  <ChevronDown className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-5 lg:w-[360px]">
              <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">Return promise</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">30-day support</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                Pickup, inspection updates and secure refund processing for eligible products.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1a8a4a] shadow-sm">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-black leading-none text-gray-950">Pickup</p>
                <p className="mt-2 text-sm font-bold text-gray-600">support available</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-2xl font-black leading-none text-gray-950">5-7 days</p>
              <p className="mt-2 text-sm font-bold text-gray-600">refund processing</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-2xl font-black leading-none text-gray-950">Free</p>
              <p className="mt-2 text-sm font-bold text-gray-600">damaged item pickup</p>
            </div>
          </div>
          </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <article key={step.title} className="relative overflow-hidden rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
              <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5ee] text-2xl font-black text-[#1a8a4a] ring-1 ring-[#1a8a4a]/10">{i + 1}</div>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-gray-950">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-500">{step.desc}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div id="return-policy" className="overflow-hidden rounded-3xl border border-gray-100 bg-[#fbfcfd]">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-2xl font-black text-gray-950">Return policy FAQ</h2>
              <p className="mt-2 text-base font-semibold text-gray-600">Common return and refund questions.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {FAQS.map((faq, i) => (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50/70 lg:p-6"
                  >
                    <span className={`text-base font-black ${openFaq === i ? 'text-[#1a8a4a]' : 'text-gray-950'}`}>
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-[#1a8a4a]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm font-medium leading-7 text-gray-600 lg:px-6 lg:pb-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div id="return-form" className="mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm xl:mx-0 xl:max-w-none">
            <div className="border-b border-gray-100 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] p-6">
              <div className="mx-auto flex max-w-3xl items-start justify-between gap-4">
                <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                  <PackageX className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-gray-950">Initiate a return</h2>
                  <p className="mt-1 text-sm font-medium text-gray-500">Provide order details to start the process.</p>
                </div>
                </div>
                <span className="hidden h-fit rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a] sm:inline-flex">
                  Secure
                </span>
              </div>
            </div>

            <form className="mx-auto max-w-3xl space-y-6 p-6 lg:p-8" onSubmit={handleReturnSubmit}>
              {submitted && (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700">
                  Return request received. Check your email for confirmation.
                </div>
              )}
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[15px] font-black text-gray-950">Order ID</span>
                  <input type="text" required value={form.orderId} onChange={(event) => updateForm('orderId', event.target.value)} className={InputClass} placeholder="BDS order number or order ID" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[15px] font-black text-gray-950">Email Address</span>
                  <input type="email" required value={form.email} onChange={(event) => updateForm('email', event.target.value)} className={InputClass} placeholder="your@email.com" />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[15px] font-black text-gray-950">Select Item(s)</span>
                  <span className="relative block">
                    <select required value={form.itemScope} onChange={(event) => updateForm('itemScope', event.target.value)} className={`${InputClass} appearance-none pr-10`}>
                      <option value="">Select an item from order...</option>
                      <option value="entire_order">Entire Order</option>
                      <option value="specific_items">Specific Items</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] font-black text-gray-950">Reason for Return</span>
                  <span className="relative block">
                    <select required value={form.reason} onChange={(event) => updateForm('reason', event.target.value)} className={`${InputClass} appearance-none pr-10`}>
                      <option value="">Select a reason...</option>
                      <option value="damaged">Damaged Item</option>
                      <option value="wrong">Wrong Item Received</option>
                      <option value="not_described">Not as Described</option>
                      <option value="changed_mind">Changed My Mind</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </span>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[15px] font-black text-gray-950">Additional Details</span>
                <textarea rows={4} value={form.details} onChange={(event) => updateForm('details', event.target.value)} className={`${InputClass} h-36 resize-y py-4`} placeholder="Please provide any additional information..." />
              </label>

              <div>
                <span className="mb-2 block text-[15px] font-black text-gray-950">
                  Upload Photo <span className="font-semibold text-gray-500">(Optional)</span>
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                {form.imageUrl ? (
                  <div className="relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#f8fbf9] p-4">
                    <img
                      src={form.imageUrl}
                      alt="Return photo"
                      className="h-20 w-20 rounded-xl object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-800">Photo Attached</p>
                      <p className="text-[11px] text-gray-400">Ready to submit with return</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-[136px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#1a8a4a]/30 bg-[#f8fbf9] px-4 text-center transition hover:border-[#1a8a4a]/50 hover:bg-[#eef8f3]"
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-8 w-8 animate-spin text-[#1a8a4a]" />
                    ) : (
                      <>
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1a8a4a] shadow-sm ring-1 ring-[#1a8a4a]/10">
                          <Upload className="h-6 w-6" />
                        </span>
                        <p className="mt-2 text-sm font-bold text-gray-600">Click to upload photo</p>
                        <p className="mt-1 text-xs font-semibold text-gray-400">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" disabled={submitting} className="group mx-auto flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-[#1a8a4a] px-7 text-base font-black text-white shadow-[0_14px_30px_rgba(26,138,74,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#157a3f] hover:shadow-[0_18px_36px_rgba(26,138,74,0.28)] active:translate-y-0 active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:min-w-[340px]">
                <span>{submitting ? 'Submitting...' : 'Submit Return Request'}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 transition group-hover:bg-white/20 group-hover:translate-x-0.5">
                  <CheckCircle className="h-4 w-4" />
                </span>
              </button>
            </form>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
