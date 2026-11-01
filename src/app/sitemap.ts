import { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@/config/tools';
import { CATEGORY_LIST } from '@/config/categories';
import { SITE_CONFIG } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const lastMod = new Date('2026-11-01');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LIST.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: lastMod,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const toolRoutes: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${baseUrl}/${tool.category}/${tool.slug}`,
    lastModified: lastMod,
    changeFrequency: 'weekly',
    priority: tool.isPopular ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
