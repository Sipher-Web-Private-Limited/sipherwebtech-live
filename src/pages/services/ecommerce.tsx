import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Check,
  CreditCard,
  Gauge,
  HardDrive,
  Lock,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import TechStackRibbons from "../../components/TechStackRibbons";
import "../../styles/services/ecommerce.css";
import "../../styles/services/service-hero-consistency.css";

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

const ECOMMERCE_RIBBON_LANES = [
  {
    label: "E-commerce platforms and core technologies",
    className: "tech-ribbons__lane--technology",
    reverse: false,
    items: [
      "Custom Online Stores",
      "Shopify",
      "WooCommerce",
      "Headless Commerce",
      "Marketplaces",
      "B2B Portals",
      "Payment Gateways",
      "Admin Dashboards",
    ],
  },
  {
    label: "E-commerce disciplines and operations",
    className: "tech-ribbons__lane--disciplines",
    reverse: true,
    items: [
      "Inventory Sync",
      "Shipping & Tracking",
      "Fast Checkout",
      "Store Migration",
      "Mobile-First PWA",
      "Conversion Rate",
      "GST Invoicing",
      "Security & Scale",
    ],
  },
] as const;

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
  {
    name: "Payments",
    icon: CreditCard,
    items: ["UPI", "Cards", "Net banking", "Wallets"],
  },
  {
    name: "Operations",
    icon: Truck,
    items: ["Couriers", "Tracking", "Inventory", "GST invoices"],
  },
  {
    name: "Customers",
    icon: Smartphone,
    items: ["WhatsApp", "Email", "SMS", "Analytics"],
  },
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
  {
    icon: ShieldCheck,
    tag: "PCI-DSS compliant",
    title: "Payment security",
    text: "Established gateways handle card details, so your store never stores sensitive credentials.",
  },
  {
    icon: Smartphone,
    tag: "iOS & Android",
    title: "Real-device testing",
    text: "Product pages, carts and checkout flows tested on real phones, tablets and viewports.",
  },
  {
    icon: Gauge,
    tag: "Sub-second load",
    title: "Speed by default",
    text: "Optimised assets, lean code bundling and smart caching so store browsing feels instantaneous.",
  },
  {
    icon: Search,
    tag: "Rich schema & SEO",
    title: "Search-friendly",
    text: "Clean product markup, open graph metadata and automated sitemaps structured for search indexing.",
  },
  {
    icon: HardDrive,
    tag: "Automated daily",
    title: "Backups & recovery",
    text: "Scheduled database snapshots and disaster recovery protocols for orders and customer accounts.",
  },
  {
    icon: Activity,
    tag: "24/7 telemetry",
    title: "Proactive monitoring",
    text: "Real-time health telemetry, crash logging and instant alerts before shoppers ever notice an issue.",
  },
];

const RELATED: RelatedServiceItem[] = [
  {
    to: "/services/seo",
    title: "SEO services",
    text: "Rank higher and get found by local customers.",
    img: "/new-images/services/webdev/related-seo.webp",
  },
  {
    to: "/services/ui-ux",
    title: "UI/UX design",
    text: "Interfaces that feel obvious and look great.",
    img: "/new-images/services/webdev/related-ui-ux.webp",
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
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Ecommerce() {
  const rootRef = useRef<HTMLDivElement>(null);
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

        /* ================= HERO ================= */
        {
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from($(".breadcrumb"), { y: 16, autoAlpha: 0, duration: 0.45, clearProps: "all" })
            .from($(".ec-hero__title .ec-w > span"), { yPercent: 115, duration: 0.7, stagger: 0.04, clearProps: "transform" }, 0.05)
            .from($(".ec-hero__lead, .ec-hero__cta > *, .ec-hero__trust li"), { y: 16, autoAlpha: 0, duration: 0.45, stagger: 0.04, clearProps: "all" }, 0.15);
        }

        if (fine) {
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
            tl.to(panes[i], { autoAlpha: 0, y: -16, duration: 0.4 }, at)
              .fromTo(panes[i + 1], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55 }, at + 0.3)
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
            },
          });
          $(".ec-scard").forEach((c) => {
            gsap.from(c, { scale: 0.88, opacity: 0.4, ease: "none", scrollTrigger: { trigger: c, containerAnimation: h, start: "left 98%", end: "left 60%", scrub: true } });
            gsap.fromTo($("img", c), { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: c, containerAnimation: h, start: "left right", end: "right left", scrub: true } });
          });
        }

        /* ================= CONNECTED BY DESIGN ================= */
        {
          const section = one(".ec-orb");
          const visual = one(".ec-orb__visual");
          const cards = $(".ec-orb__card");
          if (visual) {
            gsap.from(visual, {
              y: 30,
              scale: 0.94,
              autoAlpha: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 75%", once: true },
            });
          }
          if (cards.length) {
            gsap.from(cards, {
              x: -24,
              autoAlpha: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 75%", once: true },
            });
          }
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
        {/* ============================ HERO ============================ */}
        <section className="ec-hero" aria-labelledby="ec-h1">
          <div className="container ec-hero__grid">
            <div className="ec-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services" data-cursor="SERVICES">Services</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">E-Commerce Development</span>
              </nav>

              <h1 id="ec-h1" className="ec-hero__title" aria-label="Online stores that make buying feel effortless.">
                <span className="ec-line" aria-hidden="true"><Words text="Online stores that make" /></span>
                <em className="ec-line" aria-hidden="true"><Words text="buying feel effortless." /></em>
              </h1>
              <p className="ec-hero__lead">
                We design and build stores, marketplaces and B2B portals with fast mobile checkout, the payment methods
                your customers trust, and the admin tools to run it all without friction.
              </p>
              <div className="ec-hero__cta">
                <Link
                  className="button button--primary ec-mag ec-hero__consultation"
                  to="/contact"
                  data-cursor="START"
                >
                  <span>Get a free consultation</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button
                  type="button"
                  className="ec-ghost ec-mag"
                  onClick={() => jump("ec-scene")}
                  data-cursor="EXPLORE"
                >
                  See how we build
                </button>
              </div>
              <ul className="ec-hero__trust">
                {["Mobile-first checkout", "Trusted payment gateways", "Inventory and shipping sync", "Launch and ongoing support"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="ec-hero__visual" aria-hidden="true">
              <img
                src="/svg/ecommerce-development-illustration-animated.svg"
                alt="E-commerce development illustration"
                width={800}
                height={600}
                className="ec-hero__illust"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* =========================== TECH STACK RIBBONS =========================== */}
        <TechStackRibbons lanes={ECOMMERCE_RIBBON_LANES} inverted />

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
                  <div className="ec-win__controls" aria-hidden="true">
                    <span className="ec-win__dot ec-win__dot--close" />
                    <span className="ec-win__dot ec-win__dot--min" />
                    <span className="ec-win__dot ec-win__dot--max" />
                  </div>
                  <div className="ec-win__address">
                    <Lock size={11} className="ec-win__lock" />
                    <b>yourstore.in</b>
                  </div>
                  <em className="ec-win__cart">
                    <ShoppingBag size={14} />
                    <i className="ec-win__n">0</i>
                  </em>
                </div>
                <div className="ec-screen">
                  {/* browse */}
                  <div className="ec-pane ec-pane--browse">
                    <div className="ec-tiles">
                      {TILES.map((t, idx) => (
                        <div className="ec-tile" key={t.name}>
                          <div className="ec-tile__img">
                            <Photo id={t.img} w={360} h={360} />
                            {idx === 0 && <span className="ec-tile__tag">Trending</span>}
                          </div>
                          <div className="ec-tile__info">
                            <p className="ec-tile__name">{t.name}</p>
                            <div className="ec-tile__meta">
                              <b className="ec-tile__price">{inr(t.price)}</b>
                              <span className="ec-tile__stars"><Star size={10} fill="#ffe401" stroke="#ffe401" /> 4.9</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* product */}
                  <div className="ec-pane ec-pane--product">
                    <div className="ec-prod">
                      <div className="ec-prod__gallery">
                        <div className="ec-prod__img">
                          <Photo id="1542291026-7eec264c27ff" w={600} h={600} />
                        </div>
                        <span className="ec-prod__chip-tag">Top Pick · 2026</span>
                      </div>
                      <div className="ec-prod__info">
                        <div className="ec-prod__top" data-s>
                          <p className="ec-kicker">Running Collection</p>
                          <div className="ec-prod__stars">
                            <Star size={11} fill="#ffe401" stroke="#ffe401" />
                            <Star size={11} fill="#ffe401" stroke="#ffe401" />
                            <Star size={11} fill="#ffe401" stroke="#ffe401" />
                            <Star size={11} fill="#ffe401" stroke="#ffe401" />
                            <Star size={11} fill="#ffe401" stroke="#ffe401" />
                            <small>(128)</small>
                          </div>
                        </div>
                        <h4 data-s>Aero Runner Pro</h4>
                        <div className="ec-prod__pricing" data-s>
                          <span className="ec-prod__price">{inr(4999)}</span>
                          <span className="ec-prod__mrp">{inr(6499)}</span>
                          <span className="ec-prod__discount">23% OFF</span>
                        </div>
                        <div className="ec-prod__sizes-wrap" data-s>
                          <span className="ec-prod__size-label">Select Size (UK)</span>
                          <div className="ec-sizes">
                            {[7, 8, 9, 10].map((s) => <span className="ec-size" key={s}>{s}</span>)}
                          </div>
                        </div>
                        <p className="ec-stock" data-s><i />In stock · Free express dispatch</p>
                        <span className="ec-add" data-s>
                          <ShoppingBag size={14} /> Add to cart
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* cart */}
                  <div className="ec-pane ec-pane--cart">
                    <div className="ec-cart">
                      <div className="ec-cart__head" data-s>
                        <h4>Your Shopping Cart</h4>
                        <span className="ec-cart__badge">1 item</span>
                      </div>
                      <div className="ec-cart__perk" data-s>
                        <Zap size={13} />
                        <span>You qualified for <b>Free Express Delivery</b>!</span>
                      </div>
                      <div className="ec-line-item" data-s>
                        <div className="ec-line-item__img">
                          <Photo id="1542291026-7eec264c27ff" w={200} h={200} />
                        </div>
                        <div className="ec-line-item__details">
                          <p>Aero Runner Pro</p>
                          <small>Size 9 · Obsidian Black</small>
                          <span className="ec-line-item__price">{inr(4999)}</span>
                        </div>
                        <div className="ec-qty"><i>−</i><span className="ec-qty__n">1</span><i>+</i></div>
                      </div>
                      <div className="ec-sum" data-s>
                        <p><span>Subtotal</span><b className="ec-total">{inr(4999)}</b></p>
                        <p><span>Express Shipping</span><b className="ec-sum__free">FREE</b></p>
                        <p className="ec-sum__t"><span>Order Total</span><b className="ec-total">{inr(4999)}</b></p>
                      </div>
                      <span className="ec-add ec-add--wide" data-s>
                        Proceed to checkout <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>

                  {/* pay */}
                  <div className="ec-pane ec-pane--pay">
                    <div className="ec-payment">
                      <div className="ec-payment__head">
                        <h4>Pay securely</h4>
                        <span className="ec-payment__ssl">
                          <ShieldCheck size={13} /> 256-bit SSL Encrypted
                        </span>
                      </div>
                      <div className="ec-methods">
                        <span className="ec-method" key="UPI">
                          <i />
                          <span className="ec-method__icon ec-method__icon--upi"><Zap size={14} /></span>
                          <span className="ec-method__details">
                            <b>Instant UPI</b>
                            <small>GPay, PhonePe, Paytm, BHIM</small>
                          </span>
                          <span className="ec-method__badge">Instant</span>
                        </span>
                        <span className="ec-method" key="Card">
                          <i />
                          <span className="ec-method__icon ec-method__icon--card"><CreditCard size={14} /></span>
                          <span className="ec-method__details">
                            <b>Credit / Debit Card</b>
                            <small>Visa, Mastercard, RuPay, Amex</small>
                          </span>
                        </span>
                        <span className="ec-method" key="Net banking">
                          <i />
                          <span className="ec-method__icon ec-method__icon--net"><Building2 size={14} /></span>
                          <span className="ec-method__details">
                            <b>Net Banking</b>
                            <small>HDFC, ICICI, SBI & 40+ banks</small>
                          </span>
                        </span>
                        <span className="ec-method" key="Cash on delivery">
                          <i />
                          <span className="ec-method__icon ec-method__icon--cod"><Banknote size={14} /></span>
                          <span className="ec-method__details">
                            <b>Cash on Delivery</b>
                            <small>Pay with cash or QR at delivery</small>
                          </span>
                        </span>
                      </div>
                      <div className="ec-payment__footer">
                        <span className="ec-pay">
                          <Lock size={14} /> Pay {inr(9998)}
                        </span>
                        <p className="ec-payment__guarantee">
                          <ShieldCheck size={12} /> 100% RBI-authorized payment gateways
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* deliver */}
                  <div className="ec-pane ec-pane--track">
                    <div className="ec-trackbox">
                      <div className="ec-ok-wrap">
                        <span className="ec-ok"><Check size={28} /></span>
                      </div>
                      <h4>Order Confirmed!</h4>
                      <p className="ec-trackbox__sub">Order #SW-1042 · Dispatched from Mumbai hub</p>
                      <div className="ec-track">
                        <span className="ec-track__rail"><i className="ec-track__fill" /></span>
                        {["Confirmed", "Packed", "Shipped", "Delivered"].map((s, idx) => (
                          <div className="ec-track__step" key={s}>
                            <i className="ec-track__dot" />
                            <span className="ec-track__step-name">{s}</span>
                            <small className="ec-track__step-time">
                              {idx === 0 ? "10:24 AM" : idx === 1 ? "11:40 AM" : idx === 2 ? "In Transit" : "Expected Fri"}
                            </small>
                          </div>
                        ))}
                      </div>
                      <div className="ec-trackbox__footer">
                        <p className="ec-trackbox__truck"><Truck size={15} /> BlueDart Express Courier · Live SMS tracking sent</p>
                      </div>
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
            <Head center eyebrow="What we build">
              <span id="ec-svc-h">Everything a store needs, <em>built to work together.</em></span>
            </Head>
          </div>
          <div className="ec-svc__track">
            {SERVICES.map((s, i) => (
              <article className="ec-scard" key={s.title}>
                <div className="ec-scard__media">
                  <Photo id={s.img} w={800} h={520} />
                </div>
                <div className="ec-scard__pill">
                  <span className="ec-scard__no" aria-hidden="true">0{i + 1}</span>
                  <div className="ec-scard__info">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                  <span className="ec-scard__go" aria-hidden="true">
                    <ArrowRight size={15} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================ STORE MODELS ============================ */}
        <section className="ec-section ec-models" id="ec-models" aria-labelledby="ec-models-h">
          <div className="container">
            <Head center eyebrow="Choosing the right model" lead="There is no single best way to sell online. We compare the options against your catalogue, budget and growth plans, then recommend one honestly.">
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
              <div className="ec-orb__list">
                {ORBITS.map((o) => {
                  const Icon = o.icon;
                  return (
                    <div className="ec-orb__card" key={o.name}>
                      <div className="ec-orb__card-icon" aria-hidden="true">
                        <Icon size={18} />
                      </div>
                      <div className="ec-orb__card-content">
                        <div className="ec-orb__card-head">
                          <h4>{o.name}</h4>
                        </div>
                        <div className="ec-orb__tags">
                          {o.items.map((it) => (
                            <span className="ec-orb__tag" key={it}>
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ec-orb__visual" aria-hidden="true">
              <img
                src="/svg/connected-by-design.svg"
                alt="One store, every system around it illustration"
                width={720}
                height={480}
                className="ec-orb__illust"
                loading="lazy"
              />
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
                    <Photo id={p.img} w={800} h={520} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== QUALITY ============================== */}
        <section className="ec-section ec-quality" aria-labelledby="ec-quality-h">
          <div className="container">
            <Head center eyebrow="Built to be trusted" lead="No store is completely secure or bug-free. These practices reduce risk and make problems easier to find and fix.">
              <span id="ec-quality-h">How we keep a store <em>fast, safe and reliable.</em></span>
            </Head>
            <div className="ec-qgrid">
              {QUALITY.map((q, i) => (
                <article className="ec-q" key={q.title} data-reveal>
                  <div className="ec-q__top">
                    <span className="ec-q__ic" aria-hidden="true">
                      <q.icon size={22} />
                    </span>
                    <span className="ec-q__badge" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3>{q.title}</h3>
                  <p>{q.text}</p>
                  <span className="ec-q__pill">
                    <Check size={13} aria-hidden="true" />
                    <span>{q.tag}</span>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RelatedServicesSection
          items={RELATED}
          lead="A great store works best with the right partners around it. Pick a service below and see how it helps you get found, look sharper and sell more."
        />
      </div>
    </>
  );
}