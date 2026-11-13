import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Check, ChevronsLeftRight, Copy, Layers, Lock, Palette, PenTool,
  Share2, Sparkles, Store, Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import "../../styles/services/branding.css";
import "../../styles/services/service-hero-consistency.css";

/* ---------------------------------------------------------------------
   UNSPLASH PHOTOS. Change any ID here to swap an image everywhere.
   If an image fails to load it is hidden and the gradient behind stays.
   --------------------------------------------------------------------- */
const PH = {
  paint: "1513364776144-60967b0f800f",
  gradient: "1558591710-4b4a1ae0f04d",
  desk: "1572044162444-ad60f128bdea",
  office: "1497366216548-37526070297c",
  store: "1523381210434-271e8be1f52b",
  retail: "1556742049-0cfed4f6a45d",
  food: "1517248135467-4c7edcad34c4",
} as const;

function Photo({ id, alt = "", className = "", w = 800 }: { id: string; alt?: string; className?: string; w?: number }) {
  const [bad, setBad] = useState(false);
  return (
    <span className={`br-ph ${className}`} aria-hidden={alt ? undefined : true}>
      {!bad && (
        <img
          src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`}
          alt={alt} loading="lazy" decoding="async" onError={() => setBad(true)}
        />
      )}
    </span>
  );
}

function Head({ eyebrow, children, lead, center, dark }: { eyebrow: string; children: ReactNode; lead?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`br-head${center ? " br-head--center" : ""}${dark ? " br-head--dark" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="br-title">{children}</h2>
      {lead && <p className="br-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ data */
const MARQUEE = ["Logo design", "Brand strategy", "Visual identity", "Brand guidelines", "Colour palette", "Typography", "Stationery", "Social media kit", "Packaging", "Brand voice"];

const PALETTES = [
  { n: "Royal", p: "#100563", a: "#ffe401", b: "#f6f7fc" },
  { n: "Coral", p: "#e8454f", a: "#ffd166", b: "#fff6ef" },
  { n: "Fresh", p: "#0f766e", a: "#a7f3d0", b: "#f3fbf8" },
  { n: "Grape", p: "#6d28d9", a: "#f0abfc", b: "#faf5ff" },
  { n: "Sunset", p: "#ea580c", a: "#fde68a", b: "#fff8ed" },
  { n: "Ocean", p: "#0369a1", a: "#7dd3fc", b: "#f0f9ff" },
] as const;

const FONTS = [
  { n: "Modern", h: '"Manrope", sans-serif', w: 800, ls: "-0.04em" },
  { n: "Editorial", h: '"DM Serif Display", serif', w: 400, ls: "-0.01em" },
  { n: "Classic", h: 'Georgia, "Times New Roman", serif', w: 700, ls: "-0.02em" },
  { n: "Tech", h: 'ui-monospace, SFMono-Regular, Menlo, monospace', w: 700, ls: "-0.03em" },
] as const;

const contrast = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#14103a" : "#ffffff";
};
const initials = (s: string) => {
  const w = s.trim().split(/\s+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || "YB").slice(0, 2)).toUpperCase();
};

type StepKind = "discover" | "strategy" | "identity" | "apps" | "launch";

function StepIcon({ kind }: { kind: StepKind }) {
  if (kind === "discover") {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <circle className="fa-duo" cx="256" cy="256" r="248" fill="currentColor" opacity="0.2" />
        <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm98-354l-64 132c-5 10-13 18-23 23l-132 64c-9 4-19-5-15-15l64-132c5-10 13-18 23-23l132-64c9-4 19 5 15 15zM256 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
      </svg>
    );
  }
  if (kind === "strategy") {
    return (
      <svg viewBox="0 0 384 512" aria-hidden="true">
        <path className="fa-duo" fill="currentColor" opacity="0.24" d="M112 416h160v48c0 26.5-21.5 48-48 48h-64c-26.5 0-48-21.5-48-48v-48z" />
        <path fill="currentColor" d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9 3.7 5.3 8.1 11.3 12.8 17.7l0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5H93c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8l0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C11.6 247.9 0 213.3 0 176C0 78.8 78.8 0 176 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4l0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5H226.4c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8l0 0 0 0 0 0c4.7-6.4 9-12.4 12.7-17.7z" />
      </svg>
    );
  }
  if (kind === "identity") {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path className="fa-duo" fill="currentColor" opacity="0.24" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0z" />
        <path fill="currentColor" d="M416 226L286 96 71.3 310.7c-8.2 8.2-14.2 18.3-17.5 29.4L1.5 478.6c-3.5 11.7-.4 24.3 8.2 32.9s21.2 11.7 32.9 8.2l138.5-52.3c11.1-3.3 21.2-9.3 29.4-17.5L416 226z" />
      </svg>
    );
  }
  if (kind === "apps") {
    return (
      <svg viewBox="0 0 576 512" aria-hidden="true">
        <path className="fa-duo" fill="currentColor" opacity="0.22" d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2z" />
        <path fill="currentColor" d="M476.9 224.2l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 292.4C37.4 288.4 32 279.9 32 270.6s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 420.4C37.4 416.4 32 407.9 32 398.6s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path className="fa-duo" fill="currentColor" opacity="0.22" d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2l0 82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9l0-105.8c-13.3 4.8-24.9 8.8-33.8 11.8c-11.4 3.8-23.7 .8-32.2-7.7z" />
      <path fill="currentColor" d="M352 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM86.6 368.1l57.3 57.3C118 456 64 464 32 480c16-32 24-86 54.6-111.9z" />
    </svg>
  );
}

const STEPS: Array<{ kind: StepKind; t: string; w: string; p: string; out: string[] }> = [
  { kind: "discover", t: "Discover", w: "Days 1–4", p: "We learn your business, customers and competitors, and agree what the brand must say and feel like.", out: ["Brand questionnaire", "Competitor review", "Clear goals"] },
  { kind: "strategy", t: "Strategy", w: "Week 2", p: "We define your positioning, personality and promise, so every design choice has a clear reason behind it.", out: ["Positioning", "Voice and tone", "Tagline ideas"] },
  { kind: "identity", t: "Identity", w: "Weeks 3–4", p: "Logo concepts, colours and typography are designed, presented and refined together with your feedback.", out: ["Logo concepts", "Colour palette", "Typography"] },
  { kind: "apps", t: "Applications", w: "Week 5", p: "We apply the identity to real touchpoints: stationery, social posts, packaging, signage and your website.", out: ["Stationery", "Social kit", "Mockups"] },
  { kind: "launch", t: "Launch", w: "Week 6", p: "You receive production-ready source files and a brand guidelines book, so anyone can use your brand right.", out: ["Source files", "Guidelines PDF", "Launch plan"] },
];

const KIT: Array<{ k: string; icon: LucideIcon; t: string; p: string; meta: string; tag: string }> = [
  { k: "logo", icon: PenTool, t: "Logo suite", p: "Primary logo, icon mark, stacked and one-colour versions for every placement.", meta: "SVG · PNG · EPS", tag: "Vector" },
  { k: "color", icon: Palette, t: "Colour system", p: "A main palette and support colours with exact HEX, RGB and CMYK values.", meta: "HEX · RGB · CMYK", tag: "Tokens" },
  { k: "type", icon: Type, t: "Typography", p: "Headline and body fonts chosen for personality, legibility and web use.", meta: "WOFF2 · TTF · Scale", tag: "Type" },
  { k: "card", icon: Store, t: "Stationery", p: "Business cards, letterheads, envelopes and invoices that look like one family.", meta: "Print-ready · Bleed", tag: "Print" },
  { k: "social", icon: Share2, t: "Social media kit", p: "Profile pictures, covers and post templates your team can edit in minutes.", meta: "Figma · Canva", tag: "Social" },
  { k: "guide", icon: BookOpen, t: "Brand guidelines", p: "A clear book that shows how to use logo, colour, type and imagery.", meta: "PDF · Clear Space", tag: "Rulebook" },
];

const GALLERY: Array<{ svg: string; t: string; s: string }> = [
  { svg: "/svg/brand-packaging.svg", t: "Packaging", s: "Boxes, bags and labels" },
  { svg: "/svg/brand-signage-v2.svg", t: "Signage", s: "Shopfronts and menus" },
  { svg: "/svg/brand-workspace.svg", t: "Workspace", s: "Walls, uniforms, cards" },
  { svg: "/svg/brand-retail.svg", t: "Retail", s: "In-store brand moments" },
];

const REL: RelatedServiceItem[] = [
  { to: "/services/web-development", title: "Web development", text: "Launch a website that brings your new identity online.", img: "/new-images/services/webdev/related-web-development.webp" },
  { to: "/services/ui-ux", title: "UI/UX design", text: "Turn your brand tokens into clean digital products.", img: "/new-images/services/webdev/related-ui-ux.webp" },
  { to: "/services/ecommerce", title: "E-commerce stores", text: "Online stores designed around your brand look.", img: "/new-images/services/webdev/related-ecommerce.webp" },
  { to: "/services/seo", title: "SEO services", text: "Be found when people search for your brand.", img: "/new-images/services/webdev/related-seo.webp" },
];

const SITE = "https://sipherweb.in"; /* confirm production domain */
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service", name: "Branding and Brand Identity", serviceType: "Logo design, brand strategy and visual identity", url: `${SITE}/services/branding`,
      description: "Brand strategy, logo design, visual identity, stationery, social media kits and brand guidelines for growing businesses.",
      provider: { "@type": "Organization", name: "Sipher Web Pvt. Ltd.", url: SITE },
      areaServed: [{ "@type": "City", name: "Lucknow" }, { "@type": "Country", name: "India" }],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: "Branding", item: `${SITE}/services/branding` },
    ] },
  ],
};

/* before / after realistic brand collateral studio */
function Suite({ after }: { after: boolean }) {
  return (
    <div className={`br-suite ${after ? "is-after" : "is-before"}`} aria-hidden="true">
      <div className="br-suite__top">
        <span className="br-suite__status">
          <i />
          {after ? "Sipher Brand System · Cohesive" : "Unstructured DIY · Inconsistent"}
        </span>
        <span className="br-suite__score">
          {after ? "Brand consistency: 100%" : "Brand consistency: 24%"}
        </span>
      </div>

      <div className="br-suite__grid">
        {/* 1. Website Hero Mockup */}
        <div className="br-suite__web">
          <div className="br-suite__browser">
            <span className="br-suite__dots"><i /><i /><i /></span>
            <span className="br-suite__url">
              {after && <Lock size={10} />}
              {after ? "sipherweb.in" : "sipher-web-final2.biz"}
            </span>
          </div>
          <div className="br-suite__nav">
            <b className="br-suite__mark">{after ? "SW" : "sw!"}</b>
            <span className="br-suite__links">
              <i>{after ? "Work" : "HOME"}</i>
              <i>{after ? "Services" : "about us"}</i>
              <i>{after ? "Contact" : "OFFERS!!"}</i>
            </span>
          </div>
          <div className="br-suite__hero">
            <div className="br-suite__hero-copy">
              <strong>{after ? "Brands built to be remembered." : "WELCOME TO OUR WEBSITE!!!"}</strong>
              <small>{after ? "Strategy-led identity & digital system" : "Best quality service call now"}</small>
            </div>
            <span className="br-suite__cta">{after ? "Start project" : "CLICK HERE"}</span>
          </div>
        </div>

        {/* 2. Executive Business Card */}
        <div className="br-suite__card">
          <div className="br-suite__bcard-back" />
          <div className="br-suite__bcard-front">
            <div className="br-suite__bcard-head">
              <b>{after ? "SW" : "sw"}</b>
              <span>{after ? "SIPHER WEB" : "sipher web"}</span>
            </div>
            <div className="br-suite__bcard-info">
              <strong>{after ? "Aarav Mehta" : "AARAV mehta"}</strong>
              <small>{after ? "Founder & Creative Lead" : "ceo / owner"}</small>
            </div>
            <div className="br-suite__bcard-foot">
              <span>{after ? "aarav@sipherweb.in" : "aarav123@gmail.com"}</span>
              <i />
            </div>
          </div>
        </div>

        {/* 3. Social Campaign Post */}
        <div className="br-suite__social">
          <div className="br-suite__shead">
            <b>{after ? "SW" : "?"}</b>
            <div>
              <span>{after ? "sipherweb.official" : "sipher_deals_99"}</span>
              <small>{after ? "Sponsored · Brand Launch" : "Promoted post"}</small>
            </div>
          </div>
          <div className="br-suite__scanvas">
            <strong>{after ? "One voice. Every channel." : "MEGA SALE 50% OFF!!"}</strong>
            <span>{after ? "Design system v2.4" : "DM FOR PRICE"}</span>
          </div>
          <div className="br-suite__sfoot">
            <i /><i /><i />
            <span>{after ? "2.4k saves" : "12 views"}</span>
          </div>
        </div>

        {/* 4. System Tokens & Audit */}
        <div className="br-suite__tokens">
          <div className="br-suite__tok-row">
            <span>Palette</span>
            <div className="br-suite__swatches">
              {after
                ? ["#100563", "#ffe401", "#f6f7fc"].map((c) => <i key={c} style={{ background: c }} />)
                : ["#e53935", "#43a047", "#ff9800", "#9c27b0", "#00acc1"].map((c) => <i key={c} style={{ background: c }} />)}
            </div>
          </div>
          <div className="br-suite__tok-row">
            <span>Typeface</span>
            <strong>{after ? "Jakarta + DM Serif" : "5 random fonts"}</strong>
          </div>
          <div className="br-suite__tok-row">
            <span>Rulebook</span>
            <em className="br-suite__badge">
              {after ? <><Check size={11} /> Verified</> : "Missing"}
            </em>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== PAGE */
export default function Branding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("Your Brand");
  const [pi, setPi] = useState(0);
  const [fi, setFi] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [tokensCopied, setTokensCopied] = useState(false);
  const [pos, setPos] = useState(50);

  const pal = PALETTES[pi];
  const font = FONTS[fi];
  const vars = useMemo(() => ({
    "--bp": pal.p, "--ba": pal.a, "--bb": pal.b, "--bon": contrast(pal.p), "--bona": contrast(pal.a),
    "--bf": font.h, "--bw": font.w, "--bls": font.ls,
  }) as CSSProperties, [pal, font]);
  const ini = initials(name);
  const shown = name.trim() || "Your Brand";

  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); } catch { /* clipboard may be blocked */ }
    setCopied(hex);
    window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
  };

  const copyTokens = async () => {
    const cssText = `:root {\n  --brand-name: "${shown}";\n  --brand-primary: ${pal.p};\n  --brand-accent: ${pal.a};\n  --brand-surface: ${pal.b};\n  --brand-font: ${font.h};\n}`;
    try { await navigator.clipboard.writeText(cssText); } catch { /* clipboard may be blocked */ }
    setTokensCopied(true);
    window.setTimeout(() => setTokensCopied(false), 1600);
  };

  /* reveal on scroll (fails visible when motion is reduced) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    root.classList.add("is-motion");
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealVisibleOrPassed = () => {
      const cutoff = window.innerHeight * 0.98;
      for (const el of els) {
        if (el.classList.contains("is-in")) continue;
        if (el.getBoundingClientRect().top <= cutoff) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      }
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting || e.boundingClientRect.top <= window.innerHeight) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }), { rootMargin: "0px 0px 40px 0px", threshold: 0.01 });
    els.forEach((el) => io.observe(el));
    revealVisibleOrPassed();
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => { raf = 0; revealVisibleOrPassed(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const safety = window.setTimeout(revealVisibleOrPassed, 400);
    return () => {
      window.clearTimeout(safety);
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      root.classList.remove("is-motion");
      els.forEach((el) => el.classList.remove("is-in"));
    };
  }, []);

  return (
    <>
      <Seo
        title="Branding Services in Lucknow | Logo, Identity, Brand Strategy | Sipher Web"
        description="Brand strategy, logo design, visual identity, stationery, social media kits and brand guidelines. Build a brand people remember. Get a free consultation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="br" ref={rootRef}>

        {/* =========================== HERO =========================== */}
        <section className="br-hero" aria-labelledby="br-h1">
          <div className="container br-hero__grid">
            <div className="br-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Branding</span>
              </nav>
              <h1 id="br-h1" className="br-hero__title" aria-label="Brands people remember and trust.">
                <span className="br-line" aria-hidden="true">Brands people</span>
                <em className="br-line" aria-hidden="true">remember and trust.</em>
              </h1>
              <p className="br-hero__lead">
                We shape your name, logo, colours and voice into one clear identity, so customers recognise you instantly and trust you faster. Strategy first, then design, then everything you need to use it.
              </p>
              <div className="br-hero__cta">
                <Link className="button button--primary" to="/contact" data-cursor="START">
                  <span>Start your brand</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <a className="br-ghost" href="#br-lab">Try the brand builder</a>
              </div>
              <ul className="br-trust">
                {["Strategy before design", "You own every file", "Guidelines included"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="br-hero__visual" aria-hidden="true">
              <img
                className="br-hero__illustration"
                src="/svg/sipher-web-brand-identity.svg"
                alt="Sipher Web brand identity board"
                width={1280}
                height={800}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* marquee */}
        <div className="br-marquee" aria-hidden="true">
          <div className="br-marquee__track">
            {[0, 1].map((g) => (
              <div className="br-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* =========================== BRAND BUILDER (light studio) =========================== */}
        <section className="br-section br-labsec" id="br-lab" aria-labelledby="br-lab-h">
          <div className="container">
            <Head center eyebrow="Brand builder" lead="Type your name, pick a palette and a type style, and watch a whole brand come together. This is how choices travel across every touchpoint.">
              <span id="br-lab-h">Design a brand <em>in seconds.</em></span>
            </Head>

            <div className="br-lab" data-reveal style={vars}>
              <div className="br-lab__bar">
                <div className="br-lab__bar-l">
                  <span className="br-lab__dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="br-lab__file">Brand Studio · <b>{shown}</b></span>
                  <span className="br-lab__badge">{pal.n} · {font.n}</span>
                </div>
                <button type="button" className={`br-lab__copy${tokensCopied ? " is-ok" : ""}`} onClick={copyTokens}>
                  {tokensCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{tokensCopied ? "CSS Tokens Copied" : "Copy CSS Tokens"}</span>
                </button>
              </div>

              <div className="br-lab__controls">
                <label className="br-field">
                  <span className="br-field__top"><b>01 · Brand name</b><small>{shown.length}/22</small></span>
                  <input type="text" value={name} maxLength={22} onChange={(e) => setName(e.target.value)} placeholder="Your Brand" />
                </label>

                <fieldset className="br-field">
                  <legend>02 · Colour palette</legend>
                  <div className="br-pal">
                    {PALETTES.map((p, i) => (
                      <button key={p.n} type="button" className={pi === i ? "is-on" : ""} aria-pressed={pi === i} aria-label={`${p.n} palette`} onClick={() => setPi(i)}>
                        <span className="br-pal__swatches"><i style={{ background: p.p }} /><i style={{ background: p.a }} /><i style={{ background: p.b }} /></span>
                        <span className="br-pal__meta"><small>{p.n}</small>{pi === i && <Check size={12} aria-hidden="true" />}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="br-field">
                  <legend>03 · Type style</legend>
                  <div className="br-fonts">
                    {FONTS.map((f, i) => (
                      <button key={f.n} type="button" className={fi === i ? "is-on" : ""} aria-pressed={fi === i} onClick={() => setFi(i)}>
                        <b style={{ fontFamily: f.h, fontWeight: f.w }}>Aa</b><small>{f.n}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="br-field">
                  <span className="br-field__top"><b>04 · Brand tokens</b><small>Tap to copy</small></span>
                  <div className="br-hex">
                    {[["Primary", pal.p], ["Accent", pal.a], ["Surface", pal.b]].map(([l, h]) => (
                      <button key={l} type="button" className={copied === h ? "is-copied" : ""} onClick={() => copy(h)}>
                        <i style={{ background: h }} />
                        <span><small>{l}</small><b>{copied === h ? "Copied!" : h.toUpperCase()}</b></span>
                        <em className="br-hex__ic">{copied === h ? <Check size={13} /> : <Copy size={13} />}</em>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="br-lab__preview" aria-live="polite">
                <div className="br-p br-p--logo">
                  <div className="br-p__head"><span>01 · Logo lockup</span><small>Clear space 1x</small></div>
                  <div className="br-logo-stage">
                    <span className="br-p__mark">{ini}</span>
                    <b>{shown}</b>
                  </div>
                  <div className="br-p__foot"><span>SVG · Vector</span><span>Primary Mark</span></div>
                </div>

                <div className="br-p br-p--card">
                  <div className="br-p__head"><span>02 · Stationery</span><small>85 × 55 mm</small></div>
                  <div className="br-bc-grid">
                    <div className="br-bc">
                      <span className="br-p__mark br-p__mark--sm">{ini}</span>
                      <div>
                        <b>{shown}</b>
                        <small>Make it memorable</small>
                      </div>
                      <i />
                    </div>
                    <div className="br-bc br-bc--back">
                      <div>
                        <b>Aarav Mehta</b>
                        <small>Founder, {shown}</small>
                      </div>
                      <span>hello@{shown.toLowerCase().replace(/[^a-z0-9]/g, "") || "yourbrand"}.in</span>
                    </div>
                  </div>
                </div>

                <div className="br-p br-p--app">
                  <div className="br-p__head"><span>03 · App &amp; tab</span><small>iOS · Web</small></div>
                  <div className="br-app-stage">
                    <span className="br-app">{ini}</span>
                    <div className="br-tab"><i /><span>{shown}</span></div>
                  </div>
                </div>

                <div className="br-p br-p--post">
                  <div className="br-p__head"><span>04 · Social kit</span><small>1080 × 1080</small></div>
                  <div className="br-post">
                    <header><span className="br-p__mark br-p__mark--xs">{ini}</span><b>@{shown.toLowerCase().replace(/\s+/g, "")}</b><em>···</em></header>
                    <div className="br-post__art"><span>Big ideas, <em>well branded.</em></span></div>
                    <footer><span /><span /><span /></footer>
                  </div>
                </div>

                <div className="br-p br-p--sign">
                  <div className="br-p__head"><span>05 · Storefront</span><small>Fascia sign</small></div>
                  <div className="br-sign-wall">
                    <span className="br-sign"><i>{ini}</i><b>{shown}</b></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== PROCESS =========================== */}
        <section className="br-section br-processsec" aria-labelledby="br-pr-h">
          <div className="container">
            <Head center eyebrow="How we work" lead="Five clear stages, each with something you can see, comment on and approve.">
              <span id="br-pr-h">From first brief <em>to final brand.</em></span>
            </Head>
            <ol className="br-steps">
              {STEPS.map((s, i) => (
                <li
                  className="br-step"
                  key={s.t}
                  data-reveal
                  style={{ "--i": i } as CSSProperties}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                >
                  <span className="br-step__num" aria-hidden="true">0{i + 1}</span>
                  <div className="br-step__top">
                    <span className="br-step__ic"><StepIcon kind={s.kind} /></span>
                    <span className="br-step__when">{s.w}</span>
                  </div>
                  <h3>{s.t}</h3>
                  <p>{s.p}</p>
                  <ul className="br-step__out">
                    {s.out.map((o) => (
                      <li key={o}><Check size={11} strokeWidth={3} aria-hidden="true" /><span>{o}</span></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* =========================== DELIVERABLES =========================== */}
        <section className="br-section br-kitsec" aria-labelledby="br-kit-h">
          <div className="container">
            <Head center eyebrow="What you receive" lead="A complete toolkit, not just a logo file. Everything is designed to work together.">
              <span id="br-kit-h">Your brand kit, <em>fully loaded.</em></span>
            </Head>
            <div className="br-kit">
              {KIT.map((k, i) => (
                <article className={`br-k br-k--${k.k}`} key={k.k} data-reveal style={{ "--i": i } as CSSProperties}>
                  <div className="br-k__vis" aria-hidden="true">
                    {k.k === "logo" && <><span className="br-lg br-lg--a">SW</span><span className="br-lg br-lg--b">S</span><span className="br-lg br-lg--c">Sipher</span></>}
                    {k.k === "color" && <>{["#100563", "#ffe401", "#4285f4", "#e8454f", "#eceeff"].map((c) => <span key={c} style={{ background: c }}><small>{c}</small></span>)}</>}
                    {k.k === "type" && <><b>Aa</b><span><i /><i /><i /></span></>}
                    {k.k === "card" && <><span className="br-mc br-mc--a"><i />Sipher Web</span><span className="br-mc br-mc--b">Aarav Mehta</span></>}
                    {k.k === "social" && <>{[0, 1, 2].map((n) => <span key={n} className={`br-sp br-sp--${n}`} />)}</>}
                    {k.k === "guide" && <><span className="br-pg br-pg--a" /><span className="br-pg br-pg--b" /><span className="br-pg br-pg--c" /></>}
                  </div>
                  <div className="br-k__body">
                    <header>
                      <span className="br-k__ic"><k.icon size={17} aria-hidden="true" /></span>
                      <h3>{k.t}</h3>
                      <span className="br-k__tag">{k.tag}</span>
                    </header>
                    <p>{k.p}</p>
                    <div className="br-k__foot">
                      <span>{k.meta}</span>
                      <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== BEFORE / AFTER =========================== */}
        <section className="br-section br-cmpsec" aria-labelledby="br-cmp-h">
          <div className="container">
            <Head center eyebrow="The difference" lead="Drag the handle. Same business, same materials, with and without a clear brand system.">
              <span id="br-cmp-h">Scattered looks <em>vs one brand.</em></span>
            </Head>
            <div className="br-cmp-wrap" data-reveal>
              <div className="br-cmp__bar" role="group" aria-label="Comparison view presets">
                <div className="br-cmp__presets">
                  <button type="button" className={pos >= 85 ? "is-active" : ""} onClick={() => setPos(100)}>
                    Scattered (Before)
                  </button>
                  <button type="button" className={pos > 15 && pos < 85 ? "is-active" : ""} onClick={() => setPos(50)}>
                    Split Audit (50/50)
                  </button>
                  <button type="button" className={pos <= 15 ? "is-active" : ""} onClick={() => setPos(0)}>
                    <Sparkles size={13} aria-hidden="true" /> One Brand (After)
                  </button>
                </div>
                <span className="br-cmp__hint">Drag slider or pick a view</span>
              </div>

              <div className="br-cmp" style={{ "--pos": `${pos}%` } as CSSProperties}>
                <div className="br-cmp__layer br-cmp__layer--after"><Suite after /></div>
                <div className="br-cmp__layer br-cmp__layer--before"><Suite after={false} /></div>
                <span className="br-cmp__tag br-cmp__tag--b">Before · Scattered</span>
                <span className="br-cmp__tag br-cmp__tag--a">After · Sipher System</span>
                <span className="br-cmp__line" aria-hidden="true"><i><ChevronsLeftRight size={18} /></i></span>
                <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Slide to compare before and after branding" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================== GALLERY =========================== */}
        <section className="br-section br-gallerysec" aria-labelledby="br-g-h">
          <div className="container">
            <Head center eyebrow="Brand in the real world" lead="Your identity should work on a screen, on a shelf and on a signboard.">
              <span id="br-g-h">One identity, <em>everywhere.</em></span>
            </Head>
            <div className="br-gal">
              {GALLERY.map((g, i) => (
                <figure className={`br-gal__item br-gal__item--${i + 1}`} key={g.t} data-reveal style={{ "--i": i } as CSSProperties}>
                  <div className="br-gal__media">
                    <img src={g.svg} alt={`${g.t} — ${g.s}`} loading="lazy" decoding="async" />
                  </div>
                  <figcaption><span>{g.t}</span><small>{g.s}</small></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <RelatedServicesSection
          items={REL}
          title={
            <>
              Take your brand <em>further</em>
            </>
          }
          lead="A strong brand works hardest when it is seen. Pair it with design, e-commerce and a fast website."
        />
      </div>
    </>
  );
}