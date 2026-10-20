import { Metadata } from "next";
import { developer } from "@/data/apps";
import { GearHub } from "@/components/hardware/GearHub";

export const metadata: Metadata = {
  title: "Mobile Gaming, Kids and PDF Accessories | D Lucky X",
  description:
    "A phone cooler, gaming finger sleeves, a kids tablet case, and a stylus for signing PDFs. Phone and tablet accessories picked by D Lucky X.",
  alternates: {
    canonical: `${developer.website}/en/gear/`,
    languages: {
      "x-default": `${developer.website}/gear/`,
      en: `${developer.website}/en/gear/`,
      id: `${developer.website}/gear/`,
    },
  },
  twitter: { card: "summary" },
  openGraph: {
    title: "Mobile Gaming, Kids and PDF Accessories | D Lucky X",
    description:
      "A phone cooler, gaming finger sleeves, a kids tablet case, and a stylus for signing PDFs. Phone and tablet accessories picked by D Lucky X.",
    url: `${developer.website}/en/gear/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  return <GearHub lang="en" />;
}
