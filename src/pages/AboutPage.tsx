import { Link } from 'react-router-dom';
import { Target, Heart, Zap, ShieldCheck } from 'lucide-react';

const VALUES = [
  { icon: ShieldCheck, title: 'Quality First', desc: 'We carefully curate our catalog to ensure every product meets our strict quality standards.' },
  { icon: Heart, title: 'Customer Focus', desc: 'Your satisfaction is our priority. We provide 24/7 support and hassle-free returns.' },
  { icon: Zap, title: 'Fast Delivery', desc: 'With our optimized logistics network, we ensure your orders reach you as quickly as possible.' },
];

const STATS = [
  { number: '10K+', label: 'Happy Customers' },
  { number: '500+', label: 'Premium Products' },
  { number: '50+', label: 'Top Brands' },
  { number: '4.8★', label: 'Average Rating' },
];

const TEAM = [
  { name: 'Rahim Islam', role: 'Founder & CEO', img: 'https://ui-avatars.com/api/?name=Rahim+Islam&background=1a8a4a&color=fff&size=200' },
  { name: 'Sarah Rahman', role: 'Head of Operations', img: 'https://ui-avatars.com/api/?name=Sarah+Rahman&background=1a8a4a&color=fff&size=200' },
  { name: 'Tariq Ahmed', role: 'Customer Success', img: 'https://ui-avatars.com/api/?name=Tariq+Ahmed&background=1a8a4a&color=fff&size=200' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      
      {/* Hero */}
      <div className="bg-[#1a8a4a] py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">About BD Shop</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          We are Bangladesh's fastest-growing premium e-commerce destination, dedicated to bringing you the best products with unmatched customer service.
        </p>
        <Link to="/products" className="inline-block bg-white text-[#1a8a4a] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-lg">
          Shop Now
        </Link>
      </div>

      {/* Stats Strip */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <h3 className="text-3xl md:text-4xl font-black text-[#1a8a4a] mb-2">{stat.number}</h3>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-24 space-y-32">
        
        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-[#1a8a4a] font-bold rounded-full text-sm mb-2">
              <Target className="h-4 w-4" /> Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] leading-tight">
              Changing how Bangladesh shops online.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Founded in 2024, BD Shop started with a simple mission: to provide a trustworthy, premium online shopping experience in Bangladesh. We noticed a gap in the market for high-quality electronics, vehicles, and accessories backed by reliable customer service.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed">
              Today, we serve thousands of customers nationwide, partnering with top brands to ensure every product delivered meets our strict quality standards. We don't just sell products; we deliver peace of mind.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=800&auto=format&fit=crop" alt="Our team" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-green-100 rounded-3xl -z-0"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-100 rounded-full -z-0"></div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1a1a1a]">Our Core Values</h2>
            <p className="text-gray-500 mt-4 text-lg">The principles that guide everything we do.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 group">
                <div className="h-16 w-16 bg-[#e8f5ee] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <val.icon className="h-8 w-8 text-[#1a8a4a]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1a1a1a]">Meet the Team</h2>
            <p className="text-gray-500 mt-4 text-lg">The people behind the magic.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 shadow-lg border-4 border-white">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">{member.name}</h3>
                <p className="text-[#1a8a4a] font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gray-900 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white">Ready to start shopping?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore our curated collection of premium products.</p>
            <Link to="/products" className="inline-block bg-[#1a8a4a] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#157a3f] transition-all hover:scale-105 shadow-lg mt-4">
              Browse Products
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
