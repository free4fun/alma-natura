import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type SectionProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="pt-12 pb-8 md:pt-8 md:pb-16">
      <div className="mx-auto w-full max-w-6xl px-12 sm:px-16 lg:px-28">
        {title ? (
          <Reveal className="mb-10">
            <h2 className="section-title text-3xl md:text-4xl font-semibold text-text">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-4 text-lg text-text/80 max-w-3xl">
                {subtitle}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        <Reveal delay={100}>{children}</Reveal>
      </div>
    </section>
  );
}
