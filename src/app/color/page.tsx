import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Color Picker Tools - Extract Colors from Image & PDF Online',
  description:
    'Extract HEX, RGB, and HSL color palettes from images and PDF documents directly in your browser. Inspect pixel colors, generate palettes, and copy color codes with one click.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/color`,
  },
  openGraph: {
    title: 'Color Picker Tools Online | Vivexa Tools',
    description: 'Extract HEX, RGB, and HSL color palettes from images and PDF documents.',
    url: `${SITE_CONFIG.url}/color`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Color Picker Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Picker Tools Online | Vivexa Tools',
    description: 'Extract HEX, RGB, and HSL color palettes from images and PDF documents.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function ColorCategoryPage() {
  const category = CATEGORIES.color;
  const tools = getToolsByCategory('color');

  return <CategoryLayout category={category} tools={tools} />;
}
