import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-[25%_50%_25%]">
      {/* Left */}
      <aside>
        Left Sidebar
      </aside>

      {/* Center */}
      <main>
        {children}
      </main>

      {/* Right */}
      <aside>
        Right Sidebar
      </aside>
    </div>
  );
}
