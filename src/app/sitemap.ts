import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scroll-forge.vercel.app';
  const currentDate = new Date().toISOString();

  // Main pages with highest priority
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/load-previous`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Feature pages
  const featurePages = [
    '/features',
    '/features/pdf-to-html',
    '/features/pdf-viewer',
    '/features/document-reader',
    '/features/file-converter',
    '/features/online-tools',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Documentation and help pages
  const docPages = [
    '/docs',
    '/docs/getting-started',
    '/docs/api',
    '/docs/faq',
    '/help',
    '/help/how-to-convert',
    '/help/troubleshooting',
    '/tutorials',
    '/tutorials/convert-pdf-to-website',
    '/tutorials/read-pdf-online',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Legal and policy pages
  const legalPages = [
    '/privacy',
    '/terms',
    '/cookies',
    '/disclaimer',
    '/accessibility',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  // About and contact pages
  const aboutPages = [
    '/about',
    '/contact',
    '/team',
    '/careers',
    '/press',
    '/partners',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Blog/News pages (if you have them)
  const blogPages = [
    '/blog',
    '/blog/pdf-conversion-tips',
    '/blog/document-management',
    '/blog/web-development',
    '/news',
    '/updates',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Use case pages for SEO
  const useCasePages = [
    '/use-cases',
    '/use-cases/students',
    '/use-cases/teachers',
    '/use-cases/business',
    '/use-cases/developers',
    '/use-cases/researchers',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Comparison pages for SEO
  const comparisonPages = [
    '/compare',
    '/compare/vs-adobe',
    '/compare/vs-smallpdf',
    '/compare/vs-ilovepdf',
    '/alternatives',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Language variants
  const languages = ['es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
  const languagePages = languages.flatMap(lang => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/upload`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]);

  return [
    ...mainPages,
    ...featurePages,
    ...docPages,
    ...legalPages,
    ...aboutPages,
    ...blogPages,
    ...useCasePages,
    ...comparisonPages,
    ...languagePages,
  ];
}