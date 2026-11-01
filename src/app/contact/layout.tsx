import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact & Feedback | Vivexa Tools',
  description:
    'Get in touch with the Vivexa Tools team at Vivexa Tech. Share feature requests, suggest new online tools, or report issues.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: 'Contact & Feedback | Vivexa Tools',
    description: 'Share feedback or request new tools with the Vivexa Tools development team.',
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Contact Vivexa Tools' }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
