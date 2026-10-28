import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { SectionHeading } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/service-detail.css";

/* ------------------------------------------------------------------ */
/*  Tiny motion helpers (no extra dependencies)                        */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fires once when the element scrolls into view. */
function useInView(threshold = 0.18) {
  const [node, setNode] = useState<Element | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, threshold]);
  return [setNode, seen] as const;
}

/** Scroll-reveal wrapper. Only handles the entrance, so hover styles on children stay snappy. */
function Fx({
  as: Tag = "div",
  className = "",
  delay = 0,
  children,
}: {
  as?: "div" | "li" | "ol" | "ul";
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={`fx ${seen ? "is-in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Cursor-follow light inside a card (sets --mx / --my). */
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/** Button that gently pulls toward the cursor. */
function Magnet({ children }: { children: ReactNode }) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };
  return (
    <div className="sd-magnet" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const { allServices, companyProfile, processSteps, serviceCategories, serviceDetails } = useCmsContent();
  const service = serviceDetails[slug];

  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = progressRef.current;
    const update = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(h.scrollHeight - h.clientHeight, 1);
      bar?.style.setProperty("--p", String(p));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [slug]);

  const [approachRef, approachSeen] = useInView(0.25);

  if (!service) return <Navigate to="/services" replace />;

  const related = allServices
    .filter((item) => item.category === service.category && item.slug !== slug)
    .slice(0, 3);
  const categoryImage = serviceCategories.find((category) => category.title === service.category)?.imagePath;
  const heroImage = service.heroImage ?? categoryImage;
  const words = service.title.split(" ");

  const glow = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  return (
    <>
      <Seo title={`${service.title} | ${companyProfile.brandName} Services`} description={service.intro} />
      <div className="sd-progress" ref={progressRef} aria-hidden="true" />

      {/* HERO */}
      <section className="sd-hero" onPointerMove={glow}>
        <div className="sd-hero__bg" aria-hidden="true">
          <span className="sd-hero__blob sd-hero__blob--a" />
          <span className="sd-hero__blob sd-hero__blob--b" />
          <span className="sd-hero__glow" />
        </div>

        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>{service.category}</span>
          </nav>

          <div className="sd-hero__layout">
            <div className="sd-hero__copy">
              <p className="eyebrow"><span />{service.category}</p>
              <h1 aria-label={service.title}>
                {words.map((word, i) => (
                  <span className={`sd-word${i === words.length - 1 ? " sd-word--accent" : ""}`} key={`${word}-${i}`} aria-hidden="true">
                    <span style={{ "--i": i } as CSSProperties}>{word}</span>
                  </span>
                ))}
              </h1>
              <p className="sd-hero__lead">{service.intro}</p>
              <div className="sd-hero__actions">
                <Button to="/contact">Discuss your project</Button>
                <a className="sd-hero__link" href="#capabilities">See what we build</a>
              </div>
            </div>

            <div className="sd-hero__stage">
              <div className="sd-hero__visual">
                {heroImage && (
                  <img
                    className="sd-hero__image"
                    src={heroImage}
                    alt={`${service.category} service`}
                    fetchPriority="high"
                  />
                )}
                <span className="sd-hero__image-wash" aria-hidden="true" />
                <div className="sd-hero__visual-card">
                  <span className="sd-hero__visual-mark"><Check aria-hidden="true" size={16} /></span>
                  <span>
                    <small>Designed around your goals</small>
                    <strong>{service.title}</strong>
                  </span>
                </div>
                <span className="sd-hero__visual-index" aria-hidden="true">
                  <span /> {service.category}
                </span>
                <div className="sd-hero__visual-capabilities" aria-label="Service highlights">
                  {service.capabilities.slice(0, 2).map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE BAND */}
      <div className="sd-marquee-wrap" aria-hidden="true">
        <div className="sd-marquee">
          <div className="sd-marquee__track">
            {[0, 1].map((copy) => (
              <div className="sd-marquee__set" key={copy}>
                {[...service.capabilities, ...service.capabilities].map((item, i) => (
                  <span key={`${copy}-${i}`}>{item}<b>✦</b></span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAPABILITIES */}
      <section className="sd-caps section" id="capabilities">
        <div className="container sd-caps__grid">
          <Fx>
            <SectionHeading
              eyebrow="What we build"
              title={<><span>Focused capability.</span><em>Connected thinking.</em></>}
              copy="We shape the scope around your actual goals, users, systems and operating context."
            />
          </Fx>
          <ul className="sd-caps__list">
            {service.capabilities.map((capability, i) => (
              <Fx as="li" key={capability} delay={(i % 6) * 70}>
                <div className="sd-card" onPointerMove={spotlight}>
                  <span className="sd-caps__tick"><Check size={16} strokeWidth={2.6} /></span>
                  <h3>{capability}</h3>
                </div>
              </Fx>
            ))}
          </ul>
        </div>
      </section>

      {/* APPROACH — a real sequence, so numbered */}
      <section className="sd-approach section">
        <div className="container">
          <Fx>
            <SectionHeading eyebrow="Approach" title={<><span>Clear from discovery</span><em>to growth.</em></>} />
          </Fx>
          <ol className={`sd-approach__steps ${approachSeen ? "is-in" : ""}`} ref={approachRef}>
            {processSteps.slice(0, 4).map(([number, title, copy], i) => (
              <li key={title} style={{ "--d": `${300 + i * 260}ms` } as CSSProperties}>
                <span className="sd-approach__badge">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="sd-deliver section" onPointerMove={glow}>
        <span className="sd-deliver__glow" aria-hidden="true" />
        <div className="container sd-deliver__grid">
          <Fx>
            <p className="eyebrow eyebrow--light"><span />Typical deliverables</p>
            <h2>A purposeful system, ready to move forward.</h2>
          </Fx>
          <ul>
            {service.deliverables.map((item, i) => (
              <Fx as="li" key={item} delay={i * 110}>
                <div className="sd-card sd-card--dark" onPointerMove={spotlight}>
                  <Check size={18} strokeWidth={2.6} />
                  <span>{item}</span>
                </div>
              </Fx>
            ))}
          </ul>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="sd-related section">
          <div className="container">
            <Fx>
              <SectionHeading eyebrow="Keep exploring" title={<><span>More in</span><em>{service.category}.</em></>} />
            </Fx>
            <div className="sd-related__grid">
              {related.map(({ slug: relatedSlug, title, description, icon: RelatedIcon }, i) => (
                <Fx key={relatedSlug} delay={i * 120}>
                  <Link to={`/services/${relatedSlug}`} className="sd-related__card" onPointerMove={spotlight}>
                    <RelatedIcon size={28} strokeWidth={1.4} />
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <ArrowUpRight className="sd-related__arrow" size={22} />
                  </Link>
                </Fx>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sd-cta">
        <div className="container">
          <Fx>
            <div className="sd-cta__card">
              <div className="sd-cta__ghost" aria-hidden="true">
                <div>
                  {[0, 1].map((n) => (
                    <span key={n}>{service.title} · {service.title} · {service.title} · </span>
                  ))}
                </div>
              </div>
              <p>Have a {service.title.toLowerCase()} challenge?</p>
              <h2>Let&apos;s find the right way forward.</h2>
              <Magnet>
                <Button to="/contact">Start a conversation</Button>
              </Magnet>
            </div>
          </Fx>
        </div>
      </section>
    </>
  );
}