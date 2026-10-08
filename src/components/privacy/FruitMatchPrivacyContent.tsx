import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  ExternalLink,
  Smartphone,
  EyeOff,
  Radio,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface FruitMatchPrivacyContentProps {
  app: AppItem;
}

export const FruitMatchPrivacyContent: React.FC<FruitMatchPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          Google Play Verified Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy for Fruit Match Game
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Effective Date: December 12, 2025 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          Fruit Match Game (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our game.
        </p>
      </div>

      {/* Section 1 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Information We Collect
        </h2>
        <p className="text-slate-700">
          We do not collect personally identifiable information (PII) such as your name, email, address, phone number, or precise location.
        </p>
        <p className="text-slate-700">
          However, the game may automatically collect non-personal information, including:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>Automatically Collected (Non-Personal):</span>
            </div>
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              <li>Device information (model, OS version, language)</li>
              <li>Usage data (how users interact with the game)</li>
              <li>Crash logs and performance data</li>
              <li>General app activity data</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-emerald-600" />
              <span>No Personally Identifiable Information:</span>
            </div>
            <p className="text-xs text-slate-700">
              This information helps us improve the game experience and fix bugs without identifying you individually.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          How We Use Your Information
        </h2>
        <p className="text-slate-700">We may use collected data to:</p>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Improve gameplay performance</li>
          <li>Identify and fix technical issues</li>
          <li>Understand user behavior and optimize features</li>
          <li>Ensure system stability and prevent abuse</li>
        </ul>
        <p className="text-xs text-slate-600 font-medium pt-1">
          We do not sell, rent, or share user data to third parties for personal identification.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          Advertising and Analytics (IMPORTANT – Advertising Included)
        </h2>
        <p className="text-slate-700">
          Our game may display ads through third-party advertising networks such as Google AdMob or similar providers.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4 text-amber-600" />
            <span>Data Collected by Advertising Partners:</span>
          </div>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            <li>Device identifiers (e.g., Android Advertising ID)</li>
            <li>Approximate location (non-precise)</li>
            <li>App interaction data</li>
            <li>Ad performance data</li>
          </ul>
          <p className="text-xs text-slate-700 pt-2 border-t border-slate-200/60">
            <strong>This data is used to:</strong> Display non-personalized ads, limit ad frequency, and detect invalid traffic (fraud prevention).
          </p>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
            <h4 className="text-xs font-bold text-amber-900">Non-personalized Ads (NPA)</h4>
            <p className="text-xs text-amber-800">
              We may request Google to serve non-personalized ads, which only use contextual information and do not track user activity across apps.
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Third-Party Privacy Policies:</p>
            <p>Users are encouraged to review the privacy policies of our advertising partners, such as Google AdMob:</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Google Privacy Policy <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.google.com/policies/technologies/ads/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Google Ads Technologies <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Children’s Privacy
        </h2>
        <p className="text-slate-700">
          Fruit Match Game is designed for general audiences. We do not knowingly collect personal information from children under age 13.
        </p>
        <p className="text-slate-700">
          If you are a parent or guardian and believe your child has provided personal information, please contact us immediately and we will remove any such data.
        </p>
        <p className="text-xs text-slate-600">
          We comply with the <strong>Children’s Online Privacy Protection Act (COPPA)</strong> and <strong>Google Play Families policies</strong>.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Data Security
        </h2>
        <p className="text-slate-700">
          We implement reasonable technical and organizational measures to safeguard data. However, no method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may update this Privacy Policy periodically. When updated, the &quot;Effective Date&quot; at the top will be changed. We recommend checking this page occasionally to stay informed.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-3.5 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have questions or concerns about this Privacy Policy, please contact us:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-4 h-4 text-amber-600" />
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
