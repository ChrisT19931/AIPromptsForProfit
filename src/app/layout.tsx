import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ventaro AI - Premium AI Prompts For Profit | Australian Made AI Tools",
  description: "Discover premium AI prompts designed to help you earn money online. Australian-made AI tools and prompts for ChatGPT, Claude, and more. Start your AI-powered business today.",
  keywords: "AI prompts, AI tools, earn money online, ChatGPT prompts, Claude prompts, AI business, Australian AI tools, premium prompts, AI for profit, online income",
  authors: [{ name: "Ventaro AI" }],
  creator: "Ventaro AI",
  publisher: "Ventaro AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://ventaroai.com",
    siteName: "Ventaro AI - AI Prompts For Profit",
    title: "Ventaro AI - Premium AI Prompts For Profit | Australian Made",
    description: "Premium AI prompts and tools designed to help you earn money online. Australian-made solutions for AI-powered businesses.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ventaro AI - Premium AI Prompts For Profit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ventaro AI - Premium AI Prompts For Profit",
    description: "Australian-made AI prompts and tools to help you earn money online with AI.",
    images: ["/assets/twitter-image.jpg"],
    creator: "@VentaroAI",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ventaro AI",
    "url": "https://ventaroai.com",
    "logo": "https://ventaroai.com/assets/logo.png",
    "description": "Premium AI prompts and tools designed to help you earn money online. Australian-made solutions for AI-powered businesses.",
    "foundingLocation": {
      "@type": "Country",
      "name": "Australia"
    },
    "sameAs": [
      "https://twitter.com/VentaroAI",
      "https://linkedin.com/company/ventaro-ai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "chris.t@ventarosales.com",
      "contactType": "Customer Service"
    },
    "offers": {
      "@type": "Offer",
      "category": "AI Tools and Prompts",
      "description": "Premium AI prompts for earning money online"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
