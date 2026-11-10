import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  FileText,
  Gauge,
  Link2,
  MapPin,
ShoppingCart,
  TrendingUp,
  Wrench,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/seo.css";
import "../../styles/services/service-hero-consistency.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* hides itself if an Unsplash id ever 404s, so layouts never show a broken-image icon */
function Photo({
  id,
  w = 900,
  h,
  alt = "",
  className,
  eager,
}: {
  id: string;
  w?: number;
  h?: number;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      className={className}
      src={unsplash(id, w)}
      alt={alt}
      width={w}
      height={h ?? Math.round(w * 0.66)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={(e) => {
        e.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

/* word-mask reveal: every word sits in an overflow-hidden mask and slides up */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="sq-w">
            <span>{w}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

function Head({
  eyebrow,
  children,
  lead,
  center,
}: {
  eyebrow: string;
  children: ReactNode;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div className={`sq-head${center ? " sq-head--center" : ""}`} data-reveal>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="sq-title">{children}</h2>
      {lead && <p className="sq-lead">{lead}</p>}
    </div>
  );
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const QUERY = "best interior designer in lucknow";

const MARQUEE = [
  "Technical SEO",
  "Local SEO",
  "Keyword research",
  "Content strategy",
  "Link building",
  "Core Web Vitals",
  "Google Business Profile",
  "Schema markup",
  "Monthly reporting",
];

const PHASES = [
  {
    tag: "Audit",
    title: "Find what is holding you back,",
    em: "before fixing anything.",
    text: "We crawl your site the way Google does and list every problem in plain language, ranked by how much it costs you.",
    details: ["Crawl, speed and mobile checks", "Competitor gap review", "A fix list ordered by impact"],
    note: "Audit done · 42 issues found",
  },
  {
    tag: "Research",
    title: "Aim at the searches",
    em: "that bring buyers.",
    text: "We map the words your customers type, then match each one to a page, so no keyword is left without a home.",
    details: ["Search terms grouped by intent", "Keyword-to-page map", "Local and service-area terms"],
    note: "Keywords mapped · 120 targets",
  },
  {
    tag: "Optimise",
    title: "Make every page",
    em: "easy to rank.",
    text: "Titles, headings, speed, schema and internal links get tuned, and new pages are written for the people who will read them.",
    details: ["Titles, meta and headings", "Core Web Vitals fixes", "Service and location pages"],
    note: "Pages tuned · 38 live",
  },
  {
    tag: "Grow",
    title: "Earn the trust",
    em: "that compounds.",
    text: "Reviews, mentions and links from sites your customers already read tell Google you deserve the top spot, and keep you there.",
    details: ["Relevant, earned backlinks", "Review and profile growth", "A monthly report in plain English"],
    note: "Authority rising · 24 links",
  },
];

const SERVICES: {
  Icon: LucideIcon;
  title: string;
  text: string;
  tags: string[];
  wide?: boolean;
}[] = [
  {
    Icon: Wrench,
    title: "Technical SEO & Architecture",
    text: "Crawling, indexing, schema markup and site structure fixed so Google discovers, reads and trusts every page.",
    tags: ["Core Web Vitals", "Schema & JSON-LD", "Crawl Budget", "Redirect Audit"],
    wide: true,
  },
  {
    Icon: MapPin,
    title: "Local SEO & Google Maps Dominance",
    text: "Rank in the Google 3-Pack and near-me searches with an optimized Business Profile that turns local discovery into calls and walk-ins.",
    tags: ["Google 3-Pack", "GMB Optimization", "Local Citations", "Review Growth"],
    wide: true,
  },
  {
    Icon: FileText,
    title: "High-Intent Content Strategy",
    text: "Service pages, comparison guides and authoritative articles written around questions real buyers search for.",
    tags: ["Search Intent Mapping", "Topic Clusters", "High-CTR Copy"],
  },
  {
    Icon: Gauge,
    title: "Speed & Core Web Vitals",
    text: "Lightning-fast page loads that satisfy Google's page experience algorithms and stop mobile users from bouncing.",
    tags: ["LCP < 2.5s", "Asset Compression", "Edge Caching"],
  },
  {
    Icon: Link2,
    title: "High-Authority Link Building",
    text: "Relevant editorial backlinks and brand mentions from established industry publications, never spam or link farms.",
    tags: ["Editorial Placements", "Digital PR Outreach", "Zero Spam Guarantee"],
  },
  {
    Icon: ShoppingCart,
    title: "E-commerce SEO",
    text: "Category structure, product schema and facet filtering optimized to drive high-converting organic shoppers.",
    tags: ["Category Hierarchy", "Product Schema", "Facet Indexing"],
  },
  {
    Icon: BarChart3,
    title: "Transparent Tracking & Analytics",
    text: "Full funnel attribution connecting rankings directly to form submissions, phone calls and closed revenue.",
    tags: ["GA4 & GTM Events", "Call Tracking Attribution", "Revenue Reports", "Monthly Roadmap"],
    wide: true,
  },
  {
    Icon: TrendingUp,
    title: "Competitor Gap & Market Hijack",
    text: "Identify keyword opportunities, backlink gaps and weaknesses in competing sites to steadily overtake top positions.",
    tags: ["SERP Gap Analysis", "Content Spying", "Authority Intercept", "Quick Win Exploits"],
    wide: true,
  },
];

const ISSUES = [
  { label: "Pages take more than 3 seconds to load", w: 18, fix: "Speed and image fixes" },
  { label: "No Google Business Profile, or it is half filled in", w: 14, fix: "Profile and review setup" },
  { label: "Titles and descriptions are missing or repeated", w: 12, fix: "Title and meta rewrite" },
  { label: "No separate page for each service you sell", w: 16, fix: "New service pages" },
  { label: "The site is awkward to use on a phone", w: 14, fix: "Mobile layout fixes" },
  { label: "No links from other relevant websites", w: 14, fix: "Outreach and local mentions" },
  { label: "Calls and form fills are not tracked", w: 12, fix: "Conversion tracking" },
];

const ROAD = [
  {
    when: "Days 1 to 14",
    phase: "Phase 01",
    title: "Audit and plan",
    text: "A comprehensive crawl, competitor gap review and keyword-to-page map. You get a transparent plain-English audit report and an impact-ordered action plan.",
    gets: ["Full site & competitor audit", "Keyword intent & page map", "GA4 & conversion tracking setup"],
    img: "/new-images/services/webdev/process-discover.webp",
  },
  {
    when: "Days 15 to 30",
    phase: "Phase 02",
    title: "Fix the foundations",
    text: "Speed, Core Web Vitals, titles, schema markup and 404 broken links are resolved so every subsequent page launch starts from a rock-solid technical base.",
    gets: ["Technical & indexing fixes live", "Core Web Vitals green score", "Google Business Profile tuned"],
    img: "/new-images/services/webdev/why-speed.webp",
  },
  {
    when: "Days 31 to 60",
    phase: "Phase 03",
    title: "Publish and optimise",
    text: "High-intent service and location landing pages go live, while key existing pages are enriched to directly answer what qualified buyers search for.",
    gets: ["Targeted landing pages published", "Internal link architecture rebuilt", "First major page-one ranking moves"],
    img: "/new-images/services/webdev/service-landing-pages.webp",
  },
  {
    when: "Days 61 to 90",
    phase: "Phase 04",
    title: "Earn links and scale",
    text: "Targeted digital PR outreach, local citations and reviews build compound domain trust. You track leads, phone calls and rankings in one clear live dashboard.",
    gets: ["High-authority earned backlinks", "Monthly ROI performance review", "Next-quarter growth roadmap"],
    img: "/new-images/services/webdev/why-seo.webp",
  },
];

const CASES = [
  {
    kind: "Local SEO",
    name: "Interior design & architecture studio",
    big: "+212%",
    label: "calls from Google Maps in five months",
    desc: "Fixed duplicate citations, restructured local geo-pages and generated 140+ verified 5-star Google client reviews.",
    chips: ["Google Maps 3-Pack", "Indore & Bhopal", "5 Months"],
    img: "/new-images/services/webdev/service-business-websites.webp",
  },
  {
    kind: "Ecommerce SEO",
    name: "Luxury home décor & furnishings store",
    big: "3.4×",
    label: "organic revenue after category rebuild",
    desc: "Eliminated indexing crawl-traps on filter facet pages and implemented automated product structured schema for 12,000+ SKUs.",
    chips: ["Category Architecture", "Product Schema", "Pan-India"],
    img: "/new-images/services/webdev/industry-ecommerce.webp",
  },
  {
    kind: "Content & Rank",
    name: "Professional competitive coaching institute",
    big: "46",
    label: "keywords moved onto page one",
    desc: "Targeted student exam search queries with comprehensive guides, capturing over 80,000 monthly organic study sessions.",
    chips: ["High-Intent Clusters", "Zero Ad Spend", "6 Months"],
    img: "/new-images/services/webdev/industry-training.webp",
  },
];

const RELATED = [
  {
    to: "/services/web-development",
    title: "Web development",
    text: "Fast, search-friendly websites built to rank.",
    img: "/new-images/services/webdev/related-web-development.webp",
  },
  {
    to: "/services/digital-marketing",
    title: "Digital marketing",
    text: "Ads, social and campaigns that amplify SEO reach.",
    img: "/new-images/services/webdev/related-custom-software.webp",
  },
  {
    to: "/services/ecommerce",
    title: "E-commerce development",
    text: "High-converting online stores that sell and scale.",
    img: "/new-images/services/webdev/related-ecommerce.webp",
  },
  {
    to: "/services/ai-automation",
    title: "AI automation",
    text: "Instant WhatsApp and email follow-ups for every lead.",
    img: "/new-images/services/webdev/related-ui-ux.webp",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ row                                                             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const RING = 2 * Math.PI * 52;

export default function SeoService() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLElement>(null);
  const scoreVal = useRef({ v: 0 });
  const [picked, setPicked] = useState<number[]>([0, 3]);

  const lost = picked.reduce((sum, i) => sum + ISSUES[i].w, 0);
  const score = 100 - lost;
  const verdict = score >= 85 ? "A strong base" : score >= 55 ? "Room to grow" : "Big wins waiting";
  const fixes = picked.map((i) => ISSUES[i]).sort((a, b) => b.w - a.w).slice(0, 3);

  const jump = (id: string) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  /* health score: the ring and number answer every tick */
  useLayoutEffect(() => {
    const ring = ringRef.current;
    const num = scoreRef.current;
    if (!ring || !num) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = calm ? 0 : 0.8;
    const tw = gsap.to(ring, { strokeDashoffset: RING * (1 - score / 100), duration: d, ease: "power3.out" });
    const tn = gsap.to(scoreVal.current, {
      v: score,
      duration: d,
      ease: "power3.out",
      onUpdate: () => {
        num.textContent = String(Math.round(scoreVal.current.v));
      },
    });
    return () => {
      tw.kill();
      tn.kill();
    };
  }, [score]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => Array.from(c.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => c.querySelector<T>(s) as T;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 900px)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motion, wide, fine } = ctx.conditions as unknown as { motion: boolean; wide: boolean; fine: boolean };
        if (!motion) return;

        const off: Array<() => void> = [];

        const fitHeight = (wrap: HTMLElement, kids: HTMLElement[]) => {
          const run = () => {
            wrap.style.height = "";
            wrap.style.height = `${Math.max(...kids.map((k) => k.offsetHeight))}px`;
          };
          ScrollTrigger.addEventListener("refreshInit", run);
          run();
          off.push(() => {
            ScrollTrigger.removeEventListener("refreshInit", run);
            wrap.style.height = "";
          });
        };

        root.classList.add("is-motion");
        if (wide) root.classList.add("is-wide");

        /* ================= HERO: entrance & visual parallax ================= */
        {
          const visual = one(".sq-hero__visual");
          const illus = one(".sq-hero__illustration");

          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from($(".sq-hero .breadcrumb"), { y: 14, autoAlpha: 0, duration: 0.5, clearProps: "all" })
            .from($(".sq-hero__title .sq-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
            .from($(".sq-hero__lead, .sq-hero__cta > *, .sq-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.45)
            .from(illus, { y: 36, autoAlpha: 0, scale: 0.96, duration: 1.1, ease: "power3.out", clearProps: "all" }, 0.25);

          if (visual) {
            const st = ScrollTrigger.create({
              trigger: one(".sq-hero"),
              start: "top top",
              end: "bottom top",
              scrub: 1,
              onUpdate: (self) => {
                gsap.to(visual, { y: self.progress * 30, overwrite: "auto" });
              },
            });
            off.push(() => st.kill());
          }
        }

        if (fine) {

          $(".sq-mag").forEach((b) => {
            const qx = gsap.quickTo(b, "x", { duration: 0.5, ease: "elastic.out(1,.5)" });
            const qy = gsap.quickTo(b, "y", { duration: 0.5, ease: "elastic.out(1,.5)" });
            const move = (e: PointerEvent) => {
              const r = b.getBoundingClientRect();
              qx((e.clientX - r.left - r.width / 2) * 0.25);
              qy((e.clientY - r.top - r.height / 2) * 0.25);
            };
            const leave = () => {
              qx(0);
              qy(0);
            };
            b.addEventListener("pointermove", move);
            b.addEventListener("pointerleave", leave);
            off.push(() => {
              b.removeEventListener("pointermove", move);
              b.removeEventListener("pointerleave", leave);
            });
          });

          /* service tiles: spotlight follows the cursor */
          const grid = one(".sq-svc-grid");
          const tiles = $(".sq-svc");
          const spot = (e: PointerEvent) => {
            tiles.forEach((t) => {
              const r = t.getBoundingClientRect();
              t.style.setProperty("--mx", `${e.clientX - r.left}px`);
              t.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
          };
          grid.addEventListener("pointermove", spot);
          off.push(() => grid.removeEventListener("pointermove", spot));
        }

        /* ================= TICKER: speeds up with the scroll ================= */
        {
          const track = one(".wd-tick__track") || one(".sq-marquee__track");
          if (track) {
            const mq = gsap.to(track, { xPercent: -50, repeat: -1, duration: 28, ease: "none" });
            const st = ScrollTrigger.create({
              onUpdate: (s) => {
                mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              },
            });
            off.push(() => {
              mq.kill();
              st.kill();
            });
          }
        }

        /* ================= SCENE (pinned): realistic traffic curve & phased transition ================= */
        {
          const section = one(".sq-scene");
          const steps = $(".sq-sstep");
          const counter = one(".sq-scene__count");
          const line = one<SVGPathElement>(".sq-curve");
          const clipRect = one<SVGRectElement>(".sq-chart-clip-rect");
          const crosshair = one<SVGLineElement>(".sq-crosshair");
          const pulseRing = one<SVGCircleElement>(".sq-pulse-ring");
          const dots = $(".sq-dot");
          const pills = $(".sq-phase");
          const notes = $(".sq-note");
          const badge = one(".sq-dash__growth-badge");
          const visits = one(".sq-kpi--visits");
          const kw = one(".sq-kpi--kw");
          const posEl = one(".sq-kpi--pos");
          const leads = one(".sq-kpi--leads");
          const len = line ? line.getTotalLength() : 400;

          fitHeight(one(".sq-steps"), steps);

          const DOTS_DATA = [
            { x: 40, y: 148, lift: "Baseline" },
            { x: 140, y: 120, lift: "▲ +290% Lift" },
            { x: 270, y: 54, lift: "▲ +930% Lift" },
            { x: 390, y: 14, lift: "▲ +1,900% Lift" },
          ];

          // Baseline values for Phase 1 (Audit)
          const o = { a: 2400, b: 8, c: 28, d: 14 };

          // Pre-draw line up to dot 1 (cx=40, ~10% of line) so it's never empty
          const baseDashOffset = len * 0.90;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: baseDashOffset });
          if (clipRect) gsap.set(clipRect, { attr: { width: 45 } });
          gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
          gsap.set(dots[0], { scale: 1 });
          if (crosshair) gsap.set(crosshair, { attr: { x1: 40, y1: 148, x2: 40, y2: 180 }, autoAlpha: 1 });
          if (pulseRing) gsap.set(pulseRing, { attr: { cx: 40, cy: 148 }, autoAlpha: 1 });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 24 });
          gsap.set(notes, { autoAlpha: 0, y: 10 });
          gsap.set(notes[0], { autoAlpha: 1, y: 0 });

          const paint = () => {
            if (visits) visits.textContent = fmt(Math.round(o.a));
            if (kw) kw.textContent = fmt(Math.round(o.b));
            if (posEl) posEl.textContent = `#${Math.max(1, Math.round(o.c))}`;
            if (leads) leads.textContent = fmt(Math.round(o.d));
          };
          paint();

          const mark = (n: number) => {
            pills.forEach((p, k) => p.classList.toggle("on", k === n));
            dots.forEach((d, k) => {
              gsap.to(d, { scale: k === n ? 1.35 : (k <= n ? 1 : 0), duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
            });

            const pt = DOTS_DATA[n];
            if (pt) {
              if (crosshair) {
                gsap.to(crosshair, {
                  attr: { x1: pt.x, y1: pt.y, x2: pt.x, y2: 180 },
                  duration: 0.45,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
              if (pulseRing) {
                gsap.to(pulseRing, {
                  attr: { cx: pt.x, cy: pt.y },
                  duration: 0.45,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
              if (badge) {
                badge.textContent = pt.lift;
                badge.className = `sq-dash__growth-badge ${n === 0 ? "is-baseline" : "is-positive"}`;
              }
            }
          };
          mark(0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=320%",
              scrub: 1.2,
              pin: true,
              anticipatePin: 1,
            },
          });

          // Curve line and shaded area advance synchronously
          tl.to(line, { strokeDashoffset: 0, duration: 9 }, 0);
          if (clipRect) {
            tl.to(clipRect, { attr: { width: 400 }, duration: 9 }, 0);
          }

          // Progressive milestone traffic and KPI keyframes (real SEO compounding trajectory)
          tl.to(o, { a: 3600, b: 14, c: 24, d: 22, duration: 2.5, ease: "power1.inOut", onUpdate: paint }, 0)
            .to(o, { a: 11200, b: 42, c: 14, d: 68, duration: 2.7, ease: "power1.inOut", onUpdate: paint }, 2.5)
            .to(o, { a: 27400, b: 84, c: 6, d: 178, duration: 2.6, ease: "power1.inOut", onUpdate: paint }, 5.2)
            .to(o, { a: 48200, b: 120, c: 3, d: 312, duration: 1.2, ease: "power2.out", onUpdate: paint }, 7.8);

          tl.to(dots[1], { scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.5)
            .to(dots[2], { scale: 1, duration: 0.4, ease: "back.out(2)" }, 5.2)
            .to(dots[3], { scale: 1.35, duration: 0.4, ease: "back.out(2)" }, 8.2);

          const swap = (i: number, at: number) => {
            tl.to(steps[i], { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.out" }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, at + 0.35)
              .to(notes[i], { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.out" }, at)
              .to(notes[i + 1], { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, at + 0.35)
              .call(() => { if (counter) counter.textContent = `0${i + 2} / 04`; mark(i + 1); }, undefined, at + 0.35)
              .call(() => { if (counter) counter.textContent = `0${i + 1} / 04`; mark(i); }, undefined, at - 0.01);
          };
          swap(0, 2.5);
          swap(1, 5.2);
          swap(2, 7.8);
          tl.to({}, { duration: 0.6 });

          // Smooth interactive tab clicking with precise milestone percentages
          const PHASE_OFFSETS = [0, 0.28, 0.58, 0.95];
          pills.forEach((p, idx) => {
            const click = () => {
              if (!tl.scrollTrigger) return;
              const ratio = PHASE_OFFSETS[idx] ?? (idx / 3.2);
              const target = tl.scrollTrigger.start + (tl.scrollTrigger.end - tl.scrollTrigger.start) * ratio;
              window.scrollTo({ top: target, behavior: "smooth" });
            };
            p.addEventListener("click", click);
            off.push(() => p.removeEventListener("click", click));
          });

          off.push(() => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
          });
        }

        /* ================= ROADMAP: pinned sideways, images drift inside their frames ================= */
        if (wide) {
          const section = one(".sq-road");
          const track = one(".sq-road__track");
          const bar = one(".sq-road__bar i");
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

          const h = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
          });
          gsap.to(bar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
          });

          $(".sq-day").forEach((d) => {
            gsap.fromTo(
              one(".sq-day__media", d),
              { autoAlpha: 0.9, y: 10 },
              {
                autoAlpha: 1,
                y: 0,
                ease: "power2.out",
                scrollTrigger: { trigger: d, containerAnimation: h, start: "left 92%", end: "left 50%", scrub: true },
              }
            );
          });
        }

        /* ================= CASES: smooth fade-up without image cuts ================= */
        $(".sq-case").forEach((c) => {
          gsap.fromTo(
            one(".sq-case__img", c),
            { autoAlpha: 0.88, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: c, start: "top 88%" } }
          );
        });

        /* ================= light reveal for list content ================= */
        {
          const reveals = $("[data-reveal]");
          gsap.set(reveals, { autoAlpha: 0, y: 32 });
          ScrollTrigger.batch(reveals, {
            start: "top 90%",
            once: true,
            onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", clearProps: "all" }),
          });
        }

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
  }, []);

  return (
    <>
      <Seo
        title="SEO Services in Indore | Rank Higher on Google | Sipher Webtech"
        description="Technical SEO, local SEO, content and link building that bring calls, leads and sales from Google. Start with a free site audit from Sipher Webtech."
      />

      <div className="sq" ref={rootRef}>
        {/* ============================ HERO ============================ */}
        <section className="sq-hero" aria-labelledby="sq-h1">
          <div className="container sq-hero__grid">
            <div className="sq-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">SEO</span>
              </nav>
              <h1 id="sq-h1" className="sq-hero__title" aria-label="When they search, be the first thing they find.">
                <span className="sq-line" aria-hidden="true"><Words text="When they search," /></span>
                <span className="sq-line" aria-hidden="true"><Words text="be the first" /> <em><Words text="thing they find." /></em></span>
              </h1>
              <p className="sq-hero__lead">
                We fix what holds your site back, write pages people want to read and earn the links that move you up Google, so
                search sends you calls, leads and sales.
              </p>
              <div className="sq-hero__cta">
                <Link className="button button--primary sq-mag sq-hero__main" to="/contact" data-cursor="START">
                  <span>Get a free SEO audit</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="sq-ghost sq-mag" onClick={() => jump("sq-scene")}>
                  See how we rank sites
                </button>
              </div>
              <ul className="sq-hero__trust">
                {["Plain-English reports", "No lock-in contracts", "Local and national SEO", "Tracked to leads, not just rank"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="sq-hero__visual" aria-hidden="true">
              <img
                className="sq-hero__illustration"
                src="/svg/sipher-seo-hero.svg"
                alt="SEO Search Engine Rank Optimization"
                width={800}
                height={640}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="wd-tick sq-marquee" aria-hidden="true">
          <div className="wd-tick__track sq-marquee__track">
            {[0, 1].map((g) => (
              <div className="wd-tick__group sq-marquee__group" key={g}>
                {MARQUEE.map((item) => <span key={item}>{item}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ================= PINNED: THE CURVE IS DRAWN BY SCROLLING ================= */}
        <section className="sq-scene" id="sq-scene" aria-label="How we grow your rankings">
          <div className="sq-scene__bg" aria-hidden="true" />
          <div className="container sq-scene__grid">
            <div className="sq-scene__copy">
              <h2 className="sq-sr">How we grow your rankings, step by step</h2>
              <div className="sq-steps">
                {PHASES.map((s) => (
                  <div className="sq-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="sq-sstep__list">
                      {s.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="sq-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="sq-scene__stage" aria-hidden="true">
              <div className="sq-dash">
                <div className="sq-dash__top">
                  <div className="sq-phases">
                    {PHASES.map((p, i) => (
                      <button
                        type="button"
                        className={`sq-phase${i === 0 ? " on" : ""}`}
                        key={p.tag}
                      >
                        {p.tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sq-dash__meta-row">
                  <p className="sq-dash__label">Organic visits per month</p>
                  <span className="sq-dash__growth-badge is-baseline">Baseline</span>
                </div>
                <p className="sq-dash__big sq-kpi--visits">2,400</p>

                <svg className="sq-chart" viewBox="0 0 400 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sq-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffe401" stopOpacity="0.55" />
                      <stop offset="65%" stopColor="#ffe401" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#ffe401" stopOpacity="0.01" />
                    </linearGradient>
                    <clipPath id="sq-chart-clip">
                      <rect className="sq-chart-clip-rect" x="0" y="0" width="45" height="180" />
                    </clipPath>
                  </defs>
                  <path className="sq-grid" d="M0 45H400M0 90H400M0 135H400" />
                  <g clipPath="url(#sq-chart-clip)">
                    <path className="sq-area" d="M10 150 C40 148 100 140 140 120 C190 98 230 76 270 54 C310 32 350 20 390 14 L390 180 L10 180 Z" fill="url(#sq-fill)" />
                  </g>
                  <line className="sq-crosshair" x1="40" y1="148" x2="40" y2="180" />
                  <path className="sq-curve" d="M10 150 C40 148 100 140 140 120 C190 98 230 76 270 54 C310 32 350 20 390 14" />
                  <circle className="sq-pulse-ring" cx="40" cy="148" r="14" />
                  <circle className="sq-dot" cx="40" cy="148" r="6" />
                  <circle className="sq-dot" cx="140" cy="120" r="6" />
                  <circle className="sq-dot" cx="270" cy="54" r="6" />
                  <circle className="sq-dot" cx="390" cy="14" r="7" />
                </svg>

                <div className="sq-notes">
                  {PHASES.map((p) => <span className="sq-note" key={p.tag}><Check size={13} />{p.note}</span>)}
                </div>

                <dl className="sq-kpis">
                  <div><dt>Keywords on page one</dt><dd className="sq-kpi--kw">8</dd></div>
                  <div><dt>Average position</dt><dd className="sq-kpi--pos">#28</dd></div>
                  <div><dt>Leads per month</dt><dd className="sq-kpi--leads">14</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= SERVICES ============================= */}
        <section className="sq-section sq-svcs" aria-labelledby="sq-svc-h">
          <div className="container">
            <Head center eyebrow="What we do" lead="Every part of search, handled by one team, so nothing slips between agencies.">
              <span id="sq-svc-h" className="sq-svc-title">One team for everything <em>Google looks at.</em></span>
            </Head>
            <div className="sq-svc-grid">
              {SERVICES.map(({ Icon, title, text, tags, wide }, index) => (
                <article className={`sq-svc${wide ? " sq-svc--wide" : ""}`} key={title} data-reveal>
                  <div className="sq-svc__top">
                    <span className="sq-svc__icon"><Icon aria-hidden="true" size={22} /></span>
                    <span className="sq-svc__badge" aria-hidden="true">0{index + 1}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {tags && (
                    <ul className="sq-svc__tags">
                      {tags.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                  <span className="sq-svc__arrow" aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= HEALTH CHECK ============================= */}
        <section className="sq-section sq-check" aria-labelledby="sq-check-h">
          <div className="container">
            <Head center eyebrow="Quick check" lead="Tick anything that sounds like your site. The score moves as you go, and shows what we would fix first.">
              <span id="sq-check-h">How healthy is your <em>search presence?</em></span>
            </Head>

            <div className="sq-check__grid">
              <ul className="sq-issues">
                {ISSUES.map((it, i) => {
                  const on = picked.includes(i);
                  return (
                    <li key={it.label}>
                      <button type="button" role="checkbox" aria-checked={on} className={on ? "on" : ""} onClick={() => toggle(i)}>
                        <i aria-hidden="true"><Check size={14} strokeWidth={3} /></i>
                        <span>{it.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="sq-score" aria-live="polite">
                <div className="sq-ring">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="sq-ring__bg" cx="60" cy="60" r="52" />
                    <circle
                      ref={ringRef}
                      className="sq-ring__fg"
                      cx="60"
                      cy="60"
                      r="52"
                      strokeDasharray={RING}
                      strokeDashoffset={RING * (1 - score / 100)}
                    />
                  </svg>
                  <p><b ref={scoreRef}>{score}</b><span>out of 100</span></p>
                </div>
                <h3>{verdict}</h3>
                {fixes.length ? (
                  <>
                    <p className="sq-score__sub">We would start with</p>
                    <ol>{fixes.map((f) => <li key={f.fix}>{f.fix}</li>)}</ol>
                  </>
                ) : (
                  <p className="sq-score__sub">Nothing urgent. We would focus on content and links to pull ahead.</p>
                )}
                <Link className="sq-score__link" to="/contact">
                  <span>Get the full audit</span>
                  <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= ROADMAP ============================= */}
        <section className="sq-road" id="sq-road" aria-labelledby="sq-road-h">
          <div className="container">
            <Head center eyebrow="Your first 90 days">
              <span id="sq-road-h">What happens, <em>and when.</em></span>
            </Head>
          </div>
          <ol className="sq-road__track">
            {ROAD.map((r, i) => (
              <li className="sq-day" key={r.title}>
                <span className="sq-day__num-ghost" aria-hidden="true">0{i + 1}</span>
                <div className="sq-day__copy">
                  <div className="sq-day__tags">
                    <span className="sq-day__when">{r.when}</span>
                    <span className="sq-day__phase">{r.phase}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <ul className="sq-day__deliverables">
                    {r.gets.map((g) => (
                      <li key={g}>
                        <span className="sq-day__check" aria-hidden="true">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sq-day__media">
                  <img src={r.img} alt={r.title} width={900} height={640} loading="lazy" decoding="async" />
                </div>
              </li>
            ))}
          </ol>
          <div className="sq-road__meter" aria-hidden="true">
            <span>Day 1</span>
            <span className="sq-road__bar"><i /></span>
            <span>Day 90</span>
          </div>
        </section>

        {/* ============================= CASES ============================= */}
        <section className="sq-section sq-cases" aria-labelledby="sq-cases-h">
          <div className="container">
            <Head center eyebrow="Sample outcomes" lead="The kind of movement we aim for. Figures are illustrative, and every plan starts from your own numbers.">
              <span id="sq-cases-h" className="sq-case-title">Rankings that turn into <em>real enquiries.</em></span>
            </Head>
            <div className="sq-case-list">
              {CASES.map((c, i) => (
                <article className={`sq-case${i % 2 ? " sq-case--flip" : ""}`} key={c.name}>
                  <div className="sq-case__img">
                    <img src={c.img} alt={c.name} width={900} height={640} loading="lazy" decoding="async" />
                  </div>
                  <div className="sq-case__copy" data-reveal>
                    <div className="sq-case__meta">
                      <span className="sq-case__kind">{c.kind}</span>
                      <span className="sq-case__index">Case 0{i + 1}</span>
                    </div>
                    <div className="sq-case__metric">
                      <b className="sq-case__big">{c.big}</b>
                      <p className="sq-case__label">{c.label}</p>
                    </div>
                    <h3>{c.name}</h3>
                    <p className="sq-case__desc">{c.desc}</p>
                    <ul className="sq-case__chips">
                      {c.chips.map((chip) => <li key={chip}>{chip}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== RELATED ============================== */}
        <section className="sq-section sq-relsec">
          <div className="container">
            <Head center eyebrow="Works well with" lead="SEO gets people to your door. These services help them walk in and buy.">
              Pair it with <em>what comes next</em>
            </Head>
            <div className="sq-rel-grid">
              {RELATED.map(({ to, title, text, img: bg }, i) => (
                <Link className="sq-rel" to={to} key={to} data-reveal>
                  <img className="sq-rel__bg" src={bg} alt={title} width={1536} height={1024} loading="lazy" decoding="async" />
                  <div className="sq-rel__pill">
                    <span className="sq-rel__no" aria-hidden="true">0{i + 1}</span>
                    <div className="sq-rel__info">
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                    <span className="sq-rel__more">
                      <span>Explore</span>
                      <ArrowRight aria-hidden="true" size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="sq-rel-all" data-reveal>
              <Link className="sq-rel-all__link" to="/services">
                <span>View all services</span>
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>

        </div>
    </>
  );
}