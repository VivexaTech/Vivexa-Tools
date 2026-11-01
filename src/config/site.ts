/**
 * Official Site Configuration & SEO Metadata
 * Domain: https://tools.vivexatech.in/
 */

export const SITE_CONFIG = {
  name: 'Vivexa Tools',
  shortName: 'VivexaTools',
  description:
    'Free online tools to convert, compress, edit, and organize files with 100% in-browser privacy. Fast PDF tools, image compressors, passport photo maker, video trimmer, audio converter, and color picker.',
  url: 'https://tools.vivexatech.in',
  ogImage: 'https://tools.vivexatech.in/favicon-512x512.png',
  creator: 'Vivexa Tech',
  creatorUrl: 'https://www.vivexatech.in/',
  locale: 'en_US',
  keywords: [
    'vivexa tools',
    'vivexa tech tools',
    'online file tools',
    'free pdf tools',
    'merge pdf online',
    'pdf to word converter',
    'word to pdf',
    'compress pdf online',
    'passport photo maker',
    'compress image online',
    'image resizer',
    'ocr text extractor',
    'audio format converter',
    'video trimmer online',
    'color picker from image',
    'private file tools',
    'client side document processing',
    'free productivity utilities'
  ],
  links: {
    website: 'https://tools.vivexatech.in',
    organization: 'https://www.vivexatech.in/',
    sitemap: 'https://tools.vivexatech.in/sitemap.xml',
  },
};

/**
 * Returns an absolute canonical URL for a path
 */
export function absoluteUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath === '/' ? '' : cleanPath}`;
}
