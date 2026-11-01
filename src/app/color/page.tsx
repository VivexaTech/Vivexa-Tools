import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';

export const metadata: Metadata = {
  title: 'Color Picker Tools - Extract Colors from Image & PDF Online',
  description: 'Inspect pixels, extract color palettes, and copy HEX, RGB, RGBA, and HSL codes with 8x magnifying loupe from images and PDF documents.'
};

export default function ColorCategoryPage() {
  const category = CATEGORIES.color;
  const tools = getToolsByCategory('color');

  return <CategoryLayout category={category} tools={tools} />;
}
