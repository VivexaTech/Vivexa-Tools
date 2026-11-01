import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Video Tools - Video Trimmer, Splitter, & Compressor Online',
  description:
    'Trim video clips, split video into chapters, and compress MP4 video files locally using HTML5 canvas and MediaRecorder with 100% in-browser privacy.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/video`,
  },
  openGraph: {
    title: 'Free Video Tools Online | Vivexa Tools',
    description: 'Trim, split, and compress video clips locally in your browser.',
    url: `${SITE_CONFIG.url}/video`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Video Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Video Tools Online | Vivexa Tools',
    description: 'Trim, split, and compress video clips locally in your browser.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function VideoCategoryPage() {
  const category = CATEGORIES.video;
  const tools = getToolsByCategory('video');

  return <CategoryLayout category={category} tools={tools} />;
}
