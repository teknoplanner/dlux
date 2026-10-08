"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, Gamepad2, ExternalLink } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-static";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
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

          {/* Right Col: Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out to D Lucky X. We will review your message as soon as possible.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-800 hover:bg-slate-50 font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                    Send a Message
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Bug Report / Suggestion / Partnership"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-bold"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
