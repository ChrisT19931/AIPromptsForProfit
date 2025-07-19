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
  const organizationData = {
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
    }
  };

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AI Prompts for Profit",
    "description": "30 premium AI prompts designed to help you earn money online. Compatible with ChatGPT, Claude, and other AI tools.",
    "brand": {
      "@type": "Brand",
      "name": "Ventaro AI"
    },
    "offers": {
      "@type": "Offer",
      "price": "47",
      "priceCurrency": "AUD",
      "availability": "https://schema.org/InStock",
      "url": "https://ventaroai.com/buy",
      "seller": {
        "@type": "Organization",
        "name": "Ventaro AI"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "category": "AI Tools",
    "audience": {
      "@type": "Audience",
      "audienceType": "Entrepreneurs, Content Creators, Online Business Owners"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are AI prompts and how can they help me earn money?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI prompts are carefully crafted instructions that help you get better results from AI tools like ChatGPT and Claude. Our prompts are designed specifically for money-making activities like content creation, business planning, marketing, and more."
        }
      },
      {
        "@type": "Question",
        "name": "Are these prompts compatible with different AI tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our prompts work with ChatGPT, Claude, Gemini, and most other AI language models. We provide variations and tips for optimal performance across different platforms."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer a money-back guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We offer a 30-day money-back guarantee. If you're not satisfied with the AI prompts, contact us for a full refund."
        }
      }
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ventaro AI",
    "url": "https://ventaroai.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ventaroai.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData),
          }}
        />
        <link rel="canonical" href="https://ventaroai.com" />
        <meta name="google-site-verification" content="" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ventaro AI" />
        <link rel="apple-touch-icon" href="/assets/icon-192x192.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
