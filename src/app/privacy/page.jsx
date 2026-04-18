'use client';

import ReaderLayout from "@/components/ReaderLayout";

export default function PrivacyPolicy() {
  return (
    <ReaderLayout>
      <div className="py-16 md:py-24 font-body">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="section-label mb-4 text-accent">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: April 2026</p>

          <div className="prose-trading">
            <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              KBForex ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">We collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/70">
              <li><strong>Email address</strong> — when you subscribe to our newsletter.</li>
              <li><strong>Name and email</strong> — when you submit a contact form.</li>
              <li><strong>Usage data</strong> — anonymised analytics such as page views, referring URLs, and device type. We do not use cookies that track you across other websites.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/70">
              <li>To send our weekly newsletter (only if you subscribed).</li>
              <li>To respond to contact form submissions.</li>
              <li>To understand how our content is performing and improve the site.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Newsletter</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              When you subscribe to our newsletter, we store your email address to send you regular updates. You can unsubscribe at any time by clicking the "Unsubscribe" link in any email we send, or by contacting us directly.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Data Sharing</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may use trusted third-party service providers (e.g. email delivery services) who are contractually bound to handle data in accordance with this policy.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Data Retention</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              We retain newsletter subscriber emails for as long as you remain subscribed. Contact form submissions are retained for up to 12 months, then deleted.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/70">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Withdraw consent at any time (e.g. unsubscribe from the newsletter).</li>
            </ul>
            <p className="mb-4 text-foreground/70 leading-relaxed">To exercise any of these rights, please <a href="/contact" className="text-accent hover:underline">contact us</a>.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Security</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              We take reasonable technical and organisational measures to protect your personal information. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Policy</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated date.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              If you have any questions about this Privacy Policy, please <a href="/contact" className="text-accent hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </ReaderLayout>
  );
}
