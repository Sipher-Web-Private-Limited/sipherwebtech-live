import { motion, useReducedMotion } from "framer-motion"
import "./TrustedBy.css"

const approvedClients = [
  "ZenMedia",
  "AlphaStudio",
  "BlueForge",
  "CrestGroup",
  "OmniLogic",
  "StellarBrand",
  "VistaCorp",
  "PrimeEdge",
]

export default function TrustedBy() {
  const prefersReducedMotion = useReducedMotion()
  const clients = prefersReducedMotion
    ? approvedClients
    : [...approvedClients, ...approvedClients]

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
  )
}
