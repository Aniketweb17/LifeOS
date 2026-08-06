"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_ITEM } from "../../lib/nav-items";
import { NavLink } from "@/components/ui/nav-link";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
};

/**
 * Primary left-hand navigation. Reads the active route from the URL —
 * no local or global application state involved.
 */
export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "hidden shrink-0 flex-col gap-0.5 border-r border-border bg-sidebar p-3 transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </div>

      <div className="border-t border-border pt-2">
        <NavLink
          label={SETTINGS_ITEM.label}
          icon={SETTINGS_ITEM.icon}
          active={pathname === SETTINGS_ITEM.href}
          collapsed={collapsed}
        />
      </div>
    </nav>
  );
}
