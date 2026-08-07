import { Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LyraAvatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";

const SUGGESTIONS = ["Plan my day", "Summarize this week's notes", "Draft a standup update"];

/**
 * The omnipresent entry point into Lyra, pinned to the top of the workspace
 * on every page. Presentational only — wiring it up to a real assistant is
 * left to the feature layer.
 */
export function LyraCommandBar() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <LyraAvatar />
        <input
          type="text"
          placeholder="Ask Lyra anything — plan your day, draft a note, find a file..."
          className="w-full flex-1 bg-transparent text-[14.5px] text-text outline-none placeholder:text-faint"
        />
        <IconButton
          label="Send to Lyra"
          className="h-[34px] w-[34px] shrink-0 rounded-control bg-primary text-white hover:bg-primary-hover hover:text-white"
        >
          <Send size={14} />
        </IconButton>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            className="rounded-full border border-border bg-surface-alt px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:text-text"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </Card>
  );
}
