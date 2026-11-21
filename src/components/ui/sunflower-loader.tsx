import { Sparkles } from "lucide-react";

export function SunflowerLoader({ label = "Loading…", page = false }: {
  label?: string;
  page?: boolean;
}) {
  return (
    <div role="status" className={page ? "grid min-h-[55svh] place-items-center px-4 py-12" : "grid place-items-center px-4 py-8"}>
      <div className="flex flex-col items-center gap-3.5 text-center text-sm font-medium text-muted-foreground">
        <div aria-hidden="true" className="relative flex size-12 items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <span className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-75" />
          {/* Main spinning elegant ring */}
          <span className="size-10 rounded-full border-[2.5px] border-primary/20 border-t-primary animate-spin" />
          {/* Center glowing jewel/sparkle */}
          <span className="absolute flex size-5 items-center justify-center rounded-full bg-secondary text-primary">
            <Sparkles size={11} className="animate-pulse" />
          </span>
        </div>
        <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground/80">{label}</p>
      </div>
    </div>
  );
}
