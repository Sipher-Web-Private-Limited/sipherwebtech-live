import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CreditCard,
  Database,
  FileCheck2,
  Gauge,
  Globe,
  KeyRound,
  Layers,
  Lock,
  MessageCircle,
  Plus,
  RotateCcw,
  ScrollText,
  Send,
  Server,
  ShieldCheck,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/api-integration.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Unsplash has no tech logos, so logos come from the Devicon CDN */
const dev = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
          <span className="ap-w">
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
    <div className={`ap-head${center ? " ap-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="ap-title">{children}</h2>
      {lead && <p className="ap-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const MARQUEE = [
  "REST APIs",
  "Webhooks",
  "OAuth 2.0",
  "Payment gateways",
  "CRM sync",
  "ERP and accounting",
  "WhatsApp messaging",
  "SMS and email",
  "Custom APIs",
  "Legacy systems",
  "Retries and alerts",
];

type NodeKey = "web" | "pay" | "crm" | "erp" | "msg";

/* x / y are percentages of the hero diagram, shared by the SVG lines, the packets and the node cards */
const NODES: { key: NodeKey; label: string; sub: string; x: number; y: number; depth: number; Icon: LucideIcon }[] = [
  { key: "web", label: "Website", sub: "Order placed", x: 50, y: 9, depth: 1.1, Icon: Globe },
  { key: "pay", label: "Payments", sub: "Charge captured", x: 87, y: 31, depth: 1.6, Icon: CreditCard },
  { key: "crm", label: "CRM", sub: "Customer created", x: 79, y: 85, depth: 1.2, Icon: Users },
  { key: "erp", label: "Accounts", sub: "Invoice posted", x: 21, y: 85, depth: 1.7, Icon: Database },
  { key: "msg", label: "WhatsApp", sub: "Receipt sent", x: 13, y: 31, depth: 1.3, Icon: MessageCircle },
];

const POS: Record<string, { x: number; y: number }> = {
  hub: { x: 50, y: 50 },
  ...Object.fromEntries(NODES.map((n) => [n.key, { x: n.x, y: n.y }])),
};

type ConsoleLine = { k: "cmd" | "ok" | "map" | "dim"; t: string };

const SCENE: { tag: string; title: string; em: string; text: string; details: string[]; log: ConsoleLine[] }[] = [
  {
    tag: "Receive",
    title: "One system says",
    em: "something happened.",
    text: "An order, a payment, a form submission. The other system sends a webhook the moment it happens, so nobody has to go looking for it.",
    details: ["Webhook endpoints that always answer fast", "Polling where a provider offers no webhooks", "Every request stored for later inspection"],
    log: [
      { k: "cmd", t: "POST /webhooks/orders" },
      { k: "dim", t: "x-signature: t=1760953200, v1=9f2c4e…" },
      { k: "dim", t: '{ "order": "ORD-20417", "amt": 149900, "cust_nm": "Aarav" }' },
    ],
  },
  {
    tag: "Verify",
    title: "Check who is really",
    em: "calling.",
    text: "Before anything touches your data we confirm the request is genuine, recent and not a repeat of one we already handled.",
    details: ["Signature and token checks", "Replay protection with a time window", "Idempotency keys so nothing runs twice"],
    log: [
      { k: "ok", t: "✓ signature matches (HMAC-SHA256)" },
      { k: "ok", t: "✓ sent 38 s ago, inside the 5 min window" },
      { k: "ok", t: "✓ new idempotency key, not processed before" },
    ],
  },
  {
    tag: "Map",
    title: "Translate it into the",
    em: "other system’s language.",
    text: "Every tool names things differently. We map fields, convert units and dates, and reject bad data before it spreads.",
    details: ["Field-by-field mapping you can read", "Currency, date and unit conversion", "Validation with clear error messages"],
    log: [
      { k: "map", t: "cust_nm  →  customer.name" },
      { k: "map", t: "amt      →  total  (paise to rupees)" },
      { k: "map", t: "order    →  reference" },
    ],
  },
  {
    tag: "Deliver",
    title: "Deliver it, and keep",
    em: "trying if it fails.",
    text: "The record reaches every system that needs it. If one is down, the call waits in a queue and retries instead of disappearing.",
    details: ["Retries with growing delays", "Alerts when something needs a person", "A log of every call, in plain language"],
    log: [
      { k: "ok", t: "CRM        201 Created" },
      { k: "ok", t: "Accounts   201 Created" },
      { k: "ok", t: "WhatsApp   202 Accepted" },
      { k: "dim", t: "logged · 412 ms · 0 retries" },
    ],
  },
];

const CATS: { key: string; title: string; sub: string; text: string; chips: string[]; img: string; Icon: LucideIcon }[] = [
  {
    key: "pay",
    title: "Payments",
    sub: "Gateways, UPI, refunds",
    text: "Take payments online, confirm them automatically, match settlements to orders and trigger refunds without leaving your own dashboard.",
    chips: ["Checkout and webhooks", "Refunds", "Settlement matching"],
    img: "1563013544-824ae1b704d3",
    Icon: CreditCard,
  },
  {
    key: "crm",
    title: "CRM and marketing",
    sub: "Leads, contacts, campaigns",
    text: "Every enquiry lands in the CRM with its source, owner and follow-up date, and campaign tools receive the right audience automatically.",
    chips: ["Lead capture", "Contact sync", "Email and SMS tools"],
    img: "1552664730-d307ca884978",
    Icon: Users,
  },
  {
    key: "erp",
    title: "ERP and accounting",
    sub: "Invoices, stock, ledgers",
    text: "Orders turn into invoices, stock stays current and finance stops reconciling spreadsheets by hand at month end.",
    chips: ["Invoices", "Inventory", "MIS reports"],
    img: "1460925895917-afdab827c52f",
    Icon: Database,
  },
  {
    key: "msg",
    title: "Messaging",
    sub: "WhatsApp, SMS, email",
    text: "Send confirmations, reminders and OTPs through provider APIs, with templates, opt-outs and delivery status tracked per message.",
    chips: ["WhatsApp", "SMS and OTP", "Email"],
    img: "1611162617213-7d7a39e9b1d7",
    Icon: MessageCircle,
  },
  {
    key: "ops",
    title: "Logistics and maps",
    sub: "Shipping, tracking, location",
    text: "Book shipments, fetch tracking and calculate distances, then show real status inside your own screens.",
    chips: ["Shipping rates", "Tracking", "Geocoding"],
    img: "1586528116311-ad8dd3c8310d",
    Icon: Truck,
  },
  {
    key: "api",
    title: "Custom and legacy",
    sub: "Your own API, older systems",
    text: "No API? We review database access, file exchange or a small middleware layer, or build a clean custom API for your software.",
    chips: ["Custom REST API", "Middleware", "File and database bridges"],
    img: "1544197150-b99a580bb7a8",
    Icon: Server,
  },
];

const FEATURES: { Icon: LucideIcon; title: string; text: string; code: string; wide?: boolean }[] = [
  {
    Icon: KeyRound,
    title: "Authentication that fits the provider",
    text: "API keys, OAuth 2.0 tokens or signed requests, whichever the other side expects, with token refresh handled for you.",
    code: "Authorization: Bearer ••••••••",
    wide: true,
  },
  {
    Icon: ShieldCheck,
    title: "Signed webhooks",
    text: "Every incoming call is verified before it is allowed near your data.",
    code: "HMAC-SHA256 ✓",
    wide: true,
  },
  { Icon: Lock, title: "Least access", text: "Each integration gets only the permissions its job needs.", code: "scope: orders.read" },
  { Icon: FileCheck2, title: "Data validation", text: "Bad or incomplete data is stopped at the door.", code: "amount > 0" },
  { Icon: KeyRound, title: "Secrets kept safe", text: "Credentials live in secure configuration, never in code.", code: ".env · vault" },
  { Icon: Gauge, title: "Rate-limit aware", text: "We respect provider limits and slow down before being blocked.", code: "429 → back off" },
  { Icon: ScrollText, title: "Logs you can read", text: "See what was sent, what came back and how long it took.", code: "412 ms · 201" },
  { Icon: Layers, title: "Versioned and documented", text: "Clear docs, so the next developer is not guessing.", code: "v2 · OpenAPI" },
];

const STAGES = [
  {
    title: "Discover and map",
    when: "Week 1",
    text: "We list every system involved, what each one knows and what has to move between them, then confirm API access, fees and limits with each provider.",
    gets: ["System and data-flow map", "Provider access and limits confirmed", "Itemised quote and timeline"],
    img: "1531403009284-440f080d1e12",
  },
  {
    title: "Design the data flow",
    when: "Week 2",
    text: "We decide what triggers each sync, how fields map, what happens on failure and who gets alerted, and write it down before building.",
    gets: ["Field mapping sheet", "Failure and retry rules", "Security and access plan"],
    img: "1558655146-9f40138edfeb",
  },
  {
    title: "Build and test in a sandbox",
    when: "Weeks 3 to 5",
    text: "Integrations are built against test accounts, then run against your real sample data, including the awkward cases.",
    gets: ["Working integration in staging", "Tests for errors and duplicates", "Code in a repository you own"],
    img: "1517694712202-14dd9538aa97",
  },
  {
    title: "Go live with monitoring",
    when: "Launch",
    text: "We switch over carefully, watch the first real traffic and leave dashboards and alerts in place for your team.",
    gets: ["Staged go-live", "Monitoring and alert rules", "Runbook for your team"],
    img: "1551288049-bebda4e38f71",
  },
  {
    title: "Support and keep up",
    when: "Ongoing",
    text: "Providers change their APIs. We track versions, fix breakages quickly and extend the integration as your business grows.",
    gets: ["Version and change tracking", "Fixes when providers update", "New integrations on request"],
    img: "1522071820081-009f0129c71c",
  },
];

type Tech = { name: string; icon: string };

const ROW_A: Tech[] = [
  { name: "PHP", icon: dev("php/php-original") },
  { name: "Laravel", icon: dev("laravel/laravel-original") },
  { name: "Node.js", icon: dev("nodejs/nodejs-original") },
  { name: "Python", icon: dev("python/python-original") },
  { name: "GraphQL", icon: dev("graphql/graphql-plain") },
  { name: "Postman", icon: dev("postman/postman-original") },
  { name: "OpenAPI", icon: dev("swagger/swagger-original") },
];

const ROW_B: Tech[] = [
  { name: "MySQL", icon: dev("mysql/mysql-original") },
  { name: "PostgreSQL", icon: dev("postgresql/postgresql-original") },
  { name: "Redis", icon: dev("redis/redis-original") },
  { name: "RabbitMQ", icon: dev("rabbitmq/rabbitmq-original") },
  { name: "Docker", icon: dev("docker/docker-original") },
  { name: "Azure", icon: dev("azure/azure-original") },
  { name: "GitHub Actions", icon: dev("githubactions/githubactions-original") },
];

const FAQ = [
  {
    q: "What is an API integration?",
    a: "An API integration connects two or more software systems so they can exchange data automatically. For example, an order placed on your website can create a customer in your CRM and an invoice in your accounts system without anyone retyping it.",
  },
  {
    q: "What is the difference between a webhook and polling?",
    a: "With a webhook, the other system sends your system a message when something happens. With polling, your system asks on a schedule whether anything changed. Webhooks are faster and lighter. Polling is simpler and works when webhooks are not offered.",
  },
  {
    q: "Can you integrate our payment gateway, CRM or ERP?",
    a: "Usually yes, where the provider offers a public API or an agreed way to exchange data. Availability, access approvals, fees and limits depend on the provider, and we confirm these during discovery.",
  },
  {
    q: "What if our software has no API?",
    a: "We review the options, which may include database-level access, file exchange or a small middleware layer, and recommend the safest route. In some cases building a custom API for the system is the better answer.",
  },
  {
    q: "How do you keep integrations secure?",
    a: "We use authentication such as API keys, OAuth tokens or signed webhooks, limit each integration to the access it needs, validate data, and keep credentials out of code. Security requirements specific to your industry are discussed up front.",
  },
  {
    q: "What happens when a provider changes its API or goes down?",
    a: "Failed calls are retried and logged, and alerts tell the right people. Providers do change their APIs, so we document versions and can arrange ongoing support to update integrations when that happens.",
  },
  {
    q: "How long does an integration take and what does it cost?",
    a: "Both depend on how many systems are involved, the quality of their APIs and the amount of custom logic. We give a project-specific estimate after discovery rather than a generic price.",
  },
];

const RELATED = [
  { to: "/services/ai-automation", title: "AI and automation", text: "Automate the work that happens between your systems.", img: "1518770660439-4636190af475" },
  { to: "/services/erp-crm", title: "ERP and CRM", text: "Core systems your integrations can rely on.", img: "1460925895917-afdab827c52f" },
  { to: "/services/software-development", title: "Custom software", text: "Portals and tools built around your workflow.", img: "1461749280684-dccba630e2f6" },
  { to: "/services/saas", title: "SaaS development", text: "Give your own product an API of its own.", img: "1555066931-4365d14bab8c" },
];

/* ------------------------------------------------------------------ */
/* FAQ row: height is animated with GSAP, hidden content leaves the     */
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
    gsap.to(el, {
      height: open ? "auto" : 0,
      autoAlpha: open ? 1 : 0,
      duration: reduced() ? 0 : 0.55,
      ease: "power3.inOut",
    });
  }, [open]);

  return (
    <div className={`ap-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="ap-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ApiIntegration() {
  const rootRef = useRef<HTMLDivElement>(null);
  const xpFirst = useRef(true);
  const relSeen = useRef(false);
  const relTl = useRef<gsap.core.Timeline | null>(null);
  const labTrigger = useRef<(() => void) | null>(null);

  const [openFaq, setOpenFaq] = useState(0);
  const [xp, setXp] = useState(0);
  const [scenario, setScenario] = useState<"short" | "long">("short");

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  };

  /* ================= EXPLORER: panels grow and shrink with GSAP ================= */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".ap-xp__item"));
    const calm = reduced();
    const first = xpFirst.current;
    xpFirst.current = false;

    items.forEach((el, i) => {
      const on = i === xp;
      const more = el.querySelector<HTMLElement>(".ap-xp__more");
      gsap.to(el, { "--g": on ? 4.6 : 1, duration: calm || first ? 0 : 0.85, ease: "power3.inOut", overwrite: true });
      if (more) {
        gsap.to(more, {
          autoAlpha: on ? 1 : 0,
          y: on ? 0 : 18,
          duration: calm || first ? 0 : on ? 0.5 : 0.25,
          delay: on && !calm && !first ? 0.3 : 0,
          ease: "power3.out",
          overwrite: true,
        });
      }
    });
  }, [xp]);

  /* ================= LAB: webhook (push) against polling (pull) ================= */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const calm = reduced();

    const ctx = gsap.context(() => {
      const q = (s: string) => root.querySelector<HTMLElement>(s) as HTMLElement;
      const pushPk = q(".ap-lab__pk--push");
      const pushOut = q(".ap-lab__out--push");
      const pullOut = q(".ap-lab__out--pull");
      const ping = q(".ap-lab__ping");
      const reply = q(".ap-lab__reply");
      const tick = q(".ap-lab__tick i");
      let pending: number | null = null;

      if (calm) {
        labTrigger.current = () => {
          pushOut.textContent = "Updated in under a second";
          pullOut.textContent = "Updated at the next check, up to 3 s later";
        };
        return;
      }

      labTrigger.current = () => {
        pushOut.textContent = "Sending…";
        gsap.fromTo(
          pushPk,
          { left: "0%", autoAlpha: 1 },
          {
            left: "100%",
            duration: 0.7,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
              pushOut.textContent = "Updated in 0.7 s";
              gsap.to(pushPk, { autoAlpha: 0, duration: 0.2 });
              gsap.fromTo(pushOut, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: "back.out(2.5)" });
            },
          }
        );
        if (pending === null) {
          pending = performance.now();
          pullOut.textContent = "Waiting for the next check…";
        }
      };

      /* polling heartbeat: ask, answer, wait, repeat */
      const loop = gsap.timeline({ paused: true, repeat: -1 });
      loop
        .fromTo(tick, { scaleX: 0 }, { scaleX: 1, duration: 3.2, ease: "none" }, 0)
        .call(() => { gsap.fromTo(ping, { left: "100%", autoAlpha: 1 }, { left: "0%", duration: 0.6, ease: "none", overwrite: true }); }, undefined, 0)
        .call(() => {
          const stamp = pending;
          reply.dataset.full = stamp !== null ? "1" : "0";
          gsap.fromTo(reply, { left: "0%", autoAlpha: 1 }, {
            left: "100%",
            duration: 0.6,
            ease: "none",
            overwrite: true,
            onComplete: () => {
              gsap.to([ping, reply], { autoAlpha: 0, duration: 0.15 });
              if (stamp !== null) {
                pullOut.textContent = `Updated after ${((performance.now() - stamp) / 1000).toFixed(1)} s`;
                gsap.fromTo(pullOut, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: "back.out(2.5)" });
                if (pending === stamp) pending = null;
              }
            },
          });
        }, undefined, 0.65);

      ScrollTrigger.create({
        trigger: root.querySelector(".ap-lab"),
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
    }, root);

    return () => {
      labTrigger.current = null;
      ctx.revert();
    };
  }, []);

  /* ================= RELIABILITY: failed calls retry with growing waits ================= */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const calm = reduced();

    const ctx = gsap.context(() => {
      const lane = root.querySelector<HTMLElement>(".ap-rel__lane");
      const end = root.querySelector<HTMLElement>(".ap-rel__end");
      if (!lane || !end) return;
      const tries = Array.from(lane.querySelectorAll<HTMLElement>(".ap-try"));
      const waits = Array.from(lane.querySelectorAll<HTMLElement>(".ap-wait"));
      const plan = scenario === "short" ? ["fail", "fail", "ok"] : ["fail", "fail", "fail", "fail"];
      const finalState = scenario === "short" ? "ok" : "hold";

      const set = (t: HTMLElement, state: string, label: string) => {
        t.dataset.state = state;
        const s = t.querySelector("small");
        if (s) s.textContent = label;
      };
      const label = (p: string) => (p === "ok" ? "200 OK" : "503 error");

      const reset = () => {
        tries.forEach((t, i) => (i < plan.length ? set(t, "idle", "waiting") : set(t, "skip", "not needed")));
        end.dataset.state = "idle";
        gsap.set(waits, { "--f": 0 });
      };

      if (calm) {
        reset();
        tries.forEach((t, i) => i < plan.length && set(t, plan[i], label(plan[i])));
        waits.forEach((w, i) => gsap.set(w, { "--f": i < plan.length - 1 ? 1 : 0 }));
        end.dataset.state = finalState;
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.call(reset, undefined, 0);
      let at = 0.3;
      plan.forEach((p, i) => {
        tl.call(() => set(tries[i], "run", "sending"), undefined, at)
          .call(() => set(tries[i], p, label(p)), undefined, at + 0.7)
          .fromTo(tries[i].querySelector(".ap-try__dot"), { scale: 1 }, { scale: 1.3, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, at + 0.7);
        at += 0.7;
        if (i < plan.length - 1) {
          const d = 0.55 + i * 0.3;
          tl.to(waits[i], { "--f": 1, duration: d, ease: "none" }, at + 0.1);
          at += d + 0.2;
        }
      });
      tl.call(() => { end.dataset.state = finalState; }, undefined, at + 0.1)
        .fromTo(end, { y: 10 }, { y: 0, duration: 0.45, ease: "power3.out" }, at + 0.1);

      relTl.current = tl;
      reset();

      if (relSeen.current) {
        tl.play(0);
      } else {
        ScrollTrigger.create({
          trigger: lane,
          start: "top 80%",
          once: true,
          onEnter: () => {
            relSeen.current = true;
            tl.play(0);
          },
        });
      }
    }, root);

    return () => {
      relTl.current = null;
      ctx.revert();
    };
  }, [scenario]);

  /* ================= MAIN: hero, scene, process, rails, reveals ================= */
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
          .from($(".ap-crumb, .ap-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
          .from($(".ap-hero__title .ap-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".ap-hero__lead, .ap-hero__cta > *, .ap-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
          .from(one(".ap-hub__core"), { scale: 0, duration: 1.1, ease: "back.out(1.6)", clearProps: "all" }, 0.25)
          .from($(".ap-node"), { scale: 0.4, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)", clearProps: "all" }, 0.5)
          .from(one(".ap-log"), { y: 30, autoAlpha: 0, duration: 0.8, clearProps: "all" }, 1.1);

        /* connection lines draw themselves */
        $<SVGLineElement>(".ap-hub__lines line").forEach((ln, i) => {
          const len = ln.getTotalLength();
          gsap.fromTo(
            ln,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1, delay: 0.5 + i * 0.1, ease: "power2.out", clearProps: "strokeDasharray,strokeDashoffset" }
          );
        });

        /* one order travels through the hub: website, payment, then CRM, accounts and WhatsApp */
        {
          const hero = one(".ap-hero");
          const pk = $<SVGCircleElement>(".ap-pkt");
          const logEl = one(".ap-log__body");
          const nodeEl = (k: string) => one(`[data-node="${k}"]`);
          const lines: string[] = [];
          const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4 });

          const say = (s: string, at: number) =>
            loop.call(() => {
              lines.push(s);
              if (lines.length > 4) lines.shift();
              logEl.textContent = lines.join("\n");
            }, undefined, at);

          const hop = (i: number, a: string, b: string, at: number, dur = 0.8) => {
            const A = POS[a];
            const B = POS[b];
            const p = { t: 0 };
            const c = pk[i];
            loop
              .set(c, { autoAlpha: 1 }, at)
              .fromTo(
                p,
                { t: 0 },
                {
                  t: 1,
                  duration: dur,
                  ease: "power2.inOut",
                  onUpdate: () => {
                    c.setAttribute("cx", String(A.x + (B.x - A.x) * p.t));
                    c.setAttribute("cy", String(A.y + (B.y - A.y) * p.t));
                  },
                },
                at
              )
              .set(c, { autoAlpha: 0 }, at + dur);
          };

          const hit = (k: string, at: number) =>
            loop
              .call(() => nodeEl(k).classList.add("is-hit"), undefined, at)
              .call(() => nodeEl(k).classList.remove("is-hit"), undefined, at + 0.7);

          loop.call(() => {
            lines.length = 0;
            logEl.textContent = "";
          }, undefined, 0);

          say("POST /orders            → 201", 0.15);
          hit("web", 0.1);
          hop(0, "web", "hub", 0.2);
          hop(0, "hub", "pay", 1.2);
          say("POST /charges           → 200", 1.2);
          hit("pay", 2.0);
          hop(1, "pay", "hub", 2.4);
          say("payment.captured     ← webhook", 3.2);
          hop(0, "hub", "crm", 3.5);
          hop(1, "hub", "erp", 3.5, 0.9);
          hop(2, "hub", "msg", 3.5, 0.9);
          say("PUT  /contacts/771      → 200", 4.4);
          say("POST /invoices          → 201", 4.5);
          say("POST /messages          → 202", 4.6);
          hit("crm", 4.3);
          hit("erp", 4.4);
          hit("msg", 4.4);
          loop.to({}, { duration: 0.01 }, 5.8);

          let started = false;
          const kick = gsap.delayedCall(2, () => {
            started = true;
            if (st.isActive) loop.play();
          });
          const st = ScrollTrigger.create({
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (!started) return;
              if (self.isActive) loop.play();
              else loop.pause();
            },
          });
          off.push(() => {
            kick.kill();
            loop.kill();
          });
        }

        /* the whole composition drifts slower than the page */
        gsap.to(one(".ap-hero__visual"), {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: one(".ap-hero"), start: "top top", end: "bottom top", scrub: true },
        });

        if (fine) {
          /* each node follows the pointer at its own depth */
          const hero = one(".ap-hero");
          const layers = $(".ap-node__in").map((el) => ({
            qx: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            qy: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            d: Number(el.dataset.depth || 1),
          }));
          const mv = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.qx(nx * 30 * l.d);
              l.qy(ny * 22 * l.d);
            });
          };
          hero.addEventListener("pointermove", mv);
          off.push(() => hero.removeEventListener("pointermove", mv));

          /* magnetic buttons */
          $(".ap-mag").forEach((b) => {
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

          /* feature tiles: a soft spotlight follows the cursor */
          const grid = one(".ap-feat-grid");
          const tiles = $(".ap-feat");
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

        /* ================= MARQUEE: speeds up with the scroll ================= */
        {
          const mq = gsap.to(one(".ap-marquee__track"), { xPercent: -50, repeat: -1, duration: 32, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
            },
          });
        }

        /* ================= SCENE: one request, four stations ================= */
        {
          const section = one(".ap-scene");
          const steps = $(".ap-sstep");
          const groups = $(".ap-cg");
          const allLines = $(".ap-cl");
          const stations = $(".ap-rail li");
          const fill = one(".ap-rail__fill");
          const counter = one(".ap-scene__count");
          const consoleEl = one(".ap-console");
          const chips = $(".ap-schip");

          if (wide) {
            fitHeight(one(".ap-steps"), steps);

            gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
            gsap.set(allLines, { autoAlpha: 0, x: -14 });
            gsap.set(consoleEl, { y: 50, autoAlpha: 0 });
            gsap.set(chips, { autoAlpha: 0, scale: 0.7 });
            gsap.set(fill, { scaleX: 0 });
            gsap.set($(".ap-cg__tag"), { autoAlpha: 0 });

            let cur = -1;
            const show = (i: number) => {
              if (i === cur) return;
              cur = i;
              stations.forEach((s, k) => {
                s.classList.toggle("on", k <= i);
                s.classList.toggle("cur", k === i);
              });
              counter.textContent = `0${i + 1} / 04`;
            };
            show(0);

            const U = 2.4;
            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=380%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => show(Math.min(3, Math.floor(self.progress * 4 + 0.08))),
              },
            });

            tl.to(consoleEl, { y: 0, autoAlpha: 1, duration: 0.9 }, 0);

            groups.forEach((g, s) => {
              const at = s * U + (s === 0 ? 0.7 : 0.35);
              tl.to($(".ap-cg__tag", g), { autoAlpha: 1, duration: 0.3 }, at - 0.1)
                .to($(".ap-cl", g), { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.18 }, at)
                .to(fill, { scaleX: s / 3, duration: 1.1, ease: "none" }, s * U + 0.2);

              if (s < 3) {
                const sw = (s + 1) * U - 0.5;
                tl.to(steps[s], { autoAlpha: 0, y: -24, duration: 0.35 }, sw)
                  .fromTo(steps[s + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, sw + 0.35);
              }
            });

            tl.to(chips[0], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, U + 0.9)
              .to(chips[1], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, U * 2 + 0.9)
              .to(chips[2], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, U * 3 + 0.9)
              .to({}, { duration: 0.01 }, U * 4);
          } else {
            /* small screens: the log types itself out once, when it scrolls into view */
            gsap.set(allLines, { autoAlpha: 0, x: -14 });
            stations.forEach((s) => s.classList.add("on"));
            gsap.set(fill, { scaleX: 1 });
            ScrollTrigger.create({
              trigger: consoleEl,
              start: "top 80%",
              once: true,
              onEnter: () => {
                gsap.to(allLines, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" });
              },
            });
          }
        }

        /* ================= LAB / EXPLORER: light entrance ================= */
        gsap.from(one(".ap-xp"), {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: one(".ap-xp"), start: "top 85%", once: true },
        });

        /* ================= PROCESS: a line fills as you scroll, photos unmask ================= */
        {
          const tl = one(".ap-tl");
          gsap.fromTo(
            one(".ap-tl__fill"),
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 55%", end: "bottom 55%", scrub: true } }
          );

          $(".ap-tstep").forEach((st, i) => {
            ScrollTrigger.create({ trigger: st, start: "top 58%", end: "bottom 58%", toggleClass: { targets: st, className: "is-on" } });

            const frame = one(".ap-tstep__img", st);
            const img = one("img", frame);
            gsap.fromTo(
              frame,
              { clipPath: "inset(0 0 100% 0)" },
              { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: st, start: "top 78%", once: true } }
            );
            gsap.fromTo(
              img,
              { yPercent: -5, scale: 1.14 },
              { yPercent: 5, scale: 1.14, ease: "none", scrollTrigger: { trigger: st, start: "top bottom", end: "bottom top", scrub: true } }
            );
            gsap.from(one(".ap-tstep__copy", st), {
              x: wide ? (i % 2 ? 40 : -40) : 0,
              y: wide ? 0 : 28,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: { trigger: st, start: "top 78%", once: true },
            });
          });
        }

        /* ================= TECH: two rails slide in opposite directions ================= */
        {
          const tech = one(".ap-tech");
          gsap.fromTo(one(".ap-tech__a"), { xPercent: 0 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: tech, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(one(".ap-tech__b"), { xPercent: -22 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: tech, start: "top bottom", end: "bottom top", scrub: true } });
        }

        /* ================= CTA settles in ================= */
        gsap.from(one(".ap-cta"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: one(".ap-cta"), start: "top 95%", end: "top 50%", scrub: true },
        });
        gsap.fromTo(
          one(".ap-cta__photo img"),
          { yPercent: -6, scale: 1.14 },
          { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: one(".ap-cta"), start: "top bottom", end: "bottom top", scrub: true } }
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
        title="API Integration Services in Indore | Sipher Webtech"
        description="Sipher Webtech connects payment gateways, CRM, ERP and SaaS tools through secure, monitored REST API and webhook integrations, and builds custom APIs where none exist. Get a free consultation."
      />

      <div className="ap" ref={rootRef}>
        {/* ============================ HERO ============================ */}
        <section className="ap-hero" aria-labelledby="ap-h1">
          <div className="container ap-hero__grid">
            <div className="ap-hero__copy">
              <nav className="ap-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">API Integration</span>
              </nav>

              <p className="eyebrow"><span />API Integration</p>
              <h1 id="ap-h1" className="ap-hero__title" aria-label="Your systems, talking to each other, so nobody retypes.">
                <span className="ap-line" aria-hidden="true"><Words text="Your systems," /></span>
                <span className="ap-line" aria-hidden="true"><Words text="talking to each other," /></span>
                <em className="ap-line" aria-hidden="true"><Words text="so nobody retypes." /></em>
              </h1>
              <p className="ap-hero__lead">
                We connect your payment gateway, CRM, ERP and messaging tools through secure, monitored APIs and
                webhooks, and build a custom API where none exists.
              </p>
              <div className="ap-hero__cta">
                <Link className="button button--primary ap-mag ap-hero__main" to="/contact" data-cursor="START">
                  <span>Plan an integration</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="ap-ghost ap-mag" onClick={() => jump("ap-scene")}>
                  Follow one order
                </button>
              </div>
              <ul className="ap-hero__trust">
                {["REST APIs and webhooks", "Retries and alerts built in", "Documented and versioned", "Secrets kept out of code"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="ap-hero__right">
              <div className="ap-hero__visual" aria-hidden="true">
                <svg className="ap-hub__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <g className="ap-hub__lines">
                    {NODES.map((n) => (
                      <line key={n.key} x1={50} y1={50} x2={n.x} y2={n.y} />
                    ))}
                  </g>
                  {[0, 1, 2].map((i) => (
                    <circle key={i} className="ap-pkt" r={1.8} cx={50} cy={50} />
                  ))}
                </svg>

                <div className="ap-hub__core"><b>Your<br />business</b></div>

                {NODES.map(({ key, label, sub, x, y, depth, Icon }) => (
                  <div className="ap-node" key={key} data-node={key} style={{ left: `${x}%`, top: `${y}%` }}>
                    <div className="ap-node__in" data-depth={depth}>
                      <span className="ap-node__icon"><Icon size={16} /></span>
                      <span className="ap-node__txt"><b>{label}</b><small>{sub}</small></span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ap-log" aria-hidden="true">
                <div className="ap-log__bar"><i />order-sync · live</div>
                <pre className="ap-log__body">{"POST /orders            → 201\nPOST /charges           → 200"}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="ap-marquee" aria-hidden="true">
          <div className="ap-marquee__track">
            {[0, 1].map((g) => (
              <div className="ap-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ===================== PINNED: ONE REQUEST ===================== */}
        <section className="ap-scene" id="ap-scene" aria-label="How one request travels through an integration">
          <div className="ap-scene__bg" aria-hidden="true" />
          <div className="container ap-scene__grid">
            <div className="ap-scene__copy">
              <h2 className="ap-sr">Follow one order through an integration, step by step</h2>
              <div className="ap-steps">
                {SCENE.map((s) => (
                  <div className="ap-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="ap-sstep__list">
                      {s.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="ap-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="ap-scene__stage">
              <ol className="ap-rail" aria-hidden="true">
                {SCENE.map((s, i) => (
                  <li key={s.tag}><i>{i + 1}</i><span>{s.tag}</span></li>
                ))}
                <span className="ap-rail__line"><i className="ap-rail__fill" /></span>
              </ol>

              <div className="ap-console">
                <div className="ap-console__bar"><i /><i /><i /><span>orders-sync · request log</span></div>
                <div className="ap-console__body">
                  {SCENE.map((s) => (
                    <div className="ap-cg" key={s.tag}>
                      <span className="ap-cg__tag">{s.tag}</span>
                      {s.log.map((l) => (
                        <code className={`ap-cl ap-cl--${l.k}`} key={l.t}>{l.t}</code>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="ap-schip ap-schip--a" aria-hidden="true"><Check size={13} />Signed and verified</div>
              <div className="ap-schip ap-schip--b" aria-hidden="true"><Check size={13} />Fields mapped</div>
              <div className="ap-schip ap-schip--c" aria-hidden="true"><Check size={13} />3 systems updated</div>
            </div>
          </div>
        </section>

        {/* ============================ EXPLORER ============================ */}
        <section className="ap-section ap-explore" aria-labelledby="ap-xp-h">
          <div className="container">
            <Head eyebrow="What we connect" lead="Pick a category to see what usually moves between the systems, and what we build around it.">
              <span id="ap-xp-h">Six kinds of integration, <em>one careful approach.</em></span>
            </Head>

            <div className="ap-xp">
              {CATS.map(({ key, title, sub, text, chips, img, Icon }, i) => {
                const on = xp === i;
                return (
                  <article className={`ap-xp__item${on ? " on" : ""}`} key={key}>
                    <Photo className="ap-xp__bg" id={img} w={900} h={900} />
                    <button type="button" className="ap-xp__btn" aria-expanded={on} onClick={() => setXp(i)}>
                      <span className="ap-xp__icon"><Icon aria-hidden="true" size={22} /></span>
                      <span className="ap-xp__name"><b>{title}</b><small>{sub}</small></span>
                    </button>
                    <div className="ap-xp__more">
                      <p>{text}</p>
                      <ul>{chips.map((c) => <li key={c}>{c}</li>)}</ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================== LAB ============================== */}
        <section className="ap-section ap-labsec" aria-labelledby="ap-lab-h">
          <div className="container ap-lab">
            <div className="ap-lab__copy">
              <Head eyebrow="Webhook or polling?" lead="Both move data between systems. Trigger an event and see how differently they behave.">
                <span id="ap-lab-h">Told at once, or <em>found later?</em></span>
              </Head>
              <button type="button" className="button button--primary ap-lab__btn" onClick={() => labTrigger.current?.()}>
                <Send aria-hidden="true" size={17} />
                <span>Trigger an event</span>
              </button>
              <p className="ap-lab__note">
                We use webhooks wherever a provider offers them, and add a scheduled check as a safety net so a missed message never goes unnoticed.
              </p>
            </div>

            <div className="ap-lab__card">
              <div className="ap-lane">
                <header><b>Webhook</b><span>They tell us the moment it happens</span></header>
                <div className="ap-lab__track">
                  <span className="ap-lab__end">Their system</span>
                  <div className="ap-lab__path"><i className="ap-lab__pk ap-lab__pk--push" /></div>
                  <span className="ap-lab__end">Your system</span>
                </div>
                <p className="ap-lab__out ap-lab__out--push" aria-live="polite">Idle. Trigger an event to try it.</p>
              </div>

              <div className="ap-lane">
                <header><b>Polling</b><span>We ask on a schedule, every 3 seconds here</span></header>
                <div className="ap-lab__tick" aria-hidden="true"><i /></div>
                <div className="ap-lab__track">
                  <span className="ap-lab__end">Their system</span>
                  <div className="ap-lab__path">
                    <i className="ap-lab__ping" />
                    <i className="ap-lab__reply" data-full="0" />
                  </div>
                  <span className="ap-lab__end">Your system</span>
                </div>
                <p className="ap-lab__out ap-lab__out--pull" aria-live="polite">Idle. Trigger an event to try it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================== RELIABILITY ========================== */}
        <section className="ap-section ap-relsec" aria-labelledby="ap-rel-h">
          <div className="container">
            <Head center eyebrow="When something goes wrong" lead="Providers go down and networks drop. An integration should expect that, wait politely and try again.">
              <span id="ap-rel-h">Failed calls are <em>queued, not lost.</em></span>
            </Head>

            <div className="ap-rel">
              <div className="ap-rel__top">
                <div className="ap-seg" role="group" aria-label="Outage length">
                  <button type="button" aria-pressed={scenario === "short"} onClick={() => setScenario("short")}>Short outage</button>
                  <button type="button" aria-pressed={scenario === "long"} onClick={() => setScenario("long")}>Long outage</button>
                </div>
                <button type="button" className="ap-ghost ap-rel__replay" onClick={() => relTl.current?.restart()}>
                  <RotateCcw aria-hidden="true" size={15} />
                  <span>Replay</span>
                </button>
              </div>

              <div className="ap-rel__lane">
                {[0, 1, 2, 3].map((i) => (
                  <div className="ap-rel__seg" key={i}>
                    <div className="ap-try" data-state="idle">
                      <span className="ap-try__dot" />
                      <b>Try {i + 1}</b>
                      <small>waiting</small>
                    </div>
                    {i < 3 && (
                      <div className="ap-wait">
                        <span><i /></span>
                        <small>wait {2 ** i} s</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="ap-rel__end" data-state="idle" aria-live="polite">
                <b>{scenario === "short" ? "Delivered on the third try." : "Held safely in the queue."}</b>
                <p>
                  {scenario === "short"
                    ? "Nothing was lost and nothing ran twice, because every retry carries the same idempotency key."
                    : "Your team is alerted, and the queued calls replay in order once the provider is back."}
                </p>
              </div>

              <ul className="ap-rel__facts">
                <li><Zap aria-hidden="true" size={18} /><span><b>Retries with growing waits</b>Short gaps first, longer ones after, so we never hammer a struggling provider.</span></li>
                <li><ShieldCheck aria-hidden="true" size={18} /><span><b>Safe to repeat</b>Idempotency keys stop a retried payment or invoice from being created twice.</span></li>
                <li><ScrollText aria-hidden="true" size={18} /><span><b>Alerts that reach people</b>When a call needs a person, the right team hears about it with the details.</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============================ FEATURES ============================ */}
        <section className="ap-section ap-feats" aria-labelledby="ap-feat-h">
          <div className="container">
            <Head eyebrow="Built into every integration" lead="The unglamorous details that keep your data safe and your integrations dependable.">
              <span id="ap-feat-h">Security and care, <em>by default.</em></span>
            </Head>
            <div className="ap-feat-grid">
              {FEATURES.map(({ Icon, title, text, code, wide }) => (
                <article className={`ap-feat${wide ? " ap-feat--wide" : ""}`} key={title} data-reveal>
                  <span className="ap-feat__icon"><Icon aria-hidden="true" size={22} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <code className="ap-feat__code">{code}</code>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== PROCESS ============================== */}
        <section className="ap-section ap-proc" id="ap-process" aria-labelledby="ap-proc-h">
          <div className="container">
            <Head center eyebrow="How we work" lead="A clear path, with a working integration you can inspect at every stage.">
              <span id="ap-proc-h">From a list of systems to <em>a connected business.</em></span>
            </Head>

            <div className="ap-tl">
              <div className="ap-tl__line" aria-hidden="true"><i className="ap-tl__fill" /></div>
              {STAGES.map((s) => (
                <article className="ap-tstep" key={s.title}>
                  <span className="ap-tstep__node" aria-hidden="true" />
                  <div className="ap-tstep__copy">
                    <div className="ap-tstep__head">
                      <h3>{s.title}</h3>
                      <span className="ap-tstep__when">{s.when}</span>
                    </div>
                    <p>{s.text}</p>
                    <ul>
                      {s.gets.map((g) => <li key={g}><Check aria-hidden="true" size={14} />{g}</li>)}
                    </ul>
                  </div>
                  <div className="ap-tstep__img">
                    <Photo id={s.img} w={900} h={675} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== TECH ============================== */}
        <section className="ap-tech" aria-labelledby="ap-tech-h">
          <div className="container">
            <Head center eyebrow="Our toolkit" lead="Proven tools for building, testing and running the connections between your systems.">
              <span id="ap-tech-h">What we build integrations <em>with.</em></span>
            </Head>
          </div>
          <div className="ap-tech__rows" aria-hidden="true">
            <div className="ap-tech__a ap-tech__row">
              {[...ROW_A, ...ROW_A, ...ROW_A].map((t, i) => (
                <span className="ap-tech__pill" key={`${t.name}-${i}`}>
                  <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                  {t.name}
                </span>
              ))}
            </div>
            <div className="ap-tech__b ap-tech__row">
              {[...ROW_B, ...ROW_B, ...ROW_B].map((t, i) => (
                <span className="ap-tech__pill" key={`${t.name}-${i}`}>
                  <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          <p className="ap-sr">
            Build: {ROW_A.map((t) => t.name).join(", ")}. Data and delivery: {ROW_B.map((t) => t.name).join(", ")}.
          </p>
        </section>

        {/* ================================ FAQ ================================ */}
        <section className="ap-section ap-faq" id="ap-faq" aria-labelledby="ap-faq-h">
          <div className="container ap-faq__grid">
            <div className="ap-faq__side">
              <Head eyebrow="Questions we hear often">
                <span id="ap-faq-h">Straight answers <em>before you commit.</em></span>
              </Head>
              <p className="ap-lead">Something not covered here? Tell us which systems you want to connect and we will answer it on the call.</p>
              <Link className="ap-faq__link" to="/contact">
                <span>Ask our team</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="ap-faq__list">
              {FAQ.map((f, i) => (
                <FaqItem
                  key={f.q}
                  id={`ap-faq-${i}`}
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
        <section className="ap-section ap-related">
          <div className="container">
            <Head center eyebrow="Explore other services" lead="Integrations work best with solid systems on both ends. See how these services fit alongside them.">
              Pair it with <em>what comes next</em>
            </Head>
            <div className="ap-rel-grid">
              {RELATED.map((r) => (
                <Link className="ap-relcard" to={r.to} key={r.to} data-reveal>
                  <div className="ap-relcard__media">
                    <Photo id={r.img} w={700} h={520} />
                  </div>
                  <div className="ap-relcard__body">
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="ap-relcard__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ CTA ================================ */}
        <section className="ap-cta-sec" id="ap-contact">
          <div className="container">
            <div className="ap-cta">
              <div className="ap-cta__inner">
                <div className="ap-cta__copy">
                  <p className="eyebrow"><span />Start the conversation</p>
                  <h2>Which two systems should <em>start talking first?</em></h2>
                  <p>Tell us what you use today and what keeps getting retyped. We will come back with a plan, a timeline and an itemised quote.</p>
                  <ul className="ap-cta__list">
                    {["Free discovery call", "Provider limits checked early", "Estimate specific to your project"].map((t) => (
                      <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                    ))}
                  </ul>
                  <div className="ap-cta__action">
                    <Link className="ap-cta__btn ap-mag" to="/contact" data-cursor="START">
                      <span>Get an integration estimate</span>
                      <ArrowUpRight aria-hidden="true" size={20} />
                    </Link>
                    <p>No obligation.</p>
                  </div>
                </div>

                <div className="ap-cta__stage" aria-hidden="true">
                  <div className="ap-cta__photo">
                    <Photo id="1552664730-d307ca884978" w={800} h={1000} />
                  </div>
                  <div className="ap-cta__chip ap-cta__chip--a"><i />GET /estimate → 200</div>
                  <div className="ap-cta__chip ap-cta__chip--b"><i />systems connected: 3</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}