import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  Boxes,
  CheckCircle2,
  Clock,
  Code2,
  Eye,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Seo from "../components/Seo";
import { Reveal, SectionHeading } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import TechStackRibbons from "../components/TechStackRibbons";
import { resolveCmsText, useCmsContent } from "../content/CmsContentProvider";
import "../styles/AboutExperience.css";

/* How long each hero card stays in front (milliseconds) */
const SWAP_MS = 2500;

const statsMeta = [
  {
    icon: Sparkles,
    kicker: "Established Track Record",
    micro: "Delivering senior digital engineering & strategic execution.",
    isLive: false,
  },
  {
    icon: CheckCircle2,
    kicker: "Production Shipped",
    micro: "SaaS, custom enterprise software & scalable platforms.",
    isLive: false,
  },
  {
    icon: Star,
    kicker: "Client Rating",
    micro: "Long-term trusted partnerships with industry leaders.",
    isLive: false,
  },
  {
    icon: Clock,
    kicker: "Always Online",
    micro: "Proactive monitoring, maintenance & rapid response.",
    isLive: true,
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Years of experience", icon: Award },
  { value: 50, suffix: "+", label: "Projects delivered", icon: CheckCircle2 },
  { value: 98, suffix: "%", label: "Client satisfaction", icon: Heart },
  { value: 24, suffix: "/7", label: "Support", icon: Clock },
];

const values = [
  { icon: ShieldCheck, title: "Integrity", copy: "We value honesty, accountability and doing the right thing." },
  { icon: Lightbulb, title: "Innovation", copy: "We keep exploring better ways to solve meaningful problems." },
  { icon: Handshake, title: "Collaboration", copy: "We do our best work through trust, listening and teamwork." },
  { icon: Award, title: "Excellence", copy: "We care about the details and the quality of every outcome." },
  { icon: Heart, title: "Passion", copy: "We bring curiosity, energy and care to the work we do." },
  { icon: Leaf, title: "Sustainability", copy: "We aim to build lasting value, not just quick wins." },
];

const whyPillars = [
  {
    badge: "01 / CRAFTSMANSHIP",
    status: "Senior Engineers Only",
    dotColor: "#10b981",
    icon: Code2,
    title: "Senior-led execution. Zero junior handoffs.",
    description:
      "Every architecture decision, domain schema, and code PR is designed and vetted directly by experienced tech leads. Clean, maintainable software built right the first time.",
    tags: ["Domain-Driven Design", "Rigorous Code Audits", "Clean Architecture", "Zero Technical Debt"],
  },
  {
    badge: "02 / VELOCITY",
    status: "Continuous Ship Cycles",
    dotColor: "#eab308",
    icon: Rocket,
    title: "Sprint-ready teams shipping working code every week.",
    description:
      "We run focused 2-week agile sprints with concrete milestones, live staging previews, and weekly walkthrough demos so you always have full control of product momentum.",
    tags: ["2-Week Agile Sprints", "Live Staging Previews", "Weekly Demos", "Continuous CI/CD"],
  },
  {
    badge: "03 / TRANSPARENCY",
    status: "100% IP Ownership",
    dotColor: "#3b82f6",
    icon: ShieldCheck,
    title: "Radical transparency. You own everything from Day 1.",
    description:
      "Direct Slack and video call access with the engineers doing the work. You retain 100% ownership of your Git repositories, cloud accounts, and intellectual property.",
    tags: ["100% Code & IP Ownership", "Direct Slack Channels", "Transparent Git Repos", "Daily Async Syncs"],
  },
  {
    badge: "04 / SCALABILITY",
    status: "Built for 100x Growth",
    dotColor: "#8b5cf6",
    icon: TrendingUp,
    title: "Enterprise-grade resilience engineered for high scale.",
    description:
      "From high-concurrency database queries and Redis caching to Dockerized microservices on AWS, our platforms are engineered to comfortably handle exponential traffic spikes.",
    tags: ["Sub-100ms API Latency", "AWS & Docker Infrastructure", "Optimized Redis Caching", "99.9% Uptime Track Record"],
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function optimizedAboutImage(source: string | undefined): string | undefined {
  if (!source) return source;

  const optimizedPaths: Record<string, string> = {
    "/images/home/technology.png": "/images/home/technology.webp",
    "/images/services/sec-creative.png": "/images/services/sec-creative.webp",
  };

  try {
    const url = new URL(source, window.location.origin);
    const optimizedPath = url.origin === window.location.origin
      ? optimizedPaths[url.pathname]
      : undefined;

    if (!optimizedPath) return source;

    return source.startsWith("/")
      ? `${optimizedPath}${url.search}${url.hash}`
      : `${url.origin}${optimizedPath}${url.search}${url.hash}`;
  } catch {
    return source;
  }
}

/* Splits a heading so the last words get the serif accent */
function accentedHeading(value: string, accentWords = 2) {
  const normalized = value.trim().replace(/\s+/g, " ");
  const words = normalized.split(" ");
  const splitAt = Math.max(1, words.length - accentWords);
  return (
    <>
      <span>{words.slice(0, splitAt).join(" ")} </span>
      <em>{words.slice(splitAt).join(" ")}</em>
    </>
  );
}

/* Count-up number that starts when scrolled into view */
function CounterNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }
    if (!inView) return;

    let startTime: number | null = null;
    const duration = 1600; // 1.6s energetic count-up
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOutExpo * value);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, value, prefersReduced]);

  return (
    <div ref={containerRef} className="aboutx-deck__num-wrap">
      <span className="aboutx-deck__num">{displayValue}</span>
      <span className="aboutx-deck__suffix">{suffix}</span>
    </div>
  );
}

/* Hero card stack: 01 Technology / 02 Digital Growth / 03 Creative swap automatically.
   The front card lifts out, tucks behind the stack, and the next card springs forward
   while its content rises in line by line. */
function CapabilitySwap() {
  const { serviceCategories, companyProfile } = useCmsContent();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [compact, setCompact] = useState(false);
  const total = serviceCategories.length;
  const activeIndex = total > 0 ? active % total : 0;

  /* smaller stack offsets on phones */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* auto swap */
  useEffect(() => {
    if (paused || reduced || total === 0) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % total), SWAP_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, cycle, total]);

  const select = (i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  };
  const resume = () => {
    setPaused(false);
    setCycle((c) => c + 1);
  };

  if (total === 0) return null;

  const step = compact ? 9 : 14;
  const pose = (pos: number) => {
    if (pos === 0) return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
    if (pos === 1) return { x: step, y: -step * 1.1, scale: 0.94, rotate: 2, opacity: 1 };
    if (pos === 2) return { x: step * 2, y: -step * 2.2, scale: 0.88, rotate: 4, opacity: 1 };
    return { x: step * 2, y: -step * 2.2, scale: 0.88, rotate: 4, opacity: 0 };
  };

  const spring: Transition = { type: "spring", stiffness: 170, damping: 22, mass: 0.9 };

  return (
    <div
      className="aboutx-swap"
      data-paused={paused}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={resume}
      onFocus={() => setPaused(true)}
      onBlur={resume}
    >
      {/* Spinning ring with dynamic logo uploaded by admin (/admin/profile) */}
      <div className="aboutx-swap__ring" aria-label={companyProfile.brandName || "Company logo"}>
        <span className="aboutx-swap__ring-orbit" aria-hidden="true" />
        <div className="aboutx-swap__ring-inner">
          <img
            src={companyProfile.logoUrl || "/images/logo/sw_logo.png"}
            alt={`${companyProfile.brandName || "Company"} logo`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(e) => {
              const fallback = "/images/logo/sw_logo.png";
              if (e.currentTarget.src !== window.location.origin + fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />
        </div>
      </div>

      <div className="aboutx-swap__stack" aria-live="off">
        {serviceCategories.map((c, i) => {
          const Icon = c.icon;
          const pos = (i - activeIndex + total) % total;
          const isFront = pos === 0;
          /* the card that just left the front always lands at the back of the stack */
          const leaving = total > 1 && pos === total - 1;
          const services: readonly { title: string; slug: string; icon: LucideIcon }[] = c.services;
          const p = pose(pos);

          const target = leaving
            ? {
                x: [null, -step * 2.6, p.x],
                y: [null, step * 0.4, p.y],
                rotate: [null, -4, p.rotate],
                scale: [null, 0.985, p.scale],
                opacity: [null, 1, p.opacity],
                zIndex: 0,
              }
            : { ...p, zIndex: total - pos };

          const transition: Transition = reduced
            ? { duration: 0 }
            : leaving
              ? {
                  default: { duration: 0.9, ease: [0.22, 1, 0.36, 1], times: [0, 0.38, 1] },
                  zIndex: { duration: 0, delay: 0.3 },
                }
              : { default: spring, zIndex: { duration: 0, delay: 0 } };

          return (
            <motion.article
              key={c.id}
              className={`aboutx-swap__card aboutx-swap__card--${Math.min(pos, 2)}`}
              data-tone={i % 3}
              initial={false}
              animate={target}
              transition={transition}
              aria-hidden={!isFront}
              onClick={() => !isFront && select(i)}
            >
              <header className="aboutx-swap__head">
                <span className="aboutx-swap__num">{c.number}</span>
                <span className="aboutx-swap__badge"><Icon size={20} aria-hidden="true" /></span>
              </header>

              <p className="aboutx-swap__kicker">{c.title}</p>
              <p className="aboutx-swap__statement">{c.statement}</p>
              <p className="aboutx-swap__desc">{c.description}</p>

              <ul className="aboutx-swap__chips">
                {services.map((s) => {
                  const SIcon = s.icon;
                  return (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} tabIndex={isFront ? 0 : -1}>
                        <SIcon size={14} aria-hidden="true" />
                        {s.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

/* Spotlight + 3D tilt that follows the cursor (sets CSS vars only, no re-render) */
function useTilt(max = 6) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
  };
  const onLeave = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return { onMouseMove: onMove, onMouseLeave: onLeave };
}

export default function About() {
  const { aboutContent, companyProfile } = useCmsContent();
  const reduced = useReducedMotion();
  const tilt = useTilt(6);
  const softTilt = useTilt(4);
  const copy = (key: string, fallback: string) => resolveCmsText(aboutContent[key], fallback, companyProfile);
  const visionImage = optimizedAboutImage(aboutContent.visionImage);
  const creativeImage = optimizedAboutImage(aboutContent.creativeImage);
  const headline = copy("headline", "Empowering Your Digital Future");
  const liveValues = values.map((item, index) => ({
    ...item,
    title: copy(`value${index + 1}Title`, item.title),
    text: copy(`value${index + 1}Copy`, item.copy),
  }));
  const liveStats = stats.map((stat, index) => {
    const configuredValue = aboutContent[`stat${index + 1}Value`]?.trim();
    const value = Number(configuredValue);

    return {
      ...stat,
      value: configuredValue && Number.isFinite(value) ? value : stat.value,
      suffix: copy(`stat${index + 1}Suffix`, stat.suffix),
      label: copy(`stat${index + 1}Label`, stat.label),
    };
  });
  const headlineWords = headline.split(/\s+/);
  const headlinePrefix = headlineWords.slice(0, -2).join(" ");
  const headlineAccent = headlineWords.slice(-2).join(" ");

  const visionTitlePrefix = copy("visionTitlePrefix", "Our");
  const visionTitleAccent = copy("visionTitleAccent", "Vision.");

  const missionTitlePrefix = copy("missionTitlePrefix", "Our");
  const missionTitleAccent = copy("missionTitleAccent", "Mission.");

  return (
    <div className="aboutx" data-nav="light">
      <Seo
        title={`About ${companyProfile.brandName} | ${headline}`}
        description={copy("seoDescription", aboutContent.intro || `Discover ${companyProfile.brandName}'s vision, mission, values and approach to creating meaningful digital experiences.`)}
      />

      {/* PAGE INTRO: breadcrumb + headline + swapping capability cards */}
      <section
        className="aboutx-intro"
        aria-labelledby="aboutx-hero-title"
        onMouseMove={tilt.onMouseMove}
      >
        <div className="aboutx-intro__bg" aria-hidden="true">
          <span className="aboutx-intro__grid" />
          <span className="aboutx-intro__spot" />
        </div>

        <div className="container">
          <motion.nav
            className="breadcrumb"
            aria-label="Breadcrumb"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Link to="/">Home</Link>
            <span>/</span>
            <span aria-current="page">About us</span>
          </motion.nav>

          <div className="aboutx-intro__layout">
            <div className="aboutx-intro__copy">
              <p className="eyebrow aboutx-eyebrow"><span />Who we are</p>

              <h1 id="aboutx-hero-title">
                {(headlinePrefix ? headlinePrefix : headlineAccent).split(" ").map((w, i) => (
                  <span className="aboutx-word" key={`${w}-${i}`}>
                    <motion.span
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
                {headlinePrefix && (
                  <span className="aboutx-word">
                    <motion.em
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, delay: 0.35, ease }}
                    >
                      {headlineAccent}
                    </motion.em>
                  </span>
                )}
              </h1>

              <motion.p
                className="aboutx-intro__text"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease }}
              >
                {copy("intro", `At {{brandName}}, we empower businesses to turn ideas into meaningful digital experiences through technology, creativity and connected thinking.`)}
              </motion.p>

              <motion.div
                className="aboutx-hero__actions"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease }}
              >
                <Button to="/contact">Start Your Journey</Button>
                <a className="aboutx-text-link" href="#about-vision" data-cursor="STORY">
                  <span>Discover our story</span> <ArrowDownRight size={16} aria-hidden="true" />
                </a>
              </motion.div>
            </div>

            <CapabilitySwap />
          </div>
        </div>
      </section>

      {/* TECH STACK RIBBONS */}
      <TechStackRibbons />

      {/* VISION */}
      <section className="aboutx-story" id="about-vision">
        <div className="container aboutx-story__grid">
          <Reveal className="aboutx-story__visual" direction="left">
            <div className="aboutx-frame aboutx-frame--vision" {...tilt}>
              {/* Spinning ring with dynamic logo uploaded by admin (/admin/profile) */}
              <div className="aboutx-frame__ring" aria-label={companyProfile.brandName || "Company logo"}>
                <span className="aboutx-frame__ring-orbit" aria-hidden="true" />
                <div className="aboutx-frame__ring-inner">
                  <img
                    src={companyProfile.logoUrl || "/images/logo/sw_logo.png"}
                    alt={`${companyProfile.brandName || "Company"} logo`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const fallback = "/images/logo/sw_logo.png";
                      if (e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                </div>
              </div>

              <div className="aboutx-story__image">
                {visionImage && <img src={visionImage} alt="A conceptual view of digital transformation and a smarter future" loading="lazy" decoding="async" />}
              </div>
            </div>
          </Reveal>

          <Reveal className="aboutx-story__content" direction="right">
            <p className="eyebrow aboutx-eyebrow"><span />{copy("visionEyebrow", "Purpose & Direction")}</p>
            <h2 className="aboutx-story__title">
              <span>{visionTitlePrefix}&nbsp;</span>
              <em>{visionTitleAccent}</em>
            </h2>
            <p>{copy("vision", "We envision a digital landscape where technology is engineered for lasting commercial and human impact. By uniting technical depth with intuitive design, we empower forward-thinking organizations to lead their markets and adapt effortlessly.")}</p>
            <p>{copy("visionDetail", "In an era of rapid technological change, true competitive advantage belongs to businesses that build with purpose. We bridge the gap between ambitious roadmaps and flawless digital execution.")}</p>
            <div className="aboutx-story__callout">
              <span><Target size={20} /></span>
              <p>{copy("visionCallout", "Lasting digital progress happens when technical excellence directly solves critical business needs.")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="aboutx-mission" id="about-mission">
        <div className="container aboutx-mission__grid">
          <Reveal className="aboutx-mission__content" direction="left">
            <p className="eyebrow aboutx-eyebrow"><span />{copy("missionEyebrow", "Action & Impact")}</p>
            <h2 className="aboutx-story__title">
              <span>{missionTitlePrefix}&nbsp;</span>
              <em>{missionTitleAccent}</em>
            </h2>
            <p>
              {copy("missionIntro", "Our mission is to engineer robust software, seamless digital systems, and high-converting experiences that drive tangible business momentum and operational clarity.")}
            </p>
            <p>
              {copy("missionDetail", "By bringing strategic vision, clean architecture, and rapid execution under one unified team, we help modern businesses scale faster, modernize legacy workflows, and ship products with conviction.")}
            </p>
            <div className="aboutx-mission__actions" style={{ marginTop: "28px" }}>
              <Button to="/services" variant="primary">
                Explore our capabilities
              </Button>
            </div>
          </Reveal>

          <Reveal className="aboutx-mission__visual aboutx-story__visual" direction="right">
            <div className="aboutx-frame aboutx-frame--mission" {...tilt}>
              {/* Spinning ring with dynamic logo uploaded by admin (/admin/profile) */}
              <div className="aboutx-frame__ring" aria-label={companyProfile.brandName || "Company logo"}>
                <span className="aboutx-frame__ring-orbit" aria-hidden="true" />
                <div className="aboutx-frame__ring-inner">
                  <img
                    src={companyProfile.logoUrl || "/images/logo/sw_logo.png"}
                    alt={`${companyProfile.brandName || "Company"} logo`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const fallback = "/images/logo/sw_logo.png";
                      if (e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                </div>
              </div>

              <div className="aboutx-mission__image aboutx-story__image">
                {creativeImage && <img src={creativeImage} alt="Creative design and digital innovation" loading="lazy" decoding="async" />}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS / PERFORMANCE DECK */}
      <section className="aboutx-stats" aria-label={`${companyProfile.brandName} at a glance`}>
        <div className="container">
          <div className="aboutx-stats__deck">
            {/* Bento Grid */}
            <div className="aboutx-stats__deck-grid">
              {liveStats.map((stat, index) => {
                const meta = statsMeta[index] || statsMeta[0];

                return (
                  <motion.div
                    className="aboutx-stats__cell"
                    key={stat.label}
                    initial={reduced ? false : { opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : index * 0.08, ease }}
                  >
                    <CounterNumber value={stat.value} suffix={stat.suffix} />

                    <h4 className="aboutx-stats__cell-label">{stat.label}</h4>
                    <p className="aboutx-stats__cell-micro">{meta.micro}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — Modern Bento Feature Grid */}
      <section className="wv-why" id="about-why" aria-labelledby="wv-why-title">
        <div className="container">
          <SectionHeading
            eyebrow={copy("whyEyebrow", `Why choose ${companyProfile.brandName || "Sipher Web"}`)}
            title={
              <>
                <span>{copy("whyTitleSpan", "Partnering for outcomes, ")}</span>
                <em>{copy("whyTitleAccent", "not just delivery.")}</em>
              </>
            }
            copy={copy(
              "whyDescription",
              "We don't just write code—we partner with ambitious founders and enterprise leaders to architect, build, and scale resilient digital products that compound business value."
            )}
          />

          <ul className="wv-why__grid">
            {whyPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.li
                  className="wv-why-card"
                  key={pillar.badge}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : (index % 2) * 0.08, ease }}
                >
                  <div>
                    <div className="wv-why-card__top">
                      <span className="wv-why-card__badge">{pillar.badge}</span>
                      <span className="wv-why-card__status">
                        <span className="wv-why-card__dot" style={{ backgroundColor: pillar.dotColor }} />
                        {pillar.status}
                      </span>
                    </div>

                    <div className="wv-why-card__icon-wrap">
                      <Icon size={24} strokeWidth={2} aria-hidden="true" />
                    </div>

                    <h3 className="wv-why-card__title">{pillar.title}</h3>
                    <p className="wv-why-card__text">{pillar.description}</p>
                  </div>

                  <div className="wv-why-card__tags">
                    {pillar.tags.map((tag) => (
                      <span className="wv-why-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            className="wv-why__trust-bar"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: 0.1, ease }}
          >
            <div className="wv-why__trust-info">
              <span className="wv-why__trust-icon">
                <Sparkles size={22} />
              </span>
              <div className="wv-why__trust-text">
                <h4>Have an ambitious product in mind?</h4>
                <p>Let's map out technical architecture, scope milestones, and sprint timelines.</p>
              </div>
            </div>

            <div className="wv-why__trust-actions">
              <Link className="wv-why__btn wv-why__btn--primary" to="/contact">
                <span>Start a conversation</span>
                <ArrowRight size={15} />
              </Link>
              <Link className="wv-why__btn wv-why__btn--secondary" to="/services">
                <span>Explore all services</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="wv-values" id="about-values">
        <div className="container">
          <SectionHeading
            eyebrow={copy("valuesEyebrow", "What we stand for")}
            title={<><span>Our core</span><em> values.</em></>}
            copy={copy("valuesDescription", "The principles that shape how we collaborate, make decisions and deliver our work.")}
          />

          <div className="wv-values__grid">
            {liveValues.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                className="wv-value-wrap"
                key={`${title}-${index}`}
                initial={reduced ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : (index % 3) * 0.08, ease }}
              >
                <article className="wv-value" {...softTilt}>
                  <span className="wv-value__icon">
                    <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="wv-value__bar" aria-hidden="true" />
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}