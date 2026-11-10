import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/config/tools';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SITE_CONFIG } from '@/config/site';

const SLUG = 'cgpa-to-percentage';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolBySlug(SLUG);
  if (!tool) return { title: 'Tool Not Found' };
  const canonicalUrl = `${SITE_CONFIG.url}/${tool.category}/${tool.slug}`;
  return {
    title: tool.seoTitle || `${tool.name} - Free & Private | Vivexa Tools`,
    description: tool.seoDescription || tool.shortDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.seoTitle || `${tool.name} - Free & Private | Vivexa Tools`,
      description: tool.seoDescription || tool.shortDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.url}/favicon-512x512.png`,
          width: 512,
          height: 512,
          alt: `${tool.name} - ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seoTitle || `${tool.name} - Free & Private | Vivexa Tools`,
      description: tool.seoDescription || tool.shortDescription,
      images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
    },
  };
}

export default function DirectToolPage() {
  const tool = getToolBySlug(SLUG);
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
