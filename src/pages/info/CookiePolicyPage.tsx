import { useState } from 'react';
import { BarChart3, Cookie, Mail, Megaphone, Settings2, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const SECTIONS = [
  { id: 'preferences', title: 'Manage Preferences' },
  { id: 'what', title: 'What Are Cookies' },
  { id: 'types', title: 'Types of Cookies We Use' },
  { id: 'management', title: 'Cookie Management' },
  { id: 'third', title: 'Third-party Cookies' },
  { id: 'updates', title: 'Updates to This Policy' },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const PreferenceToggle = ({
  enabled,
  disabled,
  onClick,
}: {
  enabled: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={enabled}
    className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition focus:outline-none focus:ring-4 focus:ring-[#1a8a4a]/15 ${
      enabled ? 'bg-[#1a8a4a]' : 'bg-gray-300'
    } ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:shadow-md'}`}
  >
    <span
      className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);

export default function CookiePolicyPage() {
  const { success } = useToast();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  const handleSavePreferences = () => {
    success('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <main className="bd-container py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">On this page</p>
                <h2 className="mt-2 text-xl font-black text-gray-950">Cookie Policy</h2>
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
                <h3 className="mt-4 font-black text-gray-950">You control preferences</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                  Essential cookies keep checkout working. Optional cookies can be updated anytime from this page.
                </p>
              </div>
            </div>
          </aside>

          <article className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <header className="border-b border-gray-100 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] p-6 lg:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                <Cookie className="h-4 w-4" />
                Cookie Controls
              </span>
              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-[#1a8a4a]">Last Updated: May 22, 2026</p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                    Cookie Policy
                  </h1>
                  <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-gray-600">
                    Learn how BDShop uses cookies to keep shopping fast, secure, personalized, and reliable.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#1a8a4a]/10 bg-[#e8f5ee] p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-[#1a8a4a]">Preference center</p>
                  <p className="mt-2 text-2xl font-black text-gray-950">Adjust optional cookies in seconds</p>
                </div>
              </div>
            </header>

            <div className="space-y-8 p-6 text-base font-medium leading-8 text-gray-600 lg:p-8">
              <section id="preferences" className="scroll-mt-32 overflow-hidden rounded-3xl border border-[#1a8a4a]/10 bg-[#fbfcfd]">
                <div className="border-b border-gray-100 bg-white p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-gray-950">Manage Cookie Preferences</h2>
                      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-gray-500">
                        Essential cookies are required for login, cart, checkout, and security. Optional cookies help us improve and personalize BDShop.
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#1a8a4a]">
                      <Settings2 className="h-4 w-4" />
                      Live controls
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-6">
                  <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-950">Essential Cookies</h3>
                        <p className="mt-1 text-sm font-medium leading-6 text-gray-500">Required for cart, checkout, authentication, and account security.</p>
                      </div>
                    </div>
                    <PreferenceToggle enabled={preferences.essential} disabled />
                  </div>

                  <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-950">Analytics Cookies</h3>
                        <p className="mt-1 text-sm font-medium leading-6 text-gray-500">Help us understand browsing behavior and improve product discovery.</p>
                      </div>
                    </div>
                    <PreferenceToggle
                      enabled={preferences.analytics}
                      onClick={() => setPreferences((current) => ({ ...current, analytics: !current.analytics }))}
                    />
                  </div>

                  <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#1a8a4a]">
                        <Megaphone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-950">Marketing Cookies</h3>
                        <p className="mt-1 text-sm font-medium leading-6 text-gray-500">Used to make offers, promotions, and product recommendations more relevant.</p>
                      </div>
                    </div>
                    <PreferenceToggle
                      enabled={preferences.marketing}
                      onClick={() => setPreferences((current) => ({ ...current, marketing: !current.marketing }))}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-white p-6">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1a8a4a] px-6 text-sm font-black text-white shadow-[0_12px_26px_rgba(26,138,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#157a3f] hover:shadow-[0_16px_32px_rgba(26,138,74,0.28)] active:translate-y-0 sm:w-auto"
                  >
                    Save Preferences
                    <ShieldCheck className="h-5 w-5" />
                  </button>
                </div>
              </section>

              <section id="what" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">1. What Are Cookies</h2>
                <p className="mt-4">
                  Cookies are small text files placed on your computer or mobile device when you visit a website. They help websites work efficiently and provide useful information to the site owner.
                </p>
              </section>

              <section id="types" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">2. Types of Cookies We Use</h2>
                <ul className="mt-4 space-y-3">
                  <li><strong className="text-gray-950">Essential Cookies:</strong> Strictly necessary for secure areas, cart, checkout, and account access.</li>
                  <li><strong className="text-gray-950">Analytics Cookies:</strong> Help us understand site usage and improve the shopping experience.</li>
                  <li><strong className="text-gray-950">Marketing Cookies:</strong> Help make promotional messages and product recommendations more relevant.</li>
                </ul>
              </section>

              <section id="management" className="scroll-mt-32 rounded-3xl border border-[#1a8a4a]/10 bg-[#f8fbf9] p-6">
                <h2 className="text-2xl font-black text-gray-950">3. Cookie Management</h2>
                <p className="mt-4">
                  You can accept or reject optional cookies using the preference manager above. You can also update browser settings to control cookies directly.
                </p>
              </section>

              <section id="third" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="text-2xl font-black text-gray-950">4. Third-party Cookies</h2>
                <p className="mt-4">
                  Some cookies may be provided by trusted third parties such as analytics providers, payment services, delivery tools, and social plugins.
                </p>
              </section>

              <section id="updates" className="scroll-mt-32 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-6 w-6 text-[#1a8a4a]" />
                  <div>
                    <h2 className="text-2xl font-black text-gray-950">5. Updates to This Policy</h2>
                    <p className="mt-3">
                      We may update this Cookie Policy to reflect changes in cookies, services, legal requirements, or operational needs. Please review this page regularly.
                    </p>
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
