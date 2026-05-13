export default function TermsPage() {
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="hidden md:block w-72 shrink-0">
          <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1a1a1a] mb-4 text-lg">Table of Contents</h3>
            <ul className="space-y-3">
              {SECTIONS.map(s => (
                <li key={s.id}>
                  <button onClick={() => scrollTo(s.id)} className="text-sm text-gray-500 hover:text-[#1a8a4a] text-left transition-colors font-medium">
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-[#1a8a4a] mb-2">Last Updated: October 1, 2026</p>
          <h1 className="text-4xl font-black text-[#1a1a1a] mb-10">Terms of Service</h1>

          <div className="space-y-12 text-gray-600 leading-relaxed">
            
            <section id="acceptance">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using BD Shop (the "Website"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.</p>
            </section>

            <section id="use">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">2. Use of Website</h2>
              <p>You agree to use the Website only for lawful purposes. You must not use the Website in any way that causes, or may cause, damage to the Website or impairment of the availability or accessibility of the Website.</p>
            </section>

            <section id="account">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">3. Account Registration</h2>
              <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
            </section>

            <section id="orders">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">4. Orders & Payment</h2>
              <p>All orders are subject to acceptance and availability. Prices for our products are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies, or errors in product or pricing information.</p>
            </section>

            <section id="shipping">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">5. Shipping & Delivery</h2>
              <p>We aim to deliver products within the estimated timeframes provided. However, delays are occasionally inevitable due to unforeseen factors. BD Shop shall be under no liability for any delay or failure to deliver the products within estimated timescales.</p>
            </section>

            <section id="returns">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">6. Returns & Refunds</h2>
              <p>Our Returns Policy forms part of these Terms of Service. Please read our Returns Policy carefully to understand our practices regarding the return and refund of products.</p>
            </section>

            <section id="ip">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">7. Intellectual Property</h2>
              <p>The Website and its original content, features, and functionality are owned by BD Shop and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
            </section>

            <section id="liability">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">8. Limitation of Liability</h2>
              <p>In no event shall BD Shop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>

            <section id="law">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">9. Governing Law</h2>
              <p>These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.</p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">10. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <p><strong>Email:</strong> legal@bdshop.com</p>
                <p><strong>Phone:</strong> +880 1700-000000</p>
                <p><strong>Address:</strong> Dhaka, Bangladesh</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
