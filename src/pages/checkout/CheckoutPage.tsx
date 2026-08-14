import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import apiClient from '../../services/apiClient';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/useToast';
import { formatBDT } from '../../utils/currency';
import { toUserFriendlyError } from '../../utils/userFriendlyError';
import { CheckCircle, CheckCircle2, ArrowLeft, Package, CreditCard, MapPin, Tag, ShoppingBag, Lock, ShieldCheck, Truck, Banknote } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const BD_DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

const rememberLastOrder = (order: any) => {
  const orderInfo = {
    orderId: order?.orderNumber || order?._id || '',
    email: order?.email || '',
    total: order?.total || 0,
  };
  if (orderInfo.orderId) {
    window.localStorage.setItem('bdshop-last-order', JSON.stringify(orderInfo));
  }
  return orderInfo;
};

const shippingSchema = z.object({
  email: z.string().email('Valid email is required'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(11, 'Phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  district: z.string().min(2, 'District is required'),
  division: z.string().min(2, 'Division is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  coupon: z.string().optional(),
});
type ShippingFormValues = z.infer<typeof shippingSchema>;

type CheckoutQuote = {
  items: Array<{ serviceId: string; name: string; price: number; quantity: number }>;
  totals: {
    subtotal: number;
    discount: number;
    discountRate: number;
    couponCode: string;
    couponValid: boolean;
    shippingFee: number;
    tax: number;
    total: number;
  };
};

/* Stripe payment form */
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
    onSuccess: (response) => {
      const orderInfo = rememberLastOrder(response.data);
      clearCart();
      success('Order placed successfully!');
      navigate('/thank-you', { state: orderInfo });
    },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Order failed. Please try again.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setStripeError(null);
    const cardEl = elements.getElement(CardNumberElement);
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
        setStripeError(toUserFriendlyError(error, 'Payment is temporarily unavailable. Please try Cash on Delivery or contact support.')); 
      }
      else { 
        mutation.mutate({ ...orderData, paymentMethodId: paymentMethod.id, paymentStatus: 'paid' }, {
          onError: (err: any) => {
            setStripeError(toUserFriendlyError(err, 'Order could not be placed. Please try again or choose Cash on Delivery.'));
          }
        }); 
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-[#1a8a4a]/15 bg-[#f8fbf9] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-gray-950">Secure card payment</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">Visa, Mastercard and international cards accepted</p>
          </div>
          <div className="flex gap-1.5">
            {['VISA', 'MC'].map((card) => (
              <span key={card} className="rounded-md bg-white px-2 py-1 text-[10px] font-black text-gray-500 shadow-sm ring-1 ring-gray-100">
                {card}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_120px]">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all focus-within:border-[#1a8a4a] focus-within:ring-2 focus-within:ring-[#1a8a4a]/20">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-gray-400">Card number</label>
            <CardNumberElement options={{
              showIcon: true,
              iconStyle: 'solid',
              disableLink: true,
              placeholder: '4242 4242 4242 4242',
              style: {
                base: {
                  fontSize: '16px',
                  color: '#111827',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: {
                  color: '#dc2626',
                },
              },
            }} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all focus-within:border-[#1a8a4a] focus-within:ring-2 focus-within:ring-[#1a8a4a]/20">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-gray-400">Expiry</label>
            <CardExpiryElement options={{
              placeholder: 'MM / YY',
              style: {
                base: {
                  fontSize: '16px',
                  color: '#111827',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: {
                  color: '#dc2626',
                },
              },
            }} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all focus-within:border-[#1a8a4a] focus-within:ring-2 focus-within:ring-[#1a8a4a]/20">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-gray-400">CVC</label>
            <CardCvcElement options={{
              placeholder: '123',
              style: {
                base: {
                  fontSize: '16px',
                  color: '#111827',
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
      </div>
      {stripeError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex items-center gap-2">
          <span className="font-black">!</span> {stripeError}
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500">
          <Lock className="h-3.5 w-3.5 text-[#1a8a4a]" /> Encrypted payment
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1a8a4a]" /> Buyer protected
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || mutation.isPending}
        className="w-full flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-black py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-green-900/15 active:scale-[0.98] disabled:opacity-60 text-base"
      >
        <Lock className="h-4 w-4" />
        {processing || mutation.isPending ? 'Processing...' : `Pay ${formatBDT(orderData.finalTotal)}`}
      </button>
      <p className="text-center text-xs text-gray-400">
        Test card: 4242 4242 4242 4242 · Any future date · Any 3-digit CVC
      </p>
    </form>
  );
}

/* Step indicator */
const STEPS = [
  { label: 'Shipping', icon: MapPin },
  { label: 'Payment', icon: CreditCard },
];

function StepBar({ step }: { step: number }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                done ? 'bg-[#1a8a4a] border-[#1a8a4a] shadow-lg shadow-green-100' : 
                active ? 'border-[#1a8a4a] bg-white shadow-lg shadow-green-50' : 
                'border-gray-200 bg-white'
              }`}>
                {done ? <CheckCircle className="h-6 w-6 text-white" /> : <Icon className={`h-5 w-5 ${active ? 'text-[#1a8a4a]' : 'text-gray-300'}`} />}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-black ${active || done ? 'text-[#1a8a4a]' : 'text-gray-300'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-10 sm:w-20 px-2 mb-6">
                <div className={`h-1 w-full rounded-full transition-colors duration-500 ${step > num ? 'bg-[#1a8a4a]' : 'bg-gray-100'}`} />
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}

/* Input helper */
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

/* Main page */
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  const [serverQuote, setServerQuote] = useState<CheckoutQuote | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [quoting, setQuoting] = useState(false);
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const { data: addresses = [] } = useQuery<any[]>({
    queryKey: ['user-addresses', user?.email],
    queryFn: async () => {
      const res = await apiClient.get('/addresses');
      return res.data?.data || [];
    },
    enabled: !!user,
  });

  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { 
      email: user?.email || '',
      fullName: user?.displayName || '', 
      phone: user?.phone || '',
      district: user?.district || '',
      division: user?.division || '',
    },
  });

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        setValue('fullName', defaultAddr.fullName || user?.displayName || '');
        setValue('phone', defaultAddr.phone || user?.phone || '');
        setValue('street', defaultAddr.street || '');
        setValue('district', defaultAddr.district || '');
        setValue('division', defaultAddr.division || '');
        setValue('postalCode', defaultAddr.postalCode || '');
      }
    }
  }, [addresses, selectedAddressId, setValue, user]);

  const selectAddress = (addr: any) => {
    setSelectedAddressId(addr._id);
    setValue('fullName', addr.fullName || user?.displayName || '');
    setValue('phone', addr.phone || user?.phone || '');
    setValue('street', addr.street || '');
    setValue('district', addr.district || '');
    setValue('division', addr.division || '');
    setValue('postalCode', addr.postalCode || '');
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const displayTotals = serverQuote?.totals || {
    subtotal,
    discount: 0,
    discountRate: 0,
    couponCode: '',
    couponValid: false,
    shippingFee: subtotal > 0 ? 120 : 0,
    tax: 0,
    total: subtotal > 0 ? subtotal + 120 : 0,
  };

  const handleCoupon = () => {
    const code = getValues('coupon')?.toUpperCase().trim() || '';
    setCouponMsg(code ? 'Coupon will be verified by the server before payment.' : 'Enter a coupon code first.');
  };

  const createQuote = async (data: ShippingFormValues) => {
    setQuoting(true);
    try {
      const res = await apiClient.post('/orders/quote', {
        items: items.map((i) => ({ serviceId: i._id, quantity: i.quantity })),
        couponCode: data.coupon,
      });
      const quote = res.data.data as CheckoutQuote;
      setServerQuote(quote);
      setShippingData(data);
      if (data.coupon) {
        setCouponMsg(
          quote.totals.couponValid
            ? `Coupon ${quote.totals.couponCode} applied by server.`
            : 'Coupon was not valid and was not applied.',
        );
      }
      setStep(2);
    } catch (err: any) {
      toastError(toUserFriendlyError(err, 'Unable to verify checkout total. Please try again.'));
    } finally {
      setQuoting(false);
    }
  };

  const codMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/orders', data);
      return res.data;
    },
    onSuccess: (response) => {
      const orderInfo = rememberLastOrder(response.data);
      clearCart();
      success('Order placed! Pay on delivery.');
      navigate('/thank-you', { state: orderInfo });
    },
    onError: (err: any) => toastError(err.response?.data?.error || err.response?.data?.message || 'Order failed. Please try again.'),
  });

  const handleCODSubmit = () => {
    if (!orderPayload.shippingAddress) return;
    codMutation.mutate({ ...orderPayload, paymentStatus: 'pending', paymentMethod: 'cod' });
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
    email: user?.email || shippingData?.email,
    items: items.map((i) => ({ serviceId: i._id, quantity: i.quantity })),
    shippingAddress: shippingData ? { 
      fullName: shippingData.fullName,
      street: shippingData.street, 
      district: shippingData.district, 
      division: shippingData.division, 
      postalCode: shippingData.postalCode, 
      country: 'Bangladesh',
      phone: shippingData.phone
    } : null,
    couponCode: shippingData?.coupon,
    status: 'pending',
    finalTotal: displayTotals.total,
  };
  const summaryItems = items.map((item) => {
    const quotedItem = serverQuote?.items.find((quoteItem) => quoteItem.serviceId === item._id);
    return {
      _id: item._id,
      name: item.name,
      model: item.model,
      img: item.img,
      quantity: item.quantity,
      price: quotedItem?.price ?? item.price,
    };
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 px-4">
      <div className="bd-container max-w-6xl">
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1a8a4a] transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">Checkout</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Review your products, confirm your delivery address, and pay safely.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#e8f5ee] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
              <Lock className="h-3.5 w-3.5" /> 256-bit encrypted checkout
            </div>
          </div>
        </div>

        {/* Checkout Steps */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { n: 1, title: 'Delivery Details', subtitle: 'Address & Contact' },
            { n: 2, title: 'Payment', subtitle: 'Card or Cash on Delivery' },
          ].map((s) => (
            <div
              key={s.n}
              className={`rounded-2xl p-4 border transition-all ${
                step === s.n
                  ? 'border-[#1a8a4a] bg-white shadow-sm'
                  : step > s.n
                  ? 'border-gray-200 bg-white/70'
                  : 'border-gray-200 bg-white/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    step === s.n
                      ? 'bg-[#1a8a4a] text-white shadow-md shadow-[#1a8a4a]/20'
                      : step > s.n
                      ? 'bg-[#e8f5ee] text-[#1a8a4a]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="h-5 w-5" /> : s.n}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1a1a1a]">{s.title}</p>
                  <p className="text-xs text-gray-400 font-medium">{s.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Form / Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="border-b border-gray-100 bg-gradient-to-r from-[#f8fbf9] to-white p-6 md:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-black text-[#1a1a1a] text-2xl flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-[#1a8a4a]" /> Delivery Details
                      </h2>
                      <p className="mt-1 text-sm font-medium text-gray-500">Provide shipping details for prompt and accurate delivery.</p>
                    </div>
                    {user && (
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black text-[#1a8a4a]">
                        <CheckCircle2 className="h-4 w-4" /> Signed in as {user.displayName || user.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                {user && addresses.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">Saved Addresses</p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {addresses.map((addr: any) => (
                        <button
                          key={addr._id}
                          type="button"
                          onClick={() => selectAddress(addr)}
                          className={`rounded-2xl border p-3.5 text-left transition ${
                            selectedAddressId === addr._id
                              ? 'border-[#1a8a4a] bg-[#f8fbf9] ring-2 ring-[#1a8a4a]/20'
                              : 'border-gray-200 bg-white hover:border-[#1a8a4a]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-gray-900">{addr.label || 'Address'}</span>
                            {addr.isDefault && (
                              <span className="rounded bg-[#e8f5ee] px-1.5 py-0.5 text-[10px] font-black text-[#1a8a4a]">Default</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs font-bold text-gray-800 truncate">{addr.street}</p>
                          <p className="text-[11px] text-gray-500">{addr.district}, {addr.division} {addr.postalCode}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <form id="shipping-form" onSubmit={handleSubmit(createQuote)} className="space-y-5">
                  {!user && (
                    <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                      <p className="text-sm font-bold text-green-900">Guest checkout</p>
                      <p className="mt-1 text-xs text-green-700">No account needed. We will send order updates to your email.</p>
                      <div className="mt-3">
                        <Field label="Email Address" error={errors.email?.message}>
                          <input type="email" {...register('email')} className={inputCls} placeholder="you@example.com" />
                        </Field>
                      </div>
                    </div>
                  )}
                  
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
                      <p className={`text-sm mt-2 font-bold ${serverQuote?.totals.couponValid ? 'text-[#1a8a4a]' : 'text-amber-600'}`}>
                        {couponMsg}
                      </p>
                    )}
                  </div>
                </form>
                <button
                  form="shipping-form"
                  type="submit"
                  disabled={quoting}
                  className="w-full mt-8 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] text-base disabled:opacity-60"
                >
                  {quoting ? 'Verifying total...' : 'Continue to Payment'}
                </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="border-b border-gray-100 bg-gradient-to-r from-[#f8fbf9] to-white p-6 md:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-black text-[#1a1a1a] text-2xl flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-[#1a8a4a]" /> Payment Method
                      </h2>
                      <p className="mt-1 text-sm font-medium text-gray-500">Choose a secure payment method to finish checkout.</p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-[#1a8a4a] ring-1 ring-gray-100">
                      <ShieldCheck className="h-4 w-4" /> SSL protected
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#1a8a4a] bg-[#f0faf4] shadow-md shadow-green-100'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-[#1a8a4a]' : 'text-gray-400'}`} />
                      <span className={`text-sm font-black ${paymentMethod === 'card' ? 'text-[#1a8a4a]' : 'text-gray-600'}`}>Card Payment</span>
                      <span className="text-[10px] font-semibold text-gray-400">Visa, Mastercard</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#1a8a4a] bg-[#f0faf4] shadow-md shadow-green-100'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Banknote className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-[#1a8a4a]' : 'text-gray-400'}`} />
                      <span className={`text-sm font-black ${paymentMethod === 'cod' ? 'text-[#1a8a4a]' : 'text-gray-600'}`}>Cash on Delivery</span>
                      <span className="text-[10px] font-semibold text-gray-400">Pay when you receive</span>
                    </button>
                  </div>

                  {/* Card Payment */}
                  {paymentMethod === 'card' && (
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm orderData={orderPayload} />
                    </Elements>
                  )}

                  {/* Cash on Delivery */}
                  {paymentMethod === 'cod' && (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 flex gap-3">
                        <Banknote className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-black text-amber-900">Cash on Delivery</p>
                          <p className="text-xs font-medium text-amber-700 mt-1">Please have the exact amount of <span className="font-black">{formatBDT(orderPayload.finalTotal)}</span> ready when the delivery arrives.</p>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500">
                          <Truck className="h-3.5 w-3.5 text-[#1a8a4a]" /> Delivery in 24–72 hrs
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#1a8a4a]" /> Buyer protected
                        </div>
                      </div>
                      <button
                        onClick={handleCODSubmit}
                        disabled={codMutation.isPending}
                        className="w-full flex items-center justify-center gap-2 bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-black py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-green-900/15 active:scale-[0.98] disabled:opacity-60 text-base"
                      >
                        <Banknote className="h-4 w-4" />
                        {codMutation.isPending ? 'Placing order...' : `Place Order - Pay ${formatBDT(orderPayload.finalTotal)} on Delivery`}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-[#1a8a4a] transition-colors"
                  >
                    ← Edit Shipping Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full shrink-0">
            <div className="overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#1a8a4a]" /> Order Summary
                  </h3>
                  <span className="rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-black text-[#1a8a4a]">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} item{items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-500">
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 ring-1 ring-gray-100">
                    <Truck className="h-3.5 w-3.5 text-[#1a8a4a]" /> 24-72h delivery
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 ring-1 ring-gray-100">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#1a8a4a]" /> Protected
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-5 max-h-[42vh] overflow-y-auto p-6 pr-3 custom-scrollbar">
                {summaryItems.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="relative shrink-0">
                      <div className="relative w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:border-[#1a8a4a]/30 transition-colors overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eefaf3] to-white text-[#1a8a4a]">
                          <Package className="h-6 w-6 opacity-70" />
                        </div>
                        <img
                          src={item.img || ''}
                          alt=""
                          className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#1a8a4a] transition-colors">{item.model}</p>
                      <p className="text-sm font-black text-[#1a8a4a] mt-1.5 uppercase tracking-tight">
                        {formatBDT(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 p-6 space-y-4 text-sm">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{formatBDT(displayTotals.subtotal)}</span>
                </div>
                {displayTotals.discount > 0 && (
                  <div className="flex justify-between items-center bg-green-50/50 p-2.5 rounded-xl border border-green-100/50">
                    <span className="text-green-700 font-bold flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" /> Discount ({Math.round(displayTotals.discountRate * 100)}%)
                    </span>
                    <span className="text-green-700 font-black">-{formatBDT(displayTotals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping Fee</span>
                  <span className="text-gray-900">{formatBDT(displayTotals.shippingFee)}</span>
                </div>
                
                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total to Pay</span>
                    <p className="text-gray-900 text-sm font-medium opacity-50">VAT Included</p>
                  </div>
                  <span className="text-[#1a8a4a] text-3xl font-black tracking-tight italic">{formatBDT(displayTotals.total)}</span>
                </div>
              </div>

              {/* Trust Section */}
              <div className="mx-6 mb-6 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col gap-3">
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
