import { useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useCmsContent, type ApprovedClient } from "../content/CmsContentProvider";
import "./TrustedBy.css";

const DEFAULT_CLIENTS: ApprovedClient[] = [
  { name: "ZenMedia", logo: null },
  { name: "AlphaStudio", logo: null },
  { name: "BlueForge", logo: null },
  { name: "CrestGroup", logo: null },
  { name: "OmniLogic", logo: null },
  { name: "StellarBrand", logo: null },
  { name: "VistaCorp", logo: null },
  { name: "PrimeEdge", logo: null },
];

function ClientCard({ client }: { client: ApprovedClient }) {
  const [logoError, setLogoError] = useState(false);
  const hasLogo = Boolean(client.logo && !logoError);
  const monogram = (client.name || "SW").slice(0, 2).toUpperCase();

  return (
    <div
      className={`trusted__logo-card ${
        hasLogo ? "trusted__logo-card--has-logo" : "trusted__logo-card--monogram"
      }`}
    >
      {hasLogo ? (
        <span className="trusted__logo-img-wrap">
          <img
            src={client.logo!}
            alt={`${client.name} logo`}
            className="trusted__logo-img"
            loading="lazy"
            onError={() => setLogoError(true)}
          />
        </span>
      ) : (
        <span className="trusted__logo-abbr" aria-hidden="true">
          {monogram}
        </span>
      )}
      <span className="trusted__logo-name">{client.name}</span>
    </div>
  );
}

export default function TrustedBy() {
  const { approvedClients } = useCmsContent();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "600px 0px 600px 0px" });

  const clients = useMemo(() => {
    const list: ApprovedClient[] =
      Array.isArray(approvedClients) && approvedClients.length > 0
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
        <div className="trusted__eyebrow-badge">
          <span className="trusted__eyebrow-dot" />
          <p className="trusted__label">Trusted by fast-growing brands & industry partners</p>
        </div>
      </div>

      <div className="trusted__marquee" aria-hidden="true">
        <div className="trusted__fade trusted__fade--left" />
        <div className="trusted__fade trusted__fade--right" />
        <div className="trusted__track">
          {clients.map((client, index) => (
            <ClientCard
              client={client}
              key={`${client.name}-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
