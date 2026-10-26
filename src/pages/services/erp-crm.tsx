import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, ArrowUpRight, BarChart3, Gauge, HardDrive, Smartphone, Boxes, Check, ChevronRight, Plus, Receipt, ShieldCheck, Users, Wallet } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/erp-crm.css";

gsap.registerPlugin(ScrollTrigger);

const NAVY = "#100563";
const SOFT = "#fff8c4";
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
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

const MARQUEE = ["Sales pipeline", "Quotes and orders", "Inventory", "Purchasing", "GST invoicing", "Accounts", "HR and payroll", "Reports", "Role-based access"];
const COLS = ["New enquiry", "Quote sent", "Order won"];

const FLOW = [
  { tag: "Lead", t: "An enquiry lands in the CRM,", em: "with its owner.", p: "Website forms, calls and WhatsApp enquiries are captured once, assigned to a salesperson and followed up on time." },
  { tag: "Quote", t: "The quote uses live prices", em: "and real stock.", p: "Sales builds a quote from the product catalogue, so price lists, discounts and availability come from the same place the warehouse uses." },
  { tag: "Order", t: "A won deal becomes an order", em: "without retyping.", p: "One click turns the quote into a sales order, reserves stock and tells purchasing if something must be bought." },
  { tag: "Invoice", t: "Billing is generated,", em: "not rebuilt.", p: "GST invoices, payment reminders and receipts follow from the order, and accounts see the same figures sales quoted." },
  { tag: "Report", t: "Management sees the whole", em: "picture, live.", p: "Pipeline, stock, receivables and team performance are read straight from the data, not stitched together from spreadsheets." },
];
const LEDGER = ["Lead #214 · Sharma Traders · assigned to Ritu", "Quote Q-0391 · 40 units · price list B", "Order SO-1180 · stock reserved · 2 items short", "Invoice INV-2041 · GST applied · due in 15 days", "Dashboard updated · receivables, stock, pipeline"];

const MODULES = [
  { icon: Users, big: true, title: "CRM and sales pipeline", text: "Capture every enquiry, assign an owner, schedule follow-ups and send quotes from one place. Managers see the real pipeline, not a guess.", img: "1553729459-efe14ef6055d" },
  { icon: Boxes, big: true, title: "Inventory and purchasing", text: "Track stock across godowns and stores, set reorder levels, raise purchase orders and know what is available before you promise it.", img: "1586528116311-ad8dd3c8310d" },
  { icon: Receipt, title: "GST billing", text: "Quotes, invoices, credit notes and payment reminders generated from the order, never retyped." },
  { icon: Wallet, title: "Accounts", text: "Receivables, payables and ledgers that match what sales and stores recorded." },
  { icon: BarChart3, title: "Reports and dashboards", text: "Owner KPIs, sales targets and receivable ageing, live from your own data." },
  { icon: ShieldCheck, title: "Roles and approvals", text: "Each person sees only what their job needs, and every change leaves an audit trail." },
];

const STATEMENT = "The best ERP is the one your team opens every morning. We design software around how your people already work, then remove the busywork.";

const STEPS = [
  { t: "Map the process", w: "Week 1", p: "We sit with sales, stores and accounts, write down how work really moves, and agree what the first release must cover.", img: "1522071820081-009f0129c71c" },
  { t: "Design the screens", w: "Weeks 2 to 3", p: "Data model, roles and a clickable prototype, so your team can try it before any code is written.", img: "1551288049-bebda4e38f71" },
  { t: "Build in sprints", w: "Two-week cycles", p: "Modules are built and demoed every sprint. You steer with working software and see progress each fortnight.", img: "1461749280684-dccba630e2f6" },
  { t: "Migrate and train", w: "Before go-live", p: "We rehearse the data move from spreadsheets or your old system, then train each role on its own screens.", img: "1454165804606-c3d57bc86b40" },
  { t: "Support and grow", w: "After launch", p: "Backups, monitoring and fixes continue, and new modules are added as the business grows.", img: "1460925895917-afdab827c52f" },
];

const BVB = [
  { k: "Ready-made", t: "Fastest to start, least flexible", p: "Good when your process is standard. You adapt to the product, pay per user and accept its limits.", m: [90, 35, 40, 55], f: ["Quick to launch", "Monthly per-user fees", "Workarounds for unusual steps"] },
  { k: "Customised", t: "A proven base, shaped to you", p: "Start from an existing platform and extend it with your workflows, reports and integrations.", m: [65, 65, 65, 70], f: ["Faster than a full build", "Some platform limits remain", "Good middle path"] },
  { k: "Custom build", t: "Built exactly around your work", p: "Best when workflow, pricing or integrations are unique. You own the code and the data.", m: [35, 95, 95, 85], f: ["Fits your process exactly", "You own code and data", "Longer first release"] },
];
const METERS = ["Speed to launch", "Fit to your process", "Control and ownership", "Room to scale"];
const IND = [
  { t: "Manufacturing", p: "Bills of material, production orders and stock.", img: "1586528116311-ad8dd3c8310d" },
  { t: "Distribution", p: "Price lists, bulk orders and receivables.", img: "1553729459-efe14ef6055d" },
  { t: "Retail", p: "Multi-store stock, billing and loyalty.", img: "1556742049-0cfed4f6a45d" },
  { t: "Education", p: "Enquiries, admissions, fees and batches.", img: "1523050854058-8df90110c9f1" },
  { t: "Clinics", p: "Appointments, billing and patient records.", img: "1576091160399-112ba8d25d1d" },
  { t: "Services", p: "Leads, projects, timesheets and invoicing.", img: "1522071820081-009f0129c71c" },
];
const QUAL = [
  { icon: ShieldCheck, t: "Access control", p: "Role-based permissions and activity logs." },
  { icon: HardDrive, t: "Backups", p: "Scheduled backups with a tested recovery plan." },
  { icon: Gauge, t: "Speed", p: "Indexed data and lean queries, so lists stay quick." },
  { icon: Smartphone, t: "Any device", p: "Responsive screens for desk, tablet and phone." },
  { icon: Activity, t: "Monitoring", p: "Logs and alerts that surface problems early." },
  { icon: Receipt, t: "Audit trail", p: "Who changed what, and when, on every record." },
];
const REL = [
  { to: "/services/ecommerce", t: "E-commerce", p: "Connect a store to your stock and billing.", img: "1556742049-0cfed4f6a45d" },
  { to: "/services/mobile-app-development", t: "Mobile apps", p: "Field sales and approvals on the phone.", img: "1512941937669-90a1b58e7e9c" },
  { to: "/services/software-development", t: "Custom software", p: "Portals and tools around your ERP.", img: "1555066931-4365d14bab8c" },
  { to: "/services/ui-ux", t: "UI/UX design", p: "Screens your team finds obvious.", img: "1558655146-9f40138edfeb" },
];

const FAQ = [
  { q: "What is the difference between an ERP and a CRM?", a: "A CRM manages customers: enquiries, follow-ups, quotes and the sales pipeline. An ERP manages operations: stock, purchasing, billing and accounts. Built on one database, they let a won deal flow straight into an order, an invoice and a report." },
  { q: "Should we build a custom ERP or buy a ready-made one?", a: "Ready-made products suit standard processes and start quickly. Custom software makes sense when your workflow, pricing or integrations are unusual and workarounds are piling up. We compare both against your process before recommending either." },
  { q: "Can you build only the CRM, or only inventory first?", a: "Yes. Most projects start with the one or two modules that hurt most and grow from there. We design the data model so new modules plug in later without a rebuild." },
  { q: "Can it connect to Tally, our website, WhatsApp or payment gateways?", a: "Usually, through APIs or scheduled import and export. Availability, access approvals and fees depend on each provider, and we confirm what is possible during discovery." },
  { q: "Can you move our data from spreadsheets or an old system?", a: "Often yes. We clean and map your data, rehearse the migration on a copy, and check totals with you before go-live so nothing is lost." },
  { q: "How do you keep our business data secure?", a: "Role-based access, validated inputs, activity logs and scheduled backups with a tested recovery plan. Requirements specific to your industry are discussed up front. No system is risk-free, so we also plan monitoring." },
  { q: "How long does an ERP or CRM project take, and what does it cost?", a: "It depends on the number of modules, users, integrations and data to migrate. After discovery we give an itemised estimate, and we often suggest a focused first release so your team gets working software sooner." },
  { q: "Do you provide training and support after launch?", a: "Yes. We train each role on its own screens, then arrange maintenance, fixes and new features under an agreed support plan." },
];

const SITE = "https://sipherweb.in"; /* confirm production domain */
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service", name: "ERP and CRM Software Development", serviceType: "ERP and CRM development", url: `${SITE}/services/erp-crm`,
      description: "Custom ERP and CRM software for sales, inventory, billing, accounts and reporting, with data migration, training and ongoing support.",
      provider: { "@type": "Organization", name: "Sipher Web Pvt. Ltd.", url: SITE },
      areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: "ERP & CRM", item: `${SITE}/services/erp-crm` },
    ] },
    { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

function FaqItem({ q, a, id, open, onToggle }: { q: string; a: string; id: string; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) { first.current = false; gsap.set(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 }); return; }
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0, duration: calm ? 0 : 0.5, ease: "power3.inOut" });
  }, [open]);
  return (
    <div className={`erp-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-b`} id={`${id}-t`} onClick={onToggle}>
          <span>{q}</span><i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="erp-faq__body" id={`${id}-b`} role="region" aria-labelledby={`${id}-t`} ref={ref}><p>{a}</p></div>
    </div>
  );
}

export default function ErpCrm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [bvb, setBvb] = useState(0);
  const bvbFirst = useRef(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => Array.from(c.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => c.querySelector<T>(s) as T;
    const mm = gsap.matchMedia(root);

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)", fine: "(hover: hover) and (pointer: fine)" }, (ctx) => {
      const { motion, wide, fine } = ctx.conditions as unknown as { motion: boolean; wide: boolean; fine: boolean };
      if (!motion) return;
      const off: Array<() => void> = [];
      root.classList.add("is-motion");

      gsap.to(one(".erp-progress i"), { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

      /* ---- HERO: title reveal, then a deal travels the pipeline on loop ---- */
      {
        const deal = one(".erp-deal"), won = one(".erp-won"), toast = one(".erp-toast"), v = { n: 0 };
        gsap.set(toast, { autoAlpha: 0 });
        gsap.timeline({ defaults: { ease: "power4.out" } })
          .from($(".erp-crumb, .erp-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
          .from($(".erp-hero__title .erp-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".erp-hero__lead, .erp-hero__cta > *"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08, clearProps: "all" }, 0.55)
          .fromTo(one(".erp-hero__photo"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath" }, 0.2)
          .from(one(".erp-board"), { y: 60, autoAlpha: 0, rotateX: 14, transformPerspective: 900, duration: 1.1, clearProps: "all" }, 0.6);

        const loop = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: 0.6 });
        loop.fromTo(deal, { left: "3%", autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" })
          .to(deal, { left: "35.5%", duration: 0.9, ease: "power3.inOut" }, "+=1")
          .to(deal, { left: "68%", duration: 0.9, ease: "power3.inOut" }, "+=1")
          .to(v, { n: 480000, duration: 1, ease: "power2.out", onUpdate: () => { won.textContent = inr(v.n); } }, "<0.5")
          .to(toast, { autoAlpha: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, "<")
          .to([deal, toast], { autoAlpha: 0, duration: 0.4 }, "+=1.8")
          .call(() => { v.n = 0; won.textContent = inr(0); });
        off.push(() => loop.kill());
        gsap.to(one(".erp-hero__visual"), { yPercent: -5, ease: "none", scrollTrigger: { trigger: one(".erp-hero"), start: "top top", end: "bottom top", scrub: true } });
      }

      const mq = gsap.to(one(".erp-marquee__track"), { xPercent: -50, repeat: -1, duration: 34, ease: "none" });
      ScrollTrigger.create({ onUpdate: (s) => { mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5)); gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true }); } });

      /* ---- PINNED SCENE: one deal through CRM, hub and ERP ---- */
      {
        const section = one(".erp-scene"), steps = $(".erp-sstep"), counter = one(".erp-scene__count"), bar = one(".erp-scene__bar i");
        const pk = one(".erp-pk"), led = $(".erp-led li"), wrap = one(".erp-steps");
        const fit = () => { wrap.style.height = ""; wrap.style.height = `${Math.max(...steps.map((k) => k.offsetHeight))}px`; };
        ScrollTrigger.addEventListener("refreshInit", fit); fit();
        off.push(() => { ScrollTrigger.removeEventListener("refreshInit", fit); wrap.style.height = ""; });

        $(".erp-pf").forEach((p) => { const L = (p as unknown as SVGPathElement).getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
        gsap.set(led, { autoAlpha: 0, x: -16 });
        gsap.set(pk, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: section, start: "top top", end: "+=480%", scrub: 1, pin: true, anticipatePin: 1, onUpdate: (s) => { bar.style.transform = `scaleX(${Math.max(0.03, s.progress)})`; } },
        });

        const send = (id: number, at: number, node: string) => {
          const path = one<SVGPathElement>(`#a${id}`), L = path.getTotalLength(), o = { t: 0 };
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
          tl.to(led[i], { autoAlpha: 1, x: 0, duration: 0.5 }, at + 1.1);
          if (i < PLAN.length - 1) {
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at + 2.2)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 2.5)
              .call(() => { counter.textContent = `0${i + 2} / 05`; }, undefined, at + 2.5)
              .call(() => { counter.textContent = `0${i + 1} / 05`; }, undefined, at + 2.19);
          }
        });
        tl.to({}, { duration: 1 });
      }

      /* ---- MODULES: cursor spotlight ---- */
      if (fine) {
        $(".erp-mod").forEach((c) => {
          const mv = (e: PointerEvent) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`); };
          c.addEventListener("pointermove", mv);
          off.push(() => c.removeEventListener("pointermove", mv));
        });
      }
      $(".erp-mod__img img").forEach((im) =>
        gsap.fromTo(im, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: im, start: "top bottom", end: "bottom top", scrub: true } }));

      /* ---- STATEMENT ---- */
      {
        const words = $(".erp-lit__w");
        gsap.set(words, { opacity: 0.14 });
        gsap.to(words, { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: one(".erp-lit__text"), start: "top 80%", end: "bottom 45%", scrub: true } });
      }

      /* ---- PROCESS: line draws, sticky image follows the active step ---- */
      {
        gsap.fromTo(one(".erp-pline i"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: one(".erp-plist"), start: "top 60%", end: "bottom 60%", scrub: true } });
        const imgs = $(".erp-pimg"), items = $(".erp-pstep");
        if (wide) {
          gsap.set(imgs.slice(1), { autoAlpha: 0 });
          items.forEach((s, i) => ScrollTrigger.create({
            trigger: s, start: "top 55%", end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              imgs.forEach((im, k) => gsap.to(im, { autoAlpha: k === i ? 1 : 0, scale: k === i ? 1 : 1.07, duration: 0.7 }));
              items.forEach((x, k) => x.classList.toggle("is-on", k === i));
            },
          }));
          items[0].classList.add("is-on");
        }
      }

      {
        const cmp = one(".erp-cmp"), range = one<HTMLInputElement>(".erp-cmp__range"), pp = { v: 92 };
        const setP = (v: number) => { cmp.style.setProperty("--p", `${v}%`); range.value = String(v); };
        const input = () => cmp.style.setProperty("--p", `${range.value}%`), stop = () => gsap.killTweensOf(pp);
        range.addEventListener("input", input); range.addEventListener("pointerdown", stop);
        off.push(() => { range.removeEventListener("input", input); range.removeEventListener("pointerdown", stop); });
        setP(92);
        ScrollTrigger.create({ trigger: cmp, start: "top 78%", once: true, onEnter: () => gsap.to(pp, { v: 50, duration: 2.2, delay: 0.3, ease: "power3.inOut", onUpdate: () => setP(pp.v) }) });
        $(".erp-ind").forEach((c) => gsap.fromTo($("img", c), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } }));
      }
      gsap.from(one(".erp-cta"), { scale: 0.94, ease: "none", scrollTrigger: { trigger: one(".erp-cta"), start: "top 95%", end: "top 50%", scrub: true } });
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
      gsap.fromTo(".erp-meter i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" });
      gsap.fromTo(".erp-bvb__info > *", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, clearProps: "all" });
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
        <div className="erp-progress" aria-hidden="true"><i /></div>

        <section className="erp-hero" aria-labelledby="erp-h1">
          <div className="container erp-hero__grid">
            <div>
              <nav className="erp-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link><ChevronRight aria-hidden="true" size={15} /><span aria-current="page">ERP &amp; CRM</span>
              </nav>
              <p className="eyebrow"><span />ERP &amp; CRM Development</p>
              <h1 id="erp-h1" className="erp-hero__title" aria-label="ERP and CRM software your whole team actually uses.">
                <span className="erp-line" aria-hidden="true"><Words text="ERP and CRM software that" /></span>
                <em className="erp-line" aria-hidden="true"><Words text="your whole team uses." /></em>
              </h1>
              <p className="erp-hero__lead">Sipher Web designs and builds custom ERP and CRM systems for growing businesses in Indore and across India. Sales, stock, billing and accounts share one database, so every quote, order and invoice is entered once and trusted everywhere.</p>
              <div className="erp-hero__cta">
                <Link className="button button--primary" to="/contact" data-cursor="START"><span>Plan your system</span><ArrowRight aria-hidden="true" size={18} /></Link>
                <a className="erp-ghost" href="#erp-scene">Follow one deal</a>
              </div>
              <ul className="erp-trust">{["One shared database", "Role-based access", "GST-ready billing", "Migration and training"].map((t) => <li key={t}><Check aria-hidden="true" size={15} />{t}</li>)}</ul>
            </div>

            <div className="erp-hero__visual" aria-hidden="true">
              <div className="erp-hero__photo"><Photo id="1551288049-bebda4e38f71" w={1000} h={900} eager alt="Business analytics dashboard on a laptop showing sales and stock reports" /></div>
              <div className="erp-board">
                <div className="erp-board__bar"><span /><span /><span /><b>Sales pipeline</b><em>Won this month <i className="erp-won">₹0</i></em></div>
                <div className="erp-cols">
                  {COLS.map((c, i) => (
                    <div className="erp-col" key={c}>
                      <h4>{c}</h4>
                      {[...Array(i === 2 ? 1 : 2)].map((_, k) => <div className="erp-ghostcard" key={k}><i /><i /></div>)}
                    </div>
                  ))}
                  <div className="erp-deal"><b>Sharma Traders</b><span>{inr(480000)}</span></div>
                </div>
                <p className="erp-toast"><Check size={14} />Order created, stock reserved</p>
              </div>
            </div>
          </div>
        </section>

        <div className="erp-marquee" aria-hidden="true">
          <div className="erp-marquee__track">
            {[0, 1].map((g) => <div className="erp-marquee__group" key={g}>{MARQUEE.map((m) => <span key={m}>{m}</span>)}</div>)}
          </div>
        </div>

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
                <g fill="none">
                  {["M135,60C190,60 200,150 245,150", "M135,170H245", "M135,280C190,280 200,190 245,190", "M395,150C440,150 440,60 470,60", "M395,170H470", "M395,190C440,190 440,280 470,280"].map((d, i) => (
                    <g key={i}><path id={`a${i}`} className="erp-ln" d={d} /><path id={`f${i}`} className="erp-pf" d={d} /></g>
                  ))}
                </g>
                <g id="hub" className="erp-node erp-node--hub"><rect x="245" y="120" width="150" height="100" rx="20" /><text x="320" y="165">One shared</text><text x="320" y="185">database</text></g>
                {[["CRM · Lead", 10, 32], ["CRM · Quote", 10, 142], ["CRM · Deal won", 10, 252], ["ERP · Stock", 470, 32], ["ERP · Invoice", 470, 142], ["ERP · Reports", 470, 252]].map(([l, x, y], i) => (
                  <g className="erp-node" id={`n${i}`} key={l as string}><rect x={x as number} y={y as number} width="140" height="56" rx="14" /><text x={(x as number) + 70} y={(y as number) + 34}>{l}</text></g>
                ))}
                <circle className="erp-pk" r="8" cx="0" cy="0" />
              </svg>
              <ul className="erp-led">{LEDGER.map((l) => <li key={l}><Check size={13} />{l}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="erp-section erp-mods" aria-labelledby="erp-mods-h">
          <div className="container">
            <Head center eyebrow="Modules" lead="Start with the modules that hurt most today. Each one is built on the same data, so adding the next never means starting over.">
              <span id="erp-mods-h">Pick the parts you need, <em>keep them connected.</em></span>
            </Head>
            <div className="erp-bento">
              {MODULES.map((m) => (
                <article className={`erp-mod${m.big ? " erp-mod--big" : ""}`} key={m.title} data-reveal>
                  {m.img && <div className="erp-mod__img"><Photo id={m.img} w={800} h={520} /></div>}
                  <span className="erp-mod__ic"><m.icon size={22} /></span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="erp-section erp-compare" aria-labelledby="erp-cmp-h">
          <div className="container">
            <Head center eyebrow="Before and after" lead="Quotes in spreadsheets, orders in chat and invoices in another tool mean the same number gets typed three times. Drag to compare.">
              <span id="erp-cmp-h">From scattered sheets to <em>one source of truth.</em></span>
            </Head>
            <div className="erp-cmp" data-reveal>
              <div className="erp-cmp__l erp-cmp__old" aria-hidden="true">
                <p className="erp-cmp__hd">Sheets and chats</p>
                <div className="erp-xl">
                  {["Order", "Client", "Qty", "Stock", "Paid"].map((h) => <span className="h" key={h}>{h}</span>)}
                  {["1041", "Sharma", "12", "#REF!", "pending?", "1042", "sharma tr", "#N/A", "40", "done", "1041", "Sharma", "12", "#REF!", "check"].map((c, i) => <span key={i} className={c.startsWith("#") ? "e" : ""}>{c}</span>)}
                </div>
                <span className="erp-stamp">Which file is latest?</span>
              </div>
              <div className="erp-cmp__l erp-cmp__new" aria-hidden="true">
                <p className="erp-cmp__hd">One system</p>
                <ul className="erp-rows">
                  {[["SO-1180", "Sharma Traders", "Reserved", "Invoiced"], ["SO-1181", "Gupta Stores", "In stock", "Quoted"], ["SO-1182", "Verma & Co", "2 short", "PO raised"]].map((r) => (
                    <li key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><i className="erp-tag erp-tag--ok">{r[2]}</i><i className="erp-tag">{r[3]}</i></li>
                  ))}
                </ul>
                <p className="erp-cmp__foot"><i />Stock, quote and invoice always agree</p>
              </div>
              <span className="erp-cmp__tag erp-cmp__tag--o" aria-hidden="true">Before</span>
              <span className="erp-cmp__tag erp-cmp__tag--n" aria-hidden="true">After</span>
              <div className="erp-cmp__handle" aria-hidden="true"><i>‹›</i></div>
              <input className="erp-cmp__range" type="range" min="0" max="100" defaultValue="50" aria-label="Drag to compare spreadsheets with a single ERP and CRM system" />
            </div>
          </div>
        </section>

        <section className="erp-lit" aria-label="Our approach">
          <Photo className="erp-lit__img" id="1507679799987-c73779587ccf" w={500} h={680} />
          <div className="container">
            <p className="erp-lit__text">{STATEMENT.split(" ").map((w, i) => <span key={i} className="erp-lit__w">{w}{" "}</span>)}</p>
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
                  <button key={b.k} type="button" role="tab" aria-selected={bvb === i} className={`erp-bvb__tab${bvb === i ? " is-on" : ""}`} onClick={() => setBvb(i)}>{b.k}</button>
                ))}
              </div>
              <div className="erp-bvb__panel" role="tabpanel">
                <div className="erp-bvb__info">
                  <h3>{BVB[bvb].t}</h3>
                  <p>{BVB[bvb].p}</p>
                  <ul>{BVB[bvb].f.map((f) => <li key={f}><Check aria-hidden="true" size={14} />{f}</li>)}</ul>
                </div>
                <div className="erp-meter">
                  {METERS.map((m, i) => (
                    <div key={m}><span>{m}</span><em><i style={{ width: `${BVB[bvb].m[i]}%` }} /></em></div>
                  ))}
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
              {IND.map((x) => (
                <article className="erp-ind" key={x.t} data-reveal>
                  <Photo id={x.img} w={700} h={520} alt={`${x.t} business using ERP and CRM software`} />
                  <div><h3>{x.t}</h3><p>{x.p}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="erp-section erp-proc" aria-labelledby="erp-proc-h">
          <div className="container erp-proc__grid">
            <div className="erp-plist">
              <Head eyebrow="How we deliver"><span id="erp-proc-h">Five stages, <em>working software at each.</em></span></Head>
              <span className="erp-pline" aria-hidden="true"><i /></span>
              {STEPS.map((s, i) => (
                <article className="erp-pstep" key={s.t}>
                  <span className="erp-pstep__dot" aria-hidden="true">{i + 1}</span>
                  <h3>{s.t} <small>{s.w}</small></h3>
                  <p>{s.p}</p>
                </article>
              ))}
            </div>
            <div className="erp-pimgs" aria-hidden="true">
              {STEPS.map((s) => <div className="erp-pimg" key={s.t}><Photo id={s.img} w={900} h={1000} /></div>)}
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
                <article className="erp-q" key={q.t} data-reveal><span className="erp-mod__ic"><q.icon size={22} /></span><h3>{q.t}</h3><p>{q.p}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="erp-section erp-faq" aria-labelledby="erp-faq-h">
          <div className="container erp-faq__grid">
            <div className="erp-faq__side">
              <Head eyebrow="Questions we hear often"><span id="erp-faq-h">Straight answers <em>before you commit.</em></span></Head>
              <Link className="erp-ghost" to="/contact">Ask our team</Link>
            </div>
            <div>{FAQ.map((f, i) => <FaqItem key={f.q} id={`erp-faq-${i}`} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />)}</div>
          </div>
        </section>

        <section className="erp-section erp-relsec">
          <div className="container">
            <Head center eyebrow="Explore other services" lead="An ERP works best with the right partners around it.">Pair it with <em>what comes next</em></Head>
            <div className="erp-relgrid">
              {REL.map((r) => (
                <Link className="erp-rel" to={r.to} key={r.to} data-reveal>
                  <Photo id={r.img} w={700} h={520} alt={`${r.t} service`} />
                  <div><h3>{r.t}</h3><p>{r.p}</p><span aria-hidden="true"><ArrowUpRight size={18} /></span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="erp-cta-sec">
          <div className="container">
            <div className="erp-cta">
              <div>
                <p className="eyebrow"><span />Start the conversation</p>
                <h2>Tell us how work moves today. <em>We will map what it should become.</em></h2>
                <p>Share your process, team size and the tools you use. You get a plan, a timeline and an itemised quote.</p>
              </div>
              <Link className="erp-cta__btn" to="/contact" data-cursor="START"><span>Get a free consultation</span><ArrowUpRight aria-hidden="true" size={20} /></Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}