import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
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
  ExternalLink,
} from 'lucide-react';

// Social icons not available in this lucide version
const LinkedinIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

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

const STATIC_TEAM = [
  { name: 'Rahim Islam', role: 'Founder & CEO', initials: 'RI' },
  { name: 'Sarah Rahman', role: 'Head of Operations', initials: 'SR' },
  { name: 'Tariq Ahmed', role: 'Customer Success', initials: 'TA' },
];

export default function AboutPage() {
  const { data: teamData } = useQuery({
    queryKey: ['about-team'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/public/team');
        return res.data?.data;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });

  const teamList = teamData && Array.isArray(teamData) && teamData.length > 0 ? teamData : STATIC_TEAM;
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <section className="border-b border-gray-100 bg-white">
        <div className="bd-container py-6 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1.1fr_400px] lg:items-start">
            <div className="rounded-[1.75rem] bg-[#0f3d26] p-6 text-white shadow-sm sm:p-7 lg:p-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-100">
                  <Target className="h-3.5 w-3.5" />
                  About BDShop
                </span>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-4xl xl:text-5xl">
                  Building a more trusted way to shop online in Bangladesh.
                </h1>
                <p className="mt-4 max-w-xl text-sm sm:text-base font-semibold leading-relaxed text-green-50/85">
                  BDShop brings electronics, vehicles, and accessories together with verified quality, reliable delivery, and real customer support.
                </p>
              </div>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                {['Verified catalog', '24-72h delivery', 'Buyer protection'].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs sm:text-sm font-black text-white">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-[#0f3d26] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/help"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative min-h-[220px] lg:min-h-[240px] overflow-hidden rounded-[1.75rem] border border-gray-100 bg-gray-950 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=1200&auto=format&fit=crop"
                  alt="BDShop team planning customer experience"
                  className="h-full min-h-[220px] lg:min-h-[240px] w-full object-cover opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-green-200">Our mission</p>
                  <p className="mt-1 max-w-md text-lg font-black leading-snug text-white">
                    Premium products with dependable service from cart to doorstep.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#1a8a4a]">
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 flex items-end gap-1">
                      <p className="text-2xl font-black text-gray-950">{stat.number}</p>
                      {stat.label === 'Average rating' && <Star className="mb-0.5 h-4 w-4 fill-amber-400 text-amber-400" />}
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="bd-container space-y-6 py-6 lg:py-8">
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

        <section className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <Heart className="h-3.5 w-3.5" />
                Team
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-gray-950">Meet the people behind BDShop.</h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-semibold leading-relaxed text-gray-500">
              A focused team handling sourcing, operations, and customer success so shoppers get a reliable experience.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamList.map((member: any) => (
              <div key={member.name || member._id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:shadow-green-100/40 transition-all duration-300">
                {/* Photo / Avatar */}
                <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,#e8f5ee,#f0faf4)]">
                  {member.img ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        (target.parentElement?.querySelector('.avatar-fallback') as HTMLElement | null)?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`avatar-fallback ${member.img ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
                    <div className="h-20 w-20 rounded-2xl bg-[#1a8a4a] flex items-center justify-center text-3xl font-black text-white shadow-lg">
                      {member.initials || member.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'BD'}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <div>
                    <h3 className="text-base font-black text-gray-900">{member.name}</h3>
                    <p className="text-xs font-bold text-[#1a8a4a] mt-0.5">{member.role || member.position}</p>
                  </div>

                  {member.bio && (
                    <p className="mt-2 text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{member.bio}</p>
                  )}

                  {/* Social Links */}
                  {member.socialLinks && (
                    <div className="mt-auto pt-3 flex items-center gap-2">
                      {member.socialLinks.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                           className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                          <LinkedinIcon />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                           className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                          <TwitterIcon />
                        </a>
                      )}
                      {member.socialLinks.github && (
                        <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer"
                           className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                          <GithubIcon />
                        </a>
                      )}
                      {member.url && (
                        <a href={member.url} target="_blank" rel="noopener noreferrer"
                           className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8f5ee] text-[#1a8a4a] hover:bg-[#d4edda] transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 overflow-hidden rounded-[1.75rem] border border-gray-100 bg-[#0f3d26] p-6 text-white shadow-sm sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-green-200">Ready to shop smarter?</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">Explore verified products with BDShop.</h2>
            <p className="mt-2.5 max-w-xl text-xs sm:text-sm font-semibold leading-relaxed text-green-50/80">
              Browse electronics, vehicles, accessories, deals, and new arrivals with checkout and support built for confidence.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-[#0f3d26] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
