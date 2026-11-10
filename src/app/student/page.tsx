import type { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { CategoryLayout } from '@/components/category/CategoryLayout';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Student Tools - CGPA to Percentage, Percentage to CGPA & Typing Test | Vivexa Tools',
  description:
    'Free academic and student tools. Convert 10-point CGPA scores to percentage, percentage to 10-point CGPA and US 4.0 GPA, and test typing speed with real-time WPM scorecards.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/student`,
  },
  openGraph: {
    title: 'Free Student Tools Online | Vivexa Tools',
    description: 'Academic grade converters and typing speed test for students and job seekers.',
    url: `${SITE_CONFIG.url}/student`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'Student Tools - Vivexa Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Student Tools Online | Vivexa Tools',
    description: 'Academic grade converters and typing speed test for students and job seekers.',
    images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
  },
};

export default function StudentCategoryPage() {
  const category = CATEGORIES.student;
  const tools = getToolsByCategory('student');

  return <CategoryLayout category={category} tools={tools} />;
}
