import { forwardRef, type HTMLAttributes, type PropsWithChildren } from "react";

type ViewportSectionProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    variant?: "standard" | "visual" | "dark" | "closing";
  }
>;

const ViewportSection = forwardRef<HTMLElement, ViewportSectionProps>(
  function ViewportSection(
    { children, className = "", variant = "standard", ...props },
    ref,
  ) {
    return (
      <section
        ref={ref}
        className={`section viewport-section viewport-section--${variant} ${className}`}
        {...props}
      >
        {children}
      </section>
    );
  },
);

export default ViewportSection;

