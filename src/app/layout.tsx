import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { developer } from "@/data/apps";
import { generateOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://dluckyx.cloud"),
  title: {
    default: "D Lucky X | Android Games & Apps Studio",
    template: "%s | D Lucky X",
  },
  description: developer.tagline,
  keywords: [
    "D Lucky X",
    "Android Games",
    "Stickman Penalty Rush",
    "Milo Cat Adventure",
    "Monster Math Brain Training",
    "Baby Shark ABC",
    "Fruit Match",
    "Offline PDF Editor",
    "Kucing Atur Duit",
    "Kids Educational Games",
    "Android Productivity Apps",
  ],
  authors: [{ name: developer.name, url: developer.website }],
  creator: developer.name,
  publisher: developer.name,
  alternates: {
    canonical: "https://dluckyx.cloud/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "https://dluckyx.cloud/",
    siteName: "D Lucky X",
    title: "D Lucky X | Android Games & Apps Studio",
    description: developer.tagline,
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "D Lucky X Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D Lucky X | Android Games & Apps Studio",
    description: developer.tagline,
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-dluckyx",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="D Lucky X Blog RSS Feed"
          href="/feed.xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* Google Analytics tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G3F8G23FGB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-G3F8G23FGB');
          `}
        </Script>
      </head>
      <body className="bg-[#fafaf9] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-slate-900 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
