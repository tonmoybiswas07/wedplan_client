"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Menu, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./button";

export function ResponsiveDrawer({ title, kind, children }: {
  title: string; kind: "menu" | "filters"; children: ReactNode;
}) {
  const drawer = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const desktop = window.matchMedia(kind === "menu" ? "(min-width: 40rem)" : "(min-width: 64rem)");
    const close = () => { if (desktop.matches) drawer.current?.close(); };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, [kind]);

  const Icon = kind === "menu" ? Menu : SlidersHorizontal;
  return <>
    <Button variant="outline" size={kind === "menu" ? "icon" : "default"} className="h-10 min-w-10 bg-paper px-2.5"
      type="button" aria-label={title} aria-haspopup="dialog" aria-controls={id} onClick={() => drawer.current?.showModal()}>
      <Icon aria-hidden="true" />{kind === "filters" && "Filters"}
    </Button>
    <dialog id={id} aria-labelledby={id + "-title"} ref={drawer}
      className="fixed inset-y-0 end-0 start-auto m-0 h-dvh max-h-none w-[min(90vw,25rem)] max-w-none overflow-y-auto border-s border-line bg-paper p-5 text-ink backdrop:bg-overlay/65">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-line pb-4">
        <h2 id={id + "-title"} className="font-display text-2xl">{title}</h2>
        <Button variant="ghost" size="icon" type="button" aria-label={`Close ${title.toLowerCase()}`} onClick={() => drawer.current?.close()}><X aria-hidden="true" /></Button>
      </div>
      <div onClick={(event) => {
        if (kind === "menu" && event.target instanceof Element && event.target.closest("a")) drawer.current?.close();
      }} onSubmit={() => { if (kind === "filters") drawer.current?.close(); }}>{children}</div>
    </dialog>
  </>;
}
