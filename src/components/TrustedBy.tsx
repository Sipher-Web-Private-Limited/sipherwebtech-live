import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCmsContent } from "../content/CmsContentProvider";
import "./TrustedBy.css";

const DEFAULT_CLIENTS = [
  "ZenMedia",
  "AlphaStudio",
  "BlueForge",
  "CrestGroup",
  "OmniLogic",
  "StellarBrand",
  "VistaCorp",
  "PrimeEdge",
];

export default function TrustedBy() {
  const { approvedClients } = useCmsContent();
  const prefersReducedMotion = useReducedMotion();

  const clients = useMemo(() => {
    const list = Array.isArray(approvedClients) && approvedClients.length > 0
      ? approvedClients
      : DEFAULT_CLIENTS;

    if (prefersReducedMotion) {
      return list;
    }

    // Ensure adequate items so marquee track spans wide screens seamlessly
    let repeated = list;
    while (repeated.length < 10) {
      repeated = [...repeated, ...list];
    }
    // Duplicate 2x for seamless 50% translateX loop
    return [...repeated, ...repeated];
  }, [approvedClients, prefersReducedMotion]);

  return (
    <section
      className="trusted section"
      id="clients"
      aria-label="Approved client list"
    >
      <div className="container trusted__header">
        <motion.p
          className="trusted__label"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Approved client list
        </motion.p>
      </div>

      <div className="trusted__marquee" aria-hidden="true">
        <div className="trusted__fade trusted__fade--left" />
        <div className="trusted__fade trusted__fade--right" />
        <div
          className={`trusted__track${prefersReducedMotion ? " trusted__track--static" : ""}`}
        >
          {clients.map((client, index) => (
            <div className="trusted__logo-card" key={`${client}-${index}`}>
              <span className="trusted__logo-abbr">
                {client.slice(0, 2).toUpperCase()}
              </span>
              <span className="trusted__logo-name">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
