import Script from 'next/script';

interface StructuredDataProps {
  type?: 'WebApplication' | 'Article' | 'FAQPage';
}

export function StructuredData({ type = 'WebApplication' }: StructuredDataProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ScrollForge - PDF to Website Converter",
    "alternateName": ["ScrollForge PDF Converter", "PDF to HTML Tool", "Online PDF Reader"],
    "url": "https://scroll-forge.vercel.app",
    "description": "Free online PDF to website converter. Transform PDF documents into interactive HTML web pages instantly. No downloads required.",
    "publisher": {
      "@type": "Organization",
      "name": "ScrollForge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://scroll-forge.vercel.app/logo.png",
        "width": 512,
        "height": 512
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://scroll-forge.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/ScrollForge",
      "https://github.com/scrollforge",
      "https://www.youtube.com/@scrollforge"
    ]
  };

  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ScrollForge PDF to Website Converter",
    "description": "Professional PDF to HTML converter tool. Convert PDF files to responsive websites instantly. View and read PDFs online without downloads.",
    "url": "https://scroll-forge.vercel.app",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Works with Chrome, Firefox, Safari, Edge",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert PDF to HTML",
      "PDF to Website Transformation",
      "Online PDF Viewer",
      "No Download Required",
      "Responsive Web Pages",
      "Fast Processing",
      "Secure Document Handling",
      "Multiple Theme Support",
      "Mobile Friendly",
      "Cross-Platform Support"
    ],
    "screenshot": [
      {
        "@type": "ImageObject",
        "url": "https://scroll-forge.vercel.app/screenshot1.png",
        "caption": "PDF Upload Interface"
      },
      {
        "@type": "ImageObject",
        "url": "https://scroll-forge.vercel.app/screenshot2.png",
        "caption": "PDF to Website Conversion"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2543",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I convert PDF to website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply upload your PDF file to ScrollForge, and it will automatically convert it to an interactive HTML website. The process takes just seconds and requires no technical knowledge."
        }
      },
      {
        "@type": "Question",
        "name": "Is ScrollForge PDF converter free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ScrollForge is completely free to use. There are no hidden charges, watermarks, or limitations on the number of PDFs you can convert."
        }
      },
      {
        "@type": "Question",
        "name": "Can I read PDFs online without downloading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! ScrollForge allows you to view and read PDF documents directly in your browser without downloading any software or plugins."
        }
      },
      {
        "@type": "Question",
        "name": "What file formats does ScrollForge support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, ScrollForge supports PDF files. The converted output is in HTML format, making it viewable on any device with a web browser."
        }
      },
      {
        "@type": "Question",
        "name": "Is my PDF secure when using ScrollForge?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we take security seriously. Your PDFs are processed securely, and you receive a unique access token for your documents. Files are not publicly accessible without the token."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert large PDF files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ScrollForge can handle large PDF files. The conversion process is optimized for performance, and files are processed quickly regardless of size."
        }
      },
      {
        "@type": "Question",
        "name": "Does ScrollForge work on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ScrollForge is fully responsive and works on all devices including smartphones, tablets, and desktop computers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I share my converted PDF website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can share your converted documents using the unique access token provided after conversion. Anyone with the token can view the document."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Upload PDF",
        "item": "https://scroll-forge.vercel.app/upload"
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ScrollForge",
    "url": "https://scroll-forge.vercel.app",
    "logo": "https://scroll-forge.vercel.app/logo.png",
    "description": "Leading PDF to website converter tool. Transform your documents into interactive web experiences.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@scrollforge.com",
      "availableLanguage": ["English"]
    }
  };

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}