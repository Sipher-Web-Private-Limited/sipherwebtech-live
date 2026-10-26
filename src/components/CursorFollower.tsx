import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 550, damping: 38 });
  const springY = useSpring(y, { stiffness: 550, damping: 38 });
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      setLabel(target?.dataset.cursor || (target ? "" : ""));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return <motion.div className={`cursor ${label ? "cursor--label" : ""}`} style={{ x: springX, y: springY }} animate={{ opacity: visible ? 1 : 0, scale: label ? 1 : 0.5 }}>{label && <span>{label}</span>}</motion.div>;
}
