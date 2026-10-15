import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200": variant === "default",
          "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200": variant === "success",
          "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200": variant === "warning",
          "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200": variant === "error",
          "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200": variant === "info",
        },
        className
      )}
      {...props}
    />
  );
}
