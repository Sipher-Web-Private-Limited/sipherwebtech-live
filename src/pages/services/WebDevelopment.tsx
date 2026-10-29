import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  ChevronRight,
  Check,
  Code2,
  LayoutDashboard,
  Lock,
  PenTool,
  Rocket,
  Search,
  ShoppingCart,
  ShieldCheck,
  Smartphone,
  Target,
  Users,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import "../../styles/services/web-development.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Unsplash has no tech logos, so logos come from the Devicon CDN */
const dev = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`;

const MARQUEE = ["Business websites", "Landing pages", "Web apps", "Portals", "E-commerce", "Laravel", "React"];

const HERO_IMAGES = [
  {
    src: "/new-images/services/webdev/webdevhero1.webp",
    alt: "Sipher Webtech website shown on desktop, tablet and mobile screens",
  },
  {
    src: "/new-images/services/webdev/webdevhero2.webp",
    alt: "Responsive custom website preview across laptop and mobile devices",
  },
];

const SCENE = [
  {
    tag: "Wireframe",
    title: "Every site starts",
    em: "as a sketch.",
    text: "Before visual design, we plan the structure around your business goals and what visitors need to do.",
    details: ["Page structure and navigation", "Content priorities and user journeys", "A clear plan before development"],
  },
  {
    tag: "Design",
    title: "Then it gets",
    em: "its look.",
    text: "We turn the approved structure into a distinctive, polished experience that feels like your brand.",
    details: ["Brand-led colours and typography", "Layouts for desktop, tablet and mobile", "Clear calls to action on every page"],
  },
  {
    tag: "Code",
    title: "Clean code makes",
    em: "it real.",
    text: "Our team builds the approved design into a responsive website that feels quick and works reliably.",
    details: ["Accessible, responsive front-end", "Secure integrations and functionality", "Performance-minded, maintainable code"],
  },
  {
    tag: "Launch",
    title: "Live, and ready",
    em: "to grow.",
    text: "Before launch, we check the details across devices, prepare your site for search and make it ready for real visitors.",
    details: ["Device, browser and form testing", "Speed, metadata and SEO checks", "Deployment with a final quality review"],
  },
];

const SERVICES = [
  { n: "01", title: "Business websites", text: "Clear, professional sites for clinics, institutes, shops and service firms.", src: "/new-images/services/webdev/service-business-websites.webp", alt: "Business website design preview" },
  { n: "02", title: "Landing pages", text: "Focused pages that turn campaign traffic into calls and enquiries.", src: "/new-images/services/webdev/service-landing-pages.webp", alt: "Landing page design preview" },
  { n: "03", title: "Portals & dashboards", text: "Secure logins, admin panels and role-based dashboards.", src: "/new-images/services/webdev/service-portals-dashboards.webp", alt: "Portal and dashboard design preview" },
  { n: "04", title: "CMS-driven sites", text: "Edit content yourself. No developer needed for daily changes.", src: "/new-images/services/webdev/service-cms-management.webp", alt: "Content management website design preview" },
  { n: "05", title: "Custom web apps", text: "Booking, billing and workflow tools shaped to your process.", src: "/new-images/services/webdev/service-custom-web-apps.webp", alt: "Custom web application design preview" },
  { n: "06", title: "Redesign & speed-up", text: "Modernise an old site, fix mobile issues and cut load time.", src: "/new-images/services/webdev/service-website-redesign.webp", alt: "Website redesign and performance preview" },
];

const PROCESS = [
  { title: "Discover", img: "/new-images/services/webdev/process-discover.webp", alt: "Project discovery, sitemap and website goals", text: "Goals, audience and scope.", Icon: Target },
  { title: "Design", img: "/new-images/services/webdev/process-design.webp", alt: "Website wireframe and visual design", text: "Wireframes, then polished UI.", Icon: PenTool },
  { title: "Build", img: "/new-images/services/webdev/process-build.webp", alt: "Website development and code in progress", text: "Clean, tested, responsive code.", Icon: Code2 },
  { title: "Launch", img: "/new-images/services/webdev/process-launch.webp", alt: "Website successfully launched", text: "Deploy, speed and SEO checks.", Icon: Rocket },
  { title: "Support", img: "/new-images/services/webdev/process-support.webp", alt: "Website maintenance and ongoing support", text: "Updates, fixes and growth.", Icon: ShieldCheck },
];

type Tech = { name: string; cat: string; icon?: string; use: string; bg: string };

const STACK: Tech[] = [
  { name: "Laravel", cat: "Backend", icon: dev("laravel/laravel-original"), use: "Secure portals, admin panels and APIs", bg: "#fde7e5" },
  { name: "PHP", cat: "Backend", icon: dev("php/php-original"), use: "Reliable server-side logic that runs on any host", bg: "#ecedfb" },
  { name: "MySQL", cat: "Database", icon: dev("mysql/mysql-original"), use: "Fast, structured storage for orders, users and content", bg: "#e0f1f8" },
  { name: "HTML5", cat: "Frontend", icon: dev("html5/html5-original"), use: "Semantic markup that search engines understand", bg: "#fde9e3" },
  { name: "CSS3", cat: "Frontend", icon: dev("css3/css3-original"), use: "Responsive, mobile-first layouts and clean styling", bg: "#e3f0fb" },
  { name: "JavaScript", cat: "Frontend", icon: dev("javascript/javascript-original"), use: "Interactive pages without the bloat", bg: "#fff6cc" },
  { name: "TypeScript", cat: "Frontend", icon: dev("typescript/typescript-original"), use: "Typed code that means fewer bugs after launch", bg: "#e3eefb" },
  { name: "React", cat: "Frontend", icon: dev("react/react-original"), use: "Fast, app-like interfaces and dashboards", bg: "#e0f6fc" },
  { name: "GSAP", cat: "Motion & APIs", icon: "https://cdn.simpleicons.org/greensock/0AAE60", use: "Smooth scroll and page animations", bg: "#e0f6ec" },
  { name: "REST APIs", cat: "Motion & APIs", use: "Connect payments, CRMs, SMS and third-party tools", bg: "#eceeff" },
];

const STACK_CATS = ["All", "Backend", "Frontend", "Database", "Motion & APIs"];

const WHY = [
  { Icon: Smartphone, title: "Mobile-first design", text: "Most visitors browse on phones, so every page is designed for small screens first and scales up cleanly.", image: "/new-images/services/webdev/why-mobile-first.webp" },
  { Icon: Search, title: "Built to rank on Google", text: "Semantic HTML, fast loading, meta tags, schema markup and a sitemap from day one.", image: "/new-images/services/webdev/why-seo.webp" },
  { Icon: Zap, title: "Fast by default", text: "Optimised images, lean code and caching keep pages quick for visitors and search engines.", image: "/new-images/services/webdev/why-speed.webp" },
  { Icon: Lock, title: "Secure and reliable", text: "HTTPS, input validation and framework-level protections keep your site and customer data safe.", image: "/new-images/services/webdev/why-security.webp" },
  { Icon: LayoutDashboard, title: "Easy to manage", text: "An admin panel lets you update text, images, listings and enquiries without touching code.", image: "/new-images/services/webdev/why-cms.webp" },
  { Icon: Users, title: "Support after launch", text: "Maintenance, backups and updates from the same team that built your site.", image: "/new-images/services/webdev/why-support.webp" },
];

const MOCK_FEATS = [
  { Icon: Zap, title: "Fast", text: "Loads in a blink" },
  { Icon: Smartphone, title: "Mobile", text: "Fits every screen" },
  { Icon: Search, title: "SEO", text: "Found on Google" },
  { Icon: Lock, title: "Secure", text: "HTTPS by default" },
];

const INDUSTRIES = [
  { name: "IT training institutes", text: "Course catalogues, batch enquiries and student portals.", img: "/new-images/services/webdev/industry-training.webp" },
  { name: "Clinics & hospitals", text: "Online appointments and trusted, local-first pages.", img: "/new-images/services/webdev/industry-healthcare.webp" },
  { name: "Manufacturers & catalogues", text: "Product catalogues with quote requests.", img: "/new-images/services/webdev/industry-manufacturing.webp" },
  { name: "SaaS & software companies", text: "Product sites, pricing pages and user dashboards.", img: "/new-images/services/webdev/industry-saas.webp" },
  { name: "Retail & e-commerce", text: "Fast stores that turn visitors into buyers.", img: "/new-images/services/webdev/industry-ecommerce.webp" },
  { name: "Startups & agencies", text: "Launch-ready sites that grow with you.", img: "/new-images/services/webdev/industry-startups.webp" },
  { name: "Schools & academies", text: "Admissions, notices and parent-friendly layouts.", img: "/new-images/services/webdev/industry-schools.webp" },
];

const RELATED = [
  { to: "/services/seo", title: "SEO services", text: "Rank higher and get found by local customers.", Icon: Search, img: "/new-images/services/webdev/related-seo.webp" },
  { to: "/services/ui-ux", title: "UI/UX design", text: "Interfaces that feel obvious and look great.", Icon: PenTool, img: "/new-images/services/webdev/related-ui-ux.webp" },
  { to: "/services/ecommerce", title: "E-commerce development", text: "Online stores that sell and scale.", Icon: ShoppingCart, img: "/new-images/services/webdev/related-ecommerce.webp" },
  { to: "/services/software-development", title: "Custom software", text: "Software shaped around your process.", Icon: Code2, img: "/new-images/services/webdev/related-custom-software.webp" },
];

const CODE = `<section class="hero">\n  <h1>Grow online</h1>\n  @include('features')\n</section>`;

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function Words({ text, className = "wd-w" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className={className}>
            <span>{w}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/* outlined strip words: each word fills with colour on hover */
function StripWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) =>
        w === "·" ? (
          <span key={i} className="wd-strip__dot">· </span>
        ) : (
          <span key={i} className="wd-strip__w">{w}{" "}</span>
        )
      )}
    </>
  );
}

function Head({ eyebrow, children, lead, center }: { eyebrow: string; children: React.ReactNode; lead?: string; center?: boolean }) {
  return (
    <div className={`wd-head${center ? " wd-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="wd-title">{children}</h2>
      {lead && <p className="wd-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function WebDevelopment() {
  const rootRef = useRef<HTMLDivElement>(null);
  const serviceTrackRef = useRef<HTMLDivElement>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      setHeroImageIndex((index) => (index + 1) % HERO_IMAGES.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const track = serviceTrackRef.current;
    if (!track) return;

    let frame = 0;
    const updateActiveService = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + track.clientWidth / 2;
        const cards = Array.from(track.querySelectorAll<HTMLElement>(".wd-card"));
        const closest = cards.reduce((nearest, card, index) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          return distance < nearest.distance ? { index, distance } : nearest;
        }, { index: 0, distance: Number.POSITIVE_INFINITY });

        setActiveServiceIndex(closest.index);
      });
    };

    track.addEventListener("scroll", updateActiveService, { passive: true });
    updateActiveService();
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", updateActiveService);
    };
  }, []);

  const scrollToService = (index: number) => {
    const track = serviceTrackRef.current;
    const card = track?.querySelectorAll<HTMLElement>(".wd-card")[index];
    if (!track || !card) return;

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const left = track.scrollLeft + cardRect.left - trackRect.left - (track.clientWidth - cardRect.width) / 2;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    track.scrollTo({ left, behavior });
  };

  /* tech section: category filter */
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? STACK : STACK.filter((t) => t.cat === cat);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const one = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 900px)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motion, wide, fine } = ctx.conditions as { motion: boolean; wide: boolean; fine: boolean };
        if (!motion) return;

        const off: Array<() => void> = [];
        root.classList.add("is-motion");
        if (wide) root.classList.add("is-wide");

        /* ---- hero intro (text is never left on a transformed layer) ---- */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from($(".wd-crumb, .wd-hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" })
          .from($(".wd-hero__title .wd-w > span"), { yPercent: 115, duration: 1, stagger: 0.07, clearProps: "transform" }, 0.1)
          .from($(".wd-hero__lead, .wd-hero__cta > *, .wd-hero__trust li"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, clearProps: "all" }, 0.55);

        if (fine) {
          $(".wd-mag").forEach((b) => {
            const qx = gsap.quickTo(b, "x", { duration: 0.5, ease: "elastic.out(1,.5)" });
            const qy = gsap.quickTo(b, "y", { duration: 0.5, ease: "elastic.out(1,.5)" });
            const mv = (e: PointerEvent) => {
              const r = b.getBoundingClientRect();
              qx((e.clientX - r.left - r.width / 2) * 0.25);
              qy((e.clientY - r.top - r.height / 2) * 0.25);
            };
            const lv = () => { qx(0); qy(0); };
            b.addEventListener("pointermove", mv);
            b.addEventListener("pointerleave", lv);
            off.push(() => { b.removeEventListener("pointermove", mv); b.removeEventListener("pointerleave", lv); });
          });
        }

        /* ---- marquee reacts to scroll speed ---- */
        const mq = gsap.to(one(".wd-marquee__track"), { xPercent: -50, repeat: -1, duration: 32, ease: "none" });
        ScrollTrigger.create({
          onUpdate: (s) => {
            mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
            gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
          },
        });

        /* ---- pinned build scene ---- */
        {
          const steps = $(".wd-step");
          const counter = one(".wd-scene__count");
          const terminal = one(".wd-terminal");
          const code = one(".wd-code");
          const typed = { n: 0 };

          gsap.set($(".wd-blk"), { scaleX: 0, backgroundColor: "#e3e7f8", boxShadow: "0 0 0 1px rgba(16,5,99,0)" });
          gsap.set(one(".wd-win"), { y: 80, autoAlpha: 0 });
          gsap.set($(".wd-bars i"), { scaleY: 0 });
          gsap.set($(".wd-ct"), { autoAlpha: 0 });
          gsap.set($(".wd-fill"), { autoAlpha: 0 });
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
          gsap.set($(".wd-note"), { autoAlpha: 0, scale: 0.85 });
          gsap.set($(".wd-badge"), { autoAlpha: 0, scale: 0.6 });
          gsap.set(terminal, { autoAlpha: 0 });
          gsap.set(one(".wd-live"), { autoAlpha: 0, scale: 0.6 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: one(".wd-scene"), start: "top top", end: "+=400%", scrub: 1, pin: true, anticipatePin: 1 },
          });

          const swap = (i: number, at: number) => {
            tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.3 }, at)
              .fromTo(steps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.3)
              .call(() => { counter.textContent = `0${i + 2} / 04`; }, undefined, at + 0.3)
              .call(() => { counter.textContent = `0${i + 1} / 04`; }, undefined, at - 0.01);
          };

          tl.to(one(".wd-win"), { y: 0, autoAlpha: 1, duration: 1 }, 0)
            .to($(".wd-blk"), { scaleX: 1, duration: 0.8, stagger: 0.22 }, 0.9)
            .to($(".wd-note"), { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: "back.out(2)" }, 1.3)
            .to($(".wd-note"), { autoAlpha: 0, y: -10, duration: 0.4, stagger: 0.08 }, 2.85);
          swap(0, 2.8);
          tl.to($(".wd-blk"), { backgroundColor: "#ffffff", boxShadow: "0 0 0 1px rgba(16,5,99,.12)", duration: 0.8, stagger: 0.12 }, 3.1)
            .to($(".wd-fill"), { autoAlpha: 1, duration: 0.8 }, 3.3)
            .to($(".wd-ct:not(.wd-ct--chart)"), { autoAlpha: 1, duration: 0.6, stagger: 0.12 }, 3.6);
          swap(1, 5.2);
          tl.to(terminal, { autoAlpha: 1, x: -12, duration: 0.6 }, 5.5)
            .to(typed, { n: CODE.length, duration: 1.8, ease: "none", onUpdate: () => { code.textContent = CODE.slice(0, Math.round(typed.n)); } }, 5.7);
          swap(2, 7.9);
          tl.to(terminal, { autoAlpha: 0, x: -36, duration: 0.5 }, 8.1)
            .to(one(".wd-ct--chart"), { autoAlpha: 1, duration: 0.4 }, 8.3)
            .to($(".wd-bars i"), { scaleY: 1, duration: 0.8, stagger: 0.08, ease: "back.out(1.4)" }, 8.4)
            .to(one(".wd-live"), { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.5)" }, 8.9)
            .to($(".wd-badge"), { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.18, ease: "back.out(2.5)" }, 8.6)
            .to({}, { duration: 0.8 });
        }

        /* ---- services: pinned horizontal scroll on desktop ---- */
        if (wide) {
          const track = one(".wd-track");
          const section = one(".wd-services");
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
          const h = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
          });
          gsap.to(one(".wd-services__bar i"), {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
          });
          $<HTMLImageElement>(".wd-card__media img").forEach((im) => {
            gsap.fromTo(im, { xPercent: -6 }, {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: im.closest(".wd-card") as HTMLElement, containerAnimation: h, start: "left right", end: "right left", scrub: true },
            });
          });
        }

        /* ---- process: pinned progress path with a travelling marker ---- */
        {
          const section = one(".wd-process");
          const path = one(".wd-ppath");
          const items = $(".wd-pstep");
          const nums = $<HTMLButtonElement>(".wd-pstep__num");
          const label = one(".wd-pmarker em");
          const pimgs = $(".wd-process__img");
          const chip = one(".wd-process__chip");
          const vertical = !wide;
          let pts: number[] = [];
          let curP = 0;
          let now = -1;

          const measure = () => {
            const r = path.getBoundingClientRect();
            pts = nums.map((n) => {
              const b = n.getBoundingClientRect();
              return vertical ? b.top + b.height / 2 - r.top : b.left + b.width / 2 - r.left;
            });
            path.style.setProperty("--a", `${pts[0]}px`);
            path.style.setProperty("--len", `${pts[pts.length - 1] - pts[0]}px`);
          };
          const render = (p: number) => {
            if (!pts.length) return;
            const d = p * (pts[pts.length - 1] - pts[0]);
            path.style.setProperty("--d", `${d}px`);
            path.style.setProperty("--m", `${pts[0] + d}px`);
            let idx = 0;
            items.forEach((el, i) => {
              const reached = pts[0] + d >= pts[i] - 1;
              el.classList.toggle("on", reached);
              if (reached) idx = i;
            });
            items.forEach((el, i) => el.classList.toggle("now", i === idx));
            if (idx !== now) {
              now = idx;
              label.textContent = PROCESS[idx].title;
              chip.textContent = `0${idx + 1} · ${PROCESS[idx].title}`;
              pimgs.forEach((im, k) => im.classList.toggle("on", k === idx));
            }
          };

          const trig = ScrollTrigger.create({
            trigger: wide ? section : path,
            start: wide ? "top top" : "top 70%",
            end: wide ? "+=220%" : "bottom 60%",
            pin: wide,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => { measure(); render(curP); },
            onUpdate: (s) => { curP = Math.min(1, s.progress / 0.9); render(curP); },
          });

          /* click or press a step number to jump the path to it */
          nums.forEach((n, i) => {
            const go = () => window.scrollTo({ top: trig.start + (trig.end - trig.start) * 0.9 * (i / (items.length - 1)) + 1, behavior: "smooth" });
            n.addEventListener("click", go);
            off.push(() => n.removeEventListener("click", go));
          });
          off.push(() => {
            ["--a", "--len", "--d", "--m"].forEach((v) => path.style.removeProperty(v));
            items.forEach((el) => { el.classList.add("on"); el.classList.remove("now"); });
            pimgs.forEach((im, k) => im.classList.toggle("on", k === 0));
            chip.textContent = "01 · Discover";
          });
        }

        /* ---- one site morphing desktop → tablet → phone (scroll or tap sets the frame size directly) ---- */
        {
          const frame = one(".wd-frame");
          const stage = one(".wd-device__stage");
          const tabs = $(".wd-device__tabs li");
          const pos = one(".wd-device__pos");
          const LAB = [["Desktop", "1280 px"], ["Tablet", "768 px"], ["Phone", "375 px"]];
          const sm = (x: number) => x * x * (3 - 2 * x);
          // scroll progress -> device state k (0 desktop, 1 tablet, 2 phone), with a hold on each
          const kOf = (p: number) => (p < 0.12 ? 0 : p < 0.4 ? sm((p - 0.12) / 0.28) : p < 0.55 ? 1 : p < 0.85 ? 1 + sm((p - 0.55) / 0.3) : 2);
          const base = () => Math.min(560, Math.max(280, (stage?.clientWidth || 360) - 16));
          const state = { k: 0 };
          let cur = -1;
          let userInteracting = false;
          let userTimer: ReturnType<typeof setTimeout> | undefined;

          const apply = () => {
            const k = state.k;
            const b = base();
            const phone = Math.round(Math.max(185, Math.min(b * 0.56, 230)));
            const w = k <= 1 ? b + (b * 0.74 - b) * k : b * 0.74 + (phone - b * 0.74) * (k - 1);
            const bw = k <= 1 ? 1 + 6 * k : 7 + 3 * (k - 1);
            const r = k <= 1 ? 20 + 6 * k : 26 + 12 * (k - 1);
            frame.style.width = `${Math.round(w)}px`;
            frame.style.borderWidth = `${bw}px`;
            frame.style.borderRadius = `${r}px`;
            frame.style.borderColor = gsap.utils.interpolate("rgba(16, 5, 99, 0.12)", "rgb(16, 5, 99)", Math.min(1, k)) as string;
            const i = k < 0.5 ? 0 : k < 1.5 ? 1 : 2;
            frame.setAttribute("data-device", i === 0 ? "desktop" : i === 1 ? "tablet" : "phone");
            if (i !== cur) {
              cur = i;
              tabs.forEach((tab, n) => {
                const isOn = n === i;
                tab.classList.toggle("on", isOn);
                tab.setAttribute("aria-selected", isOn ? "true" : "false");
              });
              pos.textContent = `${LAB[i][0]} · ${LAB[i][1]}`;
            }
          };
          apply();

          let target = 0;
          const setDevice = (targetK: number) => {
            userInteracting = true;
            clearTimeout(userTimer);
            userTimer = setTimeout(() => {
              userInteracting = false;
            }, 1800);
            target = targetK;
            gsap.to(state, {
              k: targetK,
              duration: 0.55,
              ease: "power2.out",
              overwrite: true,
              onUpdate: apply,
            });
          };

          tabs.forEach((tab, index) => {
            tab.style.cursor = "pointer";
            const clickHandler = (e: Event) => {
              e.preventDefault();
              setDevice(index);
            };
            const keyHandler = (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setDevice(index);
              }
            };
            tab.addEventListener("click", clickHandler);
            tab.addEventListener("keydown", keyHandler);
            off.push(() => {
              tab.removeEventListener("click", clickHandler);
              tab.removeEventListener("keydown", keyHandler);
            });
          });

          ScrollTrigger.create({
            trigger: one(".wd-devices"),
            start: wide ? "top top" : "top 70%",
            end: wide ? "+=220%" : "bottom 40%",
            pin: wide,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: apply,
            onUpdate: (self) => {
              if (userInteracting) return;
              const next = kOf(self.progress);
              if (next === target) return;
              target = next;
              gsap.to(state, { k: next, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: apply });
            },
          });
          const onResize = () => apply();
          window.addEventListener("resize", onResize);
          off.push(() => {
            window.removeEventListener("resize", onResize);
            clearTimeout(userTimer);
            frame.removeAttribute("style");
            frame.removeAttribute("data-device");
          });
        }

        /* ---- tech: photo reveal, parallax ---- */
        {
          const media = one(".wd-tech__media");
          gsap.from(one(".wd-tech__img"), {
            y: 28,
            scale: 0.96,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: media, start: "top 85%", once: true },
          });
          gsap.from($(".wd-tech .eyebrow, .wd-tech .wd-title, .wd-tech .wd-lead, .wd-tech__cats"), {
            y: 24,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: one(".wd-tech"), start: "top 75%", once: true },
          });
        }

        /* ---- outlined text strips ---- */
        const strip = one(".wd-strip");
        gsap.fromTo(one(".wd-strip__a"), { xPercent: 0 }, { xPercent: -38, ease: "none", scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(one(".wd-strip__b"), { xPercent: -38 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: true } });

        /* ---- why us: cards stack up on desktop ---- */
        if (wide) {
          const cards = $(".wd-why__card");
          const count = one(".wd-why__count");
          const dots = $(".wd-why__dots i");
          const activeTitle = one(".wd-why__active h3");
          const activeText = one(".wd-why__active p");
          const total = cards.length;
          let activeIndex = 0;
          const wtl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: one(".wd-why"),
              start: "top top",
              end: `+=${total * 85}%`,
              scrub: true,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const n = Math.min(total, Math.floor(self.progress * total) + 1);
                count.textContent = `0${n} / 0${cards.length}`;
                dots.forEach((d, k) => d.classList.toggle("on", k === n - 1));
                if (activeIndex !== n - 1) {
                  activeIndex = n - 1;
                  activeTitle.textContent = WHY[activeIndex].title;
                  activeText.textContent = WHY[activeIndex].text;
                }
              },
            },
          });
          cards.forEach((c, i) => {
            if (!i) return;
            const at = i;
            wtl.to(cards[i - 1], { autoAlpha: 0, duration: 0.08 }, at);
            wtl.fromTo(c, { yPercent: 24, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4 }, at + 0.08);
          });
          wtl.to({}, { duration: 0.52 });
        }

        /* ---- before / after: sweeps once, then the visitor drags ---- */
        {
          const cmp = one(".wd-compare");
          const range = one<HTMLInputElement>(".wd-compare input");
          const pp = { v: 92 };
          const setP = (v: number) => { cmp.style.setProperty("--p", `${v}%`); range.value = String(v); };
          const stop = () => gsap.killTweensOf(pp);
          range.addEventListener("pointerdown", stop);
          off.push(() => range.removeEventListener("pointerdown", stop));
          ScrollTrigger.create({
            trigger: cmp,
            start: "top 75%",
            once: true,
            onEnter: () => {
              setP(92);
              gsap.to(pp, { v: 50, duration: 2.2, delay: 0.2, ease: "power3.inOut", onUpdate: () => setP(pp.v) });
            },
          });
        }

        /* ---- CTA settles in ---- */
        gsap.from(one(".wd-cta"), { scale: 0.94, ease: "none", scrollTrigger: { trigger: one(".wd-cta"), start: "top 95%", end: "top 50%", scrub: true } });

        /* ---- light reveal for list content ---- */
        const reveals = $("[data-reveal]");
        gsap.set(reveals, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(reveals, {
          start: "top 90%",
          once: true,
          onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", clearProps: "all" }),
        });

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
        title="Web Development Services in Indore | Sipher Webtech"
        description="Fast, mobile-first, SEO-friendly websites, portals and web apps built with Laravel and React. Get a free consultation from Sipher Webtech."
      />

      <div className="wd" ref={rootRef}>
        {/* ============================ HERO ============================ */}
        <section className="wd-hero" aria-labelledby="wd-h1">
          <div className="container wd-hero__grid">
            <div className="wd-hero__copy">
              <nav className="wd-crumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <ChevronRight aria-hidden="true" size={15} />
                <span aria-current="page">Web Development</span>
              </nav>

              <p className="eyebrow"><span />Web Development</p>
              <h1 id="wd-h1" className="wd-hero__title" aria-label="Websites built for what’s next.">
                <span className="wd-line" aria-hidden="true"><Words text="Websites built" /></span>
                <em className="wd-line" aria-hidden="true"><Words text="for what’s next." /></em>
              </h1>
              <p className="wd-hero__lead">
                We build high-performance, scalable and secure websites that help businesses grow, engage users and
                create lasting digital experiences.
              </p>
              <div className="wd-hero__cta">
                <Link
                  className="button button--primary wd-mag wd-hero__consultation"
                  to="/contact"
                  data-cursor="START"
                >
                  <span>Get a free consultation</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </div>
              <ul className="wd-hero__trust">
                {["Mobile-first", "SEO-ready", "Secure", "Clear, fixed quotes"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>
            <div className="wd-hero__visual">
              <span className="wd-hero__dots wd-hero__dots--top" aria-hidden="true" />
              <span className="wd-hero__dots wd-hero__dots--bottom" aria-hidden="true" />
              <span className="wd-hero__circle" aria-hidden="true" />
              {HERO_IMAGES.map((image, index) => (
                <img
                  key={image.src}
                  className={`wd-hero__image${heroImageIndex === index ? " is-active" : ""}`}
                  src={image.src}
                  alt={image.alt}
                  aria-hidden={heroImageIndex !== index}
                  width={1680}
                  height={945}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="wd-marquee" aria-hidden="true">
          <div className="wd-marquee__track">
            {[0, 1].map((g) => (
              <div className="wd-marquee__group" key={g}>
                {MARQUEE.map((m) => <span key={m}>{m}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ======================= PINNED BUILD SCENE ===================== */}
        <section className="wd-scene" id="wd-scene" aria-label="How we build your website">
          <div className="wd-scene__bg" aria-hidden="true" />
          <div className="container wd-scene__grid">
            <div className="wd-scene__copy">
              <h2 className="wd-sr">How we build your website, step by step</h2>
              <div className="wd-steps">
                {SCENE.map((s) => (
                  <div className="wd-step" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="wd-step__details">
                      {s.details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="wd-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="wd-scene__stage">
              <div className="wd-win" aria-hidden="true">
                <div className="wd-bar"><i /><i /><i /><span>your-website.com</span></div>
                <div className="wd-page">
                  <div className="wd-blk wd-blk--nav">
                    <div className="wd-ct wd-nav"><b>YourSite</b><span>Home · Services · About · Contact</span></div>
                  </div>
                  <div className="wd-row">
                    <div className="wd-blk wd-blk--hero">
                      <div className="wd-ct">
                        <div className="wd-h4">Grow your business online.</div>
                        <p>Fast, friendly and built to convert.</p>
                        <i className="wd-btnx">Get started</i>
                      </div>
                    </div>
                    <div className="wd-blk wd-blk--img">
                      <img className="wd-fill" src={img("1517694712202-14dd9538aa97", 500)} alt="" width={500} height={340} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <div className="wd-cards">
                    {["Fast", "Mobile", "SEO"].map((feature) => (
                      <div className="wd-blk" key={feature}><div className="wd-ct">{feature}</div></div>
                    ))}
                  </div>
                  <div className="wd-blk wd-blk--chart">
                    <div className="wd-ct wd-ct--chart wd-bars">
                      {[35, 55, 42, 75, 60, 92, 80].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="wd-note wd-note--1" aria-hidden="true">Header &amp; menu</div>
              <div className="wd-note wd-note--2" aria-hidden="true">Hero banner</div>
              <div className="wd-note wd-note--3" aria-hidden="true">Feature cards</div>
              <div className="wd-terminal" aria-hidden="true">
                <div className="wd-terminal__bar"><span /><span /><span /><b>BUILD TERMINAL</b></div>
                <pre className="wd-code" />
              </div>
              <aside className="wd-build-insight" aria-label="What goes into every build">
                <p>IN EVERY BUILD</p>
                <ul>
                  <li><i>01</i>Responsive by default</li>
                  <li><i>02</i>Clean, secure code</li>
                  <li><i>03</i>Fast and SEO-ready</li>
                </ul>
              </aside>
              <div className="wd-live" aria-hidden="true">● Live</div>
              {["Mobile-ready", "SEO-ready", "Secure", "Fast loading"].map((badge, index) => (
                <div className={`wd-badge wd-badge--${index + 1}`} key={badge} aria-hidden="true"><i><Check size={12} /></i>{badge}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== SERVICES (HORIZONTAL) ==================== */}
        <section className="wd-services" id="wd-services">
          <div className="container wd-services__head">
            <Head eyebrow="Website development services">Websites built to <em>grow with you.</em></Head>
            <div className="wd-services__bar" aria-hidden="true"><i /></div>
          </div>
          <div className="wd-track" ref={serviceTrackRef} role="region" aria-label="Website development services" tabIndex={0}>
            {SERVICES.map((s, index) => (
              <article
                className={`wd-card${activeServiceIndex === index ? " wd-card--active" : ""}`}
                key={s.n}
                aria-label={`${index + 1} of ${SERVICES.length}: ${s.title}`}
              >
                <div className="wd-card__media">
                  <span className="wd-card__tag">SERVICE {s.n}</span>
                  <span className="wd-card__index" aria-hidden="true">{s.n} <i>/ 06</i></span>
                  <img src={s.src} alt={s.alt} width={1672} height={940} loading="lazy" decoding="async" />
                </div>
                <div className="wd-card__body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="wd-service-controls">
            <div className="wd-service-controls__progress">
              <span aria-live="polite">0{activeServiceIndex + 1} <i>/ 0{SERVICES.length}</i></span>
              <div className="wd-service-controls__bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${(activeServiceIndex + 1) / SERVICES.length})` }} />
              </div>
            </div>
            <div className="wd-service-controls__buttons">
              <button
                type="button"
                aria-label="Previous service"
                disabled={activeServiceIndex === 0}
                onClick={() => scrollToService(activeServiceIndex - 1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next service"
                disabled={activeServiceIndex === SERVICES.length - 1}
                onClick={() => scrollToService(activeServiceIndex + 1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ============================ PROCESS ============================ */}
        <section className="wd-section wd-process" id="wd-process">
          <div className="container">
            <div className="wd-process__top">
              <Head
                eyebrow="How we work"
                lead="A structured, transparent process that turns your idea into a fast, secure and search-friendly website."
              >
                Five steps, <em>no surprises.</em>
              </Head>
              <div className="wd-process__media" aria-hidden="true">
                {PROCESS.map((p, i) => (
                  <img
                    key={p.title}
                    className={`wd-process__img${i === 0 ? " on" : ""}`}
                    src={p.img}
                    alt=""
                    width={800}
                    height={470}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <span className="wd-process__chip">01 · Discover</span>
              </div>
            </div>
            <div className="wd-ppath">
              <span className="wd-pline" aria-hidden="true"><i /></span>
              <span className="wd-pmarker" aria-hidden="true"><em>Discover</em></span>
              <ol className="wd-psteps">
                {PROCESS.map(({ title, text, Icon }, i) => (
                  <li className="wd-pstep on" key={title}>
                    <button type="button" className="wd-pstep__num" aria-label={`Go to step ${i + 1}: ${title}`}>0{i + 1}</button>
                    <div className="wd-pstep__box">
                      <span className="wd-pstep__icon"><Icon aria-hidden="true" size={18} /></span>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============================ DEVICES ============================ */}
        <section className="wd-devices" id="wd-devices" aria-labelledby="wd-dev-h">
          <div className="container wd-devices__grid">
            <div>
              <p className="eyebrow"><span />Responsive website design</p>
              <h2 className="wd-title" id="wd-dev-h">One website. <em>Every screen.</em></h2>
              <p className="wd-lead">
                Your customers browse on phones, tablets and desktops. We design a single website that adapts to all of
                them, so nothing is cut off, squashed or hard to tap.
              </p>
              <ul className="wd-device__tabs" role="tablist" aria-label="Screen sizes we design for">
                <li className="on" role="tab" tabIndex={0} aria-selected="true">Desktop</li>
                <li role="tab" tabIndex={0} aria-selected="false">Tablet</li>
                <li role="tab" tabIndex={0} aria-selected="false">Phone</li>
              </ul>
              <p className="wd-device__pos" aria-hidden="true">Desktop · 1280 px</p>
              <ul className="wd-device__feats">
                <li><Check aria-hidden="true" size={16} />Layouts that reflow, not just shrink</li>
                <li><Check aria-hidden="true" size={16} />Tap-friendly buttons and menus</li>
                <li><Check aria-hidden="true" size={16} />Light images for fast mobile loading</li>
              </ul>
            </div>

            <div className="wd-device__stage" aria-hidden="true">
              <span className="wd-device__chip wd-device__chip--a">Tap-friendly</span>
              <span className="wd-device__chip wd-device__chip--b">Readable text</span>
              <div className="wd-frame">
                <div className="wd-m">
                  <div className="wd-m__nav">
                    <span className="wd-m__logo"><i>Y</i>YourSite</span>
                    <span className="wd-m__links"><span>Home</span><span>Services</span><span>About</span></span>
                    <span className="wd-m__cta">Contact</span>
                    <span className="wd-m__burger" />
                  </div>
                  <div className="wd-m__hero">
                    <div className="wd-m__copy">
                      <span className="wd-m__badge"><i />Now booking</span>
                      <div className="wd-m__h">Grow your <em>business</em> online.</div>
                      <p>Fast, friendly and built to convert.</p>
                      <div className="wd-m__btns">
                        <i className="wd-m__btn">Get started</i>
                        <i className="wd-m__btn wd-m__btn--ghost">See our work</i>
                      </div>
                    </div>
                    <div className="wd-m__media">
                      <img src={img("1460925895917-afdab827c52f", 500)} alt="" width={500} height={520} loading="lazy" decoding="async" />
                      <span className="wd-m__float"><i />Online now</span>
                    </div>
                  </div>
                  <div className="wd-m__feats">
                    {MOCK_FEATS.map(({ Icon, title, text }) => (
                      <div className="wd-m__feat" key={title}>
                        <span><Icon aria-hidden="true" size={15} /></span>
                        <b>{title}</b>
                        <small>{text}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================== TECH ============================== */}
        <section className="wd-section wd-tech" aria-labelledby="wd-tech-h">
          <div className="container wd-tech__grid">
            <div className="wd-tech__copy">
              <p className="eyebrow"><span />Technology</p>
              <h2 className="wd-title" id="wd-tech-h">Tools we build websites <em>with.</em></h2>
              <p className="wd-lead">
                We choose proven, modern tools so your website is fast, secure, easy to maintain and ready to grow.
              </p>

              <div className="wd-tech__cats" role="tablist" aria-label="Filter technologies">
                {STACK_CATS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={cat === c}
                    className={cat === c ? "on" : ""}
                    onClick={() => setCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="wd-tech__tags" role="list">
                {list.map((t) => (
                  <div className="wd-tech__tag" key={t.name} role="listitem">
                    <i style={{ background: t.bg }}>
                      {t.icon ? (
                        <img src={t.icon} alt="" width={20} height={20} loading="lazy" decoding="async" />
                      ) : (
                        <Braces aria-hidden="true" size={17} />
                      )}
                    </i>
                    <span>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wd-tech__media">
              <div className="wd-tech__img">
                <img
                  src="/new-images/services/webdev/tech-stack-flipped.webp"
                  alt="Diagram of the frontend, backend, database, APIs and deployment technologies behind a website"
                  width={796}
                  height={726}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================== STRIP ============================== */}
        <div className="wd-strip" aria-hidden="true">
          <div className="wd-strip__a"><StripWords text="BUILD · SHIP · GROW · BUILD · SHIP · GROW · BUILD · SHIP · GROW ·" /></div>
          <div className="wd-strip__b"><StripWords text="DESIGN · CODE · LAUNCH · DESIGN · CODE · LAUNCH · DESIGN · CODE · LAUNCH ·" /></div>
        </div>

        {/* ============================== WHY US ============================== */}
        <section className="wd-section wd-why" id="wd-why">
          <div className="container wd-why__grid">
            <div>
              <Head
                eyebrow="Why Sipher"
                lead="A website is only useful if people can find it, trust it and use it on any device. That is how we build every project."
              >
                Why businesses choose us for <em>web development</em>
              </Head>
              <div className="wd-why__active" aria-live="polite">
                <h3>{WHY[0].title}</h3>
                <p>{WHY[0].text}</p>
              </div>
              <p className="wd-why__count" aria-hidden="true">01 / 06</p>
              <div className="wd-why__dots" aria-hidden="true"><i className="on" /><i /><i /><i /><i /><i /></div>
            </div>
            <div className="wd-why__deck">
              {WHY.map(({ Icon, title, text, image }, i) => (
                <article className="wd-why__card" key={title}>
                  <img className={`wd-why__bg${i === 0 ? " wd-why__bg--portrait" : ""}`} src={image} alt={`${title} illustration`} width={image.includes("mobile-first") ? 1024 : 1536} height={image.includes("mobile-first") ? 1536 : 1024} loading="lazy" decoding="async" />
                  <div className="wd-why__body">
                    <span className="wd-why__icon"><Icon aria-hidden="true" size={22} /></span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== COMPARE ============================== */}
        <section className="wd-section wd-compare-sec" aria-labelledby="wd-cmp-h">
          <div className="container">
            <Head
              center
              eyebrow="Before & after"
              lead="Drag the slider to compare. Cluttered layouts, slow loading and tiny text drive visitors away. A clean, mobile-first build keeps them reading and enquiring."
            >
              <span id="wd-cmp-h">From slow and outdated to <em>fast and modern</em></span>
            </Head>
            <div
              className="wd-compare"
              style={{ ["--p" as string]: "50%" }}
            >
              <div className="wd-old" aria-hidden="true">
                <img
                  className="wd-compare__image"
                  src="/new-images/services/webdev/website-before-d.webp"
                  alt=""
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="wd-new" aria-hidden="true">
                <img
                  className="wd-compare__image"
                  src="/new-images/services/webdev/website-after.webp"
                  alt=""
                  width={1457}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="wd-tag wd-tag--o" aria-hidden="true"><i />Before · 8.4s load</span>
              <span className="wd-tag wd-tag--n" aria-hidden="true"><i />After · 0.9s load</span>
              <div className="wd-handle" aria-hidden="true"><i>‹›</i></div>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={50}
                aria-label="Drag to compare an old, slow website with a new, fast website"
                onChange={(e) => e.currentTarget.parentElement?.style.setProperty("--p", `${e.currentTarget.value}%`)}
              />
            </div>

          </div>
        </section>

        {/* ============================ INDUSTRIES ============================ */}
        <section className="wd-section wd-industries">
          <div className="container">
            <Head
              center
              eyebrow="Who we build for"
              lead="We have designed and developed websites for training institutes, clinics, manufacturers and software companies, and tailor each one to its customers."
            >
              Websites for every kind of <em>business</em>
            </Head>
            <ul className="wd-ind-grid">
              {INDUSTRIES.map((n, i) => (
                <li className="wd-ind" key={n.name} data-reveal>
                  <img className="wd-ind__bg" src={n.img} alt={n.name} width={800} height={560} loading="lazy" decoding="async" />
                  <div className="wd-ind__pill">
                    <span className="wd-ind__no" aria-hidden="true">0{i + 1}</span>
                    <div className="wd-ind__info">
                      <h3>{n.name}</h3>
                      <p>{n.text}</p>
                    </div>
                    <span className="wd-ind__go" aria-hidden="true"><ArrowRight size={15} /></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================== RELATED ============================== */}
        <section className="wd-section wd-related">
          <div className="container">
            <Head
              center
              eyebrow="Explore other services"
              lead="A great website works best with the right partners around it. Pick a service below and see how it helps you get found, look sharper and sell more."
            >
              Explore more ways to <em>grow online</em>
            </Head>
            <div className="wd-rel-grid">
              {RELATED.map(({ to, title, text, Icon, img: bg }, i) => (
                <Link className="wd-rel" to={to} key={to} data-reveal>
                  <img className="wd-rel__bg" src={bg} alt={title} width={1536} height={1024} loading="lazy" decoding="async" />
                  <div className="wd-rel__pill">
                    <span className="wd-rel__no" aria-hidden="true">0{i + 1}</span>
                    <div className="wd-rel__info">
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                    <span className="wd-rel__more">
                      <span>Explore</span>
                      <ArrowRight aria-hidden="true" size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="wd-rel-all" data-reveal>
              <Link className="wd-rel-all__link" to="/services">
                <span>View all services</span>
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ================================ CTA ================================ */}
        <section className="wd-cta-sec" id="wd-contact">
          <div className="container">
            <div className="wd-cta">
              <span className="wd-cta__dot" aria-hidden="true" />
              <span className="wd-cta__glow wd-cta__glow--a" aria-hidden="true" />
              <span className="wd-cta__glow wd-cta__glow--b" aria-hidden="true" />

              <div className="wd-cta__copy">
                <p className="eyebrow"><span />Let’s build together</p>
                <h2>Have a website in mind? <em>Let’s make it happen.</em></h2>
                <p>Tell us what you need and we will send a plan and a quote.</p>
              </div>

              <div className="wd-cta__plane" aria-hidden="true">
                <svg viewBox="0 0 360 200" fill="none">
                  <path className="wd-cta__trail" d="M4 176 C 60 190, 90 140, 150 150 S 240 160, 260 110 S 320 50, 352 34" stroke="#ffe401" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 12" />
                  <g className="wd-cta__paper">
                    <polygon points="150,70 262,18 224,136" fill="#ffe401" />
                    <polygon points="150,70 262,18 190,92" fill="#fff07a" />
                    <polygon points="190,92 224,136 262,18" fill="#f2d000" />
                    <polygon points="190,92 205,132 172,118" fill="#d9b800" />
                  </g>
                </svg>
              </div>

              <Link className="wd-cta__btn wd-mag" to="/contact">
                <span>Get a free website quote</span>
                <ArrowUpRight aria-hidden="true" size={20} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}