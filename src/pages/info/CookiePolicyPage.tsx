import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

export default function CookiePolicyPage() {
  const { success } = useToast();
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false
  });

  const SECTIONS = [
    { id: 'what', title: 'What Are Cookies' },
    { id: 'types', title: 'Types of Cookies We Use' },
    { id: 'management', title: 'Cookie Management' },
    { id: 'third', title: 'Third-party Cookies' },
    { id: 'updates', title: 'Updates to This Policy' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSavePreferences = () => {
    success('Cookie preferences saved successfully!');
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="hidden md:block w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
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
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          
          {/* Cookie Preferences Toggle UI */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Manage Cookie Preferences</h2>
            <p className="text-gray-500 text-sm mb-6">You can customize your cookie preferences below. Essential cookies cannot be disabled as they are required for the website to function.</p>
            
            <div className="space-y-4">
              {/* Essential */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                <div>
                  <h4 className="font-bold text-[#1a1a1a]">Essential Cookies</h4>
                  <p className="text-xs text-gray-500 mt-1">Required for core site functionality.</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1a8a4a] opacity-60 cursor-not-allowed">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                </div>
              </div>
              
              {/* Analytics */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-[#1a1a1a]">Analytics Cookies</h4>
                  <p className="text-xs text-gray-500 mt-1">Help us understand how visitors interact with our site.</p>
                </div>
                <button 
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${preferences.analytics ? 'bg-[#1a8a4a]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.analytics ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-[#1a1a1a]">Marketing Cookies</h4>
                  <p className="text-xs text-gray-500 mt-1">Used to deliver relevant advertisements to you.</p>
                </div>
                <button 
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${preferences.marketing ? 'bg-[#1a8a4a]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <button onClick={handleSavePreferences} className="mt-6 w-full sm:w-auto px-8 py-3 bg-[#1a1a1a] hover:bg-black text-white font-bold rounded-xl transition-all hover:shadow-lg active:scale-95">
              Save Preferences
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-[#1a8a4a] mb-2">Last Updated: October 1, 2026</p>
            <h1 className="text-4xl font-black text-[#1a1a1a] mb-10">Cookie Policy</h1>

            <div className="space-y-12 text-gray-600 leading-relaxed">
              
              <section id="what">
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">1. What Are Cookies</h2>
                <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
              </section>

              <section id="types">
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">2. Types of Cookies We Use</h2>
                <ul className="list-disc pl-5 space-y-4">
                  <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
                  <li><strong>Analytics Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
                  <li><strong>Marketing Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.</li>
                </ul>
              </section>

              <section id="management">
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">3. Cookie Management</h2>
                <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Preferences manager above. Additionally, you can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
              </section>

              <section id="third">
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">4. Third-party Cookies</h2>
                <p>In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.</li>
                  <li>We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways.</li>
                </ul>
              </section>

              <section id="updates">
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">5. Updates to This Policy</h2>
                <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
