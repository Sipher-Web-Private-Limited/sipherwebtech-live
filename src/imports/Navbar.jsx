import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { useCmsContent } from '../content/CmsContentProvider';
import './Navbar.css';

const MotionLink = motion.create(Link);

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  {
    label: 'Company',
    href: '#',
    children: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    label: 'Services',
    href: '#',
    children: [
      { label: 'Our Services', href: '#' },
      { label: 'Mobile App Development', href: '#' },
      { label: 'Web Development', href: '#' },
      { label: 'Custom Software Development', href: '#' },
      { label: 'Software Product Development', href: '#' },
      { label: 'Digital Marketing', href: '#' },
      { label: 'Search Engine Optimization (SEO)', href: '#' },
      { label: 'Social Media Marketing & Management', href: '#' },
      { label: 'UI/UX Design', href: '#' },
      { label: 'Graphic Design', href: '#' },
    ],
  },
  { label: 'Products', href: '#' },
  { label: 'Portfolio', href: '#' },
  { label: 'Blog', href: '#' },
];

function Brand({ className = '' }) {
  const { companyProfile } = useCmsContent();

  return (
    <a href="/" className={`navbar__logo ${className}`} aria-label={`${companyProfile.name}, ${companyProfile.tagline}`}>
      {companyProfile.logoUrl && <img src={companyProfile.logoUrl} alt="" aria-hidden="true" className="navbar__logo-img" />}
      <span className="navbar__wordmark">
        <span className="navbar__logo-name">{companyProfile.name}</span>
        <span className="navbar__tagline">{companyProfile.tagline}</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [scrolled,   setScrolled]   = useState(false);
  const [hidden, setHidden] = useState(false);
  const previousScrollY = useRef(0);

  useEffect(() => {
    previousScrollY.current = window.scrollY;
    setScrolled(window.scrollY > 60);

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousScrollY.current;

      setScrolled(currentScrollY > 60);
      if (mobileOpen || desktopNavOpen || currentScrollY < 80) {
        setHidden(false);
      } else if (scrollDelta > 8) {
        setHidden(true);
      } else if (scrollDelta < 0) {
        setHidden(false);
      }

      previousScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen, desktopNavOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen && !desktopNavOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenMobileSection(null);
        setMobileOpen(false);
        setDesktopNavOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen, desktopNavOpen]);

  const toggleNavigation = () => {
    if (window.matchMedia('(max-width: 1160px)').matches) {
      setDesktopNavOpen(false);
      setOpenMobileSection(null);
      setMobileOpen(true);
      return;
    }

    setDesktopNavOpen((isOpen) => !isOpen);
  };

  const closeMobileMenu = () => {
    setOpenMobileSection(null);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Outer: fixed full-width shell, NEVER moves ── */}
      <header className={`navbar${hidden ? ' navbar--hidden' : ''}`} role="banner">

        {/* ── Inner: this becomes the floating pill on scroll ── */}
        <div className={`navbar__inner ${scrolled ? 'navbar__inner--scrolled' : ''}`}>

          {/* Brand */}
          <div className="navbar__left">
            <Brand />
          </div>

          <AnimatePresence initial={false}>
            {desktopNavOpen && (
              <motion.nav
                id="desktop-navigation"
                className="navbar__center"
                aria-label="Primary navigation"
                initial={{ opacity: 0, x: 22, scaleX: 0.92 }}
                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                exit={{ opacity: 0, x: 22, scaleX: 0.92 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <ul className="navbar__links" role="list">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.label}
                      className={`navbar__link-item${link.children ? ' navbar__link-item--has-children' : ''}`}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: (NAV_LINKS.length - i - 1) * 0.035,
                        duration: 0.2,
                      }}
                    >
                      {i > 0 && <span className="navbar__sep" aria-hidden="true" />}
                      <a href={link.href} className="navbar__link">
                        {link.label}
                        {link.children && <ChevronDown size={15} aria-hidden="true" />}
                      </a>
                      {link.children && (
                        <ul className="navbar__dropdown" aria-label={`${link.label} links`}>
                          {link.children.map((child) => (
                            <li key={child.label}>
                              <a href={child.href} className="navbar__dropdown-link">
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>

          <motion.button
            className="navbar__hamburger"
            onClick={toggleNavigation}
            aria-label={mobileOpen || desktopNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen || desktopNavOpen}
            aria-controls={mobileOpen ? 'mobile-navigation' : desktopNavOpen ? 'desktop-navigation' : undefined}
            animate={{ rotate: mobileOpen || desktopNavOpen ? 90 : 0 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {mobileOpen || desktopNavOpen
              ? <X size={23} strokeWidth={2.1} />
              : <Menu size={23} strokeWidth={2.1} />}
          </motion.button>

        </div>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeMobileMenu();
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <motion.aside
              className="navbar__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              onClick={(event) => event.stopPropagation()}
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              exit={{ y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="navbar__panel-header">
                <Brand className="navbar__overlay-logo" />
                <button
                  className="navbar__overlay-close"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav id="mobile-navigation" className="navbar__panel-nav" aria-label="Mobile navigation">
                <ul className="navbar__overlay-links" role="list">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.24 }}
                  >
                    {link.children ? (
                      <>
                        <button
                          type="button"
                          className="navbar__overlay-link navbar__overlay-toggle"
                          aria-expanded={openMobileSection === link.label}
                          aria-controls={openMobileSection === link.label
                            ? `mobile-sub-links-${link.label.toLowerCase()}`
                            : undefined}
                          onClick={() => setOpenMobileSection((current) => (
                            current === link.label ? null : link.label
                          ))}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className="navbar__overlay-chevron" size={18} aria-hidden="true" />
                        </button>
                        <AnimatePresence initial={false}>
                          {openMobileSection === link.label && (
                            <motion.ul
                              id={`mobile-sub-links-${link.label.toLowerCase()}`}
                              className="navbar__overlay-sub-links"
                              aria-label={`${link.label} links`}
                              initial={{ height: 0, opacity: 0, y: -6 }}
                              animate={{ height: 'auto', opacity: 1, y: 0 }}
                              exit={{ height: 0, opacity: 0, y: -6 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              style={{ overflow: 'hidden' }}
                            >
                              {link.children.map((child) => (
                                <li key={child.label}>
                                  <a
                                    href={child.href}
                                    className="navbar__overlay-sublink"
                                    onClick={closeMobileMenu}
                                  >
                                    {child.label}
                                  </a>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <a
                        href={link.href}
                        className="navbar__overlay-link"
                        onClick={closeMobileMenu}
                      >
                        <span>{link.label}</span>
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

              <MotionLink
                to="/contact"
                className="navbar__overlay-cta"
                onClick={closeMobileMenu}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.24 }}
              >
                Contact Us
                <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden="true" />
              </MotionLink>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
