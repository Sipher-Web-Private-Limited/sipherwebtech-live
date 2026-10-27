import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Boxes,
  CalendarCheck,
  Building2,
  Code,
  Compass,
  Gauge,
  Globe,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  LifeBuoy,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../components/Seo";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useContentLibrary, type Product as LibraryProduct } from "../content/contentLibrary";
import "../styles/products.css";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*                                    data                                    */
/* -------------------------------------------------------------------------- */

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  Boxes, Building2, Code, Compass, Gauge, Globe, GraduationCap, HeartPulse, LayoutDashboard, PenTool, Rocket, Search, ShieldCheck, ShoppingBag, Smartphone, Sparkles,
};

const productIcon = (name: string) => PRODUCT_ICONS[name] ?? Boxes;
const PROCESS_ICONS = [Compass, PenTool, Code, Rocket];

/* pick an icon that matches the step name, so "Design" never gets a code icon */
const stepIcon = (title: string, i: number): LucideIcon => {
  const k = title.toLowerCase();
  if (/discover|research|understand|explore/.test(k)) return Compass;
  if (/strateg|plan|define|roadmap/.test(k)) return Target;
  if (/design|ui|ux|prototype|wireframe/.test(k)) return PenTool;
  if (/develop|build|code|engineer|implement/.test(k)) return Code;
  if (/test|qa|quality|review/.test(k)) return ShieldCheck;
  if (/launch|deploy|release|go live/.test(k)) return Rocket;
  if (/support|grow|maintain|scale|optimi/.test(k)) return LifeBuoy;
  return PROCESS_ICONS[i % PROCESS_ICONS.length];
};

/* highlight icons follow the highlight's meaning, falling back to the product's own icon */
const highlightIcon = (title: string, fallback: LucideIcon): LucideIcon => {
  const k = title.toLowerCase();
  if (/doctor|profile|team|people|staff|faculty|student/.test(k)) return Users;
  if (/appointment|booking|schedule|enquir|flow/.test(k)) return CalendarCheck;
  if (/course|catalog|curriculum|library|admission/.test(k)) return BookOpen;
  if (/cart|checkout|payment|shop|order/.test(k)) return ShoppingBag;
  if (/dashboard|report|analytic|insight/.test(k)) return Gauge;
  if (/secure|security|privacy|safe/.test(k)) return ShieldCheck;
  if (/department|page|layout|portal|panel/.test(k)) return LayoutDashboard;
  return fallback;
};
const pad = (n: number) => String(n).padStart(2, "0");

/* seconds of timeline per product: 1 = wipe, 0.4 = hold */
const WIPE = 1;
const HOLD = 0.4;

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
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstGoal = useRef(true);
  const deckRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLFieldSetElement>(null);
  const pillInit = useRef(false);
  const [slideIdx, setSlideIdx] = useState(0);

  const seenText = new Set<string>();
  const features = products
    .flatMap((product) =>
      (Array.isArray(product.highlights) ? product.highlights : []).map((title) => ({
        icon: highlightIcon(title, productIcon(product.icon)),
        title,
        from: product.category || product.title,
        image: product.image,
        text: product.excerpt,
      }))
    )
    .slice(0, 4)
    .map((f) => {
      /* the same product excerpt would repeat on several cards, so show it only once */
      const text = seenText.has(f.text) ? "" : f.text;
      seenText.add(f.text);
      return { ...f, text };
    });

  const rotatingWords = products.length
    ? products.map((product) => `${product.category || product.title}.`)
    : ["your next idea."];

  /* hero word rotator */
  const [word, setWord] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % rotatingWords.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced, rotatingWords.length]);

  /* goal finder */
  const [goal, setGoal] = useState(0);
  const pickedIndex = Math.max(0, Math.min(goal, products.length - 1));
  const pickedProduct = products[pickedIndex];
  const PickedIcon = productIcon(pickedProduct?.icon ?? "");

  const showInShowcase = () => {
    document.getElementById("solutions")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  /* cursor glow on feature cards */
  const glow = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  /* goal finder: the result card re-reveals when the goal changes */
  useLayoutEffect(() => {
    if (firstGoal.current) {
      firstGoal.current = false;
      return;
    }
    const el = resultRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const image = el.querySelector("img");
      if (image) {
        gsap.fromTo(image, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out", clearProps: "clipPath" });
      }
      gsap.from(el.querySelectorAll(".products-result__body > *"), { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", clearProps: "all" });
    }, el);
    return () => ctx.revert();
  }, [goal]);

  /* tablet / mobile carousel: keep the dots in sync with the swipe */
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const onScroll = () => {
      const slides = deck.querySelectorAll<HTMLElement>(".products-slide");
      if (slides.length < 2) return;
      const step = slides[1].offsetLeft - slides[0].offsetLeft || 1;
      setSlideIdx(Math.max(0, Math.min(slides.length - 1, Math.round(deck.scrollLeft / step))));
    };
    deck.addEventListener("scroll", onScroll, { passive: true });
    return () => deck.removeEventListener("scroll", onScroll);
  }, [products.length]);

  const goSlide = (i: number) => {
    const deck = deckRef.current;
    const slides = deck?.querySelectorAll<HTMLElement>(".products-slide");
    if (!deck || !slides?.[i]) return;
    deck.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduced ? "auto" : "smooth" });
  };

  /* goal finder: one yellow pill slides to the chosen goal */
  useLayoutEffect(() => {
    const box = goalsRef.current;
    if (!box) return;
    const place = (animate: boolean) => {
      const pill = box.querySelector<HTMLElement>(".products-goals__pill");
      const label = box.querySelector<HTMLInputElement>("input:checked")?.closest("label");
      if (!pill || !label) return;
      const b = box.getBoundingClientRect();
      const r = label.getBoundingClientRect();
      const vars = { x: r.left - b.left, y: r.top - b.top, width: r.width, height: r.height };
      if (animate && !reduced) gsap.to(pill, { ...vars, duration: 0.6, ease: "power3.out", overwrite: true });
      else gsap.set(pill, vars);
    };
    place(pillInit.current);
    pillInit.current = true;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(box);
    return () => ro.disconnect();
  }, [goal, products.length, reduced]);

  /* ------------------------------ GSAP scenes ------------------------------ */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const one = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 1024px) and (min-height: 640px)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motion, wide, fine } = ctx.conditions as { motion: boolean; wide: boolean; fine: boolean };
        if (!motion) return;

        const off: Array<() => void> = [];
        root.classList.add("is-motion");
        if (wide) root.classList.add("is-wide");

        /* ---- hero intro ---- */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from($(".products-hero .eyebrow, .products-hero__lead, .products-hero__actions"), { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.1, clearProps: "all" })
          .from($(".products-hero h1 .products-line"), { yPercent: 115, duration: 1, stagger: 0.1, clearProps: "transform" }, 0.05)
          .from($(".products-layer"), { scale: 0.9, autoAlpha: 0, duration: 1, stagger: 0.09, ease: "back.out(1.3)", clearProps: "scale,opacity,visibility" }, 0.2);

        /* hero collage: scroll parallax + pointer depth */
        const hero = one(".products-hero");
        const layers = $(".products-layer");
        const spot = one(".products-hero__spot");
        gsap.set(spot, { x: hero.clientWidth * 0.68, y: hero.clientHeight * 0.38, xPercent: -50, yPercent: -50 });
        gsap.from($(".products-shot img"), { scale: 1.3, duration: 1.6, ease: "power3.out", clearProps: "transform", delay: 0.2 });
        layers.forEach((l) => {
          const d = Number(l.dataset.depth || 1);
          gsap.to(l, { y: -44 * d, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
        });
        if (fine) {
          const xs = layers.map((l) => gsap.quickTo(l, "x", { duration: 0.8, ease: "power3" }));
          const sx = gsap.quickTo(spot, "x", { duration: 0.9, ease: "power3" });
          const sy = gsap.quickTo(spot, "y", { duration: 0.9, ease: "power3" });
          const move = (e: globalThis.PointerEvent) => {
            const r = hero.getBoundingClientRect();
            sx(e.clientX - r.left);
            sy(e.clientY - r.top);
            const nx = e.clientX / window.innerWidth - 0.5;
            layers.forEach((l, i) => xs[i](nx * 30 * Number(l.dataset.depth || 1)));
          };
          hero.addEventListener("pointermove", move);
          off.push(() => hero.removeEventListener("pointermove", move));
        }

        /* ---- marquee reacts to scroll speed ---- */
        const mq = gsap.to(one(".products-marquee__track"), { xPercent: -50, repeat: -1, duration: 38, ease: "none" });
        ScrollTrigger.create({
          onUpdate: (s) => {
            mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
            gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
          },
        });

        /* ---- pinned showcase: product images wipe over each other ---- */
        const slides = $(".products-slide");
        const n = slides.length;
        if (wide && n > 1) {
          const section = one(".products-showcase");
          const items = $(".products-index__item");
          const counter = one(".products-deck__count");
          const bar = one(".products-deck__bar i");
          const dur = (n - 1) * (WIPE + HOLD) + HOLD;
          let cur = -1;

          const setOn = (i: number) => {
            if (i === cur) return;
            cur = i;
            items.forEach((el, k) => el.classList.toggle("is-on", k === i));
            slides.forEach((el, k) => el.setAttribute("aria-hidden", String(k !== i)));
            counter.textContent = `${pad(i + 1)} / ${pad(n)}`;
          };
          setOn(0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${(n - 1) * 85}%`,
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                bar.style.transform = `scaleX(${self.progress})`;
                const t = self.progress * dur;
                setOn(t < 0.5 ? 0 : Math.min(n - 1, Math.floor((t - 0.5) / (WIPE + HOLD)) + 1));
              },
            },
          });

          slides.forEach((slide, i) => {
            if (i === 0) return;
            const at = (i - 1) * (WIPE + HOLD);
            const image = slide.querySelector("img");
            tl.fromTo(slide, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: WIPE }, at);
            if (image) tl.fromTo(image, { scale: 1.25 }, { scale: 1, duration: WIPE }, at);
            tl.fromTo(slide.querySelector(".products-slide__panel"), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, at + 0.55);
          });
          tl.to({}, { duration: HOLD });

          const st = tl.scrollTrigger!;
          items.forEach((el, i) => {
            const go = () => {
              const time = i === 0 ? 0 : (i - 1) * (WIPE + HOLD) + WIPE;
              window.scrollTo({ top: st.start + (st.end - st.start) * (time / dur) + 1, behavior: "smooth" });
            };
            el.addEventListener("click", go);
            off.push(() => el.removeEventListener("click", go));
          });
          off.push(() => {
            items.forEach((el) => el.classList.remove("is-on"));
            slides.forEach((el) => el.removeAttribute("aria-hidden"));
          });
        } else if (!wide) {
          /* tablet/mobile: the swipe carousel rises in once */
          gsap.from(one(".products-deckwrap"), {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: one(".products-deckwrap"), start: "top 88%", once: true },
          });
        }

        /* ---- feature cards ---- */
        const feats = $(".products-feature");
        gsap.set(feats, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(feats, {
          start: "top 90%",
          once: true,
          onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity,visibility" }),
        });

        /* ---- process: dial fills and steps light up as you scroll ---- */
        {
          const list = one(".products-steps");
          const steps = $(".products-step");
          const ring = root.querySelector(".products-dial__fill");
          const line = one(".products-steps__line i");
          const numEl = one(".products-dial__num span");
          const labelEl = one(".products-dial__label");
          let now = -1;

          const setStep = (i: number) => {
            if (i === now) return;
            now = i;
            steps.forEach((el, k) => {
              el.classList.toggle("is-active", k === i);
              el.classList.toggle("is-done", k < i);
            });
            numEl.textContent = pad(i + 1);
            labelEl.textContent = String(processSteps[i]?.[1] ?? "");
            gsap.fromTo([numEl, labelEl], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", overwrite: true, clearProps: "all" });
          };
          setStep(0);

          const knob = root.querySelector(".products-dial__knob");
          const dialScroll = { trigger: list, start: "top 60%", end: "bottom 60%", scrub: true };
          if (ring instanceof SVGGeometryElement) {
            const len = ring.getTotalLength();
            gsap.set(ring, { strokeDasharray: len });
            gsap.fromTo(ring, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: dialScroll });
          }
          if (knob) gsap.fromTo(knob, { rotation: 0 }, { rotation: 360, ease: "none", scrollTrigger: dialScroll });
          gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: true } });
          steps.forEach((el, i) => {
            ScrollTrigger.create({ trigger: el, start: "top 58%", end: "bottom 58%", onToggle: (s) => { if (s.isActive) setStep(i); } });
          });
          off.push(() => {
            steps.forEach((el) => el.classList.remove("is-active", "is-done"));
            numEl.textContent = "01";
            labelEl.textContent = String(processSteps[0]?.[1] ?? "");
          });
        }

        /* ---- CTA: product shots fan out ---- */
        gsap.from($(".products-cta__shot"), {
          y: 70,
          rotation: (i: number) => (i - 1) * 16,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: one(".products-cta__card"), start: "top 75%", once: true },
        });
        gsap.from(one(".products-cta__copy"), { y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: one(".products-cta__card"), start: "top 80%", once: true } });

        /* ---- section headings: eyebrow slides, title rises through a wipe, copy fades ---- */
        $(".products-head").forEach((head) => {
          const eyebrow = head.querySelector(".eyebrow");
          const title = head.querySelector("h2");
          const copy = head.querySelector(":scope > p:not(.eyebrow)");
          const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: "top 88%", once: true } });
          if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, x: -22, duration: 0.6, ease: "power3.out", clearProps: "all" }, 0);
          if (title) {
            tl.fromTo(
              title,
              { yPercent: 45, autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" },
              { yPercent: 0, autoAlpha: 1, clipPath: "inset(-10% -5% -25% -5%)", duration: 1, ease: "power4.out", clearProps: "all" },
              0.08
            );
          }
          if (copy) tl.from(copy, { y: 18, autoAlpha: 0, duration: 0.7, ease: "power3.out", clearProps: "all" }, 0.35);
        });

        return () => {
          off.forEach((f) => f());
          root.classList.remove("is-motion", "is-wide");
        };
      }
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [products.length, processSteps.length]);

  /* ---------------------------- empty / loading ---------------------------- */
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

  const shotB = products[1] ?? products[0];
  const shotC = products[2] ?? products[0];

  return (
    <>
      <Seo
        title={`Products | ${companyProfile.brandName}`}
        description="Explore digital product solutions for healthcare, education, commerce and growing businesses."
      />

      <div className="products-page" ref={rootRef}>
        <div className="products-progress" aria-hidden="true" />

        {/* ------------------------------ hero ------------------------------ */}
        <section className="products-hero">
          <span className="products-hero__spot" aria-hidden="true" />
          <div className="container products-hero__grid">
            <div className="products-hero__copy">
              <p className="eyebrow"><span />Digital Products</p>
              <h1 aria-label="Digital solutions for healthcare, education, commerce and what's next">
                <span className="products-mask" aria-hidden="true"><span className="products-line">Solutions for</span></span>
                <span className="products-mask products-rotator" aria-hidden="true">
                  <em key={word} className={`products-line${word > 0 ? " is-rot" : ""}`}>{rotatingWords[word]}</em>
                </span>
              </h1>
              <p className="products-hero__lead">
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

            <div className="products-collage">
              <div className="products-layer products-ring" data-depth="0.4" aria-hidden="true" />
              <figure className="products-layer products-shot products-shot--main" data-depth="1">
                {products[0].image && <img src={products[0].image} alt={products[0].imageAlt || products[0].title} />}
                <figcaption>Crafted, not templated.</figcaption>
              </figure>
              <figure className="products-layer products-shot products-shot--b" data-depth="1.8" aria-hidden="true">
                {shotB.image && <img src={shotB.image} alt="" loading="lazy" />}
              </figure>
              <figure className="products-layer products-shot products-shot--c" data-depth="1.4" aria-hidden="true">
                {shotC.image && <img src={shotC.image} alt="" loading="lazy" />}
              </figure>
              <div className="products-layer products-chip products-chip--a" data-depth="2.2" aria-hidden="true">
                <div className="products-chip__in">
                  <i><Smartphone size={18} /></i>
                  <span><strong>Mobile-first</strong><small>Every single build</small></span>
                </div>
              </div>
              <div className="products-layer products-chip products-chip--b" data-depth="1.6" aria-hidden="true">
                <div className="products-chip__in">
                  <i><Sparkles size={18} /></i>
                  <span><strong>Made to measure</strong><small>Shaped around you</small></span>
                </div>
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
          <div className="container products-showcase__grid">
            <div className="products-index">
              <div className="products-head">
                <p className="eyebrow"><span />Our solutions</p>
                <h2>Pick a space. <em>See what we build.</em></h2>
                <p>Choose an area to explore the kind of experience we design for it.</p>
              </div>
              <ol className="products-index__list" aria-label="Jump to a solution">
                {products.map((product, i) => (
                  <li key={product.id}>
                    <button type="button" className={`products-index__item${i === 0 ? " is-on" : ""}`}>
                      <span className="products-index__num">{pad(i + 1)}</span>
                      <span className="products-index__text">
                        <strong>{product.title}</strong>
                        <small>{product.category}</small>
                      </span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="products-deckwrap">
            <div className="products-deck" ref={deckRef}>
              <span className="products-deck__bar" aria-hidden="true"><i /></span>
              <span className="products-deck__count" aria-hidden="true">01 / {pad(products.length)}</span>
              {products.map((product, i) => {
                const Icon = productIcon(product.icon);
                return (
                  <article className="products-slide" key={product.id} id={`product-${product.slug}`}>
                    <div className="products-slide__media">
                      {product.image && <img src={product.image} alt={product.imageAlt || product.title} loading={i === 0 ? "eager" : "lazy"} />}
                    </div>
                    <div className="products-slide__panel">
                      <p className="products-tag"><Icon size={15} />{product.category}</p>
                      <h3>{product.title}</h3>
                      <p className="products-slide__text">{product.excerpt}</p>
                      <ul className="products-chips">
                        {product.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <Button to="/contact">Discuss this solution</Button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="products-dots" role="group" aria-label="Choose a solution">
              {products.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className={i === slideIdx ? "is-on" : ""}
                  aria-label={`Show ${p.title}`}
                  aria-current={i === slideIdx}
                  onClick={() => goSlide(i)}
                />
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* --------------------------- goal finder -------------------------- */}
        <section className="products-finder">
          <div className="container">
            <div className="products-head products-head--center">
              <p className="eyebrow"><span />Not sure where to start?</p>
              <h2>Start with your <em>goal.</em></h2>
              <p>Tell us what you want to achieve and we will point you to the right kind of solution.</p>
            </div>

            <fieldset className="products-goals" ref={goalsRef}>
              <span className="products-goals__pill" aria-hidden="true" />
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

            <div className="products-result" ref={resultRef} aria-live="polite">
              {pickedProduct.image && <img src={pickedProduct.image} alt={pickedProduct.imageAlt || pickedProduct.title} loading="lazy" />}
              <div className="products-result__body">
                <p className="products-tag"><PickedIcon size={15} />Recommended for you</p>
                <h3>{pickedProduct.title}</h3>
                <p className="products-result__reason">{pickedProduct.goalDescription || pickedProduct.excerpt}</p>
                <ul className="products-chips">
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
              {features.map(({ icon: Icon, title, text, from, image }, i) => (
                <article className="products-feature" key={`${title}-${i}`} onPointerMove={glow}>
                  <div className="products-feature__media">
                    {image && (
                      <img
                        src={image}
                        alt=""
                        loading="lazy"
                        style={{ objectPosition: ["50% 30%", "15% 50%", "85% 50%", "50% 75%"][i % 4] }}
                      />
                    )}
                    <span className="products-feature__num">{pad(i + 1)}</span>
                    <span className="products-feature__icon"><Icon size={22} strokeWidth={1.7} /></span>
                  </div>
                  <div className="products-feature__body">
                    <p className="products-feature__from">{from}</p>
                    <h3>{title}</h3>
                    {text && <p className="products-feature__text">{text}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ process --------------------------- */}
        <section className="products-process">
          <div className="container products-process__grid">
            <div className="products-process__sticky">
              <div className="products-head">
                <p className="eyebrow"><span />How we work</p>
                <h2>From idea to <em>launch.</em></h2>
                <p>A clear, collaborative path, so you always know what happens next.</p>
              </div>
              <div className="products-dial" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <circle className="products-dial__track" cx="60" cy="60" r="52" />
                  <circle className="products-dial__fill" cx="60" cy="60" r="52" />
                </svg>
                <span className="products-dial__knob"><i /></span>
                <div className="products-dial__num"><span>01</span></div>
              </div>
              <p className="products-dial__label" aria-hidden="true">{String(processSteps[0]?.[1] ?? "")}</p>
              <Button to="/contact">Start a project</Button>
            </div>

            <ol className="products-steps">
              <li className="products-steps__line" aria-hidden="true" role="presentation"><i /></li>
              {processSteps.map((item, i) => {
                const Icon = stepIcon(String(item[1]), i);
                return (
                  <li className="products-step" key={item[0]}>
                    <span className="products-step__num" aria-hidden="true">{pad(i + 1)}</span>
                    <div className="products-step__card">
                      <span className="products-step__ghost" aria-hidden="true">{pad(i + 1)}</span>
                      <span className="products-step__icon"><Icon size={22} strokeWidth={1.7} /></span>
                      <h3>{item[1]}</h3>
                      <p>{item[2]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ------------------------------- cta ------------------------------ */}
        <section className="products-cta">
          <div className="container">
            <div className="products-cta__card">
              <div className="products-cta__copy">
                <p className="eyebrow"><span />Have a project in mind?</p>
                <h2>Let’s build <em>the next one.</em></h2>
                <p className="products-cta__lead">
                  Tell us about your idea and we will shape it into a product your customers enjoy using.
                </p>
                <div className="products-cta__actions">
                  <Button to="/contact">Start a project</Button>
                  <a className="products-hero__link" href="#solutions">
                    Explore solutions <ArrowUpRight size={16} />
                  </a>
                </div>
                <ul className="products-chips products-cta__chips">
                  <li>Mobile-first</li>
                  <li>Made to measure</li>
                  <li>Crafted, not templated</li>
                </ul>
              </div>
              <div className="products-cta__fan" aria-hidden="true">
                {[shotB, products[0], shotC].map((p, i) => (
                  <figure className="products-cta__shot" key={i} style={{ "--r": `${(i - 1) * 7}deg` } as CSSProperties}>
                    {p.image && <img src={p.image} alt="" loading="lazy" />}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}