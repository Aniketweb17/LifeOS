import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

/**
 * Presentational icon-only button. `label` is required for accessibility
 * (rendered as aria-label) even though it isn't shown visually.
 */
export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-alt hover:text-text",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
