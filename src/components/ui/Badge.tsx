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
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    green: "bg-green-500/15 text-green-300 border-green-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    outline: "bg-white/5 text-gray-300 border-white/10",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium tracking-wide",
    md: "px-3 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border backdrop-blur-md uppercase tracking-wider",
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
