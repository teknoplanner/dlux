import React from "react";
import {
  Mic,
  HardDrive,
  EyeOff,
  WifiOff,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Settings,
  Mail,
  Volume2,
  FileAudio,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface SoundFXPrivacyContentProps {
  app: AppItem;
}

export const SoundFXPrivacyContent: React.FC<SoundFXPrivacyContentProps> = ({ app }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-800 mb-3">
          <WifiOff className="w-4 h-4 text-violet-600" />
          100% Offline &amp; On-Device Audio Processing
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Privacy Policy for SoundFX Studio
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Last Updated: September 18, 2026 • Effective Date: September 18, 2026 • Application: {app.name} ({app.packageId})
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
          Welcome to <strong>SoundFX Studio</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your privacy and ensuring you have a secure experience when using our mobile application.
        </p>
        <p className="text-slate-700 text-sm leading-relaxed mt-2">
          This Privacy Policy explains how SoundFX Studio handles your information when you use our application.
        </p>
      </div>

      {/* Section 1: Core Principles */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
          Summary of Our Core Privacy Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">100% Offline Architecture</h3>
              <p className="text-xs text-slate-700 mt-1">
                SoundFX Studio operates locally on your mobile device without requiring any remote cloud dependencies.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Zero Personal Data Collection</h3>
              <p className="text-xs text-slate-700 mt-1">
                We do not collect, store, transmit, or sell your name, email address, phone number, location, device identifiers, or any personal data.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">No Analytics or Trackers</h3>
              <p className="text-xs text-slate-700 mt-1">
                The application contains no third-party telemetry, tracking libraries, profiling tools, or advertising SDKs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Private Audio Processing</h3>
              <p className="text-xs text-slate-700 mt-1">
                All voice morphing, DSP algorithms, and audio recordings remain strictly on your physical device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Permissions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
          Information We Access and How It Is Used
        </h2>
        <p className="text-slate-700">
          SoundFX Studio requests minimal device permissions strictly necessary to deliver audio editing and voice changing functionality:
        </p>

        <div className="space-y-3 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
              <Mic className="w-4 h-4" />
              <span>A. Microphone Access (<code>RECORD_AUDIO</code>)</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              <li><strong>Purpose:</strong> Required to allow you to record your voice and apply sound effects.</li>
              <li><strong>Scope:</strong> The microphone is accessed only when you explicitly press the Record button on the recording screen. We never record audio in the background or when the app is closed.</li>
              <li><strong>Handling:</strong> Audio streams are processed in real-time in your device&apos;s memory using on-device Digital Signal Processing (DSP) algorithms. Audio recordings are saved exclusively to your local device storage. Audio is never uploaded or transmitted to any remote server or cloud service.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
              <FileAudio className="w-4 h-4" />
              <span>B. Storage and Audio File Access (<code>READ_MEDIA_AUDIO</code> / <code>READ_EXTERNAL_STORAGE</code>)</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              <li><strong>Purpose:</strong> Required only if you choose to import existing audio files from your device into the app for editing.</li>
              <li><strong>Scope:</strong> The application accesses only the specific audio files you explicitly select via the system file picker. We do not scan, collect, or read any other files, photos, or documents on your device.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Data Storage & Security */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
          Data Storage and Security
        </h2>
        <div className="space-y-2.5 text-slate-700">
          <p>
            <strong>Local Storage:</strong> All recordings, exported files, and app settings (such as language preference) are saved directly in your device&apos;s internal app storage or the public music directory you choose.
          </p>
          <p>
            <strong>User Control:</strong> You maintain complete ownership and control over your audio files. You can delete, rename, lock, or export any recording at any time directly through the application interface.
          </p>
          <p>
            <strong>App Uninstall:</strong> If you uninstall SoundFX Studio or clear the app data via your Android device settings, all locally stored recordings in the app&apos;s private sandbox are automatically removed.
          </p>
        </div>
      </section>

      {/* Section 4: Third-Party Services */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
          Third-Party Services and Analytics
        </h2>
        <p className="text-slate-700">
          SoundFX Studio does not integrate third-party advertising networks, analytics platforms (such as Google Analytics or Firebase Crashlytics), or data brokers. No network requests are initiated by the application to send your data to any third party.
        </p>
      </section>

      {/* Section 5: Children's Privacy */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
          Children&apos;s Privacy (COPPA Compliance)
        </h2>
        <p className="text-slate-700">
          Our application does not knowingly collect or solicit personal information from children under the age of 13. Since SoundFX Studio does not collect any personal data from any user, it fully complies with the Children’s Online Privacy Protection Act (COPPA) and the European General Data Protection Regulation (GDPR).
        </p>
      </section>

      {/* Section 6: Rights and Choices */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
          Your Rights and Choices
        </h2>
        <p className="text-slate-700">
          Because we do not collect or store your personal information on any server, you have direct, autonomous control over your data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Deletion:</strong> You can delete any saved recording within the app with a single tap.</li>
          <li><strong>Revoking Permissions:</strong> You can review and revoke Microphone or Storage permissions at any time through your Android device settings (<em>Settings &gt; Apps &gt; SoundFX Studio &gt; Permissions</em>).</li>
        </ul>
      </section>

      {/* Section 7: Changes to Policy */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-700">
          We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. Any updates will be reflected in this document with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically.
        </p>
      </section>

      {/* Section 8: Contact */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
          Contact Us
        </h2>
        <p className="text-slate-700">
          If you have any questions, concerns, or feedback regarding this Privacy Policy or SoundFX Studio, please contact our developer support:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-600" />
            <span>{developer.email}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>Developer: {developer.name}</span>
        </div>
      </section>
    </div>
  );
};
