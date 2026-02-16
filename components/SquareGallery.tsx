import clsx from "clsx";

type Tone = "leaf" | "sun" | "mist";

type GalleryItem = {
  label: string;
  tone?: Tone;
};

type SquareGalleryProps = {
  items: GalleryItem[];
};

const toneClasses: Record<Tone, string> = {
  leaf: "bg-accent1/15",
  sun: "bg-accent2/15",
  mist: "bg-surface",
};

export default function SquareGallery({ items }: SquareGalleryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const tone = item.tone ?? (index % 2 === 0 ? "leaf" : "sun");
        return (
          <div
            key={`${item.label}-${index}`}
            className={clsx(
              "group relative aspect-square overflow-hidden rounded-2xl border border-text/10 p-4",
              toneClasses[tone]
            )}
          >
            <div className="relative flex h-full flex-col justify-end">
              <p className="text-sm font-semibold text-text/80">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
