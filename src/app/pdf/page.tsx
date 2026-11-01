import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';

export const metadata: Metadata = {
  title: 'PDF Tools - Merge, Split, Compress, Convert, & Edit PDF',
  description: 'Free browser-based PDF utilities. Merge PDF, split pages, compress file size, convert to JPG, rotate, watermark, and sign PDF documents locally.'
};

export default function PdfCategoryPage() {
  const category = CATEGORIES.pdf;
  const tools = getToolsByCategory('pdf');

  return <CategoryLayout category={category} tools={tools} />;
}
