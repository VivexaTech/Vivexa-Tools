import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Business & Finance Tools - Invoices, Payslips, Quotes & Expenses | Vivexa Tools',
  description:
    'Free invoicing, payroll, and financial tools for small businesses and freelancers. Create GST-compliant invoices, employee salary payslips, project quotations, payment receipts, and manage personal budgets.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/business`,
  },
  openGraph: {
    title: 'Free Business & Finance Tools Online | Vivexa Tools',
    description: 'Generate professional invoices, payslips, receipts, and track expenses privately.',
    url: `${SITE_CONFIG.url}/business`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Business Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Business & Finance Tools Online | Vivexa Tools',
    description: 'Generate professional invoices, payslips, receipts, and track expenses privately.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function BusinessCategoryPage() {
  const category = CATEGORIES.business;
  const tools = getToolsByCategory('business');

  return <CategoryLayout category={category} tools={tools} />;
}
