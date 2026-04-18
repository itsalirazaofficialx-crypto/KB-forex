'use client';

import ReaderLayout from "@/components/ReaderLayout";

export default function TermsOfUse() {
  return (
    <ReaderLayout>
      <div className="py-16 md:py-24 font-body">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="section-label mb-4 text-accent">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-foreground mb-3">Terms of Use</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: April 2026</p>

          <div className="prose-trading">
            <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              By accessing or using the KBForex website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this site.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use of Content</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              All content on KBForex — including articles, guides, analysis, and newsletter content — is the intellectual property of KBForex. You may:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/70">
              <li>Read and share articles with attribution and a link back to the original.</li>
              <li>Quote short excerpts for editorial or educational purposes.</li>
            </ul>
            <p className="mb-4 text-foreground/70 leading-relaxed">You may not reproduce or republish articles in full without written permission.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">No Financial Advice</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              Nothing on this site constitutes financial advice. See our full <a href="/disclaimer" className="text-accent hover:underline">Disclaimer</a> for details.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">User Conduct</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">When using this site, you agree not to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/70">
              <li>Attempt to disrupt, hack, or interfere with the website.</li>
              <li>Use the site for any unlawful purpose.</li>
              <li>Scrape or reproduce content at scale without permission.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Newsletter</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              By subscribing to the KBForex newsletter, you consent to receive periodic emails from us. You can unsubscribe at any time. See our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> for how we handle your data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              KBForex is provided "as is" without warranties of any kind. We are not liable for any losses, direct or indirect, arising from your use of this site or reliance on any content published here.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              We may update these terms at any time. Continued use of the site after changes are published constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Governing Law</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              These terms are governed by applicable law. Any disputes will be handled in the appropriate jurisdiction.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              Questions about these terms? <a href="/contact" className="text-accent hover:underline">Contact us.</a>
            </p>
          </div>
        </div>
      </div>
    </ReaderLayout>
  );
}
