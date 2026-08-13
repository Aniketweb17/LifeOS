"use client";

import { useEffect, useState, type ReactNode } from "react";
import LyraWorkspace from "./lyra-workspace";

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
      <aside className="flex w-1/4 shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar lg:flex">
        {LEFT_SECTIONS.map((title) => (
          <section key={title} className="flex flex-1 flex-col border-b border-border px-6 py-6 last:border-b-0">
            <h2 className="font-display text-sm font-semibold tracking-tight text-text">{title}</h2>
            <p className="mt-2 text-xs text-faint">No data yet.</p>
          </section>
        ))}
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

      <aside className="flex w-1/4 shrink-0 flex-col overflow-y-auto border-l border-border bg-sidebar">
        {RIGHT_SECTIONS.map((title) => (
          <section key={title} className="flex flex-1 flex-col border-b border-border px-6 py-6 last:border-b-0">
            <h2 className="font-display text-sm font-semibold tracking-tight text-text">{title}</h2>
            <p className="mt-2 text-xs text-faint">No data yet.</p>
          </section>
        ))}
      </aside>
    </div>
  );
}