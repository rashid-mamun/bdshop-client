import { useState } from 'react';
import { PackageX, Truck, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { q: "What is the return window?", a: "You have 30 days from the date of delivery to initiate a return for most items." },
  { q: "Which items are eligible for return?", a: "Items must be unused, in their original packaging, and with all tags attached. Electronics must be unopened unless defective." },
  { q: "How long does a refund take?", a: "Once we receive and inspect your item, refunds are processed within 5-7 business days to your original payment method." },
  { q: "What if my item arrived damaged?", a: "Please initiate a return immediately and select 'Damaged Item' as the reason. We will arrange a free pickup." },
  { q: "How do I initiate a return?", a: "Fill out the form below or go to your Order History in your account dashboard and click 'Return Item'." }
];

export default function ReturnsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Top Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-[#1a1a1a]">Returns & Refunds</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            We want you to be completely satisfied with your purchase. If you're not, here's how we can help make it right.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: PackageX, title: 'Request Return', desc: 'Fill out the form below or start from your order history.' },
            { icon: Truck, title: 'We Pick Up', desc: 'Hand over the package to our delivery partner at your doorstep.' },
            { icon: CreditCard, title: 'Refund Processed', desc: 'Get your money back within 5-7 business days after inspection.' }
          ].map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute -right-4 -top-4 text-[100px] font-black text-gray-50 opacity-50 select-none group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-16 w-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-[#1a8a4a]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Policy & FAQ */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Return Policy FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#1a1a1a]">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-[#1a8a4a] shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Initiate a Return</h2>
            <p className="text-gray-500 mt-2">Please provide your order details to start the process.</p>
          </div>
          
          <form className="max-w-2xl mx-auto space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Order ID</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" placeholder="e.g. BDS-XYZ123" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Email Address</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Select Item(s)</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] bg-white">
                <option value="">Select an item from order...</option>
                <option value="1">Entire Order</option>
                <option value="2">Specific Items</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Reason for Return</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] bg-white">
                <option value="">Select a reason...</option>
                <option value="damaged">Damaged Item</option>
                <option value="wrong">Wrong Item Received</option>
                <option value="not_described">Not as Described</option>
                <option value="changed_mind">Changed My Mind</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Additional Details</label>
              <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" placeholder="Please provide any additional information..."></textarea>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Upload Photo (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <p className="text-sm text-gray-500">Click to upload or drag and drop<br/><span className="text-xs text-gray-400 mt-1 block">PNG, JPG up to 5MB</span></p>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] text-base mt-4">
              Submit Return Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
