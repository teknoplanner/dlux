"use client";

import React, { useState } from "react";
import { ListCollapse, ChevronDown } from "lucide-react";
import { ArticleSection } from "@/data/articles";

interface TableOfContentsProps {
  sections: ArticleSection[];
  lang?: "id" | "en";
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  lang = "id",
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!sections || sections.length === 0) return null;
  const isEn = lang === "en";

  return (
    <nav className="rounded-2xl bg-slate-50 border border-slate-200 p-5 my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-bold font-display text-slate-900 text-base focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <ListCollapse className="w-4 h-4 text-indigo-600" />
          <span>{isEn ? "Table of Contents" : "Daftar Isi Panduan"}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="mt-4 space-y-2.5 text-sm sm:text-base border-t border-slate-200/70 pt-3.5">
          {sections.map((sec) => (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors block leading-relaxed"
              >
                {sec.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#faq"
              className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors block leading-relaxed"
            >
              {isEn ? "Frequently Asked Questions (FAQ)" : "Pertanyaan yang Sering Diajukan (FAQ)"}
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};
