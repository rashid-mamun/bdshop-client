import { LockKeyhole, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

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
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <main className="bd-container py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">On this page</p>
                <h2 className="mt-2 text-xl font-black text-gray-950">Privacy Policy</h2>
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
                <ShieldCheck className="h-6 w-6 text-[#1a8a4a]" />
                <h3 className="mt-4 font-black text-gray-950">Your data stays protected</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                  We use account, order, and delivery data only to run BDShop services and protect your experience.
                </p>
              </div>
            </div>
          </aside>

          <article className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <header className="border-b border-gray-100 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] p-6 lg:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <LockKeyhole className="h-4 w-4" />
                Privacy & Data
              </span>
              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-[#1a8a4a]">Last Updated: May 22, 2026</p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                    Privacy Policy
                  </h1>
                  <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-gray-600">
                    This policy explains what information BDShop collects, how we use it, and the choices you have when shopping with us.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">Data promise</p>
                  <p className="mt-2 text-2xl font-black text-gray-950">Secure checkout and account data</p>
                </div>
              </div>
            </header>

            <div className="space-y-8 p-6 text-base font-medium leading-8 text-gray-600 lg:p-8">
              <section id="collect" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6">
                <h2 className="text-2xl font-black text-gray-950">1. Information We Collect</h2>
                <p className="mt-4">We collect information to provide better services to all users. The types of information we collect include:</p>
                <ul className="mt-4 space-y-3">
                  <li><strong className="text-gray-950">Personal Data:</strong> Name, email address, phone number, delivery address, and payment information.</li>
                  <li><strong className="text-gray-950">Usage Data:</strong> Pages visited, time spent on pages, links clicked, and device information.</li>
                  <li><strong className="text-gray-950">Cookies:</strong> Small data files stored on your device to improve your experience.</li>
                </ul>
              </section>

              <section id="use" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">2. How We Use Your Information</h2>
                <p className="mt-4">We use the collected information for these purposes:</p>
                <ul className="mt-4 space-y-3">
                  <li>To process and fulfill your orders</li>
                  <li>To communicate with you about order status and promotional offers</li>
                  <li>To improve and maintain website functionality</li>
                  <li>To detect and prevent fraudulent activities</li>
                </ul>
              </section>

              <section id="sharing" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">3. Information Sharing</h2>
                <p className="mt-4">
                  We do not sell your personal data. We may share information with trusted service providers such as delivery partners and payment gateways only to fulfill BDShop services.
                </p>
              </section>

              <section id="security" className="scroll-mt-32 rounded-3xl border border-[#1a8a4a]/10 bg-[#f8fbf9] p-6">
                <h2 className="text-2xl font-black text-gray-950">4. Data Security</h2>
                <p className="mt-4">
                  We implement security measures, including SSL encryption, to protect personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section id="cookies" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">5. Cookies Policy</h2>
                <p className="mt-4">
                  For details about cookies, review our <a href="/cookie-policy" className="font-black text-[#1a8a4a] hover:underline">Cookie Policy</a>.
                </p>
              </section>

              <section id="rights" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">6. Your Rights</h2>
                <p className="mt-4">You have the right to:</p>
                <ul className="mt-4 space-y-3">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of the data we hold about you</li>
                </ul>
                <p className="mt-4">You can manage these preferences from your account dashboard.</p>
              </section>

              <section id="contact" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6">
                <h2 className="text-2xl font-black text-gray-950">7. Contact Us</h2>
                <p className="mt-4">If you have questions about this Privacy Policy, contact us at:</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <Mail className="h-5 w-5 text-[#1a8a4a]" />
                    <p className="mt-3 text-sm font-black text-gray-950">Email</p>
                    <p className="text-sm text-gray-500">privacy@bdshop.com</p>
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
