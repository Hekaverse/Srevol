

export const metadata = {
  title: "Privacy Policy — SREVOL",
  description: "How SREVOL collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-warm-white mb-8">Privacy Policy</h1>
          <p className="text-sm text-warm-white/30 mb-12">Last updated: May 2026</p>

          <div className="space-y-8 text-warm-white/60 leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including your name, email address, co-traveler&apos;s email address, password, route preferences, and contribution information. We also collect usage data and cookies to improve your visit.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">2. How We Use Your Information</h2>
              <p>We use your information to provide and improve our services, process contributions, communicate with you about your reservations, send marketing communications (with your consent), and comply with legal obligations.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">3. Data Sharing</h2>
              <p>We do not sell your personal data. We share data only with trusted service providers (contribution processors, route partners) who need it to perform services on our behalf, and when required by law.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">4. Data Retention</h2>
              <p>We retain your personal data for as long as your profile is active or as needed to provide services. You may request deletion of your profile and associated data at any time.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">5. Your Rights (GDPR)</h2>
              <p>If you are in the EU, you have the right to access, correct, delete, or port your data. You may also object to processing or request restriction. Contact us at privacy@srevol.com to exercise these rights.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">6. Security</h2>
              <p>We use industry-standard security measures including encryption, secure servers, and regular security audits. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">7. Contact Us</h2>
              <p>For privacy-related questions, contact us at privacy@srevol.com.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
