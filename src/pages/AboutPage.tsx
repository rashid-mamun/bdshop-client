import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  Heart,
  Package,
  ShieldCheck,
  Star,
  Target,
  Truck,
  Users,
  Zap,
} from 'lucide-react';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Quality First',
    desc: 'Curated products, verified brands, and clear quality checks before items reach customers.',
  },
  {
    icon: Headphones,
    title: 'Human Support',
    desc: 'Real help for orders, delivery, returns, and product questions whenever shoppers need it.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'A delivery network built for quick dispatch, tracking clarity, and dependable handoff.',
  },
];

const STATS = [
  { number: '10K+', label: 'Happy customers', icon: Users },
  { number: '500+', label: 'Premium products', icon: Package },
  { number: '50+', label: 'Trusted brands', icon: BadgeCheck },
  { number: '4.8', label: 'Average rating', icon: Star },
];

const TEAM = [
  { name: 'Rahim Islam', role: 'Founder & CEO', initials: 'RI' },
  { name: 'Sarah Rahman', role: 'Head of Operations', initials: 'SR' },
  { name: 'Tariq Ahmed', role: 'Customer Success', initials: 'TA' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <section className="border-b border-gray-100 bg-white">
        <div className="bd-container py-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)] lg:items-start">
            <div className="rounded-[2rem] bg-[#0f3d26] p-6 text-white shadow-sm sm:p-8 lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-green-100">
                  <Target className="h-4 w-4" />
                  About BDShop
                </span>
                <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl xl:text-[4.75rem]">
                  Building a more trusted way to shop online in Bangladesh.
                </h1>
                <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-green-50/85 sm:text-lg">
                  BDShop brings electronics, vehicles, and accessories together with verified quality, reliable delivery, and real customer support.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {['Verified catalog', '24-72h delivery', 'Buyer protection'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-sm font-black text-white">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-[#0f3d26] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Browse Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/help"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-950 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=1200&auto=format&fit=crop"
                  alt="BDShop team planning customer experience"
                  className="h-full min-h-[300px] w-full object-cover opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6">
                  <p className="text-xs font-black uppercase tracking-wider text-green-200">Our mission</p>
                  <p className="mt-2 max-w-md text-2xl font-black leading-tight text-white">
                    Premium products with dependable service from cart to doorstep.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-5 flex items-end gap-1">
                      <p className="text-3xl font-black text-gray-950">{stat.number}</p>
                      {stat.label === 'Average rating' && <Star className="mb-1 h-5 w-5 fill-amber-400 text-amber-400" />}
                    </div>
                    <p className="mt-1 text-sm font-bold text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="bd-container space-y-8 py-8 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
              <Target className="h-4 w-4" />
              Our Story
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Changing how Bangladesh shops online.
            </h2>
            <div className="mt-5 space-y-4 text-base font-medium leading-8 text-gray-600">
              <p>
                Founded in 2024, BDShop started with a simple mission: create a trustworthy, premium shopping experience for customers who want quality products without guesswork.
              </p>
              <p>
                Today, we serve shoppers nationwide by combining verified catalog curation, clear delivery expectations, responsive support, and practical return handling.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-black text-gray-950">{value.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400&auto=format&fit=crop"
              alt="Online shopping and ecommerce operation"
              className="h-full min-h-[360px] w-full object-cover"
            />
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
              <Zap className="h-4 w-4" />
              How We Work
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-gray-950">
              A shopping flow built around confidence.
            </h2>
            <div className="mt-6 space-y-4">
              {[
                'Source and verify products before they enter the catalog.',
                'Show clear pricing, offers, delivery details, and support paths.',
                'Keep customers informed from order confirmation to delivery.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-sm font-black text-[#1a8a4a]">
                    {index + 1}
                  </div>
                  <p className="text-sm font-bold leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <Heart className="h-4 w-4" />
                Team
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950">Meet the people behind BDShop.</h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-gray-500">
              A focused team handling sourcing, operations, and customer success so shoppers get a reliable experience.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-3xl border border-gray-100 bg-[#fbfcfd] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a8a4a] text-xl font-black text-white shadow-sm">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-950">{member.name}</h3>
                    <p className="text-sm font-bold text-[#1a8a4a]">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-gray-100 bg-[#0f3d26] p-6 text-white shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-green-200">Ready to shop smarter?</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Explore verified products with BDShop.</h2>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-green-50/80">
              Browse electronics, vehicles, accessories, deals, and new arrivals with checkout and support built for confidence.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-[#0f3d26] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Browse Products
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </main>
    </div>
  );
}
