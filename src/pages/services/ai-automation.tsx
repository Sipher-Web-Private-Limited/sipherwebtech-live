import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowRight, BarChart3, BookOpen, Check, FileText, FlaskConical, Gauge, LifeBuoy, LineChart,
  ListChecks, Lock, MessageCircle, Plug, ShieldCheck, Sparkles, Target, UserCheck, Users, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import TechStackRibbons, { type RibbonLaneConfig } from "../../components/TechStackRibbons";
import "../../styles/services/ai-automation.css";

gsap.registerPlugin(ScrollTrigger);

const NAVY = "#100563";
const SOFT = "#fff8c4";

const Words = ({ text }: { text: string }) => (
  <>{text.split(" ").map((w, i) => <span key={i}><span className="aia-w"><span>{w}</span></span>{" "}</span>)}</>
);

function Head({ eyebrow, children, lead, center }: { eyebrow: string; children: ReactNode; lead?: string; center?: boolean }) {
  return (
    <div className={`aia-head${center ? " aia-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="aia-title">{children}</h2>
      {lead && <p className="aia-lead">{lead}</p>}
    </div>
  );
}

const AIA_RIBBON_LANES: readonly RibbonLaneConfig[] = [
  {
    label: "AI and Automation Tools",
    className: "tech-ribbons__lane--technology",
    reverse: false,
    items: [
      "LLM Assistants",
      "Chatbots",
      "Document Reading (OCR)",
      "Workflow Automation",
      "n8n & Zapier",
      "Python Scripts",
      "Knowledge Search (RAG)",
      "Speech to Text",
      "Prompt Design",
    ],
  },
  {
    label: "What We Automate",
    className: "tech-ribbons__lane--disciplines",
    reverse: true,
    items: [
      "Lead Follow-ups",
      "Invoice Processing",
      "WhatsApp Support",
      "Report Generation",
      "Data Entry",
      "Email Triage",
      "Approval Workflows",
      "Stock Alerts",
      "Human Review Steps",
    ],
  },
] as const;

/* ---- PINNED SCENE data ---- */
const FLOW = [
  { tag: "Capture", t: "An enquiry arrives on any channel,", em: "once.", p: "Email, WhatsApp and website forms feed one workflow, so nothing waits in an inbox nobody is watching." },
  { tag: "Understand", t: "AI reads it the way a", em: "colleague would.", p: "It works out what the person wants, such as a price, a booking or a complaint, and pulls out the names, dates and amounts." },
  { tag: "Decide", t: "Your rules choose", em: "what happens next.", p: "Business rules you approve decide the owner, the priority and the reply, so the AI never invents policy." },
  { tag: "Act", t: "The routine work is", em: "done for you.", p: "The CRM is updated, a reply is drafted and the right person is alerted, in seconds instead of hours." },
  { tag: "Review", t: "A person stays in", em: "control.", p: "Risky or unclear cases go to your team for approval, and every action is logged so you can check it later." },
];
const LEDGER = [
  "Enquiry received · WhatsApp · pricing question",
  "Intent read · name, product and quantity found",
  "Rules applied · owner assigned · priority high",
  "CRM updated · reply drafted · team alerted",
  "Human approved · action logged for audit",
];

/* ---- USE CASES data ---- */
const INT: Array<{ icon: LucideIcon; t: string; category: string; p: string; tags: string[] }> = [
  {
    icon: MessageCircle, t: "Customer support assistant", category: "Answer faster",
    p: "A chatbot trained on your own FAQs, price lists and policies answers common questions on WhatsApp or your website and hands tricky ones to your team.",
    tags: ["WhatsApp bot", "Website chat", "Human handover"],
  },
  {
    icon: Users, t: "Lead handling", category: "Follow up on time",
    p: "New enquiries are scored, assigned and followed up automatically, so no lead goes cold because someone was busy.",
    tags: ["Lead scoring", "Auto follow-up", "CRM updates"],
  },
  {
    icon: FileText, t: "Document and invoice reading", category: "Stop retyping",
    p: "Invoices, forms and ID documents are read, checked and entered into your system, with unclear fields flagged for a person.",
    tags: ["OCR", "Field checks", "Data entry"],
  },
  {
    icon: BarChart3, t: "Reports and summaries", category: "Know without asking",
    p: "Daily sales, stock and team reports are built from your data and sent to the right people, with a plain-language summary on top.",
    tags: ["Daily digests", "Summaries", "Email and chat"],
  },
  {
    icon: Workflow, t: "Back-office workflows", category: "Remove the handoffs",
    p: "Approvals, reminders, onboarding steps and record updates move on their own and stop only where a decision is needed.",
    tags: ["Approvals", "Reminders", "Onboarding"],
  },
  {
    icon: BookOpen, t: "Internal knowledge assistant", category: "Find answers inside",
    p: "Staff ask questions in plain language and get answers drawn from your manuals, SOPs and past documents, with the source shown.",
    tags: ["Search your files", "Cited answers", "Access control"],
  },
];

/* ---- LEVEL data (choose the right amount of AI) ---- */
const PAT = [
  {
    k: "Rule-based",
    route: "Level 01",
    sub: "If this, then that",
    badge: "Most predictable",
    t: "Automate the steps that never change",
    p: "Fixed rules move data and trigger actions with no AI judgement. It suits work where the input is always structured, such as copying form data into a sheet or sending a reminder on a date.",
    m: [98, 25, 95, 90],
    tags: ["Same result every time", "Needs clean input", "Lowest running cost", "You set every rule"],
    f: [
      "Behaves exactly the same way every time, so it is easy to trust",
      "Cheapest to build and run, with no per-task AI charges",
      "Cannot cope with free text, scans or unusual requests",
    ],
    verdict: "Best for structured, repeatable steps where the rules are already clear.",
  },
  {
    k: "AI-assisted",
    route: "Level 02",
    sub: "AI drafts, you approve",
    badge: "Recommended start",
    t: "Let AI do the reading, a person decides",
    p: "AI handles messy input such as emails, PDFs and chats, and prepares a draft or a suggestion. A team member approves it before anything important happens.",
    m: [80, 80, 70, 85],
    tags: ["Mostly consistent", "Reads free text and scans", "Moderate per-task cost", "Approval step included"],
    f: [
      "Handles unstructured input that rules alone cannot",
      "A person checks risky cases, so mistakes are caught early",
      "Needs a short review step, which slightly slows full automation",
    ],
    verdict: "Best for most businesses: real time saved, with a person still in control.",
  },
  {
    k: "AI agent",
    route: "Level 03",
    sub: "Plans and acts alone",
    badge: "Highest autonomy",
    t: "Give AI a goal inside clear limits",
    p: "An agent picks the steps itself, using the tools you allow, such as searching records, drafting replies and updating systems. It needs tight limits and good monitoring.",
    m: [65, 95, 40, 40],
    tags: ["Varies with the task", "Handles open-ended work", "Higher per-task cost", "Guardrails required"],
    f: [
      "Copes with open-ended work that has no fixed script",
      "Results can vary, so testing and logging matter more",
      "Best kept to low-risk actions until it has earned trust",
    ],
    verdict: "Best for low-risk, open-ended tasks once simpler levels are working well.",
  },
];
const METERS = ["Predictable results", "Handles messy input", "Cost per task", "Human control"];

/* ---- PROCESS data ---- */
const STEPS: Array<{ t: string; w: string; p: string; icon: LucideIcon; out: string[] }> = [
  {
    t: "Find the right tasks", w: "Days 1 to 3", icon: ListChecks,
    p: "We list your repeated tasks, time each one and pick the few where automation saves the most hours with the least risk.",
    out: ["Task shortlist", "Hours estimate", "Risk notes"],
  },
  {
    t: "Prototype on real samples", w: "Week 1", icon: FlaskConical,
    p: "We test the idea on your own emails, documents or chats, and show you how often it gets things right and wrong.",
    out: ["Working prototype", "Accuracy results", "Go or stop decision"],
  },
  {
    t: "Connect it to your tools", w: "Weeks 2 to 3", icon: Plug,
    p: "The workflow is wired into your CRM, sheets, WhatsApp or ERP, with rules, approvals and fallbacks written in.",
    out: ["Live integrations", "Approval steps", "Fallback to staff"],
  },
  {
    t: "Pilot with human review", w: "Weeks 3 to 5", icon: ShieldCheck,
    p: "A small team runs it with every important action reviewed, and we fix issues before it reaches the whole business.",
    out: ["Pilot report", "Fixes applied", "Team training"],
  },
  {
    t: "Monitor and improve", w: "After launch", icon: LineChart,
    p: "We track accuracy, cost and time saved, and tune prompts and rules as your business and the AI models change.",
    out: ["Monthly metrics", "Prompt tuning", "Model updates"],
  },
];

const QUAL: Array<{ icon: LucideIcon; t: string; p: string; pts: string[] }> = [
  { icon: UserCheck, t: "Human in the loop", p: "People approve important actions, and unclear cases go to staff.", pts: ["Approvals", "Escalation"] },
  { icon: Lock, t: "Data privacy", p: "We agree what data the AI may see, and keep sensitive fields out.", pts: ["Access limits", "Data masking"] },
  { icon: Target, t: "Accuracy testing", p: "We measure results on your own samples before and after launch.", pts: ["Test sets", "Error rates"] },
  { icon: Gauge, t: "Cost control", p: "Usage caps and cheaper models for simple tasks keep bills predictable.", pts: ["Usage caps", "Model choice"] },
  { icon: Activity, t: "Audit trail", p: "Every AI action is logged so you can see what happened and why.", pts: ["Action logs", "Review history"] },
  { icon: LifeBuoy, t: "Safe fallbacks", p: "If the AI is unsure or a service is down, the task goes to a person.", pts: ["Manual route", "Alerts"] },
];

const REL: RelatedServiceItem[] = [
  {
    to: "/services/api-integration",
    title: "API integration",
    text: "Connect AI workflows to payments, WhatsApp and your other tools.",
    img: "/new-images/services/webdev/related-custom-software.webp",
  },
  {
    to: "/services/erp-crm",
    title: "ERP & CRM",
    text: "Give automation clean business data to work from.",
    img: "/new-images/services/webdev/related-custom-software.webp",
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

const HERO_BADGES = ["Human approves risky steps", "Tested on your samples"] as const;


const SITE = "https://sipherweb.in"; /* confirm production domain */
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service", name: "AI Automation", serviceType: "AI automation and workflow automation", url: `${SITE}/services/ai-automation`,
      description: "Practical AI automation for support chatbots, lead follow-ups, document reading, reports and back-office workflows, with human review, testing and monitoring.",
      provider: { "@type": "Organization", name: "Sipher Web Pvt. Ltd.", url: SITE },
      areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: "AI Automation", item: `${SITE}/services/ai-automation` },
    ] },
  ],
};

/* hero illustration: inline SVG so the page works without an extra asset */
const HERO_LEFT = [["Emails", 20, 92], ["Invoices", 12, 262], ["Chats", 20, 432]] as const;
const HERO_RIGHT = [["CRM", 480, 92], ["Reply", 488, 262], ["Report", 480, 432]] as const;

const HERO_PATHS = [
  "M160,122 C205,122 200,280 245,280",
  "M152,292 C200,292 205,295 245,295",
  "M160,462 C205,462 200,310 245,310",
  "M395,280 C440,280 435,122 480,122",
  "M395,295 C440,295 445,292 488,292",
  "M395,310 C440,310 435,462 480,462",
];

function HeroIllustration() {
  return (
    <svg className="aia-hero__illustration" viewBox="0 0 640 590" role="img" aria-label="AI automation engine turning emails, invoices and chats into CRM updates, replies and reports">
      <defs>
        <filter id="aia-hi-shadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#100563" floodOpacity="0.12" />
        </filter>
        <radialGradient id="aia-hi-glow">
          <stop offset="0%" stopColor="#100563" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#100563" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="aia-hi-glow" cx="320" cy="295" r="150" fill="url(#aia-hi-glow)" />
      <circle className="aia-hi-ring" cx="320" cy="295" r="104" />
      <g fill="none" className="aia-hi-lines">
        {HERO_PATHS.map((d, i) => <path key={i} id={`aia-hp${i}`} d={d} />)}
      </g>
      <g className="aia-hi-packets" aria-hidden="true">
        {HERO_PATHS.map((_, i) => (
          <circle key={i} r="5.5" opacity="0">
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.88;1" dur="2.8s" begin={`${(i * 0.45).toFixed(2)}s`} repeatCount="indefinite" />
            <animateMotion dur="2.8s" begin={`${(i * 0.45).toFixed(2)}s`} repeatCount="indefinite" calcMode="linear">
              <mpath href={`#aia-hp${i}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
      {[...HERO_LEFT, ...HERO_RIGHT].map(([label, x, y]) => (
        <g key={label} className="aia-hi-node" filter="url(#aia-hi-shadow)">
          <rect x={x} y={y} width="140" height="60" rx="18" />
          <circle cx={x + 26} cy={y + 30} r="9" />
          <text x={x + 46} y={y + 35}>{label}</text>
        </g>
      ))}
      <g className="aia-hi-hub" filter="url(#aia-hi-shadow)">
        <rect x="245" y="235" width="150" height="120" rx="28" />
        <text x="320" y="288" className="aia-hi-hub__main">AI</text>
        <text x="320" y="316" className="aia-hi-hub__sub">AUTOMATION</text>
      </g>
      <g className="aia-hi-chip" filter="url(#aia-hi-shadow)">
        <rect x="205" y="60" width="230" height="46" rx="14" />
        <text x="226" y="89">Task: sort enquiry</text>
      </g>
      <g className="aia-hi-chip" filter="url(#aia-hi-shadow)">
        <rect x="205" y="500" width="230" height="46" rx="14" />
        <circle className="aia-hi-ok" cx="228" cy="523" r="6" />
        <text x="244" y="528">Done · 3 s · reviewed</text>
      </g>
    </svg>
  );
}

export default function AiAutomation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pat, setPat] = useState(0);
  const patFirst = useRef(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => Array.from(c.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => c.querySelector<T>(s) as T;
    const mm = gsap.matchMedia(root);

    mm.add({ motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
      const { motion } = ctx.conditions as unknown as { motion: boolean };
      if (!motion) return;
      const off: Array<() => void> = [];
      root.classList.add("is-motion");

      /* ---- HERO ---- */
      {
        const breadcrumb = $(".aia-hero .breadcrumb");
        const titleWords = $(".aia-hero__title .aia-w > span");
        const leadCta = $(".aia-hero__lead, .aia-hero__cta > *, .aia-trust li");
        const illustration = one(".aia-hero__illustration");
        const visual = one(".aia-hero__visual");
        const hero = one(".aia-hero");

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        if (breadcrumb.length) tl.from(breadcrumb, { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" });
        if (titleWords.length) tl.from(titleWords, { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1);
        if (leadCta.length) tl.from(leadCta, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.06, clearProps: "all" }, 0.55);
        if (illustration) tl.fromTo(illustration, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath" }, 0.2);
        if (visual && hero) gsap.to(visual, { yPercent: -5, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      }

      /* ---- PINNED SCENE: one request through the integration layer ---- */
      {
        const section = one(".aia-scene"), steps = $(".aia-sstep"), counter = one(".aia-scene__count"), bar = one(".aia-scene__bar i");
        const pk = one(".aia-pk"), led = $(".aia-led li"), wrap = one(".aia-steps");
        if (section && steps.length && counter && bar && pk && wrap) {
          const fit = () => { wrap.style.height = ""; wrap.style.height = `${Math.max(...steps.map((k) => k.offsetHeight))}px`; };
          ScrollTrigger.addEventListener("refreshInit", fit); fit();
          off.push(() => { ScrollTrigger.removeEventListener("refreshInit", fit); wrap.style.height = ""; });

          $(".aia-pf").forEach((p) => { const L = (p as unknown as SVGPathElement).getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set(led, { opacity: 0.35, x: -10 });
          if (led[0]) { led[0].classList.add("is-live"); gsap.set(led[0], { opacity: 1, x: 0 }); }
          gsap.set(pk, { autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top top", end: "+=480%", scrub: 1, pin: true, anticipatePin: 1, onUpdate: (s) => { bar.style.transform = `scaleX(${Math.max(0.03, s.progress)})`; } },
          });

          const send = (id: number, at: number, node: string) => {
            const path = one<SVGPathElement>(`#aia-a${id}`);
            if (!path) return;
            const L = path.getTotalLength(), o = { t: 0 };
            tl.to(`#aia-f${id}`, { strokeDashoffset: 0, duration: 0.9, ease: "none" }, at)
              .set(pk, { autoAlpha: 1 }, at)
              .to(o, { t: 1, duration: 0.9, ease: "power1.inOut", onUpdate: () => { const q = path.getPointAtLength(o.t * L); pk.setAttribute("cx", String(q.x)); pk.setAttribute("cy", String(q.y)); } }, at)
              .to(pk, { autoAlpha: 0, duration: 0.1 }, at + 0.9)
              .to(`#aia-${node} rect`, { fill: SOFT, stroke: NAVY, duration: 0.3 }, at + 0.85);
          };

          const PLAN: Array<Array<[number, string]>> = [[[0, "hub"]], [[1, "hub"]], [[2, "hub"]], [[3, "n3"], [4, "n4"]], [[5, "n5"]]];
          PLAN.forEach((hops, i) => {
            const at = i * 2.8;
            if (i < 3) tl.to(`#aia-n${i} rect`, { fill: SOFT, stroke: NAVY, duration: 0.3 }, at);
            hops.forEach(([id, node], k) => send(id, at + 0.3 + k * 1.0, node));
            if (led[i]) {
              tl.to(led[i], {
                opacity: 1, x: 0, duration: 0.45,
                onStart: () => led[i]?.classList.add("is-live"),
                onReverseComplete: () => { if (i > 0) led[i]?.classList.remove("is-live"); },
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

      /* ---- PROCESS: line progress + active step ---- */
      {
        const pline = one(".aia-pline i"), plist = one(".aia-plist");
        const items = $(".aia-pstep");
        if (pline && plist) {
          gsap.fromTo(pline, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: plist, start: "top 60%", end: "bottom 60%", scrub: true } });
        }
        const setActive = (i: number) => {
          items.forEach((x, k) => { x.classList.toggle("is-on", k === i); x.classList.toggle("is-done", k < i); });
        };
        items.forEach((s, i) => ScrollTrigger.create({
          trigger: s, start: "top 55%", end: "bottom 55%",
          onToggle: (self) => { if (self.isActive) setActive(i); },
        }));
        if (items.length) setActive(0);
      }

      /* ---- GENERIC REVEALS ---- */
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

  /* pattern tab change: re-animate meters and copy */
  useLayoutEffect(() => {
    if (patFirst.current) { patFirst.current = false; return; }
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".aia-meter i", { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" });
      gsap.fromTo(".aia-pat__info > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, clearProps: "all" });
      gsap.fromTo(".aia-pat__card", { autoAlpha: 0.7, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
    }, root);
    return () => ctx.revert();
  }, [pat]);

  return (
    <>
      <Seo
        title="AI Automation Services in Indore | Chatbots, Workflows, Reports | Sipher Webtech"
        description="Practical AI automation for support chatbots, lead follow-ups, document reading and reports. Tested on your real data, with human review built in. Get a free consultation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="aia" ref={rootRef}>
        {/* =========================== HERO =========================== */}
        <section className="aia-hero" aria-labelledby="aia-h1">
          <div className="container aia-hero__grid">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">AI Automation</span>
              </nav>
              <h1 id="aia-h1" className="aia-hero__title" aria-label="Let AI handle the work your team repeats.">
                <span className="aia-line" aria-hidden="true"><Words text="Let AI handle the work" /></span>
                <em className="aia-line" aria-hidden="true"><Words text="your team repeats." /></em>
              </h1>
              <p className="aia-hero__lead">Sipher Web builds practical AI automation for businesses in Indore and across India: support chatbots, document reading, lead follow-ups and daily reports. Each workflow starts small, keeps a person in the loop where it matters, and is measured against the hours it really saves.</p>
              <div className="aia-hero__cta">
                <Link className="button button--primary" to="/contact" data-cursor="START"><span>Find tasks to automate</span><ArrowRight aria-hidden="true" size={18} /></Link>
                <a className="aia-ghost" href="#aia-scene">See one enquiry handled</a>
              </div>
              <ul className="aia-trust">{["Human review built in", "Tested on real samples", "Privacy-first set-up", "Measured time saved"].map((t) => <li key={t}><Check aria-hidden="true" size={15} />{t}</li>)}</ul>
            </div>

            <div className="aia-hero__visual">
              <HeroIllustration />
              <span className="aia-hero__badge aia-hero__badge--a"><Check aria-hidden="true" />{HERO_BADGES[0]}</span>
              <span className="aia-hero__badge aia-hero__badge--b"><Check aria-hidden="true" />{HERO_BADGES[1]}</span>
            </div>
          </div>
        </section>

        <TechStackRibbons lanes={AIA_RIBBON_LANES} />

        {/* =========================== PINNED SCENE =========================== */}
        <section className="aia-scene" id="aia-scene" aria-label="How one enquiry moves through an AI workflow">
          <div className="container aia-scene__grid">
            <div>
              <h2 className="aia-sr">Follow one enquiry through the AI workflow</h2>
              <div className="aia-steps">
                {FLOW.map((s) => (
                  <div className="aia-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.t} <em>{s.em}</em></h3>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
              <p className="aia-scene__count" aria-hidden="true">01 / 05</p>
              <span className="aia-scene__bar" aria-hidden="true"><i /></span>
            </div>

            <div className="aia-stage" aria-hidden="true">
              <svg className="aia-dg" viewBox="0 0 640 340">
                <defs>
                  <filter id="aia-node-shadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#100563" floodOpacity="0.08" />
                  </filter>
                  <filter id="aia-hub-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#100563" floodOpacity="0.22" />
                  </filter>
                </defs>
                <g fill="none">
                  {["M135,60C190,60 200,150 245,150", "M135,170H245", "M135,280C190,280 200,190 245,190", "M395,150C440,150 440,60 470,60", "M395,170H470", "M395,190C440,190 440,280 470,280"].map((d, i) => (
                    <g key={i}><path id={`aia-a${i}`} className="aia-ln" d={d} /><path id={`aia-f${i}`} className="aia-pf" d={d} /></g>
                  ))}
                </g>
                <g id="aia-hub" className="aia-node aia-node--hub">
                  <rect x="245" y="116" width="150" height="108" rx="22" filter="url(#aia-hub-shadow)" />
                  <text x="320" y="160" className="aia-hub__sub">ONE AI</text>
                  <text x="320" y="184" className="aia-hub__main">WORKFLOW</text>
                </g>
                {[["Email", 10, 32], ["WhatsApp", 10, 142], ["Web form", 10, 252], ["CRM", 470, 32], ["Reply", 470, 142], ["Alert", 470, 252]].map(([l, x, y], i) => (
                  <g className="aia-node" id={`aia-n${i}`} key={l as string}>
                    <rect x={x as number} y={y as number} width="140" height="56" rx="16" filter="url(#aia-node-shadow)" />
                    <text x={(x as number) + 70} y={(y as number) + 34}>{l}</text>
                  </g>
                ))}
                <circle className="aia-pk" r="9.5" cx="0" cy="0" />
              </svg>

              <div className="aia-led-card">
                <div className="aia-led-head">
                  <div className="aia-led-head__dots" aria-hidden="true"><span /><span /><span /></div>
                  <span className="aia-led-head__title">Example Run Log</span>
                  <span className="aia-led-head__status"><i /> Reviewed</span>
                </div>
                <ul className="aia-led">
                  {LEDGER.map((l, i) => (
                    <li key={l} className={i === 0 ? "is-live" : ""}>
                      <span className="aia-led__num" aria-hidden="true">0{i + 1}</span>
                      <Check size={14} aria-hidden="true" />
                      <span className="aia-led__txt">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== INTEGRATIONS =========================== */}
        <section className="aia-section aia-ints" aria-labelledby="aia-int-h">
          <div className="container">
            <Head center eyebrow="What we automate" lead="Examples of where AI automation helps. These are possible uses, not client case studies, and we test each one on your own data first.">
              <span id="aia-int-h">The busywork your team <em>repeats every day.</em></span>
            </Head>
            <div className="aia-intgrid">
              {INT.map((x, i) => (
                <article className="aia-int" key={x.t} data-reveal>
                  <div className="aia-int__top">
                    <span className="aia-int__ic" aria-hidden="true"><x.icon size={24} /></span>
                    <span className="aia-int__no" aria-hidden="true">0{i + 1}</span>
                  </div>
                  <p className="aia-int__cat">{x.category}</p>
                  <h3>{x.t}</h3>
                  <p>{x.p}</p>
                  <ul className="aia-int__tags" aria-label={`${x.t} tools`}>
                    {x.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== PATTERNS =========================== */}
        <section className="aia-section aia-patsec" aria-labelledby="aia-pat-h">
          <div className="container">
            <Head center eyebrow="Choose the level of AI" lead="More AI is not always better. Pick a level to see its trade-offs, then we match each task to the simplest approach that works.">
              <span id="aia-pat-h">Three levels of automation, <em>one right fit.</em></span>
            </Head>
            <div className="aia-pat" data-reveal>
              <div className="aia-pat__tabs" role="tablist" aria-label="Automation levels">
                {PAT.map((b, i) => (
                  <button
                    key={b.k}
                    type="button"
                    role="tab"
                    aria-selected={pat === i}
                    className={`aia-pat__tab${pat === i ? " is-on" : ""}`}
                    onClick={() => setPat(i)}
                  >
                    <span className="aia-pat__tab-badge">{b.route}</span>
                    <span className="aia-pat__tab-body">
                      <span className="aia-pat__tab-title">{b.k}</span>
                      <span className="aia-pat__tab-sub">{b.badge}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="aia-pat__panel" role="tabpanel">
                <div className="aia-pat__info">
                  <div className="aia-pat__route-meta">
                    <span className="aia-pat__route-tag">{PAT[pat].route}</span>
                    <span className="aia-pat__route-sub">{PAT[pat].sub}</span>
                  </div>
                  <h3 className="aia-pat__title">{PAT[pat].t}</h3>
                  <p className="aia-pat__desc">{PAT[pat].p}</p>
                  <div className="aia-pat__features-label">Key trade-offs and realities:</div>
                  <ul className="aia-pat__features">
                    {PAT[pat].f.map((f) => (
                      <li key={f} className="aia-pat__feature">
                        <span className="aia-pat__feature-icon" aria-hidden="true"><Check size={14} /></span>
                        <span className="aia-pat__feature-text">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="aia-pat__card">
                  <div className="aia-pat__card-head">
                    <div>
                      <span className="aia-pat__card-title">Level Scorecard</span>
                      <span className="aia-pat__card-sub">Indicative rating for {PAT[pat].k}</span>
                    </div>
                    <span className="aia-pat__card-badge">{PAT[pat].badge}</span>
                  </div>
                  <div className="aia-meter">
                    {METERS.map((m, i) => (
                      <div key={m} className="aia-meter__item">
                        <div className="aia-meter__meta">
                          <span className="aia-meter__label">{m}</span>
                          <span className="aia-meter__tag">{PAT[pat].tags[i]}</span>
                          <span className="aia-meter__score">{PAT[pat].m[i]}%</span>
                        </div>
                        <div className="aia-meter__track" aria-hidden="true">
                          <i style={{ width: `${PAT[pat].m[i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="aia-pat__verdict">
                    <span className="aia-pat__verdict-icon" aria-hidden="true"><Sparkles size={16} /></span>
                    <p className="aia-pat__verdict-body">{PAT[pat].verdict}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== PROCESS =========================== */}
        <section className="aia-section aia-proc" aria-labelledby="aia-proc-h">
          <div className="container">
            <Head center eyebrow="How we deliver" lead="Five stages from choosing the right task to monitoring the live workflow, with real results shown at every step.">
              <span id="aia-proc-h">Five stages, <em>proven on real samples first.</em></span>
            </Head>
            <div className="aia-plist">
              <span className="aia-pline" aria-hidden="true"><i /></span>
              {STEPS.map((s, i) => (
                <article className={`aia-pstep${i === 0 ? " is-on" : ""}`} key={s.t}>
                  <span className="aia-pstep__dot" aria-hidden="true">
                    <b>{i + 1}</b>
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <div className="aia-pstep__card">
                    <header className="aia-pstep__head">
                      <span className="aia-pstep__ic" aria-hidden="true"><s.icon size={20} /></span>
                      <div className="aia-pstep__tt">
                        <span className="aia-pstep__no">Stage 0{i + 1} · {s.w}</span>
                        <h3>{s.t}</h3>
                      </div>
                    </header>
                    <p>{s.p}</p>
                    <ul className="aia-pstep__out" aria-label="What you get">
                      {s.out.map((o) => <li key={o}><Check size={12} strokeWidth={3} aria-hidden="true" />{o}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== QUALITY =========================== */}
        <section className="aia-section aia-qual" aria-labelledby="aia-q-h">
          <div className="container">
            <Head center eyebrow="Built to be trusted" lead="AI can make mistakes, so we design for that. These practices keep a person in charge and make errors easy to catch.">
              <span id="aia-q-h">What keeps automation <em>safe and accurate.</em></span>
            </Head>
            <div className="aia-qgrid">
              {QUAL.map((q) => (
                <article className="aia-q" key={q.t} data-reveal>
                  <span className="aia-q__ic" aria-hidden="true"><q.icon size={24} /></span>
                  <h3>{q.t}</h3>
                  <p>{q.p}</p>
                  <ul className="aia-q__pts" aria-label={`${q.t} practices`}>
                    {q.pts.map((x) => <li key={x}><Check size={12} strokeWidth={3} aria-hidden="true" />{x}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RelatedServicesSection
          items={REL}
          lead="Automation works best on top of connected, well-built systems. Pick a service below to see how it fits."
        />
      </div>
    </>
  );
}