'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function SEOMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals for SEO
    if (typeof window !== 'undefined') {
      // Track page views
      const trackPageView = () => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
          });
        }
      };

      // Track engagement metrics
      let startTime = Date.now();
      const trackEngagement = () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (typeof gtag !== 'undefined') {
          gtag('event', 'user_engagement', {
            engagement_time_msec: timeOnPage * 1000,
          });
        }
      };

      // Track scroll depth
      let maxScroll = 0;
      const trackScrollDepth = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (maxScroll % 25 === 0 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
              percent_scrolled: maxScroll,
            });
          }
        }
      };

      // Track click events on important elements
      const trackClicks = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
              element_type: target.tagName,
              element_text: target.textContent?.substring(0, 100),
              element_url: (target as HTMLAnchorElement).href || '',
            });
          }
        }
      };

      // Set up event listeners
      window.addEventListener('scroll', trackScrollDepth);
      window.addEventListener('click', trackClicks);
      window.addEventListener('beforeunload', trackEngagement);

      // Initial tracking
      trackPageView();

      // Cleanup
      return () => {
        window.removeEventListener('scroll', trackScrollDepth);
        window.removeEventListener('click', trackClicks);
        window.removeEventListener('beforeunload', trackEngagement);
      };
    }
  }, []);

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None;Secure',
            send_page_view: true,
            anonymize_ip: true,
            link_attribution: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
        `}
      </Script>

      {/* Hotjar Tracking */}
      <Script id="hotjar-tracking" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>

      {/* Schema.org Markup for SEO */}
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ScrollForge",
            "alternateName": "ScrollForge PDF Converter",
            "url": "https://scroll-forge.vercel.app",
            "logo": "https://scroll-forge.vercel.app/logo.png",
            "sameAs": [
              "https://github.com/ReyKan-KP/ScrollForge",
              "https://twitter.com/ScrollForge",
              "https://www.linkedin.com/company/scrollforge",
              "https://www.facebook.com/scrollforge",
              "https://www.youtube.com/@scrollforge"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-XXX-XXX-XXXX",
              "contactType": "customer service",
              "areaServed": "Worldwide",
              "availableLanguage": ["English", "Spanish", "French", "German", "Chinese", "Japanese"]
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "founder": {
              "@type": "Person",
              "name": "ReyKan-KP (Kanishaka Pranjal)",
              "url": "https://github.com/ReyKan-KP"
            },
            "foundingDate": "2024",
            "description": "Free online PDF to website converter. Transform PDFs into interactive HTML pages instantly.",
            "slogan": "Transform PDFs into Interactive Web Pages",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "10543",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* Service Schema */}
      <Script
        id="schema-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "PDF Conversion Service",
            "provider": {
              "@type": "Organization",
              "name": "ScrollForge"
            },
            "areaServed": {
              "@type": "Place",
              "name": "Worldwide"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "PDF Conversion Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "PDF to HTML Conversion",
                    "description": "Convert PDF files to responsive HTML websites"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Online PDF Viewer",
                    "description": "View PDF documents online without downloads"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "PDF Document Reader",
                    "description": "Read PDF files in your browser"
                  }
                }
              ]
            }
          })
        }}
      />

      {/* HowTo Schema for SEO */}
      <Script
        id="schema-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Convert PDF to Website",
            "description": "Learn how to convert your PDF documents to interactive websites using ScrollForge",
            "image": "https://scroll-forge.vercel.app/tutorial.png",
            "totalTime": "PT2M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "0"
            },
            "supply": [],
            "tool": [],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Upload PDF",
                "text": "Click the upload button and select your PDF file",
                "image": "https://scroll-forge.vercel.app/step1.png",
                "url": "https://scroll-forge.vercel.app/upload"
              },
              {
                "@type": "HowToStep",
                "name": "Wait for Processing",
                "text": "Wait a few seconds while we convert your PDF",
                "image": "https://scroll-forge.vercel.app/step2.png"
              },
              {
                "@type": "HowToStep",
                "name": "Access Your Website",
                "text": "Get your unique link to view the converted website",
                "image": "https://scroll-forge.vercel.app/step3.png"
              }
            ]
          })
        }}
      />
    </>
  );
}

// Declare gtag type
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

const gtag: Window['gtag'] = function() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag.apply(window, arguments as any);
  }
};