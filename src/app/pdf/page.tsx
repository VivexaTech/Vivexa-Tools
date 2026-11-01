import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'PDF Tools - Merge, Split, Compress, Convert, & Edit PDF Online',
  description:
    'Free browser-based PDF utilities. Merge PDF, split pages, compress file size, convert to Word (.docx), rotate, watermark, and sign PDF documents locally with 100% privacy.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/pdf`,
  },
  openGraph: {
    title: 'Free PDF Tools Online | Vivexa Tools',
    description: 'Merge, split, compress, convert, and sign PDF documents privately in your browser.',
    url: `${SITE_CONFIG.url}/pdf`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'PDF Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Tools Online | Vivexa Tools',
    description: 'Merge, split, compress, and convert PDF documents privately in your browser.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function PdfCategoryPage() {
  const category = CATEGORIES.pdf;
  const tools = getToolsByCategory('pdf');

  return <CategoryLayout category={category} tools={tools} />;
}
