import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  HardDrive,
  EyeOff,
  WifiOff,
  Smartphone,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface DefaultAppPrivacyContentProps {
  app: AppItem;
}

export const DefaultAppPrivacyContent: React.FC<DefaultAppPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Google Play Data Safety Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy for {app.name}
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Last Updated: October 18, 2026 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          Thank you for choosing <strong>{app.name}</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;the App&quot;), developed by {developer.name}. We respect your privacy and are committed to protecting your personal data in accordance with Google Play Developer Policies and global privacy standards.
        </p>
      </div>

      {/* Section 1: Overview */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">1</span>
          Data Safety Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">No Data Collection</h3>
              <p className="text-xs text-slate-700 mt-1">
                We do not collect, monitor, track, store, or sell personal identifiers, contacts, locations, or biometric data.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">No Third-Party Sharing</h3>
              <p className="text-xs text-slate-700 mt-1">
                Zero user data is transferred or shared with external companies, advertising networks, or data brokers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Local Device Storage</h3>
              <p className="text-xs text-slate-700 mt-1">
                Any application data, high scores, or user settings remain strictly isolated on your device&apos;s internal storage.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">No Account Required</h3>
              <p className="text-xs text-slate-700 mt-1">
                You can enjoy all core features without registering, signing up, or providing passwords or email addresses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Permissions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">2</span>
          Device Permissions
        </h2>
        <p className="text-slate-700">
          <strong>{app.name}</strong> requests only minimal Android operating system permissions strictly essential for functionality:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
          <li>Permissions are requested transparently with standard runtime permission dialogs.</li>
          <li>You may revoke any granted permission at any time through your Android System Settings (<em>Settings &gt; Apps &gt; {app.name} &gt; Permissions</em>).</li>
        </ul>
      </section>

      {/* Section 3: Children's Privacy */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">3</span>
          Children&apos;s Privacy (COPPA &amp; GDPR Compliance)
        </h2>
        <p className="text-slate-700">
          We comply with the Children&apos;s Online Privacy Protection Act (COPPA) and international child safety standards. We never collect personal information from children under the age of 13.
        </p>
      </section>

      {/* Section 4: Security */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">4</span>
          Data Security &amp; Deletion
        </h2>
        <p className="text-slate-700">
          Because we do not maintain remote databases containing personal user records, your data is inherently protected by your device&apos;s hardware encryption and OS sandboxing. Uninstalling the application or clearing app data completely wipes any locally saved files or preferences.
        </p>
      </section>

      {/* Section 5: Contact */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">5</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have any questions about this Privacy Policy or require further assistance, please contact:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>{developer.email}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>Developer: {developer.name}</span>
        </div>
      </section>
    </div>
  );
};
