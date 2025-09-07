import Head from 'next/head';
import Script from 'next/script';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'video';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
}

export function AdvancedSEO({
  title = 'ScrollForge - Best Free PDF to Website Converter Online 2024 | PDF to HTML Tool',
  description = 'Convert PDF to website instantly FREE. #1 PDF to HTML converter, PDF viewer online, PDF reader no download. Transform PDFs to responsive websites. Used by 100,000+ users. ⭐ 4.9/5 rating.',
  keywords = 'pdf to website converter, pdf to html online, pdf to webpage, convert pdf to website free, pdf to html converter, online pdf reader, pdf viewer online, pdf to website builder, pdf to html online free, transform pdf to web, pdf to interactive website, pdf to responsive html, pdf web viewer, pdf to html5, pdf converter online, web based pdf reader, pdf document viewer, pdf to site converter, free pdf converter, pdf tools online, pdf to web page converter, digital document reader, pdf file viewer, pdf to webpage online, read pdf online without download, pdf reader browser, pdf transformation tool, pdf to website online tool, pdf html converter free, online document converter, pdf web converter, pdf to website generator, pdf to html generator, pdf website maker, pdf page converter, pdf document to website, pdf file to html, pdf to web app, pdf to mobile website, pdf to responsive website, pdf embed website, pdf display website, pdf viewer website, pdf reader website, pdf online tool, pdf web tool, pdf conversion tool, pdf processing tool, pdf editing online, pdf management tool, pdf solution online, pdf service free, pdf application online, pdf software online, pdf platform free, pdf technology, pdf innovation, pdf transformation, pdf digitization, pdf modernization, pdf optimization, pdf enhancement, pdf improvement, pdf upgrade, pdf evolution',
  url = 'https://scroll-forge.vercel.app',
  image = '/og-image-main.png',
  type = 'website',
  author = 'ReyKan-KP (Kanishaka Pranjal)',
  locale = 'en_US',
  alternateLocales = ['en_GB', 'en_CA', 'en_AU', 'en_IN'],
  ...props
}: AdvancedSEOProps) {
  const fullTitle = `${title} | ScrollForge`;
  const siteName = 'ScrollForge - PDF to Website Converter';
  
  return (
    <>
      <Head>
        {/* Essential Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Canonical and Alternate URLs */}
        <link rel="canonical" href={url} />
        {alternateLocales?.map(locale => (
          <link key={locale} rel="alternate" hrefLang={locale} href={`${url}?lang=${locale}`} />
        ))}
        <link rel="alternate" type="application/rss+xml" title="ScrollForge RSS Feed" href="/rss.xml" />
        
        {/* Open Graph Meta Tags - Extended */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locale} />
        {alternateLocales?.map(locale => (
          <meta key={locale} property="og:locale:alternate" content={locale} />
        ))}
        <meta property="og:image" content={image} />
        <meta property="og:image:secure_url" content={image} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:video" content="https://scroll-forge.vercel.app/demo.mp4" />
        <meta property="og:audio" content="https://scroll-forge.vercel.app/intro.mp3" />
        
        {/* Twitter Card Meta Tags - Extended */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ScrollForge" />
        <meta name="twitter:creator" content="@ReyKan_KP" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:alt" content={title} />
        <meta name="twitter:domain" content="scroll-forge.vercel.app" />
        
        {/* Article Specific */}
        {type === 'article' && (
          <>
            <meta property="article:author" content={author} />
            <meta property="article:published_time" content={props.publishedTime} />
            <meta property="article:modified_time" content={props.modifiedTime} />
            <meta property="article:section" content={props.section} />
            {props.tags?.map(tag => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="Worldwide" />
        <meta name="page-topic" content="PDF Conversion, Document Management" />
        <meta name="page-type" content="Software Download" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Apple Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ScrollForge" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Microsoft Specific */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msvalidate.01" content="verification_code" />
        
        {/* Pinterest */}
        <meta name="p:domain_verify" content="pinterest_verification_code" />
        
        {/* Yandex */}
        <meta name="yandex-verification" content="yandex_verification_code" />
        
        {/* Baidu */}
        <meta name="baidu-site-verification" content="baidu_verification_code" />
        
        {/* Norton Safe Web */}
        <meta name="norton-safeweb-site-verification" content="norton_verification_code" />
        
        {/* Alexa */}
        <meta name="alexaVerifyID" content="alexa_verification_code" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content={fullTitle} />
        <meta name="DC.creator" content={author} />
        <meta name="DC.subject" content={keywords} />
        <meta name="DC.description" content={description} />
        <meta name="DC.publisher" content="ScrollForge" />
        <meta name="DC.contributor" content={author} />
        <meta name="DC.date" content={new Date().toISOString()} />
        <meta name="DC.type" content="Software" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content={url} />
        <meta name="DC.language" content="en" />
        <meta name="DC.coverage" content="Global" />
        <meta name="DC.rights" content="MIT License" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="37.7749;-122.4194" />
        <meta name="ICBM" content="37.7749, -122.4194" />
        
        {/* Security */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        
        {/* Preconnect and DNS Prefetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        
        {/* Prefetch and Preload */}
        <link rel="prefetch" href="/upload" />
        <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="" />
        
        {/* Favicon variations */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      </Head>
      
      {/* Rich Snippets and Structured Data */}
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url,
            "url": url,
            "name": title,
            "description": description,
            "publisher": {
              "@type": "Organization",
              "name": "ScrollForge",
              "logo": {
                "@type": "ImageObject",
                "url": "https://scroll-forge.vercel.app/logo.png"
              }
            },
            "inLanguage": "en-US",
            "potentialAction": {
              "@type": "ReadAction",
              "target": [url]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://scroll-forge.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": title,
                  "item": url
                }
              ]
            }
          })
        }}
      />
    </>
  );
}