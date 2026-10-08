import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: "purple" | "cyan" | "pink" | "none";
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glow = "none",
  interactive = false,
  className,
  ...props
}) => {
  const glowStyles = {
    purple: "hover:border-purple-500/50 hover:shadow-neon-purple",
    cyan: "hover:border-cyan-500/50 hover:shadow-neon-cyan",
    pink: "hover:border-pink-500/50 hover:shadow-neon-pink",
    none: "hover:border-white/20",
  };

  return (
    <div
      className={cn(
        "rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 transition-all duration-300",
        interactive && "hover:-translate-y-1 hover:bg-white/[0.07]",
        interactive && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
