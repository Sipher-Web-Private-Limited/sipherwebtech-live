import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as RPointerEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, Bookmark, Briefcase, Check, ClipboardList, Compass, Eye, FlaskConical, Heart, Mail, MapPin,
  Megaphone, MessageCircle, MousePointerClick, PenLine, Play, Plus, Repeat, RotateCcw, Rocket, Search, Send, Share2,
  Sparkles, Star, Target, TrendingDown, TrendingUp, Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import TechStackRibbons, { type RibbonLaneConfig } from "../../components/TechStackRibbons";
import "../../styles/services/digital-marketing.css";

gsap.registerPlugin(ScrollTrigger);

const inr = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

const Words = ({ text }: { text: string }) => (
  <>{text.split(" ").map((w, i) => <span key={i}><span className="dm-w"><span>{w}</span></span>{" "}</span>)}</>
);

function Head({ eyebrow, children, lead, center, dark }: { eyebrow: string; children: ReactNode; lead?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`dm-head${center ? " dm-head--center" : ""}${dark ? " dm-head--dark" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="dm-title">{children}</h2>
      {lead && <p className="dm-lead">{lead}</p>}
    </div>
  );
}

const DM_RIBBON_LANES: readonly RibbonLaneConfig[] = [
  {
    label: "Channels We Run",
    className: "tech-ribbons__lane--technology",
    reverse: false,
    items: ["SEO", "Google Ads", "Meta Ads", "Social Media", "Content Marketing", "Email Marketing", "WhatsApp Marketing", "Local SEO", "YouTube"],
  },
  {
    label: "Tools and Disciplines",
    className: "tech-ribbons__lane--disciplines",
    reverse: true,
    items: ["Google Analytics 4", "Search Console", "Tag Manager", "Meta Business Suite", "Landing Pages", "A/B Testing", "CRM Tracking", "Conversion Tracking", "Looker Studio"],
  },
] as const;

/* ---- HERO ---- */
const WORDS = ["enquiries", "customers", "calls", "orders"] as const;
const ORBIT: Array<{ s: string; t: string; nodes: Array<[LucideIcon, number]> }> = [
  { s: "42%", t: "42s", nodes: [[Search, 30], [Megaphone, 210]] },
  { s: "70%", t: "64s", nodes: [[Share2, 120], [Mail, 300]] },
  { s: "100%", t: "90s", nodes: [[PenLine, 70], [BarChart3, 250]] },
];
const NOTES = [
  { t: "New enquiry", s: "from Google Search" },
  { t: "5-star review", s: "added to your profile" },
  { t: "Booking confirmed", s: "on WhatsApp" },
] as const;

/* ---- JOURNEY (horizontal scroll) ---- */
const JOURNEY: Array<{ icon: LucideIcon; t: string; p: string; tags: string[]; img: string; goal: string; url: string }> = [
  {
    icon: Search,
    t: "They search, scroll or see an ad.",
    p: "Your name shows up where customers already look: search results, maps, social feeds and short videos.",
    tags: ["SEO", "Google Ads", "Social"],
    img: "/new-images/services/webdev/related-seo.webp",
    goal: "🎯 Goal: Instant Discovery & High Intent",
    url: "google.com/search?q=sipher+web",
  },
  {
    icon: PenLine,
    t: "They land on something worth reading.",
    p: "A fast page with a clear promise and helpful content stops people tapping straight back.",
    tags: ["Landing pages", "Content", "Video"],
    img: "/new-images/services/webdev/service-landing-pages.webp",
    goal: "⚡ Goal: Hook Attention & Low Bounce",
    url: "sipherweb.com/growth-landing-page",
  },
  {
    icon: Star,
    t: "They compare, read reviews and ask.",
    p: "Reviews, proof and quick answers on WhatsApp make choosing you the easy choice.",
    tags: ["Reviews", "FAQ pages", "WhatsApp"],
    img: "/new-images/services/webdev/industry-ecommerce.webp",
    goal: "⭐ Goal: Overcome Doubt with Proof",
    url: "sipherweb.com/case-studies-and-reviews",
  },
  {
    icon: MousePointerClick,
    t: "They call, book or buy.",
    p: "One clear button, a short form and tracked calls mean the moment of decision is never lost.",
    tags: ["Forms", "Calls", "Booking"],
    img: "/new-images/services/webdev/service-portals-dashboards.webp",
    goal: "📞 Goal: Frictionless Action & Sale Close",
    url: "sipherweb.com/book-consultation",
  },
  {
    icon: Repeat,
    t: "They come back, and bring friends.",
    p: "Email, WhatsApp and review requests keep the relationship warm long after the sale.",
    tags: ["Email", "Reviews", "Referrals"],
    img: "/new-images/services/webdev/process-support.webp",
    goal: "🔁 Goal: Maximum LTV & Referrals",
    url: "sipherweb.com/loyalty-and-referral",
  },
];

/* ---- SIMULATOR ---- */
const ROI_FIELDS = [
  { k: "budget", label: "Monthly ad budget", min: 10000, max: 500000, step: 5000, pre: "₹", help: "What you spend on Google, Meta and other ads." },
  { k: "cpl", label: "Cost per lead", min: 50, max: 2000, step: 10, pre: "₹", help: "The average cost to get one enquiry." },
  { k: "rate", label: "Leads that become customers", min: 1, max: 50, step: 1, suf: "%", help: "How many enquiries your team closes." },
  { k: "aov", label: "Average sale value", min: 500, max: 200000, step: 500, pre: "₹", help: "Revenue from one customer." },
] as const;
type RoiKey = (typeof ROI_FIELDS)[number]["k"];
const ROI_DEFAULT: Record<RoiKey, number> = { budget: 50000, cpl: 300, rate: 10, aov: 8000 };
const GAUGE_C = 2 * Math.PI * 70;

/* ---- GOALS (donut) ---- */
const SEG_COLORS = ["#100563", "#ffe401", "#4a3fd1", "#b9b4f5"] as const;
const GOALS = [
  {
    k: "More enquiries", sub: "Leads and calls", icon: MessageCircle,
    t: "Fill the pipeline with the right enquiries",
    p: "Capture people who are searching now, build steady traffic that costs less over time, and follow up fast so leads do not go cold.",
    mix: [
      { n: "Google Ads", tag: "Capture people searching now", v: 35 },
      { n: "SEO and content", tag: "Steady, lower-cost traffic", v: 25 },
      { n: "Social and retargeting", tag: "Stay in front of visitors", v: 15 },
      { n: "WhatsApp and email", tag: "Turn leads into calls", v: 25 },
    ],
    steps: ["Audit, tracking and first search campaigns", "Landing pages, content and follow-up flows", "Cut weak keywords, scale what brings leads"],
    verdict: "Best when your team can answer leads quickly and sales happen on a call or a visit.",
  },
  {
    k: "Online sales", sub: "Orders and revenue", icon: TrendingUp,
    t: "Turn browsers into buyers, then repeat buyers",
    p: "Reach shoppers with product-led ads, recover abandoned carts and build email and WhatsApp journeys that bring people back.",
    mix: [
      { n: "Meta and Google ads", tag: "Reach buyers and shoppers", v: 40 },
      { n: "Email and WhatsApp", tag: "Recover carts, repeat orders", v: 25 },
      { n: "SEO and product content", tag: "Free up ad spend over time", v: 20 },
      { n: "Landing pages and tests", tag: "Lift conversion rate", v: 15 },
    ],
    steps: ["Tracking, product feed and first ad creatives", "Retargeting and email or WhatsApp flows", "Test offers, move budget to best sellers"],
    verdict: "Best for stores and catalogues where the sale is completed online.",
  },
  {
    k: "Local visibility", sub: "Maps and near me", icon: Compass,
    t: "Be the obvious choice in your area",
    p: "Show up on Maps and in near-me searches, collect genuine reviews and make it easy to call or visit.",
    mix: [
      { n: "Google Business Profile", tag: "Maps and near-me results", v: 35 },
      { n: "Local SEO", tag: "Pages for each area you serve", v: 30 },
      { n: "Reviews", tag: "Build trust before the call", v: 20 },
      { n: "Social", tag: "Show the people and the work", v: 15 },
    ],
    steps: ["Profile clean-up and local keyword research", "Area pages, listings and review requests", "Posts, photos and a ranking review"],
    verdict: "Best for clinics, institutes, shops and service businesses with a physical area.",
  },
  {
    k: "Brand awareness", sub: "Reach and recall", icon: Megaphone,
    t: "Become the name people remember",
    p: "Reach new audiences with video and social content, and repeat your message so people think of you first.",
    mix: [
      { n: "Social and video", tag: "Reach new audiences", v: 35 },
      { n: "Content and SEO", tag: "Be the helpful answer", v: 25 },
      { n: "Reach ads", tag: "Repeat your message", v: 25 },
      { n: "Email", tag: "Stay in touch with followers", v: 15 },
    ],
    steps: ["Brand voice, content plan and first posts", "Video content and reach campaigns", "Measure reach and engagement, refine"],
    verdict: "Best for new brands, launches and categories where people do not yet search for you.",
  },
];
const DONUT_R = 80;
const DONUT_C = 2 * Math.PI * DONUT_R;

/* ---- PROCESS (stacked cards) ---- */
const STEPS: Array<{ t: string; w: string; p: string; icon: LucideIcon; out: string[] }> = [
  { t: "Audit and goals", w: "Days 1 to 5", icon: ClipboardList, p: "We review your website, accounts, competitors and numbers, then agree what a good result means for your business.", out: ["Audit report", "Goal and KPI list", "Quick wins"] },
  { t: "Strategy and set-up", w: "Week 2", icon: Compass, p: "We choose the channels, set a starting budget and install tracking so every lead can be traced to its source.", out: ["Channel plan", "Tracking live", "Content plan"] },
  { t: "Launch campaigns", w: "Weeks 3 to 4", icon: Rocket, p: "Ads, content and follow-up flows go live in stages, starting small so we learn before we scale.", out: ["Live campaigns", "Landing pages", "Follow-up flows"] },
  { t: "Test and optimise", w: "Every month", icon: FlaskConical, p: "We test headlines, audiences and offers, stop what is not working and put more budget behind what is.", out: ["A/B tests", "Budget shifts", "Fresh creatives"] },
  { t: "Report and plan", w: "Every month", icon: BarChart3, p: "You get a plain-language report with leads, cost per lead and what we will change next, then we plan the month ahead together.", out: ["Monthly report", "Review call", "Next-month plan"] },
];

const MYTHS = [
  {
    num: "01",
    icon: Users,
    m: "More followers automatically equals more sales.",
    hook: "Followers ≠ Paying Buyers",
    r: "Followers are not customers. We track phone calls, WhatsApp enquiries and verified checkouts — treating reach as a vehicle, not the ultimate goal.",
    takeaway: "Track verified sales, not vanity likes.",
  },
  {
    num: "02",
    icon: Search,
    m: "SEO is a one-time project you finish once.",
    hook: "Search Compounding Never Stops",
    r: "Google's algorithm evolves constantly and competitors keep publishing. SEO is disciplined monthly execution where ranking gains compound over time.",
    takeaway: "Consistent optimization beats one-time audits.",
  },
  {
    num: "03",
    icon: Megaphone,
    m: "Running paid ads alone is enough to scale.",
    hook: "Paid Ads Need Organic Roots",
    r: "Paid ads stop delivering the day your ad budget stops. We pair ad campaigns with SEO, video assets and WhatsApp nurture so momentum never dies.",
    takeaway: "Pair ads with evergreen retention flows.",
  },
  {
    num: "04",
    icon: Target,
    m: "Pouring a bigger budget fixes low conversion.",
    hook: "Fix The Funnel Before Scaling",
    r: "More ad spend on a slow website or delayed follow-up only burns capital faster. We optimize tracking, landing pages and speed first, then scale spend.",
    takeaway: "Optimize conversion rate before increasing budget.",
  },
] as const;

const BAND = ["More leads", "Clear reports", "Steady growth", "Honest numbers"] as const;

const FAQ = [
  { q: "How soon will I see results?", a: "Paid ads can bring enquiries within weeks once tracking and landing pages are ready. SEO and content usually take three to six months to build momentum. We set expectations for each channel during the audit and never promise a ranking." },
  { q: "Do I pay ad spend to you or to Google and Meta?", a: "Ad spend goes directly to the platform from your own account. Our fee covers strategy, set-up, management and reporting, and is quoted separately." },
  { q: "Who owns the accounts and data?", a: "You do. Ad accounts, analytics, Search Console and social pages stay under your ownership, and we are added as managers." },
  { q: "How will I know it is working?", a: "We set up tracking for calls, forms and WhatsApp clicks before spending, then send a monthly report with leads, cost per lead and what we will change next." },
  { q: "What budget do I need?", a: "It depends on your market and goals. We suggest a starting budget after the audit and recommend testing small before scaling." },
];
const FAQ_LD = { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

const REL: RelatedServiceItem[] = [
  { to: "/services/web-development", title: "Web development", text: "Fast, search-friendly websites and portals.", img: "/new-images/services/webdev/related-web-development.webp" },
  { to: "/services/seo", title: "SEO services", text: "Rank higher and get found by local buyers.", img: "/new-images/services/webdev/related-seo.webp" },
  { to: "/services/ecommerce", title: "E-commerce stores", text: "Online stores built to turn traffic into orders.", img: "/new-images/services/webdev/related-ecommerce.webp" },
  { to: "/services/ai-automation", title: "AI automation", text: "Follow up on every inbound lead automatically.", img: "/new-images/services/webdev/related-custom-software.webp" },
];

const SITE = "https://sipherweb.in"; /* confirm production domain */
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service", name: "Digital Marketing", serviceType: "Digital marketing, SEO, paid advertising and social media marketing", url: `${SITE}/services/digital-marketing`,
      description: "Digital marketing for SEO, Google and Meta ads, social media, content, email and WhatsApp, with transparent tracking and monthly reporting.",
      provider: { "@type": "Organization", name: "Sipher Web Pvt. Ltd.", url: SITE },
      areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: "Digital Marketing", item: `${SITE}/services/digital-marketing` },
    ] },
    FAQ_LD,
  ],
};

/* =====================================================================
   NEW SECTIONS: Google Ads, Meta Ads, platforms, Growth lab, Pricing
   ===================================================================== */
const lakh = (n: number) => (n >= 1e5 ? `${(n / 1e5).toFixed(1)} L` : inr(n));

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

function useCount(target: number, run: boolean, dur = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return v;
}

function Count({ to, run, dec = 0, pre = "", suf = "", fmt }: { to: number; run: boolean; dec?: number; pre?: string; suf?: string; fmt?: (n: number) => string }) {
  const v = useCount(to, run);
  return <>{pre}{fmt ? fmt(v) : dec ? v.toFixed(dec) : inr(v)}{suf}</>;
}

/* ================================================================== ADS SHOWCASE */
const FUNNEL = [
  { l: "People Reached", v: 120000, w: 100, tag: "Cold & Lookalike Audience", rate: "100% Reach" },
  { l: "High-Intent Clicks", v: 4800, w: 72, tag: "Engaged Feed Scrollers", rate: "4.0% CTR" },
  { l: "Verified Inbound Leads", v: 360, w: 48, tag: "WhatsApp & Form Enquiries", rate: "7.5% Lead Rate" },
  { l: "Closed Sales & Buyers", v: 42, w: 28, tag: "High-Paying Customers", rate: "11.6% Close Rate" },
] as const;

const TARGETING = [
  { t: "📍 Lucknow + 35 km" },
  { t: "👥 Age 25 to 44" },
  { t: "💼 Business Owners & Founders" },
  { t: "🔄 Website Visitors (30d)" },
] as const;

interface PlatformItem {
  icon: LucideIcon;
  t: string;
  badge: string;
  stat: string;
  best: string;
  tags: readonly string[];
  goal: string;
}

const PLATFORMS: readonly PlatformItem[] = [
  {
    icon: Search,
    t: "Google Search Ads",
    badge: "High Intent",
    stat: "4.8x Avg ROAS",
    best: "Capture buyers actively typing what you sell in Lucknow and across India right at the moment of decision.",
    tags: ["Exact Match", "Negative Filtering", "Call-Only Ads"],
    goal: "Inbound Calls & High-Ticket Enquiries",
  },
  {
    icon: Play,
    t: "YouTube & Video Ads",
    badge: "High Attention",
    stat: "85% Hook Rate",
    best: "Compelling non-skippable & Shorts ads that put your brand story in front of target buyers before they compare alternatives.",
    tags: ["YouTube Shorts", "In-Stream Video", "Remarketing"],
    goal: "Brand Recall & Buyer Consideration",
  },
  {
    icon: Share2,
    t: "Facebook & Instagram Ads",
    badge: "Full-Funnel Scale",
    stat: "5.2x Avg ROAS",
    best: "Scroll-stopping Reels and carousel creatives aimed at laser lookalikes and interest-targeted local consumers.",
    tags: ["Viral Video Reels", "CAPI Tracking", "Lookalike Audiences"],
    goal: "Direct Conversions & Ecom Sales",
  },
  {
    icon: Briefcase,
    t: "LinkedIn B2B Ads",
    badge: "Enterprise B2B",
    stat: "CXO Targeting",
    best: "Reach decision-makers, CXOs, and business founders filtered by job title, company size, and revenue bracket.",
    tags: ["Account-Based Ads", "Job Title Targeting", "Lead Gen Forms"],
    goal: "High-Ticket B2B Contracts",
  },
  {
    icon: MessageCircle,
    t: "WhatsApp Click-to-Chat",
    badge: "Instant Close",
    stat: "< 30s Replies",
    best: "Skip clunky web forms with 1-click WhatsApp ads that start warm, personalized sales conversations immediately.",
    tags: ["1-Tap WhatsApp", "Automated Flows", "Verified Business"],
    goal: "Instant Chats & Consultations",
  },
  {
    icon: MapPin,
    t: "Maps & Local Pack Ads",
    badge: "Near-Me Dominance",
    stat: "Top 3 Rank",
    best: "Rank #1 when customers search 'best near me' in Lucknow and surrounding areas with verified reviews and map pins.",
    tags: ["Google Maps Pack", "Local Citations", "Direction Clicks"],
    goal: "Walk-Ins, Calls & Store Visits",
  },
];

function AdsShowcase() {
  const [gRef, gSeen] = useInView<HTMLDivElement>(0.15);
  const [mRef, mSeen] = useInView<HTMLDivElement>(0.2);
  const [pRef, pSeen] = useInView<HTMLDivElement>(0.15);

  return (
    <>
      {/* ---------------- GOOGLE ADS ---------------- */}
      <section className="dm-section dg-google" id="dm-google" aria-labelledby="dg-g-h">
        <div className="container dg-split">
          <div className="dg-copy">
            <Head eyebrow="Google Search Ads" lead="Someone in Lucknow or across India searches for your exact service. Your ad appears at position #1, capturing high-intent buyers with zero wasted budget.">
              <span id="dg-g-h">Be there when <em>they search.</em></span>
            </Head>
            <div className="dg-pts-grid">
              <div className="dg-pt-card">
                <div className="dg-pt-icon"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <strong>High-Intent Keyword Precision</strong>
                  <p>Target active buyers searching for solutions right now, not casual browsers.</p>
                </div>
              </div>
              <div className="dg-pt-card">
                <div className="dg-pt-icon"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <strong>Negative Keyword Filtering</strong>
                  <p>We block 300+ junk & competitor search terms so zero ad budget is wasted.</p>
                </div>
              </div>
              <div className="dg-pt-card">
                <div className="dg-pt-icon"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <strong>100% Verified Call & Lead Tracking</strong>
                  <p>Phone calls, WhatsApp chats, and forms tied to actual revenue dashboards.</p>
                </div>
              </div>
              <div className="dg-pt-card">
                <div className="dg-pt-icon"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <strong>Weekly ROAS Optimization</strong>
                  <p>Underperforming copy paused, winning keywords scaled to keep CPL low.</p>
                </div>
              </div>
            </div>
            <p className="dg-fine">Live Lucknow campaign simulator, audited performance metrics.</p>
          </div>

          <div className={`dg-visual${gSeen ? " is-in" : ""}`} ref={gRef}>
            <div className="dg-serp" aria-label="Illustration of a Google search ad">
              {/* Browser Window Header */}
              <div className="dg-serp__chrome">
                <div className="dg-serp__dots">
                  <span className="dg-serp__dot dg-serp__dot--red" />
                  <span className="dg-serp__dot dg-serp__dot--yellow" />
                  <span className="dg-serp__dot dg-serp__dot--green" />
                </div>
                <div className="dg-serp__address">
                  <span className="dg-serp__ssl">🔒</span>
                  <span className="dg-serp__url">google.com/search?q=digital+marketing+agency+in+lucknow</span>
                </div>
                <span className="dg-serp__loc-badge"><MapPin size={11} /> Lucknow, UP</span>
              </div>

              {/* Realistic Google Search Input */}
              <div className="dg-serp__bar">
                <Search size={16} className="dg-serp__search-ic" aria-hidden="true" />
                <div className="dg-typed-wrap">
                  <span className="dg-typed">digital marketing agency in lucknow</span>
                  <i className="dg-caret" aria-hidden="true" />
                </div>
                <span className="dg-serp__btn">Search</span>
              </div>

              {/* High-Converting Google Search Ad */}
              <div className="dg-ad" data-cursor="GOOGLE AD">
                <div className="dg-ad__header">
                  <div className="dg-ad__favicon">SW</div>
                  <div className="dg-ad__advertiser">
                    <span className="dg-ad__brand">Sipher Webtech <span className="dg-ad__verified">✔</span></span>
                    <span className="dg-ad__url">https://sipherweb.com › services › google-ads-lucknow</span>
                  </div>
                  <div className="dg-ad__badges">
                    <span className="dg-ad__badge-sponsored">
                      <span className="dg-ad__dot" /> Sponsored
                    </span>
                    <span className="dg-ad__badge-rank">Top #1 Ad</span>
                  </div>
                </div>

                <h4 className="dg-ad__title">Best Digital Marketing & Google Ads Agency in Lucknow | Sipher</h4>

                <div className="dg-ad__rating">
                  <div className="dg-ad__stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} className="dg-ad__star" fill="#ffb400" />
                    ))}
                  </div>
                  <span className="dg-ad__rating-text">4.9 (140+ Google Reviews) • Google Partner • Lucknow, UP</span>
                </div>

                <p className="dg-ad__desc">
                  Stop burning ad budget on cold clicks. We build negative keyword filters, track 100% of phone calls & deliver ₹18 avg. CPL. Book a free 30-min strategy audit today.
                </p>

                {/* Sitelink Extensions Grid */}
                <div className="dg-ad__sitelinks">
                  <div className="dg-ad__sitelink">
                    <span className="dg-ad__sitelink-title">⚡ Free Ads Audit (₹5K Value)</span>
                    <span className="dg-ad__sitelink-sub">Cut wasted spend in 24 hours</span>
                  </div>
                  <div className="dg-ad__sitelink">
                    <span className="dg-ad__sitelink-title">📈 4.8x ROAS Case Studies</span>
                    <span className="dg-ad__sitelink-sub">Real Lucknow client proofs</span>
                  </div>
                  <div className="dg-ad__sitelink">
                    <span className="dg-ad__sitelink-title">💰 Transparent Pricing</span>
                    <span className="dg-ad__sitelink-sub">No locked-in contracts</span>
                  </div>
                  <div className="dg-ad__sitelink">
                    <span className="dg-ad__sitelink-title">📞 Call +91 91189 89898</span>
                    <span className="dg-ad__sitelink-sub">Instant response in 15 mins</span>
                  </div>
                </div>

                {/* Interactive Click Ripple Animation */}
                <div className="dg-click" aria-hidden="true">
                  <MousePointerClick size={22} />
                  <span className="dg-click__ripple" />
                </div>
              </div>

              {/* Organic search results snippet underneath */}
              <div className="dg-org" aria-hidden="true">
                <div className="dg-org__header">
                  <span className="dg-org__label">Organic Results</span>
                  <span className="dg-org__cite">sipherweb.com › seo-lucknow</span>
                </div>
                <div className="dg-org__line dg-org__line--title" />
                <div className="dg-org__line dg-org__line--desc" />
              </div>
            </div>

            {/* Performance Tiles */}
            <dl className="dg-tiles">
              <div className="dg-tile" data-cursor="METRIC">
                <dt><Eye size={14} aria-hidden="true" />Impressions</dt>
                <dd><Count to={48200} run={gSeen} /></dd>
                <span className="dg-tile__trend dg-tile__trend--up">▲ +34% MoM</span>
              </div>
              <div className="dg-tile" data-cursor="METRIC">
                <dt><MousePointerClick size={14} aria-hidden="true" />High-Intent Clicks</dt>
                <dd><Count to={2170} run={gSeen} /></dd>
                <span className="dg-tile__trend dg-tile__trend--up">▲ 14.8% CTR</span>
              </div>
              <div className="dg-tile" data-cursor="METRIC">
                <dt><Target size={14} aria-hidden="true" />Click Rate (CTR)</dt>
                <dd><Count to={4.5} run={gSeen} dec={1} suf="%" /></dd>
                <span className="dg-tile__trend dg-tile__trend--up">3.2x vs Avg</span>
              </div>
              <div className="dg-tile" data-cursor="METRIC">
                <dt><TrendingDown size={14} aria-hidden="true" />Avg. Cost Per Click</dt>
                <dd><Count to={24} run={gSeen} pre="₹" /></dd>
                <span className="dg-tile__trend dg-tile__trend--good">▼ 42% Lower CPL</span>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- META ADS (dark) ---------------- */}
      <section className="dm-section dg-meta" id="dm-meta" aria-labelledby="dg-m-h">
        <div className="container">
          <Head center dark eyebrow="Facebook and Instagram Ads" lead="Data-backed video creative shown directly to Lucknow & pan-India buyers who match your top clients, then nurtured until they convert.">
            <span id="dg-m-h">Meta Ads that <em>find your people.</em></span>
          </Head>

          <div className={`dg-metagrid${mSeen ? " is-in" : ""}`} ref={mRef}>
            {/* Left: Realistic Instagram Feed Ad Mockup */}
            <div className="dg-phonewrap">
              <div className="dg-phone" aria-label="Illustration of an Instagram ad" data-cursor="META AD">
                <span className="dg-phone__notch" aria-hidden="true" />
                <div className="dg-ig">
                  {/* Instagram Header */}
                  <header className="dg-ig__head">
                    <div className="dg-ig__av-wrap">
                      <span className="dg-ig__av">SW</span>
                    </div>
                    <div className="dg-ig__user">
                      <div className="dg-ig__user-top">
                        <b>sipherwebtech</b>
                        <span className="dg-ig__badge-ver">✔</span>
                      </div>
                      <small>Sponsored • 📍 Lucknow & NCR</small>
                    </div>
                    <span className="dg-ig__more">•••</span>
                  </header>

                  {/* High-Converting Ad Creative Banner */}
                  <div className="dg-ig__img">
                    <div className="dg-ig__img-top">
                      <span className="dg-ig__badge">⚡ 5.4x ROAS Proof</span>
                      <span className="dg-ig__audio-pill"><Play size={9} fill="currentColor" /> ♫ Trending Audio</span>
                    </div>
                    <div className="dg-ig__img-body">
                      <span className="dg-ig__img-tag">Performance Funnel</span>
                      <p className="dg-ig__img-hook">Turn Instagram Scrollers into Paying Lucknow Clients</p>
                      <div className="dg-ig__img-metric">
                        <span>🚀 +380% Inbound Leads</span>
                        <span>₹48 Avg CPL</span>
                        <span>5.4x ROAS</span>
                      </div>
                    </div>
                    <div className="dg-ig__video-progress">
                      <i />
                    </div>
                    <div className="dg-ig__carousel-dots">
                      <span className="is-active" />
                      <span />
                      <span />
                    </div>
                  </div>

                  {/* Instagram Sponsored CTA Bar */}
                  <div className="dg-ig__cta">
                    <div className="dg-ig__cta-left">
                      <strong>Book Free 30-Min Strategy Call</strong>
                      <small>Instant WhatsApp Callback in 15 Mins</small>
                    </div>
                    <span className="dg-ig__cta-btn">Book Now <ArrowRight size={13} aria-hidden="true" /></span>
                  </div>

                  {/* Actions Row */}
                  <div className="dg-ig__bar">
                    <Heart size={18} className="dg-ig__heart" aria-hidden="true" />
                    <MessageCircle size={18} aria-hidden="true" />
                    <Send size={18} aria-hidden="true" />
                    <Bookmark size={18} className="dg-ig__save" aria-hidden="true" />
                  </div>

                  {/* Engagement Counts & Caption */}
                  <div className="dg-ig__footer">
                    <p className="dg-ig__likes">
                      <b><Count to={4280} run={mSeen} /> likes</b> • 142 comments
                    </p>
                    <p className="dg-ig__caption">
                      <b>sipherwebtech</b> Stop burning budget on random boost posts. We build high-converting Meta funnels with laser lookalikes... <span className="dg-ig__more-txt">more</span>
                    </p>
                    <div className="dg-ig__sub-comments">
                      <span>View all 48 comments</span>
                      <small>2 days ago</small>
                    </div>
                  </div>
                </div>

                <span className="dg-phone__home-bar" aria-hidden="true" />

                {/* Floating Heart Reactions */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <Heart key={i} size={16} className="dg-float" style={{ "--i": i } as CSSProperties} aria-hidden="true" />
                ))}
              </div>

              {/* Verified Monthly Reach Badge */}
              <div className="dg-reach">
                <Users size={15} aria-hidden="true" />
                <span><b><Count to={120000} run={mSeen} fmt={lakh} /></b> Targeted Lucknow Reach • 5.4x ROAS</span>
              </div>
            </div>

            {/* Right: Meta Ads Manager Performance Dashboard */}
            <div className="dg-panel">
              {/* Campaign Top Bar */}
              <div className="dg-panel__top-bar">
                <div className="dg-panel__status">
                  <span className="dg-panel__status-dot" />
                  <span>Meta Campaign Active</span>
                </div>
                <div className="dg-panel__budget-tag">
                  ₹1,500/day • Dynamic Creative Testing
                </div>
              </div>

              {/* Audience Targeting Matrix */}
              <div className="dg-panel__sec">
                <div className="dg-panel__sec-head">
                  <p className="dg-panel__label">🎯 Who Sees The Ad (Laser Audience Targeting)</p>
                  <span className="dg-panel__sub-tag">0% Wasted Impressions</span>
                </div>
                <ul className="dg-chips">
                  {TARGETING.map((t, i) => (
                    <li key={t.t} style={{ "--i": i } as CSSProperties}>
                      <span>{t.t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversion Funnel */}
              <div className="dg-panel__sec">
                <div className="dg-panel__sec-head">
                  <p className="dg-panel__label">📈 Full-Funnel Conversion Path</p>
                  <span className="dg-panel__sub-tag">Audited Meta CAPI Data</span>
                </div>
                <div className="dg-funnel-list">
                  {FUNNEL.map((f, i) => (
                    <div className="dg-fitem" key={f.l} style={{ "--w": `${f.w}%`, "--i": i } as CSSProperties}>
                      <div className="dg-fitem__header">
                        <span className="dg-fitem__label">{f.l}</span>
                        <span className="dg-fitem__val"><Count to={f.v} run={mSeen} /></span>
                      </div>
                      <div className="dg-fitem__bar-wrap">
                        <div className="dg-fitem__bar"><i /></div>
                        <span className="dg-fitem__rate">{f.rate}</span>
                      </div>
                      <div className="dg-fitem__sub">{f.tag}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PLATFORM GRID ---------------- */}
      <section className="dm-section dg-plat" aria-labelledby="dg-p-h">
        <div className="container">
          <Head center eyebrow="Where we advertise" lead="We pick the platforms that fit your customer, not the ones that are fashionable.">
            <span id="dg-p-h">The right ad platform, <em>every time.</em></span>
          </Head>
          <div className={`dg-pgrid${pSeen ? " is-in" : ""}`} ref={pRef}>
            {PLATFORMS.map((p, i) => (
              <article className="dg-pcard" key={p.t} style={{ "--i": i } as CSSProperties}>
                <div className="dg-pcard__header">
                  <span className="dg-pcard__ic">
                    <p.icon size={22} aria-hidden="true" />
                  </span>
                  <div className="dg-pcard__meta">
                    <span className="dg-pcard__badge">{p.badge}</span>
                    <span className="dg-pcard__stat">{p.stat}</span>
                  </div>
                </div>

                <div className="dg-pcard__body">
                  <h3 className="dg-pcard__title">{p.t}</h3>
                  <p className="dg-pcard__desc">{p.best}</p>
                </div>

                <div className="dg-pcard__tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="dg-pcard__tag">{tag}</span>
                  ))}
                </div>

                <div className="dg-pcard__goal">
                  <span className="dg-pcard__goal-label">🎯 Goal</span>
                  <strong className="dg-pcard__goal-val">{p.goal}</strong>
                  <ArrowRight size={13} className="dg-pcard__goal-arrow" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================================================== GROWTH LAB */
const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"] as const;
type Metric = { id: string; label: string; icon: LucideIcon; fmt: (n: number) => string; withUs: number[]; baseline: number[]; lower?: boolean };
const METRICS: Metric[] = [
  { id: "leads", label: "Leads", icon: Users, fmt: (n) => inr(n), withUs: [38, 52, 70, 96, 128, 168], baseline: [38, 40, 43, 44, 47, 49] },
  { id: "sales", label: "Sales", icon: TrendingUp, fmt: (n) => `₹${n.toFixed(1)} L`, withUs: [1.2, 1.9, 2.8, 4.1, 5.6, 7.8], baseline: [1.2, 1.3, 1.4, 1.5, 1.5, 1.6] },
  { id: "reach", label: "Reach", icon: Eye, fmt: (n) => `${inr(n)}K`, withUs: [42, 61, 88, 126, 171, 236], baseline: [42, 44, 47, 49, 52, 54] },
  { id: "cpl", label: "Cost per lead", icon: TrendingDown, fmt: (n) => `₹${inr(n)}`, withUs: [412, 380, 338, 301, 276, 248], baseline: [412, 418, 425, 431, 436, 441], lower: true },
];
const CHANNEL_SHARE = [
  { n: "Google Search", v: 38 }, { n: "Meta Ads", v: 29 }, { n: "SEO and content", v: 18 }, { n: "WhatsApp and email", v: 15 },
] as const;

const W = 600, H = 270, PL = 52, PR = 18, PT = 22, PB = 36;
const curve = (pts: Array<[number, number]>) =>
  pts.map(([x, y], i) => (i ? `C${(pts[i - 1][0] + x) / 2},${pts[i - 1][1]} ${(pts[i - 1][0] + x) / 2},${y} ${x},${y}` : `M${x},${y}`)).join(" ");

function GrowthLab() {
  const [mi, setMi] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const m = METRICS[mi];
  const n = MONTHS.length;

  const g = useMemo(() => {
    const max = Math.max(...m.withUs, ...m.baseline) * 1.15;
    const x = (i: number) => PL + (i * (W - PL - PR)) / (n - 1);
    const y = (v: number) => PT + (H - PT - PB) * (1 - v / max);
    const a = m.withUs.map((v, i) => [x(i), y(v)] as [number, number]);
    const b = m.baseline.map((v, i) => [x(i), y(v)] as [number, number]);
    const line = curve(a);
    return { x, y, a, line, base: curve(b), area: `${line} L${x(n - 1)},${H - PB} L${x(0)},${H - PB} Z`, max };
  }, [m, n]);

  const first = m.withUs[0], last = m.withUs[n - 1], baseLast = m.baseline[n - 1];
  const change = m.lower ? ((first - last) / first) * 100 : ((last - first) / first) * 100;
  const vsBase = m.lower ? ((baseLast - last) / baseLast) * 100 : ((last - baseLast) / baseLast) * 100;
  const hi = hover ?? n - 1;

  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((px - PL) / (W - PL - PR)) * (n - 1)))));
  };

  return (
    <section className="dm-section dg-lab" id="dm-lab" aria-labelledby="dg-l-h">
      <div className="container">
        <Head center eyebrow="Growth lab" lead="Pick a metric and see how a managed campaign can compare with doing nothing new. Hover the chart to read each month.">
          <span id="dg-l-h">Watch the numbers <em>climb.</em></span>
        </Head>

        <div className={`dg-labcard${seen ? " is-in" : ""}`} ref={ref}>
          <div className="dg-tabs" role="tablist" aria-label="Metric">
            {METRICS.map((t, i) => (
              <button key={t.id} type="button" role="tab" aria-selected={mi === i} className={mi === i ? "is-on" : ""} onClick={() => { setMi(i); setHover(null); }}>
                <t.icon size={16} aria-hidden="true" />{t.label}
              </button>
            ))}
          </div>

          <div className="dg-labgrid">
            <div className="dg-chartwrap">
              <svg viewBox={`0 0 ${W} ${H}`} className="dg-chart" role="img" aria-label={`${m.label} from June to November, managed campaign versus baseline`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const yy = PT + (H - PT - PB) * (1 - t);
                  return (
                    <g key={t}>
                      <line x1={PL} x2={W - PR} y1={yy} y2={yy} className="dg-grid" />
                      <text x={PL - 8} y={yy + 4} className="dg-axis" textAnchor="end">{m.fmt(g.max * t)}</text>
                    </g>
                  );
                })}
                {MONTHS.map((mo, i) => <text key={mo} x={g.x(i)} y={H - 12} className="dg-axis" textAnchor="middle">{mo}</text>)}

                <g key={m.id}>
                  <path d={g.area} className="dg-area" />
                  <path d={g.base} className="dg-base" />
                  <path d={g.line} className="dg-line" pathLength={1} />
                </g>
                {hover !== null && <line x1={g.x(hover)} x2={g.x(hover)} y1={PT} y2={H - PB} className="dg-cross" />}
                <circle cx={g.a[hi][0]} cy={g.a[hi][1]} r="6" className="dg-dot" />
                <circle cx={g.x(hi)} cy={g.y(m.baseline[hi])} r="4.5" className="dg-dot dg-dot--base" />
              </svg>
              <div className="dg-tip" style={{ left: `${(g.x(hi) / W) * 100}%` }}>
                <b>{MONTHS[hi]}</b>
                <span><i />With Sipher <strong>{m.fmt(m.withUs[hi])}</strong></span>
                <span><i className="is-base" />Without <strong>{m.fmt(m.baseline[hi])}</strong></span>
              </div>
              <ul className="dg-legend2"><li><i />Managed campaign</li><li><i className="is-base" />No new marketing</li></ul>
            </div>

            <div className="dg-side">
              <div className="dg-big">
                <p>{m.label} in {MONTHS[n - 1]}</p>
                <b>{m.fmt(last)}</b>
                <span className="dg-up"><TrendingUp size={14} aria-hidden="true" />{m.lower ? "-" : "+"}{Math.abs(change).toFixed(0)}% since {MONTHS[0]}</span>
                <span className="dg-vs">{Math.abs(vsBase).toFixed(0)}% {m.lower ? "lower" : "higher"} than the baseline</span>
              </div>
              <div className="dg-share">
                <p>Where leads come from</p>
                {CHANNEL_SHARE.map((c) => (
                  <div className="dg-share__row" key={c.n} style={{ "--w": `${c.v * 2.4}%` } as CSSProperties}>
                    <span>{c.n}</span><i /><b>{c.v}%</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="dg-fine">Sample data for illustration. Your results depend on your market, offer and follow-up speed.</p>
        </div>
      </div>
    </section>
  );
}

export default function DigitalMarketing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [goal, setGoal] = useState(0);
  const [seg, setSeg] = useState<number | null>(null);
  const goalFirst = useRef(true);
  const [flip, setFlip] = useState<boolean[]>(() => MYTHS.map(() => false));
  const [roi, setRoi] = useState<Record<RoiKey, number>>(ROI_DEFAULT);

  const est = useMemo(() => {
    const leads = roi.budget / roi.cpl;
    const customers = leads * (roi.rate / 100);
    const revenue = customers * roi.aov;
    return { leads, customers, revenue, cpc: customers > 0 ? roi.budget / customers : 0, roas: roi.budget > 0 ? revenue / roi.budget : 0 };
  }, [roi]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => Array.from(c.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string, c: ParentNode = root) => c.querySelector<T>(s) as T;

    /* cursor spotlight on bento cards (cosmetic, any motion setting) */
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(".dm-b");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", onMove);

    const mm = gsap.matchMedia(root);

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
      const { motion, wide } = ctx.conditions as unknown as { motion: boolean; wide: boolean };
      if (!motion) return;
      const off: Array<() => void> = [];
      root.classList.add("is-motion");

      /* ---- hero ---- */
      {
        const crumbs = $(".dm-hero .breadcrumb");
        const words = $(".dm-hero__title .dm-w > span");
        const rest = $(".dm-hero__lead, .dm-hero__cta > *, .dm-trust li");
        const visual = one(".dm-hero__visual");
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        if (crumbs.length) tl.from(crumbs, { y: 16, autoAlpha: 0, duration: 0.6, clearProps: "all" });
        if (words.length) tl.from(words, { yPercent: 115, duration: 1, stagger: 0.06, clearProps: "transform" }, 0.1);
        if (rest.length) tl.from(rest, { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.5);
        if (visual) tl.from(visual, { y: 32, autoAlpha: 0, duration: 1, clearProps: "all" }, 0.4);
      }

      /* ---- journey: pinned horizontal scroll (desktop only) ---- */
      if (wide) {
        const section = one(".dm-journey"), wrap = one(".dm-jwrap"), track = one(".dm-jtrack"), bar = one(".dm-jprog i");
        if (section && wrap && track) {
          section.classList.add("is-hscroll");
          const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
          const tw = gsap.to(track, {
            x: () => -dist(), ease: "none",
            scrollTrigger: {
              trigger: section, start: "top top", end: () => `+=${dist() + window.innerHeight * 0.35}`, pin: true, scrub: 0.7,
              anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10,
              onUpdate: (s) => { if (bar) bar.style.transform = `scaleX(${Math.max(0.03, s.progress)})`; },
            },
          });
          $(".dm-jcard", track).forEach((card) => {
            const img = one(".dm-jcard__img", card);
            if (img) gsap.fromTo(img, { scale: 1.08 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tw, start: "left 95%", end: "right 5%", scrub: true } });
          });
          off.push(() => { section.classList.remove("is-hscroll"); if (bar) bar.style.transform = ""; });
        }
      }

      /* ---- bento mini-visuals ---- */
      {
        const serp = one(".dm-serp");
        if (serp) {
          const rows = $("li", serp), you = rows[0];
          const h = rows[0].offsetHeight + 8;
          gsap.set(you, { y: h * 3 });
          gsap.set(rows.slice(1), { y: -h });
          ScrollTrigger.create({ trigger: serp, start: "top 82%", once: true, onEnter: () => {
            gsap.to(rows.slice(1), { y: 0, duration: 0.9, ease: "power3.inOut", delay: 0.4 });
            gsap.to(you, { y: 0, duration: 1.1, ease: "power3.inOut", delay: 0.4 });
          } });
        }
        const segBars = $(".dm-seg i");
        if (segBars.length) { gsap.set(segBars, { scaleX: 0 }); ScrollTrigger.create({ trigger: segBars[0], start: "top 85%", once: true, onEnter: () => gsap.to(segBars, { scaleX: 1, duration: 1, stagger: 0.15, ease: "power3.out" }) }); }
        const chat = $(".dm-chat > *");
        if (chat.length) { gsap.set(chat, { autoAlpha: 0, y: 14 }); ScrollTrigger.create({ trigger: chat[0], start: "top 85%", once: true, onEnter: () => gsap.to(chat, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.75, ease: "power2.out", delay: 0.3 }) }); }
        const spark = one<SVGPathElement>(".dm-spark__line");
        if (spark) {
          const L = spark.getTotalLength();
          gsap.set(spark, { strokeDasharray: L, strokeDashoffset: L });
          ScrollTrigger.create({ trigger: spark, start: "top 88%", once: true, onEnter: () => gsap.to(spark, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }) });
        }
      }

      /* ---- process: stacked cards scale back as the next one arrives ---- */
      {
        const cards = $(".dm-stackcard");
        cards.forEach((c, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(c, { scale: 0.94, ease: "none", scrollTrigger: { trigger: next, start: "top 78%", end: "top 28%", scrub: true } });
        });
      }

      /* ---- scroll-driven marquee band ---- */
      {
        const rows = $(".dm-band__row");
        rows.forEach((r, i) => gsap.fromTo(r, { xPercent: i % 2 ? -22 : 0 }, { xPercent: i % 2 ? 0 : -22, ease: "none", scrollTrigger: { trigger: ".dm-band", start: "top bottom", end: "bottom top", scrub: true } }));
      }

      /* ---- reveals: IntersectionObserver (does not depend on scroll positions) ---- */
      {
        const items = $("[data-reveal]");
        const clear = (el: HTMLElement) => window.setTimeout(() => el.removeAttribute("data-reveal"), 1100);
        if (!("IntersectionObserver" in window)) {
          items.forEach((el) => el.removeAttribute("data-reveal"));
        } else {
          let n = 0;
          const io = new IntersectionObserver((es) => {
            es.forEach((e) => {
              if (!e.isIntersecting) return;
              const el = e.target as HTMLElement;
              el.style.setProperty("--d", `${(n++ % 4) * 90}ms`);
              el.classList.add("is-in");
              clear(el);
              io.unobserve(el);
            });
          }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
          items.forEach((el) => io.observe(el));
          off.push(() => { io.disconnect(); items.forEach((el) => el.classList.remove("is-in")); });
        }
      }

      /* triggers were created out of page order (pin first): sort, then measure again */
      ScrollTrigger.sort();
      const r1 = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      off.push(() => window.cancelAnimationFrame(r1));

      return () => { off.forEach((f) => f()); root.classList.remove("is-motion"); };
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => { root.removeEventListener("pointermove", onMove); window.removeEventListener("load", refresh); mm.revert(); };
  }, []);

  /* goal change: re-run donut + copy transitions */
  useLayoutEffect(() => {
    if (goalFirst.current) { goalFirst.current = false; return; }
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".dm-gx__info > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, clearProps: "all" });
      gsap.fromTo(".dm-gx__step", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.15, clearProps: "all" });
    }, root);
    return () => ctx.revert();
  }, [goal]);

  const G = GOALS[goal];
  const isDefault = (Object.keys(ROI_DEFAULT) as RoiKey[]).every((k) => roi[k] === ROI_DEFAULT[k]);
  const segs = useMemo(() => {
    let acc = 0;
    return G.mix.map((m, i) => {
      const len = (m.v / 100) * DONUT_C;
      const s = { len: Math.max(0, len - 5), off: -acc, color: SEG_COLORS[i] };
      acc += len;
      return s;
    });
  }, [G]);
  const shown = seg !== null ? G.mix[seg] : null;

  return (
    <>
      <Seo
        title="Digital Marketing Services in Indore | SEO, Ads, Social Media | Sipher Webtech"
        description="Digital marketing for SEO, Google and Meta ads, social media, content, email and WhatsApp. Tracked end to end with monthly reports. Get a free consultation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="dm" ref={rootRef}>

        {/* =========================== HERO =========================== */}
        <section className="dm-hero" aria-labelledby="dm-h1">
          <div className="container dm-hero__grid">
            <div className="dm-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">Digital Marketing</span>
              </nav>
              <h1 id="dm-h1" className="dm-hero__title" aria-label="Marketing that brings you more enquiries and customers.">
                <span className="dm-line" aria-hidden="true"><Words text="Marketing that brings you" /></span>
                <em className="dm-line" aria-hidden="true"><Words text="more enquiries & sales." /></em>
              </h1>
              <p className="dm-hero__lead">
                Sipher Web plans and runs SEO, Google and Meta ads, social media, content, email and WhatsApp campaigns for businesses in Indore and across India. Every lead is tracked to its source, and you get a plain-language report each month.
              </p>
              <div className="dm-hero__cta">
                <Link className="button button--primary dm-hero__main" to="/contact" data-cursor="START">
                  <span>Plan your growth</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <a className="dm-ghost" href="#dm-sim">
                  Growth simulator
                </a>
              </div>
              <ul className="dm-trust">
                {["Tracked end to end", "You own the accounts", "Monthly reporting", "No lock-in contracts"].map((t) => (
                  <li key={t}>
                    <Check aria-hidden="true" size={14} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="dm-hero__visual">
              <img
                className="dm-hero__illustration"
                src="/svg/sipher-digital-marketing.svg"
                alt="Digital Marketing Growth Engine"
                width={800}
                height={640}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <TechStackRibbons lanes={DM_RIBBON_LANES} />

        {/* =========================== JOURNEY: horizontal scroll =========================== */}
        <section className="dm-journey" id="dm-journey" aria-labelledby="dm-j-h">
          <div className="container dm-journey__head">
            <Head center eyebrow="The customer journey" lead="Scroll to follow one customer from first glance to loyal repeat buyer. Marketing has a job at every step.">
              <span id="dm-j-h">Five moments <em>that decide a sale.</em></span>
            </Head>
          </div>
          <div className="dm-jwrap">
            <div className="dm-jtrack">
              {JOURNEY.map((s, i) => (
                <article className="dm-jcard" key={s.t}>
                  <div className="dm-jcard__media">
                    <div className="dm-jcard__browser-bar">
                      <div className="dm-jcard__browser-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="dm-jcard__browser-url" aria-hidden="true">
                        {s.url}
                      </div>
                    </div>

                    <div className="dm-jcard__img-wrap">
                      <img
                        src={s.img}
                        alt={s.t}
                        className="dm-jcard__img"
                        width={600}
                        height={375}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="dm-jcard__badge-bar">
                        <span className="dm-jcard__phase-pill">
                          <i className="dm-jcard__phase-dot" aria-hidden="true" />
                          Phase 0{i + 1}
                        </span>
                        <span className="dm-jcard__icon-badge" aria-hidden="true">
                          <s.icon size={16} />
                        </span>
                      </div>
                      <div className="dm-jcard__goal-badge">
                        <span>{s.goal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dm-jcard__body">
                    <div className="dm-jcard__header">
                      <span className="dm-jcard__num-badge" aria-hidden="true">0{i + 1}</span>
                      <h3>{s.t}</h3>
                    </div>
                    <p>{s.p}</p>
                    <div className="dm-jcard__tags" aria-label="Channels involved">
                      {s.tags.map((t) => (
                        <span key={t} className="dm-tag-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== BENTO: live channel tiles =========================== */}
        <section className="dm-section dm-bento" aria-labelledby="dm-b-h">
          <div className="container">
            <Head center eyebrow="What we run" lead="Six channels that work together. We start with the ones that fit your goal and budget, not all of them at once.">
              <span id="dm-b-h">Every channel, <em>in motion.</em></span>
            </Head>
            <div className="dm-bgrid">
              <article className="dm-b dm-b--seo" data-reveal data-cursor="SEO RANK">
                <div className="dm-b__head-row">
                  <header>
                    <span className="dm-b__ic"><Search size={18} /></span>
                    <div>
                      <h3>SEO and local search</h3>
                      <span className="dm-b__sub-badge">Page 1 & Google Maps Pack</span>
                    </div>
                  </header>
                  <span className="dm-b__rank-pill">
                    <span className="dm-b__dot-live" />
                    Rank #1
                  </span>
                </div>
                <p>Technical audits, high-intent keyword optimization, and Google Business profile dominance so Lucknow & pan-India buyers discover you first.</p>

                {/* Customized Google SERP Mockup */}
                <div className="dm-seo-mockup">
                  {/* Search query input */}
                  <div className="dm-seo-mockup__search">
                    <Search size={13} className="dm-seo-mockup__q-icon" />
                    <span className="dm-seo-mockup__query">
                      digital marketing company in lucknow
                      <span className="dm-seo-cursor" aria-hidden="true" />
                    </span>
                    <span className="dm-seo-mockup__loc"><MapPin size={11} /> Lucknow</span>
                  </div>

                  {/* Top Result Card (Your Site) */}
                  <div className="dm-seo-mockup__card" data-cursor="PAGE #1">
                    <div className="dm-seo-mockup__meta">
                      <div className="dm-seo-mockup__favicon">SW</div>
                      <div className="dm-seo-mockup__url-wrap">
                        <span className="dm-seo-mockup__site">Sipher Webtech</span>
                        <span className="dm-seo-mockup__cite">https://sipherweb.com › services › seo</span>
                      </div>
                      <span className="dm-seo-mockup__badge-top">#1 Organic</span>
                    </div>
                    <h4 className="dm-seo-mockup__title">Best Digital Marketing & SEO Company in Lucknow | Sipher</h4>
                    <p className="dm-seo-mockup__snippet">
                      Top-ranked agency for SEO, ROI-driven ads & local map pack dominance. 100% tracked leads, transparent reporting & 3.4x average organic growth.
                    </p>
                    <div className="dm-seo-mockup__sitelinks">
                      <span>✓ Google 4.9★ (120+ reviews)</span>
                      <span>✓ Local SEO Pack</span>
                      <span>✓ Free SEO Audit</span>
                    </div>
                  </div>

                  {/* Growth stats footer */}
                  <div className="dm-seo-mockup__stats">
                    <div className="dm-seo-stat">
                      <span className="dm-seo-stat__val">#1</span>
                      <span className="dm-seo-stat__lbl">Google Rank</span>
                    </div>
                    <div className="dm-seo-stat">
                      <span className="dm-seo-stat__val">
                        <i className="dm-seo-stat__arr" aria-hidden="true">▲</i> +340%
                      </span>
                      <span className="dm-seo-stat__lbl">Organic Traffic</span>
                    </div>
                    <div className="dm-seo-stat">
                      <span className="dm-seo-stat__val">4.9 ★</span>
                      <span className="dm-seo-stat__lbl">Maps Rating</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="dm-b dm-b--ads" data-reveal data-cursor="PPC ADS">
                <div className="dm-b__head-row">
                  <header>
                    <span className="dm-b__ic"><Megaphone size={18} /></span>
                    <div>
                      <h3>Google and Meta ads</h3>
                      <span className="dm-b__sub-badge">High-Intent Search & Dynamic Social Retargeting</span>
                    </div>
                  </header>
                  <span className="dm-b__roas-pill">
                    <span className="dm-b__dot-live" />
                    4.8x ROAS Live
                  </span>
                </div>
                <p>Budget goes behind high-converting Google searchers and laser-targeted Instagram feeds, with automated retargeting for people who almost bought.</p>

                {/* Dual Campaign Mockup Container */}
                <div className="dm-ads-mockup">
                  <div className="dm-ads-grid">
                    {/* Left: Google Search Ad */}
                    <div className="dm-ad-card dm-ad-card--google" data-cursor="GOOGLE">
                      <div className="dm-ad-card__top">
                        <span className="dm-ad-card__tag">Sponsored • Google Search</span>
                        <span className="dm-ad-card__badge">Top #1 Ad</span>
                      </div>
                      <div className="dm-ad-card__cite">sipherweb.com/scale-fast</div>
                      <h4 className="dm-ad-card__title">Scale Your Sales with High-Intent Google Ads</h4>
                      <p className="dm-ad-card__copy">Stop wasting ad budget on cold clicks. Get verified inbound enquiries with negative keyword filtering.</p>
                      <div className="dm-ad-card__metrics">
                        <span><strong>CTR:</strong> 14.8%</span>
                        <span><strong>Avg CPL:</strong> ₹18</span>
                      </div>
                    </div>

                    {/* Right: Meta Instagram / Facebook Ad */}
                    <div className="dm-ad-card dm-ad-card--meta" data-cursor="META">
                      <div className="dm-ad-card__top">
                        <span className="dm-ad-card__tag dm-ad-card__tag--meta">Sponsored • Instagram & FB</span>
                        <span className="dm-ad-card__badge dm-ad-card__badge--meta">Dynamic Creative</span>
                      </div>
                      <div className="dm-ad-card__cite">Instagram feed • Sipher Webtech</div>
                      <h4 className="dm-ad-card__title">Turn Profile Visitors into Loyal Buyers</h4>
                      <p className="dm-ad-card__copy">High-performing reels & carousel ads targeted to Lucknow and pan-India buying audiences.</p>
                      <div className="dm-ad-card__metrics">
                        <span><strong>ROAS:</strong> 5.2x</span>
                        <span><strong>Conv:</strong> 8.4%</span>
                      </div>
                    </div>
                  </div>

                  {/* Ads Performance Footer */}
                  <div className="dm-ads-stats">
                    <div className="dm-ads-stat">
                      <span className="dm-ads-stat__val">4.8x</span>
                      <span className="dm-ads-stat__lbl">Avg ROAS</span>
                    </div>
                    <div className="dm-ads-stat">
                      <span className="dm-ads-stat__val">₹18-24</span>
                      <span className="dm-ads-stat__lbl">Lowest Lead Cost</span>
                    </div>
                    <div className="dm-ads-stat">
                      <span className="dm-ads-stat__val">94.2%</span>
                      <span className="dm-ads-stat__lbl">Ad Quality Score</span>
                    </div>
                    <div className="dm-ads-stat">
                      <span className="dm-ads-stat__val">100%</span>
                      <span className="dm-ads-stat__lbl">Account Owned</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD 3: Social Media */}
              <article className="dm-b dm-b--social" data-reveal data-cursor="VIRAL">
                <div className="dm-b__head-row">
                  <header>
                    <span className="dm-b__ic"><Share2 size={18} /></span>
                    <div>
                      <h3>Social media & Reels</h3>
                      <span className="dm-b__sub-badge">Brand Authority & Video Growth</span>
                    </div>
                  </header>
                  <span className="dm-b__social-pill">
                    <span className="dm-b__dot-live" />
                    85K+ Reach
                  </span>
                </div>
                <p>Consistent branded reels, carousels, and stories crafted in your voice to warm up prospects before they buy.</p>

                {/* Customized Reel Mockup */}
                <div className="dm-social-mockup">
                  <div className="dm-social-card" data-cursor="REEL">
                    <div className="dm-social-card__header">
                      <div className="dm-social-avatar">SW</div>
                      <div className="dm-social-info">
                        <span className="dm-social-handle">sipherwebtech</span>
                        <span className="dm-social-loc">📍 Lucknow • Trending Audio</span>
                      </div>
                      <span className="dm-social-follow">Follow</span>
                    </div>
                    <div className="dm-social-reel">
                      <div className="dm-social-reel__badge">▶ 24.8K Views</div>
                      <div className="dm-social-reel__hook">
                        <span>How This Lucknow Brand 3.4x'd Sales in 90 Days 🚀</span>
                      </div>
                      <div className="dm-social-actions">
                        <span><Heart size={13} className="dm-social-heart" /> 1.8K</span>
                        <span><MessageCircle size={13} /> 342</span>
                        <span><Share2 size={13} /> 890</span>
                      </div>
                    </div>
                  </div>

                  <div className="dm-social-stats">
                    <div className="dm-social-stat">
                      <span className="dm-social-stat__val">+140%</span>
                      <span className="dm-social-stat__lbl">Engagement</span>
                    </div>
                    <div className="dm-social-stat">
                      <span className="dm-social-stat__val">12</span>
                      <span className="dm-social-stat__lbl">Reels / Mo</span>
                    </div>
                    <div className="dm-social-stat">
                      <span className="dm-social-stat__val">85K+</span>
                      <span className="dm-social-stat__lbl">Monthly Reach</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD 4: Email & WhatsApp */}
              <article className="dm-b dm-b--msg" data-reveal data-cursor="WHATSAPP">
                <div className="dm-b__head-row">
                  <header>
                    <span className="dm-b__ic"><Mail size={18} /></span>
                    <div>
                      <h3>Email & WhatsApp</h3>
                      <span className="dm-b__sub-badge">Automated Lead Nurture Flows</span>
                    </div>
                  </header>
                  <span className="dm-b__wa-pill">
                    <span className="dm-b__dot-live" />
                    98% Open Rate
                  </span>
                </div>
                <p>Instant automated WhatsApp & email follow-ups so fresh enquiries never go cold while your team is busy.</p>

                {/* Customized Chat Mockup */}
                <div className="dm-wa-mockup">
                  <div className="dm-wa-card" data-cursor="CHAT">
                    <div className="dm-wa-header">
                      <div className="dm-wa-avatar">SW</div>
                      <div className="dm-wa-meta">
                        <span className="dm-wa-title">Sipher Webtech <span className="dm-wa-check">✔</span></span>
                        <span className="dm-wa-status">Online • Verified Business</span>
                      </div>
                    </div>
                    <div className="dm-wa-chat">
                      <div className="dm-wa-msg dm-wa-msg--in">
                        <p>Hi, saw your ad in Lucknow! Can you share package details?</p>
                        <time>10:14 AM</time>
                      </div>
                      <div className="dm-wa-msg dm-wa-msg--out">
                        <p>Hello! 👋 Here are the growth packages: <strong>Growth-Brochure.pdf</strong>. Would you like a quick strategy call today?</p>
                        <time>10:14 AM ✔✔</time>
                      </div>
                      <div className="dm-wa-badge-call">
                        <Check size={11} /> Strategy Call Booked for 4:00 PM
                      </div>
                    </div>
                  </div>

                  <div className="dm-wa-stats">
                    <div className="dm-wa-stat">
                      <span className="dm-wa-stat__val">&lt; 30s</span>
                      <span className="dm-wa-stat__lbl">Response Time</span>
                    </div>
                    <div className="dm-wa-stat">
                      <span className="dm-wa-stat__val">98%</span>
                      <span className="dm-wa-stat__lbl">Open Rate</span>
                    </div>
                    <div className="dm-wa-stat">
                      <span className="dm-wa-stat__val">3.8x</span>
                      <span className="dm-wa-stat__lbl">Pipeline Lift</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD 5: Analytics and testing */}
              <article className="dm-b dm-b--data" data-reveal data-cursor="ANALYTICS">
                <div className="dm-b__head-row">
                  <header>
                    <span className="dm-b__ic"><BarChart3 size={18} /></span>
                    <div>
                      <h3>Analytics & attribution</h3>
                      <span className="dm-b__sub-badge">100% Tracked Revenue</span>
                    </div>
                  </header>
                  <span className="dm-b__data-pill">
                    <span className="dm-b__dot-live" />
                    Verified ROI
                  </span>
                </div>
                <p>Every single rupee judged by verified phone calls and revenue. Clear dashboards with zero agency fluff.</p>

                {/* Customized Analytics Mockup */}
                <div className="dm-data-mockup">
                  <div className="dm-data-card" data-cursor="METRICS">
                    <div className="dm-data-header">
                      <span className="dm-data-title">Live Revenue Funnel</span>
                      <span className="dm-data-period">Last 30 Days</span>
                    </div>
                    <div className="dm-data-funnel">
                      <div className="dm-data-step">
                        <span className="dm-data-step-lbl">Visitors</span>
                        <div className="dm-data-bar"><i style={{ width: "100%" }} /></div>
                        <span className="dm-data-step-val">12.4K</span>
                      </div>
                      <div className="dm-data-step">
                        <span className="dm-data-step-lbl">Enquiries</span>
                        <div className="dm-data-bar"><i style={{ width: "58%" }} className="is-lead" /></div>
                        <span className="dm-data-step-val">840</span>
                      </div>
                      <div className="dm-data-step">
                        <span className="dm-data-step-lbl">Sales</span>
                        <div className="dm-data-bar"><i style={{ width: "28%" }} className="is-sale" /></div>
                        <span className="dm-data-step-val">72</span>
                      </div>
                    </div>
                  </div>

                  <div className="dm-data-stats">
                    <div className="dm-data-stat">
                      <span className="dm-data-stat__val">₹14.2L</span>
                      <span className="dm-data-stat__lbl">Attributed Revenue</span>
                    </div>
                    <div className="dm-data-stat">
                      <span className="dm-data-stat__val">₹18</span>
                      <span className="dm-data-stat__lbl">Verified CPL</span>
                    </div>
                    <div className="dm-data-stat">
                      <span className="dm-data-stat__val">4.8x</span>
                      <span className="dm-data-stat__lbl">Blended ROAS</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD 6: Content and video (span 12) */}
              <article className="dm-b dm-b--content" data-reveal data-cursor="CREATIVE">
                <div className="dm-b__head-row dm-b__head-row--content">
                  <header>
                    <span className="dm-b__ic"><PenLine size={18} /></span>
                    <div>
                      <h3>Content, Video & Creative Studio</h3>
                      <span className="dm-b__sub-badge">High-Converting Landing Pages, Video Scripts & Pillar Content</span>
                    </div>
                  </header>
                  <span className="dm-b__content-pill">
                    <span className="dm-b__dot-live" />
                    Full-Funnel Assets
                  </span>
                </div>
                <p>Blogs, dedicated landing pages, reel scripts, and customer case stories that educate, persuade, and turn cold visitors into high-paying buyers.</p>

                {/* 4 Multi-Asset Cards Grid */}
                <div className="dm-content-studio-grid">
                  <div className="dm-studio-card" data-cursor="LANDING">
                    <div className="dm-studio-card__head">
                      <span className="dm-studio-badge">⚡ 18.4% Conv</span>
                      <span className="dm-studio-tag">Landing Pages</span>
                    </div>
                    <h4>High-Velocity Landing Pages</h4>
                    <p>Sub-second load speed, clear promises, and mobile checkout forms that stop visitors tapping back.</p>
                    <div className="dm-studio-chips">
                      <span>A/B Testing</span>
                      <span>Next.js</span>
                      <span>Heatmaps</span>
                    </div>
                  </div>

                  <div className="dm-studio-card" data-cursor="VIDEO">
                    <div className="dm-studio-card__head">
                      <span className="dm-studio-badge dm-studio-badge--video">🎥 3.8s Hook</span>
                      <span className="dm-studio-tag">Short Videos</span>
                    </div>
                    <h4>Short-Form Video & Reels</h4>
                    <p>Scripting, editing, and voiceovers that grab scroll-happy users in under 4 seconds.</p>
                    <div className="dm-studio-chips">
                      <span>Reels</span>
                      <span>YT Shorts</span>
                      <span>Viral Hooks</span>
                    </div>
                  </div>

                  <div className="dm-studio-card" data-cursor="BLOGS">
                    <div className="dm-studio-card__head">
                      <span className="dm-studio-badge dm-studio-badge--seo">📚 Google Top 3</span>
                      <span className="dm-studio-tag">SEO Content</span>
                    </div>
                    <h4>Authority SEO Articles & Guides</h4>
                    <p>Buyer-intent guides that solve specific problems and attract organic leads month after month.</p>
                    <div className="dm-studio-chips">
                      <span>Pillar Posts</span>
                      <span>Schema</span>
                      <span>Rank Tracking</span>
                    </div>
                  </div>

                  <div className="dm-studio-card" data-cursor="PROOF">
                    <div className="dm-studio-card__head">
                      <span className="dm-studio-badge dm-studio-badge--proof">🏆 Deal Closer</span>
                      <span className="dm-studio-tag">Case Studies</span>
                    </div>
                    <h4>Case-Style Proof Stories</h4>
                    <p>Real numbers and before/after breakdowns that overcome hesitation and close enterprise deals.</p>
                    <div className="dm-studio-chips">
                      <span>Video Proof</span>
                      <span>WhatsApp PDFs</span>
                      <span>Testimonials</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =========================== NEW: GOOGLE ADS + META ADS + PLATFORMS =========================== */}
        <AdsShowcase />

        {/* =========================== SIMULATOR (dark) =========================== */}
        <section className="dm-section dm-simsec" id="dm-sim" aria-labelledby="dm-sim-h">
          <div className="container">
            <Head center dark eyebrow="Growth simulator" lead="Move the sliders to see what a campaign could look like with your own numbers. It is an illustration to help you plan, not a forecast.">
              <span id="dm-sim-h">Test your numbers <em>before you spend.</em></span>
            </Head>
            <div className="dm-sim" data-reveal>
              <div className="dm-sim__controls">
                {ROI_FIELDS.map((f) => {
                  const val = roi[f.k];
                  const pct = ((val - f.min) / (f.max - f.min)) * 100;
                  const pre = "pre" in f ? f.pre : "";
                  const suf = "suf" in f ? f.suf : "";
                  return (
                    <div className="dm-slider" key={f.k}>
                      <div className="dm-slider__top">
                        <label htmlFor={`dm-r-${f.k}`}>{f.label}</label>
                        <output htmlFor={`dm-r-${f.k}`}>{pre}{inr(val)}{suf}</output>
                      </div>
                      <input
                        id={`dm-r-${f.k}`} type="range" min={f.min} max={f.max} step={f.step} value={val}
                        onChange={(e) => setRoi((r) => ({ ...r, [f.k]: Number(e.target.value) }))}
                        style={{ "--p": `${pct}%` } as CSSProperties}
                      />
                      <p>{f.help}</p>
                    </div>
                  );
                })}
                <button type="button" className="dm-sim__reset" onClick={() => setRoi(ROI_DEFAULT)} disabled={isDefault}>
                  <RotateCcw size={15} aria-hidden="true" />Reset to example
                </button>
              </div>

              <div className="dm-sim__result" aria-live="polite">
                <svg className="dm-gauge" viewBox="0 0 180 180" role="img" aria-label={`Estimated return on ad spend ${est.roas.toFixed(1)} times`}>
                  <circle className="dm-gauge__bg" cx="90" cy="90" r="70" />
                  <circle
                    className="dm-gauge__fg" cx="90" cy="90" r="70" transform="rotate(-90 90 90)"
                    strokeDasharray={GAUGE_C} strokeDashoffset={GAUGE_C * (1 - Math.min(est.roas, 8) / 8)}
                  />
                  <text x="90" y="92" className="dm-gauge__v">{est.roas.toFixed(1)}x</text>
                  <text x="90" y="114" className="dm-gauge__l">return on ad spend</text>
                </svg>
                <div className="dm-sim__nums">
                  <p className="dm-sim__eyebrow">Estimated monthly revenue</p>
                  <p className="dm-sim__big">₹{inr(est.revenue)}</p>
                  <dl className="dm-sim__tiles">
                    <div><dt>Leads</dt><dd>{inr(est.leads)}</dd></div>
                    <div><dt>Customers</dt><dd>{est.customers < 10 ? est.customers.toFixed(1) : inr(est.customers)}</dd></div>
                    <div><dt>Cost per customer</dt><dd>₹{inr(est.cpc)}</dd></div>
                  </dl>
                </div>
                <p className="dm-sim__note"><Sparkles size={14} aria-hidden="true" />Real results depend on your market, offer and how fast your team follows up. Ad spend is paid to the platforms and is not part of our fee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== GOALS: donut explorer =========================== */}
        <section className="dm-section dm-gxsec" aria-labelledby="dm-gx-h">
          <div className="container">
            <Head center eyebrow="Pick your goal" lead="The best channel mix depends on what you want. Choose a goal, then hover a slice to see where the effort goes.">
              <span id="dm-gx-h">One goal, <em>the right mix.</em></span>
            </Head>

            <div className="dm-gx" data-reveal>
              <div className="dm-gx__chips" role="tablist" aria-label="Marketing goals">
                {GOALS.map((g, i) => (
                  <button key={g.k} type="button" role="tab" aria-selected={goal === i} className={`dm-gx__chip${goal === i ? " is-on" : ""}`} onClick={() => { setGoal(i); setSeg(null); }}>
                    <span className="dm-gx__chip-ic"><g.icon size={18} /></span>
                    <span><b>{g.k}</b><small>{g.sub}</small></span>
                  </button>
                ))}
              </div>

              <div className="dm-gx__panel" role="tabpanel">
                <div className="dm-gx__chart">
                  <svg viewBox="0 0 200 200" className="dm-donut" role="img" aria-label={`Indicative channel mix for ${G.k.toLowerCase()}`}>
                    <circle cx="100" cy="100" r={DONUT_R} className="dm-donut__track" />
                    {segs.map((s, i) => (
                      <circle
                        key={i} cx="100" cy="100" r={DONUT_R} transform="rotate(-90 100 100)"
                        className={`dm-donut__seg${seg === i ? " is-hot" : ""}${seg !== null && seg !== i ? " is-dim" : ""}`}
                        stroke={s.color} strokeDasharray={`${s.len} ${DONUT_C}`} strokeDashoffset={s.off}
                      />
                    ))}
                  </svg>
                  <div className="dm-donut__mid" aria-hidden="true">
                    <b>{shown ? `${shown.v}%` : G.k}</b>
                    <small>{shown ? shown.n : "indicative effort mix"}</small>
                  </div>
                </div>

                <div className="dm-gx__info">
                  <h3>{G.t}</h3>
                  <p>{G.p}</p>
                  <ul className="dm-legend">
                    {G.mix.map((m, i) => (
                      <li key={m.n}>
                        <button type="button" className={seg === i ? "is-on" : ""} onMouseEnter={() => setSeg(i)} onMouseLeave={() => setSeg(null)} onFocus={() => setSeg(i)} onBlur={() => setSeg(null)}>
                          <i style={{ background: SEG_COLORS[i] }} />
                          <span><b>{m.n}</b><small>{m.tag}</small></span>
                          <em>{m.v}%</em>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dm-gx__road">
                  <p className="dm-gx__roadlabel">Your first 90 days</p>
                  <ol>
                    {G.steps.map((s, i) => (
                      <li className="dm-gx__step" key={s}><span>Month {i + 1}</span><p>{s}</p></li>
                    ))}
                  </ol>
                  <p className="dm-gx__verdict"><Sparkles size={15} aria-hidden="true" />{G.verdict}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================== PROCESS: stacked cards =========================== */}
        <section className="dm-section dm-stack" aria-labelledby="dm-s-h">
          <div className="container">
            <Head center eyebrow="How we work" lead="A repeating monthly cycle, so your marketing keeps improving instead of running on autopilot.">
              <span id="dm-s-h">Five stages, <em>measured every month.</em></span>
            </Head>
            <div className="dm-stackwrap">
              {STEPS.map((s, i) => (
                <article className={`dm-stackcard dm-stackcard--${i + 1}`} key={s.t} style={{ "--i": i } as CSSProperties}>
                  <div className="dm-stackcard__l">
                    <span className="dm-stackcard__no" aria-hidden="true">0{i + 1}</span>
                    <span className="dm-stackcard__when">{s.w}</span>
                  </div>
                  <div className="dm-stackcard__r">
                    <span className="dm-stackcard__ic" aria-hidden="true"><s.icon size={22} /></span>
                    <h3>{s.t}</h3>
                    <p>{s.p}</p>
                    <ul aria-label="What you get">{s.out.map((o) => <li key={o}><Check size={12} strokeWidth={3} aria-hidden="true" />{o}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== NEW: GROWTH LAB (interactive graphs) =========================== */}
        <GrowthLab />

        {/* =========================== MYTHS: flip cards =========================== */}
        <section className="dm-section dm-myths" aria-labelledby="dm-m-h">
          <div className="container">
            <Head center eyebrow="Myth or reality" lead="Four things we hear all the time. Tap or hover a card to flip it.">
              <span id="dm-m-h">Marketing myths <em>we happily bust.</em></span>
            </Head>
            <div className="dm-mgrid">
              {MYTHS.map((m, i) => (
                <button
                  key={m.num}
                  type="button"
                  data-reveal
                  className={`dm-flip${flip[i] ? " is-flipped" : ""}`}
                  aria-pressed={flip[i]}
                  onClick={() => setFlip((f) => f.map((v, k) => (k === i ? !v : v)))}
                >
                  <span className="dm-flip__in">
                    {/* Front Face: The Myth */}
                    <span className="dm-flip__face dm-flip__front">
                      <span className="dm-flip__watermark" aria-hidden="true">{m.num}</span>
                      <div className="dm-flip__top">
                        <span className="dm-flip__pill dm-flip__pill--myth">
                          ✕ Myth {m.num}
                        </span>
                        <span className="dm-flip__action-tag">
                          <RotateCcw size={11} aria-hidden="true" />
                          <span>Flip</span>
                        </span>
                      </div>

                      <div className="dm-flip__center">
                        <span className="dm-flip__icon-box">
                          <m.icon size={20} aria-hidden="true" />
                        </span>
                        <h3 className="dm-flip__title">"{m.m}"</h3>
                      </div>

                      <div className="dm-flip__footer">
                        <span className="dm-flip__hint-btn">
                          <span>See the reality</span>
                          <ArrowRight size={13} aria-hidden="true" />
                        </span>
                      </div>
                    </span>

                    {/* Back Face: The Reality */}
                    <span className="dm-flip__face dm-flip__back">
                      <span className="dm-flip__watermark dm-flip__watermark--back" aria-hidden="true">{m.num}</span>
                      <div className="dm-flip__top">
                        <span className="dm-flip__pill dm-flip__pill--reality">
                          <Check size={12} strokeWidth={3} aria-hidden="true" />
                          Verified Reality
                        </span>
                        <span className="dm-flip__back-badge">
                          <RotateCcw size={11} aria-hidden="true" />
                        </span>
                      </div>

                      <div className="dm-flip__back-content">
                        <strong className="dm-flip__hook">{m.hook}</strong>
                        <p className="dm-flip__desc">{m.r}</p>
                      </div>

                      <div className="dm-flip__takeaway">
                        <Sparkles size={12} aria-hidden="true" />
                        <span>{m.takeaway}</span>
                      </div>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== SCROLL BAND =========================== */}
        <div className="dm-band" aria-hidden="true">
          {[0, 1].map((r) => (
            <div className="dm-band__row" key={r}>
              {[...BAND, ...BAND, ...BAND].map((w, i) => <span key={i} className={(i + r) % 2 ? "is-fill" : ""}>{w}<i>✦</i></span>)}
            </div>
          ))}
        </div>

        <RelatedServicesSection
          items={REL}
          lead="Marketing works best on top of a fast, well-built website. Pick a service below to see how it fits."
        />
      </div>
    </>
  );
}