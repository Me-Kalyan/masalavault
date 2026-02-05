import type { Metadata } from 'next';
import './globals.css';
import SiteLayout from '@/components/site/SiteLayout';

export const metadata: Metadata = {
  title: 'MasalaVault Rebuilt',
  description: 'A full-ground redesign of MasalaVault with a new visual system and simplified experience.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
