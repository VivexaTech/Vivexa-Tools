import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';

export const metadata: Metadata = {
  title: 'Video Tools - Video Trimmer, Splitter & Compressor Online',
  description: 'Trim, cut, split, and compress video files locally in your browser. Hardware accelerated with no server uploads.'
};

export default function VideoCategoryPage() {
  const category = CATEGORIES.video;
  const tools = getToolsByCategory('video');

  return <CategoryLayout category={category} tools={tools} />;
}
