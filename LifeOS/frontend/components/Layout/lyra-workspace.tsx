import { Sparkles } from "lucide-react";
import { LyraCommandBar } from "./lyra-command-bar";

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
  <LyraCommandBar />
</div>
    </div>
  );
}