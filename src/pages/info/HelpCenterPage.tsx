import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  HeadphonesIcon,
  Mail,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';

const CATEGORIES = [
  { icon: Package, title: 'Orders & Shipping', desc: 'Track, modify, or cancel orders' },
  { icon: RefreshCw, title: 'Returns & Refunds', desc: 'Return policy and process' },
  { icon: CreditCard, title: 'Payment & Billing', desc: 'Payment methods and invoices' },
  { icon: ShieldCheck, title: 'Account & Security', desc: 'Password and profile settings' },
  { icon: Tag, title: 'Product Information', desc: 'Specs, warranty, and stock' },
  { icon: HeadphonesIcon, title: 'Contact Support', desc: 'Get in touch with our team' },
];

const FAQS = [
  { q: 'How do I cancel my order?', a: 'You can cancel your order within 1 hour of placing it from My Account > Order History. Once processing begins, please contact support.' },
  { q: 'When will I receive my order?', a: 'Delivery usually takes 24-72 hours inside major cities and 3-5 business days outside city areas. You can track every order with your Order ID.' },
  { q: 'How do I apply a coupon code?', a: 'Enter your coupon code in the checkout summary before payment. The order total updates instantly if the code is valid.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, bKash, Nagad, DBBL, and Cash on Delivery for eligible orders.' },
  { q: 'How do I change my delivery address?', a: 'You can update saved addresses from My Account. For an active order, contact support before the package is dispatched.' },
  { q: 'Is Cash on Delivery available?', a: 'Yes, Cash on Delivery is available across Bangladesh. High-value orders above Tk 50,000 may require advance confirmation.' },
  { q: 'How do I contact customer support?', a: 'Use live chat, email support@bdshop.com, or call +880 1700-000000 between 9 AM and 10 PM.' },
  { q: 'What is your return policy?', a: 'Most items are eligible for return within 30 days if they are unused, complete, and in original packaging.' },
];

const SUPPORT_OPTIONS = [
  { icon: MessageCircle, title: 'Live Chat', desc: 'Available 9 AM - 10 PM', primary: true },
  { icon: Mail, title: 'Email Us', desc: 'support@bdshop.com' },
  { icon: Phone, title: 'Call Us', desc: '+880 1700-000000' },
];

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQS;
    return FAQS.filter((faq) => (
      faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query)
    ));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <section className="bd-container py-8 lg:py-10">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <HeadphonesIcon className="h-4 w-4" />
                Help Center
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                How can we help you today?
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-gray-500">
                Find answers about orders, delivery, returns, payments and account settings without waiting for support.
              </p>

              <div className="group relative mt-6 max-w-3xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#1a8a4a] transition group-focus-within:bg-[#1a8a4a] group-focus-within:text-white">
                    <Search className="h-5 w-5" />
                  </span>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search refunds, shipping, payment, warranty..."
                  className="min-h-[64px] w-full rounded-2xl border border-gray-200 bg-white py-3 pl-[68px] pr-32 text-base font-bold text-gray-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-gray-400 focus:border-[#1a8a4a]/50 focus:ring-4 focus:ring-[#1a8a4a]/10"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-400 sm:inline-flex">
                  Help search
                </span>
              </div>
            </div>

            <button className="inline-flex min-h-[48px] w-fit shrink-0 items-center gap-2 rounded-xl bg-[#1a8a4a] px-5 text-sm font-black text-white transition hover:bg-[#157a3f]">
                Contact support <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1a8a4a] shadow-sm">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-gray-950">Fast answers</p>
                <p className="mt-0.5 text-xs font-bold text-gray-500">Most issues solved quickly</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-2xl font-black text-gray-950">24-72h</p>
              <p className="mt-1 text-xs font-bold text-gray-500">delivery window</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-2xl font-black text-gray-950">30 days</p>
              <p className="mt-1 text-xs font-bold text-gray-500">return support</p>
            </div>
          </div>
        </div>
      </section>

      <main className="bd-container space-y-10">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              className="group flex min-h-[132px] items-start gap-4 rounded-3xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#1a8a4a]/20 hover:shadow-md"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a] transition group-hover:bg-[#1a8a4a] group-hover:text-white">
                <cat.icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-black text-gray-950">{cat.title}</span>
                <span className="mt-1 block text-sm font-medium leading-6 text-gray-500">{cat.desc}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#1a8a4a]">
                  Browse help <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </button>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
              <div>
                <h2 className="text-2xl font-black text-gray-950">Popular articles</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {filteredFaqs.length} result{filteredFaqs.length === 1 ? '' : 's'} available
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                Knowledge base
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredFaqs.map((faq, i) => (
                <div key={faq.q} className="bg-white">
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

              {filteredFaqs.length === 0 && (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-gray-950">No articles found</h3>
                  <p className="mt-1 text-sm font-medium text-gray-500">Try searching for order, delivery, payment, or return.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm lg:p-6">
              <h2 className="text-xl font-black text-gray-950">Still need help?</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                Choose the fastest support channel for your issue.
              </p>
              <div className="mt-5 grid gap-3">
                {SUPPORT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.title}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                        option.primary
                          ? 'border-[#1a8a4a] bg-[#1a8a4a] text-white'
                          : 'border-gray-100 bg-gray-50 text-gray-950 hover:border-[#1a8a4a]/25'
                      }`}
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${option.primary ? 'bg-white/15' : 'bg-white text-[#1a8a4a]'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-black">{option.title}</span>
                        <span className={`mt-0.5 block truncate text-xs font-bold ${option.primary ? 'text-white/75' : 'text-gray-500'}`}>
                          {option.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-5 lg:p-6">
              <ShieldCheck className="h-7 w-7 text-[#1a8a4a]" />
              <h3 className="mt-4 font-black text-gray-950">Buyer protection</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                Every BDShop order includes secure payment handling, delivery tracking, and return support.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
