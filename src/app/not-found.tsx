import React from "react";
import { Gamepad2, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-16 px-4 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
          <Gamepad2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ERROR 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 pt-2">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            The page or application you are looking for might have been moved, renamed, or is unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md" className="w-full sm:w-auto bg-slate-900 text-white font-bold">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
          <Button href="/#apps" variant="outline" size="md" className="w-full sm:w-auto bg-white border-slate-300 text-slate-900 hover:bg-slate-50 font-bold">
            <Gamepad2 className="w-4 h-4 text-emerald-600" />
            Browse Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
