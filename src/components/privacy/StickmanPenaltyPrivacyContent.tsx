import React from "react";
import {
  ShieldCheck,
  Mail,
  ExternalLink,
  Radio,
  FileCode,
  Cookie,
  Lock,
  Globe,
  Users,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface StickmanPenaltyPrivacyContentProps {
  app: AppItem;
}

export const StickmanPenaltyPrivacyContent: React.FC<StickmanPenaltyPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Official Privacy Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Effective Date: June 24, 2026 • Application: Stickman Penalty Rush ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          This privacy policy applies to the <strong>Stickman Penalty Rush</strong> app (hereby referred to as &quot;Application&quot;) for mobile devices that was created as a free-to-play, ad-supported game. This service is provided at no cost and is intended for use &quot;as is&quot;.
        </p>
      </div>

      {/* Section 1 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Information Collection and Use
        </h2>
        <p className="text-slate-700">
          For a better experience while using our Application, we may require you to provide us with certain personally identifiable information. The information that we request will be retained by us and used as described in this privacy policy.
        </p>
        <p className="text-slate-700">
          The Application does use third-party services that may collect information used to identify you.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Link to the privacy policy of third-party service providers used by the Application:
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <span>Google Play Services</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://support.google.com/admob/answer/6128543?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-semibold text-xs inline-flex items-center gap-1.5"
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
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          Log Data
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>Diagnostics and Error Reporting</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            We want to inform you that whenever you use our Application, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            This Log Data may include information such as your device Internet Protocol (&quot;IP&quot;) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          Cookies
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Cookie className="w-4 h-4 text-emerald-600" />
            <span>Identifiers &amp; Third-Party Storage</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device&apos;s internal memory.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            This Application does not use these &quot;cookies&quot; explicitly. However, the app may use third-party code and libraries that use &quot;cookies&quot; to collect information and improve their services.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Security
        </h2>
        <p className="text-slate-700">
          We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Links to Other Sites
        </h2>
        <p className="text-slate-700">
          This Application may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Children’s Privacy
        </h2>
        <p className="text-slate-700">
          These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
        </p>
        <p className="text-slate-700">
          In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
      </section>

      {/* Section 8 */}
      <section className="space-y-3.5 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-4 h-4 text-emerald-600" />
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
