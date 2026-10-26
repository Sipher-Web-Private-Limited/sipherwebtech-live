import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  ChevronRight,
  CreditCard,
  Fingerprint,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/mobile-app-development.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Unsplash has no tech logos, so logos come from the Devicon CDN */
const dev = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`;

/* Photo hides itself if an Unsplash id ever 404s, so layouts never show a broken-image icon */
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

/* word-mask reveal: each word sits in an overflow-hidden mask so it can slide up */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="ma-w">
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
    <div className={`ma-head${center ? " ma-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="ma-title">{children}</h2>
      {lead && <p className="ma-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const MARQUEE = [
  "Android apps",
  "iOS apps",
  "Flutter",
  "React Native",
  "Offline-first",
  "Push notifications",
  "Store publishing",
];

const SCENE = [
  {
    tag: "Sketch",
    title: "Start with the screens,",
    em: "not the code.",
    text: "We sketch the key journeys with your team first, so everyone agrees what the app does before anything is built.",
    details: ["User journeys and screen flow", "Features ranked: must-have or later", "A clear scope for version one"],
  },
  {
    tag: "Design",
    title: "Give it a look",
    em: "people trust.",
    text: "Real colours, type and photos turn the sketch into a clickable design you can test with customers.",
    details: ["Android and iOS design guidelines", "Readable type and easy tap sizes", "A clickable prototype for your own phone"],
  },
  {
    tag: "Build",
    title: "Build once,",
    em: "run on both.",
    text: "Flutter or React Native for shared code, native modules where the phone demands it, all connected to a secure API.",
    details: ["One codebase, platform-level polish", "Offline mode and push notifications", "Tested on real devices every sprint"],
  },
  {
    tag: "Publish",
    title: "Ship it to the stores,",
    em: "and keep it fresh.",
    text: "We prepare the listings, handle submission and review, then watch crashes and ship updates after launch.",
    details: ["Play Store and App Store submission", "Crash and performance monitoring", "Updates and new features on a care plan"],
  },
];

type AppDef = {
  name: string;
  type: string;
  text: string;
  chips: string[];
  screen: { head: string; photo: string; wallet?: boolean; rows: [string, string][]; cta: string };
};

const APPS: AppDef[] = [
  {
    name: "Booking apps",
    type: "Fitness, salons, clinics",
    text: "Let customers pick a slot, pay and get reminders without a phone call.",
    chips: ["Calendar", "Reminders", "Payments"],
    screen: {
      head: "Book a class",
      photo: "1517836357463-d25dfeac3438",
      rows: [["Yoga flow", "7:00 am · 6 spots"], ["Strength", "6:30 pm · 3 spots"], ["Mobility", "8:00 pm · 9 spots"], ["Spin", "Sat · 8:00 am"]],
      cta: "Reserve spot",
    },
  },
  {
    name: "Delivery & ordering",
    type: "Food, grocery, retail",
    text: "Menus, carts, live order tracking and rider updates in one smooth flow.",
    chips: ["Live tracking", "Offers", "Rider app"],
    screen: {
      head: "Track order",
      photo: "1504674900247-0877df9cc836",
      rows: [["Order packed", "Kitchen · 6:42 pm"], ["Rider assigned", "Picked up 6:50 pm"], ["On the way", "Arriving soon"], ["Delivered", "Rate your meal"]],
      cta: "Call rider",
    },
  },
  {
    name: "Learning apps",
    type: "Institutes and academies",
    text: "Lessons, quizzes, attendance and progress for students on any phone.",
    chips: ["Video lessons", "Quizzes", "Progress"],
    screen: {
      head: "My courses",
      photo: "1524178232363-1fb2b075b655",
      rows: [["Lesson 3 · Arrays", "12 min · video"], ["Quiz · Loops", "5 questions"], ["Assignment", "Due Friday"], ["Live class", "Mon · 5:00 pm"]],
      cta: "Continue lesson",
    },
  },
  {
    name: "Payment & wallet apps",
    type: "Billing and fintech",
    text: "Secure payments, receipts and balances, with biometric sign-in.",
    chips: ["UPI & cards", "Receipts", "Biometric login"],
    screen: {
      head: "Wallet",
      photo: "1556742049-0cfed4f6a45d",
      wallet: true,
      rows: [["Electricity bill", "₹1,240 · due 25th"], ["Mobile recharge", "₹399 · paid"], ["Fee instalment", "₹4,500 · due 1st"], ["Cashback", "₹120 earned"]],
      cta: "Pay now",
    },
  },
  {
    name: "Field team apps",
    type: "Logistics and service teams",
    text: "Jobs, routes, check-ins and proof of work, even with patchy signal.",
    chips: ["Offline sync", "GPS check-in", "Photo proof"],
    screen: {
      head: "Today’s jobs",
      photo: "1586528116311-ad8dd3c8310d",
      rows: [["Visit 1 · Site check", "10:00 am"], ["Visit 2 · Delivery", "12:30 pm"], ["Visit 3 · Install", "3:00 pm"], ["Report", "Sync pending"]],
      cta: "Check in",
    },
  },
  {
    name: "Healthcare apps",
    type: "Clinics and hospitals",
    text: "Appointments, reports and reminders that patients can find in seconds.",
    chips: ["Appointments", "Reports", "Reminders"],
    screen: {
      head: "Appointments",
      photo: "1519494026892-80bbd2d6fd0d",
      rows: [["Dr. Sharma", "Tomorrow · 10:30 am"], ["Lab test", "Fri · 12:00 pm"], ["Follow-up", "Next week"], ["Reports", "2 new"]],
      cta: "Book a visit",
    },
  },
];

const PLATFORMS = [
  {
    name: "Cross-platform",
    tools: "Flutter · React Native",
    best: "Most business apps, MVPs and tight timelines",
    text: "One codebase ships to Android and iOS, so you launch sooner and every fix lands on both at once.",
    watch: "A few very device-specific features may need small native modules.",
    bars: [["Speed to market", 90], ["Native feel", 80], ["Budget fit", 88], ["Hardware depth", 68]] as [string, number][],
  },
  {
    name: "Native",
    tools: "Kotlin · Swift",
    best: "Graphics-heavy apps, deep hardware use, or one platform only",
    text: "Separate Android and iOS apps give the finest control over performance and each platform’s newest features.",
    watch: "Two codebases mean more build time and a larger budget.",
    bars: [["Speed to market", 55], ["Native feel", 98], ["Budget fit", 50], ["Hardware depth", 98]] as [string, number][],
  },
  {
    name: "Web app (PWA)",
    tools: "React · Laravel",
    best: "Quick launches, internal tools and content-led products",
    text: "Runs in the phone’s browser and can sit on the home screen, with no store review and one place to update.",
    watch: "Limited access to some phone features, and no store presence.",
    bars: [["Speed to market", 95], ["Native feel", 55], ["Budget fit", 92], ["Hardware depth", 45]] as [string, number][],
  },
];

const FEATURES: { Icon: LucideIcon; title: string; text: string; wide?: boolean }[] = [
  { Icon: Bell, title: "Push notifications", text: "Order updates, reminders and offers that reach people when it matters, with controls to keep them useful.", wide: true },
  { Icon: WifiOff, title: "Offline mode", text: "Screens and data stay usable without signal, then sync quietly when the network returns.", wide: true },
  { Icon: Fingerprint, title: "Secure sign-in", text: "Fingerprint, face unlock and OTP, with encrypted storage." },
  { Icon: CreditCard, title: "In-app payments", text: "UPI, cards and wallets through trusted gateways." },
  { Icon: MapPin, title: "Maps & live location", text: "Tracking, geofencing and nearby search." },
  { Icon: MessageCircle, title: "Chat & support", text: "In-app messaging and help for your customers." },
  { Icon: Camera, title: "Camera & scanning", text: "Photo upload, QR and barcode scanning." },
  { Icon: RefreshCw, title: "Syncs with your systems", text: "Connects to your website, ERP or CRM through APIs." },
];

const STAGES = [
  {
    title: "Discover & plan",
    when: "Week 1",
    text: "We learn who the app is for, what they do on their phones and what must work on day one.",
    gets: ["User and journey map", "Feature list in priority order", "Itemised quote and timeline"],
    img: "1522071820081-009f0129c71c",
  },
  {
    title: "UX & UI design",
    when: "Weeks 2–3",
    text: "Wireframes become a clickable design, so you and your customers can try the app before it exists.",
    gets: ["Clickable prototype", "Android and iOS screen designs", "A design system for future screens"],
    img: "1558655146-9f40138edfeb",
  },
  {
    title: "Build in sprints",
    when: "Two-week sprints",
    text: "Screens, API and admin panel are built together, with a demo on your own phone at the end of every sprint.",
    gets: ["A working build each sprint", "Code in a repository you own", "Admin panel to manage content"],
    img: "1555066931-4365d14bab8c",
  },
  {
    title: "Test on real devices",
    when: "Every sprint, then before launch",
    text: "We test across screen sizes, OS versions and slow networks, and check security and performance before release.",
    gets: ["Device and OS test matrix", "Security and speed review", "Beta build for your team"],
    img: "1512941937669-90a1b58e7e9c",
  },
  {
    title: "Publish & support",
    when: "Launch and beyond",
    text: "We prepare the store listings, handle submission and review feedback, and stay on for fixes and updates.",
    gets: ["Play Store and App Store listings", "Crash and usage monitoring", "A maintenance plan"],
    img: "1556656793-08538906a9f8",
  },
];

type Tech = { name: string; icon: string };

const ROW_A: Tech[] = [
  { name: "Flutter", icon: dev("flutter/flutter-original") },
  { name: "Dart", icon: dev("dart/dart-original") },
  { name: "React Native", icon: dev("react/react-original") },
  { name: "Kotlin", icon: dev("kotlin/kotlin-original") },
  { name: "Swift", icon: dev("swift/swift-original") },
  { name: "Android", icon: dev("android/android-original") },
  { name: "iOS", icon: dev("apple/apple-original") },
  { name: "Figma", icon: dev("figma/figma-original") },
];

const ROW_B: Tech[] = [
  { name: "Laravel", icon: dev("laravel/laravel-original") },
  { name: "Node.js", icon: dev("nodejs/nodejs-original") },
  { name: "PostgreSQL", icon: dev("postgresql/postgresql-original") },
  { name: "MySQL", icon: dev("mysql/mysql-original") },
  { name: "Firebase", icon: dev("firebase/firebase-original") },
  { name: "Docker", icon: dev("docker/docker-original") },
  { name: "Git", icon: dev("git/git-original") },
  { name: "Android Studio", icon: dev("androidstudio/androidstudio-original") },
];

const FAQ = [
  {
    q: "How much does it cost to build a mobile app?",
    a: "It depends on the number of screens, features, user roles and integrations. After a discovery call we send an itemised quote with no hidden charges, and we can phase the build so version one fits your budget.",
  },
  {
    q: "Should we start with Android, iOS or both?",
    a: "If your customers use both, a cross-platform build with Flutter or React Native usually reaches both for less than two separate apps. If most of your users are on one platform, we can launch there first and add the other later.",
  },
  {
    q: "How long does an app take to build?",
    a: "A focused first version often takes two to four months, depending on scope. We work in two-week sprints, so you can try real builds on your own phone long before launch.",
  },
  {
    q: "Do you publish the app to the stores?",
    a: "Yes. We prepare the listings, screenshots and descriptions, submit the app and handle review feedback. The developer accounts stay in your name, and the store fees are paid by you to Google and Apple.",
  },
  {
    q: "Will the app work without internet?",
    a: "It can. We design offline modes for the screens and data that matter, then sync automatically when the connection returns. We confirm which parts need to work offline during discovery.",
  },
  {
    q: "Who owns the code, and what about updates?",
    a: "You own the source code once the project is paid for. Phones and stores change every year, so we offer care plans for OS updates, security fixes and new features.",
  },
  {
    q: "Can the app connect to our website or software?",
    a: "Usually, yes. We build or extend an API so the app can share data with your website, ERP, CRM or payment systems, without anyone entering things twice.",
  },
];

const RELATED = [
  { to: "/services/software-development", title: "Custom software", text: "Business systems, ERP and SaaS platforms.", img: "1461749280684-dccba630e2f6" },
  { to: "/services/ui-ux", title: "UI/UX design", text: "Interfaces that feel obvious and look great.", img: "1558655146-9f40138edfeb" },
  { to: "/services/web-development", title: "Web development", text: "Fast, search-friendly websites and portals.", img: "1498050108023-c5249f4df085" },
  { to: "/services/ecommerce", title: "E-commerce development", text: "Online stores that sell and scale.", img: "1556742049-0cfed4f6a45d" },
];

/* ------------------------------------------------------------------ */
/* Reusable phone content                                              */
/* ------------------------------------------------------------------ */

/* shared app screen: header, scrolling content, pinned call-to-action */
function AppScreen({ s }: { s: AppDef["screen"] }) {
  return (
    <div className="ma-ui">
      <span className="ma-ui__status"><b>9:41</b><b>100%</b></span>
      <div className="ma-ui__head">
        <b>{s.head}</b>
        <i className="ma-ui__avatar" />
      </div>
      <div className="ma-ui__view">
        <div className="ma-ui__scroll">
          {s.wallet ? (
            <div className="ma-ui__card">
              <small>Balance</small>
              <b>₹24,580</b>
              <span>•••• 4021</span>
            </div>
          ) : (
            <div className="ma-ui__photo">
              <Photo id={s.photo} w={420} h={300} />
            </div>
          )}
          {s.rows.map(([a, b]) => (
            <div className="ma-ui__row" key={a}>
              <i />
              <div>
                <b>{a}</b>
                <small>{b}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ma-ui__cta">{s.cta}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ row — height is animated with GSAP, hidden content leaves the   */
/* accessibility tree through visibility                               */
/* ------------------------------------------------------------------ */

function FaqItem({
  q,
  a,
  id,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  id: string;
  open: boolean;
  onToggle: () => void;
}) {
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
    gsap.to(el, {
      height: open ? "auto" : 0,
      autoAlpha: open ? 1 : 0,
      duration: calm ? 0 : 0.55,
      ease: "power3.inOut",
    });
  }, [open]);

  return (
    <div className={`ma-faq__item${open ? " is-open" : ""}`} data-reveal>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <i aria-hidden="true"><Plus size={18} /></i>
        </button>
      </h3>
      <div className="ma-faq__body" id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MobileAppDevelopment() {
  const rootRef = useRef<HTMLDivElement>(null);
  const platFirst = useRef(true);
  const [openFaq, setOpenFaq] = useState(0);
  const [plat, setPlat] = useState(0);

  const jump = (id: string) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  /* platform chooser: bars and copy re-animate on every tab change */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (platFirst.current) {
      platFirst.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ma-bar i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" });
      gsap.fromTo(".ma-plat__body > *", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", clearProps: "all" });
    }, root);
    return () => ctx.revert();
  }, [plat]);

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

        /* pinned text areas size themselves to their tallest slide, so any width or wrap fits */
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

        /* ================= HERO: one orchestrated entrance ================= */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from($(".ma-crumb, .ma-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
          .from($(".ma-hero__title .ma-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".ma-hero__lead, .ma-hero__cta > *, .ma-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
          .from(one(".ma-hero__disc"), { scale: 0, duration: 1.1, ease: "back.out(1.6)", clearProps: "all" }, 0.2)
          .from(one(".ma-hphone"), { y: 90, autoAlpha: 0, duration: 1.2, ease: "power3.out", clearProps: "all" }, 0.3)
          .from($(".ma-float"), { y: 40, autoAlpha: 0, scale: 0.9, duration: 0.8, stagger: 0.14, ease: "back.out(1.5)", clearProps: "all" }, 0.95);

        /* the phone walks through three screens: browse, track, pay */
        {
          const hero = one(".ma-hero");
          const screens = $(".ma-hs");
          const dots = $(".ma-hdots i");
          const route = one<SVGPathElement>(".ma-route");
          const ok = one(".ma-ok");
          const rlen = route.getTotalLength();
          const D = 3.2;
          const setDot = (n: number) => dots.forEach((d, k) => d.classList.toggle("on", k === n));

          gsap.set(screens.slice(1), { autoAlpha: 0 });
          gsap.set(route, { strokeDasharray: rlen, strokeDashoffset: rlen });
          gsap.set(ok, { scale: 0 });

          const loop = gsap.timeline({ paused: true, repeat: -1 });
          loop.call(() => setDot(0), undefined, 0);
          screens.forEach((s, i) => {
            const nextIndex = (i + 1) % screens.length;
            const at = D * (i + 1) - 0.5;
            loop
              .to(s, { autoAlpha: 0, xPercent: -10, duration: 0.5, ease: "power2.in" }, at)
              .fromTo(screens[nextIndex], { autoAlpha: 0, xPercent: 10 }, { autoAlpha: 1, xPercent: 0, duration: 0.6, ease: "power3.out" }, at + 0.15)
              .call(() => setDot(nextIndex), undefined, at + 0.3);
          });
          loop
            .to(route, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, D + 0.3)
            .to(ok, { scale: 1, duration: 0.5, ease: "back.out(2.5)" }, D * 2 + 0.4)
            .set(route, { strokeDashoffset: rlen }, D * 3)
            .set(ok, { scale: 0 }, D * 3)
            .to({}, { duration: 0.01 }, D * 3 + 0.3);

          let started = false;
          const kick = gsap.delayedCall(1.8, () => {
            started = true;
            if (st.isActive) loop.play();
          });
          const st = ScrollTrigger.create({
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (!started) return;
              if (self.isActive) loop.play();
              else loop.pause();
            },
          });
          off.push(() => {
            kick.kill();
            loop.kill();
          });
        }

        /* the whole composition drifts slower than the page */
        gsap.to(one(".ma-hero__visual"), {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: one(".ma-hero"), start: "top top", end: "bottom top", scrub: true },
        });

        if (fine) {
          /* the phone tilts toward the pointer, and each floating card follows at its own depth */
          const hero = one(".ma-hero");
          const tilt = one(".ma-hphone__tilt");
          gsap.set(tilt, { transformPerspective: 1100 });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3" });
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3" });
          const layers = $(".ma-float__in").map((el) => ({
            qx: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            qy: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            d: Number(el.dataset.depth || 1),
          }));
          const mv = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            ry(nx * 18);
            rx(-ny * 12);
            layers.forEach((l) => {
              l.qx(nx * 34 * l.d);
              l.qy(ny * 26 * l.d);
            });
          };
          hero.addEventListener("pointermove", mv);
          off.push(() => hero.removeEventListener("pointermove", mv));

          /* magnetic buttons */
          $(".ma-mag").forEach((b) => {
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

          /* feature tiles: a soft spotlight follows the cursor */
          const grid = one(".ma-feat-grid");
          const tiles = $(".ma-feat");
          const spot = (e: PointerEvent) => {
            tiles.forEach((t) => {
              const r = t.getBoundingClientRect();
              t.style.setProperty("--mx", `${e.clientX - r.left}px`);
              t.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
          };
          grid.addEventListener("pointermove", spot);
          off.push(() => grid.removeEventListener("pointermove", spot));
        }

        /* ================= MARQUEE: speeds up with the scroll ================= */
        {
          const mq = gsap.to(one(".ma-marquee__track"), { xPercent: -50, repeat: -1, duration: 32, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
            },
          });
        }

        /* ================= SCENE: a phone goes from sketch to store ================= */
        {
          const section = one(".ma-scene");
          const steps = $(".ma-sstep");
          const tags = $(".ma-tag");
          const counter = one(".ma-scene__count");
          const wrap = one(".ma-sphone");
          const screen = one(".ma-scr");
          const chips = $(".ma-cchip");
          const rel = one(".ma-rel");
          const ticks = $(".ma-rel__tick");
          const stores = $(".ma-store");
          fitHeight(one(".ma-steps"), steps);

          screen.classList.add("ma-wire");
          off.push(() => screen.classList.remove("ma-wire"));

          gsap.set(wrap, { y: 70, autoAlpha: 0, rotation: -7 });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set(tags, { autoAlpha: 0, y: 14 });
          gsap.set(chips, { autoAlpha: 0, scale: 0.7 });
          gsap.set(rel, { autoAlpha: 0, y: 30, scale: 0.94 });
          gsap.set(ticks, { scale: 0 });
          gsap.set(stores, { autoAlpha: 0, y: 16 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top top", end: "+=420%", scrub: 1, pin: true, anticipatePin: 1 },
          });

          const swap = (i: number, at: number) => {
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35)
              .to(tags[i], { autoAlpha: 0, y: -10, duration: 0.3 }, at)
              .to(tags[i + 1], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.4)
              .call(() => { counter.textContent = `0${i + 2} / 04`; }, undefined, at + 0.35)
              .call(() => { counter.textContent = `0${i + 1} / 04`; }, undefined, at - 0.01);
          };

          /* 1 — sketch: a wireframe phone arrives */
          tl.to(wrap, { y: 0, autoAlpha: 1, duration: 1 }, 0).to(tags[0], { autoAlpha: 1, y: 0, duration: 0.5 }, 0.8);
          swap(0, 2.6);

          /* 2 — design: the wireframe turns into the real screen */
          tl.call(() => screen.classList.add("ma-wire"), undefined, 3.0)
            .call(() => screen.classList.remove("ma-wire"), undefined, 3.01)
            .fromTo($(".ma-b", screen), { scale: 0.96 }, { scale: 1, duration: 0.6, stagger: 0.05 }, 3.05)
            .to(wrap, { rotation: 0, duration: 1.4 }, 3.0);
          swap(1, 5.0);

          /* 3 — build: what sits behind the screen */
          tl.to(chips, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: "back.out(2)" }, 5.5);
          swap(2, 7.4);

          /* 4 — publish: release checklist and store badges */
          tl.to(chips, { autoAlpha: 0, scale: 0.8, duration: 0.4, stagger: 0.08 }, 7.5)
            .to(rel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }, 7.9)
            .to(ticks, { scale: 1, duration: 0.4, stagger: 0.45, ease: "back.out(3)" }, 8.3)
            .to(stores, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15 }, 9.4)
            .to({}, { duration: 0.8 });
        }

        /* ================= GALLERY: phones scroll sideways, screens scroll inside ================= */
        if (wide) {
          const section = one(".ma-gal");
          const track = one(".ma-gal__track");
          const bar = one(".ma-gal__bar i");
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

          const h = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
          });
          gsap.to(bar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
          });

          /* every phone scrolls its own screen as it crosses the viewport */
          $(".ma-slide").forEach((sl) => {
            gsap.fromTo(
              one(".ma-ui__scroll", sl),
              { yPercent: 0 },
              { yPercent: -34, ease: "none", scrollTrigger: { trigger: sl, containerAnimation: h, start: "left 85%", end: "left 15%", scrub: true } }
            );
            gsap.fromTo(
              one(".ma-slide__phone", sl),
              { rotation: 5 },
              { rotation: -5, ease: "none", scrollTrigger: { trigger: sl, containerAnimation: h, start: "left right", end: "right left", scrub: true } }
            );
          });

          /* the whole rail leans into fast scrolling */
          const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${dist()}`,
            onUpdate: (s) => skew(gsap.utils.clamp(-5, 5, s.getVelocity() / -400)),
            onLeave: () => skew(0),
            onLeaveBack: () => skew(0),
          });
        }

        /* ================= PROCESS: cards stack up and shrink back ================= */
        if (wide) {
          const cards = $(".ma-card");
          cards.forEach((c, i) => {
            if (i === cards.length - 1) return;
            gsap.to(c, {
              scale: 0.94,
              ease: "none",
              scrollTrigger: { trigger: cards[i + 1], start: "top 88%", end: "top 24%", scrub: true },
            });
          });
        }

        /* ================= TECH: two rails slide in opposite directions ================= */
        {
          const tech = one(".ma-tech");
          gsap.fromTo(one(".ma-tech__a"), { xPercent: 0 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: tech, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(one(".ma-tech__b"), { xPercent: -22 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: tech, start: "top bottom", end: "bottom top", scrub: true } });
        }

        /* ================= CTA settles in ================= */
        gsap.from(one(".ma-cta"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: one(".ma-cta"), start: "top 95%", end: "top 50%", scrub: true },
        });
        gsap.fromTo(
          one(".ma-cta__phone"),
          { yPercent: 14, rotation: -4 },
          { yPercent: -6, rotation: -10, ease: "none", scrollTrigger: { trigger: one(".ma-cta"), start: "top bottom", end: "bottom top", scrub: true } }
        );

        /* ================= light reveal for list content ================= */
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

  const active = PLATFORMS[plat];

  return (
    <>
      <Seo
        title="Mobile App Development Company in Indore | Sipher Webtech"
        description="Android and iOS app development with Flutter and React Native: design, build, test and store publishing, with offline mode, push notifications and secure APIs. Get a free consultation from Sipher Webtech."
      />

      <div className="ma" ref={rootRef}>
        {/* ============================ HERO ============================ */}
        <section className="ma-hero" aria-labelledby="ma-h1">
          <div className="container ma-hero__grid">
            <div className="ma-hero__copy">
              <nav className="ma-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">Mobile App Development</span>
              </nav>

              <p className="eyebrow"><span />Mobile App Development</p>
              <h1 id="ma-h1" className="ma-hero__title" aria-label="Apps people open every day, not just once after install.">
                <span className="ma-line" aria-hidden="true"><Words text="Apps people open" /></span>
                <span className="ma-line" aria-hidden="true"><Words text="every day, not just" /></span>
                <em className="ma-line" aria-hidden="true"><Words text="once after install." /></em>
              </h1>
              <p className="ma-hero__lead">
                We design and build Android and iOS apps that feel fast, keep working on patchy networks and connect to
                your business, then publish them to the stores for you.
              </p>
              <div className="ma-hero__cta">
                <Link className="button button--primary ma-mag ma-hero__main" to="/contact" data-cursor="START">
                  <span>Talk to our app team</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="ma-ghost ma-mag" onClick={() => jump("ma-scene")}>
                  See how we build
                </button>
              </div>
              <ul className="ma-hero__trust">
                {["Android and iOS", "Store publishing included", "You own the code", "Tested on real devices"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="ma-hero__visual" aria-hidden="true">
              <span className="ma-hero__disc" />
              <span className="ma-hero__dots" />

              <div className="ma-hphone">
                <div className="ma-hphone__tilt">
                  <div className="ma-phone">
                    <i className="ma-phone__notch" />
                    <div className="ma-phone__screen">
                      {/* screen 1: browse */}
                      <div className="ma-hs ma-ui">
                        <span className="ma-ui__status"><b>9:41</b><b>100%</b></span>
                        <div className="ma-ui__head">
                          <div><small>Good morning</small><b>Hi, Aarav</b></div>
                          <i className="ma-ui__avatar" />
                        </div>
                        <div className="ma-ui__search">Search dishes</div>
                        <div className="ma-ui__photo ma-ui__photo--tall">
                          <Photo id="1504674900247-0877df9cc836" w={500} h={400} eager />
                          <span className="ma-ui__tag">Today’s pick</span>
                        </div>
                        <div className="ma-ui__line"><b>Paneer wrap</b><span>₹189</span></div>
                        <div className="ma-ui__chips"><span>Veg</span><span>Quick</span><span>Offers</span></div>
                        <div className="ma-ui__cta">Add to cart</div>
                      </div>

                      {/* screen 2: track */}
                      <div className="ma-hs ma-ui">
                        <span className="ma-ui__status"><b>9:41</b><b>100%</b></span>
                        <div className="ma-ui__head"><b>Track order</b><i className="ma-ui__avatar" /></div>
                        <div className="ma-map">
                          <svg viewBox="0 0 200 150" fill="none" preserveAspectRatio="xMidYMid slice">
                            <path className="ma-route" d="M18 128 C50 128 52 84 86 84 S118 40 150 44 S178 24 184 18" />
                            <circle cx="18" cy="128" r="5" className="ma-route__a" />
                            <circle cx="184" cy="18" r="6" className="ma-route__b" />
                          </svg>
                        </div>
                        <div className="ma-sheet">
                          <b>Arriving in 12 min</b>
                          <span className="ma-sheet__bar"><i /></span>
                          <div className="ma-sheet__rider"><i />Rider is on the way</div>
                        </div>
                      </div>

                      {/* screen 3: pay */}
                      <div className="ma-hs ma-ui">
                        <span className="ma-ui__status"><b>9:41</b><b>100%</b></span>
                        <div className="ma-ui__head"><b>Checkout</b><i className="ma-ui__avatar" /></div>
                        <div className="ma-ui__card">
                          <small>Total</small>
                          <b>₹568</b>
                          <span>UPI · paid securely</span>
                        </div>
                        <div className="ma-ui__row"><i /><div><b>Paneer wrap × 2</b><small>₹378</small></div></div>
                        <div className="ma-ui__row"><i /><div><b>Delivery</b><small>₹40</small></div></div>
                        <div className="ma-ok"><Check size={22} strokeWidth={3} /></div>
                        <div className="ma-ui__cta">Pay now</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ma-hdots"><i className="on" /><i /><i /></div>
              </div>

              <div className="ma-float ma-float--notif">
                <div className="ma-float__in" data-depth="1.4">
                  <div className="ma-card-mini">
                    <span className="ma-card-mini__icon"><Bell size={16} /></span>
                    <div><b>Your order is on the way</b><small>Rider arrives in 12 min</small></div>
                  </div>
                </div>
              </div>
              <div className="ma-float ma-float--offline">
                <div className="ma-float__in" data-depth="1.8">
                  <div className="ma-pill"><WifiOff size={14} />Works without signal</div>
                </div>
              </div>
              <div className="ma-float ma-float--stores">
                <div className="ma-float__in" data-depth="1.1">
                  <div className="ma-pill ma-pill--ink">Android · iOS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="ma-marquee" aria-hidden="true">
          <div className="ma-marquee__track">
            {[0, 1].map((g) => (
              <div className="ma-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ===================== PINNED: SKETCH TO STORE ===================== */}
        <section className="ma-scene" id="ma-scene" aria-label="How we build your app">
          <div className="ma-scene__bg" aria-hidden="true" />
          <div className="container ma-scene__grid">
            <div className="ma-scene__copy">
              <h2 className="ma-sr">How we build your app, step by step</h2>
              <div className="ma-steps">
                {SCENE.map((s) => (
                  <div className="ma-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="ma-sstep__list">
                      {s.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="ma-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="ma-scene__stage" aria-hidden="true">
              <div className="ma-sphone">
                <div className="ma-phone">
                  <i className="ma-phone__notch" />
                  <div className="ma-phone__screen ma-scr">
                    <div className="ma-ui">
                      <span className="ma-ui__status"><b>9:41</b><b>100%</b></span>
                      <div className="ma-ui__head">
                        <b className="ma-b ma-ui__title">Book a class</b>
                        <i className="ma-b ma-ui__avatar" />
                      </div>
                      <div className="ma-b ma-ui__photo ma-ui__photo--tall">
                        <Photo id="1517836357463-d25dfeac3438" w={500} h={400} />
                      </div>
                      <div className="ma-ui__lines"><i className="ma-b" /><i className="ma-b short" /></div>
                      <div className="ma-ui__chips"><span className="ma-b">Yoga</span><span className="ma-b">Strength</span><span className="ma-b">Spin</span></div>
                      <div className="ma-b ma-ui__row"><i /><div><b>Yoga flow</b><small>7:00 am · 6 spots</small></div></div>
                      <div className="ma-b ma-ui__cta">Reserve spot</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ma-tag ma-tag--1">Sketch the journey</div>
              <div className="ma-tag ma-tag--2">Design that feels native</div>
              <div className="ma-tag ma-tag--3">Built once, tested on devices</div>
              <div className="ma-tag ma-tag--4">Ready for the stores</div>

              <div className="ma-cchip ma-cchip--1"><Check size={13} />API connected</div>
              <div className="ma-cchip ma-cchip--2"><Check size={13} />Works offline</div>
              <div className="ma-cchip ma-cchip--3"><Check size={13} />Tests passing</div>

              <div className="ma-rel">
                <p>Release status</p>
                <ul>
                  {["Build uploaded", "Store review", "Live to users"].map((r) => (
                    <li key={r}><span className="ma-rel__tick"><Check size={12} strokeWidth={3} /></span>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="ma-store ma-store--1">Google Play</div>
              <div className="ma-store ma-store--2">App Store</div>
            </div>
          </div>
        </section>

        {/* ===================== GALLERY: PINNED SIDEWAYS ===================== */}
        <section className="ma-gal" id="ma-gallery" aria-labelledby="ma-gal-h">
          <div className="container">
            <Head eyebrow="What we build">
              <span id="ma-gal-h">Apps for every kind of <em>business.</em></span>
            </Head>
          </div>
          <div className="ma-gal__track" role="region" aria-label="Types of app we build" tabIndex={0}>
            {APPS.map((a) => (
              <article className="ma-slide" key={a.name}>
                <div className="ma-slide__phone">
                  <div className="ma-phone" aria-hidden="true">
                    <i className="ma-phone__notch" />
                    <div className="ma-phone__screen">
                      <AppScreen s={a.screen} />
                    </div>
                  </div>
                </div>
                <div className="ma-slide__cap">
                  <p className="ma-slide__type">{a.type}</p>
                  <h3>{a.name}</h3>
                  <p>{a.text}</p>
                  <ul>{a.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
          <div className="ma-gal__meter" aria-hidden="true">
            <span>Sample screens</span>
            <span className="ma-gal__bar"><i /></span>
          </div>
        </section>

        {/* ============================ PLATFORM ============================ */}
        <section className="ma-section ma-platform" aria-labelledby="ma-plat-h">
          <div className="container">
            <Head center eyebrow="Choosing your approach" lead="Not sure whether to go native, cross-platform or web? Start here. We recommend what fits your users, your timeline and your budget.">
              <span id="ma-plat-h">Native, cross-platform or web? <em>Pick what fits.</em></span>
            </Head>

            <div className="ma-plat">
              <div className="ma-plat__tabs" role="tablist" aria-label="App approach">
                {PLATFORMS.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    role="tab"
                    id={`ma-plat-tab-${i}`}
                    aria-selected={plat === i}
                    aria-controls="ma-plat-panel"
                    className={plat === i ? "on" : ""}
                    onClick={() => setPlat(i)}
                  >
                    <b>{p.name}</b>
                    <span>{p.tools}</span>
                  </button>
                ))}
              </div>

              <div className="ma-plat__panel" id="ma-plat-panel" role="tabpanel" aria-labelledby={`ma-plat-tab-${plat}`}>
                <div className="ma-plat__body">
                  <p className="ma-plat__best"><b>Best for</b>{active.best}</p>
                  <p className="ma-plat__text">{active.text}</p>
                  <p className="ma-plat__watch"><b>Keep in mind</b>{active.watch}</p>
                </div>
                <div className="ma-plat__bars">
                  {active.bars.map(([label, v]) => (
                    <div className="ma-bar" key={label} style={{ "--v": v } as CSSProperties}>
                      <span>{label}</span>
                      <em><i /></em>
                    </div>
                  ))}
                  <p className="ma-plat__note">Indicative comparison. Every project is scoped on its own.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ FEATURES ============================ */}
        <section className="ma-section ma-feats" aria-labelledby="ma-feat-h">
          <div className="container">
            <Head eyebrow="What goes inside" lead="The details that make an app feel finished, built in from the first sprint.">
              <span id="ma-feat-h">Everything an app needs, <em>built in.</em></span>
            </Head>
            <div className="ma-feat-grid">
              {FEATURES.map(({ Icon, title, text, wide }) => (
                <article className={`ma-feat${wide ? " ma-feat--wide" : ""}`} key={title} data-reveal>
                  <span className="ma-feat__icon"><Icon aria-hidden="true" size={22} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== PROCESS ============================== */}
        <section className="ma-section ma-proc" id="ma-process">
          <div className="container">
            <Head eyebrow="Idea to store" lead="A clear path with a working build in your hands at every stage.">
              Five stages from <em>idea to home screen.</em>
            </Head>
            <div className="ma-stk">
              {STAGES.map((s, i) => (
                <article
                  className="ma-card"
                  key={s.title}
                  style={{ "--i": i, "--tint": ["#ffffff", "var(--ma-blue)", "var(--ma-soft-yellow)"][i % 3] } as CSSProperties}
                >
                  <div className="ma-card__copy">
                    <span className="ma-card__no" aria-hidden="true">0{i + 1}</span>
                    <div className="ma-card__head">
                      <h3>{s.title}</h3>
                      <span className="ma-card__when">{s.when}</span>
                    </div>
                    <p>{s.text}</p>
                    <ul>
                      {s.gets.map((g) => <li key={g}><Check aria-hidden="true" size={14} />{g}</li>)}
                    </ul>
                  </div>
                  <div className="ma-card__img">
                    <Photo id={s.img} w={800} h={600} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== TECH ============================== */}
        <section className="ma-tech" aria-labelledby="ma-tech-h">
          <div className="container">
            <Head center eyebrow="Our toolkit" lead="Proven tools for the app, the API behind it and the pipeline that ships it.">
              <span id="ma-tech-h">Tools we build apps <em>with.</em></span>
            </Head>
          </div>
          <div className="ma-tech__rows" aria-hidden="true">
            <div className="ma-tech__a ma-tech__row">
              {[...ROW_A, ...ROW_A].map((t, i) => (
                <span className="ma-tech__pill" key={`${t.name}-${i}`}>
                  <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" />
                  {t.name}
                </span>
              ))}
            </div>
            <div className="ma-tech__b ma-tech__row">
              {[...ROW_B, ...ROW_B].map((t, i) => (
                <span className="ma-tech__pill" key={`${t.name}-${i}`}>
                  <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          <p className="ma-sr">
            Mobile: {ROW_A.map((t) => t.name).join(", ")}. Backend and delivery: {ROW_B.map((t) => t.name).join(", ")}.
          </p>
        </section>

        {/* ================================ FAQ ================================ */}
        <section className="ma-section ma-faq" id="ma-faq" aria-labelledby="ma-faq-h">
          <div className="container ma-faq__grid">
            <div className="ma-faq__side">
              <Head eyebrow="Questions we hear often">
                <span id="ma-faq-h">Straight answers <em>before you commit.</em></span>
              </Head>
              <p className="ma-lead">Something not covered here? Tell us about your app idea and we will answer it on the call.</p>
              <Link className="ma-faq__link" to="/contact">
                <span>Ask our team</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="ma-faq__list">
              {FAQ.map((f, i) => (
                <FaqItem
                  key={f.q}
                  id={`ma-faq-${i}`}
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================== RELATED ============================== */}
        <section className="ma-section ma-related">
          <div className="container">
            <Head center eyebrow="Explore other services" lead="A good app works best with the right partners around it. See how these services fit alongside it.">
              Pair it with <em>what comes next</em>
            </Head>
            <div className="ma-rel-grid">
              {RELATED.map((r) => (
                <Link className="ma-relcard" to={r.to} key={r.to} data-reveal>
                  <div className="ma-relcard__media">
                    <Photo id={r.img} w={700} h={520} />
                  </div>
                  <div className="ma-relcard__body">
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="ma-relcard__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ CTA ================================ */}
        <section className="ma-cta-sec" id="ma-contact">
          <div className="container">
            <div className="ma-cta">
              <div className="ma-cta__inner">
                <div className="ma-cta__copy">
                  <p className="eyebrow"><span />Start the conversation</p>
                  <h2>Have an app idea worth <em>putting in pockets?</em></h2>
                  <p>Tell us who it is for and what it should do. We will come back with a plan, a timeline and an itemised quote.</p>
                  <ul className="ma-cta__list">
                    {["Free discovery call", "Itemised quote, no surprises", "Store publishing included"].map((t) => (
                      <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                    ))}
                  </ul>
                  <div className="ma-cta__action">
                    <Link className="ma-cta__btn ma-mag" to="/contact" data-cursor="START">
                      <span>Get a free app quote</span>
                      <ArrowUpRight aria-hidden="true" size={20} />
                    </Link>
                    <p>No obligation.</p>
                  </div>
                </div>

                <div className="ma-cta__stage" aria-hidden="true">
                  <div className="ma-cta__phone">
                    <div className="ma-phone">
                      <i className="ma-phone__notch" />
                      <div className="ma-phone__screen">
                        <div className="ma-ui ma-ui--live">
                          <span className="ma-ui__status"><b>9:41</b><b>100%</b></span>
                          <div className="ma-live__badge"><Check size={26} strokeWidth={3} /></div>
                          <b className="ma-live__title">Your app is live</b>
                          <small className="ma-live__sub">Ready to download</small>
                          <div className="ma-live__stores"><span>Google Play</span><span>App Store</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}