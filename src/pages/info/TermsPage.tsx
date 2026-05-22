import { FileText, Mail, MapPin, Phone, Scale, ShieldCheck } from 'lucide-react';

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'use', title: 'Use of Website' },
  { id: 'account', title: 'Account Registration' },
  { id: 'orders', title: 'Orders & Payment' },
  { id: 'shipping', title: 'Shipping & Delivery' },
  { id: 'returns', title: 'Returns & Refunds' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact Information' },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <main className="bd-container py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">On this page</p>
                <h2 className="mt-2 text-xl font-black text-gray-950">Terms of Service</h2>
                <nav className="mt-5 space-y-1">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-gray-500 transition hover:bg-[#f8fbf9] hover:text-[#1a8a4a]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition group-hover:bg-[#1a8a4a]" />
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="rounded-3xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-5">
                <Scale className="h-6 w-6 text-[#1a8a4a]" />
                <h3 className="mt-4 font-black text-gray-950">Clear shopping terms</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                  These terms explain orders, payments, delivery, returns, and account responsibilities in one place.
                </p>
              </div>
            </div>
          </aside>

          <article className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <header className="border-b border-gray-100 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] p-6 lg:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <FileText className="h-4 w-4" />
                Legal Agreement
              </span>
              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-[#1a8a4a]">Last Updated: May 22, 2026</p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                    Terms of Service
                  </h1>
                  <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-gray-600">
                    These terms define how customers can use BDShop, place orders, manage accounts, and access support.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">Customer promise</p>
                  <p className="mt-2 text-2xl font-black text-gray-950">Fair orders, secure payments, clear support</p>
                </div>
              </div>
            </header>

            <div className="space-y-8 p-6 text-base font-medium leading-8 text-gray-600 lg:p-8">
              <section id="acceptance" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6">
                <h2 className="text-2xl font-black text-gray-950">1. Acceptance of Terms</h2>
                <p className="mt-4">
                  By accessing and using BDShop, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                </p>
              </section>

              <section id="use" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">2. Use of Website</h2>
                <p className="mt-4">
                  You agree to use the website only for lawful purposes. You must not use the website in any way that causes damage, disruption, or reduced availability of BDShop services.
                </p>
              </section>

              <section id="account" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">3. Account Registration</h2>
                <p className="mt-4">
                  When you create an account, you must provide accurate, complete, and current information. You are responsible for protecting your password and account activity.
                </p>
              </section>

              <section id="orders" className="scroll-mt-32 rounded-3xl border border-[#1a8a4a]/10 bg-[#f8fbf9] p-6">
                <h2 className="text-2xl font-black text-gray-950">4. Orders & Payment</h2>
                <p className="mt-4">
                  All orders are subject to acceptance and availability. Product prices may change without notice. We may refuse or cancel an order for availability, quantity, pricing, or product information issues.
                </p>
              </section>

              <section id="shipping" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">5. Shipping & Delivery</h2>
                <p className="mt-4">
                  We aim to deliver products within the estimated timeframes shown at checkout. Delivery delays can happen due to logistics, weather, address, or operational factors.
                </p>
              </section>

              <section id="returns" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">6. Returns & Refunds</h2>
                <p className="mt-4">
                  Our Returns Policy forms part of these Terms of Service. Please review it carefully to understand eligible items, pickup review, refund processing, and support requirements.
                </p>
              </section>

              <section id="ip" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">7. Intellectual Property</h2>
                <p className="mt-4">
                  The website, original content, features, and functionality are owned by BDShop and protected by copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section id="liability" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">8. Limitation of Liability</h2>
                <p className="mt-4">
                  BDShop and its team are not liable for indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of our services.
                </p>
              </section>

              <section id="law" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">9. Governing Law</h2>
                <p className="mt-4">
                  These Terms are governed by the laws of Bangladesh, without regard to conflict of law provisions.
                </p>
              </section>

              <section id="contact" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-6 w-6 text-[#1a8a4a]" />
                  <div>
                    <h2 className="text-2xl font-black text-gray-950">10. Contact Information</h2>
                    <p className="mt-3">If you have questions about these Terms, contact us at:</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <Mail className="h-5 w-5 text-[#1a8a4a]" />
                    <p className="mt-3 text-sm font-black text-gray-950">Email</p>
                    <p className="text-sm text-gray-500">legal@bdshop.com</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <Phone className="h-5 w-5 text-[#1a8a4a]" />
                    <p className="mt-3 text-sm font-black text-gray-950">Phone</p>
                    <p className="text-sm text-gray-500">+880 1700-000000</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <MapPin className="h-5 w-5 text-[#1a8a4a]" />
                    <p className="mt-3 text-sm font-black text-gray-950">Address</p>
                    <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
