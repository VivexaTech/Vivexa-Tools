import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Online Calculators & Converters - Age, EMI, GST, Units & Currency | Vivexa Tools',
  description:
    'Free online calculation utilities. Calculate chronological age down to the second, forecast home and car loan EMIs with amortization schedules, calculate GST taxes, convert units, and check currency conversions.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/calculator`,
  },
  openGraph: {
    title: 'Free Online Calculators & Converters | Vivexa Tools',
    description: 'Precision calculators for age, loan EMI, GST taxes, unit measurements, and currency exchange.',
    url: `${SITE_CONFIG.url}/calculator`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Calculators - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Calculators & Converters | Vivexa Tools',
    description: 'Precision calculators for age, loan EMI, GST taxes, unit measurements, and currency exchange.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function CalculatorCategoryPage() {
  const category = CATEGORIES.calculator;
  const tools = getToolsByCategory('calculator');

  return <CategoryLayout category={category} tools={tools} />;
}
