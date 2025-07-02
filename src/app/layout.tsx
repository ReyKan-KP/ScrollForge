import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScrollForge | Transform PDFs into Interactive Web Pages",
  description: "Convert and view your PDF documents seamlessly with ScrollForge - the next-gen PDF reader.",
  openGraph: {
    title: "ScrollForge | Transform PDFs into Interactive Web Pages",
    description: "Convert and view your PDF documents seamlessly with ScrollForge - the next-gen PDF reader.",
    url: "https://scroll-forge.vercel.app",
    siteName: "ScrollForge",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ScrollForge - Transform PDFs into Interactive Web Pages",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrollForge | Transform PDFs into Interactive Web Pages",
    description: "Convert and view your PDF documents seamlessly with ScrollForge - the next-gen PDF reader.",
    images: ["/og.png"],
    creator: "@KanishakPranjal",
  },
  metadataBase: new URL("https://scroll-forge.vercel.app"),
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
