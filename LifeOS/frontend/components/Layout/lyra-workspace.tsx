// frontend/components/Layout/lyra-workspace.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { LyraCommandBar } from "./lyra-command-bar";

type ConversationRole = "user" | "lyra";

type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
};

export default function LyraWorkspace() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const hasMessages = messages.length > 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (content: string) => {
    const message: ConversationMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex shrink-0 flex-col items-center gap-1 px-6 py-6">
        <div className="flex items-center gap-2">
          <span
  className="h-1.5 w-1.5 shrink-0 rounded-full bg-black"
  aria-hidden="true"
/>
          <span className="font-display text-lg font-semibold tracking-tight text-text">
            LYRA
          </span>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
          Personal AI System
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6">
        {hasMessages ? (
          <div className="flex flex-1 flex-col justify-end gap-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "border border-border bg-surface text-text"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Sparkles size={16} className="text-faint" aria-hidden="true" />
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl">
                How can I help you?
              </p>
              <p className="text-sm text-faint">Your personal AI workspace</p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border px-4 py-5 sm:px-6">
        <LyraCommandBar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}