"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { TopNav } from "@/components/shell/top-nav";
import { LyraWorkspace } from "@/components/shell/lyra-workspace";
import { DailyHub } from "@/components/shell/daily-hub";

type AppShellProps = {
  /** Contextual content for the center Lyra Workspace. */
  children?: ReactNode;
  /** Optional override for the right Daily Hub panel. */
  dailyHub?: ReactNode;
};

/**
 * Composes the four shell regions into the application frame.
 * The only state owned here is the sidebar's collapsed/expanded flag —
 * a layout concern, not application logic.
 */
export function AppShell({ children, dailyHub }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-bg text-text">
      <TopNav collapsed={collapsed} onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} />
        <LyraWorkspace>{children}</LyraWorkspace>
        <DailyHub>{dailyHub}</DailyHub>
      </div>
    </div>
  );
}
