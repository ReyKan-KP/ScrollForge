// Comprehensive SEO Keywords Database for ScrollForge
// Organized by category for maximum search visibility

export const SEO_KEYWORDS = {
  // Primary Keywords (Highest Competition, Highest Value)
  primary: [
    'pdf to website converter',
    'pdf to html converter',
    'convert pdf to website',
    'pdf to webpage',
    'online pdf reader',
    'pdf viewer online',
    'pdf to html online',
    'free pdf converter',
  ],

  // Long-tail Keywords (Lower Competition, High Intent)
  longTail: [
    'convert pdf to website online free',
    'pdf to html converter online free no watermark',
    'transform pdf to responsive website',
    'read pdf online without downloading',
    'pdf to website converter no sign up',
    'best free pdf to html converter 2024',
    'convert pdf to mobile friendly website',
    'pdf document to interactive website',
    'bulk pdf to html converter online',
    'pdf to bootstrap website converter',
  ],

  // Feature-based Keywords
  features: [
    'responsive pdf converter',
    'pdf to html5 converter',
    'pdf to css website',
    'pdf viewer no plugin',
    'browser based pdf reader',
    'pdf to web app converter',
    'secure pdf viewer online',
    'fast pdf conversion tool',
    'pdf to website api',
    'pdf embed website tool',
  ],

  // Use Case Keywords
  useCases: [
    'convert pdf portfolio to website',
    'pdf catalog to online store',
    'pdf ebook to web reader',
    'pdf manual to online documentation',
    'pdf presentation to web slides',
    'pdf report to interactive dashboard',
    'pdf newsletter to web page',
    'pdf brochure to landing page',
    'academic pdf to web article',
    'pdf resume to online cv',
  ],

  // Competitor Keywords
  competitor: [
    'better than adobe pdf converter',
    'smallpdf alternative free',
    'ilovepdf competitor',
    'pdf24 alternative online',
    'sejda pdf alternative',
    'pdf candy alternative',
    'soda pdf alternative free',
    'foxit alternative online',
    'nitro pdf alternative',
    'pdfcrowd alternative',
  ],

  // Question-based Keywords (Featured Snippets)
  questions: [
    'how to convert pdf to website',
    'can i turn a pdf into a website',
    'what is the best pdf to html converter',
    'how to read pdf online without downloading',
    'is there a free pdf to website converter',
    'how to embed pdf in website',
    'how to make pdf mobile friendly',
    'why convert pdf to html',
    'which pdf converter has no watermark',
    'how to convert pdf to responsive website',
  ],

  // Location-based Keywords
  locations: [
    'pdf converter usa',
    'pdf to website uk',
    'pdf converter canada',
    'pdf to html australia',
    'pdf converter india',
    'pdf viewer europe',
    'pdf converter singapore',
    'pdf to website dubai',
    'pdf converter germany',
    'pdf reader japan',
  ],

  // Industry-specific Keywords
  industries: [
    'pdf converter for students',
    'pdf to website for teachers',
    'pdf converter for business',
    'pdf viewer for developers',
    'pdf to html for designers',
    'pdf converter for lawyers',
    'pdf reader for researchers',
    'pdf to website for publishers',
    'pdf converter for marketers',
    'pdf viewer for healthcare',
  ],

  // Technical Keywords
  technical: [
    'pdf to html javascript',
    'pdf to react component',
    'pdf to angular website',
    'pdf to vue.js converter',
    'pdf to next.js page',
    'pdf api integration',
    'pdf webhook converter',
    'pdf rest api tool',
    'pdf graphql converter',
    'pdf to json converter',
  ],

  // Action Keywords (High Intent)
  actions: [
    'upload pdf to convert',
    'drag drop pdf converter',
    'batch convert pdf files',
    'download converted html',
    'share pdf as website',
    'embed pdf in blog',
    'publish pdf online',
    'host pdf as website',
    'stream pdf content',
    'display pdf on web',
  ],

  // Branded Keywords
  branded: [
    'scrollforge pdf converter',
    'scrollforge pdf to website',
    'scrollforge online reader',
    'scrollforge pdf viewer',
    'scrollforge document converter',
    'scrollforge.com',
    'scroll forge app',
    'scrollforge tool',
    'scrollforge platform',
    'scrollforge service',
  ],

  // Semantic Keywords (LSI)
  semantic: [
    'document conversion',
    'file transformation',
    'digital publishing',
    'web publishing tool',
    'content migration',
    'document digitization',
    'paperless solution',
    'cloud document viewer',
    'online file converter',
    'document management system',
  ],

  // Trending Keywords (2024)
  trending: [
    'ai pdf converter',
    'smart pdf to website',
    'automated pdf conversion',
    'no code pdf converter',
    'instant pdf transformation',
    'real-time pdf viewer',
    'collaborative pdf reader',
    'cloud pdf converter',
    'serverless pdf tool',
    'pwa pdf reader',
  ],

  // Negative Keywords (For PPC)
  negative: [
    'download software',
    'desktop application',
    'paid tool',
    'premium only',
    'subscription required',
    'install plugin',
    'windows only',
    'mac only',
    'offline tool',
    'licensed software',
  ],
};

// Generate meta keywords string
export function generateMetaKeywords(categories: (keyof typeof SEO_KEYWORDS)[] = ['primary', 'longTail', 'features']): string {
  const keywords: string[] = [];
  
  categories.forEach(category => {
    if (SEO_KEYWORDS[category]) {
      keywords.push(...SEO_KEYWORDS[category]);
    }
  });
  
  return keywords.join(', ');
}

// Generate title variations for A/B testing
export function generateTitleVariations(baseTitle: string): string[] {
  return [
    `${baseTitle} - Free Online Tool 2024`,
    `Best ${baseTitle} | No Sign Up Required`,
    `${baseTitle} ⚡ Instant & Free`,
    `#1 ${baseTitle} - 100% Free`,
    `${baseTitle} | Fast, Free, Secure`,
    `Professional ${baseTitle} Online`,
    `${baseTitle} - No Downloads Needed`,
    `${baseTitle} | Works on All Devices`,
  ];
}

// Generate description variations
export function generateDescriptionVariations(baseDesc: string): string[] {
  return [
    `${baseDesc} ⭐ Rated 4.9/5 by 100,000+ users.`,
    `${baseDesc} 🚀 Instant conversion, no sign-up required.`,
    `${baseDesc} ✅ 100% free, no watermarks, unlimited use.`,
    `${baseDesc} 🔒 Secure & private. Your files are protected.`,
    `${baseDesc} 📱 Works on all devices - mobile, tablet, desktop.`,
  ];
}