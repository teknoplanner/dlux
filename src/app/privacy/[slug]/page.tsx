import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  ExternalLink,
  Share2,
  CheckCircle2,
  Lock,
  Users,
} from "lucide-react";
import { apps, developer } from "@/data/apps";
import { Badge } from "@/components/ui/Badge";

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

  const isEducation = app.category === "education";

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to General Privacy Policy
          </Link>

          <Link
            href={`/apps/${app.slug}`}
            className="text-xs text-slate-700 hover:text-slate-900 font-semibold underline flex items-center gap-1"
          >
            {app.name} Overview &rarr;
          </Link>
        </div>

        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            GOOGLE PLAY DATA SAFETY SPECIFICATION
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Privacy Policy: {app.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span>Package ID: <code className="text-slate-700 font-mono font-semibold">{app.packageId}</code></span>
            <span>•</span>
            <span>Developer: {developer.name}</span>
          </div>
        </div>

        {/* Data Safety Card mirroring Google Play Store declarations */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Google Play Certified Declarations
            </span>
            <h2 className="text-xl font-bold font-display text-slate-900 mt-2">
              Data Safety for {app.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  No data shared with third parties
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  The developer declares this app does not share user data with other companies or organizations.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0 text-sky-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  No data collected
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  The developer declares this app does not collect personal user data.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0 text-purple-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  100% On-device storage
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  All documents, progress, and settings remain solely within your local device memory.
                </p>
              </div>
            </div>

            {isEducation ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Committed to Play Families Policy
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    The developer has committed to follow the Play Families Policy for this app.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    No Account Required
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Play or use freely without registration, login credentials, or phone numbers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Policy Content */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">Overview</h2>
            <p>
              This privacy document specifies the operational practices and permissions utilized by <strong>{app.name}</strong> (Package ID: <code className="text-slate-800 font-mono">{app.packageId}</code>), authored and published by <strong>{developer.name}</strong> on the Google Play Store.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant={isEducation ? "cyan" : "purple"}>
                Category: {app.category}
              </Badge>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Content Rating: Rated {app.contentRating || "3+"}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                app.hasAds ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                {app.hasAds ? "Contains Ads" : "Ad-Free"}
              </span>
            </div>
          </section>

          {isEducation && (
            <section className="p-6 rounded-2xl bg-sky-50 border border-sky-200 space-y-3">
              <h3 className="text-base font-bold text-sky-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                Child Safety Certification (COPPA &amp; Google Play Families)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Because <strong>{app.name}</strong> serves children and educational learning, we confirm that this app:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                <li>Does not collect names, photos, email addresses, precise GPS locations, or persistent identifiers from children.</li>
                <li>Does not share personal data with third parties for behavioral tracking or behavioral ad profiling.</li>
                <li>Strictly adheres to Google Play Families Policy requirements.</li>
              </ul>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">Permissions &amp; Data Storage</h2>
            <p>
              <strong>{app.name}</strong> stores your progress, high scores, or user settings locally on your device via standard Android secure storage mechanisms. This data is never transmitted to external cloud servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">Third-Party Services</h2>
            <p>
              The application may interact with Google Play Services to distribute application updates or record anonymized diagnostic reports to improve system stability and performance.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">Developer Contact</h2>
            <p>
              For inquiries, feedback, or data privacy requests concerning {app.name}, please contact us via:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-2 text-slate-900 font-mono text-xs">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{developer.email}</span>
              </div>
              <a
                href={app.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center gap-2 shadow-2xs"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>View on Google Play Store</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
