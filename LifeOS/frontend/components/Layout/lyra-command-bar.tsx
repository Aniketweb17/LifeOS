// frontend/components/Layout/lyra-command-bar.tsx
"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

type LyraCommandBarProps = {
  onSubmit?: (message: string) => void;
};

export function LyraCommandBar({ onSubmit }: LyraCommandBarProps) {
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = value.trim();
    if (!message) return;

    if (onSubmit) {
      onSubmit(message);
    } else {
      console.log("LYRA command:", message);
    }
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm transition-colors duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/15">
        <label htmlFor="lyra-command-input" className="sr-only">
          Ask LYRA anything
        </label>
        <input
          id="lyra-command-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask LYRA anything..."
          autoComplete="off"
          className="flex-1 bg-transparent text-sm leading-6 text-text outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors duration-150 hover:bg-grey-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-faint disabled:opacity-60"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </form>
  );
}