import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { apps } from "@/data/apps";
import { KucingPrivacyContent } from "@/components/privacy/KucingPrivacyContent";
import { BabySharkPrivacyContent } from "@/components/privacy/BabySharkPrivacyContent";
import { FruitMatchPrivacyContent } from "@/components/privacy/FruitMatchPrivacyContent";
import { MiloCatPrivacyContent } from "@/components/privacy/MiloCatPrivacyContent";
import { MonsterMathPrivacyContent } from "@/components/privacy/MonsterMathPrivacyContent";
import { OfflinePdfPrivacyContent } from "@/components/privacy/OfflinePdfPrivacyContent";
import { StickmanPenaltyPrivacyContent } from "@/components/privacy/StickmanPenaltyPrivacyContent";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) return { title: "Privacy Policy Not Found" };

  return {
    title: `Privacy Policy: ${app.name}`,
    description: `Official Google Play Data Safety and privacy policy for ${app.name} (${app.packageId}).`,
  };
}

export default function AppPrivacyPage({ params }: PageProps) {
  const app = apps.find((a) => a.slug === params.slug);

  if (!app) {
    notFound();
  }

  const renderContent = () => {
    switch (app.slug) {
      case "kucing-atur-duit":
        return <KucingPrivacyContent app={app} />;
      case "baby-shark-abc-kids-learning":
        return <BabySharkPrivacyContent app={app} />;
      case "fruity-merge-3d-match-puzzle":
        return <FruitMatchPrivacyContent app={app} />;
      case "milo-cat-adventure":
        return <MiloCatPrivacyContent app={app} />;
      case "monster-math-train-brain":
        return <MonsterMathPrivacyContent app={app} />;
      case "offline-pdf-editor":
        return <OfflinePdfPrivacyContent app={app} />;
      case "stickman-penalty-rush":
        return <StickmanPenaltyPrivacyContent app={app} />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to General Privacy Policy
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href={`/terms/${app.slug}`}
              className="text-indigo-700 hover:text-indigo-900 underline"
            >
              Terms of Service &rarr;
            </Link>
            <Link
              href={`/apps/${app.slug}`}
              className="text-slate-700 hover:text-slate-900 underline"
            >
              {app.name} Overview &rarr;
            </Link>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
