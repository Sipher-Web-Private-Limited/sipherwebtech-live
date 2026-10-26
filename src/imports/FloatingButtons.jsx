import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Download, Phone, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCmsContent } from '../content/CmsContentProvider';
import {
  siFacebook,
  siInstagram,
  siWhatsapp,
} from 'simple-icons';
import './FloatingButtons.css';

const SOCIAL_ICONS = {
  WhatsApp: siWhatsapp,
  LinkedIn: {
      path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  Facebook: siFacebook,
  Instagram: siInstagram,
};

function SocialIcon({ icon }) {
  if (!icon.path) {
    const Icon = icon;
    return <Icon aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}

export default function FloatingButtons() {
  const { activeCompanySocials, companyProfile } = useCmsContent();
  const hasBrochure = companyProfile?.brochureEnabled && Boolean(companyProfile?.brochureUrl);
  const socialLinks = activeCompanySocials.map(({ label, icon, href }) => ({
    name: label,
    icon: SOCIAL_ICONS[icon] ?? siFacebook,
    href,
  }));
  const [isFollowOpen, setFollowOpen] = useState(false);
  const [isFooterVisible, setFooterVisible] = useState(false);
  const dockRef = useRef(null);
  const followButtonRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateFooterVisibility = () => {
      const footer = document.querySelector('.site-footer');
      if (!footer) {
        setFooterVisible(false);
        return;
      }
      const bounds = footer.getBoundingClientRect();
      setFooterVisible(bounds.top < window.innerHeight - 72 && bounds.bottom > 0);
    };

    updateFooterVisibility();
    window.addEventListener('scroll', updateFooterVisibility, { passive: true });
    window.addEventListener('resize', updateFooterVisibility);
    return () => {
      window.removeEventListener('scroll', updateFooterVisibility);
      window.removeEventListener('resize', updateFooterVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isFollowOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!dockRef.current?.contains(event.target)) setFollowOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setFollowOpen(false);
        followButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isFollowOpen]);

  return (
    <div className={`floating-actions${isFooterVisible ? ' floating-actions--footer-visible' : ''}${isFollowOpen ? ' floating-actions--open' : ''}`} ref={dockRef}>
      <motion.nav
        className="floating-actions__dock"
        aria-label="Quick actions"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="floating-actions__follow">
          <AnimatePresence>
            {isFollowOpen && (
              <motion.div
                className="floating-actions__social-panel"
                id="floating-social-links"
                role="group"
                aria-label="Follow us on social media"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="floating-actions__social-title">Follow us</p>
                <ul>
                  {socialLinks.map(({ name, icon, href }) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${name} (opens in a new tab)`}
                        onClick={() => setFollowOpen(false)}
                      >
                        <span className="floating-actions__social-icon"><SocialIcon icon={icon} /></span>
                        <span className="floating-actions__social-name">{name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={followButtonRef}
            className="floating-actions__button floating-actions__button--secondary"
            type="button"
            onClick={() => setFollowOpen((open) => !open)}
            aria-expanded={isFollowOpen}
            aria-controls="floating-social-links"
          >
            <span className="floating-actions__button-content">
              {isFollowOpen ? <X aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
              <span>{isFollowOpen ? 'Close' : 'Follow'}</span>
            </span>
          </button>
        </div>

        <span className="floating-actions__divider" aria-hidden="true" />

        <Link className="floating-actions__button floating-actions__button--primary" to="/contact">
          <span className="floating-actions__button-content">
            <Phone aria-hidden="true" />
            <span>
              <span className="floating-actions__text-full">Request a Callback</span>
              <span className="floating-actions__text-short">Callback</span>
            </span>
          </span>
        </Link>

        {hasBrochure && (
          <>
            <span className="floating-actions__divider" aria-hidden="true" />
            <a
              className="floating-actions__button floating-actions__button--brochure"
              href={companyProfile.brochureUrl}
              download={companyProfile.brochureName || "Sipher_Web_Brochure.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download company brochure"
            >
              <span className="floating-actions__button-content">
                <Download aria-hidden="true" />
                <span>Brochure</span>
              </span>
            </a>
          </>
        )}
      </motion.nav>
    </div>
  );
}