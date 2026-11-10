import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'QR & Barcode Tools - Generator & Scanner Online | Vivexa Tools',
  description:
    'Generate custom scannable QR codes for links, Wi-Fi, and text, decode QR codes from photos and webcams, and create standard retail Code 128, EAN-13, and UPC barcodes.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/qr-barcode`,
  },
  openGraph: {
    title: 'Free QR & Barcode Tools Online | Vivexa Tools',
    description: 'Create and scan QR codes and retail barcodes privately in your browser.',
    url: `${SITE_CONFIG.url}/qr-barcode`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'QR & Barcode Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free QR & Barcode Tools Online | Vivexa Tools',
    description: 'Create and scan QR codes and retail barcodes privately in your browser.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function QrBarcodeCategoryPage() {
  const category = CATEGORIES['qr-barcode'];
  const tools = getToolsByCategory('qr-barcode');

  return <CategoryLayout category={category} tools={tools} />;
}
