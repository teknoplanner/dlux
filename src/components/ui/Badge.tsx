import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "purple" | "cyan" | "pink" | "green" | "amber" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "purple",
  size = "md",
  className,
  ...props
}) => {
  const variantStyles = {
    purple: "bg-purple-50 text-purple-900 border-purple-200 font-bold",
    cyan: "bg-sky-50 text-sky-900 border-sky-200 font-bold",
    pink: "bg-pink-50 text-pink-900 border-pink-200 font-bold",
    green: "bg-emerald-50 text-emerald-900 border-emerald-200 font-bold",
    amber: "bg-amber-50 text-amber-950 border-amber-200 font-bold",
    outline: "bg-slate-50 text-slate-800 border-slate-200 font-bold",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold tracking-wide",
    md: "px-3 py-1 text-xs font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border uppercase tracking-wider shadow-2xs",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
