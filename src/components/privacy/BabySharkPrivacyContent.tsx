import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Mail,
  ExternalLink,
  Lock,
  Smartphone,
  EyeOff,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface BabySharkPrivacyContentProps {
  app: AppItem;
}

export const BabySharkPrivacyContent: React.FC<BabySharkPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          COPPA &amp; Google Play Families Compliant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy: Shark Smart Alphabet
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Last updated: July 29, 2026 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          Thank you for using <strong>Shark Smart Alphabet</strong> (&quot;the App&quot;). The App is developed and published by <strong>{developer.name}</strong>. Your privacy is very important to us. This App is designed for children and families and complies with the <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong> and other applicable privacy regulations.
        </p>
      </div>

      {/* Section 1 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Children&apos;s Privacy (COPPA Compliance)
        </h2>
        <p className="text-slate-700">
          Shark Smart Alphabet is designed specifically for a child-friendly audience:
        </p>
        <ul className="space-y-2 pl-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>We do not knowingly collect, store, or share personal information from children.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>The App does not require account registration or login credentials.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Users are never asked to provide personal information, such as names, email addresses, phone numbers, photos, voice recordings, or precise location data.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>If a parent or guardian believes that personal information has been collected unintentionally, please contact us and we will promptly delete such information.</span>
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          Information We Collect
        </h2>
        <p className="text-slate-700">
          We collect limited, non-personal information only, strictly for app functionality and improvement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-cyan-600" />
              <span>Automatically Collected (Non-Personal):</span>
            </div>
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              <li>Device information (such as device model and operating system version)</li>
              <li>App performance data (crash reports and error logs)</li>
              <li>Basic gameplay progress (such as levels completed)</li>
              <li>Anonymous usage statistics</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-emerald-600" />
              <span>We Do NOT Collect:</span>
            </div>
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              <li>Names or usernames</li>
              <li>Email addresses or phone numbers</li>
              <li>Contact lists</li>
              <li>Photos, videos, or audio recordings</li>
              <li>Precise location data (GPS)</li>
              <li>Social media information</li>
              <li>Personal identifiers of any kind</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          How We Use Information
        </h2>
        <p className="text-slate-700">Collected information is used only to:</p>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Improve app stability and performance</li>
          <li>Fix bugs and technical issues</li>
          <li>Understand general app usage in an anonymous manner</li>
          <li>Enhance the learning experience</li>
        </ul>
        <p className="text-xs text-slate-600 font-medium pt-1">
          We do not sell, rent, or share information for advertising profiling or marketing purposes.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Advertisements &amp; AdMob
        </h2>
        <p className="text-slate-700">
          Shark Smart Alphabet uses Google AdMob to display advertisements and follows the <strong>Google Play Families Policy</strong>:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            <li>Ads are configured to be child-appropriate</li>
            <li>Only non-personalized ads are displayed</li>
            <li>Interest-based or behaviorally targeted ads are disabled</li>
            <li>Ads do not request personal information from users</li>
          </ul>
          <p className="text-xs text-slate-600 pt-2 border-t border-slate-200/60">
            AdMob may collect limited non-personal data, such as device type, country-level location (not precise), and ad impressions and basic interaction data. Google&apos;s data handling practices are governed by{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 hover:underline font-semibold inline-flex items-center gap-1"
            >
              Google&apos;s Privacy Policy <ExternalLink className="w-3 h-3" />
            </a>.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Third-Party Services
        </h2>
        <p className="text-slate-700">
          The App may use third-party services for app analytics and advertising (Google AdMob). These services are required to comply with:
        </p>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>COPPA (Children&apos;s Online Privacy Protection Act)</li>
          <li>Google Play Families Policy</li>
          <li>Applicable privacy laws</li>
        </ul>
        <p className="text-xs text-slate-600">
          Third-party services are not permitted to use data for independent marketing or profiling.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Data Security
        </h2>
        <p className="text-slate-700">
          We take reasonable measures to protect information against unauthorized access, loss, or misuse. However, no method of electronic storage or transmission is completely secure.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
          Parents and Guardians
        </h2>
        <p className="text-slate-700">
          Parents or legal guardians may:
        </p>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Request information about data practices</li>
          <li>Request deletion of collected data</li>
          <li>Contact us with privacy-related questions</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the App indicates acceptance of the updated policy.
        </p>
      </section>

      {/* Section 9 */}
      <section className="space-y-3.5 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-mono font-bold">9</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have any questions or concerns about this Privacy Policy, please contact us:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-4 h-4 text-cyan-600" />
            <span>{developer.email}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="text-slate-700">
            Developer: <strong>{developer.name}</strong>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="text-slate-700">
            App: <strong>{app.name}</strong> (<code className="font-mono">{app.packageId}</code>)
          </div>
        </div>
      </section>
    </div>
  );
};
