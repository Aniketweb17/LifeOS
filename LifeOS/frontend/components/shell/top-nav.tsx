"use client";

import { Bell, ChevronsLeft, Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type TopNavProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
};

/**
 * Top-level application bar: logo, sidebar toggle, global search, and
 * quick actions (notifications, theme, account). No data fetching here —
 * purely chrome around the workspace.
 */
export function TopNav({ collapsed, onToggleSidebar }: TopNavProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-sidebar px-5">
      <div className="flex items-center gap-3.5">
        <IconButton label="Toggle sidebar" onClick={onToggleSidebar} className="hidden md:flex">
          <ChevronsLeft
            size={17}
            className={cn("transition-transform duration-200", collapsed && "rotate-180")}
          />
        </IconButton>

        <div className="flex items-center gap-2.5">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-control bg-primary">
            <span className="font-display text-[13px] font-bold text-white">L</span>
          </div>
          <span className="font-display text-base font-semibold tracking-tight">LifeOS</span>
        </div>
      </div>

      <div className="mx-6 hidden max-w-[420px] flex-1 sm:block">
        <SearchField placeholder="Search anything in your life..." shortcut="⌘K" />
      </div>

      <div className="flex items-center gap-3">
        <IconButton label="Notifications" className="relative">
          <Bell size={17} />
          <span className="absolute right-1 top-1 h-[7px] w-[7px] rounded-full bg-cyan" />
        </IconButton>

        <IconButton label={isDark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>

        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-control bg-primary-tint text-xs font-semibold text-primary">
          AR
        </div>
      </div>
    </header>
  );
}
