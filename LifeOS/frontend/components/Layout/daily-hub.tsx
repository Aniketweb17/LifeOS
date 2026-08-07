import type { ReactNode } from "react";
import { CalendarDays, ListChecks, Flame } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";

type DailyHubProps = {
  children?: ReactNode;
};

const PLACEHOLDER_SECTIONS = [
  { title: "Calendar", icon: CalendarDays, body: "Your month at a glance will appear here." },
  { title: "Today", icon: ListChecks, body: "Today's tasks will appear here." },
  { title: "Habits", icon: Flame, body: "Habit streaks will appear here." },
];

/**
 * The right-hand "Daily Hub" — a quick-glance panel, hidden below the xl
 * breakpoint to keep smaller screens focused on the main workspace. Accepts
 * `children` so real widgets (mini calendar, task list, habit tracker) can
 * be slotted in without changing the shell.
 */
export function DailyHub({ children }: DailyHubProps) {
  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-3.5 overflow-y-auto border-l border-border px-4 py-5 xl:flex">
      {children ??
        PLACEHOLDER_SECTIONS.map((section) => (
          <Card key={section.title} className="p-4">
            <CardHeader title={section.title} />
            <div className="flex items-center gap-2.5 text-[12.5px] text-faint">
              <section.icon size={14} />
              <span>{section.body}</span>
            </div>
          </Card>
        ))}
    </aside>
  );
}
