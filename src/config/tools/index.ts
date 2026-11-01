import { ToolCategory, ToolDefinition } from '@/types/tools';
import { PDF_TOOLS } from './pdfTools';
import { IMAGE_TOOLS } from './imageTools';
import { AUDIO_TOOLS } from './audioTools';
import { VIDEO_TOOLS } from './videoTools';
import { COLOR_TOOLS } from './colorTools';

export const ALL_TOOLS: ToolDefinition[] = [
  ...PDF_TOOLS,
  ...IMAGE_TOOLS,
  ...AUDIO_TOOLS,
  ...VIDEO_TOOLS,
  ...COLOR_TOOLS,
];

export { PDF_TOOLS, IMAGE_TOOLS, AUDIO_TOOLS, VIDEO_TOOLS, COLOR_TOOLS };

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.isPopular);
}

export function getCategoryToolCount(category: ToolCategory): number {
  return ALL_TOOLS.filter((t) => t.category === category).length;
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const current = getToolBySlug(slug);
  if (!current) return [];

  const explicitRelated = (current.relatedToolSlugs || [])
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolDefinition => !!t);

  if (explicitRelated.length >= 3) {
    return explicitRelated.slice(0, 4);
  }

  // Fallback to same subcategory or category tools
  const categoryFallbacks = ALL_TOOLS.filter(
    (t) => t.slug !== slug && t.category === current.category && !explicitRelated.some((er) => er.id === t.id)
  );

  return [...explicitRelated, ...categoryFallbacks].slice(0, 4);
}

export function searchTools(query: string, category?: ToolCategory): ToolDefinition[] {
  const trimmed = query.trim().toLowerCase();
  let list = category ? getToolsByCategory(category) : ALL_TOOLS;

  if (!trimmed) {
    return list;
  }

  return list.filter((t) => {
    if (t.name.toLowerCase().includes(trimmed)) return true;
    if (t.shortDescription.toLowerCase().includes(trimmed)) return true;
    if (t.subcategory.toLowerCase().includes(trimmed)) return true;
    if (t.searchKeywords.some((k) => k.toLowerCase().includes(trimmed))) return true;
    return false;
  });
}
