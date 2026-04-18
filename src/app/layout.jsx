import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kbforex.com'),
  title: {
    default: 'KB Forex | Market Analysis & Trading Strategy',
    template: '%s | KB Forex'
  },
  description: 'Pro-grade forex technical analysis, trading frameworks, and market insights for disciplined traders. No hype, just data.',
  keywords: ['forex', 'trading', 'technical analysis', 'market strategy', 'currency trading', 'trading education'],
  authors: [{ name: 'KB Forex' }],
  creator: 'KB Forex',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kbforex.com',
    siteName: 'KB Forex',
    title: 'KB Forex | Market Analysis & Trading Strategy',
    description: 'Pro-grade forex technical analysis and trading frameworks.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KB Forex',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KB Forex | Market Analysis & Trading Strategy',
    description: 'Pro-grade forex technical analysis and trading frameworks.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
