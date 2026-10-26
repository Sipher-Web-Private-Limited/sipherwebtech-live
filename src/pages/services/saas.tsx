import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Check,
  ChevronRight,
  Cloud,
  CreditCard,
  Database,
  Globe,
  LayoutDashboard,
  Lock,
  Minus,
  Plus,
  Rocket,
  Server,
  ShieldCheck,
  Terminal,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/saas.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const BRAND = "Sipher Webtech"; // change in one place if the public brand name differs
const SITE = "https://sipherweb.in";

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

const calm = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const YELLOW = "#ffe401";
const SLAB_OFF = "rgba(255,255,255,0.05)";
const SLAB_ON = "rgba(255,228,1,0.17)";
const EDGE_OFF = "rgba(255,255,255,0.22)";

/* hides itself if an id ever 404s, so a layout never shows a broken-image icon */
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

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="sx-w">
            <span>{w}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

function LitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="sx-lit__w">
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
  light,
}: {
  eyebrow: string;
  children: ReactNode;
  lead?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`sx-head${center ? " sx-head--center" : ""}${light ? " sx-head--light" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="sx-title">{children}</h2>
      {lead && <p className="sx-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const TICKER = [
  "SaaS MVPs",
  "Multi-tenant apps",
  "Subscription billing",
  "Teams & roles",
  "Admin panels",
  "Public APIs",
  "Analytics dashboards",
  "Cloud & DevOps",
];

const TENANTS = [
  { name: "Tenant A", plan: "Pro plan", users: 48, projects: 12, usage: 72, bars: [38, 52, 44, 66, 58, 80, 72], feed: ["Plan upgraded to Pro", "Teammate invited", "API key created"] },
  { name: "Tenant B", plan: "Trial", users: 6, projects: 3, usage: 91, bars: [20, 26, 34, 30, 44, 52, 60], feed: ["Trial day 12 of 14", "Usage limit at 91%", "Upgrade prompt shown"] },
  { name: "Tenant C", plan: "Team plan", users: 214, projects: 58, usage: 38, bars: [60, 64, 70, 66, 78, 84, 90], feed: ["Invoice paid", "Webhook delivered", "Role updated"] },
];

const LAYERS = [
  {
    icon: LayoutDashboard,
    title: "Web app & dashboard",
    tag: "Dashboard · settings · teams",
    h: "Where customers",
    em: "spend their day.",
    text: "The interface customers use every day, designed so new users reach value quickly.",
    points: ["Onboarding that guides first-time users", "Responsive on laptop, tablet and phone", "Settings, teams and notifications in one place"],
  },
  {
    icon: Boxes,
    title: "Backend & tenancy",
    tag: "Plans · limits · logic",
    h: "One platform,",
    em: "many customers.",
    text: "Business logic that serves many customers from a single platform, with each plan's rules applied in one place.",
    points: ["Plan rules and usage limits in one place", "One codebase serving every tenant", "APIs the interface and partners share"],
  },
  {
    icon: Database,
    title: "Database & data isolation",
    tag: "Tenants · records · backups",
    h: "Every tenant's data,",
    em: "kept apart.",
    text: "Storage designed so each customer's data stays separate, and so changes never put live data at risk.",
    points: ["Each tenant's records kept separate", "Migrations planned around live data", "Backups with a tested recovery path"],
  },
  {
    icon: CreditCard,
    title: "Billing & integrations",
    tag: "Plans · invoices · webhooks",
    h: "Plans, payments",
    em: "and partners.",
    text: "Subscriptions, payments, email and public APIs that let customers and partners connect to your product.",
    points: ["Plans, trials, upgrades and invoices", "Established payment gateways", "Webhooks and public APIs"],
  },
  {
    icon: ShieldCheck,
    title: "Security & access",
    tag: "Login · roles · audit",
    h: "Access that",
    em: "stays closed.",
    text: "Authentication, roles, validation and secure configuration, so people see only what they should.",
    points: ["Authentication and role-based permissions", "Input validation and clear error handling", "Secrets kept out of the code"],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    tag: "Releases · logs · scaling",
    h: "Shipping, watching",
    em: "and scaling.",
    text: "Hosting, deployments, monitoring and scaling that keep the product running as usage grows.",
    points: ["Automated deployments with rollback", "Logs, uptime checks and alerts", "Capacity that grows with your users"],
  },
];

const SERVICES = [
  { title: "SaaS MVP development", text: "A focused first version to test the idea with real users.", img: "1522071820081-009f0129c71c" },
  { title: "Multi-tenant architecture", text: "One platform serving many customers, with their data kept separate.", img: "1544197150-b99a580bb7a8" },
  { title: "Subscription & billing", text: "Plans, trials, upgrades and payment gateway integration.", img: "1563013544-824ae1b704d3" },
  { title: "Accounts, teams & roles", text: "Sign-up, invites, roles and permissions for each customer.", img: "1519389950473-47ba0277781c" },
  { title: "Admin & super-admin panels", text: "Manage customers, plans, usage and support from one panel.", img: "1551288049-bebda4e38f71" },
  { title: "Public APIs & webhooks", text: "Let customers and partners connect to your product.", img: "1555066931-4365d14bab8c" },
  { title: "Analytics & usage tracking", text: "See sign-ups, activity and feature usage.", img: "1460925895917-afdab827c52f" },
  { title: "Third-party integrations", text: "Payments, email, messaging, maps and other services.", img: "1518770660439-4636190af475" },
  { title: "Cloud hosting & scaling", text: "Deployment, monitoring and capacity that grows with users.", img: "1451187580459-43490279c0fa" },
  { title: "Upgrades & maintenance", text: "Take an existing product forward without starting over.", img: "1461749280684-dccba630e2f6" },
];

type Vis = "scope" | "wire" | "code" | "deploy" | "growth";

const PHASES: { title: string; when: string; text: string; gets: string[]; vis: Vis }[] = [
  {
    title: "Validate",
    when: "Idea, users, MVP scope",
    text: "We define the customer, the problem, the plans you will sell and the smallest version worth launching.",
    gets: ["Customer and problem brief", "Plan and pricing hypotheses", "MVP scope agreed in writing"],
    vis: "scope",
  },
  {
    title: "Design",
    when: "Plans, tenancy, data, UX",
    text: "Tenancy, plan and pricing logic, the data model, user journeys and the interface are planned before code starts.",
    gets: ["Tenancy and data model", "Clickable prototype", "Plan and limit rules"],
    vis: "wire",
  },
  {
    title: "Build",
    when: "Core product, billing, APIs",
    text: "Sign-up, teams, billing, the admin panel, APIs and integrations are developed and tested in working increments.",
    gets: ["Sign-up, teams and roles", "Billing and admin panel", "APIs and integrations"],
    vis: "code",
  },
  {
    title: "Test & launch",
    when: "Security, load, go-live",
    text: "We deploy to the cloud, set up monitoring and backups, and go live with a rollback plan ready.",
    gets: ["Tenant isolation and billing tests", "Staging first, then monitored go-live", "Backups and alerts switched on"],
    vis: "deploy",
  },
  {
    title: "Iterate & scale",
    when: "Metrics, features, scaling",
    text: "The product improves from real usage data: what people use, where they stall and what to build next.",
    gets: ["Usage analytics reviewed", "Roadmap from real feedback", "Scaling as demand grows"],
    vis: "growth",
  },
];

const PLANS = [
  { name: "Free", price: 0, seats: 2, projects: 3, feats: [false, false, false, false] },
  { name: "Pro", price: 999, seats: 10, projects: 25, feats: [true, true, true, false] },
  { name: "Team", price: 2999, seats: 50, projects: 100, feats: [true, true, true, true] },
];
const FEATS = ["Usage analytics", "Roles & permissions", "API access", "Webhooks & audit log"];

const TECH = [
  { group: "Interface", items: ["React", "Next.js", "TypeScript"] },
  { group: "Backend", items: ["Node.js", "Python & Django", "Laravel", "REST APIs", "Billing gateways"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "Redis"] },
  { group: "Ship & run", items: ["Docker", "GitHub Actions", "CI/CD", "Azure", "Cloud hosting", "Monitoring & logging"] },
];

const WHY = [
  { icon: Rocket, title: "Starts with an MVP", text: "Launch the smallest useful version first, then grow from real feedback instead of guesses.", cls: "sx-bcard--a" },
  { icon: Boxes, title: "Built for many customers", text: "Multi-tenant design so one platform serves many accounts.", cls: "sx-bcard--b" },
  { icon: Lock, title: "Secure tenancy & access", text: "Data separation between customers, plus authentication and role-based access.", cls: "sx-bcard--c" },
  { icon: CreditCard, title: "Plans & billing ready", text: "Subscription logic and payment gateway integration, designed together with your pricing model so upgrades, limits and renewals behave the way you expect.", cls: "sx-bcard--d" },
  { icon: Terminal, title: "DevOps & release pipeline", text: "Automated deployments, monitoring and backups.", cls: "sx-bcard--e" },
  { icon: Users, title: "Support after launch", text: "Maintenance and roadmap work under the agreed arrangement.", cls: "sx-bcard--f" },
];

const BA_ROWS = [
  { b: ["Customer A", "Pro", "yes?", "#N/A", "on"], a: ["Customer A", "Pro", "Paid", "Auto-renews", "Active"] },
  { b: ["Customer B", "Basic", "paid?", "1 May?", "off?"], a: ["Customer B", "Basic", "Paid", "Auto-renews", "Active"] },
  { b: ["Customer C", "Pro", "yes", "#REF!", "on"], a: ["Customer C", "Pro", "Paid", "Auto-renews", "Active"] },
  { b: ["Customer D", "Pro", "yes?", "expired", "on"], a: ["Customer D", "Pro", "Retry set", "Grace period", "Limited"] },
];

const INDUSTRIES = [
  { title: "EdTech platforms", text: "Courses, cohorts and learner progress for institutes and creators.", img: "1503676260728-1c00da094a0b" },
  { title: "HealthTech tools", text: "Appointments, records and follow-ups, built with care for sensitive data.", img: "1576091160399-112ba8d25d1d" },
  { title: "FinTech & accounting tools", text: "Invoices, reconciliation and reporting for teams and firms.", img: "1554224155-6726b3ff858f" },
  { title: "HR & recruitment", text: "Hiring pipelines, onboarding and team records in one workspace.", img: "1521737604893-d14cc237f11d" },
  { title: "Project & team tools", text: "Tasks, timelines and shared workspaces for working together.", img: "1507925921958-8a62f3d1a50d" },
  { title: "Booking & scheduling", text: "Slots, reminders and payments for service businesses.", img: "1506784983877-45594efa4cbe" },
  { title: "Marketplaces", text: "Buyers and sellers on one platform, with commissions and payouts.", img: "1472851294608-062f824d29cc" },
  { title: "Industry-specific software", text: "Workflows shaped around the way one trade or sector actually works.", img: "1565793298595-6a879b1d9492" },
];

const HOST_NODES = [
  { icon: Globe, label: "Domain & DNS" },
  { icon: Lock, label: "HTTPS / Load balancer" },
  { icon: Server, label: "App servers" },
  { icon: Database, label: "Database & cache" },
  { icon: Activity, label: "Backups & monitoring" },
];

const HOSTS = [
  {
    key: "Cloud VM / VPS",
    suits: "Early-stage products and MVPs that need control at a modest scale.",
    trade: "Needs server administration, security updates, backups and monitoring.",
    manage: "OS updates, security, backups, monitoring and deployment.",
    own: 88,
  },
  {
    key: "Managed platform / PaaS",
    suits: "Teams that want quick releases with less server work.",
    trade: "Less low-level control, and costs can climb as usage grows.",
    manage: "The platform handles servers and patching; you manage the app, data and settings.",
    own: 30,
  },
  {
    key: "Container-based hosting",
    suits: "Products made of several services that need repeatable deployments.",
    trade: "More setup, and a team that is comfortable running containers.",
    manage: "Images, deployment configuration, scaling rules and monitoring.",
    own: 66,
  },
  {
    key: "Cloud infrastructure",
    suits: "Growing products with scale, compliance or regional requirements.",
    trade: "The most flexible option, and the most to design, secure and pay for.",
    manage: "Networking, access policies, scaling, backups and cost control.",
    own: 80,
  },
];

const ALSO_PLAN = [
  "HTTPS certificates",
  "Secrets & environment settings",
  "File & object storage",
  "Staging & production",
  "Automated deploys with rollback",
  "Backups, logs, health checks & monitoring",
];

const CHECKS = [
  { t: "Tenant data isolation", d: "Testing that one customer cannot see another's data." },
  { t: "Billing & plan testing", d: "Checking trials, upgrades, downgrades and limits." },
  { t: "Authentication & roles", d: "Secure login and role-based permissions." },
  { t: "Validation & errors", d: "Input validation and clear error handling." },
  { t: "Performance testing", d: "Load testing when growth makes it worthwhile." },
  { t: "Backup & recovery", d: "Backups and a recovery plan for customer data." },
  { t: "Monitoring & alerts", d: "Logs, uptime checks and error reporting." },
  { t: "Controlled releases", d: "Staging, staged rollouts and rollback planning." },
];

const SCOPE = [
  { t: "Core features", d: "What the product must do on day one.", core: true },
  { t: "Plans & billing logic", d: "Trials, tiers, usage limits and payment integration." },
  { t: "Tenancy & roles", d: "Multi-tenant structure, teams and permissions." },
  { t: "UI/UX design", d: "Custom design, onboarding and dashboards." },
  { t: "Integrations & APIs", d: "Public APIs, webhooks and third-party services." },
  { t: "Security & compliance", d: "Stricter data or compliance needs add work." },
  { t: "Hosting & scaling", d: "Where it runs and how it grows." },
  { t: "Maintenance & roadmap", d: "Ongoing fixes, updates and new features." },
];

const STATEMENT =
  "A SaaS product is never finished. The best ones launch lean, learn from real users and keep improving without breaking what already works.";

const FAQ = [
  { q: "What is a SaaS platform?", a: "Software as a service is software customers use online, usually through a subscription, instead of installing it themselves. Many customers share one platform." },
  { q: "Should I start with an MVP?", a: "In most cases yes. A focused MVP lets you test the idea with real users before investing in every feature." },
  { q: "What does multi-tenant mean?", a: "It means one platform serves many customers, called tenants, while keeping each tenant's data and settings separate." },
  { q: "Can you add subscription billing?", a: "Yes. We can build plans, trials and upgrades and connect established payment gateways. Availability and fees depend on the provider." },
  { q: "Can you build the admin panel and analytics?", a: "Yes. Admin panels for managing customers and plans, and analytics for usage, are common parts of a SaaS project." },
  { q: "Can customers connect through APIs?", a: "Yes. We can build public APIs and webhooks where your product needs them." },
  { q: "Where will the platform be hosted?", a: "Options include a cloud VM, managed platform, containers or full cloud infrastructure. The right choice depends on stage, traffic, budget and compliance." },
  { q: "Can you take over or improve an existing product?", a: "Often yes. We review the code, data and architecture and recommend whether to improve, refactor or rebuild parts of it." },
  { q: "How long does it take and what does it cost?", a: "Both depend on features, billing logic, integrations and design. We give a project-specific estimate after discovery, usually starting with an MVP." },
  { q: "Do you provide support after launch?", a: "Support and maintenance can be arranged, covering fixes, security updates, monitoring and new features, under the agreed arrangement." },
];

const RELATED = [
  { to: "/services/erp-crm", title: "ERP & CRM", text: "Connect back-office operations to your product.", img: "1553729459-efe14ef6055d" },
  { to: "/services/software-development", title: "Custom software", text: "Business software, portals and automation.", img: "1555066931-4365d14bab8c" },
  { to: "/services/mobile-app-development", title: "Mobile apps", text: "Take your product to iOS and Android.", img: "1512941937669-90a1b58e7e9c" },
  { to: "/services/ui-ux", title: "UI/UX design", text: "Onboarding and dashboards people enjoy using.", img: "1558655146-9f40138edfeb" },
  { to: "/services/digital-marketing", title: "Digital marketing", text: "Bring the right users to your product.", img: "1460925895917-afdab827c52f" },
];

const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE}/services/saas#service`,
      name: "SaaS platform development",
      serviceType: "SaaS platform development",
      description:
        "Multi-tenant SaaS platforms with subscription billing, admin panels, APIs and cloud deployment, starting from a focused MVP.",
      provider: { "@type": "Organization", name: BRAND, url: `${SITE}/` },
      areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
        { "@type": "ListItem", position: 3, name: "SaaS Platform Development", item: `${SITE}/services/saas` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Mini product UI, reused on every device                             */
/* ------------------------------------------------------------------ */

const APP_TILES = [
  { label: "Tenants", Icon: Boxes },
  { label: "Plans", Icon: CreditCard },
  { label: "Teams", Icon: Users },
  { label: "Usage", Icon: BarChart3 },
];

function MiniApp({ size }: { size: "lap" | "tab" | "phone" }) {
  return (
    <div className={`sx-app sx-app--${size}`}>
      <aside className="sx-app__side">
        <b>YourSaaS</b>
        {["Dashboard", "Projects", "Team", "Billing"].map((n, i) => (
          <span key={n} className={i === 0 ? "is-on" : ""}>{n}</span>
        ))}
      </aside>
      <div className="sx-app__main">
        <div className="sx-app__hd">
          <div>
            <b>Dashboard</b>
            <small>Your product, ready for customers.</small>
          </div>
          <span className="sx-app__btn">Upgrade</span>
        </div>
        <div className="sx-app__tiles">
          {APP_TILES.map(({ label, Icon }) => (
            <span key={label}><Icon size={13} />{label}</span>
          ))}
        </div>
        <div className="sx-app__chart">
          {[34, 52, 40, 68, 58, 82, 74, 92].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero console: three tenants, one platform                           */
/* ------------------------------------------------------------------ */

function Console() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const paused = useRef(false);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (calm()) return;
    const id = window.setInterval(() => {
      if (!paused.current) setT((v) => (v + 1) % TENANTS.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const d = TENANTS[t];
    const fast = calm();
    const before = prev.current;

    const place = (animate: boolean) => {
      const btn = root.querySelectorAll<HTMLElement>(".sx-tab")[t];
      const ind = root.querySelector<HTMLElement>(".sx-tabs__ind");
      if (!btn || !ind) return;
      const vars = { x: btn.offsetLeft, width: btn.offsetWidth };
      if (animate && !fast) gsap.to(ind, { ...vars, duration: 0.55, ease: "power3.out" });
      else gsap.set(ind, vars);
    };
    place(before !== null);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const from = Number(el.dataset.shown ?? 0);
        if (fast) {
          el.textContent = String(to);
          el.dataset.shown = String(to);
          return;
        }
        const o = { v: from };
        el.textContent = String(Math.round(from));
        gsap.to(o, {
          v: to,
          duration: 1.1,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
            el.dataset.shown = String(o.v);
          },
        });
      });
      if (fast) return;
      const from = before === null ? 0 : TENANTS[before].usage / 100;
      gsap.fromTo(".sx-meter i", { scaleX: from }, { scaleX: d.usage / 100, duration: 1, ease: "power3.out" });
      gsap.fromTo(".sx-bar", { scaleY: 0.08 }, { scaleY: 1, stagger: 0.05, duration: 0.8, ease: "back.out(1.5)", transformOrigin: "50% 100%" });
      gsap.fromTo(".sx-feed li", { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, stagger: 0.09, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(".sx-con__plan", { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
    }, root);

    prev.current = t;
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [t]);

  const d = TENANTS[t];

  return (
    <div
      className="sx-con"
      ref={ref}
      onPointerEnter={() => { paused.current = true; }}
      onPointerLeave={() => { paused.current = false; }}
    >
      <div className="sx-con__bar">
        <span /><span /><span />
        <b>app.yoursaas.com</b>
        <em className="sx-live"><i />Live</em>
      </div>
      <div className="sx-con__body">
        <aside className="sx-con__side" aria-hidden="true">
          <strong>YourSaaS</strong>
          {["Dashboard", "Projects", "Team", "Billing"].map((n, i) => (
            <span key={n} className={i === 0 ? "is-on" : ""}>{n}</span>
          ))}
        </aside>
        <div className="sx-con__main">
          <div className="sx-con__top">
            <div className="sx-tabs" role="tablist" aria-label="Switch tenant">
              <span className="sx-tabs__ind" aria-hidden="true" />
              {TENANTS.map((x, i) => (
                <button
                  key={x.name}
                  type="button"
                  role="tab"
                  aria-selected={t === i}
                  className={`sx-tab${t === i ? " is-on" : ""}`}
                  onClick={() => { paused.current = true; setT(i); }}
                >
                  {x.name}
                </button>
              ))}
            </div>
            <span className="sx-con__plan">{d.plan}</span>
          </div>

          <div className="sx-kpis">
            <div><small>Active users</small><b data-count={d.users}>{d.users}</b></div>
            <div><small>Projects</small><b data-count={d.projects}>{d.projects}</b></div>
            <div>
              <small>Plan usage</small>
              <b><span data-count={d.usage}>{d.usage}</span>%</b>
              <span className="sx-meter"><i style={{ transform: `scaleX(${d.usage / 100})` }} /></span>
            </div>
          </div>

          <div className="sx-chart" aria-hidden="true">
            {d.bars.map((h, i) => (
              <span className="sx-bar" key={i} style={{ height: `${h}%` }} />
            ))}
          </div>

          <ul className="sx-feed">
            {d.feed.map((f) => (
              <li key={f}><Check size={13} aria-hidden="true" />{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="sx-con__note">Sample data. Each tenant sees only its own.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Services: scroll-driven list with a sticky preview                  */
/* ------------------------------------------------------------------ */

function Services() {
  const ref = useRef<HTMLElement>(null);
  const [sel, setSel] = useState({ cur: 0, prev: -1 });
  const first = useRef(true);

  const pick = (n: number) => setSel((s) => (s.cur === n ? s : { cur: n, prev: s.cur }));

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".sx-srow").forEach((row, idx) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (s) => { if (s.isActive) pick(idx); },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (calm()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sx-svc__img.is-on", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut", clearProps: "clipPath" });
      gsap.fromTo(".sx-svc__img.is-on img", { scale: 1.2 }, { scale: 1, duration: 1.3, ease: "power3.out" });
      gsap.fromTo(".sx-svc__cap", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", delay: 0.15 });
    }, el);
    return () => ctx.revert();
  }, [sel.cur]);

  const s = SERVICES[sel.cur];

  return (
    <section className="sx-sec sx-svc" id="sx-services" ref={ref} aria-labelledby="sx-svc-h">
      <div className="container">
        <Head eyebrow="SaaS services" lead="From a first MVP to a growing platform, each piece can be scoped on its own.">
          <span id="sx-svc-h">Ten parts of a platform, <em>built to fit together.</em></span>
        </Head>
        <div className="sx-svc__grid">
          <ul className="sx-svc__list">
            {SERVICES.map((x, k) => (
              <li
                key={x.title}
                className={`sx-srow${sel.cur === k ? " is-on" : ""}`}
                onMouseEnter={() => pick(k)}
              >
                <div className="sx-srow__m" aria-hidden="true"><Photo id={x.img} w={640} h={360} /></div>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
                <ArrowUpRight className="sx-srow__go" size={20} aria-hidden="true" />
              </li>
            ))}
          </ul>
          <div className="sx-svc__view" aria-hidden="true">
            <div className="sx-svc__frame">
              {SERVICES.map((x, k) => (
                <div
                  key={x.title}
                  className={`sx-svc__img${sel.cur === k ? " is-on" : ""}${sel.prev === k ? " is-prev" : ""}`}
                >
                  <Photo id={x.img} w={1000} h={1250} eager={k === 0} />
                </div>
              ))}
              <div className="sx-svc__cap" key={sel.cur}>
                <small>{String(sel.cur + 1).padStart(2, "0")} / {SERVICES.length}</small>
                <b>{s.title}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Plan lab: the billing logic, playable                               */
/* ------------------------------------------------------------------ */

function PlanLab() {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [plan, setPlan] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [seats, setSeats] = useState(1);
  const [note, setNote] = useState("");

  const P = PLANS[plan];
  const full = seats >= P.seats;
  const price = yearly ? Math.round(P.price * 0.8) : P.price;

  const shake = () => {
    const w = ref.current?.querySelector(".sx-lab__win");
    if (w && !calm()) gsap.fromTo(w, { x: -10 }, { x: 0, duration: 0.7, ease: "elastic.out(1,.25)" });
  };

  const choose = (i: number) => {
    if (PLANS[i].seats < seats) {
      const over = seats - PLANS[i].seats;
      setNote(`Remove ${over} seat${over > 1 ? "s" : ""} before moving to ${PLANS[i].name}. Downgrades respect the smaller plan's limits.`);
      shake();
      return;
    }
    setNote("");
    setPlan(i);
  };

  const invite = () => {
    if (full) {
      setNote(plan < PLANS.length - 1 ? `${P.name} includes ${P.seats} seats. Upgrade to invite more.` : `${P.name} is the top plan in this example.`);
      shake();
      return;
    }
    setNote("");
    setSeats(seats + 1);
  };

  const upgrade = () => {
    if (plan >= PLANS.length - 1) return;
    setPlan(plan + 1);
    setNote(`Moved to ${PLANS[plan + 1].name}. The new limits apply straight away.`);
  };

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const btn = root.querySelectorAll<HTMLElement>(".sx-seg__b")[plan];
    const ind = root.querySelector<HTMLElement>(".sx-seg__ind");
    if (ind && btn) {
      const vars = { x: btn.offsetLeft, width: btn.offsetWidth };
      if (first.current || calm()) gsap.set(ind, vars);
      else gsap.to(ind, { ...vars, duration: 0.5, ease: "power3.out" });
    }
    if (first.current) {
      first.current = false;
      return;
    }
    if (calm()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sx-lab__price b", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(".sx-feat.is-on .sx-feat__ic", { scale: 0.3, rotate: -120 }, { scale: 1, rotate: 0, stagger: 0.07, duration: 0.6, ease: "back.out(2.4)" });
    }, root);
    return () => ctx.revert();
  }, [plan, yearly]);

  return (
    <section className="sx-sec sx-lab" id="sx-plans" ref={ref} aria-labelledby="sx-lab-h">
      <div className="sx-lab__bg" aria-hidden="true" />
      <div className="container sx-lab__grid">
        <div className="sx-lab__copy">
          <Head light eyebrow="Plans & billing" lead="Trials, tiers, usage limits and payment integration are product logic, not an afterthought. Try the kind of rules we build into your platform.">
            <span id="sx-lab-h">Hit a limit. <em>See the upgrade.</em></span>
          </Head>
          <ul className="sx-lab__tips">
            <li>Invite teammates until the seat limit stops you.</li>
            <li>Switch plans to watch features unlock.</li>
            <li>Try a downgrade while you have too many seats.</li>
          </ul>
          <p className="sx-lab__fine">Illustrative example. Plan names, limits and prices are placeholders for your own pricing model.</p>
        </div>

        <div className="sx-lab__win">
          <div className="sx-lab__bar"><span /><span /><span /><b>Billing · example product</b></div>
          <div className="sx-lab__body">
            <div className="sx-seg" role="group" aria-label="Choose a plan">
              <span className="sx-seg__ind" aria-hidden="true" />
              {PLANS.map((p, i) => (
                <button key={p.name} type="button" className={`sx-seg__b${plan === i ? " is-on" : ""}`} aria-pressed={plan === i} onClick={() => choose(i)}>
                  {p.name}
                </button>
              ))}
            </div>

            <div className="sx-lab__row">
              <p className="sx-lab__price"><b>{inr(price)}</b><span> / month</span></p>
              <button type="button" className={`sx-switch${yearly ? " is-on" : ""}`} role="switch" aria-checked={yearly} onClick={() => setYearly(!yearly)}>
                <i /><span>{yearly ? "Billed yearly" : "Billed monthly"}</span>
              </button>
            </div>

            <div className="sx-lab__meter">
              <div className="sx-lab__mt">
                <span>Seats</span>
                <b>{seats} / {P.seats}</b>
              </div>
              <span className={`sx-lab__track${full ? " is-full" : ""}`}><i style={{ transform: `scaleX(${Math.min(1, seats / P.seats)})` }} /></span>
              <div className="sx-lab__btns">
                <button type="button" className="sx-btn sx-btn--solid" onClick={invite}><Plus size={15} aria-hidden="true" />Invite teammate</button>
                <button type="button" className="sx-btn" onClick={() => { setNote(""); setSeats(Math.max(1, seats - 1)); }} disabled={seats <= 1} aria-label="Remove a teammate"><Minus size={15} aria-hidden="true" /></button>
              </div>
              <p className="sx-lab__proj">{P.projects} projects included</p>
            </div>

            <ul className="sx-feats">
              {FEATS.map((f, i) => (
                <li key={f} className={`sx-feat${P.feats[i] ? " is-on" : ""}`}>
                  <span className="sx-feat__ic">{P.feats[i] ? <Check size={13} aria-hidden="true" /> : <Lock size={12} aria-hidden="true" />}</span>
                  {f}
                  <em>{P.feats[i] ? "Included" : "Upgrade"}</em>
                </li>
              ))}
            </ul>

            <div className={`sx-lab__note${note ? " is-on" : ""}`} role="status" aria-live="polite">
              <span>{note || "Everything is within the limits of this plan."}</span>
              {note && full && plan < PLANS.length - 1 && (
                <button type="button" className="sx-btn sx-btn--yellow" onClick={upgrade}>Upgrade to {PLANS[plan + 1].name}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Hosting explorer                                                    */
/* ------------------------------------------------------------------ */

function Hosting() {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [o, setO] = useState(0);
  const H = HOSTS[o];

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (calm()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sx-hnode", { scale: 0.86, autoAlpha: 0.35 }, { scale: 1, autoAlpha: 1, stagger: 0.09, duration: 0.55, ease: "back.out(2)" });
      gsap.fromTo(".sx-host__txt > *", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.5, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, [o]);

  return (
    <section className="sx-sec sx-host" ref={ref} aria-labelledby="sx-host-h">
      <div className="container">
        <Head eyebrow="Hosting & deployment" lead="The right option depends on architecture, users, budget, compliance needs and how much server work you want to own. No single option is always best.">
          <span id="sx-host-h">Where your SaaS platform <em>can run.</em></span>
        </Head>

        <div className="sx-flow" aria-hidden="true">
          {HOST_NODES.map((n, i) => (
            <div className="sx-flow__cell" key={n.label}>
              <div className="sx-hnode"><n.icon size={20} /><span>{n.label}</span></div>
              {i < HOST_NODES.length - 1 && <i className="sx-flow__link" style={{ "--d": `${i * 0.45}s` } as CSSProperties} />}
            </div>
          ))}
        </div>

        <div className="sx-host__grid">
          <div className="sx-host__tabs" role="tablist" aria-label="Hosting options">
            {HOSTS.map((h, i) => (
              <button
                key={h.key}
                type="button"
                role="tab"
                id={`sx-ht-${i}`}
                aria-selected={o === i}
                aria-controls="sx-host-panel"
                className={`sx-htab${o === i ? " is-on" : ""}`}
                onClick={() => setO(i)}
              >
                <span>{h.key}</span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="sx-host__panel" role="tabpanel" id="sx-host-panel" aria-labelledby={`sx-ht-${o}`}>
            <div className="sx-host__txt">
              <h3>{H.key}</h3>
              <dl>
                <div><dt>Suits</dt><dd>{H.suits}</dd></div>
                <div><dt>Trade-offs</dt><dd>{H.trade}</dd></div>
                <div><dt>Who manages what</dt><dd>{H.manage}</dd></div>
              </dl>
            </div>
            <div className="sx-own">
              <div className="sx-own__lbl"><span>Provider does more</span><span>You do more</span></div>
              <span className="sx-own__track"><i style={{ transform: `scaleX(${H.own / 100})` }} /></span>
              <small>Indicative share of server work your team owns.</small>
            </div>
          </div>
        </div>

        <ul className="sx-also">
          {ALSO_PLAN.map((a) => <li key={a}><Check size={14} aria-hidden="true" />{a}</li>)}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Release checks terminal                                             */
/* ------------------------------------------------------------------ */

function Checks() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || calm()) return;
    const lines = Array.from(root.querySelectorAll<HTMLElement>(".sx-test"));
    lines.forEach((l) => l.classList.add("is-wait"));
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top 72%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          lines.forEach((l, i) => {
            tl.call(() => { l.classList.remove("is-wait"); l.classList.add("is-run"); }, undefined, i * 0.55)
              .call(() => { l.classList.remove("is-run"); }, undefined, i * 0.55 + 0.45);
          });
          tl.call(() => root.classList.add("is-done"), undefined, lines.length * 0.55 + 0.2);
        },
      });
    }, root);
    return () => {
      ctx.revert();
      lines.forEach((l) => l.classList.remove("is-wait", "is-run"));
      root.classList.remove("is-done");
    };
  }, []);

  return (
    <section className="sx-sec sx-qa" aria-labelledby="sx-qa-h">
      <div className="container sx-qa__grid">
        <Head light eyebrow="Security, quality & reliability" lead="No system is completely secure or bug-free. These practices reduce risk and make problems easier to find and fix.">
          <span id="sx-qa-h">What a release <em>goes through.</em></span>
        </Head>
        <div className="sx-term" ref={ref}>
          <div className="sx-term__bar"><span /><span /><span /><b>release-checks</b></div>
          <ul className="sx-term__body">
            {CHECKS.map((c) => (
              <li className="sx-test" key={c.t}>
                <i className="sx-test__s" aria-hidden="true"><Check size={13} /></i>
                <div><b>{c.t}</b><span>{c.d}</span></div>
              </li>
            ))}
          </ul>
          <p className="sx-term__foot"><Check size={14} aria-hidden="true" />Checks planned for every release</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Scope builder                                                       */
/* ------------------------------------------------------------------ */

function Scope() {
  const [on, setOn] = useState<boolean[]>(SCOPE.map((s) => !!s.core));
  const n = on.filter(Boolean).length;
  const C = 2 * Math.PI * 54;
  const msg =
    n <= 3
      ? "A tight MVP. Ship it, learn from real users, then expand."
      : n <= 6
      ? "A solid first release. We would phase the rest after launch."
      : "That is a full platform. We would split it across several releases.";

  return (
    <section className="sx-sec sx-scope" aria-labelledby="sx-scope-h">
      <div className="container">
        <Head eyebrow="Cost & scope" lead="Every product is different, so we give a project-specific estimate after understanding your idea. We suggest starting with a focused MVP, then expanding once real users validate it.">
          <span id="sx-scope-h">What affects the cost of <em>a SaaS platform.</em></span>
        </Head>
        <div className="sx-scope__grid">
          <ul className="sx-scope__list">
            {SCOPE.map((s, i) => (
              <li key={s.t}>
                <button
                  type="button"
                  className={`sx-chip${on[i] ? " is-on" : ""}`}
                  aria-pressed={on[i]}
                  disabled={s.core}
                  onClick={() => setOn((v) => v.map((x, k) => (k === i ? !x : x)))}
                >
                  <span className="sx-chip__box">{on[i] && <Check size={13} aria-hidden="true" />}</span>
                  <span className="sx-chip__t"><b>{s.t}</b><small>{s.d}</small></span>
                </button>
              </li>
            ))}
          </ul>
          <div className="sx-gauge">
            <p className="sx-gauge__q">What does your first release need?</p>
            <div className="sx-gauge__ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="54" className="sx-gauge__bg" />
                <circle cx="60" cy="60" r="54" className="sx-gauge__fg" strokeDasharray={C} strokeDashoffset={C * (1 - n / SCOPE.length)} />
              </svg>
              <div><b>{n}</b><span>of {SCOPE.length} areas</span></div>
            </div>
            <p className="sx-gauge__msg" role="status" aria-live="polite">{msg}</p>
            <Link className="sx-gauge__link" to="/contact">
              <span>Get a project-specific estimate</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Industries accordion                                                */
/* ------------------------------------------------------------------ */

function Industries() {
  const [a, setA] = useState(0);
  return (
    <section className="sx-sec sx-ind" aria-labelledby="sx-ind-h">
      <div className="container">
        <Head eyebrow="Who we build for" lead="Examples of products SaaS development can support. These are possible ideas, not client case studies.">
          <span id="sx-ind-h">SaaS for every kind <em>of idea.</em></span>
        </Head>
        <div className="sx-ind__row">
          {INDUSTRIES.map((x, i) => (
            <button
              key={x.title}
              type="button"
              className={`sx-iitem${a === i ? " is-on" : ""}`}
              aria-expanded={a === i}
              onClick={() => setA(i)}
              onMouseEnter={() => setA(i)}
              onFocus={() => setA(i)}
            >
              <Photo id={x.img} w={900} h={1100} />
              <span className="sx-iitem__shade" aria-hidden="true" />
              <span className="sx-iitem__vt" aria-hidden="true">{x.title}</span>
              <span className="sx-iitem__body">
                <b>{x.title}</b>
                <span>{x.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a, id, open, onToggle }: { q: string; a: string; id: string; open: boolean; onToggle: () => void }) {
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
    gsap.to(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0, duration: calm() ? 0 : 0.55, ease: "power3.inOut" });
  }, [open]);

  return (
    <div className={`sx-faq__item${open ? " is-open" : ""}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="sx-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="sx-sec sx-faq" id="sx-faq" aria-labelledby="sx-faq-h">
      <div className="container sx-faq__grid">
        <div className="sx-faq__side">
          <Head eyebrow="FAQ">
            <span id="sx-faq-h">SaaS questions, <em>answered.</em></span>
          </Head>
          <p className="sx-lead">Not covered here? Tell us about your idea and we will answer on the call.</p>
          <Link className="sx-faq__link" to="/contact">
            <span>Ask our team</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="sx-faq__list">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} id={`sx-faq-${i}`} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Phase mini visuals                                                  */
/* ------------------------------------------------------------------ */

function PhaseVis({ kind }: { kind: Vis }) {
  if (kind === "scope")
    return (
      <div className="sx-pv sx-pv--scope">
        <span className="sx-pv__tag">Customer</span>
        <span className="sx-pv__tag">Problem</span>
        <span className="sx-pv__tag">Plans</span>
        <span className="sx-pv__tag sx-pv__tag--hot" data-vi="pop">Smallest useful version</span>
      </div>
    );
  if (kind === "wire")
    return (
      <div className="sx-pv sx-pv--wire">
        <i data-vi="x" /><i data-vi="x" /><i data-vi="y" /><i data-vi="y" /><i data-vi="y" /><i data-vi="x" />
      </div>
    );
  if (kind === "code")
    return (
      <div className="sx-pv sx-pv--code">
        {[78, 52, 88, 40, 66].map((w, i) => <i key={i} data-vi="x" style={{ width: `${w}%` }} />)}
      </div>
    );
  if (kind === "deploy")
    return (
      <div className="sx-pv sx-pv--deploy">
        <p><span>Deploying to production</span><b>Live</b></p>
        <span className="sx-pv__bar"><i data-vi="x" /></span>
        <small>Monitoring on · backups on · rollback ready</small>
      </div>
    );
  return (
    <div className="sx-pv sx-pv--growth">
      {[26, 38, 34, 54, 62, 78, 92].map((h, i) => <i key={i} data-vi="y" style={{ height: `${h}%` }} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Saas() {
  const rootRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });
  };

  const spot = (e: ReactPointerEvent<HTMLElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".sx-bcard");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
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

        /* ============ page progress ============ */
        gsap.to(one(".sx-progress i"), { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

        /* ============ HERO: one orchestrated entrance ============ */
        {
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from($(".sx-crumb, .sx-hero .eyebrow"), { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
            .from($(".sx-hero__title .sx-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
            .from($(".sx-hero__lead, .sx-hero__cta > *, .sx-hero__chips li"), { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.06, clearProps: "all" }, 0.55)
            .from(one(".sx-con"), { y: 80, autoAlpha: 0, rotationX: 16, transformPerspective: 1400, transformOrigin: "50% 100%", duration: 1.3, clearProps: "transform,opacity,visibility" }, 0.3)
            .from($(".sx-orbit"), { scale: 0.5, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "back.out(1.8)", clearProps: "transform,opacity,visibility" }, 1);

          gsap.to(one(".sx-hero__glow"), {
            yPercent: 22,
            ease: "none",
            scrollTrigger: { trigger: one(".sx-hero"), start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to(one(".sx-hero__visual"), {
            yPercent: -5,
            ease: "none",
            scrollTrigger: { trigger: one(".sx-hero"), start: "top top", end: "bottom top", scrub: true },
          });
        }

        if (fine) {
          const hero = one(".sx-hero");
          const layers = $(".sx-orbit").map((el) => ({
            qx: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            qy: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            d: Number(el.dataset.depth || 1),
          }));
          const mv = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.qx(nx * 32 * l.d);
              l.qy(ny * 24 * l.d);
            });
          };
          hero.addEventListener("pointermove", mv);
          off.push(() => hero.removeEventListener("pointermove", mv));

          $(".sx-mag").forEach((b) => {
            const qx = gsap.quickTo(b, "x", { duration: 0.5, ease: "elastic.out(1,.5)" });
            const qy = gsap.quickTo(b, "y", { duration: 0.5, ease: "elastic.out(1,.5)" });
            const move = (e: PointerEvent) => {
              const r = b.getBoundingClientRect();
              qx((e.clientX - r.left - r.width / 2) * 0.25);
              qy((e.clientY - r.top - r.height / 2) * 0.25);
            };
            const leave = () => { qx(0); qy(0); };
            b.addEventListener("pointermove", move);
            b.addEventListener("pointerleave", leave);
            off.push(() => {
              b.removeEventListener("pointermove", move);
              b.removeEventListener("pointerleave", leave);
            });
          });
        }

        /* ============ TICKER: follows scroll direction ============ */
        {
          const tw = gsap.to(one(".sx-tick__track"), { xPercent: -50, repeat: -1, duration: 28, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              const dir = s.direction || 1;
              gsap.to(tw, { timeScale: dir * (1 + Math.min(Math.abs(s.getVelocity()) / 300, 5)), duration: 0.2, overwrite: true });
              gsap.to(tw, { timeScale: dir, duration: 0.9, delay: 0.25 });
            },
          });
        }

        /* ============ STACK: exploded 3D platform, pinned ============ */
        {
          const section = one(".sx-stack");
          const steps = $(".sx-lstep");
          const slabs = $(".sx-slab");
          const rig = one(".sx-stack__rig");
          const count = one(".sx-stack__count");
          const bar = one(".sx-stack__bar i");
          const N = slabs.length;
          const GAP = wide ? 96 : 60;
          const marks: number[] = [];
          fitHeight(one(".sx-lsteps"), steps);

          gsap.set(rig, { rotationX: 0, rotationZ: 0, scale: 0.8, transformPerspective: 1600 });
          gsap.set(slabs, { z: (i: number) => (N - 1 - i) * 4, autoAlpha: 0, y: 50, backgroundColor: SLAB_OFF, borderColor: EDGE_OFF });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 30, filter: "blur(6px)" });
          count.textContent = `01 / 0${N}`;

          const tl: gsap.core.Timeline = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=560%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              onUpdate: (s) => {
                bar.style.transform = `scaleX(${Math.max(0.03, s.progress)})`;
                const t = tl.time();
                let idx = 0;
                marks.forEach((m, k) => { if (t >= m + 0.25) idx = k; });
                count.textContent = `0${idx + 1} / 0${N}`;
              },
            },
          });

          tl.to(rig, { rotationX: 58, rotationZ: -34, scale: 1, duration: 1.3, ease: "power3.inOut" }, 0)
            .to(slabs, { autoAlpha: 0.34, y: 0, duration: 0.8, stagger: { each: 0.12, from: "end" } }, 0.2)
            .to(slabs, { z: (i: number) => (N - 1 - i) * GAP, duration: 1.2, ease: "power3.inOut" }, 0.9);

          const focus = (i: number, at: number) => {
            tl.to(
              slabs,
              {
                autoAlpha: (j: number) => (j === i ? 1 : 0.34),
                x: (j: number) => (j === i ? 46 : 0),
                backgroundColor: (j: number) => (j === i ? SLAB_ON : SLAB_OFF),
                borderColor: (j: number) => (j === i ? YELLOW : EDGE_OFF),
                duration: 0.5,
              },
              at
            );
            if (i > 0) {
              tl.to(steps[i - 1], { autoAlpha: 0, y: -26, filter: "blur(6px)", duration: 0.35 }, at)
                .fromTo(steps[i], { autoAlpha: 0, y: 30, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5 }, at + 0.25);
            }
          };
          slabs.forEach((_, i) => {
            const at = 2.3 + i * 1.5;
            marks.push(at);
            focus(i, at);
          });
          tl.to({}, { duration: 1 });
        }

        /* ============ ROADMAP: rail fills, nodes light, visuals build ============ */
        {
          const rail = one(".sx-road__rail");
          gsap.fromTo(
            one(".sx-road__fill"),
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: rail, start: "top 62%", end: "bottom 62%", scrub: 0.4 } }
          );
          $(".sx-phase").forEach((p, i) => {
            const side = i % 2 ? 1 : -1;
            const node = one(".sx-node", p);
            const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
            tl.fromTo($(".sx-phase__txt > *", p), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.7 })
              .fromTo(one(".sx-phase__vis", p), { autoAlpha: 0, x: wide ? side * 50 : 0, scale: 0.94 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.9 }, 0.1);
            const xs = $('[data-vi="x"]', p);
            const ys = $('[data-vi="y"]', p);
            const pops = $('[data-vi="pop"]', p);
            if (xs.length) tl.fromTo(xs, { scaleX: 0 }, { scaleX: 1, stagger: 0.1, duration: 0.9 }, 0.4);
            if (ys.length) tl.fromTo(ys, { scaleY: 0 }, { scaleY: 1, stagger: 0.07, duration: 0.8, ease: "back.out(1.4)" }, 0.4);
            if (pops.length) tl.fromTo(pops, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2)" }, 0.7);
            ScrollTrigger.create({
              trigger: p,
              start: "top 66%",
              onEnter: () => { tl.play(); node.classList.add("is-on"); },
              onLeaveBack: () => { tl.reverse(); node.classList.remove("is-on"); },
            });
          });
        }

        /* ============ DEVICES: tablet and phone slide out of the laptop ============ */
        {
          const stage = one(".sx-dev__stage");
          gsap
            .timeline({ scrollTrigger: { trigger: stage, start: "top 85%", end: "center 52%", scrub: 0.9 } })
            .from(one(".sx-dev__lap"), { y: 90, rotationX: -22, transformPerspective: 1200, transformOrigin: "50% 100%", duration: 1, ease: "none" })
            .from(one(".sx-dev__tab"), { xPercent: -90, autoAlpha: 0, rotation: -6, duration: 1, ease: "none" }, 0.2)
            .from(one(".sx-dev__phone"), { xPercent: 110, autoAlpha: 0, rotation: 8, duration: 1, ease: "none" }, 0.4)
            .from($(".sx-dev__tag"), { scale: 0.5, autoAlpha: 0, stagger: 0.12, duration: 0.5, ease: "back.out(2)" }, 1);
        }

        /* ============ TECH ============ */
        {
          const cols = $(".sx-tcol");
          const pills = $(".sx-tcol .sx-pill");
          gsap.set(pills, { autoAlpha: 0, scale: 0.7 });
          gsap.set(cols, { autoAlpha: 0, y: 40 });
          ScrollTrigger.batch(cols, {
            start: "top 88%",
            once: true,
            onEnter: (b) => {
              gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
              b.forEach((col, k) => {
                gsap.to($(".sx-pill", col), { autoAlpha: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: "back.out(2)", delay: 0.2 + k * 0.1 });
              });
            },
          });
        }

        /* ============ BEFORE / AFTER: the table flips row by row ============ */
        {
          const rows = $(".sx-row");
          gsap.set(rows, { transformPerspective: 900 });
          gsap.set(one(".sx-ba__cap--a"), { autoAlpha: 0, y: 12 });
          gsap
            .timeline({ scrollTrigger: { trigger: one(".sx-ba__board"), start: "top 72%", end: "bottom 42%", scrub: 0.8 } })
            .to(rows, { rotationX: 180, stagger: 0.35, duration: 1, ease: "power2.inOut" })
            .to(one(".sx-ba__stamp--b"), { autoAlpha: 0, scale: 1.4, duration: 0.5 }, 0.6)
            .to(one(".sx-ba__cap--b"), { autoAlpha: 0, y: -12, duration: 0.4 }, 1.4)
            .to(one(".sx-ba__cap--a"), { autoAlpha: 1, y: 0, duration: 0.5 }, 1.6);
        }

        /* ============ STATEMENT ============ */
        {
          const words = $(".sx-lit__w");
          gsap.set(words, { opacity: 0.16 });
          gsap.to(words, {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: one(".sx-lit__text"), start: "top 80%", end: "bottom 50%", scrub: true },
          });
        }

        /* ============ RELATED ============ */
        {
          const rows = $(".sx-rel__row");
          gsap.set(rows, { "--line": 0 });
          ScrollTrigger.batch(rows, {
            start: "top 92%",
            once: true,
            onEnter: (b) => gsap.to(b, { "--line": 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }),
          });
        }

        /* ============ CTA ============ */
        {
          gsap.from(one(".sx-cta"), {
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: one(".sx-cta"), start: "top 95%", end: "top 50%", scrub: true },
          });
          gsap.fromTo(
            one(".sx-cta__glow"),
            { yPercent: -14, xPercent: -6 },
            { yPercent: 14, xPercent: 6, ease: "none", scrollTrigger: { trigger: one(".sx-cta"), start: "top bottom", end: "bottom top", scrub: true } }
          );
          const items = $(".sx-rl li");
          gsap.set(items, { autoAlpha: 0, x: -16 });
          ScrollTrigger.create({
            trigger: one(".sx-cta"),
            start: "top 70%",
            once: true,
            onEnter: () => gsap.to(items, { autoAlpha: 1, x: 0, stagger: 0.35, duration: 0.6, ease: "power3.out" }),
          });
        }

        /* ============ section titles: one consistent wipe ============ */
        $(".sx-title").forEach((t) => {
          gsap.from(t, {
            y: 34,
            autoAlpha: 0,
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: t, start: "top 88%", once: true },
          });
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
    const raf = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <>
      <Seo
        title={`SaaS Platform Development Company in Indore | ${BRAND}`}
        description="Custom SaaS platform development: multi-tenant architecture, subscription billing, admin panels, APIs and cloud deployment, starting from a focused MVP. Get a free consultation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />

      <div className="sx" ref={rootRef}>
        <div className="sx-progress" aria-hidden="true"><i /></div>

        {/* ============================ HERO ============================ */}
        <section className="sx-hero" aria-labelledby="sx-h1">
          <div className="sx-hero__glow" aria-hidden="true" />
          <div className="sx-hero__photo" aria-hidden="true"><Photo id="1451187580459-43490279c0fa" w={1600} h={900} eager /></div>
          <div className="container sx-hero__grid">
            <div className="sx-hero__copy">
              <nav className="sx-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">SaaS Platform Development</span>
              </nav>

              <p className="eyebrow"><span />SaaS Platform Development</p>
              <h1 id="sx-h1" className="sx-hero__title" aria-label="SaaS products built to launch, learn and scale.">
                <span className="sx-line" aria-hidden="true"><Words text="SaaS products" /></span>
                <span className="sx-line" aria-hidden="true"><Words text="built to launch," /></span>
                <em className="sx-line" aria-hidden="true"><Words text="learn and scale." /></em>
              </h1>
              <p className="sx-hero__lead">
                We design and build subscription-based software platforms with accounts, teams, billing, admin panels
                and the cloud foundation to grow, starting from a focused MVP.
              </p>
              <div className="sx-hero__cta">
                <Link className="button button--primary sx-mag sx-hero__main" to="/contact" data-cursor="START">
                  <span>Discuss your project</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="sx-ghost sx-mag" onClick={() => jump("sx-stack")}>
                  See how it fits together
                </button>
              </div>
              <ul className="sx-hero__chips">
                {["MVP first", "Multi-tenant architecture", "Subscription billing", "Cloud & DevOps"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={14} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="sx-hero__visual">
              <Console />
              <span className="sx-orbit sx-orbit--1" data-depth="1.5" aria-hidden="true"><CreditCard size={15} />subscriptions</span>
              <span className="sx-orbit sx-orbit--2" data-depth="1.1" aria-hidden="true"><Boxes size={15} />multi-tenant</span>
              <span className="sx-orbit sx-orbit--3" data-depth="1.8" aria-hidden="true"><BarChart3 size={15} />usage analytics</span>
              <span className="sx-orbit sx-orbit--4" data-depth="1.3" aria-hidden="true"><Cloud size={15} />cloud-ready</span>
            </div>
          </div>
        </section>

        {/* ============================ TICKER ============================ */}
        <div className="sx-tick" aria-hidden="true">
          <div className="sx-tick__track">
            {[0, 1].map((g) => (
              <div className="sx-tick__group" key={g}>
                {TICKER.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ============================ STACK (pinned) ============================ */}
        <section className="sx-stack" id="sx-stack" aria-labelledby="sx-stack-h">
          <div className="sx-stack__bg" aria-hidden="true" />
          <div className="container sx-stack__grid">
            <div className="sx-stack__copy">
              <p className="eyebrow"><span />How a SaaS platform fits together</p>
              <h2 id="sx-stack-h" className="sx-stack__h">Six layers, <em>one scalable product.</em></h2>
              <p className="sx-stack__lead">Sign-ups, subscriptions, data and releases depend on all six layers working together.</p>
              <div className="sx-lsteps">
                {LAYERS.map((l) => (
                  <div className="sx-lstep" key={l.title}>
                    <p className="sx-lstep__tag"><l.icon size={16} aria-hidden="true" />{l.title}</p>
                    <h3>{l.h} <em>{l.em}</em></h3>
                    <p>{l.text}</p>
                    <ul>
                      {l.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="sx-stack__count" aria-hidden="true">01 / 06</p>
              <span className="sx-stack__bar" aria-hidden="true"><i /></span>
            </div>

            <div className="sx-stack__stage" aria-hidden="true">
              <div className="sx-stack__rig">
                {LAYERS.map((l) => (
                  <div className="sx-slab" key={l.title}>
                    <span className="sx-slab__ic"><l.icon size={18} /></span>
                    <b>{l.title}</b>
                    <small>{l.tag}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ SERVICES ============================ */}
        <Services />

        {/* ============================ ROADMAP ============================ */}
        <section className="sx-sec sx-road" id="sx-process" aria-labelledby="sx-road-h">
          <div className="container">
            <Head center eyebrow="How we work" lead="From validating the idea to launch and iteration, with an MVP agreed first and scope kept clear.">
              <span id="sx-road-h">Five phases from idea <em>to a growing product.</em></span>
            </Head>
            <div className="sx-road__rail">
              <span className="sx-road__line" aria-hidden="true"><i className="sx-road__fill" /></span>
              {PHASES.map((p, i) => (
                <article className={`sx-phase${i % 2 ? " sx-phase--r" : ""}`} key={p.title}>
                  <div className="sx-phase__txt">
                    <p className="sx-phase__when">{p.when}</p>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <ul>
                      {p.gets.map((g) => <li key={g}><Check size={13} aria-hidden="true" />{g}</li>)}
                    </ul>
                  </div>
                  <span className="sx-node" aria-hidden="true"><b>{i + 1}</b></span>
                  <div className="sx-phase__vis" aria-hidden="true"><PhaseVis kind={p.vis} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ PLAN LAB ============================ */}
        <PlanLab />

        {/* ============================ DEVICES ============================ */}
        <section className="sx-sec sx-devs" aria-labelledby="sx-dev-h">
          <div className="container">
            <Head center eyebrow="Web and mobile ready" lead="Your customers log in from laptops, tablets and phones. We build one responsive product with one account system that works across all of them.">
              <span id="sx-dev-h">One product. <em>Every device.</em></span>
            </Head>
            <div className="sx-dev__stage" aria-hidden="true">
              <div className="sx-dev__lap">
                <div className="sx-dev__screen"><MiniApp size="lap" /></div>
                <div className="sx-dev__base" />
              </div>
              <div className="sx-dev__tab"><MiniApp size="tab" /></div>
              <div className="sx-dev__phone"><MiniApp size="phone" /></div>
              <span className="sx-dev__tag sx-dev__tag--1"><CreditCard size={14} />Plan upgrades</span>
              <span className="sx-dev__tag sx-dev__tag--2"><Users size={14} />Team roles</span>
            </div>
            <ul className="sx-dev__points">
              {["Same account on web, tablet and phone", "Team roles and permissions", "Responsive dashboards for every screen"].map((t) => (
                <li key={t}><Check size={15} aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================ TECH ============================ */}
        <section className="sx-sec sx-tech" aria-labelledby="sx-tech-h">
          <div className="container">
            <Head eyebrow="Technology" lead="Examples of technologies we use where they suit the project. Not every project needs every tool.">
              <span id="sx-tech-h">What we build SaaS platforms <em>with.</em></span>
            </Head>
            <div className="sx-tech__grid">
              {TECH.map((g) => (
                <div className="sx-tcol" key={g.group}>
                  <h3>{g.group}</h3>
                  <ul>
                    {g.items.map((it) => <li className="sx-pill" key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ WHY ============================ */}
        <section className="sx-sec sx-why" aria-labelledby="sx-why-h">
          <div className="container">
            <Head eyebrow="Why Sipher Web" lead="A SaaS product is never finished. That shapes how we scope the MVP, structure the code and plan the roadmap.">
              <span id="sx-why-h">Why work with us on <em>your SaaS product.</em></span>
            </Head>
            <div className="sx-bento" onPointerMove={spot}>
              {WHY.map((w) => (
                <article className={`sx-bcard ${w.cls}`} key={w.title}>
                  <span className="sx-bcard__ic"><w.icon size={22} aria-hidden="true" /></span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ BEFORE / AFTER ============================ */}
        <section className="sx-sec sx-ba" aria-labelledby="sx-ba-h">
          <div className="container">
            <Head center eyebrow="Before & after" lead="Activating accounts by hand and chasing renewals does not scale. A SaaS platform handles sign-up, plans and access automatically.">
              <span id="sx-ba-h">From manual sign-ups to <em>automated subscriptions.</em></span>
            </Head>
            <div className="sx-ba__board">
              <p className="sx-ba__caps" aria-hidden="true">
                <span className="sx-ba__cap sx-ba__cap--b">Activating accounts by hand…</span>
                <span className="sx-ba__cap sx-ba__cap--a">Handled by the platform</span>
              </p>
              <div className="sx-ba__head" aria-hidden="true">
                {["Customer", "Plan", "Paid", "Expiry", "Access"].map((h) => <span key={h}>{h}</span>)}
              </div>
              {BA_ROWS.map((r) => (
                <div className="sx-row" key={r.b[0]}>
                  <div className="sx-face sx-face--b">
                    {r.b.map((c, k) => <span key={k} className={/[?#]|expired/.test(c) ? "is-bad" : ""}>{c}</span>)}
                  </div>
                  <div className="sx-face sx-face--a">
                    {r.a.map((c, k) => <span key={k} className={k > 1 ? "is-good" : ""}>{c}</span>)}
                  </div>
                </div>
              ))}
              <span className="sx-ba__stamp sx-ba__stamp--b" aria-hidden="true">Expired!</span>
            </div>
          </div>
        </section>

        {/* ============================ INDUSTRIES ============================ */}
        <Industries />

        {/* ============================ HOSTING ============================ */}
        <Hosting />

        {/* ============================ CHECKS ============================ */}
        <Checks />

        {/* ============================ SCOPE ============================ */}
        <Scope />

        {/* ============================ STATEMENT ============================ */}
        <section className="sx-lit" aria-label="Our approach">
          <div className="container">
            <p className="sx-lit__text"><LitWords text={STATEMENT} /></p>
          </div>
        </section>

        {/* ============================ FAQ ============================ */}
        <Faq />

        {/* ============================ RELATED ============================ */}
        <section className="sx-sec sx-rel" aria-labelledby="sx-rel-h">
          <div className="container">
            <Head eyebrow="Related services" lead="A SaaS product works harder with the right services around it.">
              <span id="sx-rel-h">Make your SaaS product <em>work even harder.</em></span>
            </Head>
            <ul className="sx-rel__list">
              {RELATED.map((r) => (
                <li className="sx-rel__row" key={r.to}>
                  <Link to={r.to}>
                    <span className="sx-rel__thumb" aria-hidden="true"><Photo id={r.img} w={420} h={300} /></span>
                    <span className="sx-rel__t">{r.title}</span>
                    <span className="sx-rel__d">{r.text}</span>
                    <span className="sx-rel__go" aria-hidden="true"><ArrowUpRight size={20} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================ CTA ============================ */}
        <section className="sx-cta-sec" id="sx-contact">
          <div className="container">
            <div className="sx-cta">
              <span className="sx-cta__glow" aria-hidden="true" />
              <div className="sx-cta__inner">
                <div className="sx-cta__copy">
                  <p className="eyebrow"><span />Start the conversation</p>
                  <h2>Ready to turn your SaaS idea <em>into a product?</em></h2>
                  <p>Tell us about your customers, your idea and the outcome you want. We will help define a focused MVP.</p>
                  <Link className="sx-cta__btn sx-mag" to="/contact" data-cursor="START">
                    <span>Discuss your project</span>
                    <ArrowUpRight aria-hidden="true" size={20} />
                  </Link>
                </div>
                <ul className="sx-rl" aria-label="What happens next">
                  <li><Check size={15} aria-hidden="true" />We learn your customers and idea</li>
                  <li><Check size={15} aria-hidden="true" />We agree a focused MVP scope</li>
                  <li><Check size={15} aria-hidden="true" />You get a project-specific estimate</li>
                  <li className="sx-rl__live"><i aria-hidden="true" />Ready when you are</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}