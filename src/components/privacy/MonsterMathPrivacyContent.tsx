import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  ExternalLink,
  Smartphone,
  EyeOff,
  Radio,
  Lock,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface MonsterMathPrivacyContentProps {
  app: AppItem;
}

export const MonsterMathPrivacyContent: React.FC<MonsterMathPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          Educational &amp; Kid-Friendly Privacy Certified
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy – Monster Adventure Math
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Effective Date: December 12, 2025 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          <strong>Monster Adventure Math</strong> (&quot;the App&quot;) is an educational Android game featuring monster battles based on answering math questions. This Privacy Policy explains how we collect, use, and protect user information.
        </p>
      </div>

      {/* Section 1 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Information We Collect
        </h2>
        <p className="text-slate-700">
          The App does not collect any personally identifiable information such as name, email, phone number, or photos.
        </p>
        <p className="text-slate-700">
          However, the App may collect the following non-personal data:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span>a. Non-Personal Information:</span>
            </div>
            <p className="text-xs text-slate-600">
              To improve the game experience, we may collect non-personal usage data such as:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              <li>Gameplay progress (levels, scores)</li>
              <li>App performance metrics</li>
              <li>Device information (model, OS version, language settings)</li>
            </ul>
            <p className="text-xs text-emerald-700 font-medium pt-1">
              This data cannot be used to identify you personally.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Radio className="w-4 h-4 text-purple-600" />
              <span>b. Advertising Data (If AdMob or Similar Used):</span>
            </div>
            <p className="text-xs text-slate-600">
              If the App displays ads, advertising partners such as Google AdMob may collect:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              <li>Device advertising ID</li>
              <li>Approximate location (not GPS)</li>
              <li>Interaction data with ads</li>
            </ul>
            <p className="text-xs text-slate-600 pt-1">
              Data collected follows third-party privacy policies and Google Play requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          How We Use Information
        </h2>
        <p className="text-slate-700">Any collected non-personal data is used for:</p>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Improving gameplay and performance</li>
          <li>Debugging and fixing issues</li>
          <li>Providing a better user experience</li>
          <li>Displaying ads (if applicable)</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          Children’s Privacy
        </h2>
        <p className="text-slate-700">
          Monster Adventure Math is suitable for children as an educational math game.
        </p>
        <ul className="space-y-2 pl-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>We do not collect personal information from children.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>If you believe personal data has been collected accidentally, please contact us and we will delete it immediately.</span>
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Permissions
        </h2>
        <p className="text-slate-700">
          The App does not request any dangerous or sensitive permissions. Any future updates requiring additional permissions will ask for user consent first.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Data Security
        </h2>
        <p className="text-slate-700">
          We implement reasonable technical measures to protect all collected non-personal data. However, no method of data transmission or storage is completely secure, and we cannot guarantee absolute protection.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Third-Party Services
        </h2>
        <p className="text-slate-700">
          The App may use third-party services such as Google AdMob and Firebase Analytics (optional).
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 hover:underline font-semibold text-xs inline-flex items-center gap-1.5"
          >
            <span>Google Privacy Policy</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Section 7 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated Effective Date.
        </p>
      </section>

      {/* Section 8 */}
      <section className="space-y-3.5 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-4 h-4 text-purple-600" />
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
