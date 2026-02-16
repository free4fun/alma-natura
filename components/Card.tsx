import type { ReactNode } from "react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";

type CardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  titleClassName?: string;
};

export default function Card({ title, children, className, icon, titleClassName }: CardProps) {
  return (
    <Reveal>
      <article
        className={clsx(
          "rounded-2xl border border-accent2/30 bg-accent2/10 p-6 shadow-soft transition-shadow hover:shadow-md h-full flex flex-col",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {icon ? (
            <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-full bg-accent2/30 text-accent2 shrink-0">
              {icon}
            </div>
          ) : null}
          <h3 className={clsx("text-xl font-semibold text-text", titleClassName)}>
            {title}
          </h3>
        </div>
        <div className="mt-4 text-text/80 flex-1 flex flex-col gap-3">
          {children}
        </div>
      </article>
    </Reveal>
  );
}
