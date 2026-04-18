'use client';

import ReaderLayout from "@/components/ReaderLayout";

export default function Disclaimer() {
  return (
    <ReaderLayout>
      <div className="py-16 md:py-24 font-body">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="section-label mb-4 text-accent">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-foreground mb-3">Disclaimer</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: April 2026</p>

          <div className="prose-trading">
            <h2 className="text-2xl font-bold mt-8 mb-4">General Information Only</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              The content published on KBForex — including articles, analysis, trade setups, educational guides, and newsletter editions — is provided for informational and educational purposes only. Nothing on this site constitutes financial advice, investment advice, or a recommendation to buy or sell any financial instrument.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">No Financial Advice</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              KBForex is not a licensed financial advisor, investment manager, or regulated financial service. You should not rely on anything published here as a basis for making investment or trading decisions. Always consult a qualified financial advisor before making any financial decisions.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Risk Warning</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              Trading foreign exchange, contracts for difference (CFDs), and other leveraged products carries a high level of risk and may not be suitable for all investors. The high degree of leverage available in these markets can work against you as well as for you. Before deciding to trade, carefully consider your investment objectives, level of experience, and risk appetite.
            </p>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              You may sustain a loss of some or all of your invested capital. Do not trade with money you cannot afford to lose.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Past Performance</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              Any reference to past performance — whether in articles, trade reviews, or case studies — does not guarantee future results. Markets change, and historical results are not indicative of future performance.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Links</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              KBForex may contain links to third-party websites. We do not endorse or accept responsibility for the content, privacy policies, or practices of any third-party sites.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Accuracy of Information</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              We make every effort to ensure accuracy and timeliness of the content published. However, market conditions can change rapidly and information may become outdated. KBForex accepts no liability for errors, omissions, or inaccuracies in the content.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="mb-4 text-foreground/70 leading-relaxed">
              If you have any questions about this disclaimer, please <a href="/contact" className="text-accent hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </ReaderLayout>
  );
}
