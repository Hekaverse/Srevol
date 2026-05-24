

export const metadata = {
  title: "Terms of Service — SREVOL",
  description: "Terms and conditions for using the SREVOL private carrier experience.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-warm-white mb-8">Terms of Service</h1>
          <p className="text-sm text-warm-white/30 mb-12">Last updated: May 2026</p>

          <div className="space-y-8 text-warm-white/60 leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using SREVOL, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">2. Eligibility</h2>
              <p>You must be at least 18 years old to use SREVOL. By using our services, you represent that you meet this requirement.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">3. Account Registration</h2>
              <p>You are responsible for maintaining the confidentiality of your profile credentials and for all activities under your profile. Notify us immediately of any unauthorized use.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">4. Fare Commitments</h2>
              <p>SREVOL offers fare commitments for travel routes. Monthly contributions are non-refundable but may be converted to future travel credit. Full terms of each fare commitment are provided at checkout.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">5. Rebooking & Refunds</h2>
              <p>You may rebook your fare commitment at any time. Amounts contributed will be converted to future travel credit minus a 5% rebooking fee. Refunds to original contribution methods are available within 14 days of first contribution.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">6. Fare Lock Guarantee</h2>
              <p>Your reservation includes a fare lock buffer. If final booking prices exceed your locked fare, you may choose to adjust your route or receive future travel credit for the difference.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">7. Limitation of Liability</h2>
              <p>SREVOL is not liable for carrier disruptions, cancellations by third-party providers, or force majeure events. Our maximum liability is limited to amounts contributed by you.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">8. Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-3">9. Contact</h2>
              <p>For questions about these terms, contact us at legal@srevol.com.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
