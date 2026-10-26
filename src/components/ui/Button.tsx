import { ArrowUpRight } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type ButtonProps = PropsWithChildren<{
  to: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  cursorLabel?: string;
}>;

export default function Button({
  to,
  children,
  variant = "primary",
  className = "",
  cursorLabel = "OPEN",
}: ButtonProps) {
  return (
    <Link
      to={to}
      className={`button button--${variant} ${className}`}
      data-cursor={cursorLabel}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={18} />
    </Link>
  );
}
