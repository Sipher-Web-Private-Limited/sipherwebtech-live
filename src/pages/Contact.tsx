/**
 * src/pages/Contact.tsx
 * Contact page backed by the published company profile in the CMS.
 *
 * Needs:
 *  - src/styles/contact.css           (provided separately)
 *  - src/components/Seo               (already in your project)
 *  - lucide-react
 *  - <link> for the "Caveat" Google font in index.html
 */
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Lock,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState, type CSSProperties } from "react";
import { BrandSocialIcon } from "../components/BrandSocialIcon";
import { cmsApiBase } from "../content/cmsApi";
import Seo from "../components/Seo";
import { resolveCmsText, useCmsContent } from "../content/CmsContentProvider";
import "../styles/contact.css";

/* ------------------------------------------------------------------ */
/*  Editable content                                                   */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type FormState = { name: string; email: string; phone: string; service: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;
const initialForm: FormState = { name: "", email: "", phone: "", service: "", message: "" };
const formFields: (keyof FormState)[] = ["name", "email", "phone", "service", "message"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readCsrfToken(): string {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="))
    ?.slice("XSRF-TOKEN=".length);

  return cookie ? decodeURIComponent(cookie) : "";
}

function accentedHeading(value: string, accentWords = 2, splitMode: "tail" | "half" | "after-prefix" | "after-two" = "tail"): ReactNode {
  const normalized = value.trim().replace(/\s+/g, " ");
  const words = normalized.split(" ");
  const sentenceEnd = normalized.search(/[.!?]\s+(?=\S)/);
  const splitAt = splitMode === "half"
    ? Math.ceil(words.length / 2)
    : splitMode === "after-prefix"
      ? normalized.toLowerCase().startsWith("tell us about ")
        ? "tell us about ".length
        : normalized.indexOf(" ") + 1
      : splitMode === "after-two"
        ? normalized.indexOf(" ", normalized.indexOf(" ") + 1) + 1
      : sentenceEnd >= 0
        ? normalized.indexOf(" ", sentenceEnd) + 1
        : Math.max(1, words.length - accentWords);

  return (
    <>
      <span>{splitMode === "half" ? words.slice(0, splitAt).join(" ") : normalized.slice(0, splitAt).trim()} </span>
      <em>{splitMode === "half" ? words.slice(splitAt).join(" ") : normalized.slice(splitAt).trim()}</em>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    // safety net: show anything already in the viewport if the observer did not fire
    const safety = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    }, 1200);
    return () => {
      window.clearTimeout(safety);
      io.disconnect();
    };
  }, []);
}

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M8 56 112 8 88 108 60 76z" fill="#ffe401" />
      <path d="M60 76 112 8 38 66z" fill="#f2cf00" />
      <path d="M60 76 54 104 40 84z" fill="#d9b800" />
      <path d="M8 56 38 66 112 8z" fill="#fff27a" />
    </svg>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="ct-field">
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  );
}

/** Custom, keyboard-accessible dropdown (replaces the native <select>) */
function ServiceSelect({
  value,
  onChange,
  services,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  services: readonly { label: string; hint: string }[];
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const options = [
    ...services.filter((service) => service.label.toLowerCase() !== "other"),
    { label: "Other", hint: "Something not listed" },
  ];
  const selected = options.findIndex((service) => service.label === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = () => {
    setActive(selected >= 0 ? selected : 0);
    setOpen((o) => !o);
  };
  const pick = (i: number) => {
    onChange(options[i].label);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) toggle();
        else setActive((a) => (a + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) toggle();
        else setActive((a) => (a - 1 + options.length) % options.length);
        break;
      case "Home":
        if (open) { e.preventDefault(); setActive(0); }
        break;
      case "End":
        if (open) { e.preventDefault(); setActive(options.length - 1); }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) pick(active);
        else toggle();
        break;
      case "Escape":
        if (open) { e.preventDefault(); setOpen(false); }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div className="ct-field">
      <span id="svc-label">Service Interested In</span>
      <div className={`ct-dd${open ? " is-open" : ""}`} ref={wrapRef}>
        <button
          type="button"
          className="ct-dd__btn"
          disabled={disabled}
          data-placeholder={!value}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="svc-list"
          aria-labelledby="svc-label svc-value"
          aria-activedescendant={open ? `svc-opt-${active}` : undefined}
          onClick={toggle}
          onKeyDown={onKeyDown}
        >
          <span id="svc-value">
            {value || "Select a service"}
          </span>
          <ChevronDown />
        </button>
        <ul className="ct-dd__list" id="svc-list" role="listbox" aria-labelledby="svc-label" tabIndex={-1}>
          {options.map((s, i) => (
            <li
              key={s.label}
              id={`svc-opt-${i}`}
              role="option"
              aria-selected={s.label === value}
              className={`ct-dd__opt${i === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              <i className="ct-dd__dot" />
              <span className="ct-dd__text">
                <b>{s.label}</b>
                <small>{s.hint}</small>
              </span>
              {s.label === value && (
                <span className="ct-dd__check">
                  <Check />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Contact() {
  const { aboutContent, companyProfile, activeCompanySocials, companyMapEmbedUrl, serviceCategories } = useCmsContent();
  const email = companyProfile.email;
  const phone = companyProfile.phone.display;
  const hours = companyProfile.businessHours;
  const officeAddress = companyProfile.address.trim();
  const services = serviceCategories.map(({ title, description }) => ({
    label: title,
    hint: description,
  }));
  const heroDescription = resolveCmsText(
    aboutContent.contactHeroDescription,
    "Have a project in mind, a question, or just want to say hello? Drop us a message and we’ll get back to you as soon as possible.",
    companyProfile
  );
  const heroFollowUpIndex = heroDescription.indexOf("Drop us a message");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [otherService, setOtherService] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useReveal();

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSubmitError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSubmitError("");
    setSubmitting(true);

    try {
      if (!cmsApiBase) {
        throw new Error("The enquiry service is not configured. Please contact us by phone or email.");
      }

      if (!readCsrfToken()) {
        const csrfUrl = `${new URL(cmsApiBase, window.location.origin).origin}/sanctum/csrf-cookie`;
        const csrfResponse = await fetch(csrfUrl, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!csrfResponse.ok) {
          throw new Error(`Could not start a secure enquiry session (HTTP ${csrfResponse.status}). Please try again.`);
        }
      }
      const csrfToken = readCsrfToken();

      const response = await fetch(`${cmsApiBase}/contact-enquiries`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify({
          ...form,
          service: form.service === "Other" ? otherService.trim() || "Other" : form.service,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 422 && isRecord(payload)) {
          const validationErrors = payload.errors;
          if (isRecord(validationErrors)) {
            const nextErrors: Errors = {};
            formFields.forEach((key) => {
              const fieldErrors = validationErrors[key];
              if (Array.isArray(fieldErrors) && typeof fieldErrors[0] === "string") {
                nextErrors[key] = fieldErrors[0];
              }
            });
            setErrors(nextErrors);
          }
        }
        const responseMessage = isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : "";
        const retryAfter = Number(response.headers.get("Retry-After") ?? (isRecord(payload) ? payload.retry_after : 0));
        const message = response.status === 429 && (!responseMessage || responseMessage === "Too Many Attempts.")
          ? `You've reached the submission limit. Please try again in ${retryAfter > 0 ? `${retryAfter} seconds` : "a little while"}.`
          : responseMessage || `Could not submit your enquiry (HTTP ${response.status}). Please try again.`;
        throw new Error(message);
      }

      setSent(true);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Could not submit your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title={`Contact ${companyProfile.brandName} | Let's Build Something Great Together`}
        description={`Contact ${companyProfile.name} to discuss your technology, digital growth, creative, or automation project.`}
      />

      {/* ============================ HERO (~50vh) ============================ */}
      <section
        className="ct-hero"
        style={aboutContent.contactHeroImage ? { backgroundImage: `url("${aboutContent.contactHeroImage}")` } : undefined}
      >
        <div className="container ct-hero__inner">
          <div className="section-heading ct-hero__copy">
            <p className="eyebrow ct-eyebrow" data-reveal>
              <span />
              {resolveCmsText(aboutContent.contactHeroEyebrow, "Get In Touch", companyProfile)}
            </p>

            <h1 className="section-heading__title" data-reveal style={delay(80)}>
              {accentedHeading(resolveCmsText(aboutContent.contactHeroTitle, "Let’s build something great together.", companyProfile), 2, "half")}
            </h1>

            <p className="section-heading__copy ct-hero__text" data-reveal style={delay(160)}>
              {heroFollowUpIndex >= 0 ? (
                <>
                  {heroDescription.slice(0, heroFollowUpIndex).trimEnd()}
                  <br />
                  {heroDescription.slice(heroFollowUpIndex)}
                </>
              ) : heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== OFFICE + FORM ========================== */}
      <section className="ct-form-section" id="contact-form">
        <div className="container ct-form-section__grid">
          {/* Left: office visual */}
          <div className="ct-office" data-reveal>
            <div className="ct-office__yellow" aria-hidden="true" />
            <div className="ct-dots ct-dots--tl" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="ct-office__photo">
              {aboutContent.contactOfficeImage && <img src={aboutContent.contactOfficeImage} alt={`${companyProfile.brandName} office interior`} loading="lazy" />}
            </div>
            <div className="ct-note" aria-hidden="true">
              <span className="ct-note__paper">
                <b>{resolveCmsText(aboutContent.contactNote, "Let’s Talk!", companyProfile)}</b>
                <svg viewBox="0 0 60 26" fill="none">
                  <path d="M3 6c12 14 30 18 48 6" stroke="#100563" strokeWidth="2" strokeLinecap="round" />
                  <path d="M45 6l7 6-9 3" stroke="#100563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="ct-dots ct-dots--br" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="ct-office__card">
              <p className="ct-office__label">
                <i />
                Our Office
              </p>
              <div className="ct-office__place">
                <span>
                  <MapPin />
                </span>
                <address className="ct-office__address">
                  {officeAddress || "Contact us for our current address."}
                </address>
              </div>
              <p>{resolveCmsText(aboutContent.contactOfficeDescription, "Drop by for a coffee, a chat, or a brainstorming session. We’d love to meet you in person!", companyProfile)}</p>
            </div>
          </div>

          {/* Right: form */}
          <div className="ct-form-card" data-reveal style={delay(120)}>
            {sent ? (
              <div className="ct-success" role="status">
                <CheckCircle2 />
                <p className="ct-success__eyebrow">Thank you.</p>
                <h2 className="ct-inline-heading">{accentedHeading(resolveCmsText(aboutContent.contactSuccessTitle, "Your idea is ready for the next conversation.", companyProfile), 2, "half")}</h2>
              </div>
            ) : (
              <form onSubmit={(event) => void submit(event)} noValidate aria-busy={submitting}>
                <p className="eyebrow ct-eyebrow">
                  <span />
                  {resolveCmsText(aboutContent.contactFormEyebrow, "Send a Message", companyProfile)}
                </p>
                <h2 className="ct-inline-heading">{accentedHeading(resolveCmsText(aboutContent.contactFormTitle, "Tell us about your project.", companyProfile), 2, "after-prefix")}</h2>
                <p className="ct-form-card__sub">
                  {resolveCmsText(aboutContent.contactFormDescription, "Fill out the form below and we’ll get back to you with the right solution for your needs.", companyProfile)}
                </p>

                <div className="ct-row">
                  <Field label="Your Name *" error={errors.name}>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      disabled={submitting}
                    />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      disabled={submitting}
                    />
                  </Field>
                </div>

                <div className="ct-row">
                  <Field label="Phone Number *" error={errors.phone}>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                      placeholder="Enter phone number"
                      autoComplete="tel-national"
                      maxLength={32}
                      inputMode="text"
                      pattern="[A-Za-z0-9]+"
                      title="Use letters and numbers only."
                      aria-invalid={!!errors.phone}
                      disabled={submitting}
                    />
                  </Field>
                  <ServiceSelect
                    value={form.service}
                    onChange={(value) => {
                      update("service", value);
                      if (value !== "Other") setOtherService("");
                    }}
                    services={services}
                    disabled={submitting}
                  />
                </div>

                {form.service === "Other" && (
                  <Field label="Other service">
                    <input
                      value={otherService}
                      onChange={(event) => {
                        setOtherService(event.target.value);
                        setSubmitError("");
                      }}
                      placeholder="Tell us what you need"
                      disabled={submitting}
                    />
                  </Field>
                )}

                <Field label="Your Message *" error={errors.message}>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about your project, goals or any specific requirements..."
                    aria-invalid={!!errors.message}
                    disabled={submitting}
                  />
                </Field>

                <div className="ct-form-card__foot">
                  <button className="button ct-btn" type="submit" data-cursor="SEND" disabled={submitting}>
                    {submitting ? <LoaderCircle className="ct-submit-spinner" aria-hidden="true" /> : <ArrowUpRight />}
                    <span>{submitting ? "Sending enquiry…" : "Send Message"}</span>
                  </button>
                  <p className="ct-safe">
                    <Lock />
                    Your information is safe with us.
                  </p>
                </div>
                {submitError && <p className="ct-submit-error" role="alert">{submitError}</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ======================== CONTACT INFO ======================== */}
      <section className="ct-info">
        <div className="container ct-info__grid">
          <div className="ct-info__intro">
            <p className="eyebrow ct-eyebrow">
              <span />
              Contact information
            </p>
            <h2 className="ct-inline-heading">{accentedHeading(resolveCmsText(aboutContent.contactInfoTitle, "Multiple ways to reach us.", companyProfile), 3, "after-two")}</h2>
            <p>{resolveCmsText(aboutContent.contactInfoDescription, "Whether you prefer email, phone, or a quick chat — we’re here and ready to help.", companyProfile)}</p>
          </div>

          <div className="ct-info__cards">
            <a className="ct-card" href={`mailto:${email}`} data-reveal style={{ ...delay(0), "--ct-card-image": aboutContent.contactCard1Image ? `url("${aboutContent.contactCard1Image}")` : "none" } as CSSProperties} data-cursor="EMAIL">
              <span className="ct-card__icon">
                <Mail />
              </span>
              <h3>Email Us</h3>
              <p className="ct-card__main">{email}</p>
              <p className="ct-card__sub">{resolveCmsText(aboutContent.emailResponseTime, "We’ll reply within 24 hours.", companyProfile)}</p>
            </a>

            <a
              className="ct-card"
              href={companyProfile.phone.telUrl}
              data-reveal
              style={{ ...delay(90), "--ct-card-image": aboutContent.contactCard2Image ? `url("${aboutContent.contactCard2Image}")` : "none" } as CSSProperties}
              data-cursor="CALL"
            >
              <span className="ct-card__icon">
                <Phone />
              </span>
              <h3>Call Us</h3>
              <p className="ct-card__main">{phone}</p>
              <p className="ct-card__sub">{hours || "Contact us for current business hours."}</p>
            </a>

            <a
              className="ct-card"
              href={companyProfile.maps.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              style={{ ...delay(180), "--ct-card-image": aboutContent.contactCard3Image ? `url("${aboutContent.contactCard3Image}")` : "none" } as CSSProperties}
              data-cursor="MAP"
            >
              <span className="ct-card__icon">
                <MapPin />
              </span>
              <h3>Visit Us</h3>
              <p className="ct-card__main">{companyProfile.address}</p>
              <p className="ct-card__sub">Open our location in Google Maps.</p>
            </a>

            <div className="ct-card" data-reveal style={{ ...delay(270), "--ct-card-image": aboutContent.contactCard4Image ? `url("${aboutContent.contactCard4Image}")` : "none" } as CSSProperties}>
              <span className="ct-card__icon">
                <Share2 />
              </span>
              <h3>Follow Us</h3>
              <div className="ct-socials">
                {activeCompanySocials.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    title={label}
                    data-cursor="OPEN"
                  >
                    <BrandSocialIcon name={icon} />
                  </a>
                ))}
              </div>
              <p className="ct-card__sub">Stay connected for the latest updates.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================= LOCATION =========================== */}
      <section className="ct-location">
        <div className="container">
          <div className="ct-location__wrap" data-reveal>
            <div className="ct-building">
              <span className="ct-building__dot" aria-hidden="true" />
              {aboutContent.contactBuildingImage && <img src={aboutContent.contactBuildingImage} alt={`${companyProfile.brandName} office building`} loading="lazy" />}
              <p className="ct-building__tag" aria-hidden="true">
                {companyProfile.brandName}
                <br />
                <em>Your Next Idea</em>
              </p>

              <div className="ct-location__text">
                <p className="eyebrow ct-eyebrow eyebrow--light">
                  <span />
                  Our Location
                </p>
                <h2 className="ct-inline-heading">{accentedHeading(resolveCmsText(aboutContent.contactLocationTitle, "Visit our office. We’d love to meet you.", companyProfile), 4)}</h2>
                <p className="ct-location__lead">
                  {resolveCmsText(aboutContent.contactLocationDescription, "Come say hello! Our doors are always open to partners, clients, and creative minds. Let’s grab a coffee and talk about your next big idea.", companyProfile)}
                </p>
              </div>
            </div>

            <div className="ct-map">
              {companyMapEmbedUrl ? (
                <iframe
                  className="ct-map__embed"
                  title={`Map showing ${companyProfile.name} in ${companyProfile.locationLabel || companyProfile.address || companyProfile.name}`}
                  src={companyMapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : null}
              <a className="ct-map__btn" href={companyProfile.maps.directionsUrl} target="_blank" rel="noopener noreferrer" data-cursor="DIRECTIONS">
                <MapPin /> Get Directions <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================== CTA ============================== */}
      <section className="ct-cta">
        <div className="container">
          <div className="ct-cta__box" data-reveal>
            <div className="ct-cta__waves" aria-hidden="true" />
            <div className="ct-cta__grid" aria-hidden="true" />
            <span className="ct-cta__orb ct-cta__orb--1" aria-hidden="true" />
            <span className="ct-cta__orb ct-cta__orb--2" aria-hidden="true" />
            <span className="ct-cta__orb ct-cta__orb--3" aria-hidden="true" />
            <div className="ct-cta__copy">
              <p className="eyebrow ct-eyebrow eyebrow--light">
                <span />
                {resolveCmsText(aboutContent.contactCtaEyebrow, "Let’s Build Together", companyProfile)}
              </p>
              <h2 className="ct-inline-heading">{accentedHeading(resolveCmsText(aboutContent.contactCtaTitle, "Have a project in mind? Let’s make it happen.", companyProfile), 4)}</h2>
              <p>{resolveCmsText(aboutContent.contactCtaDescription, "We’re just a message away. Whether it’s a small idea or a big vision, we’re here to help.", companyProfile)}</p>
            </div>
            <div className="ct-cta__art" aria-hidden="true">
              <svg className="ct-cta__trail" viewBox="0 0 240 90" fill="none">
                <path
                  d="M5 80C50 85 70 40 110 55S170 20 235 8"
                  stroke="#ffe401"
                  strokeWidth="2"
                  strokeDasharray="3 8"
                  strokeLinecap="round"
                />
              </svg>
              <PaperPlane className="ct-cta__plane" />
            </div>
            <a href="#contact-form" className="button ct-btn ct-cta__btn" data-cursor="START">
              <span>{resolveCmsText(aboutContent.contactCtaButton, "Get In Touch", companyProfile)}</span>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}