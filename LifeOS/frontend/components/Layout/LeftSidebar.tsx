import { History, Brain, Settings, HeartPulse, type LucideIcon } from "lucide-react";

type SidebarSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  emptyLabel: string | null;
};

const SECTIONS: SidebarSection[] = [
  { id: "ai-history", title: "AI History", icon: History, emptyLabel: "No conversations yet" },
  { id: "memory", title: "Memory", icon: Brain, emptyLabel: "No memories yet" },
  { id: "ai-settings", title: "AI Settings", icon: Settings, emptyLabel: null },
  { id: "health", title: "Health", icon: HeartPulse, emptyLabel: "No health data yet" },
];

export default function LeftSidebar() {
  return (
    <nav
      aria-label="LYRA sidebar"
      className="flex h-full min-w-0 flex-col overflow-y-auto overflow-x-hidden px-6 pt-6"
    >
      <div className="flex flex-col gap-6">
        {SECTIONS.map((section) => (
          <div
  key={section.id}
  aria-label={section.title}
  className="flex flex-col gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0"
>
            <button
              type="button"
              className="-ml-1 inline-flex w-fit items-center gap-2 rounded-control px-1 py-0.5 text-left transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <section.icon size={14} className="shrink-0 text-muted" />
              <span className="font-display text-sm font-semibold tracking-tight text-text">
                {section.title}
              </span>
            </button>

            {section.emptyLabel && (
              <p className="pl-1 text-[11px] text-faint">{section.emptyLabel}</p>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}