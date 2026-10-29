import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Menu,
  UsersRound,
  X,
} from "lucide-react"

import { useEffect, useRef, useState } from "react"

import { Link, NavLink, useLocation } from "react-router-dom"

import { useCmsContent } from "../content/CmsContentProvider"
import { prefetchRoute } from "../routes/AppRoutes"

const navItems = [
  ["Home", "/"],

  ["Company", "/about"],

  ["Services", "/services"],

  ["Products", "/products"],

  ["Portfolio", "/portfolio"],

  ["Blog", "/blog"],

  ["Contact", "/contact"],
] as const

const desktopNavBreakpoint = 1240

function Brand({
  overlay = false,

  onClick,
}: {
  overlay?: boolean

  onClick?: () => void
}) {
  const { companyProfile } = useCmsContent()

  return (
    <Link
      className={`brand brand--navbar${overlay ? " brand--overlay" : ""}`}
      to="/"
      aria-label={`${companyProfile.name}, ${companyProfile.tagline}`}
      onClick={onClick}
    >
      <span className="brand__mark">
        {companyProfile.logoUrl && (
          <img
            src={companyProfile.logoUrl}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              const fallback = "/new-images/logo/sw_logo.webp";
              if (e.currentTarget.src !== window.location.origin + fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />
        )}
      </span>
      <span
  className="brand__name"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
  {companyProfile.name}
  <small style={{ display: "block", width: "100%", textAlign: "center" }}>
    {companyProfile.tagline}
  </small>
</span>
    </Link>
  )
}

export default function Navbar() {
  const { companyProfile, serviceCategories } = useCmsContent()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)

  const [hidden, setHidden] = useState(false)

  const [mobileOpen, setMobileOpen] = useState(false)

  const [desktopNavOpen, setDesktopNavOpen] = useState(false)

  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null)

  const [openMobileSection, setOpenMobileSection] = useState<string | null>(
    null,
  )

  const previousScrollY = useRef(0)

  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const desktopMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const reduced = useReducedMotion()

  const cancelDesktopMenuClose = () => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current)

      desktopMenuCloseTimer.current = null
    }
  }

  const openDesktopMenuFor = (label: string) => {
    cancelDesktopMenuClose()

    setOpenDesktopMenu(label)
  }

  const scheduleDesktopMenuClose = () => {
    cancelDesktopMenuClose()

    desktopMenuCloseTimer.current = setTimeout(() => {
      setOpenDesktopMenu(null)

      desktopMenuCloseTimer.current = null
    }, 160)
  }

  useEffect(() => {
    previousScrollY.current = window.scrollY

    setScrolled(window.scrollY > 60)

    const onScroll = () => {
      const currentScrollY = window.scrollY

      const delta = currentScrollY - previousScrollY.current

      setScrolled(currentScrollY > 60)

      if (
        mobileOpen ||
        desktopNavOpen ||
        openDesktopMenu ||
        currentScrollY < 80
      ) {
        setHidden(false)
      } else if (delta > 8) {
        setHidden(true)
      } else if (delta < 0) {
        setHidden(false)
      }

      previousScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [mobileOpen, desktopNavOpen, openDesktopMenu])

  useEffect(() => {
    const desktopNavQuery = window.matchMedia(
      `(max-width: ${desktopNavBreakpoint - 1}px)`,
    )
    const resetNavigationForViewport = () => {
      setMobileOpen(false)
      setDesktopNavOpen(false)
      setOpenDesktopMenu(null)
      setOpenMobileSection(null)
      document.body.style.overflow = ""
      cancelDesktopMenuClose()
    }

    desktopNavQuery.addEventListener("change", resetNavigationForViewport)
    return () =>
      desktopNavQuery.removeEventListener("change", resetNavigationForViewport)
  }, [])

  useEffect(() => {
    setMobileOpen(false)

    setOpenMobileSection(null)

    setOpenDesktopMenu(null)

    setHidden(false)

    cancelDesktopMenuClose()
  }, [location])

  useEffect(() => {
    if (!hidden) return

    const revealNavbar = () => setHidden(false)

    window.addEventListener("pointerdown", revealNavbar, { passive: true })

    window.addEventListener("keydown", revealNavbar)

    return () => {
      window.removeEventListener("pointerdown", revealNavbar)

      window.removeEventListener("keydown", revealNavbar)
    }
  }, [hidden])

  useEffect(() => () => cancelDesktopMenuClose(), [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return

      setOpenDesktopMenu(null)

      setOpenMobileSection(null)

      setMobileOpen(false)

      setDesktopNavOpen(false)

      menuButtonRef.current?.focus()
    }

    window.addEventListener("keydown", closeOnEscape)

    return () => {
      document.body.style.overflow = ""

      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [mobileOpen])

  const toggleNavigation = () => {
    if (
      window.matchMedia(`(max-width: ${desktopNavBreakpoint - 1}px)`).matches
    ) {
      setDesktopNavOpen(false)

      setOpenDesktopMenu(null)

      setOpenMobileSection(null)

      setMobileOpen((open) => !open)

      return
    }

    setOpenDesktopMenu(null)

    setDesktopNavOpen((open) => !open)
  }

  const closeMobileMenu = () => {
    setOpenMobileSection(null)
    setMobileOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
        animate={{ y: hidden ? "-120%" : 0 }}
        transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar__shell">
          <Brand />

          <AnimatePresence initial={false}>
            {desktopNavOpen && (
              <motion.nav
                id="desktop-navigation"
                className="desktop-nav"
                aria-label="Main navigation"
                initial={reduced ? false : { opacity: 0, x: 22, scaleX: 0.94 }}
                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                exit={{ opacity: 0, x: 22, scaleX: 0.94 }}
                transition={{
                  duration: reduced ? 0 : 0.4,

                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {navItems.map(([label, to]) => {
                  const expandable = label === "Company" || label === "Services"

                  return (
                    <div
                      className="desktop-nav__item"
                      key={label}
                      onMouseEnter={() =>
                        { prefetchRoute(to); if (expandable) openDesktopMenuFor(label); }
                      }
                      onMouseLeave={() =>
                        expandable && scheduleDesktopMenuClose()
                      }
                      onFocus={() => expandable && openDesktopMenuFor(label)}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget))
                          scheduleDesktopMenuClose()
                      }}
                    >
                      {expandable ? (
                        <button
                          type="button"
                          aria-expanded={openDesktopMenu === label}
                          aria-controls={`desktop-submenu-${label.toLowerCase()}`}
                          onClick={() => openDesktopMenuFor(label)}
                        >
                          {label}
                          <ChevronDown size={14} aria-hidden="true" />
                        </button>
                      ) : (
                        <NavLink to={to} end={to === "/"} onMouseEnter={() => prefetchRoute(to)} onFocus={() => prefetchRoute(to)}>
                          {label}
                        </NavLink>
                      )}
                      <AnimatePresence>
                        {openDesktopMenu === label && (
                          <motion.div
                            id={`desktop-submenu-${label.toLowerCase()}`}
                            className={`nav-popover ${
                              label === "Services" || label === "Company"
                                ? "nav-popover--mega"
                                : ""
                            } ${
                              label === "Company"
                                ? "nav-popover--company-mega"
                                : ""
                            }`}
                            initial={{
                              opacity: 0,

                              y: 12,

                              scale: 0.98,

                              clipPath: "inset(0 0 12% 0)",
                            }}
                            animate={{
                              opacity: 1,

                              y: 0,

                              scale: 1,

                              clipPath: "inset(0 0 0 0)",
                            }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: reduced ? 0 : 0.25 }}
                          >
                            {label === "Company" ? (
                              <>
                                <div className="nav-popover__intro nav-popover__company-intro">
                                  <p className="eyebrow">
                                    <span />
                                    Inside {companyProfile.brandName}
                                  </p>
                                  <h3>
                                    People first.
                                    <br />
                                    Built for impact.
                                  </h3>
                                  <Link to="/about">
                                    Discover our story{" "}
                                    <ArrowUpRight size={16} />
                                  </Link>
                                </div>
                                <div className="nav-popover__company-links">
                                  <Link to="/about">
                                    <Building2 size={19} />
                                    <span>
                                      <strong>About us</strong>
                                      <small>Our story and approach</small>
                                    </span>
                                    <ArrowUpRight size={15} />
                                  </Link>
                                  <Link to="/leadership">
                                    <UsersRound size={19} />
                                    <span>
                                      <strong>Leadership</strong>
                                      <small>Meet the people guiding us</small>
                                    </span>
                                    <ArrowUpRight size={15} />
                                  </Link>
                                  <Link to="/team">
                                    <UsersRound size={19} />
                                    <span>
                                      <strong>Our Team</strong>
                                      <small>Get to know our specialists</small>
                                    </span>
                                    <ArrowUpRight size={15} />
                                  </Link>
                                  <Link to="/careers" onMouseEnter={() => prefetchRoute("/careers")}>
                                    <BriefcaseBusiness size={19} />
                                    <span>
                                      <strong>Careers</strong>
                                      <small>Grow your career with us</small>
                                    </span>
                                    <ArrowUpRight size={15} />
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="nav-popover__intro">
                                  <p className="eyebrow">
                                    <span />
                                    Capabilities
                                  </p>
                                  <h3>
                                    One partner.
                                    <br />
                                    Multiple capabilities.
                                  </h3>
                                  <Link to="/services">
                                    Explore all services{" "}
                                    <ArrowUpRight size={16} />
                                  </Link>
                                </div>
                                <div className="nav-popover__services">
                                  {serviceCategories.map((category) => (
                                    <div key={category.id}>
                                      <p>{category.title}</p>
                                      {category.services
                                        .map((service) => {
                                          const Icon = service.icon

                                          return (
                                            <Link
                                              to={`/services/${service.slug}`}
                                              key={service.slug}
                                            >
                                              <Icon size={16} />
                                              {service.title}
                                              <ArrowUpRight size={14} />
                                            </Link>
                                          )
                                        })}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </motion.nav>
            )}
          </AnimatePresence>

          <motion.button
            ref={menuButtonRef}
            className="menu-toggle"
            onClick={toggleNavigation}
            aria-label={
              mobileOpen || desktopNavOpen ? "Close menu" : "Open menu"
            }
            data-cursor={mobileOpen || desktopNavOpen ? "CLOSE" : "OPEN"}
            aria-expanded={mobileOpen || desktopNavOpen}
            aria-controls={
              mobileOpen
                ? "mobile-navigation"
                : desktopNavOpen
                  ? "desktop-navigation"
                  : undefined
            }
            animate={{ rotate: mobileOpen || desktopNavOpen ? 90 : 0 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {mobileOpen || desktopNavOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            onClickCapture={(event) => {
              if (
                event.target instanceof Element &&
                event.target.closest("a[href]")
              ) {
                closeMobileMenu()
              }
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeMobileMenu()
            }}
          >
            <motion.aside
              className="mobile-menu__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              exit={{ y: 14 }}
              transition={{
                duration: reduced ? 0 : 0.32,

                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="mobile-menu__top">
                <Brand overlay />
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  data-cursor="CLOSE"
                >
                  <X size={23} />
                </button>
              </div>

              <nav id="mobile-navigation" aria-label="Mobile navigation">
                {navItems.map(([label, to], index) => {
                  const expandable = label === "Company" || label === "Services"

                  const expanded = openMobileSection === label

                  return (
                    <motion.div
                      className="mobile-menu__item"
                      key={label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduced ? 0 : index * 0.035,

                        duration: 0.24,
                      }}
                    >
                      <div className="mobile-menu__row">
                        {expandable ? (
                          <button
                            className="mobile-menu__label"
                            type="button"
                            onClick={() =>
                              setOpenMobileSection(expanded ? null : label)
                            }
                            aria-expanded={expanded}
                            aria-controls={`mobile-sub-links-${label.toLowerCase()}`}
                          >
                            {label}
                          </button>
                        ) : (
                          <NavLink to={to} end={to === "/"} onMouseEnter={() => prefetchRoute(to)} onFocus={() => prefetchRoute(to)}>
                            {label}
                          </NavLink>
                        )}
                        {expandable && (
                          <button
                            onClick={() =>
                              setOpenMobileSection(expanded ? null : label)
                            }
                            aria-label={`Toggle ${label} links`}
                            aria-expanded={expanded}
                            aria-controls={`mobile-sub-links-${label.toLowerCase()}`}
                          >
                            <ChevronDown
                              className={expanded ? "is-open" : ""}
                              size={19}
                            />
                          </button>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {expandable && expanded && (
                          <motion.div
                            id={`mobile-sub-links-${label.toLowerCase()}`}
                            className="mobile-menu__children"
                            initial={{ height: 0, opacity: 0, y: -6 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -6 }}
                            transition={{
                              duration: reduced ? 0 : 0.24,

                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            {label === "Company" ? (
                              <>
                                <Link to="/about">
                                  About us
                                  <span className="mobile-menu__child-arrow">
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                  </span>
                                </Link>
                                <Link to="/leadership">
                                  Leadership
                                  <span className="mobile-menu__child-arrow">
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                  </span>
                                </Link>
                                <Link to="/team">
                                  Our Team
                                  <span className="mobile-menu__child-arrow">
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                  </span>
                                </Link>
                                <Link to="/careers">
                                  Careers
                                  <span className="mobile-menu__child-arrow">
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                  </span>
                                </Link>
                              </>
                            ) : (
                              serviceCategories.map((category) => (
                                <div key={category.id}>
                                  <p>{category.title}</p>
                                  {category.services.map((service) => (
                                    <Link
                                      key={service.slug}
                                      to={`/services/${service.slug}`}
                                    >
                                      {service.title}
                                      <span className="mobile-menu__child-arrow">
                                        <ArrowUpRight
                                          size={14}
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mobile-menu__footer">
                <Link className="mobile-menu__cta" to="/contact">
                  Contact Us <ArrowUpRight size={17} />
                </Link>
                <p>Technology • Digital • Creative • Innovation</p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
