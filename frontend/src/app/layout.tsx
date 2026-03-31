import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'FleetAd Network | Premium OOH',
  description: 'Enterprise level vehicle advertising platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-[#050505] text-white min-h-screen flex flex-col`} suppressHydrationWarning>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
