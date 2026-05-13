import { useState } from 'react';
import { Package, Search, CheckCircle, Clock, Truck, Home } from 'lucide-react';

const MOCK_ORDER = {
  id: 'BDS-8A9X2M1',
  status: 'shipped', // placed, processing, shipped, delivered
  courier: 'Pathao',
  trackingNo: 'PTH-992837461',
  estimatedDelivery: 'Oct 15, 2026',
  timeline: [
    { status: 'placed', title: 'Order Placed', date: 'Oct 12, 2026, 10:30 AM', icon: Package, completed: true },
    { status: 'processing', title: 'Processing', date: 'Oct 12, 2026, 02:15 PM', icon: Clock, completed: true },
    { status: 'shipped', title: 'Shipped', date: 'Oct 13, 2026, 09:45 AM', icon: Truck, completed: true, active: true },
    { status: 'delivered', title: 'Delivered', date: 'Estimated: Oct 15', icon: Home, completed: false }
  ]
};

export default function TrackOrderPage() {
  const [trackedOrder, setTrackedOrder] = useState<typeof MOCK_ORDER | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setTrackedOrder(MOCK_ORDER);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-[#1a8a4a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#1a8a4a]/20">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a]">Track Your Order</h1>
          <p className="text-gray-500 text-lg">Enter your order ID and email to see the current status.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleTrack} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Order ID</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" 
                placeholder="e.g. BDS-XYZ123" 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]" 
                placeholder="your@email.com" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] text-base mt-2 disabled:opacity-70"
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {trackedOrder && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Order</p>
                  <h3 className="text-xl font-black text-[#1a1a1a]">{trackedOrder.id}</h3>
                </div>
                <div className="bg-[#e8f5ee] px-4 py-2 rounded-lg inline-block">
                  <p className="text-sm text-[#1a8a4a] font-bold capitalize">Status: {trackedOrder.status}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Connecting line (desktop) */}
                <div className="hidden md:block absolute top-7 left-8 right-8 h-1 bg-gray-100 rounded-full z-0">
                  <div className="h-full bg-[#1a8a4a] rounded-full" style={{ width: '66%' }}></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                  {trackedOrder.timeline.map((step, i) => (
                    <div key={i} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 text-left md:text-center relative">
                      {/* Connecting line (mobile) */}
                      {i < trackedOrder.timeline.length - 1 && (
                        <div className={`md:hidden absolute left-7 top-14 bottom-[-32px] w-0.5 ${step.completed ? 'bg-[#1a8a4a]' : 'bg-gray-100'}`}></div>
                      )}
                      
                      <div className="relative">
                        <div className={`h-14 w-14 rounded-full border-4 border-white flex items-center justify-center shrink-0 transition-colors ${
                          step.completed ? 'bg-[#1a8a4a] text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <step.icon className="h-6 w-6" />
                        </div>
                        {step.active && (
                          <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1a8a4a] border-2 border-white"></span>
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className={`font-bold ${step.completed ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{step.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#1a8a4a]" /> Delivery Details
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Courier Partner</p>
                  <p className="font-bold text-[#1a1a1a]">{trackedOrder.courier}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-bold text-[#1a1a1a]">{trackedOrder.trackingNo}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#1a8a4a]/20">
                  <p className="text-xs text-[#1a8a4a] mb-1">Estimated Delivery</p>
                  <p className="font-black text-[#1a8a4a]">{trackedOrder.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
