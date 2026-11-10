import { ToolDefinition } from '@/types/tools';

export const DEVELOPER_TOOLS: ToolDefinition[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'developer',
    subcategory: 'JSON Tools',
    shortDescription: 'Format, beautify, validate, and minify JSON data with line-by-line syntax error detection.',
    fullDescription: 'A developer-friendly client-side JSON editor and beautifier. Indent ugly, minified JSON with 2-space, 4-space, or tab formatting; minify JSON for compact network payloads; remove escape slashes; detect syntax error positions with exact line and column numbers; and export clean .json files with zero server communication.',
    searchKeywords: ['json formatter', 'json beautifier', 'validate json', 'json validator', 'minify json', 'json pretty print'],
    icon: 'Code2',
    supportedInputFormats: ['.json', 'Raw JSON String', 'Pasted Text'],
    supportedOutputFormats: ['.json', 'Formatted Text'],
    processingEngine: 'Browser Native JSON Parser with AST Syntax Diagnostics',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Paste or Upload JSON',
        description: 'Paste your JSON payload into the editor or upload an existing .json document.'
      },
      {
        step: 2,
        title: 'Choose Indentation or Minify',
        description: 'Click "Beautify 2 Spaces", "Beautify 4 Spaces", or "Minify" for single-line compression.'
      },
      {
        step: 3,
        title: 'Inspect Syntax Validation',
        description: 'If the JSON is invalid, the validator pinpoints the exact line, column, and error explanation.'
      },
      {
        step: 4,
        title: 'Copy or Download',
        description: 'Copy the valid JSON to your clipboard or download a clean .json file directly.'
      }
    ],
    faqs: [
      {
        question: 'Is my confidential JSON data uploaded to any server?',
        answer: 'Never. Parsing and formatting take place purely inside your browser\'s local JavaScript engine.'
      },
      {
        question: 'Can this tool fix trailing commas or single quotes?',
        answer: 'The validator identifies invalid JSON syntax such as unquoted keys or trailing commas and guides you on correcting them.'
      }
    ],
    relatedToolSlugs: ['unit-converter', 'document-details-extractor', 'qr-code-generator'],
    seoTitle: 'Free JSON Formatter & Validator Online - Beautify & Minify JSON | Vivexa Tools',
    seoDescription: 'Format, beautify, validate, and minify JSON online with instant line-number error detection. 100% private and client-side.'
  }
];
