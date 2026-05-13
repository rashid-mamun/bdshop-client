export default function PrivacyPolicyPage() {
  const SECTIONS = [
    { id: 'collect', title: 'Information We Collect' },
    { id: 'use', title: 'How We Use Your Information' },
    { id: 'sharing', title: 'Information Sharing' },
    { id: 'security', title: 'Data Security' },
    { id: 'cookies', title: 'Cookies Policy' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'contact', title: 'Contact Us' },
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
          <h1 className="text-4xl font-black text-[#1a1a1a] mb-10">Privacy Policy</h1>

          <div className="space-y-12 text-gray-600 leading-relaxed">
            
            <section id="collect">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect information to provide better services to all our users. The types of information we collect include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, delivery address, and payment information.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and device information.</li>
                <li><strong>Cookies:</strong> Small data files stored on your device to improve your experience.</li>
              </ul>
            </section>

            <section id="use">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your order status and promotional offers</li>
                <li>To improve and maintain our website functionality</li>
                <li>To detect and prevent fraudulent activities</li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">3. Information Sharing</h2>
              <p>We do not sell your personal data. We may share your information with trusted third-party service providers (such as delivery partners like Pathao and payment gateways like Stripe) solely for the purpose of fulfilling our services to you. These third parties are bound by strict confidentiality agreements.</p>
            </section>

            <section id="security">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">4. Data Security</h2>
              <p>We implement robust security measures, including 256-bit SSL encryption, to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">5. Cookies Policy</h2>
              <p>For detailed information on how we use cookies, please review our separate <a href="/cookie-policy" className="text-[#1a8a4a] hover:underline font-semibold">Cookie Policy</a>.</p>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access, update, or delete your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of the data we hold about you</li>
              </ul>
              <p className="mt-4">You can manage these preferences from your Account Dashboard.</p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <p><strong>Email:</strong> privacy@bdshop.com</p>
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
