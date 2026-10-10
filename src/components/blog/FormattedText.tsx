import React from "react";

interface FormattedTextProps {
  text?: string;
  className?: string;
  as?: "span" | "p" | "div";
}

// Regex to capture markdown inline tokens:
// 1. ***bold italic***
// 2. **bold**
// 3. *italic*
// 4. `code/key`
// 5. ==highlight==
const TOKEN_REGEX = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|==[^=]+==)/g;

export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className,
  as: Component = "span",
}) => {
  if (!text) return null;

  const parts = text.split(TOKEN_REGEX);

  const rendered = parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("***") && part.endsWith("***") && part.length > 6) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          <em className="italic">{part.slice(3, -3)}</em>
        </strong>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs sm:text-sm border border-slate-200 font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("==") && part.endsWith("==") && part.length > 4) {
      return (
        <mark
          key={index}
          className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium"
        >
          {part.slice(2, -2)}
        </mark>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });

  if (className || Component !== "span") {
    return <Component className={className}>{rendered}</Component>;
  }

  return <>{rendered}</>;
};

export default FormattedText;
