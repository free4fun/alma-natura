import type { ReactNode } from "react";
import clsx from "clsx";

type CalloutProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Callout({ title, children, className }: CalloutProps) {
  return (
    <aside
      className={clsx(
        "rounded-2xl border border-accent2/30 bg-accent2/10 p-6 text-text",
        className
      )}
    >
     
      <div className="mt-3 text-text/80 leading-relaxed">{children}</div>
    </aside>
  );
}
