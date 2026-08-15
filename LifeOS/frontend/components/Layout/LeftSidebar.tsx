// frontend/components/Layout/LeftSidebar.tsx
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
      className="flex h-full min-w-0 flex-col overflow-y-auto overflow-x-hidden"
    >
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          aria-label={section.title}
          className="border-b border-border px-6 py-6 last:border-b-0"
        >
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-control text-left transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <section.icon size={15} className="shrink-0 text-muted" />
            <span className="font-display text-sm font-semibold tracking-tight text-text">
              {section.title}
            </span>
          </button>

          {section.emptyLabel && (
            <p className="mt-2.5 text-xs text-faint">{section.emptyLabel}</p>
          )}
        </section>
      ))}
    </nav>
  );
}