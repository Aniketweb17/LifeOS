"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

function formatClock(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())} : ${pad(date.getMinutes())} : ${pad(date.getSeconds())}`;
}

function formatDate(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return { weekday, calendarDate: `${day} ${month} ${date.getFullYear()}` };
}

const LEFT_PANEL_SECTIONS = ["AI History", "Conversation History", "AI Settings", "Health"];
const RIGHT_PANEL_SECTIONS = ["Calendar", "Today's Tasks", "Upcoming Events", "Reminders"];

export default function RootLayout({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clock = now ? formatClock(now) : "00 : 00 : 00";
  const { weekday, calendarDate } = now ? formatDate(now) : { weekday: "", calendarDate: "" };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="flex h-screen w-full overflow-hidden bg-bg text-text">
            <aside className="hidden w-1/4 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border bg-sidebar p-6 lg:flex">
              {LEFT_PANEL_SECTIONS.map((title) => (
                <section key={title} className="flex flex-col gap-2">
                  <h2 className="font-display text-sm font-semibold tracking-tight text-text">{title}</h2>
                  <div className="min-h-24 rounded-card border border-border bg-surface p-4" />
                </section>
              ))}
            </aside>

            <div className="flex w-full flex-1 flex-col lg:w-1/2">
              <header className="flex h-1/5 shrink-0 flex-col items-center justify-center gap-1.5 border-b border-border">
                <span
                  className="font-mono text-4xl font-semibold tracking-widest text-text"
                  suppressHydrationWarning
                >
                  {clock}
                </span>
                <span className="text-sm text-muted" suppressHydrationWarning>
                  {weekday}
                  {weekday && " · "}
                  {calendarDate}
                </span>
              </header>

              <main className="flex flex-1 flex-col overflow-y-auto p-6">{children}</main>
            </div>

            <aside className="hidden w-1/4 shrink-0 flex-col gap-5 overflow-y-auto border-l border-border bg-sidebar p-6 xl:flex">
              {RIGHT_PANEL_SECTIONS.map((title) => (
                <section key={title} className="flex flex-col gap-2">
                  <h2 className="font-display text-sm font-semibold tracking-tight text-text">{title}</h2>
                  <div className="min-h-24 rounded-card border border-border bg-surface p-4" />
                </section>
              ))}
            </aside>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}