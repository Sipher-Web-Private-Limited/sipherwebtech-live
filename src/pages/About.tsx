import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Seo from "../components/Seo";
import { Reveal, SectionHeading } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { resolveCmsText, useCmsContent } from "../content/CmsContentProvider";
import "../styles/AboutExperience.css";

const highlights = [
  { icon: Lightbulb, title: "Innovative solutions", copy: "Thoughtful ideas, shaped around real needs." },
  { icon: Heart, title: "Client-centric", copy: "People and partnerships come first." },
  { icon: Award, title: "Industry expertise", copy: "A considered approach to every challenge." },
  { icon: TrendingUp, title: "Forward thinking", copy: "Digital experiences built to keep evolving." },
];

const stats = [
  { value: 5, suffix: "+", label: "Years of experience" },
  { value: 150, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 24, suffix: "/7", label: "Support" },
];

const reasons = [
  "Industry-leading expertise", "Cutting-edge technologies", "Dedicated support team",
  "Scalable solutions", "Competitive pricing", "Client-centric approach",
  "Innovative strategies", "Transparent processes", "Agile methodologies",
  "Comprehensive services", "Sustainable practices", "Quality-focused delivery",
];

const values = [
  { icon: ShieldCheck, title: "Integrity", copy: "We value honesty, accountability and doing the right thing." },
  { icon: Lightbulb, title: "Innovation", copy: "We keep exploring better ways to solve meaningful problems." },
  { icon: Handshake, title: "Collaboration", copy: "We do our best work through trust, listening and teamwork." },
  { icon: Award, title: "Excellence", copy: "We care about the details and the quality of every outcome." },
  { icon: Heart, title: "Passion", copy: "We bring curiosity, energy and care to the work we do." },
  { icon: Leaf, title: "Sustainability", copy: "We aim to build lasting value, not just quick wins." },
];

const marquee = ["Technology", "Digital Growth", "Creative", "Strategy", "Design", "Engineering", "Automation", "Branding"];
const promises = [
  "One connected team across technology, growth and creative",
  "A clear, collaborative process from first idea to launch",
  "Practical solutions built for lasting value",
];

const ease = [0.16, 1, 0.3, 1] as const;

/* Count-up number that starts when scrolled into view */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to]);

  return (
    <strong ref={ref as React.RefObject<HTMLElement>}>
      {n}
      <b>{suffix}</b>
    </strong>
  );
}

/* Interactive capability navigator: auto-rotates Technology / Digital Growth / Creative */
function CapabilityNavigator() {
  const { serviceCategories } = useCmsContent();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const total = serviceCategories.length;
  const activeIndex = total > 0 ? active % total : 0;

  useEffect(() => {
    if (paused || reduced || total === 0) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % total), 6000);
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
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") select((active + 1) % total);
    if (e.key === "ArrowLeft") select((active - 1 + total) % total);
  };

  const cat = serviceCategories[activeIndex];
  if (!cat) return null;
  const services: readonly { title: string; slug: string; icon: LucideIcon }[] = cat.services;

  return (
    <div className="aboutx-nav-wrap">
      <div
        className="aboutx-nav"
        data-paused={paused}
        data-tab={activeIndex}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={resume}
        onFocus={() => setPaused(true)}
        onBlur={resume}
      >
        <div className="aboutx-nav__tabs" role="tablist" aria-label="What we do" onKeyDown={onKey}>
          {serviceCategories.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`aboutx-tab-${c.id}`}
                aria-selected={i === activeIndex}
                aria-controls="aboutx-nav-panel"
                tabIndex={i === activeIndex ? 0 : -1}
                className="aboutx-nav__tab"
                onClick={() => select(i)}
              >
                <small>{c.number}</small>
                <strong><Icon size={17} aria-hidden="true" />{c.title}</strong>
                {i === activeIndex && <i key={`${activeIndex}-${cycle}`} className="aboutx-nav__bar" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="aboutx-nav__panel" id="aboutx-nav-panel" role="tabpanel" aria-labelledby={`aboutx-tab-${cat.id}`}>
          <AnimatePresence mode="sync">
            <motion.div
              key={cat.id}
              className="aboutx-nav__body"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
            >
              <span className="aboutx-nav__ghost" aria-hidden="true">{cat.number}</span>
              <p className="aboutx-nav__kicker">{cat.title}</p>
              <p className="aboutx-nav__statement">{cat.statement}</p>
              <p className="aboutx-nav__desc">{cat.description}</p>
              <ul className="aboutx-nav__chips">
                {services.map((s, i) => {
                  const SIcon = s.icon;
                  return (
                    <motion.li
                      key={s.slug}
                      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduced ? 0 : 0.1 + i * 0.04, duration: 0.35, ease }}
                    >
                      <Link to={`/services/${s.slug}`}>
                        <SIcon size={15} aria-hidden="true" />
                        {s.title}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <Link className="aboutx-nav__more" to="/services">
                Explore {cat.title} <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
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
  const { aboutContent, companyProfile, processSteps } = useCmsContent();
  const reduced = useReducedMotion();
  const tilt = useTilt(6);
  const copy = (key: string, fallback: string) => resolveCmsText(aboutContent[key], fallback, companyProfile);
  const visionImage = aboutContent.visionImage;
  const creativeImage = aboutContent.creativeImage;
  const headline = copy("headline", "Empowering Your Digital Future");
  const livePromises = promises.map((promise, index) => copy(`promise${index + 1}`, promise));
  const liveHighlights = highlights.map((item, index) => ({
    ...item,
    title: copy(`highlight${index + 1}Title`, item.title),
    copy: copy(`highlight${index + 1}Copy`, item.copy),
  }));
  const liveReasons = reasons.map((reason, index) => copy(`reason${index + 1}`, reason));
  const liveValues = values.map((item, index) => ({
    ...item,
    title: copy(`value${index + 1}Title`, item.title),
    copy: copy(`value${index + 1}Copy`, item.copy),
  }));
  const liveProcessSteps = processSteps;
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

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <div className="aboutx" data-nav="light">
      <Seo
        title={`About ${companyProfile.brandName} | ${headline}`}
        description={copy("seoDescription", aboutContent.intro || `Discover ${companyProfile.brandName}'s vision, mission, values and approach to creating meaningful digital experiences.`)}
      />

      <motion.div className="aboutx-progress" style={{ scaleX: progress }} aria-hidden="true" />

      {/* PAGE INTRO (not a home-style hero): breadcrumb + headline + interactive capability navigator */}
      <section
        className="aboutx-intro"
        aria-labelledby="aboutx-hero-title"
        onMouseMove={tilt.onMouseMove}
      >
        <div className="aboutx-intro__bg" aria-hidden="true">
          <span className="aboutx-intro__grid" />
          <span className="aboutx-intro__spot" />
        </div>

        <div className="container aboutx-intro__layout">
          <div className="aboutx-intro__copy">
            <motion.nav
              className="aboutx-crumbs"
              aria-label="Breadcrumb"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <Link to="/">Home</Link>
              <ChevronRight size={14} aria-hidden="true" />
              <span aria-current="page">About us</span>
            </motion.nav>

            <p className="eyebrow aboutx-eyebrow"><span />Who we are</p>

            <h1 id="aboutx-hero-title">
              {(headlinePrefix ? headlinePrefix : headlineAccent).split(" ").map((w, i) => (
                <span className="aboutx-word" key={w}>
                  <motion.span
                    initial={reduced ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
                  >
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
              {headlinePrefix && <span className="aboutx-word">
                <motion.em
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.35, ease }}
                >
                  {headlineAccent}
                </motion.em>
              </span>}
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
              <a className="aboutx-text-link" href="#about-vision">
                Discover our story <ArrowDownRight size={16} />
              </a>
            </motion.div>

            <ul className="aboutx-promise">
              {livePromises.map((p, i) => (
                <li key={p} style={{ "--i": i } as CSSProperties}>
                  <span><Check size={13} strokeWidth={2.6} /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <CapabilityNavigator />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="aboutx-marquee" aria-hidden="true">
        <div className="aboutx-marquee__track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}<i /></span>
          ))}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <section className="aboutx-highlights" aria-label={`What defines ${companyProfile.brandName}`}>
        <div className="container aboutx-highlights__grid">
          {liveHighlights.map(({ icon: Icon, title, copy }, index) => (
            <motion.article
              className="aboutx-highlight"
              key={title}
              {...tilt}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : index * 0.08, ease }}
            >
              <span className="aboutx-highlight__icon"><Icon size={20} strokeWidth={1.8} /></span>
              <span className="aboutx-highlight__copy">
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
              <ArrowUpRight className="aboutx-highlight__arrow" size={17} />
            </motion.article>
          ))}
        </div>
      </section>

      {/* VISION */}
      <section className="aboutx-story section" id="about-vision">
        <div className="container aboutx-story__grid">
          <Reveal className="aboutx-story__visual" direction="left">
            <div className="aboutx-frame aboutx-frame--vision" {...tilt}>
              <span className="aboutx-frame__back" aria-hidden="true" />
              <span className="aboutx-frame__dots" aria-hidden="true" />
              <span className="aboutx-frame__ring" aria-hidden="true" />

              <div className="aboutx-story__image">
                {visionImage && <img src={visionImage} alt="A conceptual view of digital transformation and a smarter future" loading="lazy" />}
                <span className="aboutx-spot" aria-hidden="true" />
                <span className="aboutx-shine" aria-hidden="true" />
              </div>

              <div className="aboutx-story__image-note">
                <Target size={17} /><span>{copy("visionImageNote", "Purpose before pixels")}</span>
              </div>

              <div className="aboutx-float aboutx-float--stat aboutx-float--tr">
                <span className="aboutx-float__icon"><TrendingUp size={18} /></span>
                <span><strong>{liveStats[1].value}{liveStats[1].suffix}</strong><small>{liveStats[1].label}</small></span>
              </div>
              <div className="aboutx-float aboutx-float--bubble aboutx-float--ml" aria-hidden="true"><Lightbulb size={20} /></div>
            </div>

            <div className="aboutx-story__index">
              <span className="aboutx-story__index-number">01</span>
              <span className="aboutx-story__index-line" />
              <span className="aboutx-story__index-label">{copy("visionIndexLabel", "Building a smarter digital future")}</span>
            </div>
          </Reveal>

          <Reveal className="aboutx-story__content" direction="right">
            <p className="eyebrow aboutx-eyebrow"><span />{aboutContent.visionEyebrow || "Our vision"}</p>
            <h2>{copy("visionTitle", "Making digital progress mean something.")}</h2>
            <p>{copy("vision", "Our vision is to be a catalyst for digital transformation, helping businesses adapt, grow and thrive through thoughtful technology and exceptional digital experiences.")}</p>
            <p>{copy("mission", "We look beyond the immediate task to understand the people, goals and opportunities behind every challenge.")}</p>
            <div className="aboutx-story__callout">
              <span><Target size={20} /></span>
              <p>{copy("visionCallout", "Progress is most powerful when it creates lasting value for people and businesses.")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="aboutx-mission section">
        <div className="aboutx-mission__glow" aria-hidden="true" />
        <div className="container aboutx-mission__grid">
          <Reveal className="aboutx-mission__content" direction="left">
            <p className="eyebrow aboutx-eyebrow aboutx-eyebrow--light"><span />Our mission</p>
            <h2>{copy("missionTitle", "Turn possibilities into practical progress.")}</h2>
            <p>
              {copy("missionIntro", "Our mission is to deliver digital solutions that help organizations work smarter, serve people better and create room for growth.")}
            </p>
            <p>
              {copy("missionDetail", "By bringing strategy, design and technology together, we aim to make complex challenges clearer and good ideas easier to act on.")}
            </p>
            <Button to="/services" variant="secondary">
              Explore our capabilities
            </Button>
          </Reveal>

          <Reveal className="aboutx-mission__visual" direction="right">
            <div className="aboutx-frame aboutx-frame--mission" {...tilt}>
              <span className="aboutx-mission__halo" aria-hidden="true" />
              <div className="aboutx-mission__orbit aboutx-mission__orbit--one" aria-hidden="true"><i /></div>
              <div className="aboutx-mission__orbit aboutx-mission__orbit--two" aria-hidden="true"><i /></div>

              <div className="aboutx-mission__image">
                {creativeImage && <img src={creativeImage} alt="Creative design and digital innovation" loading="eager" />}
                <span className="aboutx-spot" aria-hidden="true" />
                <span className="aboutx-shine" aria-hidden="true" />
              </div>

              <div className="aboutx-mission__floating-card">
                <span>Think.</span>
                <span>Build.</span>
                <strong>Grow.</strong>
              </div>

              <div className="aboutx-float aboutx-float--stat aboutx-float--tl aboutx-float--dark">
                <span className="aboutx-float__icon"><Award size={18} /></span>
                <span><strong>{liveStats[2].value}{liveStats[2].suffix}</strong><small>{liveStats[2].label}</small></span>
              </div>
              <div className="aboutx-float aboutx-float--bubble aboutx-float--br" aria-hidden="true"><TrendingUp size={20} /></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="aboutx-stats" aria-label={`${companyProfile.brandName} at a glance`}>
        <div className="container aboutx-stats__grid">
          {liveStats.map((stat, index) => (
            <motion.div
              className="aboutx-stat"
              key={stat.label}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : index * 0.07, ease }}
            >
              <CountUp to={stat.value} suffix={stat.suffix} />
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="aboutx-why section">
        <div className="container aboutx-why__grid">
          <Reveal className="aboutx-why__intro" direction="left">
            <p className="eyebrow aboutx-eyebrow"><span />{copy("whyEyebrow", `Why choose {{brandName}}?`)}</p>
            <h2>{copy("whyTitle", "Good work starts with the right partner.")}</h2>
            <p>{copy("whyDescription", "We bring a practical, collaborative approach to digital work—balancing business goals, user needs and long-term maintainability.")}</p>
            <div className="aboutx-why__mini">
              <CheckCircle2 size={19} />
              <span>{copy("whyCallout", "One connected team for technology, growth and creative.")}</span>
            </div>
          </Reveal>

          <div className="aboutx-why__list">
            {liveReasons.map((reason, index) => (
              <motion.div
                className={`aboutx-reason aboutx-reason--${(index % 4) + 1}`}
                key={reason}
                initial={reduced ? false : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : (index % 4) * 0.05, ease }}
              >
                <span><Check size={13} strokeWidth={2.4} /></span>
                {reason}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="aboutx-process section">
        <div className="container">
          <SectionHeading
            eyebrow={copy("processEyebrow", "How we work")}
            title={<><span>{copy("processTitle", "From first conversation")}</span><em>{copy("processTitleAccent", "to real-world impact.")}</em></>}
            copy={copy("processDescription", "A clear, collaborative process helps each idea move forward with purpose.")}
          />
          <div className="aboutx-process__list">
            {liveProcessSteps.map(([number, title, copy], index) => (
              <Reveal
                className="aboutx-process__item"
                key={title}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 0.025}
              >
                <span className="aboutx-process__number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <ArrowDownRight size={18} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="aboutx-values section">
        <div className="container">
          <SectionHeading
            eyebrow={copy("valuesEyebrow", "What we stand for")}
            title={<><span>Our core</span><em> values.</em></>}
            copy={copy("valuesDescription", "The principles that shape how we collaborate, make decisions and deliver our work.")}
          />
          <div className="aboutx-values__grid">
            {liveValues.map(({ icon: Icon, title, copy }, index) => (
              <motion.article
                className="aboutx-value"
                key={title}
                {...tilt}
                initial={reduced ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : (index % 3) * 0.08, ease }}
              >
                <span className="aboutx-value__icon"><Icon size={21} strokeWidth={1.9} /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="aboutx-value__index">{String(index + 1).padStart(2, "0")}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
