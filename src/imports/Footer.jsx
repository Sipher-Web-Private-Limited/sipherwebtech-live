import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { useCmsContent } from "../content/CmsContentProvider"
import "../imports/Footer.css"

/* Icons are inline SVG below: no icon package needs to be installed.
   Brand logos (LinkedIn, Instagram, YouTube, Facebook, WhatsApp) use the official
   glyph paths from Simple Icons (CC0). */

/* Keep in sync with the 760px breakpoint in Footer.css. */
const COMPACT_QUERY = "(max-width: 760px)"

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Our services", href: "/services" },
  { label: "Selected work", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
]

const companyLinks = [
  { label: "Careers", href: "/careers" },
  { label: "Products", href: "/products" },
  { label: "Insights", href: "/blog" },
]

type IconName =
  | "linkedin"
  | "instagram"
  | "youtube"
  | "facebook"
  | "whatsapp"
  | "link"
  | "arrowRight"
  | "arrowUp"
  | "arrowUpRight"
  | "check"
  | "chevronDown"
  | "copy"
  | "mail"
  | "phone"

const socialMeta: Record<string, { icon: IconName; brand: string }> = {
  linkedin: { icon: "linkedin", brand: "#0a66c2" },
  instagram: {
    icon: "instagram",
    brand: "linear-gradient(45deg, #f09433, #dc2743 55%, #bc1888)",
  },
  youtube: { icon: "youtube", brand: "#ff0033" },
  facebook: { icon: "facebook", brand: "#1877f2" },
  whatsapp: { icon: "whatsapp", brand: "#25d366" },
  other: { icon: "link", brand: "#ffc700" },
}

function detectSocial(label: string, href: string) {
  const text = `${label} ${href}`.toLowerCase()
  if (text.includes("linkedin")) return "linkedin"
  if (text.includes("instagram")) return "instagram"
  if (text.includes("youtube") || text.includes("youtu.be")) return "youtube"
  if (text.includes("facebook") || text.includes("fb.com")) return "facebook"
  if (text.includes("whatsapp") || text.includes("wa.me")) return "whatsapp"
  return "other"
}

const ICON_PATHS: Record<IconName, ReactNode> = {
  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  ),
  instagram: (
    <path
      fill="currentColor"
      stroke="none"
      d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
    />
  ),
  youtube: (
    <path
      fill="currentColor"
      stroke="none"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  ),
  facebook: (
    <path
      fill="currentColor"
      stroke="none"
      d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
    />
  ),
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    />
  ),
  link: (
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="sw-icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

const featuredServiceSlugs = [
  "web-development",
  "software-development",
  "mobile-app-development",
  "ecommerce",
  "digital-marketing",
  "seo",
  "ui-ux",
  "ai-automation",
]

const projectChips = [
  { label: "Website", value: "website" },
  { label: "ERP", value: "erp" },
  { label: "CRM", value: "crm" },
  { label: "LMS", value: "lms" },
  { label: "MIS", value: "mis" },
  { label: "Social media", value: "social-media" },
  { label: "Mobile app", value: "mobile-app" },
]

const EASE = [0.16, 1, 0.3, 1] as const

/* One reveal for the whole link grid: columns rise in a short stagger */
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/* ---------- Media query hook ---------- */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [query])

  return matches
}

/* ---------- Magnetic wrapper: the CTA leans toward the cursor ---------- */
function Magnetic({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22)
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.3)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="site-footer__magnet" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div style={{ x: sx, y: sy }}>{children}</motion.div>
    </div>
  )
}

/* ---------- Copy-to-clipboard button ---------- */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef< number | undefined > (undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: the link beside it still works */
    }
  }

  return (
    <>
      <button
        type="button"
        className={`site-footer__copy${copied ? " is-copied" : ""}`}
        onClick={copy}
        aria-label={`Copy ${label}`}
      >
        <Icon name={copied ? "check" : "copy"} />
        <span className="site-footer__copy-tip" aria-hidden="true">
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
      <span className="site-footer__sr" role="status" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </>
  )
}

/* ---------- Live time in India (helps visitors in other time zones) ---------- */
function IndiaTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const label = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(now)

  return (
    <p className="site-footer__time">
      <span className="site-footer__status-dot" aria-hidden="true" />
      <span>
        India time: <time dateTime={now.toISOString()}>{label}</time>
      </span>
    </p>
  )
}

/* ---------- Link column (accordion on phones, plain list elsewhere) ---------- */
function FooterLinkColumn({
  title,
  links,
  ariaLabel,
  highlightLast = false,
}: {
  title: string
  links: readonly { label: string; href: string }[]
  ariaLabel?: string
  highlightLast?: boolean
}) {
  const compact = useMediaQuery(COMPACT_QUERY)
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const { pathname } = useLocation()
  const expanded = !compact || open

  return (
    <motion.nav
      variants={riseVariants}
      className={`site-footer__navigation${compact ? " is-compact" : ""}${expanded ? " is-open" : ""}`}
      aria-label={ariaLabel ?? title}
    >
      <h2>
        {compact ? (
          <button
            type="button"
            className="site-footer__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span>{title}</span>
            <Icon name="chevronDown" />
          </button>
        ) : (
          title
        )}
      </h2>
      <div className="site-footer__panel" id={panelId}>
        <ul>
          {links.map(({ label, href }, index) => {
            const isLast = highlightLast && index === links.length - 1
            return (
              <li key={label} className={isLast ? "is-all" : undefined}>
                <Link to={href} aria-current={pathname === href ? "page" : undefined}>
                  <span>{label}</span>
                  <Icon name="arrowUpRight" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </motion.nav>
  )
}

export default function Footer() {
  const { companyProfile: liveCompanyProfile, activeCompanySocials, serviceCategories } = useCmsContent()
  const email = liveCompanyProfile.email
  const phoneDisplay = liveCompanyProfile.phone.display
  const phoneLink = liveCompanyProfile.phone.telUrl
  const whatsappLink = liveCompanyProfile.phone.whatsappUrl
  const socialLinks = activeCompanySocials.map(({ label, href }) => [label, href])
  const serviceLinks = [
    ...serviceCategories.flatMap((category) =>
      category.services
        .filter((service) => featuredServiceSlugs.includes(service.slug))
        .map((service) => ({ label: service.title, href: `/services/${service.slug}` })),
    ),
    { label: "View all services", href: "/services" },
  ]
  const wordmark = liveCompanyProfile.brandName.toUpperCase().split("")
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  })

  const onWordmarkMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`)
  }

  const onWordmarkLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--mx", "-999px")
    event.currentTarget.style.setProperty("--my", "-999px")
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* ── CTA band ─────────────────────────────── */}
        <motion.section
          className="site-footer__band"
          aria-labelledby="footer-cta-title"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
        >
          <div className="site-footer__band-copy">
            <p className="site-footer__status">
              <span className="site-footer__status-dot" aria-hidden="true" />
              Have an idea?
            </p>
            <h2 id="footer-cta-title">
              Let&apos;s build <em>what&apos;s next.</em>
            </h2>
            <p className="site-footer__band-description">
              Tell us what you&apos;re working on. We&apos;ll help shape a clear
              plan and the right next step.
            </p>

            <div className="site-footer__chips" role="group" aria-label="What are you building?">
              <span className="site-footer__chips-label">What are you building?</span>
              {projectChips.map(({ label, value }) => (
                <Link key={value} to={`/contact?service=${value}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="site-footer__band-actions">
            <Magnetic>
              <Link className="site-footer__cta" to="/contact">
                <span>Let&apos;s talk about your idea</span>
                <span className="site-footer__cta-icon">
                  <Icon name="arrowRight" />
                </span>
              </Link>
            </Magnetic>
            <a className="site-footer__band-mail" href={`mailto:${email}`}>
              <Icon name="mail" />
              <span>{email}</span>
            </a>
          </div>
        </motion.section>

        {/* ── Main grid (one staggered reveal) ─────── */}
        <motion.div
          className="site-footer__main"
          variants={gridVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className="site-footer__brand" variants={riseVariants}>
            <Link className="site-footer__logo" to="/" aria-label={`${liveCompanyProfile.brandName} home`}>
              <img src={liveCompanyProfile.logoUrl} alt="" aria-hidden="true" />
              <span>
                <strong>{liveCompanyProfile.name}</strong>
                <small>{liveCompanyProfile.tagline}</small>
              </span>
            </Link>
            <p>
              Technology, digital growth, and creative work—connected to help
              organizations build what&apos;s next.
            </p>

            <div className="site-footer__socials" role="group" aria-label="Social media">
              {socialLinks.map(([label, href]) => {
                const meta = socialMeta[detectSocial(label, href)]
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    data-label={label}
                    style={{ "--brand": meta.brand } as CSSProperties}
                  >
                    <Icon name={meta.icon} />
                  </a>
                )
              })}
            </div>
          </motion.div>

          <FooterLinkColumn title="Explore" ariaLabel="Footer navigation" links={navigationLinks} />
          <FooterLinkColumn title="Services" links={serviceLinks} highlightLast />
          <FooterLinkColumn title="Company" links={companyLinks} />

          <motion.div className="site-footer__contact" variants={riseVariants}>
            <h2>Get in touch</h2>
            <p>Have a question or a project in mind? We&apos;re here to help.</p>

            <div className="site-footer__contact-row">
              <a href={`mailto:${email}`}>
                <span className="site-footer__contact-icon">
                  <Icon name="mail" />
                </span>
                <span className="site-footer__contact-text">
                  <small>Email</small>
                  <span>{email}</span>
                </span>
              </a>
              <CopyButton value={email} label="email address" />
            </div>

            <div className="site-footer__contact-row">
              <a href={phoneLink}>
                <span className="site-footer__contact-icon">
                  <Icon name="phone" />
                </span>
                <span className="site-footer__contact-text">
                  <small>Call</small>
                  <span>{phoneDisplay}</span>
                </span>
              </a>
              <CopyButton value={phoneDisplay} label="phone number" />
            </div>

            <div className="site-footer__contact-row">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <span className="site-footer__contact-icon is-whatsapp">
                  <Icon name="whatsapp" />
                </span>
                <span className="site-footer__contact-text">
                  <small>WhatsApp</small>
                  <span>Chat with us</span>
                </span>
              </a>
            </div>

            <IndiaTime />
          </motion.div>
        </motion.div>

        {/* ── Wordmark with cursor spotlight ───────── */}
        <div
          className="site-footer__wordmark"
          aria-hidden="true"
          onPointerMove={onWordmarkMove}
          onPointerLeave={onWordmarkLeave}
        >
          <div className="site-footer__wordmark-layer">
            {wordmark.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                className="site-footer__wordmark-char"
                initial={reduced ? false : { y: "55%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduced ? 0 : 0.8,
                  delay: reduced ? 0 : index * 0.05,
                  ease: EASE,
                }}
              >
                {letter === " " ? "\u00a0" : letter}
              </motion.span>
            ))}
          </div>
          <div className="site-footer__wordmark-layer site-footer__wordmark-glow">
            {wordmark.map((letter, index) => (
              <span key={`glow-${letter}-${index}`} className="site-footer__wordmark-char">
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────── */}
        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            © {new Date().getFullYear()} {liveCompanyProfile.name} All rights reserved.
          </span>
          <span className="site-footer__motto">
            Think. <b>Build.</b> Grow.
          </span>
          <button
            className="site-footer__top"
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
            }
          >
            <span>Back to top</span>
            <span className="site-footer__top-ring">
              <svg className="site-footer__top-progress" viewBox="0 0 48 48" aria-hidden="true">
                <circle className="track" cx="24" cy="24" r="22" />
                <motion.circle
                  className="bar"
                  cx="24"
                  cy="24"
                  r="22"
                  style={{ pathLength: reduced ? scrollYProgress : smoothProgress }}
                />
              </svg>
              <span className="site-footer__top-icon">
                <Icon name="arrowUp" />
              </span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}