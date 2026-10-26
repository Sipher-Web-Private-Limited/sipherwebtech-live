import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  FileText,
  Gauge,
  Link2,
  MapPin,
  Plus,
  Search,
  ShoppingCart,
  TrendingUp,
  Wrench,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/seo.css";

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

const STATS = [
  { n: 184, p: "+", s: "%", l: "Typical organic traffic lift in year one" },
  { n: 46, p: "", s: "", l: "Keywords on page one for a typical local client" },
  { n: 3, p: "", s: " mo", l: "To first clear ranking movement" },
  { n: 92, p: "", s: "%", l: "Clients who stay with us after the first year" },
];

const SERVICES: { Icon: LucideIcon; title: string; text: string; tags?: string[]; wide?: boolean }[] = [
  {
    Icon: Wrench,
    title: "Technical SEO",
    text: "Crawling, indexing, site structure and schema, fixed so Google can read every page you care about.",
    tags: ["Site audit", "Indexing", "Schema", "Redirects"],
    wide: true,
  },
  {
    Icon: MapPin,
    title: "Local SEO",
    text: "Show up on Google Maps and in “near me” searches, with a Business Profile that earns calls and visits.",
    tags: ["Maps ranking", "Reviews", "Citations"],
    wide: true,
  },
  { Icon: FileText, title: "Content that ranks", text: "Service pages, guides and FAQs written around real questions." },
  { Icon: Gauge, title: "Speed & Core Web Vitals", text: "Faster pages for visitors and for search." },
  { Icon: Link2, title: "Link building", text: "Mentions from sites that matter, never bought in bulk." },
  { Icon: ShoppingCart, title: "Ecommerce SEO", text: "Category, product and filter pages that sell." },
  { Icon: BarChart3, title: "Reporting", text: "Calls, leads and sales tracked, not just rankings." },
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
    title: "Audit and plan",
    text: "A full crawl, competitor review and keyword map. You get a plain-English report and a priority list.",
    gets: ["Site and competitor audit", "Keyword-to-page map", "Tracking set up"],
    img: "1460925895917-afdab827c52f",
  },
  {
    when: "Days 15 to 30",
    title: "Fix the foundations",
    text: "Speed, mobile, titles, schema and broken links are cleaned up so every later page starts from a solid base.",
    gets: ["Technical fixes live", "Core Web Vitals pass", "Business Profile tuned"],
    img: "1551288049-bebda4e38f71",
  },
  {
    when: "Days 31 to 60",
    title: "Publish and optimise",
    text: "New service and location pages go live, and the best existing pages are rewritten to match what people search.",
    gets: ["New pages published", "Internal links rebuilt", "First ranking gains"],
    img: "1499750310107-5fef28a66643",
  },
  {
    when: "Days 61 to 90",
    title: "Earn links and report",
    text: "Outreach and reviews start building authority, and you see leads, calls and rankings in one clear report.",
    gets: ["Earned links and mentions", "Monthly performance report", "Next-quarter plan"],
    img: "1522071820081-009f0129c71c",
  },
];

const CASES = [
  { kind: "Local SEO", name: "Interior design studio", big: "+212%", label: "calls from Google Maps in five months", img: "1556228453-efd6c1ff04f6" },
  { kind: "Ecommerce SEO", name: "Home décor store", big: "3.4×", label: "organic revenue after a category rebuild", img: "1441986300917-64674bd600d8" },
  { kind: "Content SEO", name: "Coaching institute", big: "46", label: "keywords moved onto page one", img: "1503676260728-1c00da094a0b" },
];

const FAQ = [
  {
    q: "How long does SEO take to work?",
    a: "Technical fixes can show results within weeks, but most businesses see steady ranking and lead growth from the third or fourth month. Competitive terms take longer, and we tell you honestly where yours sit.",
  },
  {
    q: "Can you guarantee a number one ranking?",
    a: "No one honestly can, because Google decides the order. We promise a clear plan, careful work and transparent reports, and we focus on the searches most likely to bring customers.",
  },
  {
    q: "How much does SEO cost?",
    a: "It depends on your site, your market and how many services or locations you want to rank for. After the audit we send a clear monthly price with exactly what is included.",
  },
  {
    q: "Do you work with local businesses only?",
    a: "Not at all. We handle local SEO for shops, clinics and studios, and national or ecommerce SEO for brands that sell across India.",
  },
  {
    q: "What will I see in the monthly report?",
    a: "Rankings, traffic, calls, form fills and what we did this month, written in plain language. If something dips, we explain why and what we are doing about it.",
  },
  {
    q: "Do I need a new website for SEO?",
    a: "Usually not. We improve the site you have, and only suggest a rebuild when the platform itself blocks growth. If so, we show you why first.",
  },
];

const RELATED = [
  { to: "/services/digital-marketing", title: "Digital marketing", text: "Ads, social and email that work with SEO.", img: "1432888622747-4eb9a8efeb07" },
  { to: "/services/web-development", title: "Web development", text: "Fast websites built to rank.", img: "1498050108023-c5249f4df085" },
  { to: "/services/ecommerce", title: "E-commerce development", text: "Stores that sell and scale.", img: "1556742049-0cfed4f6a45d" },
  { to: "/services/ai-automation", title: "AI automation", text: "Follow up on every lead automatically.", img: "1677442136019-21780ecad995" },
];

/* ------------------------------------------------------------------ */
/* FAQ row                                                             */
/* ------------------------------------------------------------------ */

function FaqItem({
  q,
  a,
  id,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  id: string;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      gsap.set(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
      return;
    }
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0, duration: calm ? 0 : 0.55, ease: "power3.inOut" });
  }, [open]);

  return (
    <div className={`sq-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="sq-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const RING = 2 * Math.PI * 52;

export default function SeoService() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLElement>(null);
  const scoreVal = useRef({ v: 0 });
  const [openFaq, setOpenFaq] = useState(0);
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

        /* page progress bar */
        gsap.to(one(".sq-progress"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        /* ================= HERO: entrance, then a result climbs to #1 ================= */
        {
          const serp = one(".sq-serp");
          const rows = $(".sq-res");
          const you = one(".sq-res--you");
          const qEl = one(".sq-serp__q");
          const rank = one(".sq-res__rank");
          const rh = rows[0].offsetHeight;
          const typed = { n: QUERY.length };
          const pos = { v: 1 };

          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from($(".sq-crumb, .sq-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
            .from($(".sq-hero__title .sq-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
            .from($(".sq-hero__lead, .sq-hero__cta > *, .sq-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
            .from(serp, { y: 80, rotateX: 12, autoAlpha: 0, duration: 1.2, ease: "power3.out", clearProps: "all" }, 0.3)
            .from($(".sq-float"), { y: 40, autoAlpha: 0, scale: 0.9, duration: 0.8, stagger: 0.14, ease: "back.out(1.5)", clearProps: "all" }, 1);

          /* the climb: type the search, then lift the "you" row from #4 to #1 */
          const climb = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.6 });
          climb
            .set(rows, { autoAlpha: 1 })
            .set(you, { y: rh * 3 })
            .set(rows.filter((r) => r !== you), { y: -rh })
            .set(you, { boxShadow: "none" })
            .call(() => { rank.textContent = "#4"; })
            .fromTo(typed, { n: 0 }, { n: QUERY.length, duration: 1.6, ease: "none", onUpdate: () => { qEl.textContent = QUERY.slice(0, Math.round(typed.n)); } }, 0)
            .to(rows.filter((r) => r !== you), { y: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.08 }, 2)
            .to(you, { y: 0, duration: 1.4, ease: "power3.inOut" }, 2)
            .fromTo(pos, { v: 4 }, { v: 1, duration: 1.4, ease: "power3.inOut", onUpdate: () => { rank.textContent = `#${Math.max(1, Math.round(pos.v))}`; } }, 2)
            .fromTo(you, { scale: 1 }, { scale: 1.03, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out" }, 3.4)
            .to(you, { boxShadow: "0 0 0 3px rgba(255,228,1,.95), 0 30px 50px -26px rgba(16,5,99,.5)", duration: 0.4 }, 3.4);

          const kick = gsap.delayedCall(1.8, () => climb.play());
          const st = ScrollTrigger.create({
            trigger: one(".sq-hero"),
            start: "top bottom",
            end: "bottom top",
            onToggle: (s) => (s.isActive ? climb.play() : climb.pause()),
          });
          off.push(() => {
            kick.kill();
            climb.kill();
            st.kill();
          });

          /* ambient float: the chips bob at different speeds */
          $(".sq-float").forEach((el, i) => {
            gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 });
          });
        }

        gsap.to(one(".sq-hero__visual"), {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: one(".sq-hero"), start: "top top", end: "bottom top", scrub: true },
        });

        if (fine) {
          const hero = one(".sq-hero");
          const tilt = one(".sq-serp__tilt");
          gsap.set(tilt, { transformPerspective: 1100 });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3" });
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3" });
          const layers = $(".sq-float__in").map((el) => ({
            qx: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            qy: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            d: Number(el.dataset.depth || 1),
          }));
          const mv = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            ry(nx * 12);
            rx(-ny * 9);
            layers.forEach((l) => {
              l.qx(nx * 30 * l.d);
              l.qy(ny * 22 * l.d);
            });
          };
          hero.addEventListener("pointermove", mv);
          off.push(() => hero.removeEventListener("pointermove", mv));

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

        /* ================= MARQUEE: speeds up with scroll ================= */
        {
          const mq = gsap.to(one(".sq-marquee__track"), { xPercent: -50, repeat: -1, duration: 34, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
            },
          });
        }

        /* ================= SCENE (pinned): the traffic curve is drawn by scrolling ================= */
        {
          const section = one(".sq-scene");
          const steps = $(".sq-sstep");
          const counter = one(".sq-scene__count");
          const line = one<SVGPathElement>(".sq-curve");
          const area = one(".sq-area");
          const dots = $(".sq-dot");
          const pills = $(".sq-phase");
          const notes = $(".sq-note");
          const visits = one(".sq-kpi--visits");
          const kw = one(".sq-kpi--kw");
          const posEl = one(".sq-kpi--pos");
          const leads = one(".sq-kpi--leads");
          const len = line.getTotalLength();
          const o = { a: 0, b: 0, c: 14, d: 0 };
          fitHeight(one(".sq-steps"), steps);

          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          gsap.set(area, { autoAlpha: 0 });
          gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set(notes, { autoAlpha: 0, y: 12 });
          gsap.set(notes[0], { autoAlpha: 1, y: 0 });
          visits.textContent = "0";
          kw.textContent = "0";
          posEl.textContent = "14";
          leads.textContent = "0";
          const paint = () => {
            visits.textContent = fmt(o.a);
            kw.textContent = fmt(o.b);
            posEl.textContent = String(Math.max(3, Math.round(o.c)));
            leads.textContent = fmt(o.d);
          };
          const mark = (n: number) => pills.forEach((p, k) => p.classList.toggle("on", k === n));
          mark(0);

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top top", end: "+=400%", scrub: 1, pin: true, anticipatePin: 1 },
          });

          tl.to(line, { strokeDashoffset: 0, duration: 9, ease: "none" }, 0)
            .to(area, { autoAlpha: 1, duration: 9, ease: "none" }, 0)
            .to(o, { a: 48200, b: 120, c: 3, d: 312, duration: 9, ease: "none", onUpdate: paint }, 0)
            .to(dots[0], { scale: 1, duration: 0.3, ease: "back.out(3)" }, 1.5)
            .to(dots[1], { scale: 1, duration: 0.3, ease: "back.out(3)" }, 3.6)
            .to(dots[2], { scale: 1, duration: 0.3, ease: "back.out(3)" }, 6)
            .to(dots[3], { scale: 1, duration: 0.3, ease: "back.out(3)" }, 8.6);

          const swap = (i: number, at: number) => {
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35)
              .to(notes[i], { autoAlpha: 0, y: -10, duration: 0.3 }, at)
              .to(notes[i + 1], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.4)
              .call(() => { counter.textContent = `0${i + 2} / 04`; mark(i + 1); }, undefined, at + 0.35)
              .call(() => { counter.textContent = `0${i + 1} / 04`; mark(i); }, undefined, at - 0.01);
          };
          swap(0, 2.2);
          swap(1, 4.6);
          swap(2, 7);
          tl.to({}, { duration: 0.8 });
        }

        /* ================= STATS: numbers count up once ================= */
        {
          $("[data-count]").forEach((el) => {
            const to = Number(el.dataset.count);
            const p = el.dataset.prefix || "";
            const s = el.dataset.suffix || "";
            const o = { v: 0 };
            el.textContent = `${p}0${s}`;
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              onEnter: () =>
                gsap.to(o, { v: to, duration: 1.8, ease: "power3.out", onUpdate: () => { el.textContent = `${p}${fmt(o.v)}${s}`; } }),
            });
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
              one("img", d),
              { xPercent: -7 },
              { xPercent: 7, ease: "none", scrollTrigger: { trigger: d, containerAnimation: h, start: "left right", end: "right left", scrub: true } }
            );
            gsap.fromTo(
              one(".sq-day__media", d),
              { clipPath: "inset(14% 14% 14% 14% round 28px)" },
              { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: d, containerAnimation: h, start: "left 92%", end: "left 40%", scrub: true } }
            );
          });
        }

        /* ================= CASES: each image opens like a shutter as it enters ================= */
        $(".sq-case").forEach((c) => {
          gsap.fromTo(
            one(".sq-case__img", c),
            { clipPath: "inset(0 0 100% 0 round 28px)" },
            { clipPath: "inset(0 0 0% 0 round 28px)", ease: "none", scrollTrigger: { trigger: c, start: "top 92%", end: "top 45%", scrub: true } }
          );
          gsap.fromTo(
            one(".sq-case__img img", c),
            { yPercent: -10 },
            { yPercent: 10, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });

        /* ================= CTA: settles in, keyword chips drift ================= */
        gsap.from(one(".sq-cta"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: one(".sq-cta"), start: "top 95%", end: "top 50%", scrub: true },
        });
        $(".sq-kchip").forEach((k, i) => {
          gsap.fromTo(k, { yPercent: 25 * (i % 2 ? -1 : 1) }, { yPercent: -25 * (i % 2 ? -1 : 1), ease: "none", scrollTrigger: { trigger: one(".sq-cta"), start: "top bottom", end: "bottom top", scrub: true } });
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
        <span className="sq-progress" aria-hidden="true" />

        {/* ============================ HERO ============================ */}
        <section className="sq-hero" aria-labelledby="sq-h1">
          <div className="container sq-hero__grid">
            <div className="sq-hero__copy">
              <nav className="sq-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">SEO</span>
              </nav>

              <p className="eyebrow"><span />SEO services</p>
              <h1 id="sq-h1" className="sq-hero__title" aria-label="When they search, be the first thing they find.">
                <span className="sq-line" aria-hidden="true"><Words text="When they search," /></span>
                <span className="sq-line" aria-hidden="true"><Words text="be the first" /></span>
                <span className="sq-line sq-hl" aria-hidden="true"><Words text="thing they find." /></span>
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
              <span className="sq-hero__orb" />
              <div className="sq-serp__tilt">
                <div className="sq-serp">
                  <div className="sq-serp__bar">
                    <Search size={16} />
                    <span className="sq-serp__q">{QUERY}</span>
                    <i className="sq-serp__caret" />
                  </div>
                  <p className="sq-serp__meta">About 4,20,000 results</p>
                  <ul className="sq-serp__list">
                    <li className="sq-res sq-res--you" style={{ "--i": 0 } as CSSProperties}>
                      <small>yourbrand.com › interiors</small>
                      <b>Best Interior Designer in Lucknow | Your Brand</b>
                      <span>Homes, offices and showrooms designed on time and on budget.</span>
                      <em className="sq-res__rank">#1</em>
                    </li>
                    <li className="sq-res" style={{ "--i": 1 } as CSSProperties}>
                      <small>decorlist.in › lucknow</small>
                      <b>Top 10 Interior Designers in Lucknow</b>
                      <span>Compare ratings, prices and recent projects near you.</span>
                    </li>
                    <li className="sq-res" style={{ "--i": 2 } as CSSProperties}>
                      <small>homeideas.com › designers</small>
                      <b>Find Interior Designers Near You</b>
                      <span>Browse portfolios and request quotes in minutes.</span>
                    </li>
                    <li className="sq-res" style={{ "--i": 3 } as CSSProperties}>
                      <small>designhub.co.in › lucknow</small>
                      <b>Interior Design Services, Lucknow</b>
                      <span>Full-service design from concept to handover.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="sq-float sq-float--traffic">
                <div className="sq-float__in" data-depth="1.5">
                  <div className="sq-card-mini">
                    <span className="sq-card-mini__icon"><TrendingUp size={16} /></span>
                    <div><b>Organic traffic +184%</b><small>Compared with last year</small></div>
                  </div>
                </div>
              </div>
              <div className="sq-float sq-float--map">
                <div className="sq-float__in" data-depth="1.9">
                  <div className="sq-pill"><MapPin size={14} />Top 3 on Google Maps</div>
                </div>
              </div>
              <div className="sq-float sq-float--speed">
                <div className="sq-float__in" data-depth="1.1">
                  <div className="sq-pill sq-pill--ink"><Gauge size={14} />Page speed 96</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="sq-marquee" aria-hidden="true">
          <div className="sq-marquee__track">
            {[0, 1].map((g) => (
              <div className="sq-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
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
                    {PHASES.map((p, i) => <span className={`sq-phase${i === 0 ? " on" : ""}`} key={p.tag}>{p.tag}</span>)}
                  </div>
                </div>
                <p className="sq-dash__label">Organic visits per month</p>
                <p className="sq-dash__big sq-kpi--visits">48,200</p>

                <svg className="sq-chart" viewBox="0 0 400 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sq-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffe401" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#ffe401" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="sq-grid" d="M0 45H400M0 90H400M0 135H400" />
                  <path className="sq-area" d="M10 160 C50 156 70 150 100 140 S150 120 180 104 S240 96 270 66 S340 30 390 14 L390 180 L10 180 Z" fill="url(#sq-fill)" />
                  <path className="sq-curve" d="M10 160 C50 156 70 150 100 140 S150 120 180 104 S240 96 270 66 S340 30 390 14" />
                  <circle className="sq-dot" cx="100" cy="140" r="6" />
                  <circle className="sq-dot" cx="180" cy="104" r="6" />
                  <circle className="sq-dot" cx="270" cy="66" r="6" />
                  <circle className="sq-dot" cx="390" cy="14" r="7" />
                </svg>

                <div className="sq-notes">
                  {PHASES.map((p) => <span className="sq-note" key={p.tag}><Check size={13} />{p.note}</span>)}
                </div>

                <dl className="sq-kpis">
                  <div><dt>Keywords on page one</dt><dd className="sq-kpi--kw">120</dd></div>
                  <div><dt>Average position</dt><dd className="sq-kpi--pos">3</dd></div>
                  <div><dt>Leads per month</dt><dd className="sq-kpi--leads">312</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= STATS ============================= */}
        <section className="sq-section sq-stats" aria-label="SEO results at a glance">
          <div className="container">
            <div className="sq-stats__grid">
              {STATS.map((s) => (
                <div className="sq-stat" key={s.l} data-reveal>
                  <b data-count={s.n} data-prefix={s.p} data-suffix={s.s}>{s.p}{s.n}{s.s}</b>
                  <p>{s.l}</p>
                </div>
              ))}
            </div>
            <p className="sq-fine">Illustrative figures from past projects. Results depend on your market and starting point.</p>
          </div>
        </section>

        {/* ============================= SERVICES ============================= */}
        <section className="sq-section sq-svcs" aria-labelledby="sq-svc-h">
          <div className="container">
            <Head eyebrow="What we do" lead="Every part of search, handled by one team, so nothing slips between agencies.">
              <span id="sq-svc-h">One team for everything <em>Google looks at.</em></span>
            </Head>
            <div className="sq-svc-grid">
              {SERVICES.map(({ Icon, title, text, tags, wide }) => (
                <article className={`sq-svc${wide ? " sq-svc--wide" : ""}`} key={title} data-reveal>
                  <span className="sq-svc__icon"><Icon aria-hidden="true" size={22} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {tags && <ul>{tags.map((t) => <li key={t}>{t}</li>)}</ul>}
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
            <Head eyebrow="Your first 90 days">
              <span id="sq-road-h">What happens, <em>and when.</em></span>
            </Head>
          </div>
          <ol className="sq-road__track">
            {ROAD.map((r, i) => (
              <li className="sq-day" key={r.title}>
                <div className="sq-day__copy">
                  <span className="sq-day__no" aria-hidden="true">{i + 1}</span>
                  <p className="sq-day__when">{r.when}</p>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <ul>{r.gets.map((g) => <li key={g}><Check aria-hidden="true" size={14} />{g}</li>)}</ul>
                </div>
                <div className="sq-day__media">
                  <Photo id={r.img} w={900} h={700} />
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
            <Head eyebrow="Sample outcomes" lead="The kind of movement we aim for. Figures are illustrative, and every plan starts from your own numbers.">
              <span id="sq-cases-h">Rankings that turn into <em>real enquiries.</em></span>
            </Head>
            <div className="sq-case-list">
              {CASES.map((c, i) => (
                <article className={`sq-case${i % 2 ? " sq-case--flip" : ""}`} key={c.name}>
                  <div className="sq-case__img"><Photo id={c.img} w={900} h={640} /></div>
                  <div className="sq-case__copy" data-reveal>
                    <p className="sq-case__kind">{c.kind}</p>
                    <b className="sq-case__big">{c.big}</b>
                    <p className="sq-case__label">{c.label}</p>
                    <h3>{c.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ FAQ ================================ */}
        <section className="sq-section sq-faq" id="sq-faq" aria-labelledby="sq-faq-h">
          <div className="container sq-faq__grid">
            <div className="sq-faq__side">
              <Head eyebrow="Questions we hear often">
                <span id="sq-faq-h">Honest answers <em>about SEO.</em></span>
              </Head>
              <p className="sq-lead">Still wondering about something? Ask us on the audit call.</p>
              <Link className="sq-faq__link" to="/contact">
                <span>Ask our team</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="sq-faq__list">
              {FAQ.map((f, i) => (
                <FaqItem key={f.q} id={`sq-faq-${i}`} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============================== RELATED ============================== */}
        <section className="sq-section sq-related">
          <div className="container">
            <Head center eyebrow="Works well with" lead="SEO gets people to your door. These services help them walk in and buy.">
              Pair it with <em>what comes next</em>
            </Head>
            <div className="sq-rel-grid">
              {RELATED.map((r) => (
                <Link className="sq-relcard" to={r.to} key={r.to} data-reveal>
                  <div className="sq-relcard__media"><Photo id={r.img} w={700} h={520} /></div>
                  <div className="sq-relcard__body">
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="sq-relcard__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ CTA ================================ */}
        <section className="sq-cta-sec" id="sq-contact">
          <div className="container">
            <div className="sq-cta">
              <div className="sq-cta__inner">
                <div className="sq-cta__copy">
                  <p className="eyebrow"><span />Start the conversation</p>
                  <h2>Your next customer is searching right now. <em>Let them find you.</em></h2>
                  <p>Share your website and we will send a free audit with the biggest wins, a keyword shortlist and a realistic timeline.</p>
                  <ul className="sq-cta__list">
                    {["Free site audit", "Plain-English plan", "No lock-in contract"].map((t) => (
                      <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                    ))}
                  </ul>
                  <div className="sq-cta__action">
                    <Link className="sq-cta__btn sq-mag" to="/contact" data-cursor="START">
                      <span>Get my free audit</span>
                      <ArrowUpRight aria-hidden="true" size={20} />
                    </Link>
                    <p>No obligation.</p>
                  </div>
                </div>

                <div className="sq-cta__stage" aria-hidden="true">
                  <div className="sq-cta__bar"><Search size={16} /><span>your service + your city</span></div>
                  {["near me", "best", "price", "reviews", "open now"].map((k, i) => (
                    <span className={`sq-kchip sq-kchip--${i + 1}`} key={k}>{k}</span>
                  ))}
                  <div className="sq-cta__top"><b>#1</b><span>Your business</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}