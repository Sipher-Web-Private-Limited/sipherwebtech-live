import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  Building2,
  Code,
  Compass,
  Gauge,
  Globe,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useContentLibrary, type Product as LibraryProduct } from "../content/contentLibrary";
import "../styles/products.css";

/* -------------------------------------------------------------------------- */
/*                                    data                                    */
/* -------------------------------------------------------------------------- */

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  Boxes, Building2, Code, Compass, Gauge, Globe, GraduationCap, HeartPulse, LayoutDashboard, PenTool, Rocket, Search, ShieldCheck, ShoppingBag, Smartphone, Sparkles,
};

const productIcon = (name: string) => PRODUCT_ICONS[name] ?? Boxes;

const AUTOPLAY_MS = 6500;
const STEP_MS = 5200;
const pad = (n: number) => String(n).padStart(2, "0");
const PROCESS_ICONS = [Compass, PenTool, Code, Rocket];
const PROCESS_ART = ["discover", "design", "build", "launch"] as const;

/* -------------------------------------------------------------------------- */
/*                                    hooks                                   */
/* -------------------------------------------------------------------------- */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);
  return reduced;
}

/* -------------------------------------------------------------------------- */
/*                                    page                                    */
/* -------------------------------------------------------------------------- */

export default function ProductsPage() {
  const { companyProfile, processSteps } = useCmsContent();
  const { items: products, loading, error } = useContentLibrary<LibraryProduct>("product");
  const features = products
    .flatMap((product) => (Array.isArray(product.highlights) ? product.highlights : []).map((title) => ({
      icon: productIcon(product.icon),
      title,
      text: product.excerpt,
    })))
    .slice(0, 4);
  const rotatingWords = products.length
    ? products.map((product) => `${product.category || product.title}.`)
    : ["your next idea."];
  const reduced = useReducedMotion();

  /* hero word rotator */
  const [word, setWord] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % rotatingWords.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced, rotatingWords.length]);

  /* showcase */
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = inView && !paused && !reduced && products.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % products.length), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [running, active, products.length]);

  const select = (index: number, focus = false) => {
    if (!products.length) return;
    const next = (index + products.length) % products.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number | undefined> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: products.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  const mouseOnly = (fn: () => void) => (event: PointerEvent) => {
    if (event.pointerType === "mouse") fn();
  };

  /* 3D tilt on the viewer */
  const onTilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tx", String((event.clientX - rect.left) / rect.width - 0.5));
    event.currentTarget.style.setProperty("--ty", String((event.clientY - rect.top) / rect.height - 0.5));
  };
  const resetTilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tx", "0");
    event.currentTarget.style.setProperty("--ty", "0");
  };

  /* cursor glow on feature cards */
  const glow = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  /* process */
  const [step, setStep] = useState(0);
  const [stepPaused, setStepPaused] = useState(false);
  const [stepInView, setStepInView] = useState(false);
  const processStage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = processStage.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStepInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stepRunning = stepInView && !stepPaused && !reduced && processSteps.length > 1;

  useEffect(() => {
    if (!stepRunning) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % processSteps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [stepRunning, step, processSteps.length]);

  /* goal finder */
  const [goal, setGoal] = useState(0);
  const pickedIndex = Math.min(goal, products.length - 1);
  const pickedProduct = products[pickedIndex];
  const PickedIcon = productIcon(pickedProduct?.icon ?? "");

  const showInShowcase = () => {
    if (!pickedProduct) return;
    setActive(pickedIndex);
    document.getElementById("solutions")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  if (!products.length) {
    return (
      <>
        <Seo title={`Products | ${companyProfile.brandName}`} description={`Digital product solutions from ${companyProfile.brandName}.`} />
        <section className="page-hero products-hero">
          <div className="container page-hero__grid">
            <div>
              <p className="eyebrow"><span />Digital Products</p>
              <h1>Solutions for <em>your next idea.</em></h1>
              <p>{loading ? "Loading solutions…" : error || "Published product solutions will appear here."}</p>
              {!loading && <Button to="/contact">Start a project</Button>}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`Products | ${companyProfile.brandName}`}
        description="Explore digital product solutions for healthcare, education, commerce and growing businesses."
      />

      <div className="products-progress" aria-hidden="true" />

      {/* ------------------------------ hero ------------------------------ */}
      <section className="page-hero products-hero">
        <div className="products-hero__aurora" aria-hidden="true"><i /><i /></div>
        <div className="container page-hero__grid">
          <div>
            <p className="eyebrow"><span />Digital Products</p>
            <h1 aria-label="Digital solutions for healthcare, education, commerce and what's next">
              Solutions for
              <br />
              <span className="products-rotator" aria-hidden="true">
                <em key={word}>{rotatingWords[word]}</em>
              </span>
            </h1>
            <p>
              Discover the digital platforms and experiences we can shape around your business,
              designed with care and engineered to perform.
            </p>
            <div className="products-hero__actions">
              <Button to="/contact">Start a project</Button>
              <a className="products-hero__link" href="#solutions">
                Explore solutions <ArrowDown size={16} />
              </a>
            </div>
          </div>

          <div className="products-hero__visual">
            <div className="page-hero__image">
              {products[0].image && <img src={products[0].image} alt={products[0].imageAlt || products[0].title} />}
              <span>Crafted, not templated.</span>
            </div>
            <div className="products-hero__chip products-hero__chip--a">
              <i><Smartphone size={18} /></i>
              <span><strong>Mobile-first</strong><small>Every single build</small></span>
            </div>
            <div className="products-hero__chip products-hero__chip--b">
              <i><Sparkles size={18} /></i>
              <span><strong>Made to measure</strong><small>Shaped around you</small></span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- marquee ---------------------------- */}
      <div className="products-marquee" aria-hidden="true">
        <div className="products-marquee__track">
          {[0, 1].map((group) => (
            <div className="products-marquee__group" key={group}>
              {products.map((product) => (
                <span className="products-marquee__item" key={`${group}-${product.id}`}>
                  {product.category}
                  <b />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------- showcase ---------------------------- */}
      <section className="products-showcase" id="solutions">
        <div className="container">
          <div className="products-head">
            <p className="eyebrow"><span />Our solutions</p>
            <h2>Pick a space. <em>See what we build.</em></h2>
            <p>Choose an area to explore the kind of experience we design for it.</p>
          </div>

          <Reveal className="products-stage-wrap">
            <div
              ref={stage}
              className={`products-stage${running ? " is-running" : ""}`}
              style={{ "--autoplay": `${AUTOPLAY_MS}ms` } as CSSProperties}
              onPointerEnter={mouseOnly(() => setPaused(true))}
              onPointerLeave={mouseOnly(() => setPaused(false))}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
            >
              <div
                className="products-tabs"
                role="tablist"
                aria-label="Product solutions"
                aria-orientation="vertical"
                onKeyDown={onKeyDown}
              >
                {products.map((product, i) => (
                  <button
                    key={product.id}
                    ref={(node) => { tabs.current[i] = node; }}
                    type="button"
                    role="tab"
                    id={`product-tab-${product.slug}`}
                    aria-selected={i === active}
                    aria-controls={`product-panel-${product.slug}`}
                    tabIndex={i === active ? 0 : -1}
                    className={`products-tab${i === active ? " is-active" : ""}`}
                    onClick={() => select(i)}
                    onPointerEnter={mouseOnly(() => select(i))}
                  >
                    <span className="products-tab__num">{pad(i + 1)}</span>
                    <span className="products-tab__text">
                      <strong>{product.title}</strong>
                      <small>{product.category}</small>
                    </span>
                    <ArrowUpRight className="products-tab__arrow" size={22} />
                    <span className="products-tab__bar" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className="products-viewer-wrap" onPointerMove={onTilt} onPointerLeave={resetTilt}>
                <div className="products-viewer">
                  {products.map((product, i) => {
                    const Icon = productIcon(product.icon);
                    const isActive = i === active;
                    return (
                      <div
                        key={product.id}
                        id={`product-panel-${product.slug}`}
                        role="tabpanel"
                        aria-labelledby={`product-tab-${product.id}`}
                        aria-hidden={!isActive}
                        className={`products-slide${isActive ? " is-active" : ""}`}
                      >
                        {product.image && <img src={product.image} alt={product.imageAlt || product.title} loading={i === 0 ? "eager" : "lazy"} />}
                        <span className="products-slide__count" aria-hidden="true">
                          {pad(i + 1)} / {pad(products.length)}
                        </span>
                        <div className="products-slide__panel">
                          <p className="products-slide__tag"><Icon size={16} />{product.category}</p>
                          <h3>{product.title}</h3>
                          <p className="products-slide__text">{product.excerpt}</p>
                          <ul>
                            {product.highlights.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <Button to="/contact">Discuss this solution</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- goal finder -------------------------- */}
      <section className="products-finder">
        <div className="container">
          <div className="products-head">
            <p className="eyebrow"><span />Not sure where to start?</p>
            <h2>Start with your <em>goal.</em></h2>
            <p>Tell us what you want to achieve and we will point you to the right kind of solution.</p>
          </div>

          <fieldset className="products-goals">
            <legend className="products-goals__legend">What do you want to achieve?</legend>
            {products.map((item, i) => {
              const GoalIcon = productIcon(item.icon);
              return (
                <label className="products-goal" key={item.id}>
                  <input type="radio" name="products-goal" checked={goal === i} onChange={() => setGoal(i)} />
                  <span><GoalIcon size={16} />{item.goal || item.title}</span>
                </label>
              );
            })}
          </fieldset>

          <div className="products-result" key={pickedProduct.slug} aria-live="polite">
            {pickedProduct.image && <img src={pickedProduct.image} alt={pickedProduct.imageAlt || pickedProduct.title} loading="lazy" />}
            <div className="products-result__body">
              <p className="products-slide__tag"><PickedIcon size={16} />Recommended for you</p>
              <h3>{pickedProduct.title}</h3>
              <p className="products-result__reason">{pickedProduct.goalDescription || pickedProduct.excerpt}</p>
              <ul>
                {pickedProduct.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="products-result__actions">
                <Button to="/contact">Discuss this solution</Button>
                <button type="button" className="products-result__link" onClick={showInShowcase}>
                  See it up close <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- features --------------------------- */}
      <section className="products-features">
        <div className="container">
          <div className="products-head">
            <p className="eyebrow"><span />In every product</p>
            <h2>Product <em>highlights.</em></h2>
          </div>
          <div className="products-features__grid">
            {features.map(({ icon: Icon, title, text }, i) => (
              <article className="products-feature" key={title} onPointerMove={glow}>
                <span>{pad(i + 1)}</span>
                <Icon size={34} strokeWidth={1.6} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ process --------------------------- */}
      <section className="process">
        <div className="container">
          <div className="process-head">
            <p className="eyebrow"><span />How we work</p>
            <h2>
              From idea to <em>launch.</em>
            </h2>
            <p>A clear, collaborative path, so you always know what happens next.</p>
          </div>

          <div
            ref={processStage}
            className={`process-stage${stepRunning ? " is-running" : ""}`}
            style={{ "--step-ms": `${STEP_MS}ms` } as CSSProperties}
            onPointerEnter={mouseOnly(() => setStepPaused(true))}
            onPointerLeave={mouseOnly(() => setStepPaused(false))}
            onFocusCapture={() => setStepPaused(true)}
            onBlurCapture={() => setStepPaused(false)}
          >
            <div className="process-progress" aria-hidden="true">
              {processSteps.map((item, i) => (
                <span
                  key={item[0]}
                  className={`process-seg${i < step ? " is-done" : ""}${i === step ? " is-current" : ""}`}
                  onClick={() => setStep(i)}
                >
                  <span className="process-seg__label"><b>{item[0]}</b>{item[1]}</span>
                  <span className="process-seg__bar" />
                </span>
              ))}
            </div>

            <div className="process-cards">
              {processSteps.map((item, i) => {
                const Icon = PROCESS_ICONS[i % PROCESS_ICONS.length];
                const isActive = i === step;
                return (
                  <article key={item[0]} className={`process-card${isActive ? " is-active" : ""}`}>
                    <h3 className="process-card__heading">
                      <button
                        type="button"
                        id={`process-head-${i}`}
                        className="process-card__head"
                        aria-expanded={isActive}
                        aria-controls={`process-body-${i}`}
                        onClick={() => setStep(i)}
                      >
                        <span className="process-card__top">
                          <span className="process-card__num">{pad(i + 1)}</span>
                          <span className="process-card__icon"><Icon size={22} strokeWidth={1.7} /></span>
                        </span>
                        <span className="process-card__title">{item[1]}</span>
                      </button>
                    </h3>

                    <span className="process-card__plus" aria-hidden="true"><ArrowUpRight size={20} /></span>

                    <div
                      id={`process-body-${i}`}
                      role="region"
                      aria-labelledby={`process-head-${i}`}
                      className="process-card__body"
                    >
                      <div className="process-card__clip">
                        <div className="process-card__inner">
                          <div>
                            <p>{item[2]}</p>
                          </div>
                          <div className={`process-art process-art--${PROCESS_ART[i % PROCESS_ART.length]}`} aria-hidden="true">
                            <i /><i /><i /><i /><b />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="process-foot">
            <p>Ready for step one?</p>
            <Button to="/contact">Start a project</Button>
          </div>
        </div>
      </section>

      {/* ------------------------------- cta ------------------------------ */}
      <section className="inline-cta">
        <div className="container">
          <p>Have a project in mind?</p>
          <h2>Let&apos;s build the next one.</h2>
          <Button to="/contact">Start a project</Button>
        </div>
      </section>
    </>
  );
}