import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
};

/**
 * Purely presentational placeholder. Used wherever a panel has no content
 * to render yet — pages will replace this with real data-driven UI later.
 */
export function EmptyState({ icon: Icon, title, body }: EmptyStateProps) {
  return (
    <div className="flex max-w-[420px] flex-col items-start justify-center py-10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint">
        <Icon size={20} className="text-primary" />
      </div>
      <h2 className="mb-1.5 font-display text-xl font-semibold tracking-tight text-text">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
