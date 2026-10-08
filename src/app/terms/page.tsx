import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FileText, ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { apps, developer } from "@/data/apps";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Official public Terms of Service for D Lucky X Android applications and games.",
};

export default function TermsPage() {
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
            <FileText className="w-4 h-4 text-indigo-600" />
            LEGAL AGREEMENT &amp; TERMS OF USE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: October 8, 2026 • Valid for all Google Play Store Releases
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
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
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    app.slug === "kucing-atur-duit"
                      ? "bg-amber-50/70 border-amber-300 text-slate-900 hover:bg-amber-100/70 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
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
