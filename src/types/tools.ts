export type ToolCategory =
  | 'pdf'
  | 'image'
  | 'audio'
  | 'video'
  | 'color'
  | 'qr-barcode'
  | 'calculator'
  | 'developer'
  | 'voice'
  | 'student'
  | 'business'
  | 'document';

export type ToolStatus = 'available' | 'experimental' | 'unsupported';

export interface ToolInstruction {
  step: number;
  title: string;
  description: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolPreset {
  label: string;
  value: any;
  description?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  subcategory: string;
  shortDescription: string;
  fullDescription: string;
  searchKeywords: string[];
  icon: string;
  supportedInputFormats: string[];
  supportedOutputFormats: string[];
  processingEngine: string;
  status: ToolStatus;
  statusReason?: string;
  isPopular?: boolean;
  instructions: ToolInstruction[];
  faqs: ToolFaq[];
  relatedToolSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  features?: string[];
  limitations?: string[];
  presets?: ToolPreset[];
}

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  badge: string;
  subcategories: string[];
}
