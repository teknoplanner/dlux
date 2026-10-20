import React from "react";
import { ArticleSection } from "@/data/articles";

export const TableOfContents: React.FC<{ sections: ArticleSection[]; lang?: "id" | "en"; hasFaq?: boolean }> = ({
  sections,
  lang = "id",
  hasFaq = true,
}) => {
  if (!sections?.length) return null;
  const isEn = lang === "en";
  return (
    <nav aria-label={isEn ? "Table of contents" : "Daftar isi"} className="text-sm">
      <p className="font-display font-bold text-slate-900 mb-2">{isEn ? "On this page" : "Isi artikel"}</p>
      <ol className="space-y-1 list-decimal pl-5 marker:text-slate-500">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="inline-block py-1 text-slate-700 hover:text-emerald-800 hover:underline underline-offset-4">
              {s.title}
            </a>
          </li>
        ))}
        {hasFaq && (
          <li>
            <a href="#faq" className="inline-block py-1 text-slate-700 hover:text-emerald-800 hover:underline underline-offset-4">
              FAQ
            </a>
          </li>
        )}
      </ol>
    </nav>
  );
};
