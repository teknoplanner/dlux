import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Mail, ArrowLeft, Gamepad2, ExternalLink } from "lucide-react";
import { developer } from "@/data/apps";
import { ContactForm } from "@/components/contact/ContactForm";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact & Developer Support | D Lucky X",
  description:
    "Get in touch with D Lucky X developer team for support, feature inquiries, bug reports, and partnership opportunities.",
  alternates: {
    canonical: `${developer.website}/contact/`,
  },
  openGraph: {
    title: "Contact & Developer Support | D Lucky X",
    description:
      "Get in touch with D Lucky X developer team for support, feature inquiries, bug reports, and partnership opportunities.",
    url: `${developer.website}/contact/`,
    type: "website",
  },
};

export default function ContactPage() {
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Contact Developer", url: `${developer.website}/contact/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
              <Mail className="w-4 h-4" />
              CONTACT DEVELOPER
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
              Contact &amp; Support
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Have questions about our games or applications, technical reports, or collaboration proposals? The D Lucky X team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Col: Contact Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Support Email
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send a message directly to our developer inbox for a prompt response within 1-2 business days.
                </p>
                <a
                  href={`mailto:${developer.email}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-900 hover:bg-slate-100 transition-all font-mono text-sm"
                >
                  <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="truncate">{developer.email}</span>
                </a>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Google Play Store
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore our full catalog of releases, update logs, and player reviews directly on Google Play.
                </p>
                <a
                  href={developer.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-emerald-600" />
                    Google Play Developer Profile
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Right Col: Contact Form Component */}
            <div className="md:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
