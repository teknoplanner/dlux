import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import { apps, developer } from "@/data/apps";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Official privacy policy of D Lucky X for Android applications on Google Play Store.",
};

export default function PrivacyPage() {
  return (
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
            PRIVACY POLICY COMPLIANCE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: October 8, 2026
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">1. Introduction</h2>
            <p>
              Welcome to <strong>{developer.name}</strong>. This Privacy Policy outlines how we manage, collect, and protect information when you download and use our applications and games distributed via the Google Play Store.
            </p>
            <p>
              By installing or using our apps, you acknowledge and agree to the guidelines set forth in this document.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">2. Children&apos;s Privacy (COPPA &amp; Google Play Families)</h2>
            <p>
              Several of our titles, including <em>Baby Shark ABC: Kids Learning</em> and <em>Monster Math: Brain Training</em>, are specifically developed for children and families. We are fully committed to complying with <strong>COPPA (Children&apos;s Online Privacy Protection Act)</strong> and <strong>Google Play Designed for Families policies</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>We <strong>NEVER</strong> collect Personally Identifiable Information (such as full names, home addresses, phone numbers, or precise GPS locations) from children under the age of 13.</li>
              <li>Our children&apos;s applications do not contain public chat rooms, social feeds, or unmonitored external sharing features.</li>
              <li>Any advertisements served within family apps adhere strictly to Google Play Families Self-Certified Ads SDK requirements, serving exclusively age-appropriate content.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">3. Information Collection &amp; Telemetry</h2>
            <p>
              In general, our games and productivity tools operate fully offline and do not require user account registration. Anonymous technical diagnostic information collected automatically by standard platform services (such as Google Play Services for crash telemetry) may include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Hardware device model and Android operating system version.</li>
              <li>Anonymized crash stack traces solely utilized to resolve bugs and performance issues.</li>
              <li>Non-identifying advertising identifiers (Google Advertising ID) for frequency capping on ad-supported applications.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">4. Device Permissions</h2>
            <p>
              Our applications only request the minimal operating system permissions strictly required for core functionality (such as local on-device storage for save data or haptic feedback). We never request access to cameras, microphones, or contacts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">5. App-Specific Privacy Policies</h2>
            <p>
              For dedicated privacy terms and permission details for each specific application, please visit:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  href={`/privacy/${app.slug}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-between transition-all"
                >
                  <span>{app.name}</span>
                  <span className="text-slate-400">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">6. Contact &amp; Inquiries</h2>
            <p>
              If you have any questions or concerns regarding our Privacy Policy or data handling, please reach out directly:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-3 text-slate-900 font-mono text-sm">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span>{developer.email}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
