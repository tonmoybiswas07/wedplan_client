"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServiceGallery({ photos, title }: { photos: string[]; title: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <section aria-label="Service gallery" className="grid gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        {photos[selected] ? (
          // eslint-disable-next-line @next/next/no-img-element -- Vendor photos are served by ImgBB.
          <img 
            src={photos[selected]} 
            alt={photos.length > 1 ? `${title}, photo ${selected + 1}` : title} 
            className="size-full object-cover transition-all duration-500" 
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageIcon size={32} aria-hidden="true" />
            <span>No photos uploaded yet</span>
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <ul className="flex flex-wrap gap-2.5">
          {photos.map((photo, index) => (
            <li key={photo}>
              <button 
                type="button" 
                aria-label={`View photo ${index + 1}`} 
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
                className={cn(
                  "relative aspect-square w-20 cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected === index ? "border-primary ring-2 ring-primary/20 scale-95" : "border-border opacity-70"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Vendor photos are served by ImgBB. */}
                <img src={photo} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
