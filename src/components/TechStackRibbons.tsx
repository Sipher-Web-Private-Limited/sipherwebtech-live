import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import "./TechStackRibbons.css";

const RIBBON_LANES = [
  {
    label: "Technology capabilities",
    className: "tech-ribbons__lane--technology",
    reverse: false,
    items: [
      "Websites",
      "Custom Software",
      "SaaS",
      "Business Systems",
      "E-Commerce",
      "Mobile Apps",
      "API Integration",
      "AI & Automation",
    ],
  },
  {
    label: "Connected disciplines",
    className: "tech-ribbons__lane--disciplines",
    reverse: true,
    items: [
      "Engineering",
      "Digital Growth",
      "SEO",
      "Social Media",
      "Creative",
      "UI/UX",
      "Branding",
      "Strategy",
    ],
  },
] as const;

function RibbonLane({
  label,
  className,
  reverse,
  items,
  prefersReducedMotion,
}: {
  label: string;
  className: string;
  reverse: boolean;
  items: readonly string[];
  prefersReducedMotion: boolean;
}) {
  const copies = prefersReducedMotion ? [0] : [0, 1];

  return (
    <div className={`tech-ribbons__lane ${className}`}>
      <div className="tech-ribbons__window" role="group" aria-label={label}>
        <div
          className={`tech-ribbons__track${reverse ? " tech-ribbons__track--reverse" : ""}`}
          aria-hidden="true"
        >
          {copies.map((copy) => (
            <div className="tech-ribbons__sequence" key={copy}>
              {items.map((item) => (
                <span className="tech-ribbons__unit" key={item}>
                  <span className="tech-ribbons__item">{item}</span>
                  <span className="tech-ribbons__star">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TechStackRibbons() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "600px 0px 600px 0px" });

  return (
    <section
      ref={sectionRef}
      className={`tech-ribbons${isInView ? " is-in-view" : ""}${prefersReducedMotion ? " tech-ribbons--static" : ""}`}
      aria-label="Sipher Web services and disciplines"
    >
      <p className="tech-ribbons__sr-only">
        Sipher Web connects technology capabilities—websites, custom software,
        SaaS, business systems, e-commerce, mobile apps, API integration, and AI
        automation—with digital growth, SEO, social media, creative, UI/UX,
        branding, and strategy.
      </p>
      {RIBBON_LANES.map((lane) => (
        <RibbonLane
          key={lane.label}
          {...lane}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
        />
      ))}
    </section>
  );
}
