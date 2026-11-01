import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Image Tools - Compress to KB, Passport Photo Maker, Resizer, & OCR',
  description:
    'Fast, client-side image editing tools. Compress photos to exact KB targets (20KB, 50KB, 100KB), create printable passport photo sheets, resize by cm/mm/pixels, and extract text privately.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/image`,
  },
  openGraph: {
    title: 'Free Image Tools & Passport Photo Maker | Vivexa Tools',
    description: 'Compress images, create passport photos, resize for government exams, and run OCR privately.',
    url: `${SITE_CONFIG.url}/image`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Image Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Tools & Passport Photo Maker | Vivexa Tools',
    description: 'Compress images, create passport photos, and resize photos privately.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function ImageCategoryPage() {
  const category = CATEGORIES.image;
  const tools = getToolsByCategory('image');

  return <CategoryLayout category={category} tools={tools} />;
}
