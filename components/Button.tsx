import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: Variant;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm md:text-base font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-sm hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent1 !text-[var(--background)] hover:bg-accent2 focus-visible:outline-accent1",
  outline:
    "bg-accent2 !text-[var(--background)] hover:bg-accent1 focus-visible:outline-accent1",
};

export default function Button({
  href,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={clsx(baseClasses, variantClasses[variant], className)}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
