import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { LyraCommandBar } from "@/components/Layout/lyra-command-bar";
import { EmptyState } from "@/components/ui/EmptyText";

type LyraWorkspaceProps = {
  children?: ReactNode;
};

/**
 * The center panel — the application's main stage. Always shows the Lyra
 * command bar, then renders whatever contextual content the current page
 * provides (dashboard, planner, notes editor, etc.) via `children`.
 */
export function LyraWorkspace({ children }: LyraWorkspaceProps) {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-7">
      <LyraCommandBar />
      <div className="mt-5">
        {children ?? (
          <EmptyState
            icon={Sparkles}
            title="Lyra is ready when you are"
            body="This is where your workspace comes alive — plans, notes, and progress will appear here as you use LifeOS."
          />
        )}
      </div>
    </main>
  );
}
