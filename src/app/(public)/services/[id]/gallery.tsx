"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServiceGallery({ photos, title }: { photos: string[]; title: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <section aria-label="Service photos">
      <div className="border border-line bg-paper p-1.5 sm:p-2">
        <div className="grid aspect-[4/3] place-items-center overflow-hidden border border-line bg-sage/60 text-earth sm:aspect-[16/10]">
          {photos[selected] ? (
            // eslint-disable-next-line @next/next/no-img-element -- Vendor photos are served by ImgBB.
            <img src={photos[selected]} alt={photos.length > 1 ? `${title}, photo ${selected + 1}` : title} className="size-full object-cover" />
          ) : (
            <div className="grid place-items-center gap-2 text-sm"><ImageIcon aria-hidden="true" />No photos available</div>
          )}
        </div>
      </div>
      {photos.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <li key={photo}>
              <button type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={selected === index}
                onClick={() => setSelected(index)}
                className={cn("block aspect-square w-16 cursor-pointer overflow-hidden border bg-paper p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth sm:w-20", selected === index ? "border-ink" : "border-line")}>
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
