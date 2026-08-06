import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavLinkProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

/**
 * A single, reusable navigation row. Used by the Sidebar for every entry,
 * including the pinned Settings item at the bottom.
 */
export function NavLink({ label, icon: Icon, active, collapsed, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left text-[13.5px] transition-colors",
        active
          ? "bg-primary-tint font-semibold text-primary"
          : "font-normal text-muted hover:bg-surface-alt hover:text-text"
      )}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
