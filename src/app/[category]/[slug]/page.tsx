import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_TOOLS, getToolBySlug } from '@/config/tools';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SITE_CONFIG } from '@/config/site';

interface ToolPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Vivexa Tools',
    };
  }

  const path = `/${tool.category}/${tool.slug}`;
  const canonicalUrl = `${SITE_CONFIG.url}${path}`;
  const title = tool.seoTitle || `${tool.name} Online - Free & Private | Vivexa Tools`;
  const description = tool.seoDescription || tool.shortDescription;

  return {
    title,
    description,
    keywords: tool.searchKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: [`${SITE_CONFIG.url}/favicon-512x512.png`],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolLayout tool={tool} />;
}
