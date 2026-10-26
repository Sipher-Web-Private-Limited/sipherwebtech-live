import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import TechStackRibbons from "../../components/TechStackRibbons";
import "../../styles/services/software-development.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Unsplash has no tech logos, so logos come from the Devicon CDN */
const dev = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`;

const NAVY = "#100563";
const YELLOW = "#ffe401";

/* Photo hides itself if an Unsplash id ever 404s, so layouts never show a broken-image icon */
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
      fetchPriority={eager ? "high" : "auto"}
      onError={(e) => {
        e.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

/* word-mask reveal: each word sits in an overflow-hidden mask so it can slide up */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="sd-w">
            <span>{w}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/* scroll-lit statement: every word fades in as you scroll */
function StatementWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="sd-statement__w">
          {w}{" "}
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
    <div className={`sd-head${center ? " sd-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="sd-title">{children}</h2>
      {lead && <p className="sd-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/* Architecture diagram geometry — one source of truth for the SVG, the draw-on links and the data packets */
const CLIENTS = [
  { id: "web", label: "Web app", y: 40 },
  { id: "mobile", label: "Mobile app", y: 130 },
  { id: "partner", label: "Partner API", y: 220 },
  { id: "staff", label: "Staff portal", y: 310 },
];
const MODULES = [
  { id: "orders", label: "Orders", y: 40, to: 0 },
  { id: "billing", label: "Billing", y: 130, to: 0 },
  { id: "stock", label: "Inventory", y: 220, to: 0 },
  { id: "alerts", label: "Alerts", y: 310, to: 1 },
];
const DATA = [
  { id: "db", label: "Database", y: 112 },
  { id: "reports", label: "Reports", y: 242 },
];

const SCENE = [
  {
    tag: "Map",
    title: "Start with how the work",
    em: "really runs.",
    text: "We sit with the people who do the job today and trace every hand-off, so the software replaces real steps, not assumptions.",
    details: ["Roles, forms and spreadsheets mapped", "Systems and data you already rely on", "A scoped plan with clear priorities"],
  },
  {
    tag: "Model",
    title: "Design the system",
    em: "before writing it.",
    text: "Screens, data and APIs are shaped together, so every module knows who talks to whom before the first line of code.",
    details: ["Data model and API contracts", "Clickable screens you can react to", "Security and access rules agreed early"],
  },
  {
    tag: "Build",
    title: "Build in sprints,",
    em: "see it every two weeks.",
    text: "Modules are built, tested and demoed in short cycles, so you steer with working software instead of status reports.",
    details: ["A live demo at the end of every sprint", "Automated tests written alongside the code", "Everything in a repository you own"],
  },
  {
    tag: "Run",
    title: "Launch it, then keep it",
    em: "healthy.",
    text: "Releases go out through a CI/CD pipeline, are monitored and backed up, and the same team stays on after go-live.",
    details: ["Repeatable, one-click releases", "Monitoring, backups and access control", "Fixes and new features on a care plan"],
  },
];

const CODE = "Route::middleware('auth')\n  ->apiResource('orders',\n    OrderController::class);";

const SERVICES = [
  {
    title: "Custom business software",
    text: "Tools shaped around your process — billing, bookings, approvals, inventory — that replace spreadsheets and shared inboxes.",
    chips: ["Workflows", "Roles & access", "Audit trail"],
    img: "1461749280684-dccba630e2f6",
  },
  {
    title: "ERP & CRM systems",
    text: "Sales, stock, accounts and customers in one connected system, with the right view for every role in your team.",
    chips: ["Sales pipeline", "Stock & purchase", "Invoicing"],
    img: "1551288049-bebda4e38f71",
  },
  {
    title: "SaaS platforms",
    text: "Multi-tenant products with subscriptions, admin consoles and the headroom to grow well past your first hundred customers.",
    chips: ["Multi-tenancy", "Billing plans", "Admin console"],
    img: "1555066931-4365d14bab8c",
  },
  {
    title: "Mobile & web apps",
    text: "Apps for your staff and customers that share one secure backend and stay quick on any device or network.",
    chips: ["Android & iOS", "Works on slow networks", "Push alerts"],
    img: "1507238691740-187a5b1d37b8",
  },
  {
    title: "APIs & integrations",
    text: "Connect payments, WhatsApp, accounting and partner systems so data moves between them without anyone retyping it.",
    chips: ["REST APIs", "Webhooks", "Payment gateways"],
    img: "1517694712202-14dd9538aa97",
  },
  {
    title: "Legacy modernisation",
    text: "Move ageing desktop tools and spreadsheet systems onto a fast, maintainable platform without stopping the business.",
    chips: ["Data migration", "Phased cut-over", "Documentation"],
    img: "1518770660439-4636190af475",
  },
];

const STATEMENT = "Good software disappears into the work. Your team stops thinking about the tool and gets on with the job.";

const PROCESS = [
  {
    title: "Discover",
    when: "Week 1",
    text: "We sit with the people who run the process today and map every hand-off, form and spreadsheet.",
    gets: ["Process and role map", "Scope with clear priorities", "Itemised quote"],
    img: "1522071820081-009f0129c71c",
  },
  {
    title: "Architect",
    when: "Weeks 2–3",
    text: "Screens, data model and API contracts are designed together so nothing is a surprise during the build.",
    gets: ["Clickable prototype", "Database and API design", "Security and access plan"],
    img: "1558655146-9f40138edfeb",
  },
  {
    title: "Build",
    when: "Two-week sprints",
    text: "Modules are built and demoed every sprint, so you steer with working software instead of status reports.",
    gets: ["A working demo each sprint", "Code in a repository you own", "Automated tests as we go"],
    img: "1555066931-4365d14bab8c",
  },
  {
    title: "Test & harden",
    when: "Every sprint, then before launch",
    text: "We test with your real data and edge cases, review security and load-test the busiest paths.",
    gets: ["Test and bug report", "Security review", "Data migration rehearsal"],
    img: "1550751827-4bd374c3f58b",
  },
  {
    title: "Launch & support",
    when: "Launch week and beyond",
    text: "Release through a CI/CD pipeline, train your team, then stay on for fixes, backups and new features.",
    gets: ["Monitored go-live", "Team training and documentation", "A maintenance plan"],
    img: "1519389950473-47ba0277781c",
  },
];

type Tech = { name: string; icon: string };

const LAYERS: { name: string; sub: string; text: string; tech: Tech[] }[] = [
  {
    name: "Interfaces",
    sub: "What your team and customers touch",
    text: "Fast, accessible screens for web and mobile, built from one design language so they stay readable on the busiest day.",
    tech: [
      { name: "React", icon: dev("react/react-original") },
      { name: "TypeScript", icon: dev("typescript/typescript-original") },
      { name: "HTML5", icon: dev("html5/html5-original") },
      { name: "CSS3", icon: dev("css3/css3-original") },
    ],
  },
  {
    name: "Application",
    sub: "Where your business rules live",
    text: "Clean, modular code that holds your workflows, permissions and calculations, with an API for everything else to talk to.",
    tech: [
      { name: "Laravel", icon: dev("laravel/laravel-original") },
      { name: "PHP", icon: dev("php/php-original") },
      { name: "Python", icon: dev("python/python-original") },
      { name: "Django", icon: dev("django/django-plain") },
    ],
  },
  {
    name: "Data",
    sub: "One source of truth",
    text: "Well-designed schemas, indexes and backups keep reports accurate and the system quick as the records pile up.",
    tech: [
      { name: "MySQL", icon: dev("mysql/mysql-original") },
      { name: "PostgreSQL", icon: dev("postgresql/postgresql-original") },
      { name: "MongoDB", icon: dev("mongodb/mongodb-original") },
      { name: "Redis", icon: dev("redis/redis-original") },
    ],
  },
  {
    name: "Infrastructure",
    sub: "How it runs and ships",
    text: "Containers, cloud hosting and automated pipelines make every release repeatable and every failure recoverable.",
    tech: [
      { name: "Docker", icon: dev("docker/docker-original") },
      { name: "Azure", icon: dev("azure/azure-original") },
      { name: "GitHub Actions", icon: dev("githubactions/githubactions-original") },
      { name: "Linux", icon: dev("linux/linux-original") },
    ],
  },
];

const INDUSTRIES = [
  { name: "Clinics & hospitals", text: "Appointments, patient records, billing and pharmacy in one place.", img: "1519494026892-80bbd2d6fd0d" },
  { name: "Training institutes", text: "Admissions, batches, fees, attendance and certificates.", img: "1524178232363-1fb2b075b655" },
  { name: "Manufacturing & distribution", text: "Orders, stock, dispatch and vendor tracking.", img: "1581091226825-a6a2a5aee158" },
  { name: "Retail & e-commerce", text: "Inventory, billing counters and online orders on one backend.", img: "1556742049-0cfed4f6a45d" },
  { name: "Logistics & field teams", text: "Jobs, routes, proof of delivery and live status.", img: "1586528116311-ad8dd3c8310d" },
  { name: "Startups & SaaS", text: "From first MVP to a multi-tenant product that scales.", img: "1551434678-e076c223a692" },
];

const FAQ = [
  {
    q: "How much does custom software cost?",
    a: "It depends on scope: the number of modules, user roles, integrations and reports. After a discovery call and a short requirements study we send an itemised quote with no hidden charges, and we can phase the build to fit your budget.",
  },
  {
    q: "How long will it take to build?",
    a: "A focused internal tool can be ready in a few weeks, while a full ERP, CRM or SaaS platform usually takes a few months. We work in two-week sprints, so you can use and review real features long before the final launch.",
  },
  {
    q: "Who owns the source code?",
    a: "You do. Once the project is paid for, the source code, database and documentation belong to your business, so you are never locked in to us.",
  },
  {
    q: "Can it connect to the tools we already use?",
    a: "Usually, yes. Where a tool offers an API or a standard way to exchange data, we connect it, so you do not have to replace the systems that already work. We confirm what is possible during discovery.",
  },
  {
    q: "How do you keep our data secure?",
    a: "Role-based access, encrypted connections, input validation, regular backups and reviewed deployments. We agree up front what data is stored where, and who can see it.",
  },
  {
    q: "What happens after launch?",
    a: "We offer care plans that cover bug fixes, security updates, backups, monitoring and new features, handled by the same team that built the software.",
  },
];

const RELATED = [
  { to: "/services/ui-ux", title: "UI/UX design", text: "Interfaces that feel obvious and look great.", img: "1558655146-9f40138edfeb" },
  { to: "/services/web-development", title: "Web development", text: "Fast, search-friendly websites and portals.", img: "1498050108023-c5249f4df085" },
  { to: "/services/ecommerce", title: "E-commerce development", text: "Online stores that sell and scale.", img: "1556742049-0cfed4f6a45d" },
  { to: "/services/seo", title: "SEO services", text: "Get found by the customers who are searching.", img: "1460925895917-afdab827c52f" },
];

/* ------------------------------------------------------------------ */
/* FAQ row — height is animated with GSAP, hidden content leaves the   */
/* accessibility tree through visibility                               */
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
    gsap.to(el, {
      height: open ? "auto" : 0,
      autoAlpha: open ? 1 : 0,
      duration: calm ? 0 : 0.55,
      ease: "power3.inOut",
    });
  }, [open]);

  return (
    <div className={`sd-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="sd-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SoftwareDevelopment() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [openInd, setOpenInd] = useState(0);

  const jump = (id: string) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

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

        /* pinned text areas size themselves to their tallest slide, so any width or wrap fits */
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

        /* ================= HERO: one orchestrated entrance ================= */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from($(".sd-crumb, .sd-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
          .from($(".sd-hero__title .sd-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".sd-hero__lead, .sd-hero__cta > *, .sd-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
          .fromTo(
            one(".sd-stage__photo"),
            { autoAlpha: 0, scale: 0.88, y: 30 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.4)", clearProps: "all" },
            0.2
          )
          .from($(".sd-float"), { y: 44, autoAlpha: 0, scale: 0.92, duration: 0.9, stagger: 0.14, ease: "back.out(1.5)", clearProps: "all" }, 0.85);

        /* sparkline draws itself, numbers count up if present */
        const line = root.querySelector<SVGPathElement>(".sd-spark__line");
        if (line) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          const area = root.querySelector(".sd-spark__area");
          if (area) gsap.set(area, { autoAlpha: 0 });
          gsap.to(line, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", delay: 1.1 });
          if (area) gsap.to(area, { autoAlpha: 1, duration: 1, delay: 1.9 });
          $(".sd-count").forEach((el) => {
            const to = Number(el.dataset.to || 0);
            const o = { v: 0 };
            el.textContent = "0";
            gsap.to(o, {
              v: to,
              duration: 2.2,
              delay: 1.1,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(o.v).toLocaleString("en-IN");
              },
            });
          });
        }

        /* the whole composition drifts slower than the page */
        gsap.to(one(".sd-hero__visual"), {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: one(".sd-hero"), start: "top top", end: "bottom top", scrub: true },
        });

        if (fine) {
          /* layered depth: each floating card follows the pointer at its own speed */
          const hero = one(".sd-hero");
          const layers = $(".sd-float__in").map((el) => ({
            qx: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            qy: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            d: Number(el.dataset.depth || 1),
          }));
          const mv = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.qx(nx * 34 * l.d);
              l.qy(ny * 26 * l.d);
            });
          };
          hero.addEventListener("pointermove", mv);
          off.push(() => hero.removeEventListener("pointermove", mv));

          /* magnetic buttons */
          $(".sd-mag").forEach((b) => {
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
        }


        /* ================= SCENE: the system assembles itself ================= */
        {
          const section = one(".sd-scene");
          const steps = $(".sd-sstep");
          const tags = $(".sd-tag");
          const counter = one(".sd-scene__count");
          const nodes = $(".sd-node");
          const rects = $(".sd-node__r");
          const cRects = $(".sd-node--c .sd-node__r");
          const mRects = $(".sd-node--m .sd-node__r");
          const dRects = $(".sd-node--d .sd-node__r");
          const allText = $(".sd-node text");
          const mText = $(".sd-node--m text");
          const gwBox = one(".sd-gw");
          const gw = one(".sd-gw__r");
          const links = $<SVGPathElement>(".sd-link");
          const codePanel = one(".sd-code");
          const codeEl = one(".sd-code__body");
          const chips = $(".sd-schip");
          const live = one(".sd-live");
          const typed = { n: 0 };
          fitHeight(one(".sd-steps"), steps);

          /* start state: dashed outlines of a system that does not exist yet */
          gsap.set(rects, { fill: "#ffffff", stroke: "rgba(16,5,99,.4)", strokeDasharray: "5 6" });
          gsap.set(allText, { fill: NAVY });
          gsap.set(gw, { fill: "rgba(255,255,255,0)", stroke: "rgba(16,5,99,.3)", strokeDasharray: "5 6" });
          links.forEach((p) => {
            const L = p.getTotalLength();
            gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
          });
          gsap.set(nodes, { autoAlpha: 0, scale: 0.82 });
          gsap.set(gwBox, { autoAlpha: 0 });
          gsap.set(one(".sd-dia-wrap"), { y: 50, autoAlpha: 0 });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set(tags, { autoAlpha: 0, y: 14 });
          gsap.set(codePanel, { autoAlpha: 0, x: 30 });
          gsap.set(chips, { autoAlpha: 0, scale: 0.6 });
          gsap.set(live, { autoAlpha: 0, scale: 0.6 });

          /* data packets that loop through the finished system */
          const packets = $<SVGCircleElement>(".sd-packet");
          gsap.set(packets, { autoAlpha: 0 });
          const cp = $<SVGPathElement>(".sd-link--c");
          const mp = $<SVGPathElement>(".sd-link--m");
          const dp = $<SVGPathElement>(".sd-link--d");
          const flow = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
          packets.forEach((pk, i) => {
            let at = i * 0.45;
            flow.set(pk, { autoAlpha: 1 }, at);
            [cp[i], mp[i], dp[i]].forEach((path) => {
              const L = path.getTotalLength();
              const o = { t: 0 };
              flow.to(
                o,
                {
                  t: 1,
                  duration: 0.55,
                  ease: "none",
                  onUpdate: () => {
                    const p = path.getPointAtLength(o.t * L);
                    pk.setAttribute("cx", String(p.x));
                    pk.setAttribute("cy", String(p.y));
                  },
                },
                at
              );
              at += 0.55;
            });
            flow.set(pk, { autoAlpha: 0 }, at);
          });
          gsap.set(packets, { autoAlpha: 0 });
          let flowing = false;
          const setFlow = (on: boolean) => {
            if (on === flowing) return;
            flowing = on;
            if (on) flow.play();
            else {
              flow.pause(0);
              gsap.set(packets, { autoAlpha: 0 });
            }
          };
          off.push(() => flow.kill());

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: wide ? "+=420%" : "+=220%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              onUpdate: (s) => setFlow(s.progress > 0.84),
            },
          });

          const swap = (i: number, at: number) => {
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35)
              .to(tags[i], { autoAlpha: 0, y: -10, duration: 0.3 }, at)
              .to(tags[i + 1], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.4)
              .call(() => { counter.textContent = `0${i + 2} / 04`; }, undefined, at + 0.35)
              .call(() => { counter.textContent = `0${i + 1} / 04`; }, undefined, at - 0.01);
          };

          /* 1 — map: outlines appear */
          tl.to(one(".sd-dia-wrap"), { y: 0, autoAlpha: 1, duration: 1 }, 0)
            .to(gwBox, { autoAlpha: 1, duration: 0.6 }, 0.5)
            .to(nodes, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.7)" }, 0.7)
            .to(tags[0], { autoAlpha: 1, y: 0, duration: 0.5 }, 1.2);
          swap(0, 2.8);

          /* 2 — model: the connections are drawn */
          tl.set(gw, { strokeDasharray: "none" }, 3.1)
            .to(gw, { fill: "rgba(255,228,1,.28)", stroke: NAVY, duration: 0.6 }, 3.1)
            .to(links, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: "none" }, 3.2);
          swap(1, 5.4);

          /* 3 — build: outlines fill in while the code types itself */
          tl.set(rects, { strokeDasharray: "none" }, 5.9)
            .to(cRects, { fill: "#ffffff", stroke: NAVY, duration: 0.5, stagger: 0.08 }, 5.9)
            .to(mRects, { fill: NAVY, stroke: NAVY, duration: 0.5, stagger: 0.1 }, 6.2)
            .to(mText, { fill: "#ffffff", duration: 0.4, stagger: 0.1 }, 6.2)
            .to(dRects, { fill: YELLOW, stroke: NAVY, duration: 0.5, stagger: 0.1 }, 6.7)
            .to(codePanel, { autoAlpha: 1, x: 0, duration: 0.6 }, 6.1)
            .to(
              typed,
              {
                n: CODE.length,
                duration: 1.6,
                ease: "none",
                onUpdate: () => {
                  codeEl.textContent = CODE.slice(0, Math.round(typed.n));
                },
              },
              6.4
            );
          swap(2, 8.2);

          /* 4 — run: safeguards land, packets start moving (see setFlow) */
          tl.to(codePanel, { autoAlpha: 0, x: -20, duration: 0.5 }, 8.5)
            .to(chips, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: "back.out(2)" }, 8.8)
            .to(live, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 9.3)
            .to({}, { duration: 0.9 });
        }

        /* ================= SERVICES: index + preview, desktop only ================= */
        if (wide) {
          const section = one(".sd-svc");
          const items = $(".sd-svc__item");
          const figs = $(".sd-svc__fig");
          const dets = $(".sd-svc__det");
          const bar = one(".sd-svc__bar i");
          const count = one(".sd-svc__count");
          const n = SERVICES.length;
          let cur = 0;
          let z = 1;
          fitHeight(one(".sd-svc__dets"), dets);

          gsap.set(figs, { zIndex: (i: number) => (i === 0 ? 1 : 0) });
          gsap.set(figs.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(dets.slice(1), { autoAlpha: 0, y: 24 });

          const go = (k: number) => {
            if (k === cur) return;
            const forward = k > cur;
            items.forEach((it, i) => it.classList.toggle("on", i === k));
            gsap.to(dets[cur], { autoAlpha: 0, y: -18, duration: 0.3, overwrite: true });
            gsap.fromTo(dets[k], { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out", overwrite: true });
            gsap.fromTo($(".sd-svc__chip", dets[k]), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.35, ease: "power3.out", overwrite: true });
            z += 1;
            gsap.set(figs[k], { zIndex: z });
            gsap.fromTo(
              figs[k],
              { clipPath: forward ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "power3.inOut", overwrite: true }
            );
            gsap.fromTo($("img", figs[k]), { scale: 1.22 }, { scale: 1, duration: 1.4, ease: "power3.out", overwrite: true });
            cur = k;
            count.textContent = `0${k + 1} / 0${n}`;
          };

          const trig = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: `+=${n * 70}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate: (s) => {
              go(Math.min(n - 1, Math.floor(s.progress * n)));
              bar.style.transform = `scaleX(${Math.max(0.04, s.progress)})`;
            },
          });

          /* click an item to scroll straight to its slot */
          items.forEach((it, i) => {
            const f = () => window.scrollTo({ top: trig.start + (trig.end - trig.start) * ((i + 0.5) / n), behavior: "smooth" });
            it.addEventListener("click", f);
            off.push(() => it.removeEventListener("click", f));
          });
          off.push(() => items.forEach((it, i) => it.classList.toggle("on", i === 0)));
        }

        /* ================= STATEMENT: words light up as you scroll ================= */
        {
          const words = $(".sd-statement__w");
          gsap.set(words, { opacity: 0.14 });
          gsap.to(words, {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: one(".sd-statement__text"), start: "top 80%", end: "bottom 45%", scrub: true },
          });
          $(".sd-statement__img").forEach((el) => {
            const s = Number(el.dataset.speed || 1);
            gsap.fromTo(
              el,
              { yPercent: 18 * s },
              { yPercent: -18 * s, ease: "none", scrollTrigger: { trigger: one(".sd-statement"), start: "top bottom", end: "bottom top", scrub: true } }
            );
          });
        }

        /* ================= PROCESS: a rail fills, steps light up ================= */
        {
          const list = one(".sd-proc__list");
          const rail = one(".sd-proc__rail i");
          const steps = $(".sd-pstep");
          const imgs = $(".sd-proc__img");
          const num = one(".sd-proc__no span");
          const chip = one(".sd-proc__chip");
          const last = steps.length - 1;

          gsap.fromTo(
            rail,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 55%", end: "bottom 62%", scrub: true } }
          );

          const activate = (i: number) => {
            steps.forEach((s, k) => {
              s.classList.toggle("on", k <= i);
              s.classList.toggle("now", k === i);
            });
            imgs.forEach((im, k) => im.classList.toggle("on", k === i));
            num.textContent = `0${i + 1}`;
            chip.textContent = PROCESS[i].title;
          };
          activate(0);

          steps.forEach((s, i) => {
            ScrollTrigger.create({
              trigger: s,
              start: "top 58%",
              end: i === last ? "max" : "bottom 58%",
              onToggle: (self) => {
                if (self.isActive) activate(i);
              },
              onLeaveBack: () => {
                if (i === 0) activate(0);
              },
            });
          });

          off.push(() => {
            steps.forEach((s) => {
              s.classList.add("on");
              s.classList.remove("now");
            });
            imgs.forEach((im, k) => im.classList.toggle("on", k === 0));
          });
        }

        /* ================= STACK: layers lift apart, one by one ================= */
        {
          const section = one(".sd-stack");
          const rig = one(".sd-stack__rig");
          const layers = $(".sd-layer");
          const items = $(".sd-stack__item");
          const dets = $(".sd-stack__det");
          const count = one(".sd-stack__count");
          let cur = -1;
          fitHeight(one(".sd-stack__dets"), dets);

          gsap.set(dets, { autoAlpha: 0, y: 24 });
          gsap.set(rig, { "--gap": 10, "--rz": -52, "--rx": 40 });
          gsap.set(layers, { "--lift": 0 });

          const show = (n: number) => {
            if (n === cur) return;
            const prev = cur;
            cur = n;
            layers.forEach((l, k) => {
              l.classList.toggle("on", k === n);
              gsap.to(l, { "--lift": k === n ? 26 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
            });
            items.forEach((it, k) => it.classList.toggle("on", k === n));
            if (prev > -1) gsap.to(dets[prev], { autoAlpha: 0, y: -16, duration: 0.3, overwrite: true });
            gsap.fromTo(dets[n], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: prev > -1 ? 0.18 : 0, ease: "power3.out", overwrite: true });
            gsap.fromTo($(".sd-stack__tech li", dets[n]), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.3, ease: "power3.out", overwrite: true });
            count.textContent = `0${n + 1} / 0${LAYERS.length}`;
          };

          const targetGap = wide ? 118 : 50;
          const targetRx = wide ? 58 : 46;
          const targetRz = wide ? -36 : -28;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: wide ? "+=380%" : "+=200%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              onUpdate: (s) => show(Math.max(0, Math.min(LAYERS.length - 1, Math.floor((s.progress - 0.18) / 0.2)))),
            },
          });
          tl.to(rig, { "--gap": targetGap, "--rz": targetRz, "--rx": targetRx, duration: 1, ease: "power2.inOut" }, 0).to({}, { duration: 4 });
          show(0);

          off.push(() => {
            items.forEach((it, k) => it.classList.toggle("on", k === 0));
            layers.forEach((l) => l.classList.remove("on"));
          });
        }

        /* ================= CTA settles in ================= */
        gsap.from(one(".sd-cta"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: one(".sd-cta"), start: "top 95%", end: "top 50%", scrub: true },
        });
        gsap.fromTo(
          one(".sd-cta__mark"),
          { yPercent: -12, rotate: -6 },
          { yPercent: 12, rotate: 4, ease: "none", scrollTrigger: { trigger: one(".sd-cta"), start: "top bottom", end: "bottom top", scrub: true } }
        );

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
        title="Custom Software Development Company in Indore | Sipher Webtech"
        description="Custom business software, ERP and CRM systems, SaaS platforms, mobile apps and APIs, built secure and scalable around your process. Get a free consultation from Sipher Webtech."
      />

      <div className="sd" ref={rootRef}>
        {/* ============================ HERO ============================ */}
        <section className="sd-hero" aria-labelledby="sd-h1">
          <div className="container sd-hero__grid">
            <div className="sd-hero__copy">
              <nav className="sd-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">Software Development</span>
              </nav>

              <p className="eyebrow"><span />Software Development</p>
              <h1 id="sd-h1" className="sd-hero__title" aria-label="Software Shaped Around How You Work.">
                <span className="sd-line" aria-hidden="true"><Words text="Software Shaped Around" /></span>
                <em className="sd-line" aria-hidden="true"><Words text="How You Work." /></em>
              </h1>
              <p className="sd-hero__lead">
                From internal tools and ERP to SaaS platforms and APIs, we design and build software your team actually
                wants to open every morning: secure, scalable and yours to own.
              </p>
              <div className="sd-hero__cta">
                <button type="button" className="sd-ghost sd-mag" onClick={() => jump("sd-scene")}>
                  See how we build
                </button>
              </div>
              <ul className="sd-hero__trust">
                {["You own the code", "Secure by design", "Demo every two weeks", "Itemised quotes"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="sd-hero__visual" aria-hidden="true">
              <span className="sd-hero__disc" />
              <span className="sd-hero__dots" />
              <div className="sd-stage__photo">
                <img
                  src="/images/services/softdev/software-hero.svg"
                  alt="Custom software architecture with cloud services, databases, APIs, code and analytics"
                  width={1000}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  className="sd-hero__3d-img"
                />
              </div>



            </div>
          </div>
        </section>

        {/* =========================== TECH STACK RIBBONS =========================== */}
        <TechStackRibbons />

        {/* ===================== PINNED: SYSTEM ASSEMBLES ===================== */}
        <section className="sd-scene" id="sd-scene" aria-label="How we build your software">
          <div className="sd-scene__bg" aria-hidden="true" />
          <div className="container sd-scene__grid">
            <div className="sd-scene__copy">
              <h2 className="sd-sr">How we build your software, step by step</h2>
              <div className="sd-steps">
                {SCENE.map((s) => (
                  <div className="sd-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="sd-sstep__list">
                      {s.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="sd-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="sd-scene__stage">
              <div className="sd-dia-wrap">
                <svg
                  className="sd-dia"
                  viewBox="0 0 640 400"
                  role="img"
                  aria-label="Architecture diagram: web, mobile, partner and staff clients connect through an API gateway to order, billing, inventory and alert modules, which store their data in a database and reports."
                >
                  <g fill="none">
                    {CLIENTS.map((c) => (
                      <path key={c.id} className="sd-link sd-link--c" d={`M144 ${c.y + 24} L196 ${c.y + 24}`} />
                    ))}
                    {MODULES.map((m) => (
                      <path key={m.id} className="sd-link sd-link--m" d={`M292 ${m.y + 24} L352 ${m.y + 24}`} />
                    ))}
                    {MODULES.map((m) => {
                      const cy = DATA[m.to].y + 32;
                      return <path key={m.id} className="sd-link sd-link--d" d={`M482 ${m.y + 24} C510 ${m.y + 24} 506 ${cy} 530 ${cy}`} />;
                    })}
                  </g>

                  <g className="sd-gw">
                    <rect className="sd-gw__r" x="196" y="30" width="96" height="340" rx="26" />
                    <text x="244" y="196">API</text>
                    <text x="244" y="216">gateway</text>
                  </g>

                  {CLIENTS.map((c) => (
                    <g className="sd-node sd-node--c" key={c.id}>
                      <rect className="sd-node__r" x="16" y={c.y} width="128" height="48" rx="14" />
                      <text x="80" y={c.y + 29}>{c.label}</text>
                    </g>
                  ))}
                  {MODULES.map((m) => (
                    <g className="sd-node sd-node--m" key={m.id}>
                      <rect className="sd-node__r" x="352" y={m.y} width="130" height="48" rx="14" />
                      <text x="417" y={m.y + 29}>{m.label}</text>
                    </g>
                  ))}
                  {DATA.map((d) => (
                    <g className="sd-node sd-node--d" key={d.id}>
                      <rect className="sd-node__r" x="530" y={d.y} width="96" height="64" rx="16" />
                      <text x="578" y={d.y + 37}>{d.label}</text>
                    </g>
                  ))}

                  {[0, 1, 2, 3].map((i) => (
                    <circle key={i} className="sd-packet" r="6" cx="-999" cy="-999" style={{ opacity: 0 }} />
                  ))}
                </svg>

                <div className="sd-tag sd-tag--1" aria-hidden="true">Who does what today?</div>
                <div className="sd-tag sd-tag--2" aria-hidden="true">One clear API contract</div>
                <div className="sd-tag sd-tag--3" aria-hidden="true">Tested every sprint</div>
                <div className="sd-tag sd-tag--4" aria-hidden="true">Live and monitored</div>
              </div>

              <div className="sd-code" aria-hidden="true">
                <div className="sd-code__bar"><span /><span /><span /><b>routes/api.php</b></div>
                <pre className="sd-code__body" />
              </div>

              <div className="sd-live" aria-hidden="true"><i />Live</div>
              <div className="sd-schip sd-schip--1" aria-hidden="true"><Check size={13} />Role-based access</div>
              <div className="sd-schip sd-schip--2" aria-hidden="true"><Check size={13} />Daily backups</div>
              <div className="sd-schip sd-schip--3" aria-hidden="true"><Check size={13} />Releases monitored</div>
            </div>
          </div>
        </section>

        {/* ===================== SERVICES: INDEX + PREVIEW ===================== */}
        <section className="sd-svc" id="sd-services" aria-labelledby="sd-svc-h">
          <div className="container">
            <Head eyebrow="What we build">
              <span id="sd-svc-h">Software for every stage of <em>your growth.</em></span>
            </Head>

            {/* stacked cards: phones, tablets and reduced motion */}
            <div className="sd-svc__stack">
              {SERVICES.map((s, i) => (
                <article className="sd-svcard" key={s.title}>
                  <div className="sd-svcard__media">
                    <span className="sd-svcard__no">0{i + 1}</span>
                    <Photo id={s.img} w={800} h={520} />
                  </div>
                  <div className="sd-svcard__body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul>{s.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>

            {/* pinned index + preview: desktop with motion */}
            <div className="sd-svc__pin">
              <ol className="sd-svc__list">
                {SERVICES.map((s, i) => (
                  <li key={s.title}>
                    <button type="button" className={`sd-svc__item${i === 0 ? " on" : ""}`}>
                      <i>0{i + 1}</i>
                      <span>{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="sd-svc__view">
                <div className="sd-svc__figs">
                  {SERVICES.map((s) => (
                    <figure className="sd-svc__fig" key={s.title}>
                      <Photo id={s.img} w={1100} h={720} />
                    </figure>
                  ))}
                </div>
                <div className="sd-svc__dets">
                  {SERVICES.map((s) => (
                    <div className="sd-svc__det" key={s.title}>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                      <ul>{s.chips.map((c) => <li className="sd-svc__chip" key={c}>{c}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sd-svc__meter" aria-hidden="true">
                <span className="sd-svc__count">01 / 06</span>
                <span className="sd-svc__bar"><i /></span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ STATEMENT ============================ */}
        <section className="sd-statement" aria-label="Our approach">
          <Photo className="sd-statement__img sd-statement__img--a" id="1553877522-43269d4ea984" w={500} h={680} />
          <Photo className="sd-statement__img sd-statement__img--b" id="1531297484001-80022131f5a1" w={500} h={680} />
          <div className="container">
            <p className="sd-statement__text"><StatementWords text={STATEMENT} /></p>
          </div>
        </section>

        {/* ============================== PROCESS ============================== */}
        <section className="sd-section sd-proc" id="sd-process">
          <div className="container sd-proc__grid">
            <aside className="sd-proc__aside">
              <Head eyebrow="How we deliver" lead="A transparent process with working software at every stage, so you are never waiting on a big reveal.">
                Five stages, <em>zero guesswork.</em>
              </Head>
              <div className="sd-proc__no" aria-hidden="true">
                <span>01</span>
                <small>/ 05</small>
              </div>
              <div className="sd-proc__media" aria-hidden="true">
                {PROCESS.map((p, i) => (
                  <Photo key={p.title} className={`sd-proc__img${i === 0 ? " on" : ""}`} id={p.img} w={800} h={600} />
                ))}
                <span className="sd-proc__chip">Discover</span>
              </div>
            </aside>

            <div className="sd-proc__list">
              <span className="sd-proc__rail" aria-hidden="true"><i /></span>
              <ol>
                {PROCESS.map((p, i) => (
                  <li className="sd-pstep on" key={p.title}>
                    <span className="sd-pstep__dot" aria-hidden="true">0{i + 1}</span>
                    <div className="sd-pstep__box">
                      <Photo className="sd-pstep__img" id={p.img} w={700} h={400} />
                      <div className="sd-pstep__head">
                        <h3>{p.title}</h3>
                        <span className="sd-pstep__when">{p.when}</span>
                      </div>
                      <p>{p.text}</p>
                      <ul>
                        {p.gets.map((g) => <li key={g}><Check aria-hidden="true" size={14} />{g}</li>)}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============================== STACK ============================== */}
        <section className="sd-stack" id="sd-stack" aria-labelledby="sd-stack-h">
          <div className="container sd-stack__grid">
            <div className="sd-stack__copy">
              <Head eyebrow="Under the hood" lead="Four layers, each chosen for its job, so your software stays fast, secure and easy to change.">
                <span id="sd-stack-h">The stack behind <em>every build.</em></span>
              </Head>
              <ol className="sd-stack__list">
                {LAYERS.map((l, i) => (
                  <li key={l.name} className={`sd-stack__item${i === 0 ? " on" : ""}`}>
                    <b>{l.name}</b>
                    <span>{l.sub}</span>
                  </li>
                ))}
              </ol>
              <div className="sd-stack__dets">
                {LAYERS.map((l) => (
                  <div className="sd-stack__det" key={l.name}>
                    <h3>{l.name}</h3>
                    <p>{l.text}</p>
                    <ul className="sd-stack__tech">
                      {l.tech.map((t) => (
                        <li key={t.name}>
                          <img src={t.icon} alt="" width={22} height={22} loading="lazy" decoding="async" />
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="sd-stack__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="sd-stack__stage" aria-hidden="true">
              <div className="sd-stack__rig">
                {LAYERS.map((l, i) => (
                  <div className="sd-layer" style={{ "--i": i } as CSSProperties} key={l.name}>
                    <span className="sd-layer__name">{l.name}</span>
                    <div className="sd-layer__chips">
                      {l.tech.map((t) => (
                        <span className="sd-layer__chip" key={t.name}>
                          <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ INDUSTRIES ============================ */}
        <section className="sd-section sd-industries">
          <div className="container">
            <Head
              center
              eyebrow="Who we build for"
              lead="We have built software for clinics, institutes, manufacturers and growing software companies, and we tailor each system to the people who use it every day."
            >
              Built around the <em>way your industry works</em>
            </Head>
            <div className="sd-ind-row">
              {INDUSTRIES.map((n, i) => (
                <article
                  className={`sd-ind${openInd === i ? " is-open" : ""}`}
                  key={n.name}
                  tabIndex={0}
                  onMouseEnter={() => setOpenInd(i)}
                  onFocus={() => setOpenInd(i)}
                  onClick={() => setOpenInd(i)}
                  data-reveal
                >
                  <Photo className="sd-ind__bg" id={n.img} w={900} h={900} />
                  <span className="sd-ind__vt" aria-hidden="true">{n.name}</span>
                  <div className="sd-ind__cap">
                    <h3>{n.name}</h3>
                    <p>{n.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ FAQ ================================ */}
        <section className="sd-section sd-faq" id="sd-faq" aria-labelledby="sd-faq-h">
          <div className="container sd-faq__grid">
            <div className="sd-faq__side">
              <Head eyebrow="Questions we hear often">
                <span id="sd-faq-h">Straight answers <em>before you commit.</em></span>
              </Head>
              <p className="sd-lead">Something not covered here? Tell us about your project and we will answer it on the call.</p>
              <Link className="sd-faq__link" to="/contact">
                <span>Ask our team</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="sd-faq__list">
              {FAQ.map((f, i) => (
                <FaqItem
                  key={f.q}
                  id={`sd-faq-${i}`}
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================== RELATED ============================== */}
        <section className="sd-section sd-related">
          <div className="container">
            <Head center eyebrow="Explore other services" lead="Good software works best with the right partners around it. See how these services fit alongside it.">
              Pair it with <em>what comes next</em>
            </Head>
            <div className="sd-rel-grid">
              {RELATED.map((r) => (
                <Link className="sd-rel" to={r.to} key={r.to} data-reveal>
                  <div className="sd-rel__media">
                    <Photo id={r.img} w={700} h={520} />
                  </div>
                  <div className="sd-rel__body">
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="sd-rel__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ CTA ================================ */}
        <section className="sd-cta-sec" id="sd-contact">
          <div className="container">
            <div className="sd-cta">
              <span className="sd-cta__mark" aria-hidden="true">{"{ }"}</span>
              <div className="sd-cta__inner">
              <div className="sd-cta__copy">
                <p className="eyebrow"><span />Start the conversation</p>
                <h2>Have a process that deserves <em>better software?</em></h2>
                <p>Tell us how the work runs today. We will come back with a plan, a timeline and an itemised quote.</p>
                <ul className="sd-cta__list">
                  {["Free discovery call", "Itemised quote, no surprises", "Source code handed over"].map((t) => (
                    <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="sd-cta__action">
                <Link className="sd-cta__btn sd-mag" to="/contact" data-cursor="START">
                  <span>Get a free software quote</span>
                  <ArrowUpRight aria-hidden="true" size={20} />
                </Link>
                <p>No obligation.</p>
              </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}