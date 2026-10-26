import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  Clapperboard,
  Heart,
  Megaphone,
  MessageCircle,
  PenTool,
  Plus,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/social-media.css";

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

const STATEMENT =
  "A social page is a shop window that never closes. We fill it with posts your customers recognise, reply to the people who knock, and measure what brings them through the door.";

const SERVICES: { Icon: LucideIcon; title: string; text: string; wide?: boolean }[] = [
  { Icon: CalendarDays, title: "Strategy & content calendar", text: "A month of posts planned around your offers, festivals and customer questions, so you never stare at a blank page.", wide: true },
  { Icon: PenTool, title: "Posts & carousels", text: "Designed in your brand colours, with captions written in your voice." },
  { Icon: Clapperboard, title: "Reels & short video", text: "Shot, cut and captioned for the scroll, in Hindi, English or both." },
  { Icon: Megaphone, title: "Paid campaigns", text: "Meta and LinkedIn ads with a clear budget, audience and goal.", wide: true },
  { Icon: Users, title: "Community replies", text: "Comments and DMs answered quickly, with leads passed to your team." },
  { Icon: BarChart3, title: "Monthly reports", text: "Plain-language numbers: reach, saves, enquiries and what we change next." },
];

const SCENE = [
  { tag: "Plan", title: "Pick the days,", em: "then the posts.", text: "We map a month around your launches, offers and customer questions, with each post given a job.", details: ["Goals and audience agreed first", "A calendar you can edit", "Mix of posts, reels and stories"] },
  { tag: "Create", title: "Make it look like", em: "you, only sharper.", text: "Designers and writers draft every post. You approve in one shared place before anything goes live.", details: ["Brand-matched designs", "Captions and hashtags written", "Approve or comment in one click"] },
  { tag: "Publish", title: "Post at the hour", em: "they are scrolling.", text: "We schedule across every channel at times your followers are most active, and we reply as comments arrive.", details: ["Scheduled across all channels", "Replies within working hours", "Leads sent to your inbox or CRM"] },
  { tag: "Grow", title: "Keep what works,", em: "drop what does not.", text: "Each month we read the numbers with you and shift effort toward the posts that bring enquiries.", details: ["Reach, saves and clicks tracked", "Monthly review call", "Next month planned from results"] },
];

const STATS = [
  { to: 248, suf: "%", label: "Typical reach lift in 90 days" },
  { to: 12, suf: "k", label: "Followers gained for a local café" },
  { to: 3, suf: "x", label: "More enquiries from one reel series" },
  { to: 24, suf: "h", label: "Longest wait for a reply" },
];

const STAGES = [
  { title: "Audit & goals", when: "Week 1", text: "We review your pages, competitors and customers, then agree on what success looks like.", img: "1522071820081-009f0129c71c" },
  { title: "Brand look & voice", when: "Week 2", text: "Templates, colours and a tone of voice, so every post feels like the same business.", img: "1558655146-9f40138edfeb" },
  { title: "Create & approve", when: "Every week", text: "A batch of posts and reels is drafted and sent to you for quick approval.", img: "1492691527719-9d1e07e534b4" },
  { title: "Publish & engage", when: "Daily", text: "Scheduled posts go out, and our team answers comments and messages.", img: "1611162616475-46b635cb6868" },
  { title: "Report & refine", when: "Monthly", text: "A short report and review call, then a sharper plan for the month ahead.", img: "1551288049-bebda4e38f71" },
];

const FAQ = [
  { q: "Which platforms do you manage?", a: "Instagram, Facebook, LinkedIn, YouTube, WhatsApp Business, X, Pinterest and Google Business Profile. We suggest two or three that fit your customers instead of spreading thin." },
  { q: "How many posts do we get each month?", a: "Plans usually include 12 to 30 posts, reels and stories. We set the number after the audit, based on your goals and how much video you want." },
  { q: "Do you handle paid ads too?", a: "Yes. We run Meta and LinkedIn campaigns with a budget you set. Ad spend is paid by you directly to the platform, and our management fee is shown separately." },
  { q: "Will you create the photos and videos?", a: "We can use your own photos, shoot on site in Indore, or design from stock. Reels are scripted, shot and edited by our team." },
  { q: "How soon will we see results?", a: "Most pages show steadier reach in the first month. Enquiries and follower growth usually build over two to three months. We report honestly on both." },
  { q: "Who owns the accounts and content?", a: "You do. Every account stays in your name, and we are added as managers. If we part ways, you keep everything." },
];

/* ---------- FAQ row ---------- */
function FaqItem({ q, a, id, open, onToggle }: { q: string; a: string; id: string; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    const el = ref.current;
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
    <div className={`sm-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="sm-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={ref}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function SocialMedia() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(0);

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

        /* ============ HERO: one orchestrated entrance, then calm loops ============ */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from($(".sm-crumb, .sm-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
          .from($(".sm-hero__title .sm-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".sm-hero__lead, .sm-hero__cta > *, .sm-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
          .from(one(".sm-blob"), { scale: 0, rotation: -40, duration: 1.2, ease: "back.out(1.5)", clearProps: "all" }, 0.15)
          .from($(".sm-fl"), { y: 80, autoAlpha: 0, scale: 0.85, rotation: (i) => (i % 2 ? 8 : -8), duration: 1, stagger: 0.15, ease: "back.out(1.4)", clearProps: "all" }, 0.35);

        $(".sm-count").forEach((el) => count(el, { delay: 1.1 }));
        gsap.fromTo(one(".sm-spark__line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, delay: 1, ease: "power2.inOut" });
        gsap.fromTo(one(".sm-story__bar i"), { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "none", repeat: -1, delay: 1 });
        gsap.to($(".sm-post, .sm-story, .sm-stat, .sm-heart"), { y: "+=14", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.5, from: "random" } });
        gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 2 })
          .to(one(".sm-heart svg"), { scale: 1.5, duration: 0.25, ease: "back.out(3)" })
          .to(one(".sm-heart svg"), { scale: 1, duration: 0.35 })
          .fromTo($(".sm-burst i"), { scale: 0, autoAlpha: 1, x: 0, y: 0 }, { scale: 1, autoAlpha: 0, x: (i) => Math.cos(i * 1.05) * 38, y: (i) => Math.sin(i * 1.05) * 38 - 10, duration: 0.8, stagger: 0.02, ease: "power2.out" }, 0);

        gsap.to(one(".sm-hero__visual"), { yPercent: -6, ease: "none", scrollTrigger: { trigger: one(".sm-hero"), start: "top top", end: "bottom top", scrub: true } });

        if (fine) {
          const hero = one(".sm-hero");
          const layers = $(".sm-fl__in").map((el) => ({
            qx: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            qy: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            d: Number(el.dataset.depth || 1),
          }));
          const mv = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.qx(nx * 44 * l.d);
              l.qy(ny * 30 * l.d);
            });
          };
          hero.addEventListener("pointermove", mv);
          off.push(() => hero.removeEventListener("pointermove", mv));

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

        /* ============ MARQUEE: speeds up with scroll velocity ============ */
        {
          const mq = gsap.to(one(".sm-marquee__track"), { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
            },
          });
        }

        /* ============ STATEMENT: words light up as you scroll ============ */
        {
          const words = $(".sm-sw");
          gsap.set(words, { opacity: 0.16 });
          gsap.to(words, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: one(".sm-statement p"), start: "top 82%", end: "bottom 45%", scrub: true } });
        }

        /* ============ SCENE (pinned): plan > create > publish > grow ============ */
        {
          const section = one(".sm-scene");
          const steps = $(".sm-sstep");
          const counter = one(".sm-scene__count");
          const cal = one(".sm-lay--cal");
          const post = one(".sm-lay--post");
          const grow = one(".sm-lay--grow");
          const days = $(".sm-day");
          const marks = $(".sm-day.is-on");
          const chips = $(".sm-sched");
          const line = one(".sm-grow__line");
          const area = one(".sm-grow__area");
          const num = one(".sm-grow__num");
          fitHeight(one(".sm-steps"), steps);

          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set([post, grow], { autoAlpha: 0, y: 50, scale: 0.94 });
          gsap.set(days, { scale: 0.7, autoAlpha: 0.35 });
          gsap.set(chips, { autoAlpha: 0, x: 24 });
          gsap.set(line, { strokeDashoffset: 1 });
          gsap.set(area, { autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top top", end: "+=400%", scrub: 1, pin: true, anticipatePin: 1 },
          });
          const swap = (i: number, at: number) =>
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35)
              .call(() => { counter.textContent = `0${i + 2} / 04`; }, undefined, at + 0.35)
              .call(() => { counter.textContent = `0${i + 1} / 04`; }, undefined, at - 0.01);

          tl.to(days, { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.04 }, 0.2)
            .to(marks, { scale: 1.12, duration: 0.3, stagger: 0.12, yoyo: true, repeat: 1 }, 1.4);
          swap(0, 2.6);
          tl.to(cal, { autoAlpha: 0, scale: 0.9, x: -50, duration: 0.7 }, 3)
            .to(post, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }, 3.2);
          swap(1, 4.8);
          tl.to(chips, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.2, ease: "back.out(2)" }, 5.4);
          swap(2, 7);
          tl.to(post, { autoAlpha: 0, y: -40, scale: 0.92, duration: 0.6 }, 7.2)
            .to(grow, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 7.5)
            .to(line, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 8)
            .to(area, { autoAlpha: 1, duration: 0.8 }, 8.6)
            .fromTo(num, { textContent: 0 }, { textContent: 248, duration: 1.6, snap: { textContent: 1 }, ease: "power2.out" }, 8)
            .to({}, { duration: 0.8 });
        }

        /* ============ STATS ============ */
        $(".sm-num").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => count(el) }));

        /* ============ PROCESS: line draws, photos unmask ============ */
        {
          gsap.fromTo(one(".sm-tl__line i"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: one(".sm-tl"), start: "top 60%", end: "bottom 70%", scrub: true } });
          $(".sm-st").forEach((st) => {
            const dot = one(".sm-st__dot", st);
            const media = one(".sm-st__media", st);
            const img = one("img", media);
            ScrollTrigger.create({ trigger: st, start: "top 62%", onEnter: () => dot.classList.add("on"), onLeaveBack: () => dot.classList.remove("on") });
            gsap.fromTo(media, { clipPath: "inset(0 0 100% 0 round 26px)" }, { clipPath: "inset(0 0 0% 0 round 26px)", ease: "power2.out", scrollTrigger: { trigger: st, start: "top 80%", end: "top 40%", scrub: true } });
            gsap.fromTo(img, { scale: 1.25, yPercent: -8 }, { scale: 1, yPercent: 8, ease: "none", scrollTrigger: { trigger: st, start: "top bottom", end: "bottom top", scrub: true } });
          });
        }

        /* ============ CTA ============ */
        gsap.from(one(".sm-cta"), { scale: 0.94, ease: "none", scrollTrigger: { trigger: one(".sm-cta"), start: "top 95%", end: "top 50%", scrub: true } });
        $(".sm-cta__fl").forEach((el) =>
          gsap.fromTo(el, { yPercent: 20 * Number(el.dataset.speed || 1) }, { yPercent: -30 * Number(el.dataset.speed || 1), ease: "none", scrollTrigger: { trigger: one(".sm-cta"), start: "top bottom", end: "bottom top", scrub: true } })
        );

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

  const DAYS = Array.from({ length: 14 }, (_, i) => i + 1);
  const ON: Record<number, string> = { 2: "Post", 4: "Reel", 7: "Offer", 9: "Story", 11: "Reel", 13: "Post" };

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
              <nav className="sm-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">Social Media</span>
              </nav>
              <p className="eyebrow"><span />Social Media Marketing</p>
              <h1 id="sm-h1" className="sm-hero__title" aria-label="Posts people save, share and come back for.">
                <span className="sm-line" aria-hidden="true"><Words text="Posts people save," /></span>
                <span className="sm-line" aria-hidden="true"><Words text="share and" /></span>
                <em className="sm-line" aria-hidden="true"><Words text="come back for." /></em>
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
              <span className="sm-blob" />
              <div className="sm-fl sm-fl--post">
                <div className="sm-fl__in" data-depth="1">
                  <article className="sm-post">
                    <header><i /><b>sipher.cafe</b></header>
                    <div className="sm-post__ph"><Photo id="1504674900247-0877df9cc836" w={520} h={620} eager /></div>
                    <footer>
                      <Heart size={18} /><MessageCircle size={18} /><Send size={18} /><Bookmark size={18} className="sm-push" />
                    </footer>
                    <p><b className="sm-count" data-to="12400" data-fmt="k">12.4k</b> likes</p>
                  </article>
                </div>
              </div>
              <div className="sm-fl sm-fl--story">
                <div className="sm-fl__in" data-depth="1.6">
                  <div className="sm-story">
                    <span className="sm-story__bar"><i /></span>
                    <Photo id="1517836357463-d25dfeac3438" w={360} h={640} eager />
                    <b>New class today</b>
                  </div>
                </div>
              </div>
              <div className="sm-fl sm-fl--stat">
                <div className="sm-fl__in" data-depth="1.3">
                  <div className="sm-stat">
                    <small>Reach this month</small>
                    <b><span className="sm-count" data-to="248" data-suf="%">248%</span> <TrendingUp size={16} /></b>
                    <svg viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
                      <path className="sm-spark__line" pathLength={1} d="M2 36 C20 34 30 24 48 26 S74 12 90 14 S110 4 118 3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="sm-fl sm-fl--heart">
                <div className="sm-fl__in" data-depth="2">
                  <div className="sm-heart">
                    <Heart size={20} fill="currentColor" />
                    <span className="sm-burst">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MARQUEE ============ */}
        <div className="sm-marquee" aria-hidden="true">
          <div className="sm-marquee__track">
            {[0, 1].map((g) => (
              <div className="sm-marquee__group" key={g}>{MARQUEE.map((m) => <span key={m}>{m}</span>)}</div>
            ))}
          </div>
        </div>

        {/* ============ STATEMENT ============ */}
        <section className="sm-statement">
          <div className="container">
            <p aria-label={STATEMENT}>
              {STATEMENT.split(" ").map((w, i) => <span className="sm-sw" key={i} aria-hidden="true">{w} </span>)}
            </p>
          </div>
        </section>

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
              <div className="sm-lay sm-lay--cal">
                <p>October plan</p>
                <div className="sm-days">
                  {DAYS.map((d) => (
                    <span className={`sm-day${ON[d] ? " is-on" : ""}`} key={d}>{d}{ON[d] && <em>{ON[d]}</em>}</span>
                  ))}
                </div>
              </div>
              <div className="sm-lay sm-lay--post">
                <article className="sm-post sm-post--big">
                  <header><i /><b>sipher.cafe</b></header>
                  <div className="sm-post__ph"><Photo id="1533750349088-cd871a92f312" w={560} h={460} /></div>
                  <p><b>Monsoon menu is here.</b> Tap to book a table.</p>
                </article>
                <div className="sm-scheds">
                  <span className="sm-sched"><Check size={13} />Instagram · 7:30 pm</span>
                  <span className="sm-sched"><Check size={13} />Facebook · 7:35 pm</span>
                  <span className="sm-sched"><Check size={13} />LinkedIn · Tomorrow</span>
                </div>
              </div>
              <div className="sm-lay sm-lay--grow">
                <p>Reach vs last month</p>
                <b className="sm-grow__big">+<span className="sm-grow__num">248</span>%</b>
                <svg viewBox="0 0 300 130" fill="none" preserveAspectRatio="none">
                  <path className="sm-grow__area" d="M0 120 C40 112 70 100 110 80 S170 60 210 40 S270 14 300 6 V130 H0 Z" />
                  <path className="sm-grow__line" pathLength={1} d="M0 120 C40 112 70 100 110 80 S170 60 210 40 S270 14 300 6" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SERVICES ============ */}
        <section className="sm-section" aria-labelledby="sm-serv-h">
          <div className="container">
            <Head eyebrow="What we do" lead="Everything your pages need, handled by one team that knows your business.">
              <span id="sm-serv-h">One team for the whole <em>feed.</em></span>
            </Head>
            <div className="sm-bento">
              {SERVICES.map(({ Icon, title, text, wide }) => (
                <article className={`sm-tile${wide ? " sm-tile--wide" : ""}`} key={title} data-reveal>
                  <span className="sm-tile__icon"><Icon aria-hidden="true" size={22} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ STATS ============ */}
        <section className="sm-stats" aria-label="Sample results">
          <div className="container sm-stats__grid">
            {STATS.map((s) => (
              <div key={s.label}>
                <b><span className="sm-num" data-to={s.to} data-suf={s.suf}>{s.to}{s.suf}</span></b>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="sm-stats__note">Examples from past projects. Results vary by business and budget.</p>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="sm-section sm-proc">
          <div className="container">
            <Head eyebrow="How we work" lead="A steady rhythm, so you always know what is going live and why.">
              From first audit to <em>monthly review.</em>
            </Head>
            <div className="sm-tl">
              <span className="sm-tl__line"><i /></span>
              {STAGES.map((s, i) => (
                <article className={`sm-st${i % 2 ? " sm-st--flip" : ""}`} key={s.title}>
                  <span className="sm-st__dot" aria-hidden="true" />
                  <div className="sm-st__copy">
                    <span className="sm-st__when">{s.when}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                  <div className="sm-st__media"><Photo id={s.img} w={760} h={560} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="sm-section sm-faq" aria-labelledby="sm-faq-h">
          <div className="container sm-faq__grid">
            <div className="sm-faq__side">
              <Head eyebrow="Questions we hear often">
                <span id="sm-faq-h">Clear answers <em>before you sign.</em></span>
              </Head>
              <Link className="sm-faq__link" to="/contact"><span>Ask our team</span><ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
            <div className="sm-faq__list">
              {FAQ.map((f, i) => (
                <FaqItem key={f.q} id={`sm-faq-${i}`} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="sm-cta-sec" id="sm-contact">
          <div className="container">
            <div className="sm-cta">
              <div className="sm-cta__copy">
                <p className="eyebrow"><span />Start the conversation</p>
                <h2>Ready for a feed that <em>earns its place?</em></h2>
                <p>Share your pages and goals. We will send a free audit and a first-month plan.</p>
                <Link className="sm-cta__btn sm-mag" to="/contact" data-cursor="START">
                  <span>Get a free social audit</span>
                  <ArrowUpRight aria-hidden="true" size={20} />
                </Link>
              </div>
              <div className="sm-cta__stage" aria-hidden="true">
                <div className="sm-cta__fl sm-cta__fl--1" data-speed="1"><div className="sm-post-mini"><Photo id="1611162616475-46b635cb6868" w={300} h={300} /></div></div>
                <div className="sm-cta__fl sm-cta__fl--2" data-speed="1.8"><span className="sm-pill"><Heart size={14} fill="currentColor" />1,284 new likes</span></div>
                <div className="sm-cta__fl sm-cta__fl--3" data-speed="1.3"><div className="sm-post-mini"><Photo id="1492691527719-9d1e07e534b4" w={300} h={300} /></div></div>
                <div className="sm-cta__fl sm-cta__fl--4" data-speed="2.2"><span className="sm-pill sm-pill--ink"><MessageCircle size={14} />New enquiry</span></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}