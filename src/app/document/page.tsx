import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Documents & Design Tools - Resumes, Photo Collages & Privacy ID OCR | Vivexa Tools',
  description:
    'Free creative and document utilities. Build ATS-compliant resumes with instant PDF export, design photo collages with customizable borders and grids, and extract details from PAN and Aadhaar identity cards locally.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/document`,
  },
  openGraph: {
    title: 'Free Documents & Design Tools Online | Vivexa Tools',
    description: 'Build resumes, create photo collages, and extract document details privately.',
    url: `${SITE_CONFIG.url}/document`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Documents & Design - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Documents & Design Tools Online | Vivexa Tools',
    description: 'Build resumes, create photo collages, and extract document details privately.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function DocumentCategoryPage() {
  const category = CATEGORIES.document;
  const tools = getToolsByCategory('document');

  return <CategoryLayout category={category} tools={tools} />;
}
