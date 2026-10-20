import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppItem } from "@/data/apps";
import { PlayClickLink } from "@/components/blog/PlayClickLink";

export const AppCtaBanner: React.FC<{ app: AppItem; variant?: "inline" | "bottom"; lang?: "id" | "en" }> = ({
  app,
  variant = "bottom",
  lang = "id",
}) => {
  const isEn = lang === "en";
  const big = variant === "bottom";
  return (
    <aside className={`my-10 flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-slate-300 bg-white ${big ? "p-6 sm:p-8" : "p-5"}`}>
      <Image src={app.icon} alt="" width={big ? 80 : 56} height={big ? 80 : 56} className="rounded-2xl shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`font-display font-bold text-slate-900 ${big ? "text-2xl" : "text-lg"}`}>
          {big ? app.name : isEn ? `Try it in ${app.name}` : `Coba langsung di ${app.name}`}
        </p>
        <p className="mt-1 text-slate-700 text-sm sm:text-base leading-relaxed">{app.tagline}</p>
        {big && (
          <Link href={`/apps/${app.slug}/`} className="inline-flex items-center min-h-[44px] text-sm font-bold text-slate-900 underline underline-offset-4">
            {isEn ? "Screenshots and details" : "Screenshot dan detail"}
          </Link>
        )}
      </div>
      <PlayClickLink
        href={app.playUrl}
        slug={app.slug}
        name={app.name}
        source={big ? "banner_bottom" : "banner_inline"}
        className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shrink-0"
      >
        {isEn ? "Get on Google Play" : "Install di Google Play"}
      </PlayClickLink>
    </aside>
  );
};
