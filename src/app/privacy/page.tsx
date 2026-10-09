import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Mail, CheckCircle2, Lock, Share2, Users } from "lucide-react";
import { apps, developer } from "@/data/apps";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | D Lucky X Android Studio",
  description: "Official Google Play Data Safety and Privacy Policy for D Lucky X Android applications and games.",
  alternates: {
    canonical: `${developer.website}/privacy/`,
  },
  openGraph: {
    title: "Privacy Policy | D Lucky X Android Studio",
    description: "Official Google Play Data Safety and Privacy Policy for D Lucky X Android applications and games.",
    url: `${developer.website}/privacy/`,
    type: "website",
  },
};

export default function PrivacyPage() {
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Privacy Policy", url: `${developer.website}/privacy/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            GOOGLE PLAY DATA SAFETY &amp; PRIVACY
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: October 8, 2026 • Verified for Google Play Store Distribution
          </p>
        </div>

        {/* Data Safety Summary Card - Exactly matching Google Play Data Safety declarations */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Google Play Data Safety Declaration
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-2">
              How Our Apps Handle Your Data
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              As certified in each application listing on the Google Play Store:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
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

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
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

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0 text-purple-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  On-device processing
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Files, gameplay progress, and user preferences remain stored 100% locally on your smartphone.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Committed to Play Families Policy
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Our educational titles strictly comply with Google Play Designed for Families and COPPA regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Policy Text */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">1. Introduction</h2>
            <p>
              This Privacy Policy explains how <strong>{developer.name}</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects and protects user privacy across all Android applications and games published on the Google Play Store.
            </p>
            <p>
              We design our applications with privacy by default. We do not require user accounts, logins, or social profile connections to enjoy our games or use our productivity tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">2. Children&apos;s Privacy (COPPA &amp; Google Play Families)</h2>
            <p>
              Protecting young learners is one of our highest priorities. Applications such as <em>Baby Shark ABC: Kids Learning</em> and <em>Monster Math: Brain Training</em> are designed for children and families. We strictly adhere to the <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong> and the <strong>Google Play Families Policy</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>No Personal Information:</strong> We do not collect names, email addresses, phone numbers, photos, or precise GPS location data from children under the age of 13.</li>
              <li><strong>No Social Chat:</strong> Our children&apos;s apps do not contain open messaging, social feeds, or unmonitored multiplayer interactions.</li>
              <li><strong>Age-Appropriate Ads:</strong> Where advertisements are present, they are served exclusively through Google Play Families Self-Certified Ads SDKs, ensuring strict compliance with child protection standards.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">3. Information We Do Not Collect</h2>
            <p>
              In accordance with our Google Play Data Safety filings, our apps do not collect or share:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Personal identity information (names, email addresses, physical addresses).</li>
              <li>Financial or payment data (our financial tracker app stores ledgers purely on-device).</li>
              <li>Sensory hardware data (no camera, microphone, or sensor data collection).</li>
              <li>Contacts, phone logs, or SMS messages.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">4. Permissions &amp; Local Storage</h2>
            <p>
              Our applications operate primarily offline and request only essential Android permissions required for basic local features:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Storage / Media:</strong> Used exclusively to open or save files selected directly by the user (such as offline PDF editing or local backup files). Files never leave the device.</li>
              <li><strong>Vibration (Haptics):</strong> Used to provide tactile feedback during arcade gameplay.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">5. App-Specific Privacy Policies</h2>
            <p>
              View detailed policy specifications and Data Safety declarations for each individual release:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  href={`/privacy/${app.slug}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-between transition-all"
                >
                  <span className="truncate pr-2">{app.name}</span>
                  <span className="text-slate-400 shrink-0">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">6. Contact &amp; Questions</h2>
            <p>
              If you have any questions or requests regarding our Privacy Policy or data safety compliance, please contact our developer support team:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-3 text-slate-900 font-mono text-sm">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span>{developer.email}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
