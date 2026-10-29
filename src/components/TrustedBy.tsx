import { useMemo, useRef } from "react";
import { useInView } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "600px 0px 600px 0px" });

  const clients = useMemo(() => {
    const list = Array.isArray(approvedClients) && approvedClients.length > 0
      ? approvedClients
      : DEFAULT_CLIENTS;

    // Ensure adequate items so marquee track spans wide and mobile screens seamlessly
    let repeated = list;
    while (repeated.length < 10) {
      repeated = [...repeated, ...list];
    }
    // Duplicate 2x for seamless 50% translateX loop
    return [...repeated, ...repeated];
  }, [approvedClients]);

  return (
    <section
      ref={sectionRef}
      className={`trusted section${isInView ? " is-in-view" : ""}`}
      id="clients"
      aria-label="Approved client list"
    >
      <div className="container trusted__header">
        <p className="trusted__label">
          Approved client list
        </p>
      </div>

      <div className="trusted__marquee" aria-hidden="true">
        <div className="trusted__fade trusted__fade--left" />
        <div className="trusted__fade trusted__fade--right" />
        <div className="trusted__track">
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
