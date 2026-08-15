"use client";

import { useEffect, useState, type ReactNode } from "react";
import LyraWorkspace from "./lyra-workspace";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export type AppShellProps = {
  children?: ReactNode;
};

const LEFT_SECTIONS = ["AI History", "Memory", "AI Settings", "Health"];
const RIGHT_SECTIONS = ["Calendar", "Today's Tasks", "Upcoming Events", "Reminders"];

function formatClock(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())} : ${pad(date.getMinutes())} : ${pad(date.getSeconds())}`;
}

function formatDayDate(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday} · ${day} ${month} ${date.getFullYear()}`;
}

export default function AppShell({ children }: AppShellProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clock = now ? formatClock(now) : "00 : 00 : 00";
  const dayDate = now ? formatDayDate(now) : "";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-text">
      <aside className="hidden w-1/4 shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar lg:flex">
  <LeftSidebar />
</aside>

      <div className="flex h-full w-full flex-1 flex-col lg:w-1/2">
        <header className="flex h-1/5 shrink-0 flex-col items-center justify-center gap-1.5 border-b border-border">
          <span
            className="font-mono text-4xl font-semibold tracking-widest text-text"
            suppressHydrationWarning
          >
            {clock}
          </span>
          <span className="text-sm text-muted" suppressHydrationWarning>
            {dayDate}
          </span>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-8">
  <LyraWorkspace />
</main>
      </div>

      <aside className="hidden w-1/4 shrink-0 flex-col overflow-y-auto border-l border-border bg-sidebar lg:flex">
  <RightSidebar />
</aside>
    </div>
  );
}