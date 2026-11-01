import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';

export const metadata: Metadata = {
  title: 'Audio Tools - Audio Converter & Audio Compressor Online',
  description: 'Convert audio files between MP3 and WAV, reduce audio file size, and downsample sample rates privately using Web Audio API.'
};

export default function AudioCategoryPage() {
  const category = CATEGORIES.audio;
  const tools = getToolsByCategory('audio');

  return <CategoryLayout category={category} tools={tools} />;
}
