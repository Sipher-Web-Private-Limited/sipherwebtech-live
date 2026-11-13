import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, ArrowUpRight, Gauge, HardDrive, Smartphone, Check, Receipt, ShieldCheck, Sparkles, Factory, Truck, Store, GraduationCap, Stethoscope, Briefcase, Workflow, LayoutDashboard, Code2, DatabaseZap, LifeBuoy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import TechStackRibbons, { type RibbonLaneConfig } from "../../components/TechStackRibbons";
import "../../styles/services/erp-crm.css";
import "../../styles/services/service-hero-consistency.css";

gsap.registerPlugin(ScrollTrigger);

const NAVY = "#100563";
const SOFT = "#fff8c4";
const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

function Photo({ id, w = 900, h, className, eager, alt = "" }: { id: string; w?: number; h?: number; className?: string; eager?: boolean; alt?: string }) {
  return (
    <img className={className} src={img(id, w)} alt={alt} width={w} height={h ?? Math.round(w * 0.66)} loading={eager ? "eager" : "lazy"} decoding="async"
      onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
  );
}

const Words = ({ text }: { text: string }) => (
  <>{text.split(" ").map((w, i) => <span key={i}><span className="erp-w"><span>{w}</span></span>{" "}</span>)}</>
);

function Head({ eyebrow, children, lead, center }: { eyebrow: string; children: ReactNode; lead?: string; center?: boolean }) {
  return (
    <div className={`erp-head${center ? " erp-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="erp-title">{children}</h2>
      {lead && <p className="erp-lead">{lead}</p>}
    </div>
  );
}

const ERP_RIBBON_LANES: readonly RibbonLaneConfig[] = [
  {
    label: "Core ERP and CRM Modules",
    className: "tech-ribbons__lane--technology",
    reverse: false,
    items: [
      "Sales Pipeline & CRM",
      "Live Inventory",
      "GST Invoicing & E-Way",
      "Order Processing",
      "Purchase & Vendors",
      "Accounts & Finance",
      "HR & Payroll",
      "Real-Time Dashboards",
      "Role-Based Access",
    ],
  },
  {
    label: "ERP Capabilities & Operations",
    className: "tech-ribbons__lane--disciplines",
    reverse: true,
    items: [
      "Multi-Branch Sync",
      "Custom Workflow Automation",
      "Tally & Banking APIs",
      "WhatsApp & SMS Alerts",
      "Barcode & Warehouse Scanning",
      "Audit Logs & Compliance",
      "Data Migration",
      "Cloud & On-Premises",
      "Secure Access Control",
    ],
  },
] as const;

const FLOW = [
  { tag: "Lead", t: "An enquiry lands in the CRM,", em: "with its owner.", p: "Website forms, calls and WhatsApp enquiries are captured once, assigned to a salesperson and followed up on time." },
  { tag: "Quote", t: "The quote uses live prices", em: "and real stock.", p: "Sales builds a quote from the product catalogue, so price lists, discounts and availability come from the same place the warehouse uses." },
  { tag: "Order", t: "A won deal becomes an order", em: "without retyping.", p: "One click turns the quote into a sales order, reserves stock and tells purchasing if something must be bought." },
  { tag: "Invoice", t: "Billing is generated,", em: "not rebuilt.", p: "GST invoices, payment reminders and receipts follow from the order, and accounts see the same figures sales quoted." },
  { tag: "Report", t: "Management sees the whole", em: "picture, live.", p: "Pipeline, stock, receivables and team performance are read straight from the data, not stitched together from spreadsheets." },
];
const LEDGER = ["Lead #214 · Sharma Traders · assigned to Ritu", "Quote Q-0391 · 40 units · price list B", "Order SO-1180 · stock reserved · 2 items short", "Invoice INV-2041 · GST applied · due in 15 days", "Dashboard updated · receivables, stock, pipeline"];


/* ---- PROCESS data (How we deliver) ---- */
const STEPS: Array<{
  t: string; short: string; w: string; p: string; img: string;
  icon: LucideIcon; out: string[];
}> = [
  {
    t: "Map the process", short: "Map", w: "Week 1", icon: Workflow,
    p: "We sit with sales, stores and accounts, write down how work really moves, and agree what the first release must cover.",
    out: ["Process map", "Module list", "Release scope"],
    img: "1522071820081-009f0129c71c",
  },
  {
    t: "Design the screens", short: "Design", w: "Weeks 2 to 3", icon: LayoutDashboard,
    p: "Data model, roles and a clickable prototype, so your team can try it before any code is written.",
    out: ["Data model", "Role matrix", "Clickable prototype"],
    img: "1551288049-bebda4e38f71",
  },
  {
    t: "Build in sprints", short: "Build", w: "Two-week cycles", icon: Code2,
    p: "Modules are built and demoed every sprint. You steer with working software and see progress each fortnight.",
    out: ["Working modules", "Sprint demos", "Change log"],
    img: "1461749280684-dccba630e2f6",
  },
  {
    t: "Migrate and train", short: "Migrate", w: "Before go-live", icon: DatabaseZap,
    p: "We rehearse the data move from spreadsheets or your old system, then train each role on its own screens.",
    out: ["Rehearsed data move", "Role-wise training", "Go-live checklist"],
    img: "1454165804606-c3d57bc86b40",
  },
  {
    t: "Support and grow", short: "Support", w: "After launch", icon: LifeBuoy,
    p: "Backups, monitoring and fixes continue, and new modules are added as the business grows.",
    out: ["Backups", "Monitoring", "New modules"],
    img: "1460925895917-afdab827c52f",
  },
];

const BVB = [
  {
    k: "Ready-made",
    route: "Route 01",
    sub: "Standard SaaS product",
    badge: "Fastest setup",
    t: "Fastest to start, least flexible",
    p: "Good when your process is standard. You adapt to the product, pay per user and accept its limits without custom code.",
    m: [90, 35, 40, 55],
    tags: ["1–2 weeks launch", "Fixed standard logic", "Vendor-hosted SaaS", "Capped by plan tiers"],
    f: [
      "Quick to launch with prebuilt workflows and forms",
      "Predictable monthly per-user subscription fees",
      "Spreadsheets or manual workarounds needed for unique steps",
    ],
    verdict: "Best for standard retail or small teams needing basic operations active immediately.",
  },
  {
    k: "Customised",
    route: "Route 02",
    sub: "Extensible core platform",
    badge: "Balanced approach",
    t: "A proven base, shaped to you",
    p: "Start from an established foundation and extend it with your own workflows, custom fields, reports and ecosystem integrations.",
    m: [65, 75, 70, 80],
    tags: ["4–8 weeks rollout", "Tailored to core flows", "Shared source control", "Modular expansion"],
    f: [
      "Much faster release cycle than starting from zero",
      "Covers 80–90% of your specific operational rules",
      "Some underlying platform constraints still remain",
    ],
    verdict: "Best for growing SMEs that have outgrown SaaS but need reasonable turnaround and budget.",
  },
  {
    k: "Custom build",
    route: "Route 03",
    sub: "Bespoke system architecture",
    badge: "Full ownership",
    t: "Built exactly around your work",
    p: "Best when your operational workflow, pricing engine or integrations give you a competitive edge. You own 100% of the code, database and IP.",
    m: [35, 98, 98, 95],
    tags: ["8–14 weeks rollout", "100% exact process fit", "Full code & DB ownership", "Unlimited scale & ₹0 per seat"],
    f: [
      "Fits your exact operational process with zero compromise",
      "You own all source code and data forever with zero per-seat fees",
      "Longer first release requiring dedicated sprint milestones",
    ],
    verdict: "Best for complex operations, unique business models, or teams aiming to eliminate recurring per-seat fees.",
  },
];
const METERS = ["Speed to launch", "Fit to your process", "Control and ownership", "Room to scale"];
const IND = [
  {
    icon: Factory,
    t: "Manufacturing",
    category: "Production & Assembly",
    p: "Bills of material, production orders, scrap tracking and real-time raw material stock.",
    tags: ["BOM & Routing", "Batch Tracking", "Job Costing"],
    img: "1581091226825-a6a2a5aee158",
  },
  {
    icon: Truck,
    t: "Distribution",
    category: "Wholesale & Logistics",
    p: "Tiered wholesale price lists, bulk sales orders, credit aging and automated dispatch.",
    tags: ["Price Lists", "Credit Limits", "E-Way & Dispatch"],
    img: "1586528116311-ad8dd3c8310d",
  },
  {
    icon: Store,
    t: "Retail & Multi-store",
    category: "Omnichannel Billing",
    p: "Synchronised central inventory, rapid POS barcode checkout and customer loyalty points.",
    tags: ["Multi-Store Sync", "Barcode POS", "Customer Loyalty"],
    img: "1556742049-0cfed4f6a45d",
  },
  {
    icon: GraduationCap,
    t: "Education & Institutes",
    category: "Academies & Campuses",
    p: "Student inquiry CRM, admission pipelines, fee installment tracking and batch attendance.",
    tags: ["Inquiry Pipeline", "Fee Schedules", "Batch Management"],
    img: "1524178232363-1fb2b075b655",
  },
  {
    icon: Stethoscope,
    t: "Healthcare & Clinics",
    category: "OPD & Diagnostics",
    p: "Doctor OPD scheduling, digital patient case records, prescription history and pharmacy billing.",
    tags: ["OPD Scheduling", "EHR Case Records", "Pharmacy Billing"],
    img: "1576091160399-112ba8d25d1d",
  },
  {
    icon: Briefcase,
    t: "Professional Services",
    category: "Agencies & Consultancies",
    p: "Deal pipeline, project milestones, resource timesheets and automated GST invoicing.",
    tags: ["Lead Pipeline", "Milestone Billing", "GST Invoicing"],
    img: "1522071820081-009f0129c71c",
  },
];
const QUAL = [
  { icon: ShieldCheck, t: "Access control", p: "Role-based permissions and activity logs.", pts: ["Role-based permissions", "Activity logs"] },
  { icon: HardDrive, t: "Backups", p: "Scheduled backups with a tested recovery plan.", pts: ["Scheduled backups", "Tested recovery"] },
  { icon: Gauge, t: "Speed", p: "Indexed data and lean queries, so lists stay quick.", pts: ["Indexed data", "Lean queries"] },
  { icon: Smartphone, t: "Any device", p: "Responsive screens for desk, tablet and phone.", pts: ["Desk", "Tablet", "Phone"] },
  { icon: Activity, t: "Monitoring", p: "Logs and alerts that surface problems early.", pts: ["Logs", "Alerts"] },
  { icon: Receipt, t: "Audit trail", p: "Who changed what, and when, on every record.", pts: ["Who", "What", "When"] },
];
const REL: RelatedServiceItem[] = [
  {
    to: "/services/ecommerce",
    title: "E-commerce stores",
    text: "Orders flow straight into ERP inventory and billing.",
    img: "/new-images/services/webdev/related-ecommerce.webp",
  },
  {
    to: "/services/web-development",
    title: "Web development",
    text: "Fast, search-friendly websites and portals.",
    img: "/new-images/services/webdev/related-web-development.webp",
  },
  {
    to: "/services/software-development",
    title: "Custom software",
    text: "Software shaped around your process.",
    img: "/new-images/services/webdev/related-custom-software.webp",
  },
  {
    to: "/services/ui-ux",
    title: "UI/UX design",
    text: "Interfaces that feel obvious and look great.",
    img: "/new-images/services/webdev/related-ui-ux.webp",
  },
];


const SITE = "https://sipherweb.in"; /* confirm production domain */
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service", name: "Software Development", serviceType: "ERP and CRM development", url: `${SITE}/services/erp-crm`,
      description: "Custom ERP and CRM software for sales, inventory, billing, accounts and reporting, with data migration, training and ongoing support.",
      provider: { "@type": "Organization", name: "Sipher Web Pvt. Ltd.", url: SITE },
      areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: "ERP & CRM", item: `${SITE}/services/erp-crm` },
    ] },
  ],
};

export default function ErpCrm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [bvb, setBvb] = useState(0);
  const bvbFirst = useRef(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => Array.from(c.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => c.querySelector<T>(s) as T;
    const mm = gsap.matchMedia(root);

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)", fine: "(hover: hover) and (pointer: fine)" }, (ctx) => {
      const { motion, wide } = ctx.conditions as unknown as { motion: boolean; wide: boolean; fine: boolean };
      if (!motion) return;
      const off: Array<() => void> = [];
      root.classList.add("is-motion");

      /* ---- HERO: title and supplied ERP illustration reveal ---- */
      {
        const breadcrumb = $(".erp-hero .breadcrumb");
        const titleWords = $(".erp-hero__title .erp-w > span");
        const leadCta = $(".erp-hero__lead, .erp-hero__cta > *");
        const illustration = one(".erp-hero__illustration");
        const visual = one(".erp-hero__visual");
        const hero = one(".erp-hero");

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        if (breadcrumb.length) tl.from(breadcrumb, { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" });
        if (titleWords.length) tl.from(titleWords, { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1);
        if (leadCta.length) tl.from(leadCta, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08, clearProps: "all" }, 0.55);
        if (illustration) tl.fromTo(illustration, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath" }, 0.2);
        if (visual && hero) gsap.to(visual, { yPercent: -5, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      }

      /* ---- PINNED SCENE: one deal through CRM, hub and ERP ---- */
      {
        const section = one(".erp-scene"), steps = $(".erp-sstep"), counter = one(".erp-scene__count"), bar = one(".erp-scene__bar i");
        const pk = one(".erp-pk"), led = $(".erp-led li"), wrap = one(".erp-steps");
        if (section && steps.length && counter && bar && pk && wrap) {
          const fit = () => { wrap.style.height = ""; wrap.style.height = `${Math.max(...steps.map((k) => k.offsetHeight))}px`; };
          ScrollTrigger.addEventListener("refreshInit", fit); fit();
          off.push(() => { ScrollTrigger.removeEventListener("refreshInit", fit); wrap.style.height = ""; });

          $(".erp-pf").forEach((p) => { const L = (p as unknown as SVGPathElement).getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set(led, { opacity: 0.35, x: -10 });
          if (led[0]) {
            led[0].classList.add("is-live");
            gsap.set(led[0], { opacity: 1, x: 0 });
          }
          gsap.set(pk, { autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top top", end: "+=480%", scrub: 1, pin: true, anticipatePin: 1, onUpdate: (s) => { bar.style.transform = `scaleX(${Math.max(0.03, s.progress)})`; } },
          });

          const send = (id: number, at: number, node: string) => {
            const path = one<SVGPathElement>(`#a${id}`);
            if (!path) return;
            const L = path.getTotalLength(), o = { t: 0 };
            tl.to(`#f${id}`, { strokeDashoffset: 0, duration: 0.9, ease: "none" }, at)
              .set(pk, { autoAlpha: 1 }, at)
              .to(o, { t: 1, duration: 0.9, ease: "power1.inOut", onUpdate: () => { const q = path.getPointAtLength(o.t * L); pk.setAttribute("cx", String(q.x)); pk.setAttribute("cy", String(q.y)); } }, at)
              .to(pk, { autoAlpha: 0, duration: 0.1 }, at + 0.9)
              .to(`#${node} rect`, { fill: SOFT, stroke: NAVY, duration: 0.3 }, at + 0.85);
          };

          const PLAN: Array<Array<[number, string]>> = [[[0, "hub"]], [[1, "hub"]], [[2, "n2"], [3, "n3"]], [[4, "n4"]], [[5, "n5"]]];
          PLAN.forEach((hops, i) => {
            const at = i * 2.8;
            if (i < 3) tl.to(`#n${i} rect`, { fill: SOFT, stroke: NAVY, duration: 0.3 }, at);
            hops.forEach(([id, node], k) => send(id, at + 0.3 + k * 1.0, node));
            if (led[i]) {
              tl.to(led[i], {
                opacity: 1,
                x: 0,
                duration: 0.45,
                onStart: () => led[i]?.classList.add("is-live"),
                onReverseComplete: () => {
                  if (i > 0) led[i]?.classList.remove("is-live");
                },
              }, at + 1.1);
            }
            if (i < PLAN.length - 1) {
              tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at + 2.2)
                .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 2.5)
                .call(() => { counter.textContent = `0${i + 2} / 05`; }, undefined, at + 2.5)
                .call(() => { counter.textContent = `0${i + 1} / 05`; }, undefined, at + 2.19);
            }
          });
          tl.to({}, { duration: 1 });
        }
      }

      /* ---- PROCESS: rail + line progress, sticky image follows the active step ---- */
      {
        const pline = one(".erp-pline i"), plist = one(".erp-plist");
        const imgs = $(".erp-pimg"), items = $(".erp-pstep");

        if (pline && plist) {
          gsap.fromTo(pline, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: plist, start: "top 60%", end: "bottom 60%", scrub: true } });
        }

        const setActive = (i: number) => {
          items.forEach((x, k) => { x.classList.toggle("is-on", k === i); x.classList.toggle("is-done", k < i); });
        };

        if (wide) gsap.set(imgs.slice(1), { autoAlpha: 0 });

        items.forEach((s, i) => ScrollTrigger.create({
          trigger: s, start: "top 55%", end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            setActive(i);
            if (wide) imgs.forEach((im, k) => gsap.to(im, { autoAlpha: k === i ? 1 : 0, scale: k === i ? 1 : 1.07, duration: 0.7, overwrite: true }));
          },
        }));
        if (items.length) setActive(0);
      }

      /* ---- INDUSTRIES ---- */
      const reveals = $("[data-reveal]");
      gsap.set(reveals, { autoAlpha: 0, y: 32 });
      ScrollTrigger.batch(reveals, { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", clearProps: "all" }) });

      return () => { off.forEach((f) => f()); root.classList.remove("is-motion"); };
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => { window.removeEventListener("load", refresh); mm.revert(); };
  }, []);

  useLayoutEffect(() => {
    if (bvbFirst.current) { bvbFirst.current = false; return; }
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".erp-meter i", { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" });
      gsap.fromTo(".erp-bvb__info > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, clearProps: "all" });
      gsap.fromTo(".erp-bvb__card", { autoAlpha: 0.7, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
    }, root);
    return () => ctx.revert();
  }, [bvb]);

  return (
    <>
      <Seo
        title="ERP & CRM Software Development Company in Indore | Sipher Webtech"
        description="Custom ERP and CRM software for sales, inventory, GST billing, accounts and reporting. Built around your workflow, with data migration, training and support. Get a free consultation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="erp" ref={rootRef}>
        <section className="erp-hero" aria-labelledby="erp-h1">
          <div className="container erp-hero__grid">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">ERP &amp; CRM</span>
              </nav>
              <h1 id="erp-h1" className="erp-hero__title" aria-label="Software your whole team actually uses.">
                <span className="erp-line" aria-hidden="true"><Words text="Software that" /></span>
                <em className="erp-line" aria-hidden="true"><Words text="your whole team uses." /></em>
              </h1>
              <p className="erp-hero__lead">Sipher Web designs and builds custom ERP and CRM systems for growing businesses in Indore and across India. Sales, stock, billing and accounts share one database, so every quote, order and invoice is entered once and trusted everywhere.</p>
              <div className="erp-hero__cta">
                <Link className="button button--primary" to="/contact" data-cursor="START"><span>Plan your system</span><ArrowRight aria-hidden="true" size={18} /></Link>
                <a className="erp-ghost" href="#erp-scene">Follow one deal</a>
              </div>
              <ul className="erp-trust">{["One shared database", "Role-based access", "GST-ready billing", "Migration and training"].map((t) => <li key={t}><Check aria-hidden="true" size={15} />{t}</li>)}</ul>
            </div>

            <div className="erp-hero__visual">
              <img className="erp-hero__illustration" src="/svg/erp-crm-hero-v2.svg" alt="ERP and CRM dashboard with sales, inventory and business reports" width={640} height={590} fetchPriority="high" decoding="async" />
            </div>
          </div>
        </section>

        {/* =========================== TECH STACK RIBBONS =========================== */}
        <TechStackRibbons lanes={ERP_RIBBON_LANES} />

        <section className="erp-scene" id="erp-scene" aria-label="How one deal moves through your ERP and CRM">
          <div className="container erp-scene__grid">
            <div>
              <h2 className="erp-sr">Follow one deal from enquiry to report</h2>
              <div className="erp-steps">
                {FLOW.map((s) => (
                  <div className="erp-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.t} <em>{s.em}</em></h3>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
              <p className="erp-scene__count" aria-hidden="true">01 / 05</p>
              <span className="erp-scene__bar" aria-hidden="true"><i /></span>
            </div>

            <div className="erp-stage" aria-hidden="true">
              <svg className="erp-dg" viewBox="0 0 640 340">
                <defs>
                  <filter id="erp-node-shadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#100563" floodOpacity="0.08" />
                  </filter>
                  <filter id="erp-hub-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#100563" floodOpacity="0.22" />
                  </filter>
                </defs>
                <g fill="none">
                  {["M135,60C190,60 200,150 245,150", "M135,170H245", "M135,280C190,280 200,190 245,190", "M395,150C440,150 440,60 470,60", "M395,170H470", "M395,190C440,190 440,280 470,280"].map((d, i) => (
                    <g key={i}><path id={`a${i}`} className="erp-ln" d={d} /><path id={`f${i}`} className="erp-pf" d={d} /></g>
                  ))}
                </g>
                <g id="hub" className="erp-node erp-node--hub">
                  <rect x="245" y="116" width="150" height="108" rx="22" filter="url(#erp-hub-shadow)" />
                  <text x="320" y="160" className="erp-hub__sub">ONE SHARED</text>
                  <text x="320" y="184" className="erp-hub__main">DATABASE</text>
                </g>
                {[["CRM · Lead", 10, 32], ["CRM · Quote", 10, 142], ["CRM · Deal won", 10, 252], ["ERP · Stock", 470, 32], ["ERP · Invoice", 470, 142], ["ERP · Reports", 470, 252]].map(([l, x, y], i) => (
                  <g className="erp-node" id={`n${i}`} key={l as string}>
                    <rect x={x as number} y={y as number} width="140" height="56" rx="16" filter="url(#erp-node-shadow)" />
                    <text x={(x as number) + 70} y={(y as number) + 34}>{l}</text>
                  </g>
                ))}
                <circle className="erp-pk" r="9.5" cx="0" cy="0" />
              </svg>

              <div className="erp-led-card">
                <div className="erp-led-head">
                  <div className="erp-led-head__dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="erp-led-head__title">Live Transaction Ledger</span>
                  <span className="erp-led-head__status"><i /> Real-time Sync</span>
                </div>
                <ul className="erp-led">
                  {LEDGER.map((l, i) => (
                    <li key={l} className={i === 0 ? "is-live" : ""}>
                      <span className="erp-led__num" aria-hidden="true">0{i + 1}</span>
                      <Check size={14} aria-hidden="true" />
                      <span className="erp-led__txt">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="erp-section erp-bvbsec" aria-labelledby="erp-bvb-h">
          <div className="container">
            <Head center eyebrow="Build or buy" lead="There is no single right answer. Pick an option to see the trade-off, then we compare them against your process before recommending one.">
              <span id="erp-bvb-h">Three routes, <em>one honest comparison.</em></span>
            </Head>
            <div className="erp-bvb" data-reveal>
              <div className="erp-bvb__tabs" role="tablist" aria-label="Build or buy options">
                {BVB.map((b, i) => (
                  <button
                    key={b.k}
                    type="button"
                    role="tab"
                    aria-selected={bvb === i}
                    className={`erp-bvb__tab${bvb === i ? " is-on" : ""}`}
                    onClick={() => setBvb(i)}
                  >
                    <span className="erp-bvb__tab-badge">{b.route}</span>
                    <span className="erp-bvb__tab-body">
                      <span className="erp-bvb__tab-title">{b.k}</span>
                      <span className="erp-bvb__tab-sub">{b.badge}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="erp-bvb__panel" role="tabpanel">
                <div className="erp-bvb__info">
                  <div className="erp-bvb__route-meta">
                    <span className="erp-bvb__route-tag">{BVB[bvb].route}</span>
                    <span className="erp-bvb__route-sub">{BVB[bvb].sub}</span>
                  </div>
                  <h3 className="erp-bvb__title">{BVB[bvb].t}</h3>
                  <p className="erp-bvb__desc">{BVB[bvb].p}</p>
                  <div className="erp-bvb__features-label">Key trade-offs & realities:</div>
                  <ul className="erp-bvb__features">
                    {BVB[bvb].f.map((f) => (
                      <li key={f} className="erp-bvb__feature">
                        <span className="erp-bvb__feature-icon" aria-hidden="true">
                          <Check size={14} />
                        </span>
                        <span className="erp-bvb__feature-text">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="erp-bvb__card">
                  <div className="erp-bvb__card-head">
                    <div>
                      <span className="erp-bvb__card-title">Capability Scorecard</span>
                      <span className="erp-bvb__card-sub">Comparative rating for {BVB[bvb].k}</span>
                    </div>
                    <span className="erp-bvb__card-badge">{BVB[bvb].badge}</span>
                  </div>
                  <div className="erp-meter">
                    {METERS.map((m, i) => (
                      <div key={m} className="erp-meter__item">
                        <div className="erp-meter__meta">
                          <span className="erp-meter__label">{m}</span>
                          <span className="erp-meter__tag">{BVB[bvb].tags[i]}</span>
                          <span className="erp-meter__score">{BVB[bvb].m[i]}%</span>
                        </div>
                        <div className="erp-meter__track" aria-hidden="true">
                          <i style={{ width: `${BVB[bvb].m[i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="erp-bvb__verdict">
                    <span className="erp-bvb__verdict-icon" aria-hidden="true">
                      <Sparkles size={16} />
                    </span>
                    <p className="erp-bvb__verdict-body">{BVB[bvb].verdict}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="erp-section erp-inds" aria-labelledby="erp-ind-h">
          <div className="container">
            <Head center eyebrow="Who we build for" lead="Examples of where this kind of system helps. These are possible uses, not client case studies.">
              <span id="erp-ind-h">Built for businesses that <em>run on process.</em></span>
            </Head>
            <div className="erp-indgrid">
              {IND.map((x, i) => (
                <article className="erp-ind" key={x.t} data-reveal>
                  <div className="erp-ind__media">
                    <Photo id={x.img} w={800} h={540} alt={`${x.t} business using ERP and CRM software`} />
                    <span className="erp-ind__category">{x.category}</span>
                  </div>
                  <div className="erp-ind__pill">
                    <span className="erp-ind__pill-no">0{i + 1}</span>
                    <div className="erp-ind__pill-info">
                      <h3 className="erp-ind__pill-title">{x.t}</h3>
                      <p className="erp-ind__pill-desc">{x.p}</p>
                    </div>
                    <span className="erp-ind__pill-btn" aria-hidden="true" title={x.t}>
                      <x.icon size={16} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== HOW WE DELIVER (modern) =========================== */}
        <section className="erp-section erp-proc" aria-labelledby="erp-proc-h">
          <div className="container">
            <Head center eyebrow="How we deliver" lead="Five stages from process mapping to go-live, with working software demoed every sprint.">
              <span id="erp-proc-h">Five stages, <em>working software at each.</em></span>
            </Head>

            <div className="erp-proc__grid">
              {/* steps */}
              <div className="erp-plist">
                <span className="erp-pline" aria-hidden="true"><i /></span>
                {STEPS.map((s, i) => (
                  <article className={`erp-pstep${i === 0 ? " is-on" : ""}`} key={s.t}>
                    <span className="erp-pstep__dot" aria-hidden="true">
                      <b>{i + 1}</b>
                      <Check size={18} strokeWidth={3} />
                    </span>

                    <div className="erp-pstep__thumb" aria-hidden="true">
                      <Photo id={s.img} w={720} h={360} />
                    </div>

                    <header className="erp-pstep__head">
                      <span className="erp-pstep__ic" aria-hidden="true"><s.icon size={20} /></span>
                      <div className="erp-pstep__tt">
                        <span className="erp-pstep__no">Stage 0{i + 1}</span>
                        <h3>{s.t}</h3>
                      </div>
                    </header>

                    <p>{s.p}</p>

                    <ul className="erp-pstep__out" aria-label="What you get">
                      {s.out.map((o) => <li key={o}><Check size={12} strokeWidth={3} aria-hidden="true" />{o}</li>)}
                    </ul>

                  </article>
                ))}
              </div>

              {/* sticky visual */}
              <div className="erp-pimgs" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <div className="erp-pimg" key={s.t}>
                    <Photo id={s.img} w={900} h={1000} />
                    <span className="erp-pimg__shade" />
                    <div className="erp-pimg__seg">
                      {STEPS.map((_, k) => <i key={k} className={k <= i ? "is-fill" : ""} />)}
                    </div>
                    <span className="erp-pimg__count">Stage <b>0{i + 1}</b> of 05</span>
                    <div className="erp-pimg__cap">
                      <span className="erp-pimg__capic"><s.icon size={22} /></span>
                      <div>
                        <strong>{s.t}</strong>
                        <em>{s.out.join("  ·  ")}</em>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="erp-section erp-qual" aria-labelledby="erp-q-h">
          <div className="container">
            <Head center eyebrow="Built to be trusted" lead="No system is completely bug-free or secure. These practices reduce risk and make problems easier to find and fix.">
              <span id="erp-q-h">What keeps a business system <em>safe and dependable.</em></span>
            </Head>
            <div className="erp-qgrid">
              {QUAL.map((q) => (
                <article className="erp-q" key={q.t} data-reveal>
                  <span className="erp-q__ic" aria-hidden="true"><q.icon size={24} /></span>
                  <h3>{q.t}</h3>
                  <p>{q.p}</p>
                  <ul className="erp-q__pts" aria-label={`${q.t} practices`}>
                    {q.pts.map((x) => <li key={x}><Check size={12} strokeWidth={3} aria-hidden="true" />{x}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RelatedServicesSection
          items={REL}
          lead="An ERP works best with the right partners around it. Pick a service below and see how it helps you connect, streamline and scale operations."
        />
      </div>
    </>
  );
}