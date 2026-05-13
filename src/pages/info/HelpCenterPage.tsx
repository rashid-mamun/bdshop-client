import { useState } from 'react';
import { Search, Package, RefreshCw, CreditCard, ShieldCheck, Tag, HeadphonesIcon, MessageCircle, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { icon: Package, title: 'Orders & Shipping', desc: 'Track, modify, or cancel orders' },
  { icon: RefreshCw, title: 'Returns & Refunds', desc: 'Return policy and process' },
  { icon: CreditCard, title: 'Payment & Billing', desc: 'Payment methods and invoices' },
  { icon: ShieldCheck, title: 'Account & Security', desc: 'Password and profile settings' },
  { icon: Tag, title: 'Product Information', desc: 'Specs, warranty, and stock' },
  { icon: HeadphonesIcon, title: 'Contact Support', desc: 'Get in touch with our team' },
];

const FAQS = [
  { q: "How do I cancel my order?", a: "You can cancel your order within 1 hour of placing it from your My Account > Order History section. Once processing begins, cancellation is not possible." },
  { q: "When will I receive my order?", a: "Delivery typically takes 1-3 business days within Dhaka and 3-5 business days outside Dhaka. You can track your order using your Order ID." },
  { q: "How do I apply a coupon code?", a: "During checkout, you will find a 'Coupon Code' box on the shipping step. Enter your code and click Apply to see your discount." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, bKash, Nagad, DBBL, and Cash on Delivery (COD)." },
  { q: "How do I change my delivery address?", a: "You can change your default address in your Account settings. For an active order, please contact support immediately if it hasn't shipped." },
  { q: "Is Cash on Delivery available?", a: "Yes, Cash on Delivery is available for all locations across Bangladesh. However, orders above ৳50,000 may require a partial advance payment." },
  { q: "How do I contact customer support?", a: "You can reach us via live chat on our website, email us at support@bdshop.com, or call +880 1700-000000 (9 AM - 10 PM)." },
  { q: "What is your return policy?", a: "We offer a 30-day return window for most items. Items must be in original condition. Please visit our Returns page for full details." },
];

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      
      {/* Hero Section */}
      <div className="bg-[#1a8a4a] py-20 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <h1 className="text-4xl md:text-5xl font-black text-white">How can we help you?</h1>
          <p className="text-green-100 text-lg">Search our knowledge base or browse categories below</p>
          
          <div className="relative max-w-2xl mx-auto shadow-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers (e.g., 'refunds', 'shipping')" 
              className="w-full pl-14 pr-6 py-5 rounded-2xl text-lg text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-green-400/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 space-y-16">
        
        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1a8a4a] group-hover:text-white transition-colors text-[#1a8a4a]">
                <cat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-[#1a1a1a] text-lg mb-2">{cat.title}</h3>
              <p className="text-gray-500 text-sm">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8 text-center">Popular Articles</h2>
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-gray-100 space-y-3">
            {FAQS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden transition-all bg-white hover:border-[#1a8a4a]/30">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <span className={`font-semibold ${openFaq === i ? 'text-[#1a8a4a]' : 'text-[#1a1a1a]'}`}>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-[#1a8a4a] shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {FAQS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No articles found matching "{searchQuery}". Please try another search term.
              </div>
            )}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8 text-center">Still need help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a8a4a] text-white p-6 rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <MessageCircle className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Live Chat</h3>
              <p className="text-green-100 text-sm">Available 9 AM - 10 PM</p>
            </div>
            <div className="bg-gray-50 text-[#1a1a1a] border border-gray-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer hover:border-[#1a8a4a]">
              <Mail className="h-8 w-8 mx-auto mb-4 text-[#1a8a4a]" />
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-gray-500 text-sm">support@bdshop.com</p>
            </div>
            <div className="bg-gray-50 text-[#1a1a1a] border border-gray-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer hover:border-[#1a8a4a]">
              <Phone className="h-8 w-8 mx-auto mb-4 text-[#1a8a4a]" />
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-gray-500 text-sm">+880 1700-000000</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
