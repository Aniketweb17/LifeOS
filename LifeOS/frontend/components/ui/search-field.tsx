import { Search } from "lucide-react";

export function SearchField({ placeholder, shortcut }: { placeholder: string; shortcut?: string }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-control border border-border bg-surface-alt px-3 py-2">
      <Search size={15} className="shrink-0 text-faint" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent text-[13.5px] text-text outline-none placeholder:text-faint"
      />
      {shortcut && (
        <span className="shrink-0 rounded-[5px] border border-border px-1.5 py-0.5 font-mono text-[11px] text-faint">
          {shortcut}
        </span>
      )}
    </div>
  );
}
