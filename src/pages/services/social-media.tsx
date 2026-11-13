import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  Clapperboard,
  Clock,
  Eye,
  Heart,
  Megaphone,
  MessageSquare,
  PenTool,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import { BrandSocialIcon } from "../../components/BrandSocialIcon";
import "../../styles/services/social-media.css";
import "../../styles/services/service-hero-consistency.css";

gsap.registerPlugin(ScrollTrigger);

/* ---------- helpers ---------- */
const unsplash = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* hides itself if an id ever 404s, so no broken-image icons */
function Photo({ id, w = 900, h, alt = "", eager }: { id: string; w?: number; h?: number; alt?: string; eager?: boolean }) {
  return (
    <img
      src={unsplash(id, w)}
      alt={alt}
      width={w}
      height={h ?? Math.round(w * 0.66)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
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
          <span className="sm-w"><span>{w}</span></span>{" "}
        </span>
      ))}
    </>
  );
}

function Head({ eyebrow, children, lead, center }: { eyebrow: string; children: ReactNode; lead?: string; center?: boolean }) {
  return (
    <div className={`sm-head${center ? " sm-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="sm-title">{children}</h2>
      {lead && <p className="sm-lead">{lead}</p>}
    </div>
  );
}

/* ---------- content ---------- */
const MARQUEE = ["Instagram", "Facebook", "LinkedIn", "YouTube", "WhatsApp", "X", "Pinterest", "Google Business"];

const SERVICES: {
  Icon: LucideIcon;
  title: string;
  text: string;
  tags: string[];
  badge?: string;
  wide?: boolean;
}[] = [
  {
    Icon: CalendarDays,
    title: "Strategy & content calendar",
    text: "A month of posts planned around your product launches, seasonal festivals and customer questions, so you never stare at a blank page.",
    tags: ["Monthly Roadmap", "Festive & Launch Hooks", "Competitor Gap Audit"],
    badge: "Core Framework",
    wide: true,
  },
  {
    Icon: PenTool,
    title: "Posts & carousels",
    text: "Designed in your brand colours, with high-converting captions and typography written in your authentic brand voice.",
    tags: ["Multi-Slide Carousels", "Brand Guidelines", "Story Highlights"],
  },
  {
    Icon: Clapperboard,
    title: "Reels & short video",
    text: "Shot, cut and captioned for the fast scroll, optimized for Instagram Reels, YouTube Shorts and high organic reach.",
    tags: ["9:16 Vertical Cut", "Trending Audio Hooks", "Hindi & English"],
  },
  {
    Icon: Megaphone,
    title: "Paid campaigns",
    text: "Meta, Instagram and LinkedIn ads with a clear budget, targeted audience segmentation, and weekly cost-per-lead optimization.",
    tags: ["Custom Audience Funnels", "High-ROAS Creatives", "Weekly Retargeting"],
    badge: "Fast Growth",
    wide: true,
  },
  {
    Icon: Users,
    title: "Community replies",
    text: "Comments, story mentions, and direct messages answered promptly within minutes, turning followers into qualified business enquiries.",
    tags: ["< 15m SLA Window", "Lead Qualification", "Comment Sentiment"],
  },
  {
    Icon: BarChart3,
    title: "Monthly reports",
    text: "Plain-language numbers: reach lift, content saves, click-throughs, inbound enquiries, and next month's strategic action plan.",
    tags: ["Reach & Save Trends", "Inbound DM Tracker", "Next-Cycle Iteration"],
  },
];

const SCENE = [
  { tag: "Plan", title: "Pick the days,", em: "then the posts.", text: "We map a month around your launches, offers and customer questions, with each post given a job.", details: ["Goals and audience agreed first", "A calendar you can edit", "Mix of posts, reels and stories"] },
  { tag: "Create", title: "Make it look like", em: "you, only sharper.", text: "Designers and writers draft every post. You approve in one shared place before anything goes live.", details: ["Brand-matched designs", "Captions and hashtags written", "Approve or comment in one click"] },
  { tag: "Publish", title: "Post at the hour", em: "they are scrolling.", text: "We schedule across every channel at times your followers are most active, and we reply as comments arrive.", details: ["Scheduled across all channels", "Replies within working hours", "Leads sent to your inbox or CRM"] },
  { tag: "Grow", title: "Keep what works,", em: "drop what does not.", text: "Each month we read the numbers with you and shift effort toward the posts that bring enquiries.", details: ["Reach, saves and clicks tracked", "Monthly review call", "Next month planned from results"] },
];

const RELATED: RelatedServiceItem[] = [
  { to: "/services/web-development", title: "Web development", text: "Fast, search-friendly websites and portals.", img: "/new-images/services/webdev/related-web-development.webp" },
  { to: "/services/seo", title: "SEO services", text: "Rank higher and get found on Google.", img: "/new-images/services/webdev/related-seo.webp" },
  { to: "/services/ecommerce", title: "E-commerce stores", text: "Online stores built to turn traffic into orders.", img: "/new-images/services/webdev/related-ecommerce.webp" },
  { to: "/services/digital-marketing", title: "Digital marketing", text: "Multi-channel campaigns that convert visitors.", img: "/new-images/services/webdev/related-custom-software.webp" },
];

const STAGES: {
  title: string;
  when: string;
  phase: string;
  text: string;
  deliverables: string[];
  chip: string;
  img: string;
}[] = [
  {
    title: "Audit & competitor gap",
    when: "Week 1",
    phase: "Stage 01",
    text: "We review your profiles, top 5 competitors, best-performing formats, and customer questions to build your bespoke content strategy.",
    deliverables: ["Full profile & competitor audit", "Content pillar & tone guidelines", "Growth baseline & target metrics"],
    chip: "Audit & Strategy Approved ✓",
    img: "1522071820081-009f0129c71c",
  },
  {
    title: "Brand look & templates",
    when: "Week 2",
    phase: "Stage 02",
    text: "Custom Figma and Canva templates, colour palettes, typography rules, and caption hooks tailored specifically to your brand.",
    deliverables: ["Custom post & carousel templates", "Visual grid design aesthetic", "Hook & storytelling formulas"],
    chip: "12 Custom Templates Ready 🎨",
    img: "1558655146-9f40138edfeb",
  },
  {
    title: "Weekly create & approve",
    when: "Every week",
    phase: "Stage 03",
    text: "Designers draft your carousels, writers craft persuasive copy, and editors cut reels. You approve everything in one simple link before it goes live.",
    deliverables: ["Ready-to-post feed & reel batches", "One-click review & feedback tool", "Zero surprises before scheduling"],
    chip: "Weekly Batch Approved 🚀",
    img: "1492691527719-9d1e07e534b4",
  },
  {
    title: "Publish & real-time engage",
    when: "Daily rhythm",
    phase: "Stage 04",
    text: "Posts are scheduled for your followers' peak scrolling hours. Our team monitors and responds to comments, mentions, and DMs within minutes.",
    deliverables: ["Multi-platform automated scheduling", "< 15 min reply window for leads", "Story polls & active community engagement"],
    chip: "< 15 Min Lead Replies 💬",
    img: "1611162616475-46b635cb6868",
  },
  {
    title: "Monthly ROI report & refine",
    when: "Every 30 days",
    phase: "Stage 05",
    text: "We review genuine metrics—reach lift, saves, website visits, and inbound leads—and double down on top-performing creative angles.",
    deliverables: ["Transparent plain-English analytics", "Top creative & reel performance debrief", "Sharper content plan for month ahead"],
    chip: "+248% Organic Reach Lift 📈",
    img: "1551288049-bebda4e38f71",
  },
];

/* ---------- page ---------- */
export default function SocialMedia() {
  const rootRef = useRef<HTMLDivElement>(null);
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
      { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)", fine: "(hover: hover) and (pointer: fine)" },
      (ctx) => {
        const { motion, wide, fine } = ctx.conditions as unknown as { motion: boolean; wide: boolean; fine: boolean };
        if (!motion) return;
        const off: Array<() => void> = [];

        /* number counter: reads data-to / data-suf / data-fmt */
        const count = (el: HTMLElement, vars: gsap.TweenVars = {}) => {
          const to = Number(el.dataset.to);
          const o = { v: 0 };
          const write = () => {
            el.textContent = (el.dataset.fmt === "k" ? `${(o.v / 1000).toFixed(1)}k` : String(Math.round(o.v))) + (el.dataset.suf || "");
          };
          write();
          gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", ...vars, onUpdate: write });
        };

        /* pinned copy sizes itself to its tallest step */
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

        /* ================= HERO: entrance & visual parallax ================= */
        {
          const visual = one(".sm-hero__visual");
          const illus = one(".sm-hero__illustration");

          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from($(".sm-hero .breadcrumb"), { y: 14, autoAlpha: 0, duration: 0.5, clearProps: "all" })
            .from($(".sm-hero__title .sm-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
            .from($(".sm-hero__lead, .sm-hero__cta > *, .sm-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.45)
            .from(illus, { y: 36, autoAlpha: 0, scale: 0.96, duration: 1.1, ease: "power3.out", clearProps: "all" }, 0.25);

          if (visual) {
            const st = ScrollTrigger.create({
              trigger: one(".sm-hero"),
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

        if (fine) {
          $(".sm-mag").forEach((b) => {
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
            off.push(() => { b.removeEventListener("pointermove", move); b.removeEventListener("pointerleave", leave); });
          });

          const grid = one(".sm-bento");
          const tiles = $(".sm-tile");
          const spot = (e: PointerEvent) =>
            tiles.forEach((t) => {
              const r = t.getBoundingClientRect();
              t.style.setProperty("--mx", `${e.clientX - r.left}px`);
              t.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
          grid.addEventListener("pointermove", spot);
          off.push(() => grid.removeEventListener("pointermove", spot));
        }

        /* ================= TICKER: speeds up with the scroll ================= */
        {
          const track = one(".wd-tick__track") || one(".sm-marquee__track");
          if (track) {
            const mq = gsap.to(track, { xPercent: -50, repeat: -1, duration: 28, ease: "none" });
            const st = ScrollTrigger.create({
              onUpdate: (s) => {
                mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              },
            });
            off.push(() => {
              mq.kill();
              st.kill();
            });
          }
        }

        /* ============ SCENE (pinned): plan > create > publish > grow ============ */
        {
          const section = one(".sm-scene");
          const steps = $(".sm-sstep");
          const counter = one(".sm-scene__count");
          const cal = one(".sm-lay--cal");
          const create = one(".sm-lay--create");
          const post = one(".sm-lay--post");
          const grow = one(".sm-lay--grow");
          const days = $(".sm-cal-day");
          const chips = $(".sm-sched-item");
          const line = one(".sm-grow__line");
          const area = one(".sm-grow__area");
          const num = one(".sm-grow__num");
          fitHeight(one(".sm-steps"), steps);

          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set([create, post, grow], { autoAlpha: 0, y: 45, scale: 0.95 });
          gsap.set(days, { scale: 0.85, autoAlpha: 0.4 });
          gsap.set(chips, { autoAlpha: 0, x: 20 });
          gsap.set(line, { strokeDashoffset: 1 });
          gsap.set(area, { autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top top", end: "+=260%", scrub: 1, pin: true, anticipatePin: 1 },
          });
          const swap = (i: number, at: number) =>
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35)
              .call(() => { if (counter) counter.textContent = `0${i + 2} / 04`; }, undefined, at + 0.35)
              .call(() => { if (counter) counter.textContent = `0${i + 1} / 04`; }, undefined, at - 0.01);

          // Phase 0: Plan Calendar illuminates
          tl.to(days, { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.03 }, 0.2);
          swap(0, 2.4);

          // Phase 1: Create Draft Appears
          tl.to(cal, { autoAlpha: 0, scale: 0.92, y: -25, duration: 0.6 }, 2.6)
            .to(create, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 2.9);
          swap(1, 4.6);

          // Phase 2: Auto-Publish & Community Dispatch
          tl.to(create, { autoAlpha: 0, scale: 0.92, y: -25, duration: 0.6 }, 4.8)
            .to(post, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 5.1)
            .to(chips, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.15, ease: "back.out(2)" }, 5.4);
          swap(2, 6.8);

          // Phase 3: Social ROI Growth Engine
          tl.to(post, { autoAlpha: 0, y: -35, scale: 0.92, duration: 0.6 }, 7.0)
            .to(grow, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 7.3)
            .to(line, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 7.6)
            .to(area, { autoAlpha: 1, duration: 0.8 }, 8.2)
            .fromTo(num, { textContent: 0 }, { textContent: 248, duration: 1.6, snap: { textContent: 1 }, ease: "power2.out" }, 7.6)
            .to({}, { duration: 0.8 });
        }

        /* ============ PROCESS: animated dashed line scrub & node activation ============ */
        {
          const tlWrap = one(".sm-tl");
          const fill = one(".sm-tl__track-fill");
          const beacon = one(".sm-tl__beacon");

          if (tlWrap && fill) {
            ScrollTrigger.create({
              trigger: tlWrap,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
              onUpdate: (self) => {
                const pct = self.progress * 100;
                gsap.set(fill, { height: `${pct}%` });
                if (beacon) {
                  gsap.set(beacon, {
                    top: `${pct}%`,
                    autoAlpha: self.progress > 0.01 ? 1 : 0,
                  });
                }
              },
            });
          }

          $(".sm-st").forEach((st) => {
            const dot = one(".sm-st__dot", st);
            const media = one(".sm-st__media", st);
            const img = one("img", media);

            if (dot) {
              ScrollTrigger.create({
                trigger: st,
                start: "top 62%",
                end: "bottom 38%",
                toggleClass: { targets: dot, className: "on" },
              });
            }

            if (media) {
              gsap.fromTo(
                media,
                { clipPath: "inset(0 0 100% 0 round 28px)" },
                {
                  clipPath: "inset(0 0 0% 0 round 28px)",
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: st,
                    start: "top 80%",
                    end: "top 45%",
                    scrub: true,
                  },
                }
              );
            }

            if (img) {
              gsap.fromTo(
                img,
                { scale: 1.2, yPercent: -6 },
                {
                  scale: 1,
                  yPercent: 6,
                  ease: "none",
                  scrollTrigger: {
                    trigger: st,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              );
            }
          });
        }

        /* ============ light reveal ============ */
        {
          const reveals = $("[data-reveal]");
          gsap.set(reveals, { autoAlpha: 0, y: 32 });
          ScrollTrigger.batch(reveals, { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", clearProps: "all" }) });
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

  
  const DAYS_DATA = [
    { day: 1, type: "", title: "" },
    { day: 2, type: "reel", title: "Autumn Reel" },
    { day: 3, type: "", title: "" },
    { day: 4, type: "post", title: "Coffee Guide" },
    { day: 5, type: "", title: "" },
    { day: 6, type: "", title: "" },
    { day: 7, type: "offer", title: "Flat 20% Deal" },
    { day: 8, type: "", title: "" },
    { day: 9, type: "story", title: "Cafe BTS" },
    { day: 10, type: "", title: "" },
    { day: 11, type: "reel", title: "Latte Art" },
    { day: 12, type: "", title: "" },
    { day: 13, type: "post", title: "Weekend Vibe" },
    { day: 14, type: "", title: "" },
  ];

  

  return (
    <>
      <Seo
        title="Social Media Marketing Company in Indore | Sipher Webtech"
        description="Social media management for Instagram, Facebook, LinkedIn and YouTube: strategy, posts, reels, paid campaigns, community replies and monthly reports from Sipher Webtech."
      />
      <div className="sm" ref={rootRef}>
        {/* ============ HERO ============ */}
        <section className="sm-hero" aria-labelledby="sm-h1">
          <div className="container sm-hero__grid">
            <div className="sm-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Social Media</span>
              </nav>
              <p className="eyebrow"><span />Social Media Marketing</p>
              <h1 id="sm-h1" className="sm-hero__title" aria-label="Posts people save, share and come back for.">
                <span className="sm-line" aria-hidden="true"><Words text="Posts people save," /></span>
                <em className="sm-line" aria-hidden="true"><Words text="share and come back for." /></em>
              </h1>
              <p className="sm-hero__lead">
                We plan, design and publish content for your brand, answer the comments, and report on what it brings in,
                so your pages work as hard as your shop does.
              </p>
              <div className="sm-hero__cta">
                <Link className="button button--primary sm-mag sm-hero__main" to="/contact" data-cursor="START">
                  <span>Grow my social pages</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="sm-ghost sm-mag" onClick={() => jump("sm-scene")}>See our monthly cycle</button>
              </div>
              <ul className="sm-hero__trust">
                {["Accounts stay in your name", "Posts approved by you", "Monthly reports"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="sm-hero__visual" aria-hidden="true">
              <img
                className="sm-hero__illustration"
                src="/svg/sipher-social-media-marketing.svg"
                alt="Social Media Marketing Command Centre"
                width={740}
                height={710}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="wd-tick sm-marquee" aria-hidden="true">
          <div className="wd-tick__track sm-marquee__track">
            {[0, 1].map((g) => (
              <div className="wd-tick__group sm-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ============ PINNED SCENE ============ */}
        <section className="sm-scene" id="sm-scene" aria-label="Our monthly social media cycle">
          <div className="container sm-scene__grid">
            <div className="sm-scene__copy">
              <h2 className="sm-sr">How a month of social media works</h2>
              <div className="sm-steps">
                {SCENE.map((s) => (
                  <div className="sm-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="sm-sstep__list">{s.details.map((d) => <li key={d}>{d}</li>)}</ul>
                  </div>
                ))}
              </div>
              <p className="sm-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="sm-stage" aria-hidden="true">
              {/* Layer 1: PLAN (Content Calendar) */}
              <div className="sm-lay sm-lay--cal sm-card-mockup">
                <div className="sm-card__header">
                  <div className="sm-card__dots"><span /><span /><span /></div>
                  <span className="sm-card__title">October Content Roadmap</span>
                  <span className="sm-badge sm-badge--green">✓ 18 Scheduled</span>
                </div>
                <div className="sm-cal__toolbar">
                  <div className="sm-cal__filter">
                    <span className="active">All (18)</span>
                    <span>Reels (8)</span>
                    <span>Carousels (6)</span>
                  </div>
                  <span className="sm-cal__client-tag">Indore Cafe Campaign</span>
                </div>
                <div className="sm-cal__weekdays">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="sm-cal__grid">
                  {DAYS_DATA.map((d) => (
                    <div className={`sm-cal-day${d.type ? " is-active" : ""}`} key={d.day}>
                      <span className="sm-cal-date">{d.day}</span>
                      {d.type && (
                        <div className={`sm-cal-pill sm-pill--${d.type}`}>
                          <span>{d.type.toUpperCase()}</span>
                          <p>{d.title}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="sm-card__footer">
                  <span className="sm-footer-meta">
                    <Check size={14} className="sm-chk-green" /> 100% Client approved before scheduling
                  </span>
                </div>
              </div>

              {/* Layer 2: CREATE (Creative Studio Feed Review) */}
              <div className="sm-lay sm-lay--create sm-card-mockup">
                <div className="sm-card__header">
                  <div className="sm-card__dots"><span /><span /><span /></div>
                  <span className="sm-card__title">Creative Studio · Draft Approval</span>
                  <span className="sm-badge sm-badge--amber">Review Needed</span>
                </div>
                <div className="sm-create__feed-card">
                  <div className="sm-feed__user">
                    <div className="sm-feed__avatar" />
                    <div className="sm-feed__meta">
                      <b>sipher.cafe</b>
                      <span>Indore · Sponsored</span>
                    </div>
                    <span className="sm-feed__badge">Verified</span>
                  </div>
                  <div className="sm-feed__photo-box">
                    <Photo id="1533750349088-cd871a92f312" w={560} h={360} alt="Cafe Autumn Brew" />
                    <div className="sm-feed__overlay-tags">
                      <span className="sm-tag-pill"><Heart size={13} fill="currentColor" /> 1,840</span>
                      <span className="sm-tag-pill"><MessageSquare size={13} /> 128</span>
                      <span className="sm-tag-pill">🔖 492 saves</span>
                    </div>
                  </div>
                  <div className="sm-feed__body">
                    <p><b>sipher.cafe</b> Monsoon craft brew is finally here. Slow-roasted single origin beans, handcrafted with care. Tap to reserve your table. ☕✨</p>
                    <span className="sm-feed__audio">🎵 Sipher Audio · Original Brand Sound</span>
                  </div>
                </div>
                <div className="sm-create__actions">
                  <button type="button" className="sm-btn-approve">
                    <Check size={15} /> Approve & Schedule
                  </button>
                  <button type="button" className="sm-btn-edit">
                    Request Revision
                  </button>
                </div>
              </div>

              {/* Layer 3: PUBLISH (Omni-Channel Auto-Dispatch) */}
              <div className="sm-lay sm-lay--post sm-card-mockup">
                <div className="sm-card__header">
                  <div className="sm-card__dots"><span /><span /><span /></div>
                  <span className="sm-card__title">Omni-Channel Auto-Scheduler</span>
                  <span className="sm-badge sm-badge--live">● Live Sync</span>
                </div>
                <div className="sm-sched-list">
                  <div className="sm-sched-item">
                    <div className="sm-sched-icon ig"><BrandSocialIcon name="Instagram" /></div>
                    <div className="sm-sched-info">
                      <b>Instagram Feed & Reel</b>
                      <span>Published 7:30 PM (Peak Activity)</span>
                    </div>
                    <span className="sm-sched-status">Live ✓</span>
                  </div>
                  <div className="sm-sched-item">
                    <div className="sm-sched-icon fb"><BrandSocialIcon name="Facebook" /></div>
                    <div className="sm-sched-info">
                      <b>Facebook Business Page</b>
                      <span>Published 7:35 PM · Synced with Meta Ads</span>
                    </div>
                    <span className="sm-sched-status">Live ✓</span>
                  </div>
                  <div className="sm-sched-item">
                    <div className="sm-sched-icon in"><BrandSocialIcon name="LinkedIn" /></div>
                    <div className="sm-sched-info">
                      <b>LinkedIn & YouTube Shorts</b>
                      <span>Queued for tomorrow morning 8:15 AM</span>
                    </div>
                    <span className="sm-sched-status queued">Queued ⏱</span>
                  </div>
                </div>
                <div className="sm-inbox-preview">
                  <div className="sm-inbox-header">
                    <span>⚡ Real-Time Community Response</span>
                    <b>Avg. 3m reply</b>
                  </div>
                  <div className="sm-inbox-chat">
                    <div className="sm-chat-bubble customer">
                      <p>"Can we book outdoor tables for this Saturday evening?"</p>
                      <span>19:32</span>
                    </div>
                    <div className="sm-chat-bubble brand">
                      <p>"Yes! Table reserved for you. Look forward to hosting you!"</p>
                      <span>19:35 · Replied by Sipher Team ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 4: GROW (Social ROI Engine) */}
              <div className="sm-lay sm-lay--grow sm-card-mockup">
                <div className="sm-card__header">
                  <div className="sm-card__dots"><span /><span /><span /></div>
                  <span className="sm-card__title">Growth Engine · Monthly ROI</span>
                  <span className="sm-badge sm-badge--green">Verified GA4</span>
                </div>
                <div className="sm-grow__kpi-hero">
                  <div>
                    <span className="sm-grow__sub">Total Organic Reach Lift</span>
                    <b className="sm-grow__big">+<span className="sm-grow__num">248</span>%</b>
                  </div>
                  <span className="sm-grow__peak">↑ 48.2k Monthly Reach</span>
                </div>
                <div className="sm-grow__chart-box">
                  <svg viewBox="0 0 400 150" fill="none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sm-chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffe401" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#ffe401" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ffe401" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path className="sm-grow__grid-line" d="M0 38H400M0 76H400M0 114H400" />
                    <path className="sm-grow__area" fill="url(#sm-chart-fill)" d="M0 140 C50 135 90 125 140 100 S220 70 280 40 S350 14 400 6 V150 H0 Z" />
                    <path className="sm-grow__line" pathLength={1} d="M0 140 C50 135 90 125 140 100 S220 70 280 40 S350 14 400 6" />
                    <circle className="sm-grow__dot" cx="400" cy="6" r="5" />
                  </svg>
                </div>
                <div className="sm-grow__metrics">
                  <div className="sm-metric">
                    <span>Profile Visits</span>
                    <b>12,480 <em>+185%</em></b>
                  </div>
                  <div className="sm-metric">
                    <span>Content Saves</span>
                    <b>3,420 <em>+310%</em></b>
                  </div>
                  <div className="sm-metric">
                    <span>Inbound Enquiries</span>
                    <b>148 DMs <em>3.2x</em></b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SERVICES ============ */}
        <section className="sm-section" aria-labelledby="sm-serv-h">
          <div className="container">
            <Head center eyebrow="What we do" lead="Everything your pages need, handled by one team that knows your business.">
              <span id="sm-serv-h">One team for the whole <em>feed.</em></span>
            </Head>
            <div className="sm-bento">
              {SERVICES.map(({ Icon, title, text, tags, badge, wide }, idx) => (
                <article
                  className={`sm-tile${wide ? " sm-tile--wide" : ""}`}
                  key={title}
                  data-reveal
                >
                  <div className="sm-tile__top">
                    <span className="sm-tile__icon">
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <div className="sm-tile__top-right">
                      {badge && <span className="sm-tile__pill">{badge}</span>}
                      <span className="sm-tile__no" aria-hidden="true">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="sm-tile__body">
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>

                  <div className="sm-tile__bottom">
                    <ul className="sm-tile__tags">
                      {tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <span className="sm-tile__arrow" aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="sm-section sm-proc" aria-labelledby="sm-proc-h">
          <div className="container">
            <Head center eyebrow="How we work" lead="A steady rhythm, so you always know what is going live and why.">
              <span id="sm-proc-h">From first audit to <em>monthly review.</em></span>
            </Head>
            <div className="sm-tl">
              {/* Animated middle vertical dashed track */}
              <div className="sm-tl__track-wrap" aria-hidden="true">
                <div className="sm-tl__track-base" />
                <div className="sm-tl__track-fill" />
                <div className="sm-tl__beacon">
                  <span className="sm-tl__beacon-pulse" />
                  <span className="sm-tl__beacon-core" />
                </div>
              </div>
              {STAGES.map((s, i) => (
                <article className={`sm-st${i % 2 ? " sm-st--flip" : ""}`} key={s.title}>
                  <span className="sm-st__dot" aria-hidden="true" />
                  
                  <div className="sm-st__card" data-reveal>
                    <span className="sm-st__ghost-no" aria-hidden="true">0{i + 1}</span>
                    <div className="sm-st__top">
                      <span className="sm-st__phase">{s.phase}</span>
                      <span className="sm-st__when">{s.when}</span>
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul className="sm-st__deliverables">
                      {s.deliverables.map((d) => (
                        <li key={d}>
                          <span className="sm-st__check" aria-hidden="true">
                            <Check size={13} strokeWidth={2.8} />
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sm-st__media" data-reveal>
                    <Photo id={s.img} w={760} h={560} alt={s.title} />
                    <span className="sm-st__badge">{s.chip}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RelatedServicesSection
          items={RELATED}
          lead="Social media works best alongside a complete digital setup. Pick a service below to see how it fits."
        />
      </div>
    </>
  );
}