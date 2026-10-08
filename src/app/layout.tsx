import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { developer } from "@/data/apps";
import { generateOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://dluckyx.cloud"),
  title: {
    default: "D Lucky X | Studio Game & Aplikasi Android",
    template: "%s | D Lucky X",
  },
  description: developer.tagline,
  keywords: [
    "D Lucky X",
    "Game Android",
    "Stickman Penalty Rush",
    "Milo Cat Adventure",
    "Monster Math Train Brain",
    "Baby Shark ABC",
    "Fruit Match",
    "Offline PDF Editor",
    "Kucing Atur Duit",
    "Game Edukasi Anak",
    "Aplikasi Produktivitas Android",
  ],
  authors: [{ name: developer.name, url: developer.website }],
  creator: developer.name,
  publisher: developer.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dluckyx.cloud",
    siteName: "D Lucky X",
    title: "D Lucky X | Studio Game & Aplikasi Android",
    description: developer.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: "D Lucky X | Studio Game & Aplikasi Android",
    description: developer.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/images/apps/stickman-penalty-rush/icon.webp" />
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
      </head>
      <body className="bg-[#fafaf9] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-slate-900 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
