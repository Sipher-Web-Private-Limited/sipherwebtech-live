import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { resolveCmsText, useCmsContent } from "../content/CmsContentProvider"
import "../imports/Footer.css"

const socialBrandPaths = {
  LinkedIn: (
    <path
      fill="currentColor"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  ),
  Instagram: (
    <>
      <path
        fill="currentColor"
        d="M7.03.084c-1.277.060-2.149.264-2.911.563a7.53 7.53 0 0 0-2.123 1.388A7.17 7.17 0 0 0 .616 4.162c-.295.764-.496 1.637-.552 2.914-.056 1.278-.069 1.688-.063 4.947.006 3.259.021 3.667.083 4.947.061 1.277.264 2.148.563 2.911.308.789.72 1.457 1.388 2.123.668.665 1.337 1.074 2.129 1.38.763.295 1.636.496 2.913.552 1.277.056 1.688.069 4.946.063 3.258-.006 3.668-.021 4.948-.081 1.28-.061 2.147-.265 2.91-.563.789-.309 1.458-.72 2.123-1.388.665-.668 1.075-1.338 1.38-2.129.295-.763.496-1.636.552-2.912.056-1.281.069-1.69.063-4.948-.006-3.258-.021-3.667-.082-4.947-.061-1.279-.264-2.148-.563-2.911a7.53 7.53 0 0 0-1.388-2.123c-.668-.665-1.338-1.074-2.129-1.38-.763-.295-1.636-.496-2.913-.552C15.647.009 15.236-.005 11.977.002 8.718.008 8.31.022 7.03.084Zm.14 21.693c-1.17-.051-1.805-.245-2.229-.408-.561-.216-.96-.477-1.382-.895-.422-.418-.681-.819-.9-1.378-.164-.423-.362-1.058-.417-2.228-.06-1.264-.072-1.644-.079-4.848-.007-3.204.005-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.476-.96.895-1.382.419-.421.818-.681 1.378-.9.423-.165 1.058-.362 2.227-.417 1.266-.06 1.645-.072 4.848-.079 3.203-.007 3.583.005 4.849.061 1.169.051 1.805.245 2.229.408.561.216.96.475 1.382.895.421.419.681.818.9 1.378.165.422.362 1.057.417 2.226.06 1.266.074 1.645.08 4.848.006 3.203-.005 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.229-.216.56-.476.96-.895 1.381-.419.421-.818.681-1.378.9-.422.165-1.058.362-2.226.417-1.266.06-1.645.072-4.849.079-3.204.007-3.582-.006-4.848-.061Zm11.783-16.191A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.442Zm-10.77 6.426c.007 3.403 2.771 6.156 6.173 6.149 3.403-.006 6.157-2.77 6.151-6.173-.006-3.403-2.771-6.156-6.174-6.15-3.403.007-6.156 2.771-6.15 6.174Zm2.162-.005a4 4 0 1 1 4.008 3.992A3.999 3.999 0 0 1 8.16 12.007Z"
      />
    </>
  ),
  YouTube: (
    <path
      fill="currentColor"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  ),
  Facebook: (
    <path
      fill="currentColor"
      d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
    />
  ),
  WhatsApp: (
    <path
      fill="currentColor"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    />
  ),
} as const

function SocialIcon({ name }: { name: string }) {
  if (!Object.prototype.hasOwnProperty.call(socialBrandPaths, name)) {
    return <Globe2 aria-hidden="true" />
  }

  return (
    <svg
      className="sw-icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="none"
      aria-hidden="true"
      focusable="false"
    >
      {socialBrandPaths[name as keyof typeof socialBrandPaths]}
    </svg>
  )
}

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Our services", href: "/services" },
  { label: "Selected work", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
]

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Products", href: "/products" },
  { label: "Insights", href: "/blog" },
]

function FooterLinkColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string
  links: readonly { label: string; href: string }[]
  ariaLabel?: string
}) {
  return (
    <nav
      className="site-footer__navigation"
      aria-label={ariaLabel ?? title}
    >
      <h2>{title}</h2>
      <ul>
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link to={href}>
              <span>{label}</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Footer() {
  const { aboutContent, activeCompanySocials, companyMapEmbedUrl, companyProfile, serviceCategories } = useCmsContent()
  const reduced = useReducedMotion()
  const wordmark = companyProfile.brandName.toUpperCase().split("")
  const websiteHost = companyProfile.website ? new URL(companyProfile.website).host : ""
  const footerSocialUrl = activeCompanySocials[0]?.href ?? companyProfile.website ?? "/"
  const serviceFocus = serviceCategories.map(({ title }) => title).join(" • ")
  const footerCtaTitle = resolveCmsText(aboutContent.footerCtaTitle, "Let’s build what’s next.", companyProfile)
  const footerCtaWords = footerCtaTitle.split(/\s+/)
  const footerCtaPrefix = footerCtaWords.slice(0, -2).join(" ")
  const footerCtaAccent = footerCtaWords.slice(-2).join(" ")

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <motion.section
          className="site-footer__band"
          aria-labelledby="footer-cta-title"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduced ? 0 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="site-footer__band-copy">
            <p className="site-footer__eyebrow">
              <span aria-hidden="true" />
              {resolveCmsText(aboutContent.footerCtaEyebrow, "Have an idea?", companyProfile)}
            </p>
            <h2 id="footer-cta-title" aria-label={footerCtaTitle}>
              {footerCtaPrefix && `${footerCtaPrefix} `}
              <em>{footerCtaAccent}</em>
            </h2>
            <p className="site-footer__band-description">
              {resolveCmsText(aboutContent.footerCtaDescription, "Tell us what you’re working on. We’ll help shape a clear plan and the right next step.", companyProfile)}
            </p>
          </div>
          <div className="site-footer__band-actions">
            <a
              className="site-footer__cta"
              href={companyProfile.phone.telUrl}
              data-cursor="CALL NOW"
              aria-label={`Call ${companyProfile.brandName} now`}
            >
              <span>{resolveCmsText(aboutContent.footerCtaButton, "Let’s talk about your idea", companyProfile)}</span>
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <a
              className="site-footer__band-mail"
              href={`mailto:${companyProfile.email}`}
              data-cursor="EMAIL US"
              aria-label={`Email ${companyProfile.brandName}`}
            >
              <Mail aria-hidden="true" size={16} />
              {companyProfile.email}
            </a>
          </div>
        </motion.section>

        <div className="site-footer__main">
          <motion.div
            className="site-footer__brand"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 0.5 }}
          >
            <Link
              className="site-footer__logo"
              to="/"
              aria-label={`${companyProfile.brandName} home`}
            >
              {companyProfile.logoUrl && <img src={companyProfile.logoUrl} alt="" aria-hidden="true" />}
              <span>
                <strong>{companyProfile.name}</strong>
                <small>{companyProfile.tagline}</small>
              </span>
            </Link>
            <p className="site-footer__brand-focus">
              <span aria-hidden="true" />
              {resolveCmsText(aboutContent.footerBrandFocus, serviceFocus || "Technology • Digital • Innovation", companyProfile)}
            </p>
            <p className="site-footer__brand-description">
              {resolveCmsText(aboutContent.footerBrandDescription, "{{companyName}} is a technology and digital services company delivering solutions for businesses, startups, and growing organizations.", companyProfile)}
            </p>
            <p className="site-footer__brand-detail">
              {resolveCmsText(aboutContent.footerBrandDetail, "We bring together engineering, design, and marketing to help organizations build, launch, and grow.", companyProfile)}
            </p>
            <div className="site-footer__socials" aria-label="Social media">
              {activeCompanySocials.map(({ label, href, icon }) => {
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    data-cursor={label.toUpperCase()}
                    title={label}
                  >
                    <SocialIcon name={icon} />
                  </a>
                )
              })}
            </div>
          </motion.div>

          <FooterLinkColumn
            title="Explore"
            ariaLabel="Footer navigation"
            links={navigationLinks}
          />
          <FooterLinkColumn
            title="Services"
            links={[
              ...serviceCategories.flatMap((category) =>
                category.services.map((service) => ({
                label: service.title,
                href: `/services/${service.slug}`,
                })),
              ),
              { label: "View all services", href: "/services" },
            ]}
          />
          <FooterLinkColumn title="Company" links={companyLinks} />

          <div className="site-footer__contact">
            <h2>Get in touch</h2>
            <p>Have a question or a project in mind? We&apos;re here to help.</p>
            <a
              href={`mailto:${companyProfile.email}`}
              data-cursor="EMAIL US"
              aria-label={`Email ${companyProfile.brandName}`}
            >
              <span className="site-footer__contact-icon">
                <Mail aria-hidden="true" size={16} />
              </span>
              <span>{companyProfile.email}</span>
            </a>
            <a
              href={companyProfile.phone.telUrl}
              data-cursor="CALL NOW"
              aria-label={`Call ${companyProfile.brandName}`}
            >
              <span className="site-footer__contact-icon">
                <Phone aria-hidden="true" size={16} />
              </span>
              <span>{companyProfile.phone.display}</span>
            </a>
            {companyProfile.whatsapp.url && (
              <a href={companyProfile.whatsapp.url} target="_blank" rel="noopener noreferrer" aria-label={`Message ${companyProfile.brandName} on WhatsApp`}>
                <span className="site-footer__contact-icon"><MessageCircle aria-hidden="true" size={16} /></span>
                <span>{companyProfile.whatsapp.display}</span>
              </a>
            )}
            {websiteHost && (
              <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${companyProfile.website}`}>
                <span className="site-footer__contact-icon"><Globe2 aria-hidden="true" size={16} /></span>
                <span>{websiteHost}</span>
              </a>
            )}
            <a
              className="site-footer__address"
              href={companyProfile.maps.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="VISIT US"
              aria-label={`Visit ${companyProfile.name} at ${companyProfile.address} (opens in a new tab)`}
            >
              <span className="site-footer__contact-icon">
                <MapPin aria-hidden="true" size={16} />
              </span>
              <span className="site-footer__address-text">
                <span>{companyProfile.address}</span>
              </span>
            </a>
            <div className="site-footer__map">
              <span className="site-footer__map-label">
                {companyProfile.name}
              </span>
              {companyMapEmbedUrl ? (
                <iframe
                  title={`Google Maps location for ${companyProfile.name || "company"}`}
                  src={companyMapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="site-footer__wordmark" aria-hidden="true">
          {wordmark.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="site-footer__wordmark-char"
              initial={reduced ? false : { y: "55%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduced ? 0 : 0.75,
                delay: reduced ? 0 : index * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {letter === " " ? "\u00a0" : letter}
            </motion.span>
          ))}
        </div>

        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            © {new Date().getFullYear()} {companyProfile.name} All rights
            reserved.
          </span>
          <a
            className="site-footer__motto"
            href={footerSocialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Think. Build. Grow."
          >
            Think. Build. Grow.
          </a>
        </div>
      </div>
    </footer>
  )
}
