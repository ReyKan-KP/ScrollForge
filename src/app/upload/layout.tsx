import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload PDF - Convert PDF to Website | ScrollForge',
  description: 'Upload your PDF file and instantly convert it to an interactive website. Free PDF to HTML converter with no file size limits. Transform documents into responsive web pages in seconds.',
  keywords: 'upload pdf, pdf upload online, convert pdf to html, pdf to website upload, pdf file converter, upload document, pdf to web converter, online pdf upload, pdf transformation tool, upload pdf to read online',
  openGraph: {
    title: 'Upload PDF to Convert - ScrollForge PDF to Website Tool',
    description: 'Upload and convert PDF files to interactive websites instantly. Free, fast, and secure PDF to HTML conversion.',
    url: 'https://scroll-forge.vercel.app/upload',
    type: 'website',
    images: [
      {
        url: '/upload-og.png',
        width: 1200,
        height: 630,
        alt: 'Upload PDF Interface - ScrollForge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upload PDF - Free PDF to Website Converter',
    description: 'Upload your PDF and convert it to an interactive website instantly with ScrollForge.',
    images: ['/upload-twitter.png'],
  },
  alternates: {
    canonical: 'https://scroll-forge.vercel.app/upload',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}