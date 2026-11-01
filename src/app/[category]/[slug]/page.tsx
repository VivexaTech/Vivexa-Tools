import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_TOOLS, getToolBySlug } from '@/config/tools';
import { ToolLayout } from '@/components/tools/ToolLayout';

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

  return {
    title: tool.seoTitle || `${tool.name} Online - Free & Private | Vivexa Tools`,
    description: tool.seoDescription || tool.shortDescription,
    keywords: tool.searchKeywords,
    openGraph: {
      title: `${tool.name} Online Free | Vivexa Tools`,
      description: tool.shortDescription,
      type: 'website',
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
