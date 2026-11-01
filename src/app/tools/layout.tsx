import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'All Online Tools Directory (56 Free Utilities)',
  description:
    'Browse all 56 free online tools for PDF editing, image conversion, passport photo creation, video trimming, audio compression, and color picking with 100% in-browser privacy.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools`,
  },
  openGraph: {
    title: 'All Online Tools Directory | Vivexa Tools',
    description: 'Explore 56 free browser-based tools for PDF, images, audio, video, and color picking.',
    url: `${SITE_CONFIG.url}/tools`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Vivexa Tools Directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Online Tools Directory | Vivexa Tools',
    description: 'Explore 56 free browser-based tools with 100% in-browser privacy.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
