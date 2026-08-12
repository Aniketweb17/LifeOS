import type { Metadata } from "next";
import { ThemeProvider } from "@/frontend/components/Providers/ThemeProvider";
import AppShell from "@/frontend/components/Layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeOS",
  description: "The operating system for your life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
  <AppShell>{children}</AppShell>
</ThemeProvider>
      </body>
    </html>
  );
}
