import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Audio Tools - Audio Converter & Audio Compressor Online',
  description:
    'Convert audio files between MP3 and WAV, reduce audio file size, and downsample sample rates privately using Web Audio API in your browser.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/audio`,
  },
  openGraph: {
    title: 'Free Audio Tools Online | Vivexa Tools',
    description: 'Convert and compress audio files privately in your browser.',
    url: `${SITE_CONFIG.url}/audio`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Audio Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Audio Tools Online | Vivexa Tools',
    description: 'Convert and compress audio files privately in your browser.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function AudioCategoryPage() {
  const category = CATEGORIES.audio;
  const tools = getToolsByCategory('audio');

  return <CategoryLayout category={category} tools={tools} />;
}
