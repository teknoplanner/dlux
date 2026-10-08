import React from "react";
import {
  ShieldCheck,
  Mail,
  ExternalLink,
  Radio,
  FileCode,
  Users,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface MiloCatPrivacyContentProps {
  app: AppItem;
}

export const MiloCatPrivacyContent: React.FC<MiloCatPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-semibold text-pink-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-pink-600" />
          Official Privacy Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy for Milo Cat Adventure
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Effective Date: July 23, 2026 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          <strong>{developer.name}</strong> (&quot;Developer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) built the <strong>Milo Cat Adventure</strong> app as a Free app. This SERVICE is provided by {developer.name} at no cost and is intended for use as is.
        </p>
        <p className="text-slate-700 text-sm leading-relaxed mt-2">
          This Privacy Policy explains how we handle data when you play Milo Cat Adventure on Android devices. By using our Service, you agree to the collection and use of information in relation to this policy.
        </p>
      </div>

      {/* Section 1 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Information Collection and Use
        </h2>
        <p className="text-slate-700">
          For a better experience while using our Service, we may require you to provide us with certain personally identifiable information. The information that we request will be retained on your device and is not collected by us in any way.
        </p>
        <p className="text-slate-700">
          The app does use third-party services that may collect information used to identify you.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Link to the privacy policy of third-party service providers used by the app:
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:underline font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <span>Google Play Services</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://support.google.com/admob/answer/6128543?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:underline font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <span>AdMob</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          Advertising (AdMob)
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Radio className="w-4 h-4 text-pink-600" />
            <span>AdMob Advertising Integration</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            We use Google AdMob to display advertisements within the game. AdMob may use and collect anonymous data about your interests to customize content and advertising in this application and other sites and applications. Location data and device identifiers (such as the Android Advertising ID) may be used to serve personalized or non-personalized ads.
          </p>
          <div className="pt-2">
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:underline font-semibold text-xs inline-flex items-center gap-1"
            >
              <span>Learn how Google uses data when you use partner sites or apps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          Log Data
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FileCode className="w-4 h-4 text-pink-600" />
            <span>Diagnostics &amp; Error Reporting</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            We want to inform you that whenever you use our Service, in a case of an error in the app, we collect data and information (through third-party products) on your phone called Log Data.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            This Log Data may include information such as your device Internet Protocol (&quot;IP&quot;) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Children’s Privacy
        </h2>
        <p className="text-slate-700">
          These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age.
        </p>
        <p className="text-slate-700">
          In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3.5 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-4 h-4 text-pink-600" />
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
