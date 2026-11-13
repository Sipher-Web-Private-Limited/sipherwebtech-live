import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, ChevronRight, ClipboardCheck, Component, Copy, Layers, Menu,
  Monitor, MonitorSmartphone, MousePointerClick, Palette, PenTool, Play, RotateCcw, Search, SlidersHorizontal,
  Smartphone, Tablet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import "../../styles/services/ui-ux.css";
import "../../styles/services/service-hero-consistency.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ helpers */

const Words = ({ text }: { text: string }) => (
  <>{text.split(" ").map((w, i) => <span key={i}><span className="ux-w"><span>{w}</span></span>{" "}</span>)}</>
);

function Head({ id, eyebrow, title, em, lead, center }: { id: string; eyebrow: string; title: string; em?: string; lead?: ReactNode; center?: boolean }) {
  return (
    <div className={`ux-head${center ? " ux-head--center" : ""}`}>
      <div>
        <p className="eyebrow"><span />{eyebrow}</p>
        <h2 className="ux-title" id={id}><Words text={title} />{em && <em><Words text={em} /></em>}</h2>
      </div>
      {lead && <p className="ux-lead">{lead}</p>}
    </div>
  );
}

const Cursor = () => (
  <svg className="ux-cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z" /></svg>
);

/* a tiny product screen that can be a wireframe or a finished design, depending on .is-wire */
function Mock({ children }: { children?: ReactNode }) {
  return (
    <div className="ux-mock">
      <div className="ux-mock__win">
        <div className="ux-mock__bar">
          <i /><i /><i />
          <span className="ux-mock__url">planly.app/workspace</span>
          <span className="ux-mock__vp" aria-hidden="true">1440px</span>
        </div>
        <div className="ux-mock__body">
          <div className="ux-mock__nav">
            <b className="ux-logo" /><span className="ux-t">Product</span><span className="ux-t">Pricing</span><span className="ux-t">Docs</span>
            <span className="ux-nbtn">Sign in</span>
          </div>
          <div className="ux-mock__hero">
            <div className="ux-mock__copy">
              <span className="ux-mock__pill ux-t">v2.4 Workspace</span>
              <h4 className="ux-t ux-h">Plan your week in minutes</h4>
              <p className="ux-t ux-p">One clear place for tasks, files and deadlines.</p>
              <span className="ux-btn">Get started<i className="ux-ripple" /></span>
            </div>
            <div className="ux-mock__img">
              <div className="ux-mini">
                <div className="ux-mini__top">
                  <span className="ux-t ux-mini__ttl">Weekly focus</span>
                  <span className="ux-mini__badge">+28%</span>
                </div>
                <div className="ux-mini__bars" aria-hidden="true">
                  <span style={{ height: "42%" }} />
                  <span style={{ height: "68%" }} />
                  <span style={{ height: "54%" }} />
                  <span className="is-hi" style={{ height: "92%" }} />
                  <span style={{ height: "76%" }} />
                </div>
                <div className="ux-mini__foot">
                  <span className="ux-t ux-mini__sub">14 of 16 shipped</span>
                  <div className="ux-mini__bar"><i /></div>
                </div>
              </div>
              <svg className="ux-wirex" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="0" x2="100" y2="100" />
                <line x1="100" y1="0" x2="0" y2="100" />
              </svg>
            </div>
          </div>
          <div className="ux-mock__cards">
            {[
              { t: "Tasks", m: "12 active" },
              { t: "Files", m: "Synced" },
              { t: "Timeline", m: "On track" },
            ].map((c) => (
              <div className="ux-card" key={c.t}>
                <i className="ux-ic" />
                <b className="ux-t">{c.t}</b>
                <span className="ux-t ux-p2">{c.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ content */
const TRUST = ["User research", "Wireframes and prototypes", "Design systems", "Usability testing"];
const MARQUEE = ["User research", "Wireframes", "Prototypes", "Visual design", "Design systems", "Usability testing", "Responsive layouts", "Accessibility", "Developer handoff"];

const STAGES = [
  {
    tag: "Research",
    t: "Start with how people actually use it,",
    em: "not how we imagine they do.",
    p: "Interviews, analytics and a review of what already exists show where users get stuck and what matters most.",
    deliverables: ["User interviews", "Funnel audit", "Friction map"],
  },
  {
    tag: "Wireframe",
    t: "Structure first.",
    em: "Decoration later.",
    p: "Low-fidelity layouts settle hierarchy, flow and content before anyone argues about colour.",
    deliverables: ["User flows", "12-col wireframe", "Content hierarchy"],
  },
  {
    tag: "Visual design",
    t: "Then the look,",
    em: "built from a system.",
    p: "Type, colour, spacing and components are defined once, so every screen feels like the same product.",
    deliverables: ["Design tokens", "UI components", "All states covered"],
  },
  {
    tag: "Prototype",
    t: "Click it before",
    em: "you build it.",
    p: "A clickable prototype lets real people try the flow, so problems show up in a day, not after development.",
    deliverables: ["Interactive flow", "Micro-interactions", "User validation"],
  },
  {
    tag: "Handoff",
    t: "Hand developers specs,",
    em: "not guesses.",
    p: "Measurements, states, tokens and notes travel with the design, so what gets built matches what was approved.",
    deliverables: ["Dev inspector", "Spacing & CSS", "Token export"],
  },
];

const SERVICES: { icon: LucideIcon; stage: string; output: string; t: string; p: string; chips: string[] }[] = [
  { icon: Search, stage: "Discovery", output: "Insights & Journey Map", t: "User research and discovery", p: "Interviews, surveys, analytics and a review of competing products, to learn who your users are, what they are trying to do and where they get stuck.", chips: ["Interviews", "Journey maps", "Analytics review"] },
  { icon: Palette, stage: "Interface UI", output: "High-Fidelity Screens", t: "UI design", p: "Clean, on-brand interfaces for websites, web apps and dashboards, with clear hierarchy, readable type and designed states for loading, empty and error.", chips: ["Web and dashboards", "Brand-aligned", "All states designed"] },
  { icon: PenTool, stage: "Prototyping", output: "Clickable Flow File", t: "Wireframes and prototypes", p: "Map the flow with low-fidelity wireframes, then turn it into a clickable prototype that stakeholders and users can try before development starts.", chips: ["User flows", "Wireframes", "Clickable prototypes"] },
  { icon: Component, stage: "Architecture", output: "Tokens & Components", t: "Design systems", p: "A shared library of colours, type, spacing and components, so teams ship faster and every screen looks and behaves like one product.", chips: ["Tokens", "Component library", "Usage guidelines"] },
  { icon: ClipboardCheck, stage: "Validation", output: "Session Fixes Report", t: "Usability testing", p: "Watch real people try your product, then turn what we see into prioritised fixes, before launch or on a product that is already live.", chips: ["Task-based tests", "Findings report", "Prioritised fixes"] },
  { icon: MonitorSmartphone, stage: "Multi-Screen", output: "Adaptive Breakpoints", t: "Mobile and responsive design", p: "Interfaces that fit every screen, from a small phone to a wide monitor, with touch-friendly controls and layouts that reflow cleanly.", chips: ["iOS and Android", "Responsive web", "Touch-first"] },
];

function ServiceArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="ux-art ux-art--research" aria-hidden="true">
        <div className="ux-art__top"><span>01 · Journey Audit</span><em>38% drop spotted</em></div>
        <div className="ux-art__stage">
          <div className="ux-art__funnel">
            <div><span>Landing</span><b>100%</b><i style={{ width: "100%" }} /></div>
            <div className="is-warn"><span>Pricing</span><b>62%</b><i style={{ width: "62%" }} /></div>
            <div><span>Sign up</span><b>41%</b><i style={{ width: "41%" }} /></div>
          </div>
          <div className="ux-art__quotes">
            <span><i>Q1</i>“Where is the plan comparison?”</span>
            <span><i>Q2</i>“Too many steps before preview.”</span>
          </div>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="ux-art ux-art--ui" aria-hidden="true">
        <div className="ux-art__top"><span>02 · Interface System</span><em>All states</em></div>
        <div className="ux-art__stage">
          <div className="ux-art__app">
            <aside><i className="is-on" /><i /><i /><i /></aside>
            <div className="ux-art__main">
              <div className="ux-art__kpis">
                <div><b>+28%</b><span>Speed</span></div>
                <div className="is-y"><b>98.4</b><span>Clarity</span></div>
              </div>
              <div className="ux-art__bars"><i style={{ height: "45%" }} /><i style={{ height: "72%" }} /><i className="is-hi" style={{ height: "94%" }} /><i style={{ height: "64%" }} /></div>
            </div>
          </div>
          <div className="ux-art__states">
            <span className="is-on">Default</span><span>Loading</span><span>Empty</span>
          </div>
        </div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="ux-art ux-art--proto" aria-hidden="true">
        <div className="ux-art__top"><span>03 · Clickable Flow</span><em>Interactive</em></div>
        <div className="ux-art__stage ux-art__flowgrid">
          <div className="ux-art__wire">
            <span className="w-bar" /><span className="w-line" /><span className="w-line is-s" />
            <span className="w-cta">Next step<i className="ux-art__dot" /></span>
          </div>
          <svg className="ux-art__arrow" viewBox="0 0 60 40" preserveAspectRatio="none">
            <path d="M2,28 C28,28 30,10 56,12" />
            <circle cx="56" cy="12" r="3.5" />
          </svg>
          <div className="ux-art__modal">
            <b>Step 2 · Confirm</b>
            <i /><i className="is-s" />
            <span>Launch flow →</span>
          </div>
        </div>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className="ux-art ux-art--ds" aria-hidden="true">
        <div className="ux-art__top"><span>04 · Token Library</span><em>Figma ↔ Code</em></div>
        <div className="ux-art__stage ux-art__dsgrid">
          <div className="ux-art__tokens">
            <div><i style={{ background: "#100563" }} /><span>#100563</span></div>
            <div><i style={{ background: "#ffe401" }} /><span>#FFE401</span></div>
            <div><i style={{ background: "#eef0fb" }} /><span>#EEF0FB</span></div>
          </div>
          <div className="ux-art__type">
            <strong>Aa</strong>
            <div><b>Heading / 32px</b><span>Body / 16px · Space 8px</span></div>
          </div>
          <div className="ux-art__btns">
            <span className="is-p">Primary</span><span className="is-s">Secondary</span><span className="is-f">Focus</span>
          </div>
        </div>
      </div>
    );
  }
  if (index === 4) {
    return (
      <div className="ux-art ux-art--test" aria-hidden="true">
        <div className="ux-art__top"><span>05 · Usability Test</span><em>94% task pass</em></div>
        <div className="ux-art__stage ux-art__testgrid">
          <div className="ux-art__heat">
            <span className="h-box" />
            <span className="h-cta">Continue</span>
            <i className="ux-art__ring ux-art__ring--a" />
            <i className="ux-art__ring ux-art__ring--b" />
          </div>
          <div className="ux-art__checks">
            <span><b>✓</b> Clear field labels added</span>
            <span><b>✓</b> 48px touch target verified</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="ux-art ux-art--resp" aria-hidden="true">
      <div className="ux-art__top"><span>06 · Multi-Viewport</span><em>375 → 1440px</em></div>
      <div className="ux-art__stage ux-art__devices">
        <div className="ux-art__desk">
          <span className="d-nav" /><div className="d-grid"><i className="is-y" /><i /><i /></div>
        </div>
        <div className="ux-art__mob">
          <span className="m-notch" /><span className="m-hero" /><span className="m-btn" />
        </div>
      </div>
    </div>
  );
}

const FIXES = [
  { t: "Visible labels", p: "Placeholders vanish the moment someone types. A label stays put, so nobody forgets what a field is for." },
  { t: "Helpful messages", p: "Say what is wrong and how to fix it, right next to the field it belongs to." },
  { t: "Comfortable touch targets", p: "Bigger fields and buttons are easier to hit on a phone. Apple and Google both suggest roughly 44 to 48 px." },
  { t: "Contrast and visible focus", p: "Clear borders and a focus ring help everyone, especially keyboard users and people with low vision." },
];

const SWATCHES = [
  { n: "Navy", c: "#100563" },
  { n: "Indigo", c: "#4338ca" },
  { n: "Teal", c: "#0e7c86" },
  { n: "Berry", c: "#c2255c" },
  { n: "Forest", c: "#1c6b3a" },
];
const FONTS = [
  { n: "Sans", tag: "Manrope", f: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { n: "Serif", tag: "DM Serif", f: "'DM Serif Display', Georgia, serif" },
];

type PrincipleKind = "access" | "system" | "copy" | "states" | "mobile" | "speed";

function PrincipleIcon({ kind }: { kind: PrincipleKind }) {
  if (kind === "access") {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <circle className="fa-duo" cx="256" cy="256" r="248" fill="currentColor" opacity="0.18" />
        <path
          fill="currentColor"
          d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 64a36 36 0 1 1 0 72 36 36 0 1 1 0-72zm121.6 106.5l-73.6 14.7V392c0 13.3-10.7 24-24 24s-24-10.7-24-24v-84h-16v84c0 13.3-10.7 24-24 24s-24-10.7-24-24V233.2l-73.6-14.7c-13-2.6-21.5-15.2-18.9-28.2s15.2-21.5 28.2-18.9l104.3 20.9c15.8 3.2 32.2 3.2 48 0l104.3-20.9c13-2.6 25.6 5.9 28.2 18.9s-5.9 25.6-18.9 28.2z"
        />
      </svg>
    );
  }
  if (kind === "system") {
    return (
      <svg viewBox="0 0 576 512" aria-hidden="true">
        <path
          className="fa-duo"
          fill="currentColor"
          opacity="0.38"
          d="M264.5 344.2c14.6 7.3 32.4 7.3 47 0l222.8-111.4c12.1-6 19.7-18.4 19.7-31.9s-7.6-25.9-19.7-31.9l-42.6-21.3-179.9 90c-15 7.5-32.6 7.5-47.6 0l-179.9-90L41.7 169c-12.1 6-19.7 18.4-19.7 31.9s7.6 25.9 19.7 31.9l222.8 111.4zm0 116c14.6 7.3 32.4 7.3 47 0l222.8-111.4c12.1-6 19.7-18.4 19.7-31.9s-7.6-25.9-19.7-31.9l-42.6-21.3-179.9 90c-15 7.5-32.6 7.5-47.6 0l-179.9-90L41.7 285c-12.1 6-19.7 18.4-19.7 31.9s7.6 25.9 19.7 31.9l222.8 111.4z"
        />
        <path
          fill="currentColor"
          d="M264.5 51.8c14.6-7.3 32.4-7.3 47 0l222.8 111.4c12.1 6 19.7 18.4 19.7 31.9s-7.6 25.9-19.7 31.9L311.5 338.4c-14.6 7.3-32.4 7.3-47 0L41.7 227C29.6 221 22 208.6 22 195.1s7.6-25.9 19.7-31.9L264.5 51.8z"
        />
      </svg>
    );
  }
  if (kind === "copy") {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M512 240c0 114.9-114.6 208-256 208-37.1 0-72.3-6.4-104.1-17.9-37.7 30.8-84.2 46.8-119.9 50-10.2.9-19.9-4.7-24.2-14.1s-2-20.4 5.9-27c18.7-15.6 38.6-37.1 51.2-64.1C24.4 337.9 0 291.2 0 240 0 125.1 114.6 32 256 32s256 93.1 256 208zM160 240a28 28 0 1 1-56 0 28 28 0 1 1 56 0zm124 0a28 28 0 1 1-56 0 28 28 0 1 1 56 0zm96 28a28 28 0 1 0 0-56 28 28 0 1 0 0 56z"
        />
      </svg>
    );
  }
  if (kind === "states") {
    return (
      <svg viewBox="0 0 448 512" aria-hidden="true">
        <path
          className="fa-duo"
          fill="currentColor"
          opacity="0.32"
          d="M176 48a24 24 0 0 1 24 24v32a24 24 0 0 1-48 0V72a24 24 0 0 1 24-24zM60 116a24 24 0 0 1 33.9 0l22.6 22.6a24 24 0 0 1-33.9 33.9L60 149.9a24 24 0 0 1 0-33.9zm232 0a24 24 0 0 1 0 33.9l-22.6 22.6a24 24 0 1 1-33.9-33.9l22.6-22.6a24 24 0 0 1 33.9 0z"
        />
        <path
          fill="currentColor"
          d="M159.4 176.2c-9.9-4.5-21.1 3.7-19.6 14.5l35.1 252.2c1.6 11.4 15.8 15.9 23.7 7.5l63.6-67.7 48 103.5c5.5 11.9 19.6 17.1 31.5 11.6s17.1-19.6 11.6-31.5l-48-103.4 90.4-13.9c11.4-1.8 15.6-16.1 7.1-23.9L159.4 176.2z"
        />
      </svg>
    );
  }
  if (kind === "mobile") {
    return (
      <svg viewBox="0 0 384 512" aria-hidden="true">
        <rect className="fa-duo" x="64" y="64" width="256" height="336" rx="16" fill="currentColor" opacity="0.2" />
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM80 64V384H304V64H80zM160 432c-13.3 0-24 10.7-24 24s10.7 24 24 24h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H160z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path
        className="fa-duo"
        fill="currentColor"
        opacity="0.22"
        d="M256 64C114.6 64 0 178.6 0 320c0 47.4 12.9 91.8 35.3 129.8 7.9 13.4 22.3 22.2 38.7 22.2H438c16.4 0 30.8-8.8 38.7-22.2C499.1 411.8 512 367.4 512 320c0-141.4-114.6-256-256-256z"
      />
      <path
        fill="currentColor"
        d="M256 64C114.6 64 0 178.6 0 320c0 47.4 12.9 91.8 35.3 129.8 7.9 13.4 22.3 22.2 38.7 22.2H438c16.4 0 30.8-8.8 38.7-22.2C499.1 411.8 512 367.4 512 320c0-141.4-114.6-256-256-256zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM144 216a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm200 112a24 24 0 1 1-48 0 24 24 0 1 1 48 0zm46.4-152.3c11.8 7.2 15.5 22.6 8.3 34.4l-95.5 156.3a56 56 0 1 1-44.8-27.3l97.6-155.1c7.2-11.8 22.6-15.5 34.4-8.3z"
      />
    </svg>
  );
}

const PRINCIPLES: { kind: PrincipleKind; tag: string; spec: string; t: string; p: string }[] = [
  { kind: "access", tag: "WCAG AA", spec: "4.5:1 Contrast & Keyboard", t: "Accessible by default", p: "Contrast, keyboard use, labels and touch targets are designed in from the first sketch, not patched on later." },
  { kind: "system", tag: "System", spec: "Shared Rules & Patterns", t: "Consistent everywhere", p: "The same pattern always looks and behaves the same way, so people learn it once." },
  { kind: "copy", tag: "Microcopy", spec: "Zero Vague Errors", t: "Words that help", p: "Clear button labels, honest error messages and short instructions are part of the design." },
  { kind: "states", tag: "5 States", spec: "Hover · Loading · Empty", t: "Feedback for every action", p: "Hover, pressed, loading, success and error states are designed, so people always know what happened." },
  { kind: "mobile", tag: "375px+", spec: "Thumb-Zone First", t: "Mobile first", p: "We start with the smallest screen, then add room, rather than squeezing a desktop layout down." },
  { kind: "speed", tag: "Performance", spec: "Fast Paint & Zero Bloat", t: "Light on the browser", p: "Design choices that respect load time: sensible images, fewer fonts and no effects that slow the page." },
];

const REL: RelatedServiceItem[] = [
  { to: "/services/web-development", title: "Web development", text: "Fast, search-friendly websites and portals.", img: "/new-images/services/webdev/related-web-development.webp" },
  { to: "/services/ecommerce", title: "E-commerce", text: "Turn a great design into a store that sells.", img: "/new-images/services/webdev/related-ecommerce.webp" },
  { to: "/services/software-development", title: "Custom software", text: "Engineering to bring your designed product to life.", img: "/new-images/services/webdev/related-custom-software.webp" },
  { to: "/services/seo", title: "SEO services", text: "Rank higher and get found on Google.", img: "/new-images/services/webdev/related-seo.webp" },
];

const SITE = "https://sipherweb.in"; /* confirm production domain */
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service", name: "UI/UX Design", serviceType: "UI/UX design", url: `${SITE}/services/ui-ux`,
      description: "User research, UI design, wireframes, prototypes, design systems and usability testing for websites, web apps and mobile apps.",
      provider: { "@type": "Organization", name: "Sipher Web Pvt. Ltd.", url: SITE },
      areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
      hasOfferCatalog: { "@type": "OfferCatalog", name: "UI/UX design services", itemListElement: SERVICES.map((o) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: o.t } })) },
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: "UI/UX Design", item: `${SITE}/services/ui-ux` },
    ] },
  ],
};

type QT = ReturnType<typeof gsap.quickTo>;

/* ------------------------------------------------------------------ responsive lab */
function Lab({ w, onW, onStop, onReplay }: { w: number; onW: (n: number) => void; onStop: () => void; onReplay: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState(1000);
  const [ih, setIh] = useState(600);
  const [drawer, setDrawer] = useState(false);

  useLayoutEffect(() => {
    const a = wrap.current, b = inner.current;
    if (!a || !b) return;
    const ro = new ResizeObserver(() => {
      const cs = getComputedStyle(a);
      setAvail(Math.max(240, a.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)));
      setIh(b.offsetHeight);
    });
    ro.observe(a); ro.observe(b);
    return () => ro.disconnect();
  }, []);

  const s = Math.min(1, avail / w);
  const mode = w < 560 ? "sm" : w < 900 ? "md" : "lg";
  const cols = mode === "sm" ? 1 : mode === "md" ? 2 : 3;
  const gridLabel = mode === "sm" ? "4-Col Stack" : mode === "md" ? "8-Col Reflow" : "12-Col Grid";
  const device = mode === "sm" ? "Phone" : mode === "md" ? "Tablet" : "Desktop";

  return (
    <div className="ux-rlab">
      <div className="ux-rlab__ctl">
        <div className="ux-rlab__presets" role="group" aria-label="Screen presets">
          {([
            ["Phone", 375, Smartphone],
            ["Tablet", 768, Tablet],
            ["Desktop", 1200, Monitor],
          ] as const).map(([n, v, Icon]) => (
            <button
              key={n}
              type="button"
              className={device === n ? "is-on" : ""}
              onClick={() => { onStop(); setDrawer(false); onW(v); }}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{n}</span>
            </button>
          ))}
        </div>
        <label className="ux-rlab__range">
          <span>Viewport width <output>{w}px</output></span>
          <input
            className="ux-range"
            type="range"
            min={320}
            max={1200}
            step={10}
            value={w}
            aria-label="Screen width in pixels"
            onPointerDown={onStop}
            onChange={(e) => { setDrawer(false); onW(Number(e.target.value)); }}
          />
        </label>
        <button type="button" className="ux-rlab__replay" onClick={onReplay} aria-label="Replay responsive animation">
          <Play size={13} aria-hidden="true" />
          <span>Replay reflow</span>
        </button>
      </div>

      <div className="ux-rlab__stage" ref={wrap}>
        <div className="ux-rlab__frame" style={{ width: Math.round(w * s), height: Math.round(ih * s) }}>
          <div className={`ux-site is-${mode}`} ref={inner} style={{ width: w, transform: `scale(${s})`, "--c": cols } as CSSProperties}>
            <div className="ux-site__chrome">
              <div className="ux-site__dots" aria-hidden="true"><i /><i /><i /></div>
              <span className="ux-site__url">app.sipherstudio.in</span>
              <span className="ux-site__bp">{gridLabel} · {w}px</span>
            </div>

            <div className="ux-site__nav">
              <span className="ux-site__brand"><b className="ux-logo" /><em>Planly</em></span>
              {mode === "lg" ? (
                <>
                  <div className="ux-site__links">
                    <span className="is-act">Overview</span>
                    <span>Workflows</span>
                    <span>Pricing</span>
                    <span>Docs</span>
                  </div>
                  <span className="ux-site__btn">Launch workspace</span>
                </>
              ) : (
                <button
                  type="button"
                  className="ux-site__burgerBtn"
                  aria-label="Toggle virtual menu"
                  aria-expanded={drawer}
                  onClick={() => setDrawer((d) => !d)}
                >
                  <Menu size={20} aria-hidden="true" />
                </button>
              )}
            </div>

            {mode !== "lg" && drawer && (
              <div className="ux-site__drawer">
                <span>Overview</span><span>Workflows</span><span>Pricing</span><span>Docs</span>
              </div>
            )}

            <div className="ux-site__hero">
              <div className="ux-site__hcopy">
                <span className="ux-site__eyebrow">Release v2.4 · Multi-device</span>
                <h4>Ship cleaner sprints twice as fast.</h4>
                <p>Unify roadmaps, live design QA and team velocity inside one adaptive workspace.</p>
                <div className="ux-site__ctaRow">
                  <span className="ux-site__btn">Start free sprint <ArrowRight size={14} aria-hidden="true" /></span>
                  <span className="ux-site__ghost">Book a tour</span>
                </div>
              </div>

              <div className="ux-site__widget">
                <div className="ux-site__whead">
                  <b>Q4 Product Roadmap</b>
                  <span>94% On Track</span>
                </div>
                <div className="ux-site__wrows">
                  <div><span>Design System v2</span><b>100%</b><i style={{ width: "100%" }} /></div>
                  <div><span>Checkout Flow QA</span><b>78%</b><i style={{ width: "78%" }} /></div>
                  <div><span>Mobile Reflow</span><b>64%</b><i className="is-y" style={{ width: "64%" }} /></div>
                </div>
                <div className="ux-site__wstats">
                  <div><b>+34%</b><span>Conversion</span></div>
                  <div><b>1.2s</b><span>Speed</span></div>
                  <div><b>48px</b><span>Tap min</span></div>
                </div>
              </div>
            </div>

            <div className="ux-site__cards">
              {[
                { ic: Layers, t: "Adaptive Grids", p: "Columns collapse from 3 to 2 to 1 cleanly without clipped content." },
                { ic: MousePointerClick, t: "Touch-First Controls", p: "Generous 48px targets and readable typography on every screen." },
                { ic: Smartphone, t: "Collapsed Navigation", p: "Full top bar swaps to a sleek menu drawer on compact viewports." },
              ].map((c) => (
                <div className="ux-site__card" key={c.t}>
                  <i><c.ic size={17} aria-hidden="true" /></i>
                  <b>{c.t}</b>
                  <span>{c.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ux-rlab__foot">
        <p className="ux-rlab__cap" aria-live="polite">
          <b>{device} · {w}px</b> — {cols} {cols === 1 ? "column" : "columns"} ({gridLabel}){mode === "lg" ? ", full desktop navigation" : ", compact menu toggle (try clicking the icon)"}.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */
export default function UiUx() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [fix, setFix] = useState([false, false, false, false]);
  const [vw, setVw] = useState(1100);
  const [sw, setSw] = useState(0);
  const [radius, setRadius] = useState(12);
  const [font, setFont] = useState(0);
  const [tkTab, setTkTab] = useState(0);
  const [tkCopied, setTkCopied] = useState(false);
  const [tkApproved, setTkApproved] = useState(false);
  const [labSent, setLabSent] = useState(false);
  const rTween = useRef<gsap.core.Tween | null>(null);
  const labCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => Array.from(c.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => c.querySelector<T>(s) as T;
    const mm = gsap.matchMedia(root);

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", desk: "(min-width: 760px)", fine: "(hover: hover) and (pointer: fine)" }, (ctx) => {
      const { motion, desk, fine } = ctx.conditions as unknown as { motion: boolean; desk: boolean; fine: boolean };
      if (!motion) return;
      const off: Array<() => void> = [];
      root.classList.add("is-motion");

      /* ================= HERO: entrance & visual parallax ================= */
      {
        const visual = one(".ux-hero__visual");
        const illus = one(".ux-hero__illustration");

        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from($(".ux-hero .breadcrumb"), { y: 14, autoAlpha: 0, duration: 0.5, clearProps: "all" })
          .from($(".ux-hero__title .ux-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".ux-hero__lead, .ux-hero__cta > *, .ux-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.45)
          .from(illus, { y: 36, autoAlpha: 0, scale: 0.96, duration: 1.1, ease: "power3.out", clearProps: "all" }, 0.25);

        if (visual) {
          const st = ScrollTrigger.create({
            trigger: one(".ux-hero"),
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

      const mq = gsap.to(one(".ux-marquee__track"), { xPercent: -50, repeat: -1, duration: 38, ease: "none" });
      ScrollTrigger.create({ onUpdate: (s) => { mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5)); gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true }); } });

      /* buttons lean toward the cursor */
      if (fine) {
        $(".ux-hero__cta .button, .ux-hero__cta .ux-ghost").forEach((el) => {
          let xt: QT | undefined, yt: QT | undefined;
          const enter = () => { if (!xt) { xt = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }); yt = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" }); } };
          const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); xt?.((e.clientX - (r.left + r.width / 2)) * 0.28); yt?.((e.clientY - (r.top + r.height / 2)) * 0.4); };
          const lv = () => { xt?.(0); yt?.(0); };
          el.addEventListener("pointerenter", enter); el.addEventListener("pointermove", mv); el.addEventListener("pointerleave", lv);
          off.push(() => { el.removeEventListener("pointerenter", enter); el.removeEventListener("pointermove", mv); el.removeEventListener("pointerleave", lv); });
        });
      }

      /* ============ PINNED SCENE: one screen goes from research notes to developer specs ============ */
      {
        const N = STAGES.length, S = 3;
        const section = one(".ux-flow"), steps = $(".ux-sstep"), wrap = one(".ux-steps"), board = one(".ux-stage__board"), mock = one(".ux-mock", board);
        const stepper = $(".ux-stepper li"), barI = one(".ux-flow__prog i");
        const body = one(".ux-mock__body", mock), btn = one(".ux-btn", mock), rip = one(".ux-ripple", mock);
        const notesWrap = one(".ux-notes"), notes = $(".ux-note"), tags = one(".ux-tags"), guides = one(".ux-guides"), proto = one(".ux-proto");
        const cursor = one(".ux-cursor", proto), next = one(".ux-next", proto), flowP = one<SVGPathElement>(".ux-flowsvg path", proto), flowS = one<SVGSVGElement>(".ux-flowsvg", proto);
        const spec = one(".ux-spec"), specItems = $(".ux-spec > *"), pad = one(".ux-spec__pad");
        let bp = { x: 0, y: 0 };

        const fit = () => { wrap.style.height = ""; wrap.style.height = `${Math.max(...steps.map((k) => k.offsetHeight))}px`; };
        const lay = () => {
          const m = mock.getBoundingClientRect(), b = btn.getBoundingClientRect();
          bp = { x: b.left - m.left + b.width * 0.55, y: b.top - m.top + b.height * 0.6 };
          pad.style.left = `${b.left - m.left - 7}px`; pad.style.top = `${b.top - m.top - 7}px`; pad.style.width = `${b.width + 14}px`; pad.style.height = `${b.height + 14}px`;
          const x1 = b.right - m.left, y1 = b.top - m.top + b.height / 2, x2 = next.offsetLeft, y2 = next.offsetTop + next.offsetHeight / 2;
          flowS.setAttribute("viewBox", `0 0 ${m.width} ${m.height}`);
          flowP.setAttribute("d", `M${x1},${y1} C${x1 + 90},${y1} ${x2 - 90},${y2} ${x2},${y2}`);
        };
        const refit = () => { fit(); lay(); };
        ScrollTrigger.addEventListener("refreshInit", refit); refit();
        off.push(() => { ScrollTrigger.removeEventListener("refreshInit", refit); wrap.style.height = ""; });

        mock.classList.add("is-wire");
        gsap.set(steps[0], { autoAlpha: 1, y: 0 });
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set([tags, guides, proto, spec], { autoAlpha: 0 }); gsap.set(body, { opacity: 0.55 });
        gsap.set(notes, { autoAlpha: 0, scale: 0.85, y: 18 }); gsap.set(rip, { autoAlpha: 0 }); gsap.set(specItems, { autoAlpha: 0, y: 8 });
        gsap.set(flowP, { strokeDasharray: () => flowP.getTotalLength(), strokeDashoffset: () => flowP.getTotalLength() });
        gsap.set(next, { autoAlpha: 0, x: 50 }); gsap.set(cursor, { autoAlpha: 0 });
        const miniBars = $(".ux-mini__bars span", mock);
        const miniFill = one(".ux-mini__bar i", mock);

        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(notes, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.14, ease: "back.out(1.7)" });
          },
        });

        let cur = -1, ui = false;
        const stageLabel = one(".ux-canvas__stage");
        const sync = (t: number) => {
          const c = Math.max(0, Math.min(N - 1, Math.floor((t + 0.35) / S)));
          if (c !== cur) {
            cur = c;
            stepper.forEach((li, i) => li.classList.toggle("is-on", i === c));
            if (stageLabel) stageLabel.textContent = `0${c + 1} · ${STAGES[c].tag}`;
          }
          const u = t >= 2 * S - 0.15;
          if (u !== ui) {
            ui = u;
            mock.classList.toggle("is-wire", !u);
          }
        };
        sync(0);

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          onUpdate: () => {
            sync(tl.time());
            barI.style.transform = `scaleX(${Math.max(0.03, tl.totalProgress())})`;
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=420%",
            scrub: 0.45,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        stepper.forEach((li, i) => {
          const onClick = () => {
            const st = tl.scrollTrigger;
            if (!st) return;
            const targetTime = i === 0 ? 0.3 : i * S + 0.85;
            const targetProgress = Math.min(0.96, targetTime / tl.duration());
            const y = st.start + targetProgress * (st.end - st.start);
            window.scrollTo({ top: y, behavior: "smooth" });
          };
          li.addEventListener("click", onClick);
          off.push(() => li.removeEventListener("click", onClick));
        });
        for (let i = 1; i < N; i++) {
          tl.to(steps[i - 1], { autoAlpha: 0, y: -20, duration: 0.4 }, i * S - 0.4).to(steps[i], { autoAlpha: 1, y: 0, duration: 0.5 }, i * S - 0.1);
        }
        tl.to(notesWrap, { autoAlpha: 0, y: -14, duration: 0.5 }, S - 0.4)
          .to(body, { opacity: 1, duration: 0.5 }, S - 0.2)
          .to([guides, tags], { autoAlpha: 1, duration: 0.6, stagger: 0.12 }, S)
          .to([guides, tags], { autoAlpha: 0, duration: 0.4 }, 2 * S - 0.4)
          .fromTo(board, { scale: 1 }, { scale: 1.022, duration: 0.35, yoyo: true, repeat: 1 }, 2 * S)
          .fromTo(miniBars, { scaleY: 0.45, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.55, stagger: 0.06, ease: "back.out(1.6)" }, 2 * S + 0.05)
          .fromTo(miniFill, { scaleX: 0.25, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.65, ease: "power2.out" }, 2 * S + 0.1)
          .to(proto, { autoAlpha: 1, duration: 0.3 }, 3 * S)
          .fromTo(cursor, { autoAlpha: 0, x: () => bp.x + 130, y: () => bp.y + 100 }, { autoAlpha: 1, x: () => bp.x, y: () => bp.y, duration: 1, ease: "power3.inOut" }, 3 * S + 0.2)
          .to(btn, { scale: 0.93, duration: 0.15 }, 3 * S + 1.3).to(btn, { scale: 1, duration: 0.25, ease: "back.out(3)" }, 3 * S + 1.45)
          .fromTo(rip, { scale: 0, autoAlpha: 0.9 }, { scale: 1, autoAlpha: 0, duration: 0.7 }, 3 * S + 1.3)
          .to(next, { autoAlpha: 1, x: 0, duration: 0.6 }, 3 * S + 1.5)
          .fromTo(flowP, { strokeDashoffset: () => flowP.getTotalLength() }, { strokeDashoffset: 0, duration: 0.8, ease: "none" }, 3 * S + 1.4)
          .to(proto, { autoAlpha: 0, duration: 0.4 }, 4 * S - 0.4)
          .to(spec, { autoAlpha: 1, duration: 0.3 }, 4 * S + 0.1)
          .to(specItems, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, 4 * S + 0.2)
          .to({}, { duration: 1.1 });
      }

      /* ============ everything below is created after the pin so start positions include its spacing ============ */
      $(".ux-title").forEach((t) =>
        gsap.from($(".ux-w > span", t), { yPercent: 115, duration: 0.9, stagger: 0.035, ease: "power4.out", clearProps: "transform", scrollTrigger: { trigger: t, start: "top 88%", once: true } }));

      /* sticky service cards: each one shrinks back as the next slides over it */
      {
        const cards = $(".ux-sc");
        cards.forEach((c, i) => {
          gsap.fromTo($(".ux-art__stage", c), { y: 16, scale: 0.96 }, { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 35%", scrub: true } });
          if (desk && i < cards.length - 1)
            gsap.fromTo(c, { scale: 1 }, { scale: 0.95, transformOrigin: "50% 0%", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 85%", end: "top 22%", scrub: true } });
        });
      }

      /* usability lab entrance */
      {
        const labCtl = $(".ux-lab__ctl li");
        const labCard = one(".ux-phone");
        if (labCtl.length) {
          gsap.from(labCtl, {
            x: -18,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: one(".ux-lab"), start: "top 78%", once: true },
          });
        }
        if (labCard) {
          gsap.from(labCard, {
            y: 28,
            scale: 0.96,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: one(".ux-lab"), start: "top 78%", once: true },
          });
        }
      }

      /* the responsive lab shrinks itself once to show the layout reflowing */
      ScrollTrigger.create({
        trigger: one(".ux-rlab"), start: "top 70%", once: true,
        onEnter: () => { const o = { v: 1100 }; rTween.current = gsap.to(o, { v: 400, duration: 3.2, delay: 0.4, ease: "power2.inOut", onUpdate: () => setVw(Math.round(o.v / 10) * 10) }); },
      });
      off.push(() => { rTween.current?.kill(); });

      const reveals = $("[data-reveal]");
      gsap.set(reveals, { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch(reveals, { start: "top 92%", once: true, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.75, ease: "power3.out", clearProps: "all" }) });

      return () => { off.forEach((f) => f()); root.classList.remove("is-motion"); };
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => { window.removeEventListener("load", refresh); mm.revert(); };
  }, []);

  const applied = fix.filter(Boolean).length;
  const score = applied * 25;
  const toggle = (i: number) => {
    setLabSent(false);
    setFix((f) => f.map((v, k) => (k === i ? !v : v)));
    const card = labCardRef.current;
    if (card && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(card, { y: 4, scale: 0.985 }, { y: 0, scale: 1, duration: 0.35, ease: "back.out(2)", clearProps: "transform" });
    }
  };
  const applyAllFixes = () => {
    setLabSent(false);
    setFix(applied === 4 ? [false, false, false, false] : [true, true, true, true]);
    const card = labCardRef.current;
    if (card && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(card, { y: 6, scale: 0.98 }, { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)", clearProps: "transform" });
    }
  };
  const tokens = { "--tk-c": SWATCHES[sw].c, "--tk-r": `${radius}px`, "--tk-f": FONTS[font].f } as CSSProperties;
  const tokenCss = `:root {\n  --color-primary: ${SWATCHES[sw].c};\n  --radius-md: ${radius}px;\n  --font-body: ${font === 0 ? "'Manrope', sans-serif" : "'DM Serif Display', serif"};\n}`;
  const copyTokens = () => {
    navigator.clipboard?.writeText(tokenCss).catch(() => {});
    setTkCopied(true);
    window.setTimeout(() => setTkCopied(false), 1600);
  };
  const resetTokens = () => {
    setSw(0);
    setRadius(12);
    setFont(0);
    setTkTab(0);
    setTkApproved(false);
  };
  const replayReflow = () => {
    rTween.current?.kill();
    const o = { v: 1180 };
    setVw(1180);
    rTween.current = gsap.to(o, {
      v: 370,
      duration: 2.8,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onUpdate: () => setVw(Math.round(o.v / 10) * 10),
    });
  };

  return (
    <>
      <Seo
        title="UI/UX Design Services Company in Indore | Sipher Web"
        description="User research, UI design, wireframes, prototypes, design systems and usability testing for websites, web apps and mobile apps. Get a free design consultation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="ux" ref={rootRef}>
        {/* ============ HERO ============ */}
        <section className="ux-hero" aria-labelledby="ux-h1">
          <div className="container ux-hero__grid">
            <div className="ux-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">UI/UX Design</span>
              </nav>
              <h1 id="ux-h1" className="ux-hero__title" aria-label="Designs that feel obvious, experiences that convert.">
                <span className="ux-line" aria-hidden="true"><Words text="Designs that feel" /></span>
                <em className="ux-line" aria-hidden="true"><Words text="obvious and convert." /></em>
              </h1>
              <p className="ux-hero__lead">
                We research your users, map every flow, and craft interfaces so intuitive they feel like second nature — from wireframes and design systems to dev-ready Figma handoff.
              </p>
              <div className="ux-hero__cta">
                <Link className="button button--primary ux-mag ux-hero__main" to="/contact" data-cursor="START">
                  <span>Start a design project</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <a className="ux-ghost ux-mag" href="#ux-flow">See our design cycle</a>
              </div>
              <ul className="ux-hero__trust">
                {TRUST.map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="ux-hero__visual" aria-hidden="true">
              <img
                className="ux-hero__illustration"
                src="/svg/sipher-ui-ux-hero.svg"
                alt="UI/UX Design Studio - From wireframe to finished product"
                width={1280}
                height={800}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <div className="ux-marquee" aria-hidden="true">
          <div className="ux-marquee__track">
            {[0, 1].map((g) => <div className="ux-marquee__group" key={g}>{MARQUEE.map((m, i) => <span className={`ux-m${i % 3}`} key={m}>{m}</span>)}</div>)}
          </div>
        </div>

        {/* ---------------------------------------------------------------- pinned scene */}
        <section className="ux-flow" id="ux-flow" aria-label="How a design takes shape, from research to handoff">
          <div className="container ux-flow__grid">
            <div className="ux-flow__copy">
              <h2 className="ux-sr">How a design takes shape, from research to handoff</h2>
              <div className="ux-steps">
                {STAGES.map((s, idx) => (
                  <div className="ux-sstep" key={s.tag}>
                    <div className="ux-sstep__meta">
                      <p className="eyebrow"><span />{s.tag}</p>
                      <span className="ux-sstep__idx">Stage 0{idx + 1} / 0{STAGES.length}</span>
                    </div>
                    <h3>{s.t} <em>{s.em}</em></h3>
                    <p>{s.p}</p>
                    <ul className="ux-sstep__deliv" aria-label={`${s.tag} deliverables`}>
                      {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="ux-flow__dock">
                <ol className="ux-stepper" aria-label="Jump to stage">
                  {STAGES.map((s, idx) => (
                    <li key={s.tag} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}>
                      <span>0{idx + 1}</span>{s.tag}
                    </li>
                  ))}
                </ol>
                <div className="ux-flow__progwrap" aria-hidden="true">
                  <span className="ux-flow__prog"><i /></span>
                  <span className="ux-flow__hint">Scroll or click stage</span>
                </div>
              </div>
            </div>

            <div className="ux-stage" aria-hidden="true">
              <div className="ux-stage__board">
                <div className="ux-canvas">
                  <div className="ux-canvas__bar">
                    <span className="ux-canvas__file"><i />Planly — Web App.fig</span>
                    <span className="ux-canvas__stage">01 · Research</span>
                    <span className="ux-canvas__zoom">100%</span>
                  </div>
                  <div className="ux-canvas__art">
                    <Mock>
                      <div className="ux-guides" />
                      <div className="ux-tags">
                        <span className="ux-tag ux-tag--a">Nav · 64px</span>
                        <span className="ux-tag ux-tag--b">Hero · Value Prop</span>
                        <span className="ux-tag ux-tag--c">Primary CTA</span>
                        <span className="ux-tag ux-tag--d">3-Col Bento</span>
                      </div>
                      <div className="ux-notes">
                        <div className="ux-note ux-note--a">
                          <span className="ux-note__meta"><i>User #04</i><em>Pricing</em></span>
                          <p>"I couldn't find the price."</p>
                        </div>
                        <div className="ux-note ux-note--b">
                          <span className="ux-note__meta"><i>Funnel</i><em>38% drop</em></span>
                          <p>"Too many steps to sign up."</p>
                        </div>
                        <div className="ux-note ux-note--c">
                          <span className="ux-note__meta"><i>Heatmap</i><em>CTA</em></span>
                          <p>"Not sure what this button does."</p>
                        </div>
                        <small className="ux-notes__lab">Research insights mapped to live layout</small>
                      </div>
                      <div className="ux-proto">
                        <svg className="ux-flowsvg" preserveAspectRatio="none"><path /></svg>
                        <div className="ux-next">
                          <span className="ux-next__head"><b>Step 2 of 2</b><i>Create workspace</i></span>
                          <span className="ux-next__field" />
                          <span className="ux-next__field is-short" />
                          <span className="ux-next__cta">Launch →</span>
                        </div>
                        <Cursor />
                      </div>
                      <div className="ux-spec">
                        <span className="ux-spec__pad"><b>12 × 24 px</b></span>
                        <span className="ux-spec__tag ux-spec__tag--a">h4 · 32/38 · 800</span>
                        <span className="ux-spec__tag ux-spec__tag--b">btn / primary · r-999</span>
                        <span className="ux-spec__sw">
                          <i style={{ background: "#100563" }} />
                          <i style={{ background: "#ffe401" }} />
                          <i style={{ background: "#eef0fb" }} />
                          <b>Tokens Ready ✓</b>
                        </span>
                      </div>
                    </Mock>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- services stack */}
        <section className="ux-sec ux-stack" aria-labelledby="ux-svc-h">
          <div className="container">
            <Head id="ux-svc-h" center eyebrow="What we design" title="Everything between a brief" em="and a shipped screen."
              lead="Use us for one stage or the whole journey. Each one stands alone, and each one makes the next easier." />
            <div className="ux-stack__list">
              {SERVICES.map((s, i) => (
                <article className="ux-sc" key={s.t} style={{ "--i": i } as CSSProperties}>
                  <div className="ux-sc__b">
                    <div className="ux-sc__top">
                      <span className="ux-sc__ic"><s.icon size={22} aria-hidden="true" /></span>
                      <span className="ux-sc__num" aria-hidden="true">{String(i + 1).padStart(2, "0")} · {s.stage}</span>
                      <span className="ux-sc__out">{s.output}</span>
                    </div>
                    <h3>{s.t}</h3>
                    <p>{s.p}</p>
                    <ul>{s.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                    <div className="ux-sc__foot">
                      <span>Standalone or full sprint</span>
                      <Link className="ux-sc__cta" to="/contact">Discuss {s.stage.toLowerCase()} <ArrowRight size={14} aria-hidden="true" /></Link>
                    </div>
                  </div>
                  <div className="ux-sc__img"><ServiceArt index={i} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- usability lab */}
        <section className="ux-sec ux-lab" aria-labelledby="ux-lab-h">
          <div className="container">
            <Head id="ux-lab-h" eyebrow="Usability lab" title="Small fixes," em="big difference."
              lead="Here is a sign-up form the way many products ship it. Switch on each improvement and try typing in it." />
            <div className="ux-lab__grid">
              <div className="ux-lab__ctl">
                <ul>
                  {FIXES.map((f, i) => (
                    <li key={f.t}>
                      <button type="button" role="switch" aria-checked={fix[i]} className={`ux-sw${fix[i] ? " is-on" : ""}`} onClick={() => toggle(i)}>
                        <i aria-hidden="true" />
                        <span>
                          <b><em>0{i + 1}</em> {f.t}</b>
                          <small>{f.p}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="ux-lab__bar">
                  <span className="ux-lab__meter" aria-hidden="true"><i style={{ width: `${(applied / 4) * 100}%` }} /></span>
                  <span>{applied} of 4 improvements on</span>
                  <button type="button" className="ux-ghost" onClick={applyAllFixes}>{applied === 4 ? "Reset" : "Apply all"}</button>
                </div>
              </div>

              <div className="ux-phone" ref={labCardRef}>
                <div className="ux-phone__head">
                  <span className="ux-phone__label">Live form preview</span>
                  <span className={`ux-phone__score${applied === 4 ? " is-ready" : ""}`}>UX Score · {score}%</span>
                </div>
                <form
                  className={`ux-form${fix[0] ? " f-labels" : ""}${fix[2] ? " f-touch" : ""}${fix[3] ? " f-focus" : ""}`}
                  aria-label="Demo sign-up form"
                  onSubmit={(e) => { e.preventDefault(); setLabSent(true); }}
                  noValidate
                >
                  <h3>Create your account</h3>
                  {!fix[1] && <p className="ux-form__top" role="alert">Something went wrong. Please try again.</p>}
                  <div className="ux-field"><label htmlFor="ux-em">Email address</label><input id="ux-em" type="email" placeholder={fix[0] ? "you@company.com" : "Email address"} autoComplete="off" /></div>
                  <div className="ux-field">
                    <label htmlFor="ux-pw">Password</label><input id="ux-pw" type="password" placeholder={fix[0] ? "Min. 8 characters" : "Password"} autoComplete="off" />
                    {fix[1] && <p className="ux-form__msg">Use at least 8 characters. Adding a number helps.</p>}
                  </div>
                  <button type="submit">Create account <ArrowRight size={15} aria-hidden="true" /></button>
                  {labSent && (
                    <p className={`ux-form__fb${applied === 4 ? " is-ok" : ""}`}>
                      {applied === 4 ? "✓ Clean submission — clear labels, generous hit area, zero guesswork." : "Notice the friction above? Toggle on the improvements on the left."}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- responsive lab */}
        <section className="ux-sec ux-resp" aria-labelledby="ux-resp-h">
          <div className="container">
            <Head id="ux-resp-h" eyebrow="Responsive design" title="One design," em="every screen."
              lead="We design the layout to reflow, not shrink. Drag the width and watch the columns, navigation and spacing adapt." />
            <Lab w={vw} onW={setVw} onStop={() => rTween.current?.kill()} onReplay={replayReflow} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- tokens */}
        <section className="ux-sec ux-tk" aria-labelledby="ux-tk-h">
          <div className="container">
            <Head
              center
              id="ux-tk-h"
              eyebrow="Design systems"
              title="Change one token,"
              em="the whole product follows."
              lead="A design system turns colour, shape and type into shared variables. Adjust any token on the left and watch every component update together."
            />
            <div className="ux-tk__grid">
              <div className="ux-tk__ctl" data-reveal>
                <div className="ux-tk__chead">
                  <span className="ux-tk__ctitle"><SlidersHorizontal size={15} aria-hidden="true" /> Token Studio</span>
                  <button type="button" className="ux-tk__reset" onClick={resetTokens}>
                    <RotateCcw size={13} aria-hidden="true" /> Reset
                  </button>
                </div>

                <fieldset>
                  <legend>
                    <span>Primary colour</span>
                    <output className="ux-tk__val">{SWATCHES[sw].n} · {SWATCHES[sw].c}</output>
                  </legend>
                  <div className="ux-tk__sw">
                    {SWATCHES.map((s, i) => (
                      <button
                        key={s.n}
                        type="button"
                        aria-pressed={sw === i}
                        aria-label={`${s.n} (${s.c})`}
                        className={sw === i ? "is-on" : ""}
                        style={{ background: s.c }}
                        onClick={() => setSw(i)}
                      >
                        {sw === i && <Check size={15} strokeWidth={3} aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="ux-tk__r">
                  <div className="ux-tk__rhead">
                    <label htmlFor="ux-tk-range">Corner radius</label>
                    <div className="ux-tk__rpresets">
                      {[
                        { l: "Sharp", v: 0 },
                        { l: "Soft", v: 12 },
                        { l: "Pill", v: 24 },
                      ].map((p) => (
                        <button key={p.l} type="button" className={radius === p.v ? "is-on" : ""} onClick={() => setRadius(p.v)}>{p.l}</button>
                      ))}
                      <output>{radius}px</output>
                    </div>
                  </div>
                  <input
                    id="ux-tk-range"
                    className="ux-range"
                    type="range"
                    min={0}
                    max={28}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  />
                </div>

                <fieldset>
                  <legend>
                    <span>Typeface</span>
                    <output className="ux-tk__val">{FONTS[font].tag}</output>
                  </legend>
                  <div className="ux-tk__font">
                    {FONTS.map((f, i) => (
                      <button
                        key={f.n}
                        type="button"
                        aria-pressed={font === i}
                        className={font === i ? "is-on" : ""}
                        onClick={() => setFont(i)}
                      >
                        <em style={{ fontFamily: f.f }}>Aa</em>
                        <span>{f.n} · {f.tag}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="ux-tk__term">
                  <div className="ux-tk__termbar">
                    <span>tokens.css</span>
                    <button type="button" onClick={copyTokens}>
                      {tkCopied ? <><Check size={12} aria-hidden="true" /> Copied</> : <><Copy size={12} aria-hidden="true" /> Copy CSS</>}
                    </button>
                  </div>
                  <pre className="ux-tk__code" aria-label="Current design tokens">
                    <code>{tokenCss}</code>
                  </pre>
                </div>
              </div>

              <div className="ux-tk__sheet" style={tokens} data-reveal>
                <div className="ux-tk__shead">
                  <div>
                    <span className="ux-tk__skicker">Live UI Kit · Synced</span>
                    <h3>Component sheet</h3>
                  </div>
                  <div className="ux-tk__tabs" role="tablist" aria-label="Preview view">
                    {["Overview", "Billing", "API"].map((tab, i) => (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={tkTab === i}
                        className={tkTab === i ? "is-on" : ""}
                        onClick={() => setTkTab(i)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ux-tk__row">
                  <button type="button" className="tk-b">Primary CTA</button>
                  <button type="button" className="tk-b tk-b--o">Secondary</button>
                  <span className="tk-badge">v2.4 Live</span>
                  <span className="tk-badge tk-badge--soft">WCAG AA</span>
                </div>

                <div className="ux-tk__inputs">
                  <label className="tk-f">
                    <span>Workspace email</span>
                    <input type="email" defaultValue="design@sipherweb.in" placeholder="you@company.com" />
                  </label>
                  <label className="tk-sw">
                    <input type="checkbox" defaultChecked />
                    <i />
                    <span>Auto-sync tokens</span>
                  </label>
                </div>

                <div className="ux-tk__bento">
                  <div className="tk-card">
                    <div className="tk-card__top">
                      <b>{tkTab === 0 ? "Pro Workspace" : tkTab === 1 ? "Annual Billing" : "API Access Key"}</b>
                      <span className="tk-badge">{tkTab === 1 ? "Save 20%" : "Active"}</span>
                    </div>
                    <p>
                      {tkTab === 0
                        ? "Cards, inputs, badges and buttons all inherit your 3 global tokens automatically."
                        : tkTab === 1
                          ? "Switch plan tiers with zero component overrides—spacing and contrast adapt smoothly."
                          : "Generate scoped tokens for your design engineering pipeline in one click."}
                    </p>
                    <div className="tk-card__bar"><i style={{ width: tkTab === 0 ? "78%" : tkTab === 1 ? "92%" : "64%" }} /></div>
                    <button type="button" className="tk-b">
                      {tkTab === 0 ? "Upgrade plan" : tkTab === 1 ? "Download invoice" : "Rotate key"} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="tk-mini">
                    <div className="tk-mini__user">
                      <span className="tk-mini__av">SW</span>
                      <div>
                        <b>Design Review</b>
                        <small>Handoff #14 ready</small>
                      </div>
                    </div>
                    <p>All 42 screen components match spacing &amp; colour guidelines.</p>
                    <div className="tk-mini__acts">
                      <button type="button" className={`tk-b tk-b--sm${tkApproved ? "" : " tk-b--o"}`} onClick={() => setTkApproved((a) => !a)}>
                        {tkApproved ? <><Check size={13} aria-hidden="true" /> Approved</> : "Approve spec"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ux-tk__foot">
                  <span>3 global tokens active</span>
                  <span>Zero per-screen overrides</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- principles */}
        <section className="ux-sec ux-pr" aria-labelledby="ux-pr-h">
          <div className="container">
            <Head
              center
              id="ux-pr-h"
              eyebrow="What we never skip"
              title="The details that make"
              em="an interface feel right."
              lead="Visual polish means nothing if the fundamentals break. Every screen we ship passes these six baseline checks before handoff."
            />
            <ul className="ux-pr__grid">
              {PRINCIPLES.map((p, i) => (
                <li
                  className="ux-pr__c"
                  key={p.t}
                  data-reveal
                  onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                  }}
                >
                  <span className="ux-pr__num" aria-hidden="true">0{i + 1}</span>
                  <div className="ux-pr__top">
                    <span className="ux-pr__ic"><PrincipleIcon kind={p.kind} /></span>
                    <span className="ux-pr__tag">{p.tag}</span>
                  </div>
                  <h3>{p.t}</h3>
                  <p>{p.p}</p>
                  <div className="ux-pr__foot">
                    <span className="ux-pr__spec">
                      <svg className="ux-pr__chk" viewBox="0 0 512 512" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                        />
                      </svg>
                      {p.spec}
                    </span>
                    <ArrowRight className="ux-pr__arr" size={14} aria-hidden="true" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <RelatedServicesSection
          items={REL}
          eyebrow="Related services"
          title={
            <>
              From design <em>to a working product</em>
            </>
          }
          lead="Great design works hardest when paired with clean engineering and conversion-focused builds. Pick a service below to see how it fits."
        />
      </div>
    </>
  );
}