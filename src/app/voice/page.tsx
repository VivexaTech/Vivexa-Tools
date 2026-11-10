import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Voice & Speech Tools - Speech to Text & Text to Speech Online | Vivexa Tools',
  description:
    'Free speech recognition and voice synthesis tools. Transcribe voice dictations into text in real-time, and listen to articles and text read aloud with natural system voices.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/voice`,
  },
  openGraph: {
    title: 'Free Voice & Speech Tools Online | Vivexa Tools',
    description: 'Convert voice speech to text and text to speech privately in your browser.',
    url: `${SITE_CONFIG.url}/voice`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Voice & Speech Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Voice & Speech Tools Online | Vivexa Tools',
    description: 'Convert voice speech to text and text to speech privately in your browser.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function VoiceCategoryPage() {
  const category = CATEGORIES.voice;
  const tools = getToolsByCategory('voice');

  return <CategoryLayout category={category} tools={tools} />;
}
