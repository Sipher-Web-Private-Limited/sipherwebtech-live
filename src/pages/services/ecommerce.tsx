import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Gauge,
  HardDrive,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/ecommerce.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

const NAVY = "#100563";
const YELLOW = "#ffe401";
const SOFT = "#fff8c4";

/* hides itself if an id ever 404s, so layouts never show a broken-image icon */
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
          <span className="ec-w">
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
        <span key={i} className="ec-lit__w">
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
    <div className={`ec-head${center ? " ec-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="ec-title">{children}</h2>
      {lead && <p className="ec-lead">{lead}</p>}
    </div>
  );
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const MARQUEE = [
  "Custom online stores",
  "Marketplaces",
  "B2B portals",
  "Payment gateways",
  "Inventory sync",
  "Shipping & tracking",
  "Admin dashboards",
  "Store migration",
];

const TILES = [
  { name: "Aero Runner", price: 4999, img: "1542291026-7eec264c27ff" },
  { name: "Studio Headset", price: 3499, img: "1505740420928-5e560c06d30e" },
  { name: "Field Watch", price: 6999, img: "1523275335684-37898b6baf30" },
  { name: "City Pack", price: 2299, img: "1553062407-98eeb64c6a62" },
  { name: "Shade One", price: 1499, img: "1572635196237-14b3f281503f" },
  { name: "Court Low", price: 3999, img: "1491553895911-0055eca6402d" },
];

const JOURNEY = [
  {
    tag: "Browse",
    title: "Shoppers land,",
    em: "and find it fast.",
    text: "Clean catalogues, quick search and filters that work with one thumb, so the right product is never more than a few taps away.",
    details: ["Catalogue, search and filters", "Mobile-first product grid", "Clean URLs and metadata for search"],
  },
  {
    tag: "Choose",
    title: "Every product page",
    em: "answers the question.",
    text: "Large photos, size pickers, live stock and one obvious add-to-cart, because shoppers decide in seconds.",
    details: ["Variants, sizes and live stock", "Delivery and returns info up front", "One clear primary action"],
  },
  {
    tag: "Cart",
    title: "A cart that stays",
    em: "out of the way.",
    text: "Change quantities, apply offers and see the full price early, so there are no surprises at the last step.",
    details: ["Saved carts across devices", "Coupons and delivery estimate", "Totals and tax shown clearly"],
  },
  {
    tag: "Pay",
    title: "Checkout that",
    em: "earns trust.",
    text: "Short forms and the payment methods your customers already use, through established gateways that handle the card data.",
    details: ["UPI, cards, net banking, wallets, COD where it fits", "Guest checkout and saved addresses", "Gateways handle card details, not your store"],
  },
  {
    tag: "Deliver",
    title: "Orders move,",
    em: "customers stay informed.",
    text: "Stock updates, courier booking and tracking messages happen automatically while your team watches one dashboard.",
    details: ["Inventory updated on every order", "Courier and tracking integration", "Status updates by email, SMS or WhatsApp"],
  },
];

const SERVICES = [
  { title: "Custom online stores", text: "Stores designed around your products, brand and buying journey, not a generic template.", img: "1556742049-0cfed4f6a45d" },
  { title: "Platform-based stores", text: "Stores on established e-commerce platforms, where a platform genuinely fits.", img: "1563013544-824ae1b704d3" },
  { title: "Payment gateway integration", text: "Connect trusted payment providers for smooth, secure checkout and reconciliation.", img: "1556742502-ec7c0e9f34b1" },
  { title: "Inventory & order management", text: "Keep stock, orders and fulfilment in sync across channels and locations.", img: "1586528116311-ad8dd3c8310d" },
  { title: "Multi-vendor marketplaces", text: "Platforms where several sellers list and sell, with commissions and payouts.", img: "1472851294608-062f824d29cc" },
  { title: "B2B & wholesale portals", text: "Account-based ordering, price lists, bulk carts and repeat orders.", img: "1553729459-efe14ef6055d" },
  { title: "Shipping & logistics", text: "Courier rates, label creation and live tracking connected to every order.", img: "1578575437130-527eed3abbec" },
  { title: "Catalogue & admin panels", text: "Manage products, prices, content, customers and orders without a developer.", img: "1460925895917-afdab827c52f" },
  { title: "Store migration & upgrades", text: "Move or improve an existing store without losing products, customers or rankings.", img: "1551288049-bebda4e38f71" },
];

const STATEMENT = "A great store removes every reason to hesitate. Fast pages, clear prices, easy payment, and an order that simply arrives.";

const MODELS = [
  {
    key: "Custom store",
    title: "A store built around your business",
    text: "Best when your catalogue, pricing or workflow does not fit a standard template, or you need deep integrations and full control over the experience.",
    when: "Unusual workflows, custom pricing, specific integrations, long-term scale.",
    trade: "Longer first build and you own more of the maintenance.",
    feats: ["Fully custom design and checkout", "Any integration the provider's API allows", "You own the code and data"],
    img: "1556742049-0cfed4f6a45d",
  },
  {
    key: "Platform store",
    title: "Launch faster on a proven platform",
    text: "Established platforms are quicker to launch for standard needs. We set them up, theme them and extend them where it makes sense.",
    when: "Standard catalogues, quick launch, small teams.",
    trade: "Platform rules, fees and limits apply, and deep customisation can get awkward.",
    feats: ["Theme and storefront customisation", "Plugins and payment setup", "Migration to custom later if you outgrow it"],
    img: "1441986300917-64674bd600d8",
  },
  {
    key: "Marketplace",
    title: "Many sellers, one platform",
    text: "Vendors list and manage their own products while you handle discovery, checkout and commissions in one place.",
    when: "You want to host other sellers and earn on each sale.",
    trade: "More moving parts: onboarding, payouts and moderation. We build it in stages.",
    feats: ["Vendor dashboards and onboarding", "Commission rules and payouts", "Order splitting across sellers"],
    img: "1472851294608-062f824d29cc",
  },
  {
    key: "B2B portal",
    title: "Ordering that fits repeat buyers",
    text: "Account-based pricing, bulk carts, quick reorders and approvals, so wholesale customers can order without calling you.",
    when: "Distributors, wholesalers and trade customers.",
    trade: "Needs clean price lists and customer data to start with.",
    feats: ["Customer-specific price lists", "Bulk upload and quick reorder", "Credit terms and invoice history"],
    img: "1553729459-efe14ef6055d",
  },
];

const ORBITS = [
  { name: "Payments", r: 0.22, items: ["UPI", "Cards", "Net banking", "Wallets"] },
  { name: "Operations", r: 0.36, items: ["Couriers", "Tracking", "Inventory", "GST invoices"] },
  { name: "Customers", r: 0.5, items: ["WhatsApp", "Email", "SMS", "Analytics"] },
];

const PROCESS = [
  {
    title: "Discover",
    when: "Week 1",
    text: "We learn your products, customers and sales channels, then agree what the first version must do.",
    gets: ["Goals and scope", "Catalogue and data review", "Itemised quote"],
    img: "1522071820081-009f0129c71c",
  },
  {
    title: "Design",
    when: "Weeks 2–3",
    text: "Catalogue structure, product pages and checkout are designed mobile-first and shown as a clickable prototype.",
    gets: ["Clickable prototype", "Checkout flow", "Admin screens"],
    img: "1558655146-9f40138edfeb",
  },
  {
    title: "Develop",
    when: "Two-week sprints",
    text: "Storefront, admin, payments and integrations are built and demoed every sprint, so you steer with working software.",
    gets: ["A demo each sprint", "Payment and shipping integrations", "Code in a repository you own"],
    img: "1461749280684-dccba630e2f6",
  },
  {
    title: "Test & launch",
    when: "Before go-live",
    text: "We run real orders end to end: payment, stock, email and courier. Then we migrate data and go live.",
    gets: ["Checkout and payment testing", "Data migration rehearsal", "Monitored go-live"],
    img: "1519389950473-47ba0277781c",
  },
  {
    title: "Grow",
    when: "After launch",
    text: "Updates, backups and monitoring continue, and we improve the store from real order data.",
    gets: ["Care plan", "Performance and conversion fixes", "New features as you grow"],
    img: "1460925895917-afdab827c52f",
  },
];

const QUALITY = [
  { icon: ShieldCheck, title: "Payment security", text: "Established gateways handle card details, so your store never stores them." },
  { icon: Smartphone, title: "Real-device testing", text: "Product pages and checkout tested on real phones and screen sizes." },
  { icon: Gauge, title: "Speed", text: "Optimised images, lean code and caching so pages feel instant." },
  { icon: Search, title: "Search-friendly", text: "Clean structure, metadata and schema. Rankings cannot be guaranteed." },
  { icon: HardDrive, title: "Backups & recovery", text: "Regular backups and a recovery plan for orders and customer data." },
  { icon: Activity, title: "Monitoring", text: "Logs and alerts so problems are spotted before customers notice." },
];

const FAQ = [
  { q: "Should I build a custom store or use Shopify or WooCommerce?", a: "Platforms can be faster to launch for standard needs. Custom builds suit unusual workflows, deep integrations or scale. We compare both against your catalogue, budget and growth plans before recommending one." },
  { q: "Can you integrate payment gateways?", a: "Yes. We connect established payment gateways. Availability, fees and approval depend on the provider, and we confirm these during discovery." },
  { q: "Can you connect inventory, shipping and accounting?", a: "Usually yes, through APIs or data imports. We review the systems involved first to confirm what is feasible." },
  { q: "Can you migrate my existing store?", a: "Often yes. We review your current platform, products, customers and orders, and plan what can move and what needs rebuilding, including redirects so search rankings are protected." },
  { q: "Will the store work well on mobile?", a: "Yes. Product pages and checkout are designed mobile-first and tested on real devices and screen sizes." },
  { q: "Will the store be SEO-friendly?", a: "We build with clean structure, metadata and page speed in mind. Search rankings depend on many factors and cannot be guaranteed." },
  { q: "How long does a store take and what does it cost?", a: "Both depend on catalogue size, features, integrations and design needs. We give a project-specific estimate after discovery, usually starting with a focused first version." },
];

const RELATED = [
  { to: "/services/mobile-app-development", title: "Mobile apps", text: "iOS and Android apps for your shoppers.", img: "1512941937669-90a1b58e7e9c" },
  { to: "/services/software-development", title: "Custom software", text: "ERP, CRM and portals around your store.", img: "1555066931-4365d14bab8c" },
  { to: "/services/ui-ux", title: "UI/UX design", text: "Interfaces that feel obvious and look great.", img: "1558655146-9f40138edfeb" },
  { to: "/services/digital-marketing", title: "Digital marketing", text: "Bring the right shoppers to your store.", img: "1460925895917-afdab827c52f" },
];

/* ------------------------------------------------------------------ */
/* FAQ row                                                             */
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
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0, duration: calm ? 0 : 0.55, ease: "power3.inOut" });
  }, [open]);

  return (
    <div className={`ec-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="ec-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Ecommerce() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [model, setModel] = useState(0);
  const modelFirst = useRef(true);

  const jump = (id: string) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  /* store-model tabs: panel content re-enters on every switch */
  useLayoutEffect(() => {
    if (modelFirst.current) {
      modelFirst.current = false;
      return;
    }
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = root.querySelector<HTMLElement>(".ec-model__panel.is-on");
    if (!panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ec-model__img", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut", clearProps: "clipPath" });
      gsap.fromTo(".ec-model__img img", { scale: 1.22 }, { scale: 1, duration: 1.3, ease: "power3.out" });
      gsap.fromTo("[data-m]", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.6, delay: 0.15, ease: "power3.out", clearProps: "all" });
    }, panel);
    return () => ctx.revert();
  }, [model]);

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

        /* pinned text areas size themselves to their tallest slide */
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

        /* ================= page progress ================= */
        gsap.to(one(".ec-progress i"), { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

        /* ================= HERO ================= */
        {
          const cartN = one(".ec-cart-n");
          const cartPill = one(".ec-float--cart .ec-pill");
          const toast = one(".ec-float--toast .ec-pill");
          cartN.textContent = "0";
          gsap.set(toast, { autoAlpha: 0 });

          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from($(".ec-crumb, .ec-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
            .from($(".ec-hero__title .ec-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
            .from($(".ec-hero__lead, .ec-hero__cta > *, .ec-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
            .from(one(".ec-hero__disc"), { scale: 0, duration: 1.2, ease: "elastic.out(1,.6)", clearProps: "transform" }, 0.2)
            .fromTo(one(".ec-hero__photo--a"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath" }, 0.2)
            .fromTo(one(".ec-hero__photo--b"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut", clearProps: "clipPath" }, 0.7)
            .from($(".ec-float:not(.ec-float--toast)"), { y: 40, autoAlpha: 0, scale: 0.9, duration: 0.9, stagger: 0.14, ease: "back.out(1.5)", clearProps: "all" }, 0.9)
            .from(one(".ec-badge"), { scale: 0, rotate: -120, duration: 1, ease: "back.out(1.6)", clearProps: "transform" }, 1.1);

          /* the little shop keeps running: items are added, an order lands */
          const loop = gsap.timeline({ repeat: -1, delay: 2.4 });
          const bump = (at: string) =>
            loop.fromTo(cartPill, { scale: 1 }, { scale: 1.14, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, at);
          loop
            .call(() => { cartN.textContent = "1"; })
            .add(() => {}, ">");
          bump("<");
          loop.call(() => { cartN.textContent = "2"; }, undefined, "+=1.1");
          bump("<");
          loop.call(() => { cartN.textContent = "3"; }, undefined, "+=1.1");
          bump("<");
          loop
            .fromTo(toast, { autoAlpha: 0, y: 16, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(2)" }, "+=0.5")
            .to(toast, { autoAlpha: 0, y: -10, duration: 0.4 }, "+=2.2")
            .call(() => { cartN.textContent = "0"; }, undefined, "+=0.3");
          off.push(() => loop.kill());

          gsap.to(one(".ec-badge__ring"), { rotation: 360, duration: 18, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
          gsap.to(one(".ec-hero__visual"), {
            yPercent: -5,
            ease: "none",
            scrollTrigger: { trigger: one(".ec-hero"), start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to(one(".ec-hero__photo--a img"), {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: one(".ec-hero"), start: "top top", end: "bottom top", scrub: true },
          });
        }

        if (fine) {
          const hero = one(".ec-hero");
          const layers = $(".ec-float__in").map((el) => ({
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

          $(".ec-mag").forEach((b) => {
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

        /* ================= MARQUEE ================= */
        {
          const mq = gsap.to(one(".ec-marquee__track"), { xPercent: -50, repeat: -1, duration: 32, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
            },
          });
        }

        /* ================= SCENE: one purchase, start to finish ================= */
        {
          const section = one(".ec-scene");
          const steps = $(".ec-sstep");
          const panes = $(".ec-pane");
          const counter = one(".ec-scene__count");
          const bar = one(".ec-scene__bar i");
          const win = one(".ec-win");
          const badge = one(".ec-win__n");
          const badgeWrap = one(".ec-win__cart");
          const fly = one(".ec-fly");
          const chips = $(".ec-schip");
          const tiles = $(".ec-tile");
          const sizes = $(".ec-size");
          const addBtn = one(".ec-add");
          const qtyEl = one(".ec-qty__n");
          const totals = $(".ec-total");
          const methods = $(".ec-method");
          const payBtn = one(".ec-pay");
          const check = one(".ec-ok");
          const fill = one(".ec-track__fill");
          const dots = $(".ec-track__dot");
          const cartV = { v: 0 };
          const qtyV = { v: 1 };
          const totV = { v: 4999 };
          fitHeight(one(".ec-steps"), steps);

          const setBadge = () => { badge.textContent = String(Math.round(cartV.v)); };

          gsap.set(panes.slice(1), { autoAlpha: 0 });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set(win, { y: 70, autoAlpha: 0 });
          gsap.set(tiles, { autoAlpha: 0, y: 24, scale: 0.94 });
          gsap.set(fly, { autoAlpha: 0 });
          gsap.set(chips, { autoAlpha: 0, scale: 0.6 });
          gsap.set(fill, { scaleX: 0 });
          gsap.set(dots, { scale: 0.7 });
          gsap.set(check, { scale: 0 });
          badge.textContent = "0";
          qtyEl.textContent = "1";
          totals.forEach((t) => { t.textContent = inr(4999); });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=540%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              onUpdate: (s) => { bar.style.transform = `scaleX(${Math.max(0.03, s.progress)})`; },
            },
          });

          const swap = (i: number, at: number) => {
            tl.to(panes[i], { autoAlpha: 0, y: -22, duration: 0.4 }, at)
              .fromTo(panes[i + 1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.55 }, at + 0.3)
              .to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35)
              .call(() => { counter.textContent = `0${i + 2} / 05`; }, undefined, at + 0.35)
              .call(() => { counter.textContent = `0${i + 1} / 05`; }, undefined, at - 0.01);
          };

          /* 1 browse */
          tl.to(win, { y: 0, autoAlpha: 1, duration: 1 }, 0)
            .to(tiles, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: "back.out(1.6)" }, 0.7)
            .to(tiles[0], { y: -8, borderColor: NAVY, duration: 0.4 }, 2.0);
          swap(0, 2.8);

          /* 2 choose */
          tl.fromTo($(".ec-prod__img img", panes[1]), { scale: 1.2 }, { scale: 1, duration: 1.2 }, 3.0)
            .fromTo($("[data-s]", panes[1]), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.5 }, 3.3)
            .to(chips[0], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 3.6)
            .to(sizes[2], { backgroundColor: NAVY, color: "#ffffff", borderColor: NAVY, duration: 0.3 }, 4.3)
            .to(addBtn, { scale: 0.94, duration: 0.15 }, 4.9)
            .to(addBtn, { scale: 1, duration: 0.2 }, 5.05)
            .set(fly, { autoAlpha: 1 }, 5.0)
            .fromTo(fly, { left: "60%", top: "80%", scale: 1 }, { left: "90%", top: "3%", scale: 0.5, duration: 0.65, ease: "power2.in" }, 5.0)
            .to(fly, { autoAlpha: 0, duration: 0.1 }, 5.65)
            .fromTo(cartV, { v: 0 }, { v: 1, duration: 0.3, ease: "none", onUpdate: setBadge }, 5.6)
            .fromTo(badgeWrap, { scale: 1 }, { scale: 1.25, yoyo: true, repeat: 1, duration: 0.18 }, 5.6)
            .to(chips[0], { autoAlpha: 0, scale: 0.8, duration: 0.3 }, 6.0);
          swap(1, 6.3);

          /* 3 cart */
          tl.fromTo($("[data-s]", panes[2]), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5 }, 6.7)
            .fromTo(qtyV, { v: 1 }, { v: 2, duration: 0.4, ease: "none", onUpdate: () => { qtyEl.textContent = String(Math.round(qtyV.v)); } }, 7.7)
            .fromTo(cartV, { v: 1 }, { v: 2, duration: 0.4, ease: "none", onUpdate: setBadge }, 7.7)
            .fromTo(
              totV,
              { v: 4999 },
              { v: 9998, duration: 0.5, ease: "none", onUpdate: () => totals.forEach((t) => { t.textContent = inr(totV.v); }) },
              7.7
            );
          swap(2, 8.6);

          /* 4 pay */
          tl.fromTo(methods, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.45 }, 9.0)
            .to(chips[1], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 9.2)
            .to(methods[0], { borderColor: NAVY, backgroundColor: SOFT, duration: 0.35 }, 9.9)
            .to(payBtn, { scale: 0.95, duration: 0.15 }, 10.6)
            .to(payBtn, { scale: 1, duration: 0.2 }, 10.75)
            .to(chips[1], { autoAlpha: 0, scale: 0.8, duration: 0.3 }, 10.9);
          swap(3, 11.0);

          /* 5 deliver */
          tl.to(check, { scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 11.5)
            .to(fill, { scaleX: 1, duration: 1.8, ease: "none" }, 11.8)
            .to(dots, { scale: 1, backgroundColor: YELLOW, borderColor: NAVY, stagger: 0.55, duration: 0.3 }, 11.8)
            .to(chips[2], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 12.0)
            .to({}, { duration: 1 });
        }

        /* ================= SERVICES: horizontal rail, desktop ================= */
        if (wide) {
          const section = one(".ec-svc");
          const track = one(".ec-svc__track");
          const bar = one(".ec-svc__bar i");
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 24);
          const h = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${dist()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (s) => { bar.style.transform = `scaleX(${Math.max(0.04, s.progress)})`; },
            },
          });
          $(".ec-scard").forEach((c) => {
            gsap.from(c, { scale: 0.88, opacity: 0.4, ease: "none", scrollTrigger: { trigger: c, containerAnimation: h, start: "left 98%", end: "left 60%", scrub: true } });
            gsap.fromTo($("img", c), { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: c, containerAnimation: h, start: "left right", end: "right left", scrub: true } });
            gsap.from($(".ec-scard__no", c), { x: 60, ease: "none", scrollTrigger: { trigger: c, containerAnimation: h, start: "left right", end: "right left", scrub: true } });
          });
        }

        /* ================= STATEMENT ================= */
        {
          const words = $(".ec-lit__w");
          gsap.set(words, { opacity: 0.14 });
          gsap.to(words, {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: one(".ec-lit__text"), start: "top 80%", end: "bottom 45%", scrub: true },
          });
          $(".ec-lit__img").forEach((el) => {
            const s = Number(el.dataset.speed || 1);
            gsap.fromTo(
              el,
              { yPercent: 18 * s, rotate: s > 1 ? 4 : -4 },
              { yPercent: -18 * s, rotate: s > 1 ? -2 : 2, ease: "none", scrollTrigger: { trigger: one(".ec-lit"), start: "top bottom", end: "bottom top", scrub: true } }
            );
          });
        }

        /* ================= INTEGRATIONS ORBIT ================= */
        {
          const section = one(".ec-orb");
          const spins: gsap.core.Tween[] = [];
          $(".ec-orb__ring").forEach((ring, i) => {
            const dir = i % 2 ? -1 : 1;
            const pills = $(".ec-orb__pill", ring);
            gsap.set(pills, { xPercent: -50, yPercent: -50 });
            spins.push(gsap.to(ring, { rotation: 360 * dir, duration: 46 + i * 14, repeat: -1, ease: "none" }));
            spins.push(gsap.to(pills, { rotation: -360 * dir, duration: 46 + i * 14, repeat: -1, ease: "none" }));
          });
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => spins.forEach((s) => (self.isActive ? s.play() : s.pause())),
          });
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (s) => {
              const k = 1 + Math.min(Math.abs(s.getVelocity()) / 400, 4);
              spins.forEach((t) => { t.timeScale(k); gsap.to(t, { timeScale: 1, duration: 0.9, overwrite: true }); });
            },
          });
          gsap.from(one(".ec-orb__core"), { scale: 0.4, autoAlpha: 0, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: section, start: "top 70%", once: true } });
          gsap.from($(".ec-orb__path"), { scale: 0.6, autoAlpha: 0, duration: 1.1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 70%", once: true } });
        }

        /* ================= PROCESS: cards stack as you scroll ================= */
        if (wide) {
          const cards = $(".ec-pcard");
          cards.forEach((c, i) => {
            gsap.set(c, { transformOrigin: "50% 0%" });
            if (i < cards.length - 1) {
              gsap.to(c, {
                scale: 0.94 - (cards.length - 2 - i) * 0.005,
                opacity: 0.55,
                ease: "none",
                scrollTrigger: { trigger: cards[i + 1], start: "top 80%", end: "top 28%", scrub: true },
              });
            }
            gsap.fromTo($(".ec-pcard__img img", c), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
          });
        }

        /* ================= COMPARE: sweeps once, then drag ================= */
        {
          const cmp = one(".ec-cmp");
          const range = one<HTMLInputElement>(".ec-cmp__range");
          const pp = { v: 92 };
          const setP = (v: number) => {
            cmp.style.setProperty("--p", `${v}%`);
            range.value = String(v);
          };
          const input = () => cmp.style.setProperty("--p", `${range.value}%`);
          const stop = () => gsap.killTweensOf(pp);
          range.addEventListener("input", input);
          range.addEventListener("pointerdown", stop);
          off.push(() => {
            range.removeEventListener("input", input);
            range.removeEventListener("pointerdown", stop);
          });
          setP(92);
          ScrollTrigger.create({
            trigger: cmp,
            start: "top 78%",
            once: true,
            onEnter: () => gsap.to(pp, { v: 50, duration: 2.2, delay: 0.3, ease: "power3.inOut", onUpdate: () => setP(pp.v) }),
          });
        }

        /* ================= CTA ================= */
        gsap.from(one(".ec-cta"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: one(".ec-cta"), start: "top 95%", end: "top 50%", scrub: true },
        });
        gsap.fromTo(
          one(".ec-cta__mark"),
          { yPercent: -12, rotate: -8 },
          { yPercent: 12, rotate: 6, ease: "none", scrollTrigger: { trigger: one(".ec-cta"), start: "top bottom", end: "bottom top", scrub: true } }
        );

        /* ================= generic reveals ================= */
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
        title="E-Commerce Development Company in Indore | Sipher Webtech"
        description="Custom online stores, marketplaces and B2B portals with secure checkout, payment, inventory and shipping integrations. Get a free consultation from Sipher Webtech."
      />

      <div className="ec" ref={rootRef}>
        <div className="ec-progress" aria-hidden="true"><i /></div>

        {/* ============================ HERO ============================ */}
        <section className="ec-hero" aria-labelledby="ec-h1">
          <div className="container ec-hero__grid">
            <div className="ec-hero__copy">
              <nav className="ec-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">E-Commerce Development</span>
              </nav>

              <p className="eyebrow"><span />E-Commerce Development</p>
              <h1 id="ec-h1" className="ec-hero__title" aria-label="Online stores that make buying feel effortless.">
                <span className="ec-line" aria-hidden="true"><Words text="Online stores that" /></span>
                <span className="ec-line" aria-hidden="true"><Words text="make buying feel" /></span>
                <em className="ec-line" aria-hidden="true"><Words text="effortless." /></em>
              </h1>
              <p className="ec-hero__lead">
                We design and build stores, marketplaces and B2B portals with fast mobile checkout, the payment methods
                your customers trust, and the admin tools to run it all without friction.
              </p>
              <div className="ec-hero__cta">
                <Link className="button button--primary ec-mag ec-hero__main" to="/contact" data-cursor="START">
                  <span>Plan your store</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="ec-ghost ec-mag" onClick={() => jump("ec-scene")}>
                  Follow an order
                </button>
              </div>
              <ul className="ec-hero__trust">
                {["Mobile-first checkout", "Trusted payment gateways", "Inventory and shipping sync", "Launch and ongoing support"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="ec-hero__visual" aria-hidden="true">
              <span className="ec-hero__disc" />
              <div className="ec-hero__photo ec-hero__photo--a">
                <Photo id="1483985988355-763728e1935b" w={1000} h={1250} eager />
              </div>
              <div className="ec-hero__photo ec-hero__photo--b">
                <Photo id="1523275335684-37898b6baf30" w={600} h={600} eager />
              </div>

              <div className="ec-float ec-float--cart">
                <div className="ec-float__in" data-depth="1.6">
                  <div className="ec-pill">
                    <ShoppingBag size={16} />
                    <span><b className="ec-cart-n">3</b> items in cart</span>
                  </div>
                </div>
              </div>

              <div className="ec-float ec-float--prod">
                <div className="ec-float__in" data-depth="1.1">
                  <div className="ec-card">
                    <div className="ec-card__thumb"><Photo id="1542291026-7eec264c27ff" w={300} h={300} /></div>
                    <div className="ec-card__body">
                      <p className="ec-card__name">Aero Runner</p>
                      <p className="ec-card__price">₹4,999</p>
                      <span className="ec-card__btn">Add to cart</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ec-float ec-float--toast">
                <div className="ec-float__in" data-depth="1.9">
                  <div className="ec-pill ec-pill--ok"><Check size={15} />Order #1042 confirmed</div>
                </div>
              </div>

              <svg className="ec-badge" viewBox="0 0 120 120">
                <defs>
                  <path id="ec-circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <g className="ec-badge__ring">
                  <text>
                    <textPath href="#ec-circ" textLength="270" lengthAdjust="spacing">SECURE CHECKOUT • MOBILE FIRST • </textPath>
                  </text>
                </g>
                <circle cx="60" cy="60" r="22" fill={YELLOW} />
                <path d="M49 54h22l-2.4 17H51.4zM54 54v-3a6 6 0 0112 0v3" fill="none" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="ec-marquee" aria-hidden="true">
          <div className="ec-marquee__track">
            {[0, 1].map((g) => (
              <div className="ec-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ===================== PINNED: ONE ORDER, END TO END ===================== */}
        <section className="ec-scene" id="ec-scene" aria-label="How a customer order flows through your store">
          <div className="ec-scene__bg" aria-hidden="true" />
          <div className="container ec-scene__grid">
            <div className="ec-scene__copy">
              <h2 className="ec-sr">Follow one order from first click to doorstep</h2>
              <div className="ec-steps">
                {JOURNEY.map((s) => (
                  <div className="ec-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="ec-sstep__list">
                      {s.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="ec-scene__count" aria-hidden="true">01 / 05</p>
              <span className="ec-scene__bar" aria-hidden="true"><i /></span>
            </div>

            <div className="ec-scene__stage" aria-hidden="true">
              <div className="ec-win">
                <div className="ec-win__bar">
                  <span /><span /><span />
                  <b>yourstore.in</b>
                  <em className="ec-win__cart"><ShoppingBag size={14} /><i className="ec-win__n">2</i></em>
                </div>
                <div className="ec-screen">
                  {/* browse */}
                  <div className="ec-pane ec-pane--browse">
                    <div className="ec-tiles">
                      {TILES.map((t) => (
                        <div className="ec-tile" key={t.name}>
                          <Photo id={t.img} w={360} h={360} />
                          <p>{t.name}</p>
                          <b>{inr(t.price)}</b>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* product */}
                  <div className="ec-pane ec-pane--product">
                    <div className="ec-prod">
                      <div className="ec-prod__img"><Photo id="1542291026-7eec264c27ff" w={600} h={600} /></div>
                      <div className="ec-prod__info">
                        <p className="ec-kicker" data-s>Running · New</p>
                        <h4 data-s>Aero Runner</h4>
                        <p className="ec-prod__price" data-s>{inr(4999)}</p>
                        <div className="ec-sizes" data-s>
                          {[7, 8, 9, 10].map((s) => <span className="ec-size" key={s}>{s}</span>)}
                        </div>
                        <p className="ec-stock" data-s><i />In stock · ships today</p>
                        <span className="ec-add" data-s>Add to cart</span>
                      </div>
                    </div>
                  </div>

                  {/* cart */}
                  <div className="ec-pane ec-pane--cart">
                    <div className="ec-cart">
                      <h4 data-s>Your cart</h4>
                      <div className="ec-line-item" data-s>
                        <div className="ec-line-item__img"><Photo id="1542291026-7eec264c27ff" w={200} h={200} /></div>
                        <div>
                          <p>Aero Runner</p>
                          <small>Size 9</small>
                        </div>
                        <div className="ec-qty"><i>−</i><span className="ec-qty__n">1</span><i>+</i></div>
                      </div>
                      <div className="ec-sum" data-s>
                        <p><span>Subtotal</span><b className="ec-total">{inr(4999)}</b></p>
                        <p><span>Delivery</span><b>Free</b></p>
                        <p className="ec-sum__t"><span>Total</span><b className="ec-total">{inr(4999)}</b></p>
                      </div>
                      <span className="ec-add ec-add--wide" data-s>Proceed to checkout</span>
                    </div>
                  </div>

                  {/* pay */}
                  <div className="ec-pane ec-pane--pay">
                    <div className="ec-payment">
                      <h4>Pay securely</h4>
                      <div className="ec-methods">
                        {["UPI", "Card", "Net banking", "Cash on delivery"].map((m) => (
                          <span className="ec-method" key={m}><i />{m}</span>
                        ))}
                      </div>
                      <span className="ec-pay">Pay {inr(9998)}</span>
                    </div>
                  </div>

                  {/* deliver */}
                  <div className="ec-pane ec-pane--track">
                    <div className="ec-trackbox">
                      <span className="ec-ok"><Check size={26} /></span>
                      <h4>Order confirmed</h4>
                      <p>#1042 · arrives in 3 to 4 days</p>
                      <div className="ec-track">
                        <span className="ec-track__rail"><i className="ec-track__fill" /></span>
                        {["Confirmed", "Packed", "Shipped", "Delivered"].map((s) => (
                          <div className="ec-track__step" key={s}>
                            <i className="ec-track__dot" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                      <p className="ec-trackbox__truck"><Truck size={16} /> Courier booked automatically</p>
                    </div>
                  </div>
                </div>
                <span className="ec-fly" />
              </div>

              <div className="ec-schip ec-schip--1"><Check size={13} />Live stock check</div>
              <div className="ec-schip ec-schip--2"><Check size={13} />Gateway-secured payment</div>
              <div className="ec-schip ec-schip--3"><Check size={13} />Tracking sent to customer</div>
            </div>
          </div>
        </section>

        {/* ===================== SERVICES: HORIZONTAL RAIL ===================== */}
        <section className="ec-svc" id="ec-services" aria-labelledby="ec-svc-h">
          <div className="container">
            <Head eyebrow="What we build">
              <span id="ec-svc-h">Everything a store needs, <em>built to work together.</em></span>
            </Head>
          </div>
          <div className="ec-svc__track">
            {SERVICES.map((s, i) => (
              <article className="ec-scard" key={s.title}>
                <div className="ec-scard__media">
                  <span className="ec-scard__no">0{i + 1}</span>
                  <Photo id={s.img} w={800} h={520} />
                </div>
                <div className="ec-scard__body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="container">
            <span className="ec-svc__bar" aria-hidden="true"><i /></span>
          </div>
        </section>

        {/* ============================ STATEMENT ============================ */}
        <section className="ec-lit" aria-label="Our approach">
          <Photo className="ec-lit__img ec-lit__img--a" id="1445205170230-053b83016050" w={500} h={680} />
          <Photo className="ec-lit__img ec-lit__img--b" id="1607082348824-0a96f2a4b9da" w={500} h={680} />
          <div className="container">
            <p className="ec-lit__text"><LitWords text={STATEMENT} /></p>
          </div>
        </section>

        {/* ============================ STORE MODELS ============================ */}
        <section className="ec-section ec-models" id="ec-models" aria-labelledby="ec-models-h">
          <div className="container">
            <Head eyebrow="Choosing the right model" lead="There is no single best way to sell online. We compare the options against your catalogue, budget and growth plans, then recommend one honestly.">
              <span id="ec-models-h">Four ways to sell, <em>one right fit.</em></span>
            </Head>
            <div className="ec-models__grid">
              <div className="ec-models__tabs" role="tablist" aria-label="Store models" data-reveal>
                {MODELS.map((m, i) => (
                  <button
                    key={m.key}
                    type="button"
                    role="tab"
                    id={`ec-tab-${i}`}
                    aria-selected={model === i}
                    aria-controls={`ec-panel-${i}`}
                    className={`ec-tab${model === i ? " is-on" : ""}`}
                    onClick={() => setModel(i)}
                  >
                    <i>0{i + 1}</i>
                    <span>{m.key}</span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                ))}
              </div>

              <div className="ec-models__view">
                {MODELS.map((m, i) => (
                  <div
                    key={m.key}
                    className={`ec-model__panel${model === i ? " is-on" : ""}`}
                    role="tabpanel"
                    id={`ec-panel-${i}`}
                    aria-labelledby={`ec-tab-${i}`}
                    hidden={model !== i}
                  >
                    <div className="ec-model__img">
                      <Photo id={m.img} w={1000} h={640} />
                    </div>
                    <div className="ec-model__info">
                      <h3 data-m>{m.title}</h3>
                      <p data-m>{m.text}</p>
                      <dl data-m>
                        <div><dt>Best when</dt><dd>{m.when}</dd></div>
                        <div><dt>Trade-off</dt><dd>{m.trade}</dd></div>
                      </dl>
                      <ul data-m>
                        {m.feats.map((f) => <li key={f}><Check aria-hidden="true" size={14} />{f}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ INTEGRATIONS ============================ */}
        <section className="ec-section ec-orb" id="ec-integrations" aria-labelledby="ec-orb-h">
          <div className="container ec-orb__grid">
            <div className="ec-orb__copy">
              <Head eyebrow="Connected by design" lead="Your store should not live alone. We connect it to the systems your business already runs on, wherever the provider offers an API or a standard way to exchange data.">
                <span id="ec-orb-h">One store, <em>every system around it.</em></span>
              </Head>
              <ul className="ec-orb__legend">
                {ORBITS.map((o) => (
                  <li key={o.name}><b>{o.name}</b><span>{o.items.join(" · ")}</span></li>
                ))}
              </ul>
              <p className="ec-orb__note">Availability, fees and approvals depend on each provider. We confirm what is possible during discovery.</p>
            </div>

            <div className="ec-orb__stage" aria-hidden="true">
              {ORBITS.map((o, i) => (
                <div className="ec-orb__path" key={o.name} style={{ "--r": o.r } as CSSProperties}>
                  <span className="ec-orb__line" />
                  <div className="ec-orb__ring">
                    {o.items.map((it, k) => (
                      <span className="ec-orb__pos" key={it} style={{ "--a": k * 90 + i * 30 } as CSSProperties}>
                        <span className="ec-orb__pill">{it}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="ec-orb__core"><ShoppingBag size={26} /><b>Your store</b></div>
            </div>
          </div>
        </section>

        {/* ============================== PROCESS ============================== */}
        <section className="ec-section ec-proc" id="ec-process">
          <div className="container">
            <Head center eyebrow="How we deliver" lead="A transparent process with working software at every stage, so you are never waiting on a big reveal.">
              Five stages, <em>zero guesswork.</em>
            </Head>
            <div className="ec-pstack">
              {PROCESS.map((p, i) => (
                <article className="ec-pcard" key={p.title} style={{ "--i": i } as CSSProperties}>
                  <div className="ec-pcard__txt">
                    <span className="ec-pcard__no">0{i + 1}</span>
                    <div className="ec-pcard__head">
                      <h3>{p.title}</h3>
                      <span className="ec-pcard__when">{p.when}</span>
                    </div>
                    <p>{p.text}</p>
                    <ul>
                      {p.gets.map((g) => <li key={g}><Check aria-hidden="true" size={14} />{g}</li>)}
                    </ul>
                  </div>
                  <div className="ec-pcard__img">
                    <Photo id={p.img} w={800} h={700} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ BEFORE / AFTER ============================ */}
        <section className="ec-section ec-compare" aria-labelledby="ec-cmp-h">
          <div className="container">
            <Head center eyebrow="Before and after" lead="Orders in chat threads and sheets get lost, oversold and re-typed. A connected store keeps products, payments and stock in one place. Drag to compare.">
              <span id="ec-cmp-h">From chat orders to <em>one connected store.</em></span>
            </Head>
            <div className="ec-cmp" data-reveal>
              <div className="ec-cmp__l ec-cmp__old" aria-hidden="true">
                <p className="ec-cmp__hd">Orders by chat</p>
                <div className="ec-bubbles">
                  <span className="ec-bub">Send 2 kurta, size M</span>
                  <span className="ec-bub ec-bub--me">Sure, which colour?</span>
                  <span className="ec-bub">Paid? I sent a screenshot</span>
                  <span className="ec-bub ec-bub--me">Checking…</span>
                  <span className="ec-bub">Is it in stock??</span>
                  <span className="ec-bub ec-bub--err">38 unread messages</span>
                </div>
                <span className="ec-stamp">Oversold!</span>
              </div>
              <div className="ec-cmp__l ec-cmp__new" aria-hidden="true">
                <p className="ec-cmp__hd">Orders dashboard</p>
                <table className="ec-orders">
                  <tbody>
                    {[
                      ["#1042", "Kurta M × 2", "Paid", "Packed"],
                      ["#1043", "Blue shirt L", "Paid", "Shipped"],
                      ["#1044", "Shoes 9", "COD", "Confirmed"],
                      ["#1045", "Tote bag", "Paid", "Delivered"],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td>{r[0]}</td>
                        <td>{r[1]}</td>
                        <td><i className="ec-tag ec-tag--ok">{r[2]}</i></td>
                        <td><i className="ec-tag">{r[3]}</i></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="ec-cmp__foot"><i />Stock updated automatically</p>
              </div>
              <span className="ec-cmp__tag ec-cmp__tag--o" aria-hidden="true">Before</span>
              <span className="ec-cmp__tag ec-cmp__tag--n" aria-hidden="true">After</span>
              <div className="ec-cmp__handle" aria-hidden="true"><i>‹›</i></div>
              <input
                className="ec-cmp__range"
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                aria-label="Drag to compare orders managed in chat with orders managed in a connected store"
              />
            </div>
          </div>
        </section>

        {/* ============================== QUALITY ============================== */}
        <section className="ec-section ec-quality">
          <div className="container">
            <Head eyebrow="Built to be trusted" lead="No store is completely secure or bug-free. These practices reduce risk and make problems easier to find and fix.">
              How we keep a store <em>fast, safe and reliable.</em>
            </Head>
            <div className="ec-qgrid">
              {QUALITY.map((q) => (
                <article className="ec-q" key={q.title} data-reveal>
                  <span className="ec-q__ic"><q.icon size={22} /></span>
                  <h3>{q.title}</h3>
                  <p>{q.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ FAQ ================================ */}
        <section className="ec-section ec-faq" id="ec-faq" aria-labelledby="ec-faq-h">
          <div className="container ec-faq__grid">
            <div className="ec-faq__side">
              <Head eyebrow="Questions we hear often">
                <span id="ec-faq-h">Straight answers <em>before you commit.</em></span>
              </Head>
              <p className="ec-lead">Something not covered here? Tell us about your catalogue and we will answer on the call.</p>
              <Link className="ec-faq__link" to="/contact">
                <span>Ask our team</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="ec-faq__list">
              {FAQ.map((f, i) => (
                <FaqItem key={f.q} id={`ec-faq-${i}`} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============================== RELATED ============================== */}
        <section className="ec-section ec-related">
          <div className="container">
            <Head center eyebrow="Explore other services" lead="A store sells best with the right partners around it. See how these services fit alongside it.">
              Pair it with <em>what comes next</em>
            </Head>
            <div className="ec-rel-grid">
              {RELATED.map((r) => (
                <Link className="ec-rel" to={r.to} key={r.to} data-reveal>
                  <div className="ec-rel__media"><Photo id={r.img} w={700} h={520} /></div>
                  <div className="ec-rel__body">
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="ec-rel__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ CTA ================================ */}
        <section className="ec-cta-sec" id="ec-contact">
          <div className="container">
            <div className="ec-cta">
              <span className="ec-cta__mark" aria-hidden="true">₹</span>
              <div className="ec-cta__inner">
                <div className="ec-cta__copy">
                  <p className="eyebrow"><span />Start the conversation</p>
                  <h2>Ready to open or upgrade <em>your online store?</em></h2>
                  <p>Tell us about your products, your customers and the outcome you want. We will come back with a plan, a timeline and an itemised quote.</p>
                  <ul className="ec-cta__list">
                    {["Free discovery call", "Itemised quote, no surprises", "Launch and ongoing support"].map((t) => (
                      <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="ec-cta__action">
                  <Link className="ec-cta__btn ec-mag" to="/contact" data-cursor="START">
                    <span>Get a free store quote</span>
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