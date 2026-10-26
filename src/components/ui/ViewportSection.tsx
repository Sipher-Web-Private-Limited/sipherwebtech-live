import type { HTMLAttributes, PropsWithChildren } from "react";

type ViewportSectionProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    variant?: "standard" | "visual" | "dark" | "closing";
  }
>;

export default function ViewportSection({
  children,
  className = "",
  variant = "standard",
  ...props
}: ViewportSectionProps) {
  return (
    <section
      className={`section viewport-section viewport-section--${variant} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
