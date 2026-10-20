import { Metadata } from "next";
import { developer } from "@/data/apps";
import { GearHub } from "@/components/hardware/GearHub";

export const metadata: Metadata = {
  title: "Aksesoris Gaming, Anak, dan PDF untuk Android | D Lucky X",
  description:
    "Pendingin HP, sarung jempol gaming, casing tablet anak, dan stylus untuk tanda tangan PDF. Pilihan aksesoris smartphone dan tablet dari D Lucky X.",
  alternates: {
    canonical: `${developer.website}/gear/`,
    languages: {
      "x-default": `${developer.website}/gear/`,
      id: `${developer.website}/gear/`,
      en: `${developer.website}/en/gear/`,
    },
  },
  twitter: { card: "summary" },
  openGraph: {
    title: "Aksesoris Gaming, Anak, dan PDF untuk Android | D Lucky X",
    description:
      "Pendingin HP, sarung jempol gaming, casing tablet anak, dan stylus untuk tanda tangan PDF. Pilihan aksesoris smartphone dan tablet dari D Lucky X.",
    url: `${developer.website}/gear/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  return <GearHub lang="id" />;
}
