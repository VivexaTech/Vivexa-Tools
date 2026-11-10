import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Developer Tools - JSON Formatter & Code Utilities | Vivexa Tools',
  description:
    'Free client-side developer utilities. Format, beautify, minify, and validate JSON payloads with instant syntax error line and column detection. 100% private in-browser execution.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/developer`,
  },
  openGraph: {
    title: 'Free Developer Tools Online | Vivexa Tools',
    description: 'Format, validate, beautify, and minify JSON with zero server uploads.',
    url: `${SITE_CONFIG.url}/developer`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Developer Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer Tools Online | Vivexa Tools',
    description: 'Format, validate, beautify, and minify JSON with zero server uploads.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function DeveloperCategoryPage() {
  const category = CATEGORIES.developer;
  const tools = getToolsByCategory('developer');

  return <CategoryLayout category={category} tools={tools} />;
}
