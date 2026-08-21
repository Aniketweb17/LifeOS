"use client";

import {
  CalendarDays,
  CalendarClock,
  Bell,
  type LucideIcon,
} from "lucide-react";
import Tasks from "../Widgets/Tasks";

type SidebarSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  emptyLabel: string;
};

const SECTIONS: SidebarSection[] = [
  {
    id: "calendar",
    title: "Calendar",
    icon: CalendarDays,
    emptyLabel: "No events today",
  },
  {
    id: "todays-tasks",
    title: "Today's Tasks",
    icon: CalendarDays,
    emptyLabel: "No tasks for today",
  },
  {
    id: "upcoming-events",
    title: "Upcoming Events",
    icon: CalendarClock,
    emptyLabel: "No upcoming events",
  },
  {
    id: "reminders",
    title: "Reminders",
    icon: Bell,
    emptyLabel: "No reminders",
  },
];

export default function RightSidebar() {
  return (
    <nav
      aria-label="LYRA daily hub"
      className="flex h-full min-w-0 flex-col overflow-y-auto overflow-x-hidden px-6 pt-6"
    >
      <div className="flex flex-col gap-6">
        {SECTIONS.map((section) =>
          section.id === "todays-tasks" ? (
            <div
  key={section.id}
  className="border-b border-border pb-4"
>
  <Tasks />
</div>
          ) : (
            <div
              key={section.id}
              aria-label={section.title}
              className="flex flex-col gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <button
                type="button"
                className="-ml-1 inline-flex w-fit items-center gap-2 rounded-control px-1 py-0.5 text-left transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <section.icon
                  size={14}
                  className="shrink-0 text-muted"
                />

                <span className="font-display text-sm font-semibold tracking-tight text-text">
                  {section.title}
                </span>
              </button>

              <p className="pl-1 text-[11px] text-faint">
                {section.emptyLabel}
              </p>
            </div>
          )
        )}
      </div>
    </nav>
  );
}