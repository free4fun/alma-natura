import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "leaf" | "sun" | "mist";

type ColorSectionProps = {
  title?: string;
  subtitle?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  leaf: "bg-transparent",
  sun: "bg-transparent",
  mist: "bg-transparent",
};

export default function ColorSection({
  title,
  subtitle,
  tone = "leaf",
  children,
  className,
}: ColorSectionProps) {
  return (
    <section
      className={clsx(
        "py-16 md:py-20",
        toneClasses[tone],
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-8 sm:px-10 lg:px-16">
        {title ? (
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-text">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-4 text-lg text-text/80 max-w-3xl">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
