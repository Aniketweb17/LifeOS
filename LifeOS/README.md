# LifeOS — application shell

This is the shell only: layout, navigation, and theming. No tasks, notes,
habits, or other domain data are wired up — every content area falls back
to a quiet placeholder until a real page is built on top of it.

## Structure

```
app/
  layout.tsx        Root layout — fonts, globals.css, ThemeProvider
  page.tsx           Renders <AppShell /> with no page content (placeholders show)
  globals.css        Design tokens (CSS variables) + Tailwind layers

components/
  theme-provider.tsx Light/dark mode: toggles the `dark` class on <html>

  shell/
    app-shell.tsx      Composes TopNav + Sidebar + LyraWorkspace + DailyHub.
                       Owns the sidebar collapsed/expanded flag — the only
                       state in the shell, purely a layout concern.
    top-nav.tsx        Logo, sidebar toggle, global search, theme + notifications
    sidebar.tsx        Primary nav; active item derived from usePathname()
    lyra-workspace.tsx Center panel — pins <LyraCommandBar /> above `children`
    lyra-command-bar.tsx  The "ask Lyra anything" input, always visible
    daily-hub.tsx      Right quick-glance panel; accepts `children` to override
                       its Calendar / Today / Habits placeholders

  ui/
    card.tsx           Card + CardHeader — base surface used across the shell
    nav-link.tsx        Single reusable sidebar row (icon + label + active state)
    icon-button.tsx     Accessible icon-only button (aria-label required)
    search-field.tsx    Search input with optional keyboard-shortcut hint
    lyra-avatar.tsx     The spinning gradient mark — LifeOS's signature element
    empty-state.tsx     Shared "nothing here yet" placeholder

lib/
  nav-items.ts    Static nav config (id, label, href, icon) — data, not logic
  utils.ts        `cn()` Tailwind class-merge helper
```

## Using the shell for a real page

Wrap a page's content in `<AppShell>` and pass it as `children` — it lands
inside the Lyra Workspace, below the command bar:

```tsx
// app/tasks/page.tsx
import { AppShell } from "@/components/shell/app-shell";

export default function TasksPage() {
  return (
    <AppShell>
      {/* real task list goes here */}
    </AppShell>
  );
}
```

Pass `dailyHub` the same way to replace the right panel's placeholders with
real widgets once there's data to show.

## Responsive behavior

- **Mobile (< md):** Sidebar and Daily Hub are hidden; the workspace takes
  the full width so the command bar and content stay usable on small screens.
- **Tablet (md – xl):** Sidebar appears (collapsible); Daily Hub stays hidden.
- **Desktop (xl+):** All three panels are visible.

## Running it

```bash
npm install
npm run dev
```
