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
  Phone,
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
        all: "all",
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 900px)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motion, wide, fine } = ctx.conditions as unknown as { motion: boolean; wide: boolean; fine: boolean };
        if (!motion) {
          const frame = root.querySelector<HTMLElement>(".ma-demo__fit");
          const stage = root.querySelector<HTMLElement>(".ma-demo__stage");
          const screens = Array.from(root.querySelectorAll<HTMLElement>(".ma-demo__screen"));
          const route = root.querySelector<SVGPathElement>(".ma-demo__route");
          const routeBase = root.querySelector<SVGPathElement>(".ma-demo__route-base");
          const rider = root.querySelector<SVGGElement>(".ma-demo__rider");
          if (frame && stage && screens.length === 4 && route && routeBase && rider) {
            const resize = () => stage.style.setProperty("--ma-demo-scale", `${Math.min(1, frame.clientWidth / 600)}`);
            const observer = new ResizeObserver(resize);
            observer.observe(frame);
            resize();
            const point = routeBase.getPointAtLength(routeBase.getTotalLength() * 0.62);
            gsap.set(screens, { autoAlpha: 0 });
            gsap.set(screens[2], { autoAlpha: 1, x: 0 });
            gsap.set(route, { strokeDasharray: "100 100", strokeDashoffset: 0 });
            gsap.set(rider, { autoAlpha: 1 });
            rider.setAttribute("transform", `translate(${point.x} ${point.y})`);
            root.querySelectorAll(".ma-hdots i").forEach((dot, index) => dot.classList.toggle("on", index === 2));
            return () => observer.disconnect();
          }
          return;
        }

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
          .from(one(".ma-demo__phone"), { y: 44, autoAlpha: 0, duration: 1, ease: "power3.out", clearProps: "all" }, 0.3)
          .from($(".ma-float"), { y: 40, autoAlpha: 0, scale: 0.9, duration: 0.8, stagger: 0.14, ease: "back.out(1.5)", clearProps: "all" }, 0.95);

        /* The supplied SVG phone scene cycles through discovery, checkout, tracking, and chat. */
        {
          const hero = one(".ma-hero");
          const stage = one<HTMLElement>(".ma-demo__stage");
          const stageFrame = one<HTMLElement>(".ma-demo__fit");
          const tilt = one<HTMLElement>(".ma-demo__tilt");
          const screens = $(".ma-demo__screen");
          const dots = $(".ma-hdots i");
          const route = one<SVGPathElement>(".ma-demo__route");
          const routeBase = one<SVGPathElement>(".ma-demo__route-base");
          const rider = one<SVGGElement>(".ma-demo__rider");
          const routeLength = routeBase.getTotalLength();
          const progress = { value: 0 };
          const setRider = (amount: number) => {
            const point = routeBase.getPointAtLength(amount * routeLength);
            rider.setAttribute("transform", `translate(${point.x} ${point.y})`);
          };
          const setDot = (n: number) => dots.forEach((d, k) => d.classList.toggle("on", k === n));

          const resizeStage = () => {
            const scale = Math.min(1, stageFrame.clientWidth / 600);
            stage.style.setProperty("--ma-demo-scale", `${scale}`);
          };
          const resizeObserver = new ResizeObserver(resizeStage);
          resizeObserver.observe(stageFrame);
          resizeStage();
          setRider(0);
          gsap.set(route, { strokeDasharray: "100 100", strokeDashoffset: 100 });
          gsap.set($(".ma-demo__screen").slice(1), { autoAlpha: 0, x: 24 });
          gsap.set(screens[0], { autoAlpha: 1, x: 0 });
          gsap.set($(".ma-demo__badge"), { scale: 0 });
          gsap.set($(".ma-demo__tap"), { autoAlpha: 0 });
          gsap.set($(".ma-demo__success"), { autoAlpha: 0 });
          gsap.set(rider, { autoAlpha: 0 });
          gsap.set($(".ma-demo__messages > *"), { autoAlpha: 0 });
          gsap.set($(".ma-float--notif, .ma-float--offline"), { autoAlpha: 0 });
          gsap.set($(".ma-demo__platform"), { autoAlpha: 0 });
          const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3, defaults: { ease: "power3.out" } });

          if (motion) {
            const discover = screens[0];
            const checkout = screens[1];
            const tracking = screens[2];
            const chat = screens[3];
            loop
              .set(screens.slice(1), { autoAlpha: 0, x: 24 }, 0)
              .set(discover, { autoAlpha: 1, x: 0 }, 0)
              .set(route, { strokeDashoffset: 100 }, 0)
              .set(progress, { value: 0 }, 0)
              .set($(".ma-demo__badge"), { scale: 0 }, 0)
              .set($(".ma-demo__success"), { autoAlpha: 0 }, 0)
              .set($(".ma-demo__messages > *"), { autoAlpha: 0 }, 0)
              .set($(".ma-float--notif, .ma-float--offline"), { autoAlpha: 0 }, 0)
              .call(() => setRider(0), undefined, 0)
              .from($(".ma-demo__greeting, .ma-demo__search, .ma-demo__chips span"), { y: 14, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, 0.1)
              .from($(".ma-demo__food"), { y: 30, autoAlpha: 0, duration: 0.7 }, 0.45)
              .fromTo($(".ma-demo__tap"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, 1.5)
              .to($(".ma-demo__add"), { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, 1.75)
              .to($(".ma-demo__add"), { backgroundColor: "#0B1B3F", duration: 0.2 }, 1.8)
              .to($(".ma-demo__tap"), { autoAlpha: 0, scale: 1.6, duration: 0.3 }, 1.85)
              .to($(".ma-demo__badge"), { scale: 1, duration: 0.4, ease: "back.out(3)" }, 1.85)
              .to(discover, { autoAlpha: 0, x: -24, duration: 0.4, ease: "power2.in" }, 2.9)
              .to(checkout, { autoAlpha: 1, x: 0, duration: 0.5 }, 3)
              .from($(".ma-demo__checkout-head, .ma-demo__row, .ma-demo__total, .ma-demo__upi, .ma-demo__pay"), { y: 12, autoAlpha: 0, stagger: 0.09, duration: 0.45 }, 3.15)
              .to($(".ma-demo__pay"), { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 }, 4.6)
              .to($(".ma-demo__success"), { autoAlpha: 1, duration: 0.3 }, 5)
              .from($(".ma-demo__success-fill"), { scale: 0.6, svgOrigin: "48 48", duration: 0.5, ease: "back.out(2)" }, 5)
              .to($(".ma-demo__success-ring"), { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 5.05)
              .to($(".ma-demo__success-check"), { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 5.55)
              .from($(".ma-demo__success-copy"), { y: 10, autoAlpha: 0, duration: 0.4 }, 5.7)
              .to(checkout, { autoAlpha: 0, x: -24, duration: 0.4, ease: "power2.in" }, 6.9)
              .to(tracking, { autoAlpha: 1, x: 0, duration: 0.5 }, 7)
              .from($(".ma-demo__track-pill"), { y: -16, autoAlpha: 0, duration: 0.5 }, 7.2)
              .from($(".ma-demo__sheet"), { y: 80, autoAlpha: 0, duration: 0.7 }, 7.2)
              .from($(".ma-demo__pickup"), { scale: 0, svgOrigin: "60 270", duration: 0.4, ease: "back.out(3)" }, 7.4)
              .to(route, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 7.6)
              .from($(".ma-demo__destination"), { scale: 0, svgOrigin: "215 138", duration: 0.45, ease: "back.out(2.4)" }, 8.5)
              .to(rider, { autoAlpha: 1, duration: 0.25 }, 7.7)
              .fromTo(progress, { value: 0 }, { value: 0.66, duration: 2.6, ease: "power1.inOut", onUpdate: () => setRider(progress.value) }, 7.8)
              .from($(".ma-demo__bar b"), { scaleX: 0, stagger: 0.25, duration: 0.5, ease: "power2.out" }, 8)
              .fromTo($(".ma-float--notif"), { autoAlpha: 0, y: 14, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, 8.4)
              .to($(".ma-float--notif"), { autoAlpha: 0, y: -8, duration: 0.3 }, 10.4)
              .to(tracking, { autoAlpha: 0, x: -24, duration: 0.4, ease: "power2.in" }, 10.6)
              .to(chat, { autoAlpha: 1, x: 0, duration: 0.5 }, 10.7)
              .fromTo($(".ma-demo__message--one"), { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, 11.2)
              .fromTo($(".ma-demo__message--two"), { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, 12)
              .fromTo($(".ma-demo__typing"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 12.7)
              .fromTo($(".ma-demo__typing i"), { y: 0 }, { y: -4, duration: 0.28, stagger: 0.12, repeat: 4, yoyo: true, ease: "sine.inOut" }, 12.7)
              .to($(".ma-demo__typing"), { autoAlpha: 0, height: 0, padding: 0, margin: 0, duration: 0.2 }, 13.6)
              .fromTo($(".ma-demo__message--three"), { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, 13.65)
              .fromTo($(".ma-float--offline"), { autoAlpha: 0, y: 14, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, 12.2)
              .to($(".ma-float--offline"), { autoAlpha: 0, y: -8, duration: 0.3 }, 14.9)
              .to(chat, { autoAlpha: 0, x: -24, duration: 0.4, ease: "power2.in" }, 15.4);
          } else {
            gsap.set(screens, { autoAlpha: 0 });
            gsap.set(screens[2], { autoAlpha: 1, x: 0 });
            gsap.set(route, { strokeDashoffset: 0 });
            gsap.set(rider, { autoAlpha: 1 });
            gsap.set($(".ma-float--notif, .ma-float--offline, .ma-demo__platform"), { autoAlpha: 1 });
            setRider(0.62);
            setDot(2);
          }

          let started = false;
          const pulse = gsap.to($(".ma-demo__pulse"), { scale: 2.2, opacity: 0, svgOrigin: "215 138", duration: 1.8, ease: "power1.out", repeat: -1, paused: true });
          const st = ScrollTrigger.create({
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (!started || document.hidden) return;
              if (self.isActive) {
                loop.play();
                pulse.play();
              } else {
                loop.pause();
                pulse.pause();
              }
            },
          });
          const kick = motion ? gsap.delayedCall(1.8, () => {
            started = true;
            if (st.isActive && !document.hidden) {
              loop.play();
              pulse.play();
            }
          }) : null;
          const visibilityChange = () => {
            if (document.hidden || !st.isActive) {
              loop.pause();
              pulse.pause();
            } else if (started) {
              loop.play();
              pulse.play();
            }
          };
          document.addEventListener("visibilitychange", visibilityChange);
          off.push(() => {
            resizeObserver.disconnect();
            document.removeEventListener("visibilitychange", visibilityChange);
          });
          off.push(() => {
            kick?.kill();
            loop.kill();
            pulse.kill();
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
          const tilt = one(".ma-demo__tilt");
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

        /* ================= SCENE: Sketch planning board ================= */
        {
          const board = one(".ma-scene .board");
          if (board) {
            const steps = $(".ma-scene .step");
            const flowLine = one(".ma-scene .flow-line");
            const nodes = $(".ma-scene .node");
            const grpItems = $(".ma-scene .grp li");
            const v1Badge = one(".ma-scene .v1");
            const meterFill = one(".ma-scene .meter .fill");
            const mustPaths = $(".ma-scene .must li path");
            const runner = one(".ma-scene .runner");

            gsap.set(board, { y: 24, autoAlpha: 0 });
            gsap.set(steps, { y: 14, autoAlpha: 0 });
            gsap.set(flowLine, { scaleX: 0, transformOrigin: "left center" });
            gsap.set(nodes, { scale: 0 });
            gsap.set(grpItems, { autoAlpha: 0, y: 6 });
            gsap.set(v1Badge, { scale: 0.85, autoAlpha: 0 });
            gsap.set(meterFill, { scaleX: 0, transformOrigin: "left center" });
            gsap.set(mustPaths, { strokeDasharray: "24 24", strokeDashoffset: 24 });
            gsap.set(runner, { autoAlpha: 0, left: "12.5%" });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: board,
                start: "top 80%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            tl.to(board, { y: 0, autoAlpha: 1, duration: 0.6 })
              .to(steps, { y: 0, autoAlpha: 1, stagger: 0.18, duration: 0.5 }, 0.3)
              .to(flowLine, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.35)
              .to(nodes, { scale: 1, stagger: 0.25, duration: 0.35, ease: "back.out(2)" }, 0.6)
              .to(grpItems, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.4 }, 1.0)
              .to(v1Badge, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2)" }, 1.4)
              .to(meterFill, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 1.5)
              .to(mustPaths, { strokeDashoffset: 0, stagger: 0.12, duration: 0.4 }, 1.1)
              .fromTo(runner, { autoAlpha: 1, left: "12.5%" }, { left: "87.5%", duration: 1.6, ease: "power1.inOut" }, 0.5)
              .to(runner, { autoAlpha: 0, duration: 0.25 }, 2.15);

            steps.forEach((s, i) => {
              tl.add(() => {
                steps.forEach((x, j) => {
                  x.classList.toggle("on", j === i);
                });
              }, 0.5 + i * 0.53);
            });
            tl.add(() => {
              steps.forEach((x) => x.classList.remove("on"));
            }, 2.5);

            off.push(() => {
              tl.kill();
            });
          }
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
              <div className="ma-demo__fit">
                <div className="ma-demo__stage">
                  <div className="ma-demo__tilt">
                    <div className="ma-demo__phone">
                      <div className="ma-demo__display">
                        <div className="ma-demo__island" />
                        <div className="ma-demo__status"><span>9:41</span><span>100%</span></div>

                        <section className="ma-demo__screen ma-demo__discover">
                          <div className="ma-demo__greeting">
                            <div><small>Good morning</small><b>Hi, Dharmendra</b></div>
                            <div className="ma-demo__bag">
                              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0" /></svg>
                              <span className="ma-demo__badge">1</span>
                            </div>
                          </div>
                          <div className="ma-demo__search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>Search dishes</div>
                          <div className="ma-demo__chips"><span className="is-active">Wraps</span><span>Bowls</span><span>Drinks</span></div>
                          <div className="ma-demo__food">
                            <div className="ma-demo__food-art">
                              <svg viewBox="0 0 220 200" aria-hidden="true">
                                <ellipse cx="110" cy="172" rx="82" ry="10" fill="#B7791F" opacity=".25" />
                                <circle cx="110" cy="98" r="76" fill="#fff" stroke="#F0D9A0" strokeWidth="2" />
                                <g transform="rotate(-24 110 100)">
                                  <rect x="46" y="68" width="128" height="62" rx="31" fill="#E9B866" stroke="#C98F3C" strokeWidth="2" />
                                  <path d="M150 72c12 4 18 18 18 28s-6 24-18 28" fill="#F6D58E" />
                                  <path d="M62 84c14-8 30 8 46 0s30 8 46 0" fill="none" stroke="#5FA35B" strokeWidth="7" strokeLinecap="round" />
                                  <g fill="#FFF7E0"><rect x="70" y="96" width="14" height="12" rx="3" /><rect x="96" y="100" width="14" height="12" rx="3" /><rect x="122" y="96" width="14" height="12" rx="3" /></g>
                                  <path d="M60 118h90" stroke="#C98F3C" strokeWidth="2" strokeLinecap="round" opacity=".6" />
                                </g>
                              </svg>
                            </div>
                            <div className="ma-demo__food-meta"><b>Paneer wrap</b><span>₹189</span></div>
                            <p>Grilled paneer, mint chutney, crunchy slaw</p>
                            <button type="button" className="ma-demo__button ma-demo__add" tabIndex={-1}>Add to cart</button>
                            <span className="ma-demo__tap" />
                          </div>
                        </section>

                        <section className="ma-demo__screen ma-demo__checkout">
                          <div className="ma-demo__checkout-head"><i><ChevronRight size={14} /></i><b>Checkout</b></div>
                          <div className="ma-demo__row"><span>Paneer wrap</span><span>₹189</span></div>
                          <div className="ma-demo__row"><span>Hummus bowl</span><span>₹249</span></div>
                          <div className="ma-demo__row"><span>Delivery and taxes</span><span>₹130</span></div>
                          <div className="ma-demo__total"><small>Total</small><b>₹568</b></div>
                          <div className="ma-demo__upi"><span className="ma-demo__upi-logo">UPI</span><span><b>Pay with UPI</b><small>dharmendra@upi</small></span><i /></div>
                          <button type="button" className="ma-demo__button ma-demo__pay" tabIndex={-1}>Pay ₹568</button>
                          <div className="ma-demo__success">
                            <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
                              <circle className="ma-demo__success-fill" cx="48" cy="48" r="38" fill="#E8F7EE" />
                              <circle className="ma-demo__success-ring" cx="48" cy="48" r="38" pathLength="100" stroke="#16A34A" strokeWidth="5" strokeDasharray="100 100" transform="rotate(-90 48 48)" />
                              <path className="ma-demo__success-check" d="M32 49l11 11 22-24" pathLength="100" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100 100" />
                            </svg>
                            <div className="ma-demo__success-copy"><b>Order placed</b><small>Paid ₹568 with UPI</small></div>
                          </div>
                        </section>

                        <section className="ma-demo__screen ma-demo__tracking">
                          <div className="ma-demo__map">
                            <svg viewBox="0 0 280 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                              <defs><linearGradient id="ma-demo-route-gradient" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#2563EB" /><stop offset="1" stopColor="#1D4ED8" /></linearGradient></defs>
                              <rect width="280" height="330" fill="#EAF1FB" />
                              <g fill="#F5F8FD"><rect x="0" y="100" width="64" height="70" rx="8" /><rect x="82" y="100" width="82" height="58" rx="8" /><rect x="196" y="100" width="90" height="44" rx="8" /><rect x="0" y="186" width="64" height="50" rx="8" /><rect x="196" y="186" width="90" height="48" rx="8" /><rect x="82" y="212" width="82" height="50" rx="8" /><rect x="0" y="252" width="64" height="60" rx="8" /><rect x="196" y="252" width="90" height="60" rx="8" /></g>
                              <rect x="196" y="150" width="90" height="30" rx="8" fill="#DCEFE4" />
                              <path d="M0 296c50-14 90 10 150-4s100-12 130-4v50H0z" fill="#CFE0F7" />
                              <g fill="none" stroke="#fff" strokeLinecap="round"><path d="M0 178h280M0 244h280M73 90v230M180 90v230" strokeWidth="11" /><path d="M0 160L280 130M123 178v66" strokeWidth="5" /></g>
                              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path className="ma-demo__route-base" d="M60 270C60 238 100 244 108 218C116 192 76 186 108 166C140 146 215 176 215 138" stroke="#fff" strokeWidth="9" />
                                <path d="M60 270C60 238 100 244 108 218C116 192 76 186 108 166C140 146 215 176 215 138" stroke="#2563EB" strokeOpacity=".18" strokeWidth="4.5" />
                                <path className="ma-demo__route" d="M60 270C60 238 100 244 108 218C116 192 76 186 108 166C140 146 215 176 215 138" pathLength="100" stroke="url(#ma-demo-route-gradient)" strokeWidth="4.5" strokeDasharray="100 100" />
                              </g>
                              <g className="ma-demo__pickup"><circle cx="60" cy="270" r="11" fill="#fff" /><circle cx="60" cy="270" r="5.5" fill="#0B1B3F" /><circle cx="60" cy="270" r="2" fill="#F5B83D" /></g>
                              <g className="ma-demo__destination"><circle className="ma-demo__pulse" cx="215" cy="138" r="10" fill="#2563EB" opacity=".4" /><path d="M215 138c-10-12-17-20-17-29a17 17 0 0 1 34 0c0 9-7 17-17 29z" fill="#2563EB" /><circle cx="215" cy="109" r="7" fill="#fff" /><path d="m211.5 109 2.7 2.7 5-5.5" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
                              <g className="ma-demo__rider"><circle r="11" fill="#fff" /><circle r="7" fill="#F5B83D" /><circle r="2.4" fill="#0B1B3F" /></g>
                            </svg>
                          </div>
                          <div className="ma-demo__track-pill"><i><ChevronRight size={13} /></i>Track order<em>Live</em></div>
                          <div className="ma-demo__sheet">
                            <small>Estimated arrival</small><h3>Arriving in 12 min</h3>
                            <div className="ma-demo__bar"><i><b /></i><i><b /></i><i><b className="is-partial" /></i><i /></div>
                            <p>Your rider has picked up the order</p>
                            <div className="ma-demo__rider-card"><span className="ma-demo__avatar">S</span><div><b>Shreyansh</b><small>Delivery partner</small></div>
                              <div className="ma-demo__actions"><i><Phone size={15} /></i><i><MessageCircle size={15} /></i></div>
                            </div>
                          </div>
                        </section>

                        <section className="ma-demo__screen ma-demo__chat">
                          <div className="ma-demo__chat-head"><span className="ma-demo__avatar">S</span><div><b>Shreyansh</b><small>Online</small></div></div>
                          <div className="ma-demo__messages">
                            <div className="ma-demo__bubble ma-demo__message--one">I&apos;ve picked up your order.</div>
                            <div className="ma-demo__bubble ma-demo__bubble--out ma-demo__message--two">Please call when you reach the gate.</div>
                            <div className="ma-demo__bubble ma-demo__typing"><i /><i /><i /></div>
                            <div className="ma-demo__bubble ma-demo__message--three">Will do. About 12 minutes away.</div>
                          </div>
                          <div className="ma-demo__compose"><span>Message Shreyansh</span><i><ArrowRight size={16} /></i></div>
                        </section>
                      </div>
                    </div>
                  </div>
                  <div className="ma-hdots"><i className="on" /><i /><i /><i /></div>

                  <div className="ma-float ma-float--notif">
                    <div className="ma-card-mini">
                      <span className="ma-card-mini__icon"><Bell size={17} /></span>
                      <div><b>Your order is on the way</b><small>Rider arrives in 12 min</small></div>
                    </div>
                  </div>
                  <div className="ma-float ma-float--offline"><div className="ma-pill"><WifiOff size={14} />Works without signal</div></div>
                  <div className="ma-float ma-float--stores ma-demo__platform"><div className="ma-pill ma-pill--ink">Android · iOS</div></div>
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

        {/* ===================== SKETCH PLANNING BOARD ===================== */}
        <section className="ma-scene" id="ma-scene" aria-label="Planning board: how we sketch your app">
          <div className="ma-scene__bg" aria-hidden="true" />
          <div className="container ma-scene__grid">
            <div className="ma-scene__copy">
              <p className="eyebrow"><span />Sketch</p>
              <h2>Start with the screens, <em>not the code.</em></h2>
              <p>We sketch the key journeys with your team first, so everyone agrees what the app does before anything is built.</p>
              <ul className="ma-deliver">
                <li>
                  <span className="ic" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </span>
                  <span>User journeys and screen flow</span>
                </li>
                <li>
                  <span className="ic" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </span>
                  <span>Features ranked: must-have or later</span>
                </li>
                <li>
                  <span className="ic" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22V4" /><path d="M4 4h13l-2.5 4.5L17 13H4" />
                    </svg>
                  </span>
                  <span>A clear scope for version one</span>
                </li>
              </ul>
            </div>

            <div className="ma-scene__stage">
              <div className="board" role="group" aria-label="Illustrative planning board: a sample screen flow and feature priorities">
                <span className="v1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 22V4" /><path d="M4 4h13l-2.5 4.5L17 13H4" />
                  </svg>
                  Version 1 scope
                </span>
                <div className="bh">
                  <b>Plan board</b>
                  <small>Sample flow</small>
                </div>

                <div className="flow">
                  <div className="flow-line" aria-hidden="true" />
                  <span className="runner" aria-hidden="true" />
                  <span className="node n1" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </span>
                  <span className="node n2" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </span>
                  <span className="node n3" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </span>

                  <div className="step">
                    <div className="scr" aria-hidden="true">
                      <i className="dot" />
                      <i className="bar m" style={{ alignSelf: "center" }} />
                      <i className="blk" style={{ height: 9 }} />
                      <i className="blk" style={{ height: 9 }} />
                      <i className="btn" />
                    </div>
                    <span>Sign in</span>
                  </div>

                  <div className="step">
                    <div className="scr" aria-hidden="true">
                      <i className="bar s" />
                      <i className="blk" style={{ height: 9 }} />
                      <div className="grid2">
                        <i className="blk" />
                        <i className="blk" />
                        <i className="blk" />
                        <i className="blk" />
                      </div>
                    </div>
                    <span>Home</span>
                  </div>

                  <div className="step">
                    <div className="scr" aria-hidden="true">
                      <i className="blk" style={{ height: 34 }} />
                      <i className="bar m" />
                      <i className="bar s" />
                      <i className="btn" />
                    </div>
                    <span>Details</span>
                  </div>

                  <div className="step">
                    <div className="scr" aria-hidden="true">
                      <i className="ok">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </i>
                      <i className="bar m" style={{ alignSelf: "center" }} />
                      <i className="bar s" style={{ alignSelf: "center" }} />
                    </div>
                    <span>Confirmed</span>
                  </div>
                </div>

                <div className="prio">
                  <div className="grp must">
                    <h3>Must-have <i>In V1</i></h3>
                    <ul>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        User authentication
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Core user action
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Basic profile or account
                      </li>
                    </ul>
                  </div>

                  <div className="grp later">
                    <h3>Later <i>After V1</i></h3>
                    <ul>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                        </svg>
                        Advanced personalization
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                        </svg>
                        Additional integrations
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                        </svg>
                        Nice-to-have enhancements
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="meter">
                  <span>Version 1</span>
                  <i className="track" aria-hidden="true"><b className="fill" /></i>
                  <span>3 of 6 sample features</span>
                </div>
              </div>
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