import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { StructuredData } from "@/components/seo/structured-data";
import { SEOMonitor } from "@/components/seo/seo-monitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScrollForge - Free PDF to Website Converter | PDF to HTML Online Tool",
  description: "Convert PDF to website instantly with ScrollForge. Free online PDF to HTML converter, PDF viewer, and document reader. Transform PDFs into interactive web pages, read PDFs online without download. Best PDF to webpage converter tool 2024.",
  keywords: "pdf to website converter, pdf to html, pdf to webpage, online pdf reader, pdf viewer online, convert pdf to website free, pdf to html converter online, read pdf online, pdf document reader, transform pdf to web, pdf to interactive website, pdf to responsive html, pdf web viewer, online pdf converter, pdf to html online free, pdf to website builder, pdf viewer no download, pdf reader browser, pdf to web page converter, digital document reader, pdf to html5, pdf converter online, web based pdf reader, pdf to website online, pdf document viewer, pdf to html converter free, online document reader, pdf file viewer, pdf to webpage online, pdf to site converter",
  authors: [{ name: "ReyKan-KP (Kanishaka Pranjal)", url: "https://github.com/ReyKan-KP" }],
  creator: "ReyKan-KP",
  publisher: "ScrollForge - Open Source Project",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://scroll-forge.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google963b854edd316389.html",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  category: "technology",
  classification: "PDF Tools, Document Converter, Online Tools",
  openGraph: {
    title: "ScrollForge - Free PDF to Website Converter | Transform PDFs to HTML Online",
    description: "Convert PDF files to interactive websites instantly. Free online PDF to HTML converter with no downloads required. View, read, and transform your PDF documents into responsive web pages.",
    url: "https://scroll-forge.vercel.app",
    siteName: "ScrollForge - PDF to Website Converter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScrollForge - Convert PDF to Website Online Free",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "ScrollForge PDF Converter Logo",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
    videos: [
      {
        url: "https://scroll-forge.vercel.app/demo-video.mp4",
        width: 1280,
        height: 720,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrollForge - Free PDF to Website Converter Online",
    description: "Transform PDFs into interactive websites instantly. Free PDF to HTML converter with no downloads. Read and view PDFs online.",
    site: "@ScrollForge",
    creator: "@ScrollForge",
    images: {
      url: "/twitter-card.png",
      alt: "ScrollForge - PDF to Website Converter",
    },
  },
  metadataBase: new URL("https://scroll-forge.vercel.app"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ScrollForge PDF Converter",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SEOMonitor />
        <StructuredData />
        <ErrorBoundary>
          <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
