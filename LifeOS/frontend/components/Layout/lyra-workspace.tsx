// frontend/components/Layout/lyra-workspace.tsx
import { LyraCommandBar } from "./lyra-command-bar";

export default function LyraWorkspace() {
  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex shrink-0 flex-col items-center gap-1.5 px-6 py-8">
        <span className="font-display text-base font-semibold tracking-tight text-text">
          LYRA
        </span>
        <span className="text-xs text-faint">Personal AI System</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-y-auto px-6 text-center">
        <p className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl">
          How can I help you?
        </p>
        <p className="text-sm text-faint">Your personal AI workspace</p>
      </div>

      <div className="shrink-0 border-t border-border px-4 py-5 sm:px-6">
        <LyraCommandBar />
      </div>
    </div>
  );
}