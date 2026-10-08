import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  FileText,
  ArrowLeft,
  Mail,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { apps, developer } from "@/data/apps";
import { Badge } from "@/components/ui/Badge";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) return { title: "Terms of Service Not Found" };

  return {
    title: `Terms of Service: ${app.name}`,
    description: `Official public Terms of Service for Android application ${app.name} (${app.packageId}).`,
  };
}

export default function AppTermsPage({ params }: PageProps) {
  const app = apps.find((a) => a.slug === params.slug);

  if (!app) {
    notFound();
  }

  const isKucingAturDuit = app.slug === "kucing-atur-duit";
  const isPdfEditor = app.slug === "offline-pdf-editor";

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to General Terms of Service
          </Link>

          <Link
            href={`/apps/${app.slug}`}
            className="text-xs text-slate-700 hover:text-slate-900 font-semibold underline flex items-center gap-1"
          >
            {app.name} Overview &rarr;
          </Link>
        </div>

        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <FileText className="w-4 h-4 text-indigo-600" />
            PUBLIC TERMS OF SERVICE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Terms of Service: {app.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span>Package ID: <code className="text-slate-700 font-mono font-semibold">{app.packageId}</code></span>
            <span>•</span>
            <span>Developer: {developer.name}</span>
            <span>•</span>
            <span>Effective Date: October 8, 2026</span>
          </div>
        </div>

        {/* Highlight Banner specifically for Kucing Atur Duit */}
        {isKucingAturDuit && (
          <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-6 sm:p-8 shadow-sm mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-amber-950 font-display">
                  Important Financial Disclaimer for Kucing Atur Duit
                </h2>
                <p className="text-xs sm:text-sm text-amber-900/90 mt-0.5">
                  Personal expense tracking &amp; calculation tool only.
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong>Kucing Atur Duit</strong> is an offline, self-directed personal expense recording and budget management tool. It does <strong>not</strong> provide banking, investment, financial advisory, loan, or brokerage services, and does not process real monetary transactions.
            </p>
          </div>
        )}

        {/* Detailed Agreement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">1. Introduction &amp; Agreement</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong>{app.name}</strong> (&quot;Application&quot; or &quot;App&quot;), distributed under Android Package ID <code className="text-slate-800 font-mono">{app.packageId}</code> by <strong>{developer.name}</strong> (&quot;Developer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              By downloading, installing, accessing, or using the Application from Google Play, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not accept these Terms, do not install or use this Application.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="cyan">
                Application: {app.name}
              </Badge>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Rated {app.contentRating || "3+"}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                On-Device Storage
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">2. Grant of License</h2>
            <p>
              {developer.name} grants you a revocable, non-exclusive, non-transferable, limited personal license to install and use the Application on Android devices that you own or control, solely for personal and non-commercial purposes in accordance with these Terms.
            </p>
            <p>
              You agree not to reverse engineer, decompile, disassemble, rent, lease, sublicense, distribute, or create derivative works based on the Application or any part thereof.
            </p>
          </section>

          {isKucingAturDuit && (
            <>
              <section className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  3. Nature of Service &amp; Non-Financial Disclaimer
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong>Not a Bank or Financial Institution:</strong> Kucing Atur Duit is purely a personal budgeting utility. We do not provide banking accounts, money transfer services, payment processing, investment advice, lending, or tax planning.
                  </li>
                  <li>
                    <strong>No Real Monetary Operations:</strong> The app does not connect directly to banking credentials, does not hold user funds, and cannot execute deposits or withdrawals. Any currency amounts shown are entered manually by the user for tracking purposes.
                  </li>
                  <li>
                    <strong>Informational Purposes Only:</strong> All reports, charts, calculation results, and budget thresholds generated by Kucing Atur Duit are provided for general organizational and informational convenience only. You are solely responsible for evaluating your financial circumstances and making your own financial decisions.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 font-display">4. User Data Ownership &amp; Local Storage</h2>
                <p>
                  All transaction records, account names, and budget configurations created within Kucing Atur Duit are stored exclusively within the internal memory of your mobile device.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Zero Cloud Telemetry:</strong> We do not transmit or store your financial entries on external cloud servers.</li>
                  <li><strong>User Backup Responsibility:</strong> Because your data resides purely on your device, {developer.name} cannot recover records lost due to device damage, uninstallation, operating system restoration, or device replacement. You are encouraged to utilize the app&apos;s local backup feature regularly.</li>
                  <li><strong>Access Protection:</strong> You are responsible for safeguarding your smartphone with biometric authentication, PIN codes, or pattern locks.</li>
                </ul>
              </section>
            </>
          )}

          {isPdfEditor && (
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                3. Document Processing &amp; User Content
              </h2>
              <p>
                Offline PDF Editor &amp; Sign operates 100% locally on your device. The Application does not upload, review, or store your documents, signatures, or contracts on remote servers. You retain full ownership and sole legal responsibility for any documents you view, sign, merge, or convert.
              </p>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {isKucingAturDuit ? "5. Intellectual Property Rights" : "3. Intellectual Property Rights"}
            </h2>
            <p>
              All rights, titles, and interests in and to {app.name}, including character designs (such as the cat mascots), graphical artwork, logos, icons, user interfaces, audio effects, and underlying software code, are the exclusive property of <strong>{developer.name}</strong> and are protected by applicable copyright and intellectual property laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {isKucingAturDuit ? "6. Disclaimer of Warranties" : "4. Disclaimer of Warranties"}
            </h2>
            <p>
              The Application is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              {developer.name} does not warrant that the Application will function without interruption, remain error-free, or be compatible with every mobile hardware and Android OS variation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {isKucingAturDuit ? "7. Limitation of Liability" : "5. Limitation of Liability"}
            </h2>
            <p>
              To the fullest extent permissible by applicable law, in no event shall {developer.name} be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including loss of data, loss of business, device malfunctions, or financial discrepancies) arising from your use of or inability to use the Application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {isKucingAturDuit ? "8. Termination &amp; Modification" : "6. Termination &amp; Modification"}
            </h2>
            <p>
              We reserve the right to amend, update, or discontinue {app.name} or these Terms at any time without prior liability. Your continued use of the Application after revisions are posted constitutes your binding acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {isKucingAturDuit ? "9. Contact &amp; Legal Notices" : "7. Contact &amp; Legal Notices"}
            </h2>
            <p>
              If you have any questions, inquiries, or notices regarding these Terms of Service for {app.name}, please contact us via email:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-2 text-slate-900 font-mono text-xs">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{developer.email}</span>
              </div>
              <a
                href={app.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center gap-2 shadow-2xs"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Official Google Play Listing</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
