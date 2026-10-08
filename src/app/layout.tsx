import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { developer } from "@/data/apps";
import { generateOrganizationSchema } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dluckyx.com"),
  title: {
    default: "D Lucky X — Studio Game & Aplikasi Android Resmi",
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
    "Fruity Merge 3D",
    "Google Play Developer",
    "Game Edukasi Anak",
  ],
  authors: [{ name: developer.name, url: developer.website }],
  creator: developer.name,
  publisher: developer.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dluckyx.com",
    siteName: "D Lucky X",
    title: "D Lucky X — Studio Game & Aplikasi Android Resmi",
    description: developer.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: "D Lucky X — Studio Game & Aplikasi Android Resmi",
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
    <html lang="id" className={`${poppins.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/images/apps/stickman-penalty-rush/icon.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-[#07070f] text-[#f4f4ff] font-sans antialiased min-h-screen flex flex-col selection:bg-purple-500/30 selection:text-cyan-300">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
