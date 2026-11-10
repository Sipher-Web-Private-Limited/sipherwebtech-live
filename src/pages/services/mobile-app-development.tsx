import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles,
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
import TechStackRibbons from "../../components/TechStackRibbons";
import "../../styles/services/mobile-app-development.css";
import "../../styles/services/service-hero-consistency.css";

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

function PlatformBar({
  label,
  target,
  delay = 0,
  active = true,
}: {
  label: string;
  target: number;
  delay?: number;
  active?: boolean;
}) {
  const barRef = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!active) return;
    const bar = barRef.current;
    const num = numRef.current;
    if (!bar || !num) return;

    const calm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      bar.style.width = `${target}%`;
      num.textContent = `${target}%`;
      return;
    }

    const counter = { val: 0 };
    gsap.killTweensOf(bar);
    gsap.killTweensOf(counter);

    bar.style.width = "0%";
    num.textContent = "0%";

    const tl = gsap.timeline({ delay });

    tl.to(
      bar,
      {
        width: `${target}%`,
        duration: 1.05,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      counter,
      {
        val: target,
        duration: 1.05,
        ease: "power2.out",
        onUpdate: () => {
          if (num) {
            num.textContent = `${Math.round(counter.val)}%`;
          }
        },
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [target, delay, active]);

  return (
    <div className="ma-bar">
      <div className="ma-bar__info">
        <span className="ma-bar__label">{label}</span>
        <span className="ma-bar__val" ref={numRef}>
          0%
        </span>
      </div>
      <em>
        <i ref={barRef} style={{ width: "0%" }} />
      </em>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const MOBILE_RIBBON_LANES = [
  {
    label: "Mobile platforms and core technologies",
    className: "tech-ribbons__lane--technology",
    reverse: false,
    items: [
      "Android apps",
      "iOS apps",
      "Flutter",
      "React Native",
      "Offline-first",
      "Push notifications",
      "Store publishing",
      "Mobile APIs",
    ],
  },
  {
    label: "Mobile disciplines and quality delivery",
    className: "tech-ribbons__lane--disciplines",
    reverse: true,
    items: [
      "UI/UX Design",
      "Real Device Testing",
      "App Store Optimization",
      "Performance",
      "Biometric Auth",
      "Deep Linking",
      "Security",
      "Fast Release",
    ],
  },
] as const;

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
  svg: string;
};

const APPS: AppDef[] = [
  {
    name: "Productivity & Operations",
    type: "Workspaces, ERP & Field Teams",
    text: "Real-time task boards, project milestones, team availability, and business metrics at a glance.",
    chips: ["Task boards", "Milestone tracking", "Team presence"],
    svg: "/svg/ma-productivity-app-ui.svg",
  },
  {
    name: "E-Commerce & Retail",
    type: "D2C Brands, Fashion & Shopping",
    text: "Curated catalogues, smart product search, instant checkout, and promotional flash drops.",
    chips: ["Instant checkout", "Smart search", "Offer drops"],
    svg: "/svg/ma-ecommerce-app-ui.svg",
  },
  {
    name: "Food Delivery & Quick Commerce",
    type: "Restaurants, Cloud Kitchens & Groceries",
    text: "Live menu ordering, dish customization, doorstep delivery estimates, and real-time tracking.",
    chips: ["Live tracking", "Instant dispatch", "Smart reorder"],
    svg: "/svg/ma-food-delivery-app-ui.svg",
  },
  {
    name: "Fintech & Smart Banking",
    type: "Wallets, UPI & Expense Trackers",
    text: "Instant UPI transfers, savings breakdown, income vs. expense analytics, and biometric auth.",
    chips: ["Biometric lock", "Expense charts", "Instant UPI"],
    svg: "/svg/ma-finance-app-ui.svg",
  },
  {
    name: "Healthcare & Clinics",
    type: "Doctors, Diagnostics & Telemedicine",
    text: "Doctor consultations, instant slot bookings, digital prescriptions, and lab test reports.",
    chips: ["Slot booking", "Digital records", "Doctor chat"],
    svg: "/svg/ma-healthcare-app-ui.svg",
  },
  {
    name: "EdTech & Learning",
    type: "Academies, Tutors & Online Courses",
    text: "Structured video modules, interactive quizzes, streak tracking, and certified assessments.",
    chips: ["Video lessons", "Interactive quiz", "Learning streaks"],
    svg: "/svg/ma-education-app-ui.svg",
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


/* ------------------------------------------------------------------ */
/* Interactive Feature Widgets for "What goes inside"                */
/* ------------------------------------------------------------------ */

function NotificationWidget() {
  const [tracked, setTracked] = useState(false);
  return (
    <div className="mf-widget mf-notif">
      <div className="mf-notif__card">
        <div className="mf-notif__head">
          <div className="mf-notif__app">
            <span className="mf-notif__icon">SW</span>
            <b>Sipher Express</b>
          </div>
          <span className="mf-notif__time">Just now</span>
        </div>
        <p className="mf-notif__body">
          Order <strong>#8492</strong> is out for doorstep delivery with Aarav 🛵
        </p>
        <div className="mf-notif__actions">
          <button
            type="button"
            className={`mf-notif__btn${tracked ? " is-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setTracked(!tracked);
            }}
          >
            {tracked ? "Tracking active (1.2 km)" : "Track live"}
          </button>
          <span className="mf-notif__badge">OTP: 4892</span>
        </div>
      </div>
    </div>
  );
}

function OfflineWidget() {
  const [isOffline, setIsOffline] = useState(false);
  return (
    <div className="mf-widget mf-offline">
      <div className="mf-offline__toggle-row">
        <span className="mf-offline__status">
          <i className={`mf-dot${isOffline ? " is-offline" : " is-online"}`} />
          {isOffline ? "Offline Mode (Airplane)" : "Online (5G Ultra)"}
        </span>
        <button
          type="button"
          className={`mf-toggle${isOffline ? " on" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOffline(!isOffline);
          }}
          aria-label="Toggle network mode"
        >
          <span />
        </button>
      </div>
      <div className="mf-offline__bar">
        <div className="mf-offline__metric">
          <span>Local SQLite Storage</span>
          <b>3.2 MB cached</b>
        </div>
        <div className="mf-offline__sync-pill">
          {isOffline ? "Queue: 4 actions saved" : "All changes synced in 0.1s"}
        </div>
      </div>
    </div>
  );
}

function BiometricWidget() {
  return (
    <div className="mf-widget mf-bio">
      <div className="mf-bio__scanner">
        <Fingerprint size={30} className="mf-bio__icon" />
        <div className="mf-bio__laser" />
      </div>
      <span className="mf-bio__status">
        <Check size={12} /> KeyStore Verified
      </span>
    </div>
  );
}

function PaymentWidget() {
  return (
    <div className="mf-widget mf-pay">
      <div className="mf-pay__card">
        <div className="mf-pay__row">
          <span className="mf-pay__upi">UPI Instant</span>
          <span className="mf-pay__amt">₹2,450.00</span>
        </div>
        <div className="mf-pay__status">
          <span className="mf-pay__chk"><Check size={10} /></span>
          <span>HDFC •••• 4021 Approved</span>
        </div>
      </div>
    </div>
  );
}

function MapsWidget() {
  return (
    <div className="mf-widget mf-map">
      <div className="mf-map__canvas">
        <div className="mf-map__grid" />
        <svg className="mf-map__route" viewBox="0 0 160 50">
          <path d="M 15 35 Q 60 10, 110 32 T 145 15" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 3" />
        </svg>
        <div className="mf-map__beacon" />
        <div className="mf-map__marker">🛵</div>
      </div>
      <span className="mf-map__eta">4 mins away • 1.1 km</span>
    </div>
  );
}

function ChatWidget() {
  return (
    <div className="mf-widget mf-chat">
      <div className="mf-chat__bubble in">
        <span>Can I update delivery to 4 PM?</span>
      </div>
      <div className="mf-chat__bubble out">
        <span>Sure, driver notified!</span>
        <span className="mf-chat__receipt">✓✓</span>
      </div>
      <div className="mf-chat__typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

function CameraWidget() {
  return (
    <div className="mf-widget mf-cam">
      <div className="mf-cam__viewfinder">
        <div className="mf-cam__corner tl" />
        <div className="mf-cam__corner tr" />
        <div className="mf-cam__corner bl" />
        <div className="mf-cam__corner br" />
        <div className="mf-cam__barcode">
          <div className="mf-cam__bar b1" />
          <div className="mf-cam__bar b2" />
          <div className="mf-cam__bar b3" />
          <div className="mf-cam__bar b4" />
          <div className="mf-cam__bar b5" />
          <div className="mf-cam__bar b6" />
          <div className="mf-cam__bar b7" />
        </div>
        <div className="mf-cam__scanline" />
      </div>
      <div className="mf-cam__pill">
        <span className="mf-cam__dot" />
        <span>QR & SKU: 884-X92 DETECTED</span>
      </div>
    </div>
  );
}

function BackendSyncWidget() {
  return (
    <div className="mf-widget mf-sync">
      <div className="mf-sync__nodes">
        <div className="mf-sync__node">
          <span>📱</span>
          <small>Client App</small>
        </div>
        <div className="mf-sync__pipeline">
          <div className="mf-sync__line" />
          <div className="mf-sync__packet p1" />
          <div className="mf-sync__packet p2" />
        </div>
        <div className="mf-sync__node">
          <span>⚡</span>
          <small>GraphQL API</small>
        </div>
        <div className="mf-sync__pipeline">
          <div className="mf-sync__line" />
          <div className="mf-sync__packet p3" />
        </div>
        <div className="mf-sync__node">
          <span>🗄️</span>
          <small>ERP & DB</small>
        </div>
      </div>
      <div className="mf-sync__meta">
        <span className="mf-sync__status">● 200 OK • 16ms</span>
        <span className="mf-sync__ssl">🔒 End-to-end Encrypted</span>
      </div>
    </div>
  );
}

type FeatureId = "notif" | "offline" | "bio" | "pay" | "map" | "chat" | "cam" | "sync";

type FeatureDef = {
  id: FeatureId;
  Icon: LucideIcon;
  title: string;
  text: string;
  tag: string;
  wide?: boolean;
};

const FEATURES: FeatureDef[] = [
  {
    id: "notif" as const,
    Icon: Bell,
    title: "Push notifications",
    text: "Order updates, reminders and promotional drops that reach users at the right moment, with user-friendly quiet hour controls.",
    tag: "High open rates",
    wide: true,
  },
  {
    id: "offline" as const,
    Icon: WifiOff,
    title: "Offline-first architecture",
    text: "Screens and cached data stay fully usable without cellular signal, then queue and sync quietly when back online.",
    tag: "Zero downtime",
    wide: true,
  },
  {
    id: "bio" as const,
    Icon: Fingerprint,
    title: "Secure sign-in",
    text: "Fingerprint, Face ID, WhatsApp login and OTP with hardware keystore encryption.",
    tag: "Biometrics",
  },
  {
    id: "pay" as const,
    Icon: CreditCard,
    title: "In-app payments",
    text: "Seamless checkout via UPI auto-pay, cards, net banking, and digital wallets.",
    tag: "1-click checkout",
  },
  {
    id: "map" as const,
    Icon: MapPin,
    title: "Maps & live location",
    text: "Real-time delivery tracking, automated geofencing, and proximity store discovery.",
    tag: "Live GPS",
  },
  {
    id: "chat" as const,
    Icon: MessageCircle,
    title: "In-app chat & help",
    text: "Two-way customer messaging, AI support bots, and direct callback ticket routing.",
    tag: "Instant support",
  },
  {
    id: "cam" as const,
    Icon: Camera,
    title: "Camera, QR & scanning",
    text: "Instant optical barcode lookups, QR code validation, document scanning, and compressed media uploads.",
    tag: "Hardware camera",
    wide: true,
  },
  {
    id: "sync" as const,
    Icon: RefreshCw,
    title: "Full backend & ERP sync",
    text: "Native bidirectional sync with your existing website, CRM, inventory, warehouse ERP, or custom REST & GraphQL APIs.",
    tag: "Real-time sync",
    wide: true,
  },
];


/* ------------------------------------------------------------------ */
/* Stage Interactive Widgets                                           */
/* ------------------------------------------------------------------ */

function StageDiscoveryWidget() {
  const [activeTab, setActiveTab] = useState<"flow" | "backlog">("flow");
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { num: "01", title: "User Persona", desc: "Drivers & Shoppers mapped" },
    { num: "02", title: "Core Flow", desc: "Browse → 1-Tap Cart → Instant UPI" },
    { num: "03", title: "Cloud Schema", desc: "PostgreSQL & Node.js API" },
    { num: "04", title: "Sprint Scope", desc: "4 two-week milestones locked" },
  ];

  return (
    <div className="ma-swidget ma-swidget--discovery">
      <div className="ma-swidget__header">
        <div className="ma-swidget__title-wrap">
          <span className="ma-swidget__indicator" />
          <span className="ma-swidget__label">Blueprint Canvas</span>
        </div>
        <div className="ma-swidget__toggle">
          <button
            type="button"
            className={activeTab === "flow" ? "is-active" : ""}
            onClick={() => setActiveTab("flow")}
          >
            User Journey
          </button>
          <button
            type="button"
            className={activeTab === "backlog" ? "is-active" : ""}
            onClick={() => setActiveTab("backlog")}
          >
            Backlog Spec
          </button>
        </div>
      </div>

      {activeTab === "flow" ? (
        <div className="ma-swidget__flow">
          <div className="ma-swidget__flow-nodes">
            {steps.map((st, i) => (
              <button
                type="button"
                key={st.title}
                className={`ma-swidget__flow-node ${activeStep === i ? "is-selected" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="ma-swidget__node-dot">{st.num}</div>
                <div className="ma-swidget__node-info">
                  <strong>{st.title}</strong>
                  <small>{st.desc}</small>
                </div>
              </button>
            ))}
          </div>
          <div className="ma-swidget__flow-footer">
            <div className="ma-swidget__flow-stat">
              <span>Sprint 0 Target</span>
              <strong>100% Scope Lock</strong>
            </div>
            <div className="ma-swidget__flow-badge">
              <Check size={12} strokeWidth={3} /> Ready for Sprints
            </div>
          </div>
        </div>
      ) : (
        <div className="ma-swidget__backlog">
          <div className="ma-swidget__backlog-item">
            <span className="ma-swidget__p-badge ma-swidget__p-badge--p0">P0</span>
            <div className="ma-swidget__backlog-text">
              <strong>User Authentication & Profiles</strong>
              <small>OTP, biometric keychain & guest checkout</small>
            </div>
            <span className="ma-swidget__status-tag">Approved</span>
          </div>
          <div className="ma-swidget__backlog-item">
            <span className="ma-swidget__p-badge ma-swidget__p-badge--p0">P0</span>
            <div className="ma-swidget__backlog-text">
              <strong>Live Ordering & UPI Intent</strong>
              <small>Google Pay, PhonePe, Paytm & cards</small>
            </div>
            <span className="ma-swidget__status-tag">Approved</span>
          </div>
          <div className="ma-swidget__backlog-item">
            <span className="ma-swidget__p-badge ma-swidget__p-badge--p1">P1</span>
            <div className="ma-swidget__backlog-text">
              <strong>Offline SQLite Cache</strong>
              <small>Instant feed load without network</small>
            </div>
            <span className="ma-swidget__status-tag">Scheduled</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StageDesignWidget() {
  const [mode, setMode] = useState<"hifi" | "wireframe">("hifi");
  const [liked, setLiked] = useState(false);

  return (
    <div className="ma-swidget ma-swidget--design">
      <div className="ma-swidget__header">
        <div className="ma-swidget__title-wrap">
          <span className="ma-swidget__indicator" />
          <span className="ma-swidget__label">Figma Prototype Studio</span>
        </div>
        <div className="ma-swidget__toggle">
          <button
            type="button"
            className={mode === "wireframe" ? "is-active" : ""}
            onClick={() => setMode("wireframe")}
          >
            Wireframe
          </button>
          <button
            type="button"
            className={mode === "hifi" ? "is-active" : ""}
            onClick={() => setMode("hifi")}
          >
            Hi-Fi UI
          </button>
        </div>
      </div>

      <div className={`ma-swidget__phone-canvas ma-swidget__phone-canvas--${mode}`}>
        <div className="ma-swidget__mini-screen">
          <div className="ma-swidget__screen-top">
            <span className="ma-swidget__time">9:41</span>
            <span className="ma-swidget__status-icons">5G ●●</span>
          </div>
          {mode === "wireframe" ? (
            <div className="ma-swidget__wf-body">
              <div className="ma-swidget__wf-box ma-swidget__wf-box--header" />
              <div className="ma-swidget__wf-row">
                <div className="ma-swidget__wf-box ma-swidget__wf-box--thumb" />
                <div className="ma-swidget__wf-col">
                  <div className="ma-swidget__wf-line ma-swidget__wf-line--long" />
                  <div className="ma-swidget__wf-line ma-swidget__wf-line--short" />
                </div>
              </div>
              <div className="ma-swidget__wf-row">
                <div className="ma-swidget__wf-box ma-swidget__wf-box--thumb" />
                <div className="ma-swidget__wf-col">
                  <div className="ma-swidget__wf-line ma-swidget__wf-line--long" />
                  <div className="ma-swidget__wf-line ma-swidget__wf-line--short" />
                </div>
              </div>
              <div className="ma-swidget__wf-cta" />
            </div>
          ) : (
            <div className="ma-swidget__hifi-body">
              <div className="ma-swidget__hifi-card">
                <div className="ma-swidget__hifi-thumb">🍕</div>
                <div className="ma-swidget__hifi-details">
                  <strong>Truffle Burrata Pizza</strong>
                  <span>₹480 · 20-25 mins · 4.9 ★</span>
                </div>
                <button
                  type="button"
                  className={`ma-swidget__heart ${liked ? "is-liked" : ""}`}
                  onClick={() => setLiked(!liked)}
                  aria-label="Save item"
                >
                  {liked ? "❤️" : "🤍"}
                </button>
              </div>
              <div className="ma-swidget__hifi-bar">
                <span>Total: ₹480</span>
                <span className="ma-swidget__hifi-btn">Order Now →</span>
              </div>
            </div>
          )}
        </div>

        <div className="ma-swidget__tokens-pane">
          <div className="ma-swidget__token-group">
            <small>Color Palette</small>
            <div className="ma-swidget__swatches">
              <span style={{ background: "#100563" }} title="#100563 Primary" />
              <span style={{ background: "#ffe401" }} title="#ffe401 Yellow" />
              <span style={{ background: "#f6f7fc" }} title="#f6f7fc Surface" />
              <span style={{ background: "#0b0442" }} title="#0b0442 Navy" />
            </div>
          </div>
          <div className="ma-swidget__token-group">
            <small>Typography Spec</small>
            <div className="ma-swidget__type-badge">DM Serif + Plus Jakarta</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageSprintWidget() {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="ma-swidget ma-swidget--sprint">
      <div className="ma-swidget__header">
        <div className="ma-swidget__title-wrap">
          <span className="ma-swidget__indicator" />
          <span className="ma-swidget__label">Live Sprint Console</span>
        </div>
        <span className="ma-swidget__pulse-tag">Sprint 2 of 4 Active</span>
      </div>

      <div className="ma-swidget__terminal">
        <div className="ma-swidget__term-row">
          <span className="ma-swidget__term-tag">git push</span>
          <span className="ma-swidget__term-msg">feat(checkout): UPI Intent hook attached</span>
        </div>
        <div className="ma-swidget__term-row">
          <span className="ma-swidget__term-tag ma-swidget__term-tag--ok">ci/cd</span>
          <span className="ma-swidget__term-msg">TestFlight Build #48 passed · 0 errors</span>
        </div>
        <div className="ma-swidget__term-row">
          <span className="ma-swidget__term-tag ma-swidget__term-tag--ok">apk</span>
          <span className="ma-swidget__term-msg">Android artifact compiled (18.4 MB)</span>
        </div>
      </div>

      <div className="ma-swidget__build-card">
        <div className="ma-swidget__build-info">
          <div className="ma-swidget__build-icon">📱</div>
          <div>
            <strong>Sprint Demo Build v0.8.2</strong>
            <small>Updated 15 mins ago · iOS & Android</small>
          </div>
        </div>
        <button
          type="button"
          className={`ma-swidget__build-btn ${downloaded ? "is-done" : ""}`}
          onClick={() => setDownloaded(true)}
        >
          {downloaded ? "Sent to Phone ✓" : "Test On Phone →"}
        </button>
      </div>
    </div>
  );
}

function StageQAWidget() {
  const [device, setDevice] = useState<"ios" | "android" | "pixel">("ios");
  const [isOffline, setIsOffline] = useState(false);

  const deviceNames = {
    ios: "iPhone 16 Pro (iOS 18.2)",
    android: "Galaxy S24 Ultra (Android 14)",
    pixel: "Pixel 9 (Android 15)",
  };

  return (
    <div className="ma-swidget ma-swidget--qa">
      <div className="ma-swidget__header">
        <div className="ma-swidget__title-wrap">
          <span className="ma-swidget__indicator" />
          <span className="ma-swidget__label">Device Lab & Telemetry</span>
        </div>
        <div className="ma-swidget__device-tabs">
          <button
            type="button"
            className={device === "ios" ? "is-active" : ""}
            onClick={() => setDevice("ios")}
          >
            iOS
          </button>
          <button
            type="button"
            className={device === "android" ? "is-active" : ""}
            onClick={() => setDevice("android")}
          >
            Galaxy
          </button>
          <button
            type="button"
            className={device === "pixel" ? "is-active" : ""}
            onClick={() => setDevice("pixel")}
          >
            Pixel
          </button>
        </div>
      </div>

      <div className="ma-swidget__device-badge">
        <span>Hardware Under Test:</span>
        <strong>{deviceNames[device]}</strong>
      </div>

      <div className="ma-swidget__metrics-grid">
        <div className="ma-swidget__metric-card">
          <small>Frame Rate</small>
          <strong>60.0 FPS</strong>
          <span className="ma-swidget__metric-sub text-green">Smooth 100%</span>
        </div>
        <div className="ma-swidget__metric-card">
          <small>Memory Footprint</small>
          <strong>38 MB</strong>
          <span className="ma-swidget__metric-sub">0 Leaks</span>
        </div>
        <div className="ma-swidget__metric-card">
          <small>Security Review</small>
          <strong>OWASP Mobile</strong>
          <span className="ma-swidget__metric-sub text-green">Passed</span>
        </div>
      </div>

      <div className="ma-swidget__qa-toggle-row">
        <span>Simulate Network:</span>
        <button
          type="button"
          className={`ma-swidget__net-btn ${isOffline ? "is-offline" : ""}`}
          onClick={() => setIsOffline(!isOffline)}
        >
          {isOffline ? "⚠️ 3G Low Signal (SQLite cache active)" : "⚡ High Speed 5G (Online)"}
        </button>
      </div>
    </div>
  );
}

function StagePublishWidget() {
  return (
    <div className="ma-swidget ma-swidget--publish">
      <div className="ma-swidget__header">
        <div className="ma-swidget__title-wrap">
          <span className="ma-swidget__indicator" />
          <span className="ma-swidget__label">Store Release & Operations</span>
        </div>
        <span className="ma-swidget__live-badge">● Production Live</span>
      </div>

      <div className="ma-swidget__stores-grid">
        <div className="ma-swidget__store-item">
          <div className="ma-swidget__store-icon">🍏</div>
          <div className="ma-swidget__store-meta">
            <strong>Apple App Store</strong>
            <span>Status: Approved & Live</span>
            <small>v1.0.0 · Worldwide Distribution</small>
          </div>
        </div>
        <div className="ma-swidget__store-item">
          <div className="ma-swidget__store-icon">🤖</div>
          <div className="ma-swidget__store-meta">
            <strong>Google Play Store</strong>
            <span>Status: In Production</span>
            <small>v1.0.0 · Android 10 to 15</small>
          </div>
        </div>
      </div>

      <div className="ma-swidget__sla-card">
        <div className="ma-swidget__sla-metric">
          <strong>99.9%</strong>
          <small>Crash-free users</small>
        </div>
        <div className="ma-swidget__sla-metric">
          <strong>99.98%</strong>
          <small>API uptime SLA</small>
        </div>
        <div className="ma-swidget__sla-metric">
          <strong>24/7</strong>
          <small>Critical hotfixes</small>
        </div>
      </div>
    </div>
  );
}

const STAGES = [
  {
    title: "Discover & plan",
    when: "Week 1",
    milestone: "100% scoped blueprint & fixed sprint roadmap",
    text: "We learn who the app is for, what they do on their phones and what must work on day one.",
    gets: ["User and journey map", "Feature list in priority order", "Itemised quote and timeline"],
  },
  {
    title: "UX & UI design",
    when: "Weeks 2–3",
    milestone: "Clickable prototype ready on your phone",
    text: "Wireframes become a clickable design, so you and your customers can try the app before it exists.",
    gets: ["Clickable prototype", "Android and iOS screen designs", "A design system for future screens"],
  },
  {
    title: "Build in sprints",
    when: "Two-week sprints",
    milestone: "Working build in your hands every two weeks",
    text: "Screens, API and admin panel are built together, with a demo on your own phone at the end of every sprint.",
    gets: ["A working build each sprint", "Code in a repository you own", "Admin panel to manage content"],
  },
  {
    title: "Test on real devices",
    when: "Every sprint & pre-launch",
    milestone: "Tested on 15+ real iOS & Android hardware models",
    text: "We test across screen sizes, OS versions and slow networks, and check security and performance before release.",
    gets: ["Device and OS test matrix", "Security and speed review", "Beta build for your team"],
  },
  {
    title: "Publish & support",
    when: "Launch and beyond",
    milestone: "Store approved & 24/7 post-launch warranty",
    text: "We prepare the store listings, handle submission and review feedback, and stay on for fixes and updates.",
    gets: ["Play Store and App Store listings", "Crash and usage monitoring", "A maintenance plan"],
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



const RELATED = [
  {
    to: "/services/web-development",
    title: "Web development",
    text: "Fast, search-friendly websites and portals.",
    img: "/new-images/services/webdev/related-web-development.webp",
  },
  {
    to: "/services/ui-ux",
    title: "UI/UX design",
    text: "Interfaces that feel obvious and look great.",
    img: "/new-images/services/webdev/related-ui-ux.webp",
  },
  {
    to: "/services/ecommerce",
    title: "E-commerce development",
    text: "Online stores that sell and scale.",
    img: "/new-images/services/webdev/related-ecommerce.webp",
  },
  {
    to: "/services/software-development",
    title: "Custom software",
    text: "Software shaped around your process.",
    img: "/new-images/services/webdev/related-custom-software.webp",
  },
];

/* ------------------------------------------------------------------ */
/* Reusable phone content                                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* FAQ row — height is animated with GSAP, hidden content leaves the   */
/* accessibility tree through visibility                               */
/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MobileAppDevelopment() {
  const rootRef = useRef<HTMLDivElement>(null);
  const platFirst = useRef(true);
  const [plat, setPlat] = useState(0);

  const jump = (id: string) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  const platSectionRef = useRef<HTMLElement>(null);
  const [platInView, setPlatInView] = useState(false);

  useEffect(() => {
    const el = platSectionRef.current;
    if (!el) return;

    const checkView = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        setPlatInView(true);
        return true;
      }
      return false;
    };

    if (checkView()) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlatInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* platform chooser: copy re-animates on every tab change */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (platFirst.current) {
      platFirst.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
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
            const resize = () => stage.style.setProperty("--ma-demo-scale", `${Math.min(0.64, frame.clientWidth / 500)}`);
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
          .from($(".ma-hero__title .ma-w > span"), { yPercent: 115, duration: 1, stagger: 0.05, clearProps: "transform" }, 0.1)
          .from($(".ma-hero__lead, .ma-hero__cta > *, .ma-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55)
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
            const scale = Math.min(0.64, stageFrame.clientWidth / 500);
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

          /* subtle 3D tilt and elevation as each phone crosses the viewport */
          $(".ma-slide").forEach((sl) => {
            const phone = one(".ma-slide__phone", sl);
            if (phone) {
              gsap.fromTo(
                phone,
                { rotation: 4, y: 8 },
                { rotation: -4, y: -8, ease: "none", scrollTrigger: { trigger: sl, containerAnimation: h, start: "left right", end: "right left", scrub: true } }
              );
            }
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
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/services">Services</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Mobile App Development</span>
            </nav>

            <div className="ma-hero__grid">
              <div className="ma-hero__copy">
                <h1 id="ma-h1" className="ma-hero__title" aria-label="People open every day, not just once after install.">
                  <span className="ma-line" aria-hidden="true"><Words text="People open every day," /></span>
                  <span className="ma-line" aria-hidden="true">
                    <em><Words text="not just once after install." /></em>
                  </span>
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
          </div>
        </section>

        {/* =========================== TECH STACK RIBBONS =========================== */}
        <TechStackRibbons lanes={MOBILE_RIBBON_LANES} />

        {/* ===================== SKETCH PLANNING BOARD ===================== */}
        <section className="ma-scene" id="ma-scene" aria-label="Planning board: how we sketch your app">
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
            <Head center eyebrow="What we build">
              <span id="ma-gal-h">Apps for every kind of <em>business.</em></span>
            </Head>
          </div>
          <div className="ma-gal__track" role="region" aria-label="Types of app we build" tabIndex={0}>
            {APPS.map((a) => (
              <article className="ma-slide" key={a.name}>
                <div className="ma-slide__phone">
                  <div className="ma-svg-phone" aria-hidden="true">
                    <div className="ma-svg-phone__chassis">
                      <div className="ma-svg-phone__screen">
                        <img
                          src={a.svg}
                          alt={`${a.name} mobile app UI`}
                          className="ma-svg-phone__img"
                          width={320}
                          height={640}
                          loading="lazy"
                        />
                      </div>
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
        <section ref={platSectionRef} className="ma-section ma-platform" aria-labelledby="ma-plat-h">
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
                    className={`ma-plat__tab-btn${plat === i ? " on" : ""}`}
                    onClick={() => setPlat(i)}
                  >
                    <div className="ma-plat__tab-info">
                      <b>{p.name}</b>
                      <span>{p.tools}</span>
                    </div>
                    <div className="ma-plat__tab-arrow" aria-hidden="true">
                      <ChevronRight size={18} />
                    </div>
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
                  {active.bars.map(([label, v], idx) => (
                    <PlatformBar
                      key={`${plat}-${label}`}
                      label={label}
                      target={v}
                      delay={idx * 0.08}
                      active={platInView}
                    />
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
            <Head center eyebrow="What goes inside" lead="The details that make an app feel finished, built in from the first sprint.">
              <span id="ma-feat-h">Everything an app needs, <em>built in.</em></span>
            </Head>
            <div className="ma-feat-grid">
              {FEATURES.map(({ id, Icon, title, text, tag, wide }) => (
                <article className={`ma-feat${wide ? " ma-feat--wide" : ""}`} key={title} data-reveal>
                  <div className="ma-feat__top">
                    <span className="ma-feat__icon">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    {tag && <span className="ma-feat__tag">{tag}</span>}
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className="ma-feat__canvas" aria-hidden="true">
                    {id === "notif" && <NotificationWidget />}
                    {id === "offline" && <OfflineWidget />}
                    {id === "bio" && <BiometricWidget />}
                    {id === "pay" && <PaymentWidget />}
                    {id === "map" && <MapsWidget />}
                    {id === "chat" && <ChatWidget />}
                    {id === "cam" && <CameraWidget />}
                    {id === "sync" && <BackendSyncWidget />}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== PROCESS ============================== */}
        <section className="ma-section ma-proc" id="ma-process">
          <div className="container">
            <Head center eyebrow="Idea to store" lead="A clear path with a working build in your hands at every stage.">
              <span id="ma-proc-h">Five stages from <em>idea to home screen.</em></span>
            </Head>
            <div className="ma-stk">
              {STAGES.map((s, i) => (
                <article
                  className="ma-card"
                  key={s.title}
                  style={{ "--i": i } as CSSProperties}
                >
                  <div className="ma-card__watermark" aria-hidden="true">
                    0{i + 1}
                  </div>

                  <div className="ma-card__copy">
                    <div className="ma-card__badge-row">
                      <span className="ma-card__step-tag">STAGE 0{i + 1}</span>
                      <span className="ma-card__when-pill">{s.when}</span>
                    </div>

                    <h3 className="ma-card__title">{s.title}</h3>
                    <p className="ma-card__desc">{s.text}</p>

                    <div className="ma-card__deliverables">
                      <div className="ma-card__deliv-head">
                        <Sparkles size={14} className="ma-card__deliv-icon" />
                        <span>Key Deliverables</span>
                      </div>
                      <div className="ma-card__deliv-grid">
                        {s.gets.map((g) => (
                          <div className="ma-card__deliv-item" key={g}>
                            <div className="ma-card__deliv-check">
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span>{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ma-card__milestone">
                      <CheckCircle2 size={15} className="ma-card__mile-icon" />
                      <span>{s.milestone}</span>
                    </div>
                  </div>

                  <div className="ma-card__visual">
                    {i === 0 && <StageDiscoveryWidget />}
                    {i === 1 && <StageDesignWidget />}
                    {i === 2 && <StageSprintWidget />}
                    {i === 3 && <StageQAWidget />}
                    {i === 4 && <StagePublishWidget />}
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
                  <img src={t.icon} alt="" width={36} height={36} loading="lazy" decoding="async" />
                  {t.name}
                </span>
              ))}
            </div>
            <div className="ma-tech__b ma-tech__row">
              {[...ROW_B, ...ROW_B].map((t, i) => (
                <span className="ma-tech__pill" key={`${t.name}-${i}`}>
                  <img src={t.icon} alt="" width={36} height={36} loading="lazy" decoding="async" />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          <p className="ma-sr">
            Mobile: {ROW_A.map((t) => t.name).join(", ")}. Backend and delivery: {ROW_B.map((t) => t.name).join(", ")}.
          </p>
        </section>

        

        {/* ============================== RELATED ============================== */}
        <section className="ma-section ma-related">
          <div className="container">
            <Head
              center
              eyebrow="Explore other services"
              lead="A great app works best with the right partners around it. Pick a service below and see how it helps you get found, look sharper and sell more."
            >
              Explore more ways to <em>grow online</em>
            </Head>
            <div className="ma-rel-grid">
              {RELATED.map(({ to, title, text, img: bg }, i) => (
                <Link className="ma-rel-card" to={to} key={to} data-reveal>
                  <img className="ma-rel-card__bg" src={bg} alt={title} width={1536} height={1024} loading="lazy" decoding="async" />
                  <div className="ma-rel-card__pill">
                    <span className="ma-rel-card__no" aria-hidden="true">0{i + 1}</span>
                    <div className="ma-rel-card__info">
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                    <span className="ma-rel-card__more">
                      <span>Explore</span>
                      <ArrowRight aria-hidden="true" size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="ma-rel-all" data-reveal>
              <Link className="ma-rel-all__link" to="/services">
                <span className="ma-rel-all__label">View all services</span>
                <span className="ma-rel-all__icon" aria-hidden="true">
                  <ArrowRight size={17} />
                </span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}