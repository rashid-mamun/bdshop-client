import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Search, Clock, Truck, Home } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../hooks/useToast';
import { formatBDT } from '../../utils/currency';
import { toUserFriendlyError } from '../../utils/userFriendlyError';

const STATUS_STEPS = [
  { status: 'pending', title: 'Order placed', icon: Package },
  { status: 'processing', title: 'Processing', icon: Clock },
  { status: 'shipped', title: 'Shipped', icon: Truck },
  { status: 'delivered', title: 'Delivered', icon: Home },
];

const statusIndex = (status: string) => {
  if (status === 'confirmed') return 0;
  if (status === 'cancelled') return -1;
  return STATUS_STEPS.findIndex((step) => step.status === status);
};

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const savedOrderInfo = (() => {
    try {
      return JSON.parse(window.localStorage.getItem('bdshop-last-order') || '{}');
    } catch {
      return {};
    }
  })();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || savedOrderInfo.orderId || '');
  const [email, setEmail] = useState(searchParams.get('email') || savedOrderInfo.email || '');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error: toastError } = useToast();

  const trackOrder = async (nextOrderId: string, nextEmail: string) => {
    const cleanOrderId = nextOrderId.trim();
    const cleanEmail = nextEmail.trim();
    if (!cleanOrderId || !cleanEmail) return;
    setIsLoading(true);
    setTrackedOrder(null);
    try {
      const response = await apiClient.get(`/orders/track/${encodeURIComponent(cleanOrderId)}`, {
        params: { email: cleanEmail },
      });
      setTrackedOrder(response.data.data);
    } catch (err: any) {
      toastError(toUserFriendlyError(err, 'We could not find an order with that ID and email. Please check both and try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryOrderId = searchParams.get('orderId');
    const queryEmail = searchParams.get('email');
    if (queryOrderId && queryEmail) {
      void trackOrder(queryOrderId, queryEmail);
    }
  }, []);

  const handleTrack = async (event: React.FormEvent) => {
    event.preventDefault();
    await trackOrder(orderId, email);
  };

  const currentStep = trackedOrder ? statusIndex(trackedOrder.status) : -1;

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 px-4">
      <div className="bd-container max-w-2xl space-y-10">
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
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a]"
                placeholder="BDS-ORDER-ID"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                  <h3 className="text-xl font-black text-[#1a1a1a]">{trackedOrder.orderNumber || trackedOrder._id}</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    Total: {formatBDT(trackedOrder.total)}
                  </p>
                </div>
                <div className="bg-[#e8f5ee] px-4 py-2 rounded-lg inline-block">
                  <p className="text-sm text-[#1a8a4a] font-bold capitalize">Status: {trackedOrder.status}</p>
                </div>
              </div>

              {trackedOrder.status === 'cancelled' ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
                  This order has been cancelled.
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                  {STATUS_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const completed = currentStep >= index;
                    const active = currentStep === index;
                    return (
                      <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center relative">
                        <div className={`h-14 w-14 rounded-full border-4 border-white flex items-center justify-center shrink-0 transition-colors ${
                          completed ? 'bg-[#1a8a4a] text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className={`font-bold ${completed ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{step.title}</h4>
                          {active && <p className="text-xs text-[#1a8a4a] mt-1 font-bold">Current step</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
