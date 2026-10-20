import React from "react";
import Link from "next/link";
import { Metadata } from "next";
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
      <div className="pt-28 pb-24 bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center min-h-[44px] text-sm font-bold text-slate-700 hover:text-slate-950"
          >
            Back to Home
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="font-display font-bold tracking-tight text-slate-950 text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-slate-600">Last updated: October 8, 2026</p>
          <p className="mt-6 max-w-2xl text-lg text-slate-700 leading-relaxed">
            How D Lucky X apps handle your data, as declared in the Google Play Data Safety section of each app listing.
          </p>
        </header>

        <section aria-labelledby="summary" className="mb-14">
          <h2 id="summary" className="font-display font-bold text-2xl text-slate-950">How our apps handle your data</h2>
          <dl className="mt-5 grid md:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <dt className="font-bold text-slate-900">No data shared with third parties</dt>
              <dd className="mt-1 text-slate-700 leading-relaxed">The developer declares this app does not share user data with other companies or organizations.</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900">No data collected</dt>
              <dd className="mt-1 text-slate-700 leading-relaxed">The developer declares this app does not collect personal user data.</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900">On-device processing</dt>
              <dd className="mt-1 text-slate-700 leading-relaxed">Files, gameplay progress, and user preferences remain stored 100% locally on your smartphone.</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900">Play Families Policy</dt>
              <dd className="mt-1 text-slate-700 leading-relaxed">Our educational titles comply with Google Play Designed for Families and COPPA regulations.</dd>
            </div>
          </dl>
        </section>

        {/* Detailed Policy Text */}
        <div className="space-y-10 text-slate-700 text-base leading-7">
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
                  className="flex items-center justify-between gap-3 min-h-[44px] border-b border-slate-200 text-sm font-semibold text-slate-900 hover:text-emerald-800"
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
            <p><a href={`mailto:${developer.email}`} className="font-bold text-emerald-800 underline underline-offset-4">{developer.email}</a></p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
