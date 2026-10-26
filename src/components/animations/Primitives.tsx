import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  amount = 0.18,
}: PropsWithChildren<{
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "zoom";
  amount?: number;
}>) {
  const reduced = useReducedMotion();
  const hidden = {
    up: { opacity: 0, y: 44, x: 0, scale: 1, clipPath: "inset(0 0 10% 0)" },
    left: { opacity: 0, y: 0, x: -64, scale: 1, clipPath: "inset(0 18% 0 0)" },
    right: { opacity: 0, y: 0, x: 64, scale: 1, clipPath: "inset(0 0 0 18%)" },
    zoom: { opacity: 0, y: 18, x: 0, scale: 0.94, clipPath: "inset(7% 7% 7% 7%)" },
  }[direction];

  return (
    <motion.div
      className={className}
      initial={reduced ? false : hidden}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduced ? 0 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ImageReveal({
  children,
  className = "",
  direction = "left",
}: PropsWithChildren<{
  className?: string;
  direction?: "left" | "right";
}>) {
  const reduced = useReducedMotion();
  const clipPath = direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  return (
    <motion.div
      className={`image-reveal ${className}`}
      initial={reduced ? false : { opacity: 0, clipPath }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduced ? 0 : 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="image-reveal__inner"
        initial={reduced ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: reduced ? 0 : 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function TextReveal({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`text-reveal ${className}`} aria-label={children}>
      {children.split(" ").map((word, index) => (
        <span className="text-reveal__mask" aria-hidden="true" key={`${word}-${index}`}>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: "105%", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.14 + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
}) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="section-heading__title">{title}</h2>
      {copy && <p className="section-heading__copy">{copy}</p>}
    </Reveal>
  );
}
