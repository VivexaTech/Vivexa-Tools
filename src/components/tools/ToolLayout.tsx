import React from 'react';
import { ToolDefinition } from '@/types/tools';
import { CATEGORIES } from '@/config/categories';
import { getRelatedTools } from '@/config/tools';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { StepInstructions } from '@/components/common/StepInstructions';
import { FaqAccordion } from '@/components/common/FaqAccordion';
import { RelatedToolsList } from '@/components/common/RelatedToolsList';
import { WorkspaceDispatcher } from '@/components/tools/WorkspaceDispatcher';
import { ShieldCheck, Cpu } from 'lucide-react';

interface ToolLayoutProps {
  tool: ToolDefinition;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool }) => {
  const category = CATEGORIES[tool.category];
  const relatedTools = getRelatedTools(tool.slug);

  const breadcrumbs = [
    { label: category.name, href: `/${category.slug}` },
    { label: tool.name }
  ];

  const jsonLdTool = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    operatingSystem: 'All',
    applicationCategory: 'UtilitiesApplication',
    description: tool.fullDescription,
    url: `https://tools.vivexa.com/${tool.category}/${tool.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    creator: {
      '@type': 'Organization',
      name: 'Vivexa Tech',
      url: 'https://www.vivexatech.in/'
    }
  };

  const jsonLdHowTo = tool.instructions && tool.instructions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.name}`,
    description: `Step-by-step instructions for using ${tool.name} online for free.`,
    step: tool.instructions.map((inst) => ({
      '@type': 'HowToStep',
      name: inst.title,
      text: inst.description
    }))
  } : null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTool) }}
      />
      {jsonLdHowTo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Tool Header Section */}
        <div className="mt-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              {tool.subcategory}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>{tool.processingEngine}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {tool.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {tool.fullDescription}
          </p>
        </div>

        {/* Main Interactive Tool Workspace */}
        <div className="relative">
          <WorkspaceDispatcher tool={tool} />
        </div>

        {/* Mandatory Specific Step-by-Step Instructions */}
        <StepInstructions
          toolName={tool.name}
          instructions={tool.instructions}
          limitations={tool.limitations}
        />

        {/* FAQ Section */}
        <FaqAccordion toolName={tool.name} faqs={tool.faqs} />

        {/* Related Tools */}
        <RelatedToolsList tools={relatedTools} />
      </div>
    </div>
  );
};
