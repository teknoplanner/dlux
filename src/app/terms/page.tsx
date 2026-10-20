import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { apps, developer } from "@/data/apps";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | D Lucky X Android Studio",
  description: "Official public Terms of Service for D Lucky X Android applications and games.",
  alternates: {
    canonical: `${developer.website}/terms/`,
  },
  openGraph: {
    title: "Terms of Service | D Lucky X Android Studio",
    description: "Official public Terms of Service for D Lucky X Android applications and games.",
    url: `${developer.website}/terms/`,
    type: "website",
  },
};

export default function TermsPage() {
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Terms of Service", url: `${developer.website}/terms/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="pt-28 pb-24 bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center min-h-[44px] text-sm font-bold text-slate-700 hover:text-slate-950"
          >
            Back to Home
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="font-display font-bold tracking-tight text-slate-950 text-4xl sm:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-slate-600">Last updated: October 8, 2026. Applies to all D Lucky X releases on Google Play.</p>
        </header>

        <div className="space-y-10 text-slate-700 text-base leading-7">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot; or &quot;You&quot;) and <strong>{developer.name}</strong> (&quot;Developer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              By downloading, installing, accessing, or using any of our mobile applications or games distributed via the Google Play Store, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not install or use our applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">2. License Grant &amp; Intellectual Property</h2>
            <p>
              Subject to your compliance with these Terms, {developer.name} grants you a revocable, non-exclusive, non-transferable, limited personal license to download, install, and use our applications on Android-compatible devices solely for your personal, non-commercial purposes.
            </p>
            <p>
              All software, code, artwork, audio, characters, graphics, logos, and trademarks included in our applications remain the exclusive intellectual property of {developer.name}. You may not reverse engineer, decompile, modify, distribute, or create derivative works without prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">3. Dedicated Terms for Specific Applications</h2>
            <p>
              Certain applications, especially financial tracking and document utility tools, have specific operational disclaimers. Review the dedicated terms for each individual application below:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  href={`/terms/${app.slug}`}
                  className="flex items-center justify-between gap-3 min-h-[44px] border-b border-slate-200 text-sm font-semibold text-slate-900 hover:text-emerald-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{app.name}</span>
                  </div>
                  <span className="text-slate-400 shrink-0">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">4. User Responsibility &amp; Local Data</h2>
            <p>
              Our applications operate with local on-device storage. You are solely responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Maintaining the physical security and access credentials (such as PIN, biometrics, or lock screen) of your device.</li>
              <li>Regularly backing up your device data and local application files.</li>
              <li>The accuracy of any information, financial figures, or inputs you record within the applications.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">5. Disclaimer of Warranties</h2>
            <p>
              Our applications and all accompanying services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express or implied.
            </p>
            <p>
              {developer.name} does not warrant that the application will be uninterrupted, error-free, completely bug-free, or compatible with every hardware specification or third-party operating system modification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall {developer.name} be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, device malfunction, or financial discrepancies resulting from the use or inability to use our applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">7. Changes to These Terms</h2>
            <p>
              We reserve the right to revise or update these Terms at any time to reflect software updates, regulatory requirements, or Google Play policy modifications. Continued use of the applications following published changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">8. Contact Information</h2>
            <p>
              If you have any questions, legal inquiries, or compliance notices regarding these Terms of Service, please contact us at:
            </p>
            <p><a href={`mailto:${developer.email}`} className="font-bold text-emerald-800 underline underline-offset-4">{developer.email}</a></p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
