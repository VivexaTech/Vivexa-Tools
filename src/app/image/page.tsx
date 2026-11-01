import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';

export const metadata: Metadata = {
  title: 'Image Tools - Compress to KB, Passport Photo, Resizer, & OCR',
  description: 'Fast, client-side image editing tools. Compress to exact KB targets, create passport photos with white/blue background, resize by cm/mm/pixels, and extract text.'
};

export default function ImageCategoryPage() {
  const category = CATEGORIES.image;
  const tools = getToolsByCategory('image');

  return <CategoryLayout category={category} tools={tools} />;
}
