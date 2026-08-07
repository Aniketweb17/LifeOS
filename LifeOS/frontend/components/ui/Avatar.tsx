import { Sparkles } from "lucide-react";

/**
 * LifeOS's signature mark: a slow-spinning conic gradient ring representing
 * Lyra as an ambient, "always-on" presence rather than a static chat icon.
 */
export function LyraAvatar({ size = 34 }: { size?: number }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-[11px]"
      style={{
        width: size,
        height: size,
        background:
          "conic-gradient(from 180deg, var(--primary), var(--purple), var(--cyan), var(--primary))",
        animation: "lyra-spin 6s linear infinite",
      }}
    >
      <div
        className="flex items-center justify-center rounded-[8px] bg-surface"
        style={{ width: size - 8, height: size - 8 }}
      >
        <Sparkles size={size * 0.38} className="text-primary" />
      </div>
    </div>
  );
}
