const petals = Array.from({ length: 12 }, (_, index) => index * 30);

export function SunflowerLoader({ label = "Loading…", page = false }: {
  label?: string;
  page?: boolean;
}) {
  return (
    <div role="status" className={page ? "grid min-h-[55svh] place-items-center px-4 py-10" : "grid place-items-center px-4 py-8"}>
      <div className="flex flex-col items-center gap-3 text-center text-sm font-medium text-muted-foreground">
        <span aria-hidden="true" className="relative block size-14 motion-safe:animate-[spin_2.8s_linear_infinite]">
          {petals.map((angle) => (
            <span key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
              <span className="absolute start-1/2 top-0 h-4 w-2.5 -translate-x-1/2 rounded-full bg-amber-400 dark:bg-amber-300" />
            </span>
          ))}
          <span className="absolute inset-3.5 rounded-full border-2 border-amber-700 bg-amber-950 dark:border-amber-600" />
        </span>
        {label}
      </div>
    </div>
  );
}
