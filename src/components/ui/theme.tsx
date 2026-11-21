"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";

export function WedPlanTheme({ children }: { children: ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</ThemeProvider>;
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return (
    <select aria-label="Color theme" value={mounted ? theme : "system"} onChange={(event) => setTheme(event.target.value)}
      className="h-10 min-w-20 rounded-lg border border-input bg-paper px-2 text-sm text-ink">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

function subscribe() { return () => {}; }
