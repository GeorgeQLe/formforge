import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          {
            default: "bg-indigo-100 text-indigo-700",
            success: "bg-green-100 text-green-700",
            warning: "bg-amber-100 text-amber-700",
            destructive: "bg-red-100 text-red-700",
            outline: "border border-gray-300 text-gray-700",
          }[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
export { Badge };
