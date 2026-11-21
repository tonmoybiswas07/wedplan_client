"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Menu } from "@base-ui/react/menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function WedPlanTheme({ children }: { children: ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</ThemeProvider>;
}

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeSwitcher() {
  const host = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const selected = (mounted && options.find(({ value }) => value === theme)) || options[2];

  return (
    <div ref={host} className="inline-flex">
    <Menu.Root modal={false}>
      <Menu.Trigger render={<Button variant="outline" size="icon" className="size-11 bg-paper text-ink" />}
        aria-label={`Color theme: ${selected.label}`} title="Color theme">
        <selected.Icon aria-hidden="true" className="size-5" />
      </Menu.Trigger>
      <Menu.Portal container={host}>
      <Menu.Positioner sideOffset={8} align="end" className="z-50">
        <Menu.Popup className="min-w-36 rounded-xl border border-line bg-paper p-1 text-ink shadow-lg">
          <Menu.RadioGroup value={selected.value} onValueChange={setTheme}>
            {options.map(({ value, label, Icon }) => (
              <Menu.RadioItem key={value} value={value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm outline-none data-highlighted:bg-blush">
                <Icon aria-hidden="true" className="size-4" />
                <span className="flex-1">{label}</span>
                <Menu.RadioItemIndicator><Check aria-hidden="true" className="size-4" /></Menu.RadioItemIndicator>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    </div>
  );
}

function subscribe() { return () => {}; }
