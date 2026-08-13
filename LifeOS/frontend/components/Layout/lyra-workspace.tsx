import { ArrowUp, Sparkles } from "lucide-react";

export default function LyraWorkspace() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex shrink-0 flex-col items-center gap-1.5 py-8">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="font-display text-base font-semibold tracking-tight text-text">
            LYRA
          </span>
        </div>

        <span className="text-xs text-faint">
          Personal AI System
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 overflow-y-auto px-6">
        <p className="font-display text-2xl font-semibold tracking-tight text-text">
          How can I help you?
        </p>

        <p className="text-sm text-faint">
          Your personal AI workspace
        </p>
      </div>

      <div className="shrink-0 px-6 pb-8 pt-4">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full border border-border bg-surface px-5 py-3.5">
          <span className="flex-1 text-sm text-faint">
            Ask LYRA anything...
          </span>

          <button
            type="button"
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}