import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import apiClient from '../../services/apiClient';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/useToast';
import { CheckCircle, Package, CreditCard, MapPin, Tag, ShoppingBag, Lock } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51TVvR9GnaqZJE5mQ8g3FhQNV5W4g45Pc2dMHPU0UY82uL9LByW7t6KicL4LdYIMpmVWzl4zMw9M1hXV3wFtHCdGs000loFpQ19');

const SHIPPING_RATE = 120; // 120 BDT
const TAX_RATE = 0; // 0% tax for simplicity, but could be 0.05
const VALID_COUPONS: Record<string, number> = {
  BDSHOP10: 0.10,
  SAVE20: 0.20,
  NEWUSER15: 0.15,
};

const BD_DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(11, 'Phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  district: z.string().min(2, 'District is required'),
  division: z.string().min(2, 'Division is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  coupon: z.string().optional(),
});
type ShippingFormValues = z.infer<typeof shippingSchema>;

/* ─── Stripe payment form ─── */
function StripePaymentForm({ orderData }: { orderData: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { clearCart } = useCartStore();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/orders', data);
      return res.data;
    },
    onSuccess: () => { clearCart(); success('Order placed successfully!'); navigate('/dashboard'); },
    onError: (err: any) => toastError(err.response?.data?.message || 'Order failed. Please try again.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setStripeError(null);
    const cardEl = elements.getElement(CardElement);
    if (cardEl) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardEl,
        billing_details: {
          name: orderData.shippingAddress?.fullName || orderData.email,
          address: {
            line1: orderData.shippingAddress?.street,
            city: orderData.shippingAddress?.district,
            state: orderData.shippingAddress?.division,
            postal_code: orderData.shippingAddress?.postalCode,
            country: 'BD',
          }
        }
      });
      if (error) { 
        setStripeError(error.message || 'Payment error'); 
      }
      else { 
        mutation.mutate({ ...orderData, paymentMethodId: paymentMethod.id, paymentStatus: 'paid' }, {
          onError: (err: any) => {
            const serverMsg = err.response?.data?.error || err.response?.data?.message || 'Order creation failed';
            setStripeError(serverMsg);
          }
        }); 
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm focus-within:ring-2 focus-within:ring-[#1a8a4a]/20 focus-within:border-[#1a8a4a] transition-all min-h-[64px] flex items-center">
        <div className="w-full">
          <CardElement options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#1a1a1a',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: {
                color: '#dc2626',
              },
            },
          }} />
        </div>
      </div>
      {stripeError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex items-center gap-2">
          <span>⚠</span> {stripeError}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Lock className="h-3.5 w-3.5" /> Your payment info is encrypted and secure
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || mutation.isPending}
        className="w-full flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-60 text-base"
      >
        <Lock className="h-4 w-4" />
        {processing || mutation.isPending ? 'Processing...' : `Pay ৳${orderData.finalTotal?.toLocaleString()}`}
      </button>
      <p className="text-center text-xs text-gray-400">
        Test card: 4242 4242 4242 4242 · Any future date · Any 3-digit CVC
      </p>
    </form>
  );
}

/* ─── Step indicator ─── */
const STEPS = [
  { label: 'Cart', icon: ShoppingBag },
  { label: 'Shipping', icon: MapPin },
  { label: 'Payment', icon: CreditCard },
];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`h-12 w-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                done ? 'bg-[#1a8a4a] border-[#1a8a4a] shadow-lg shadow-green-100' : 
                active ? 'border-[#1a8a4a] bg-white shadow-lg shadow-green-50' : 
                'border-gray-200 bg-white'
              }`}>
                {done ? <CheckCircle className="h-6 w-6 text-white" /> : <Icon className={`h-5 w-5 ${active ? 'text-[#1a8a4a]' : 'text-gray-300'}`} />}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-black ${active || done ? 'text-[#1a8a4a]' : 'text-gray-300'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 sm:w-24 px-2 mb-6">
                <div className={`h-1 w-full rounded-full transition-colors duration-500 ${step > num ? 'bg-[#1a8a4a]' : 'bg-gray-100'}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Input helper ─── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#1a1a1a] block mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8a4a]/30 focus:border-[#1a8a4a] transition-all bg-white';

/* ─── Main page ─── */
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const { items } = useCartStore();
  const { user } = useAuthStore();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { 
      fullName: user?.displayName || '', 
      phone: user?.phone || '',
      district: user?.district || '',
      division: user?.division || '',
    },
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmt = subtotal * discount;
  const afterDiscount = subtotal - discountAmt;
  const tax = afterDiscount * TAX_RATE;
  const shipping = subtotal > 0 ? SHIPPING_RATE : 0;
  const finalTotal = afterDiscount + tax + shipping;

  const handleCoupon = () => {
    const code = getValues('coupon')?.toUpperCase().trim() || '';
    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code]);
      setCouponMsg(`✓ ${Math.round(VALID_COUPONS[code] * 100)}% discount applied!`);
    } else {
      setDiscount(0);
      setCouponMsg('Invalid coupon code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-6">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Add some products before checking out.</p>
        <Link to="/products" className="bg-[#1a8a4a] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#157a3f] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const orderPayload = {
    email: user?.email,
    items: items.map((i) => ({ serviceId: i._id, name: i.model, price: i.price, quantity: i.quantity })),
    total: finalTotal,
    shippingAddress: shippingData ? { 
      fullName: shippingData.fullName,
      street: shippingData.street, 
      district: shippingData.district, 
      division: shippingData.division, 
      postalCode: shippingData.postalCode, 
      country: 'Bangladesh',
      phone: shippingData.phone
    } : null,
    status: 'pending',
    finalTotal,
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Checkout</h1>
          <p className="text-gray-500 font-medium tracking-wide">Complete your order securely</p>
        </div>

        <StepBar step={step} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: Form ── */}
          <div className="flex-1">

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="font-bold text-[#1a1a1a] text-xl flex items-center gap-2 mb-6">
                  <MapPin className="h-6 w-6 text-[#1a8a4a]" /> Delivery Details
                </h2>
                <form id="shipping-form" onSubmit={handleSubmit((d) => { setShippingData(d); setStep(2); })} className="space-y-5">
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Full Name" error={errors.fullName?.message}>
                      <input {...register('fullName')} className={inputCls} placeholder="e.g. John Doe" />
                    </Field>
                    <Field label="Phone Number" error={errors.phone?.message}>
                      <input type="tel" {...register('phone')} className={inputCls} placeholder="01XXXXXXXXX" />
                    </Field>
                  </div>

                  <Field label="Street Address" error={errors.street?.message}>
                    <input {...register('street')} className={inputCls} placeholder="House, Road, Area..." />
                  </Field>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    <Field label="District" error={errors.district?.message}>
                      <input {...register('district')} className={inputCls} placeholder="e.g. Dhaka" />
                    </Field>
                    <Field label="Division" error={errors.division?.message}>
                      <select {...register('division')} className={inputCls}>
                        <option value="">Select Division</option>
                        {BD_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Postal Code" error={errors.postalCode?.message}>
                      <input {...register('postalCode')} className={inputCls} placeholder="1200" />
                    </Field>
                  </div>

                  {/* Coupon */}
                  <div className="pt-4 mt-6 border-t border-gray-100">
                    <label className="text-sm font-semibold text-[#1a1a1a] block mb-2 flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-[#1a8a4a]" /> Have a Coupon?
                    </label>
                    <div className="flex gap-2">
                      <input {...register('coupon')} className={`${inputCls} flex-1 font-mono uppercase`} placeholder="Enter code" />
                      <button
                        type="button"
                        onClick={handleCoupon}
                        className="px-6 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm font-bold text-[#1a1a1a] rounded-xl transition-colors shadow-sm"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`text-sm mt-2 font-bold ${discount > 0 ? 'text-[#1a8a4a]' : 'text-red-500'}`}>
                        {couponMsg}
                      </p>
                    )}
                  </div>
                </form>
                <button
                  form="shipping-form"
                  type="submit"
                  className="w-full mt-8 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] text-base"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="font-bold text-[#1a1a1a] text-xl flex items-center gap-2 mb-6">
                  <CreditCard className="h-6 w-6 text-[#1a8a4a]" /> Payment Method
                </h2>
                <Elements stripe={stripePromise}>
                  <StripePaymentForm orderData={orderPayload} />
                </Elements>
                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-5 py-3 text-sm font-semibold text-gray-500 hover:text-[#1a8a4a] transition-colors"
                >
                  ← Edit Shipping Details
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#1a8a4a]" /> Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-5 mb-8 max-h-[45vh] overflow-y-auto pr-3 custom-scrollbar">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:border-[#1a8a4a]/30 transition-colors overflow-hidden">
                        <img src={item.img || ''} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#1a8a4a] transition-colors">{item.model}</p>
                      <p className="text-sm font-black text-[#1a8a4a] mt-1.5 uppercase tracking-tight">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-50 pt-6 space-y-4 text-sm">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center bg-green-50/50 p-2.5 rounded-xl border border-green-100/50">
                    <span className="text-green-700 font-bold flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" /> Discount ({Math.round(discount * 100)}%)
                    </span>
                    <span className="text-green-700 font-black">−৳{discountAmt.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping Fee</span>
                  <span className="text-gray-900">৳{shipping.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total to Pay</span>
                    <p className="text-gray-900 text-sm font-medium opacity-50">VAT Included</p>
                  </div>
                  <span className="text-[#1a8a4a] text-3xl font-black tracking-tight italic">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Section */}
              <div className="mt-8 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-600 uppercase tracking-widest">
                  <Lock className="h-4 w-4 text-[#1a8a4a]" /> Secure Transaction
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                  Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
