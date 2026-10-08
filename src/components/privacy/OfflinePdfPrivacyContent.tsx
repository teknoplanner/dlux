import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  HardDrive,
  EyeOff,
  WifiOff,
  FolderLock,
  FileCheck2,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface OfflinePdfPrivacyContentProps {
  app: AppItem;
}

export const OfflinePdfPrivacyContent: React.FC<OfflinePdfPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800 mb-3">
          <WifiOff className="w-4 h-4 text-sky-600" />
          100% Offline &amp; On-Device Processing
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy for Offline PDF Editor &amp; Sign
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Effective Date: September 15, 2026 • Last Updated: September 15, 2026 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          Thank you for choosing <strong>Offline PDF Editor &amp; Sign</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;the App&quot;). We respect your privacy and are committed to protecting your personal data and documents.
        </p>
        <p className="text-slate-700 text-sm leading-relaxed mt-2">
          This Privacy Policy explains how our application operates, why it does not collect or transmit personal information, and how we handle document processing strictly on your local device.
        </p>
      </div>

      {/* Section 2 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Core Privacy Principles (100% Offline &amp; Private)
        </h2>
        <div className="grid grid-cols-1 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Zero Network Access</h3>
              <p className="text-xs text-slate-700 mt-1">
                The App does not declare, request, or use the <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">android.permission.INTERNET</code> permission. The App has no technical capability to connect to external servers, cloud databases, or third-party web services.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">100% On-Device Processing</h3>
              <p className="text-xs text-slate-700 mt-1">
                All document operations—including editing text, placing digital signatures, annotating, merging, splitting, compressing, watermarking, converting images, LaTeX formula rendering, and password protection—are executed entirely within your device&apos;s local memory (RAM).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Zero Data Collection &amp; No User Accounts</h3>
              <p className="text-xs text-slate-700 mt-1">
                We do not collect, monitor, track, store, or share any personal information, device identifiers, or user files. You do not need to register, log in, or provide personal credentials (such as name, email, or phone number) to use any feature of this App.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">No Advertisements or Analytics</h3>
              <p className="text-xs text-slate-700 mt-1">
                The App contains no third-party advertising SDKs, tracking pixels, or telemetry analytics tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          Information We Do NOT Collect
        </h2>
        <p className="text-slate-700">
          We do not collect any user data under any circumstances. Specifically:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Personal Information:</strong> We do not collect your name, email, physical address, contacts, or calendar data.</li>
            <li><strong>Documents and File Content:</strong> Any PDF files or images you import, modify, or save remain exclusively in your local storage. We have no access to your documents or handwritten signatures.</li>
            <li><strong>Hardware &amp; Device Identifiers:</strong> We do not collect IMEI numbers, MAC addresses, Android IDs, Google Advertising IDs (GAID), or hardware serial numbers.</li>
            <li><strong>Location Data:</strong> We do not collect or request GPS or network-based location data.</li>
            <li><strong>Usage Statistics:</strong> We do not track which features you use, your session durations, or how frequently you open the App.</li>
          </ul>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          Device Permissions &amp; File Storage (SAF Compliance)
        </h2>
        <p className="text-slate-700">
          The App strictly complies with modern Android Scoped Storage and Storage Access Framework (SAF) standards:
        </p>
        <div className="space-y-3 pl-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <FolderLock className="w-4 h-4 text-sky-600" />
              <span>Storage Access Framework (SAF)</span>
            </div>
            <p className="text-xs text-slate-700">
              When opening or saving a document, the App delegates file selection to Android’s official system document picker. The App only accesses the specific file URI explicitly selected by you.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-sky-600" />
              <span>No Broad Storage Access</span>
            </div>
            <p className="text-xs text-slate-700">
              The App does not request broad file access permissions such as <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">MANAGE_EXTERNAL_STORAGE</code> or legacy <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">READ_EXTERNAL_STORAGE</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4 text-sky-600" />
              <span>Temporary Cache Isolation</span>
            </div>
            <p className="text-xs text-slate-700">
              Temporary bitmap previews generated during document rendering are held strictly within the application&apos;s private cache directory (<code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">context.cacheDir</code>). These temporary files are inaccessible to other applications and are automatically discarded upon completion or app closure.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Google Play Data Safety Declarations
        </h2>
        <p className="text-slate-700">
          In accordance with Google Play&apos;s Data Safety requirements:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900">Data Collection:</span> No (The App does not collect any user data).
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900">Data Sharing:</span> No (No data is shared with third parties or advertisers).
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900">Data Encryption in Transit:</span> Not Applicable (No internet transmission).
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900">Data Retention &amp; Deletion:</span> Not Applicable (No remote storage).
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Children&apos;s Privacy (COPPA Compliance)
        </h2>
        <p className="text-slate-700">
          The App does not collect any personal information from anyone, including children under the age of 13. It is fully compliant with the <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong> and applicable international child data privacy regulations.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Open Source &amp; Third-Party Libraries
        </h2>
        <p className="text-slate-700">
          The App utilizes trusted, open-source libraries that execute strictly offline:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5">
          <li><strong>PDFBox-Android:</strong> Used solely for local in-memory rendering and manipulation of PDF documents.</li>
          <li><strong>Android Jetpack &amp; Compose:</strong> Standard Android UI toolkit provided by Google.</li>
        </ul>
        <p className="text-xs text-slate-600 font-medium pt-1">
          None of these libraries transmit telemetry or connect to external servers.
        </p>
      </section>

      {/* Section 8 */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may periodically update this Privacy Policy to reflect future software improvements or regulatory changes. Any revisions will be published with an updated &quot;Last Updated&quot; date.
        </p>
      </section>

      {/* Section 9 */}
      <section className="space-y-3.5 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
          Contact Information
        </h2>
        <p className="text-slate-700">
          If you have any questions, suggestions, or concerns regarding this Privacy Policy or your privacy while using the App, please contact us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-4 h-4 text-sky-600" />
            <span>{developer.email}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="text-slate-700">
            Application: <strong>{app.name}</strong> (<code className="font-mono">{app.packageId}</code>)
          </div>
        </div>
      </section>
    </div>
  );
};
