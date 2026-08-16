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

function generateLyraResponse(message: string) {
  const input = message.toLowerCase().trim();

  if (
    input.includes("hello") ||
    input.includes("hi") ||
    input.includes("hey")
  ) {
    return "Hello! I'm LYRA. How can I help you?";
  }

  if (
    input.includes("who are you") ||
    input.includes("what are you")
  ) {
    return "I'm LYRA, your personal AI system.";
  }

  if (
    input.includes("what can you do") ||
    input.includes("what can you help")
  ) {
    return "I can help you manage tasks, reminders, planning, information, and your personal workspace.";
  }

  if (input.includes("thank")) {
    return "You're welcome!";
  }

  if (
    input.includes("good morning") ||
    input.includes("good afternoon") ||
    input.includes("good evening")
  ) {
    return "Hello! How can I help you today?";
  }

  return "I understand your message. I'm still learning how to handle this type of request.";
}

export default function LyraWorkspace() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const hasMessages = messages.length > 0;

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
  const container = messagesContainerRef.current;

  if (!container) return;

  container.scrollTop = container.scrollHeight;
}, [messages]);

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (content: string) => {
    const userMessage: ConversationMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
    }

    thinkingTimeoutRef.current = setTimeout(() => {
      const lyraMessage: ConversationMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role: "lyra",
        content: generateLyraResponse(content),
      };

      setMessages((prev) => [...prev, lyraMessage]);
      setIsThinking(false);
      thinkingTimeoutRef.current = null;
    }, 1000);
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex shrink-0 flex-col items-center gap-1 px-6 py-6">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />

          <span className="font-display text-lg font-semibold tracking-tight text-text">
            LYRA
          </span>
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
          Personal AI System
        </span>
      </div>

      <div
  ref={messagesContainerRef}
  className="flex min-h-0 flex-1 flex-col overflow-y-scroll px-6"
>
        {hasMessages ? (
          <div className="flex flex-col gap-5 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <p
                  className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "border border-border bg-surface text-text"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isThinking && (
  <div className="flex h-[50px] shrink-0 items-start justify-start">
                <div
                  role="status"
                  aria-label="LYRA is thinking"
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <span className="sr-only">LYRA is thinking</span>

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint" />
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Sparkles
              size={16}
              className="text-faint"
              aria-hidden="true"
            />

            <div className="flex flex-col gap-1.5">
              <p className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl">
                How can I help you?
              </p>

              <p className="text-sm text-faint">
                Your personal AI workspace
              </p>
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