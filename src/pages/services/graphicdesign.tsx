import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Layers,
  Package,
  Palette,
  PenTool,
  Presentation,
  Printer,
  Share2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Seo from "../../components/Seo";
import RelatedServicesSection, { type RelatedServiceItem } from "../../components/RelatedServicesSection";
import "../../styles/services/graphicdesign.css";
import "../../styles/services/service-hero-consistency.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Unsplash has no tool logos, so they come from the Devicon CDN */
const dev = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Responsive photo: three widths, the browser picks one by the slot it is drawn in.
   It hides itself if an Unsplash id ever 404s, so layouts never show a broken-image icon. */
function Photo({
  id,
  w = 900,
  h,
  alt = "",
  className,
  eager,
  sizes = "(max-width: 767px) 92vw, (max-width: 1100px) 50vw, 600px",
}: {
  id: string;
  w?: number;
  h?: number;
  alt?: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const small = Math.round(w * 0.5);
  const big = Math.round(w * 1.6);
  return (
    <img
      className={className}
      src={unsplash(id, w)}
      srcSet={`${unsplash(id, small)} ${small}w, ${unsplash(id, w)} ${w}w, ${unsplash(id, big)} ${big}w`}
      sizes={sizes}
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
          <span className="gd-w">
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
    <div className={`gd-head${center ? " gd-head--center" : ""}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2 className="gd-title">{children}</h2>
      {lead && <p className="gd-lead">{lead}</p>}
    </div>
  );
}

/* the sample brand mark used across the page: ring, triangle and dot */
function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`gd-logo ${className}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle className="gd-lg__ring" cx="60" cy="60" r="54" />
      <path className="gd-lg__tri" d="M60 24 L96 88 H24 Z" />
      <circle className="gd-lg__dot" cx="60" cy="70" r="11" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const MARQUEE = [
  "Logo design",
  "Brand identity",
  "Social media creatives",
  "Brochures and flyers",
  "Packaging and labels",
  "Posters and banners",
  "Visiting cards",
  "Pitch decks",
  "Infographics",
  "Menus and price lists",
];

const SCENE: { tag: string; title: string; em: string; text: string; details: string[] }[] = [
  {
    tag: "Brief",
    title: "Start with who you are,",
    em: "not with a logo.",
    text: "We learn about your business, customers and competitors, then collect references together, so the design has a direction before the first sketch.",
    details: ["Short brief and questionnaire", "A moodboard of references you react to", "Audience and tone agreed in writing"],
  },
  {
    tag: "Sketch",
    title: "Test the idea on paper",
    em: "before it gets pretty.",
    text: "Shapes, grids and proportions are explored in rough form, so strong ideas surface before colour and polish can hide weak ones.",
    details: ["Distinct directions to choose from", "Simple shapes that scale up and down", "Your pick, with notes"],
  },
  {
    tag: "Style",
    title: "Add colour, type",
    em: "and personality.",
    text: "The chosen direction gets a palette, a font pairing and logo versions for every background, so it holds together everywhere.",
    details: ["Colours with readable contrast", "A heading and body font pairing", "Logo versions for light, dark and one colour"],
  },
  {
    tag: "Deliver",
    title: "See it on real things,",
    em: "then take the files.",
    text: "The design is shown on cards, posts and letterheads, then handed over as files ready for print and screen.",
    details: ["Mock-ups of real use", "Print and web file formats", "A short brand guide"],
  },
];

const SERVICES: { n: string; title: string; text: string; tags: string[]; img: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    title: "Logo design",
    text: "A mark that stays clear as a 16 px favicon and as a signboard, with versions for light, dark and one-colour use.",
    tags: ["Primary logo", "Icon and stacked", "Colour and mono"],
    img: "1626785774573-4b799315345d",
    Icon: PenTool,
  },
  {
    n: "02",
    title: "Brand identity",
    text: "Colour, type, imagery and layout rules that make everything you publish look like it came from one confident team.",
    tags: ["Colour system", "Typography", "Brand guide"],
    img: "1561070791-2526d30994b5",
    Icon: Palette,
  },
  {
    n: "03",
    title: "Social media creatives",
    text: "Posts, stories, carousels and ad banners built from templates, so your feed stays consistent and quick to update.",
    tags: ["Post templates", "Stories and reels covers", "Ad banners"],
    img: "1611162617213-7d7a39e9b1d7",
    Icon: Share2,
  },
  {
    n: "04",
    title: "Print and stationery",
    text: "Brochures, flyers, posters, visiting cards and letterheads, prepared with the right bleed, margins and colour mode.",
    tags: ["Brochures", "Cards and letterheads", "Posters"],
    img: "1586717791821-3f44a563fa4c",
    Icon: Printer,
  },
  {
    n: "05",
    title: "Packaging and labels",
    text: "Boxes, pouches and labels that stand out on a shelf, with dielines and print specifications ready for your printer.",
    tags: ["Boxes and sleeves", "Labels", "Dielines"],
    img: "1556228720-195a672e8a03",
    Icon: Package,
  },
  {
    n: "06",
    title: "Presentations and decks",
    text: "Pitch decks and company profiles with clear structure, tidy charts and a layout your team can keep editing.",
    tags: ["Pitch decks", "Company profiles", "Editable templates"],
    img: "1460925895917-afdab827c52f",
    Icon: Presentation,
  },
];

const MOODS: {
  key: string;
  label: string;
  line: string;
  head: string;
  bg: string;
  fg: string;
  acc: string;
  font: string;
  r: number;
  hex: string[];
  fontName: string;
}[] = [
  {
    key: "bold",
    label: "Bold",
    line: "Loud, confident and hard to ignore.",
    head: "Make some noise.",
    bg: "#fff4b8",
    fg: "#100563",
    acc: "#ff5a36",
    font: '"Arial Black", Impact, "Helvetica Neue", sans-serif',
    r: 6,
    hex: ["#FFF4B8", "#100563", "#FF5A36"],
    fontName: "Arial Black",
  },
  {
    key: "calm",
    label: "Calm",
    line: "Quiet, trustworthy and easy on the eye.",
    head: "Breathe easy.",
    bg: "#e8f3ef",
    fg: "#1d3b36",
    acc: "#5fa392",
    font: 'Georgia, "Times New Roman", serif',
    r: 18,
    hex: ["#E8F3EF", "#1D3B36", "#5FA392"],
    fontName: "Georgia",
  },
  {
    key: "playful",
    label: "Playful",
    line: "Friendly, bright and full of personality.",
    head: "Let’s have fun.",
    bg: "#ffe9f3",
    fg: "#3a1c71",
    acc: "#ff7eb6",
    font: '"Trebuchet MS", "Segoe UI", sans-serif',
    r: 30,
    hex: ["#FFE9F3", "#3A1C71", "#FF7EB6"],
    fontName: "Trebuchet MS",
  },
  {
    key: "premium",
    label: "Premium",
    line: "Refined, calm and quietly expensive.",
    head: "Crafted with intent.",
    bg: "#f6f1e7",
    fg: "#2b2118",
    acc: "#b8893b",
    font: '"DM Serif Display", Georgia, serif',
    r: 2,
    hex: ["#F6F1E7", "#2B2118", "#B8893B"],
    fontName: "DM Serif Display",
  },
];

const WORK: { cat: string; title: string; tag: string; img: string; span?: "tall" | "wide" }[] = [
  { cat: "branding", title: "Café identity", tag: "Logo · Menu · Signage", img: "1561070791-2526d30994b5", span: "tall" },
  { cat: "social", title: "Festival campaign", tag: "Posts · Stories", img: "1611162617213-7d7a39e9b1d7", span: "wide" },
  { cat: "print", title: "Training brochure", tag: "Tri-fold · Flyers", img: "1586717791821-3f44a563fa4c" },
  { cat: "packaging", title: "Skincare labels", tag: "Box · Label", img: "1556228720-195a672e8a03", span: "tall" },
  { cat: "branding", title: "Fitness studio kit", tag: "Logo · Cards", img: "1513364776144-60967b0f800f" },
  { cat: "social", title: "Product launch", tag: "Carousel · Banner", img: "1557672172-298e090bd0f1", span: "wide" },
  { cat: "print", title: "Clinic stationery", tag: "Letterhead · Cards", img: "1579546929518-9e396f3cc809" },
  { cat: "packaging", title: "Gift box range", tag: "Box · Sleeve", img: "1523275335684-37898b6baf30" },
];

const PROC: { title: string; when: string; text: string; you: string[]; get: string[] }[] = [
  {
    title: "Brief and discovery",
    when: "Days 1 to 2",
    text: "A short call and a one-page questionnaire. We ask who the design is for, what it must say, and what you have already seen and liked or disliked.",
    you: ["Your business and audience", "Competitors and references", "Existing logo, colours or files"],
    get: ["A written design brief", "Scope, files and timeline", "An itemised quote"],
  },
  {
    title: "Research and moodboard",
    when: "Days 3 to 4",
    text: "We look at your market, gather visual references and pull them into a moodboard, so the direction is agreed before any design time is spent.",
    you: ["Reactions to the moodboard", "Words that fit your brand", "Anything to avoid"],
    get: ["Moodboard and tone notes", "Colour and type leanings", "A confirmed direction"],
  },
  {
    title: "Concepts",
    when: "Days 5 to 9",
    text: "We sketch and design a small set of distinct directions, then present them on realistic mock-ups so you judge them in context.",
    you: ["Your pick or a blend", "Notes on what to push further", "Decision-makers in the room"],
    get: ["Concept directions", "Mock-ups in use", "Reasons behind each choice"],
  },
  {
    title: "Refine and feedback",
    when: "Days 10 to 13",
    text: "We polish the chosen concept through clear revision rounds. Feedback is gathered in one place, so changes stay focused and nothing gets lost.",
    you: ["Consolidated feedback", "Approval at each round", "Copy and images for layouts"],
    get: ["Revised designs", "Final colours and fonts", "A signed-off design"],
  },
  {
    title: "Final files and guide",
    when: "Day 14 onwards",
    text: "We package everything for print and screen, write a short guide to using it, and stay available for questions as you start putting it to work.",
    you: ["Final approval", "Printer or platform details", "Payment of the final milestone"],
    get: ["Print and web files", "Source files", "A short brand guide"],
  },
];

const HANDOVER: { title: string; text: string; tag: string; wide?: boolean }[] = [
  { title: "A logo suite", text: "Primary, stacked and icon versions in colour, dark and one-colour, so it always fits the space.", tag: "SVG · PNG · PDF", wide: true },
  { title: "Colour and type system", text: "Your palette with codes, plus heading and body fonts and how to pair them.", tag: "HEX · CMYK · OTF", wide: true },
  { title: "Social templates", text: "Editable post and story layouts that keep your feed consistent.", tag: "FIGMA · CANVA" },
  { title: "Print-ready files", text: "CMYK, bleed and crop marks set up for your printer.", tag: "300 DPI · PDF/X" },
  { title: "Source files", text: "Editable files, so you are never locked in.", tag: "AI · PSD · FIG" },
  { title: "A short brand guide", text: "Plain rules for logo space, colours and fonts.", tag: "BRAND PDF" },
];

type Tech = { name: string; icon: string };

const ROW_A: Tech[] = [
  { name: "Figma", icon: dev("figma/figma-original") },
  { name: "Photoshop", icon: dev("photoshop/photoshop-plain") },
  { name: "Illustrator", icon: dev("illustrator/illustrator-plain") },
  { name: "Adobe XD", icon: dev("xd/xd-plain") },
  { name: "Blender", icon: dev("blender/blender-original") },
  { name: "Canva", icon: dev("canva/canva-original") },
];

const ROW_B = ["Typography", "Colour theory", "Grid systems", "Print prep", "Accessibility", "Visual hierarchy", "Brand consistency", "Motion basics"];

const RELATED: RelatedServiceItem[] = [
  { to: "/services/ui-ux", title: "UI/UX design", text: "Interfaces that feel obvious and look great.", img: "/new-images/services/webdev/related-ui-ux.webp" },
  { to: "/services/web-development", title: "Web development", text: "Fast, search-friendly websites and portals.", img: "/new-images/services/webdev/related-web-development.webp" },
  { to: "/services/digital-marketing", title: "Digital marketing", text: "Put your new look in front of the right people.", img: "/new-images/services/webdev/related-seo.webp" },
  { to: "/services/ecommerce", title: "E-commerce development", text: "Online stores that sell and scale.", img: "/new-images/services/webdev/related-ecommerce.webp" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function GraphicDesign() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svcFirst = useRef(true);
  const moodFirst = useRef(true);

  const [svc, setSvc] = useState(0);
  const [mood, setMood] = useState(0);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  };

  /* ================= SERVICES: rows open, the cursor preview swaps ================= */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const calm = reduced();
    const first = svcFirst.current;
    svcFirst.current = false;
    const t = calm || first ? 0 : 0.55;

    root.querySelectorAll<HTMLElement>(".gd-svc__row").forEach((row, i) => {
      const on = i === svc;
      const body = row.querySelector<HTMLElement>(".gd-svc__more");
      if (body) gsap.to(body, { height: on ? "auto" : 0, autoAlpha: on ? 1 : 0, duration: t, ease: "power3.inOut", overwrite: true });
    });

  }, [svc]);

  /* ================= MOOD: the sample brand card re-dresses itself ================= */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const first = moodFirst.current;
    moodFirst.current = false;
    if (first || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".gd-mc__hl .gd-w > span", { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "power4.out" });
      gsap.fromTo(".gd-mc__logo", { rotation: -60, scale: 0.5 }, { rotation: 0, scale: 1, duration: 0.8, ease: "back.out(2)" });
      gsap.fromTo(".gd-mc__chip", { scale: 0 }, { scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(3)" });
      gsap.fromTo(".gd-mc__sample, .gd-mc__btn", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity,visibility" });
    }, root);
    return () => ctx.revert();
  }, [mood]);

  /* ================= BEFORE / AFTER: a draggable reveal ================= */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const box = root.querySelector<HTMLElement>(".gd-ba__box");
    const input = root.querySelector<HTMLInputElement>(".gd-ba__range");
    if (!box || !input) return;

    const set = (v: number) => {
      const c = Math.min(96, Math.max(4, v));
      box.style.setProperty("--p", String(c));
      input.value = String(c);
    };
    set(50);

    let drag = false;
    let demo: gsap.core.Timeline | null = null;
    const fromX = (x: number) => {
      const r = box.getBoundingClientRect();
      set(((x - r.left) / r.width) * 100);
    };
    const down = (e: PointerEvent) => {
      demo?.kill();
      drag = true;
      box.setPointerCapture(e.pointerId);
      box.classList.add("is-drag");
      fromX(e.clientX);
    };
    const move = (e: PointerEvent) => {
      if (drag) fromX(e.clientX);
    };
    const up = () => {
      drag = false;
      box.classList.remove("is-drag");
    };
    const onInput = () => {
      demo?.kill();
      set(Number(input.value));
    };
    box.addEventListener("pointerdown", down);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerup", up);
    box.addEventListener("pointercancel", up);
    input.addEventListener("input", onInput);

    /* a one-off sweep shows the handle can be dragged */
    let st: ScrollTrigger | null = null;
    if (!reduced()) {
      const prog = { v: 50 };
      st = ScrollTrigger.create({
        trigger: box,
        start: "top 70%",
        once: true,
        onEnter: () => {
          demo = gsap
            .timeline()
            .to(prog, { v: 18, duration: 0.9, ease: "power2.inOut", onUpdate: () => set(prog.v) })
            .to(prog, { v: 82, duration: 1.3, ease: "power2.inOut", onUpdate: () => set(prog.v) })
            .to(prog, { v: 50, duration: 0.8, ease: "power2.inOut", onUpdate: () => set(prog.v) });
        },
      });
    }

    return () => {
      demo?.kill();
      st?.kill();
      box.removeEventListener("pointerdown", down);
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerup", up);
      box.removeEventListener("pointercancel", up);
      input.removeEventListener("input", onInput);
    };
  }, []);

  /* ================= MAIN: hero, scene, process, rails, reveals ================= */
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

        /* sticky call-to-action and section dots appear once the hero is behind you */
        ScrollTrigger.create({
          trigger: one(".gd-hero"),
          start: "bottom 35%",
          onEnter: () => root.classList.add("is-past"),
          onLeaveBack: () => root.classList.remove("is-past"),
        });

        if (!motion) {
          return () => root.classList.remove("is-past");
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
          .from($(".gd-hero .breadcrumb"), { y: 14, autoAlpha: 0, duration: 0.55, clearProps: "all" })
          .from($(".gd-hero__title .gd-w > span"), { yPercent: 115, duration: 0.95, stagger: 0.045, clearProps: "transform" }, 0.08)
          .from($(".gd-hero__lead, .gd-hero__cta > *, .gd-hero__trust li"), { y: 18, autoAlpha: 0, duration: 0.65, stagger: 0.06, clearProps: "all" }, 0.42)
          .from(one(".gd-hero__visual"), { scale: 0.92, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: "all" }, 0.2);

        if (fine) {
          const hero = one(".gd-hero");
          const visualSvg = one(".gd-hero__svg");
          if (visualSvg) {
            const qx = gsap.quickTo(visualSvg, "x", { duration: 0.9, ease: "power3" });
            const qy = gsap.quickTo(visualSvg, "y", { duration: 0.9, ease: "power3" });
            const mv = (e: PointerEvent) => {
              const nx = e.clientX / window.innerWidth - 0.5;
              const ny = e.clientY / window.innerHeight - 0.5;
              qx(nx * 18);
              qy(ny * 14);
            };
            hero.addEventListener("pointermove", mv);
            off.push(() => hero.removeEventListener("pointermove", mv));
          }

          /* magnetic buttons */
          $(".gd-mag").forEach((b) => {
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

          /* handover tiles: a soft spotlight follows the cursor */
          const grid = one(".gd-ho__grid");
          const tiles = $(".gd-ho");
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
          const mq = gsap.to(one(".gd-marquee__track"), { xPercent: -50, repeat: -1, duration: 32, ease: "none" });
          ScrollTrigger.create({
            onUpdate: (s) => {
              mq.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 300, 5));
              gsap.to(mq, { timeScale: 1, duration: 0.8, overwrite: true });
            },
          });
        }

        /* ================= SERVICES + MOOD + BEFORE/AFTER: entrances ================= */
        gsap.from($(".gd-svc__row"), {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: one(".gd-svc__list"), start: "top 82%", once: true },
        });
        gsap.from(one(".gd-ba__box"), {
          y: 60,
          scale: 0.95,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "opacity,visibility",
          scrollTrigger: { trigger: one(".gd-ba__box"), start: "top 88%", once: true },
        });
        gsap.from([one(".gd-mood__ctrl"), one(".gd-mc")], {
          y: 50,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: one(".gd-mood__grid"), start: "top 82%", once: true },
        });

        /* ================= SCENE: a brand takes shape on an artboard ================= */
        {
          const section = one(".gd-scene");
          const steps = $(".gd-sstep");
          const board = one(".gd-board");
          const counter = one(".gd-scene__count");
          const stateEl = one(".gd-board__txt");
          const moodL = one(".gd-l--mood");
          const tiles = $(".gd-mtile");
          const sketch = one(".gd-l--sketch");
          const skPaths = $<SVGGeometryElement>(".gd-sk__p");
          const style = one(".gd-l--style");
          const pal = $(".gd-pal i");
          const spec = one(".gd-spec");
          const mocks = $(".gd-mock");
          const files = $(".gd-files span");
          const logoParts = $(".gd-l--style .gd-st__shape > *");

          if (wide) {
            fitHeight(one(".gd-steps"), steps);
            document.fonts?.ready.then(() => fitHeight(one(".gd-steps"), steps));

            skPaths.forEach((p) => {
              const len = p.getTotalLength();
              p.style.strokeDasharray = String(len);
              p.style.strokeDashoffset = String(len);
            });
            gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
            gsap.set(board, { y: 0, autoAlpha: 1 });
            gsap.set(tiles, { autoAlpha: 1, y: 0, scale: 1 });
            gsap.set([sketch, style], { autoAlpha: 0 });
            gsap.set(logoParts, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
            gsap.set(pal, { scale: 0 });
            gsap.set(spec, { autoAlpha: 0, x: 30 });
            gsap.set(mocks, { autoAlpha: 0, y: 40, scale: 0.9 });
            gsap.set(files, { autoAlpha: 0, y: 12 });

            const states = ["Brief", "Sketch", "Style", "Deliver"];
            let cur = -1;
            const show = (i: number) => {
              if (i === cur) return;
              cur = i;
              counter.textContent = `0${i + 1} / 04`;
              stateEl.textContent = states[i];
            };
            show(0);

            const U = 2.4;
            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=380%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => show(Math.min(3, Math.floor(self.progress * 4 + 0.08))),
              },
            });

            /* stage copy transitions */
            [0, 1, 2, 3].forEach((s) => {
              if (s < 3) {
                const sw = (s + 1) * U - 0.5;
                tl.to(steps[s], { autoAlpha: 0, y: -24, duration: 0.35 }, sw)
                  .fromTo(steps[s + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5 }, sw + 0.35);
              }
            });

            /* 1 · brief: the moodboard fills in */
            tl.to(board, { y: 0, autoAlpha: 1, duration: 0.9 }, 0)
              .to(tiles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 }, 0.6);

            /* 2 · sketch: the moodboard steps back and the logo is drawn */
            tl.to(moodL, { autoAlpha: 0, scale: 0.94, duration: 0.5 }, U - 0.4)
              .to(sketch, { autoAlpha: 1, duration: 0.4 }, U - 0.2)
              .to(skPaths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.035, ease: "power1.inOut" }, U);

            /* 3 · style: colour arrives, with a palette and a type specimen */
            tl.to(style, { autoAlpha: 1, duration: 0.4 }, U * 2 - 0.1)
              .to(sketch, { autoAlpha: 0.12, duration: 0.5 }, U * 2)
              .to(logoParts, { autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.14, ease: "back.out(2)" }, U * 2 + 0.1)
              .to(pal, { scale: 1, duration: 0.45, stagger: 0.1, ease: "back.out(3)" }, U * 2 + 0.5)
              .to(spec, { autoAlpha: 1, x: 0, duration: 0.5 }, U * 2 + 0.7);

            /* 4 · deliver: palette and type make way for real mock-ups and files */
            tl.to([pal, spec], { autoAlpha: 0, y: -16, duration: 0.4, stagger: 0.04 }, U * 3 - 0.2)
              .to(sketch, { autoAlpha: 0, duration: 0.3 }, U * 3 - 0.2)
              .to(mocks, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.16, ease: "back.out(1.6)" }, U * 3 + 0.1)
              .to(files, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, U * 3 + 0.9)
              .to({}, { duration: 0.01 }, U * 4);
          } else {
            /* small screens: the finished artboard simply arrives */
            gsap.from(board, {
              y: 50,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: board, start: "top 85%", once: true },
            });
            gsap.from(mocks, {
              y: 30,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "back.out(1.6)",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: board, start: "top 70%", once: true },
            });

          }
        }

        /* ================= WORK: images reveal, then drift inside their frames ================= */
        gsap.from($(".gd-work__item"), {
          y: 50,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: one(".gd-work__grid"), start: "top 82%", once: true },
        });
        if (wide) {
          $(".gd-work__item img").forEach((im) => {
            gsap.fromTo(
              im,
              { yPercent: -6, scale: 1.12 },
              { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: im.parentElement, start: "top bottom", end: "bottom top", scrub: true } }
            );
          });
        }

        /* ================= PROCESS: sticky stage panel, cards take their turn ================= */
        {
          const cards = $(".gd-pcard");
          const ring = one<SVGCircleElement>(".gd-proc__ringfill");
          const num = one(".gd-proc__num");
          const toc = $(".gd-proc__toc li");
          const C = 2 * Math.PI * 46;
          gsap.set(ring, { strokeDasharray: C, strokeDashoffset: C });

          const setCur = (i: number) => {
            cards.forEach((c, k) => {
              c.classList.toggle("is-cur", k === i);
              c.classList.toggle("is-on", k <= i);
            });
            toc.forEach((t, k) => {
              t.classList.toggle("on", k === i);
              t.classList.toggle("done", k < i);
            });
            num.textContent = `0${i + 1}`;
          };
          setCur(0);

          ScrollTrigger.create({
            trigger: one(".gd-proc__cards"),
            start: "top 55%",
            end: "bottom 55%",
            onUpdate: (self) => gsap.to(ring, { strokeDashoffset: C * (1 - self.progress), duration: 0.35, ease: "power2.out", overwrite: true }),
          });

          cards.forEach((c, i) => {
            ScrollTrigger.create({
              trigger: c,
              start: "top 58%",
              end: "bottom 58%",
              onToggle: (self) => {
                if (self.isActive) setCur(i);
              },
            });
            const once = { trigger: c, start: "top 80%", once: true };
            gsap.from(c, { y: 60, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: once });
            gsap.from($(".gd-pcard__cols li", c), { x: -16, autoAlpha: 0, duration: 0.5, stagger: 0.07, delay: 0.35, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: once });
            gsap.fromTo(one(".gd-pcard__ghost", c), { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
          });
        }

        /* ================= HANDOVER: tiles settle in ================= */
        gsap.from($(".gd-ho"), {
          y: 50,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: one(".gd-ho__grid"), start: "top 85%", once: true },
        });

        /* ================= TOOLS: two rails slide in opposite directions ================= */
        {
          const tech = one(".gd-tech");
          gsap.fromTo(one(".gd-tech__a"), { xPercent: 0 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: tech, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(one(".gd-tech__b"), { xPercent: -22 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: tech, start: "top bottom", end: "bottom top", scrub: true } });
        }

        /* ================= light reveal for list content ================= */
        {
          const reveals = $("[data-reveal]") as HTMLElement[];
          const revealBatch = (els: Element[]) => {
            if (!els.length) return; els.forEach((el) => el.classList.add("is-in"));
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              stagger: 0.07,
              duration: 0.72,
              ease: "power3.out",
              overwrite: "auto",
              clearProps: "all",
            });
          };

          if (typeof IntersectionObserver !== "undefined" && reveals.length) {
            const pending = new Set<Element>();
            const vh = window.innerHeight || 900;
            reveals.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.top <= vh * 0.96) {
                gsap.set(el, { clearProps: "all" });
              } else {
                gsap.set(el, { autoAlpha: 0, y: 28 });
                pending.add(el);
              }
            });

            if (pending.size) {
              const io = new IntersectionObserver(
                (entries) => {
                  const hit: Element[] = [];
                  entries.forEach((entry) => {
                    if (entry.isIntersecting || entry.boundingClientRect.top <= (window.innerHeight || 900) * 0.96) {
                      if (pending.has(entry.target)) {
                        pending.delete(entry.target);
                        io.unobserve(entry.target);
                        hit.push(entry.target);
                      }
                    }
                  });
                  if (hit.length) revealBatch(hit);
                },
                { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
              );
              pending.forEach((el) => io.observe(el));

              const onScrollFallback = () => {
                if (!pending.size) return;
                const h = window.innerHeight || 900;
                const hit: Element[] = [];
                pending.forEach((el) => {
                  if (el.getBoundingClientRect().top <= h * 0.98) {
                    pending.delete(el);
                    io.unobserve(el);
                    hit.push(el);
                  }
                });
                if (hit.length) revealBatch(hit);
              };
              window.addEventListener("scroll", onScrollFallback, { passive: true });
              off.push(() => {
                io.disconnect();
                window.removeEventListener("scroll", onScrollFallback);
              });
            }
          }
        }


        return () => {
          off.forEach((f) => f());
          root.classList.remove("is-motion", "is-wide", "is-past");
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

  const m = MOODS[mood];

  return (
    <>
      <Seo
        title="Graphic Design Services in Indore | Sipher Webtech"
        description="Logo design, brand identity, social media creatives, print, packaging and presentations from Sipher Webtech. Clear process, print-ready files and a consistent look everywhere. Get a free design consultation."
      />

      <div className="gd" ref={rootRef}>
        {/* ============================ HERO ============================ */}
        <section className="gd-hero" aria-labelledby="gd-h1">
          <div className="container gd-hero__grid">
            <div className="gd-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/services">Services</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Graphic Design</span>
              </nav>

              <h1 id="gd-h1" className="gd-hero__title" aria-label="Design that makes people stop, look and remember you.">
                <span className="gd-line" aria-hidden="true"><Words text="Design that makes" /></span>
                <span className="gd-line" aria-hidden="true"><Words text="people stop, look" /></span>
                <em className="gd-line" aria-hidden="true"><Words text="and remember you." /></em>
              </h1>
              <p className="gd-hero__lead">
                From logos and brand identities to social creatives, print and packaging, we design visuals that look
                sharp, say the right thing and stay consistent everywhere your customers meet you.
              </p>
              <div className="gd-hero__cta">
                <Link className="button button--primary gd-mag gd-hero__main" to="/contact" data-cursor="START">
                  <span>Start a design brief</span>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <button type="button" className="gd-ghost gd-mag" onClick={() => jump("gd-scene")}>
                  See how we design
                </button>
              </div>
              <ul className="gd-hero__trust">
                {["Print-ready and web-ready files", "Source files included", "One look across every channel"].map((t) => (
                  <li key={t}><Check aria-hidden="true" size={15} />{t}</li>
                ))}
              </ul>
            </div>

            <div className="gd-hero__visual">
              <img
                src="/svg/graphic-design-hero.svg"
                alt="Graphic design studio canvas with brand campaign artboard, logo construction, type specimen, colour swatches and packaging"
                className="gd-hero__svg"
                width={800}
                height={640}
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* =========================== MARQUEE =========================== */}
        <div className="gd-marquee" aria-hidden="true">
          <div className="gd-marquee__track">
            {[0, 1].map((g) => (
              <div className="gd-marquee__group" key={g}>
                {MARQUEE.map((t) => <span key={t}>{t}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* ===================== PINNED: BRIEF TO BRAND ===================== */}
        <section className="gd-scene" id="gd-scene" aria-label="How a brand takes shape">
          <div className="gd-scene__bg" aria-hidden="true" />
          <div className="container gd-scene__grid">
            <div className="gd-scene__copy">
              <h2 className="gd-sr">How we design a brand, step by step</h2>
              <div className="gd-steps">
                {SCENE.map((s) => (
                  <div className="gd-sstep" key={s.tag}>
                    <p className="eyebrow"><span />{s.tag}</p>
                    <h3>{s.title} <em>{s.em}</em></h3>
                    <p>{s.text}</p>
                    <ul className="gd-sstep__list">
                      {s.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="gd-scene__count" aria-hidden="true">01 / 04</p>
            </div>

            <div className="gd-scene__stage" aria-hidden="true">
              <div className="gd-board">
                <div className="gd-board__bar">
                  <i /><i /><i />
                  <span>brand-board.fig</span>
                  <em className="gd-board__state"><b /><span className="gd-board__txt">Brief</span></em>
                </div>

                <div className="gd-board__canvas">
                  {/* moodboard */}
                  <div className="gd-l gd-l--mood">
                    {[
                      { id: "1513364776144-60967b0f800f", t: "Texture" },
                      { id: "1557672172-298e090bd0f1", t: "Colour" },
                      { id: "1561070791-2526d30994b5", t: "Type" },
                      { id: "1558591710-4b4a1ae0f04d", t: "Mood" },
                      { id: "1523275335684-37898b6baf30", t: "Product" },
                      { id: "1556228720-195a672e8a03", t: "Pack" },
                    ].map((t) => (
                      <div className="gd-mtile" key={t.t}>
                        <Photo id={t.id} w={320} h={240} sizes="(max-width: 899px) 30vw, 200px" />
                        <span>{t.t}</span>
                      </div>
                    ))}
                  </div>

                  {/* sketch */}
                  <svg className="gd-l gd-l--sketch" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" focusable="false">
                    <g className="gd-sk__grid">
                      <line x1="0" y1="126" x2="400" y2="126" />
                      <line x1="122" y1="0" x2="122" y2="300" />
                      <line x1="222" y1="20" x2="222" y2="280" />
                      <circle cx="122" cy="126" r="88" />
                      <rect x="48" y="52" width="148" height="148" rx="6" />
                      <line x1="48" y1="222" x2="196" y2="222" />
                      <line x1="48" y1="252" x2="196" y2="252" />
                    </g>
                    {/* primary mark wireframe */}
                    <circle className="gd-sk__p" cx="122" cy="126" r="60" />
                    <path className="gd-sk__p" d="M122 82 L166 160 H78 Z" />
                    <circle className="gd-sk__p" cx="122" cy="141" r="10.5" />
                    {/* anchor handles */}
                    <rect className="gd-sk__p gd-sk__handle" x="44" y="48" width="8" height="8" rx="1.5" />
                    <rect className="gd-sk__p gd-sk__handle" x="192" y="48" width="8" height="8" rx="1.5" />
                    <rect className="gd-sk__p gd-sk__handle" x="44" y="196" width="8" height="8" rx="1.5" />
                    <rect className="gd-sk__p gd-sk__handle" x="192" y="196" width="8" height="8" rx="1.5" />
                    {/* wordmark construction */}
                    <line className="gd-sk__p" x1="68" y1="234" x2="176" y2="234" />
                    <line className="gd-sk__p" x1="88" y1="248" x2="156" y2="248" />
                    {/* right-side scale tests & bezier study */}
                    <rect className="gd-sk__p gd-sk__box" x="242" y="46" width="126" height="68" rx="10" />
                    <circle className="gd-sk__p" cx="272" cy="80" r="18" />
                    <path className="gd-sk__p" d="M272 67 L284 89 H260 Z" />
                    <circle className="gd-sk__p" cx="316" cy="80" r="12" />
                    <path className="gd-sk__p" d="M316 72 L324 86 H308 Z" />
                    <circle className="gd-sk__p" cx="348" cy="80" r="7" />
                    {/* concept notes & curve */}
                    <rect className="gd-sk__p gd-sk__box" x="242" y="130" width="126" height="122" rx="10" />
                    <path className="gd-sk__p gd-sk__note" d="M258 152 H352" />
                    <path className="gd-sk__p gd-sk__note" d="M258 170 H332" />
                    <path className="gd-sk__p gd-sk__note" d="M258 188 H344" />
                    <path className="gd-sk__p gd-sk__curve" d="M258 228 C286 200 322 246 352 212" />
                    <circle className="gd-sk__p gd-sk__handle" cx="258" cy="228" r="3" />
                    <circle className="gd-sk__p gd-sk__handle" cx="352" cy="212" r="3" />
                  </svg>

                  {/* styled logo, palette and type */}
                  <div className="gd-l gd-l--style">
                    <svg className="gd-st__logo" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" focusable="false">
                      <g className="gd-st__shape">
                        <circle className="gd-st__ring" cx="116" cy="126" r="60" />
                        <path className="gd-st__tri" d="M116 82 L160 160 H72 Z" />
                        <circle className="gd-st__dot" cx="116" cy="141" r="10.5" />
                      </g>
                      <text className="gd-st__word" x="116" y="240" textAnchor="middle">northfield</text>
                    </svg>
                    <div className="gd-pal">
                      <i data-hex="#100563" />
                      <i data-hex="#FFE401" />
                      <i data-hex="#1E1185" />
                      <i data-hex="#EEF1FB" />
                    </div>
                    <div className="gd-spec">
                      <b>Aa</b>
                      <div>
                        <span>DM Serif Display</span>
                        <small>400 · 700 · Heading</small>
                      </div>
                    </div>
                  </div>

                  {/* mock-ups */}
                  <div className="gd-mock gd-mock--card">
                    <div className="gd-mock__cardtop">
                      <LogoMark />
                      <span>NORTHFIELD</span>
                    </div>
                    <b>Aarav Mehta</b>
                    <small>Founder · Brand Studio</small>
                  </div>
                  <div className="gd-mock gd-mock--post">
                    <Photo id="1558591710-4b4a1ae0f04d" w={260} h={260} sizes="(max-width: 899px) 30vw, 160px" />
                    <div className="gd-mock__postgrad" />
                    <b>New season</b>
                  </div>
                  <div className="gd-mock gd-mock--sheet">
                    <LogoMark />
                    <i /><i /><i /><i />
                  </div>
                  <div className="gd-files"><span>.AI</span><span>.SVG</span><span>.PDF</span><span>.PNG</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ SERVICES ============================ */}
        <section className="gd-section gd-services" id="gd-services" aria-labelledby="gd-svc-h">
          <div className="container">
            <Head center eyebrow="What we design" lead="Hover a line, or tap it, to see what is inside and what you receive.">
              <span id="gd-svc-h">Everything your brand <em>puts in front of people.</em></span>
            </Head>

            <div className="gd-svc__layout">
              <div className="gd-svc__list">
                {SERVICES.map(({ n, title, text, tags, img, Icon }, i) => {
                  const on = svc === i;
                  return (
                    <article
                      className={`gd-svc__row${on ? " on" : ""}`}
                      key={title}
                      onPointerEnter={(e) => { if (e.pointerType === "mouse") setSvc(i); }}
                    >
                      <button type="button" className="gd-svc__btn" aria-expanded={on} onClick={() => setSvc(i)} onFocus={() => setSvc(i)}>
                        <span className="gd-svc__n">{n}</span>
                        <span className="gd-svc__icon"><Icon aria-hidden="true" size={20} /></span>
                        <span className="gd-svc__title">{title}</span>
                        <span className="gd-svc__go" aria-hidden="true"><ArrowUpRight size={20} /></span>
                      </button>
                      <div className="gd-svc__more">
                        <div className="gd-svc__body">
                          <div className="gd-svc__inline"><Photo id={img} w={600} h={420} sizes="(max-width: 959px) 92vw, 40vw" /></div>
                          <div>
                            <p>{text}</p>
                            <ul>{tags.map((t) => <li key={t}>{t}</li>)}</ul>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="gd-svc__preview" aria-label="Selected service preview">
                <div className="gd-svc__pmedia">
                  {SERVICES.map((s, i) => (
                    <Photo
                      key={s.title}
                      className={`gd-svc__pimg${svc === i ? " is-active" : ""}`}
                      id={s.img}
                      w={720}
                      h={580}
                      sizes="460px"
                    />
                  ))}
                  <span className="gd-svc__pbadge">
                    <i />
                    {SERVICES[svc].n} · {SERVICES[svc].title}
                  </span>
                </div>
                <div className="gd-svc__pbody">
                  <h3>{SERVICES[svc].title}</h3>
                  <p>{SERVICES[svc].text}</p>
                  <div className="gd-svc__ptags">
                    {SERVICES[svc].tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ========================= BEFORE / AFTER ========================= */}
        <section className="gd-section gd-basec" id="gd-ba" aria-labelledby="gd-ba-h">
          <div className="container">
            <Head center eyebrow="Before and after" lead="Same words, same photo. Drag the handle to see what layout, colour and hierarchy change.">
              <span id="gd-ba-h">Good design is mostly <em>deciding what matters.</em></span>
            </Head>

            <div className="gd-ba__box" role="group" aria-label="Before and after comparison of a flyer">
              {/* after (the base layer) */}
              <div className="gd-ba__layer gd-ba__layer--after">
                <div className="gd-fa">
                  <div className="gd-fa__media">
                    <Photo className="gd-fa__img" id="1516035069371-29a1b244cc32" w={900} h={560} sizes="(max-width: 899px) 92vw, 760px" />
                  </div>
                  <div className="gd-fa__copy">
                    <small><i />Workshop · Sat 14 Dec · 10 am</small>
                    <b>Weekend photography <em>workshop</em></b>
                    <p>Learn composition, light and editing in one relaxed day.</p>
                    <div className="gd-fa__meta">
                      <div><strong>12 Seats</strong><span>Small group</span></div>
                      <div><strong>Studio Lab</strong><span>Indore</span></div>
                    </div>
                    <span className="gd-fa__cta">Book your seat</span>
                  </div>
                </div>
              </div>

              {/* before (clipped from the left by the handle) */}
              <div className="gd-ba__layer gd-ba__layer--before">
                <div className="gd-fb">
                  <Photo className="gd-fb__img" id="1516035069371-29a1b244cc32" w={900} h={560} sizes="(max-width: 899px) 92vw, 760px" />
                  <b className="gd-fb__t1">WEEKEND</b>
                  <b className="gd-fb__t2">Photography Workshop!!!</b>
                  <p className="gd-fb__p">learn composition light and editing in one relaxed day come join us</p>
                  <span className="gd-fb__d">sat 14 dec 10am</span>
                  <span className="gd-fb__btn">BOOK NOW</span>
                  <i className="gd-fb__star">50% OFF</i>
                </div>
              </div>

              <span className="gd-ba__tag gd-ba__tag--b">Before</span>
              <span className="gd-ba__tag gd-ba__tag--a">After</span>

              <span className="gd-ba__handle" aria-hidden="true"><i><ChevronRight size={16} /></i></span>

              <input className="gd-ba__range" type="range" min={4} max={96} defaultValue={50} aria-label="Reveal the redesigned flyer" />
            </div>
          </div>
        </section>

        {/* ============================== MOOD ============================== */}
        <section className="gd-section gd-moodsec" id="gd-mood" aria-labelledby="gd-mood-h">
          <div className="container">
            <Head center eyebrow="Find your mood" lead="Brands feel a certain way before anyone reads a word. Pick one to see how colour, type and shape shift together.">
              <span id="gd-mood-h">How should your brand <em>feel?</em></span>
            </Head>
            <div className="gd-mood__grid">
              <div className="gd-mood__ctrl">
                <span className="gd-mood__label">Choose a direction</span>
                <div className="gd-mood__chips" role="group" aria-label="Brand mood">
                  {MOODS.map((o, i) => (
                    <button key={o.key} type="button" aria-pressed={mood === i} onClick={() => setMood(i)}>
                      <span className="gd-mood__dot" style={{ background: o.acc }} />
                      <span className="gd-mood__name">{o.label}</span>
                    </button>
                  ))}
                </div>
                <div className="gd-mood__readout" aria-live="polite">
                  <p className="gd-mood__line">{m.line}</p>
                  <div className="gd-mood__specs">
                    <span><b>Type</b> {m.fontName}</span>
                    <span><b>Radius</b> {m.r}px</span>
                  </div>
                </div>
              </div>

              <div
                className="gd-mc"
                style={{ "--m-bg": m.bg, "--m-fg": m.fg, "--m-acc": m.acc, "--m-font": m.font, "--m-r": `${m.r}px` } as CSSProperties}
              >
                <div className="gd-mc__top">
                  <div className="gd-mc__brand">
                    <LogoMark className="gd-mc__logo" />
                    <div>
                      <b>sipherweb</b>
                      <small>Brand Identity Preview</small>
                    </div>
                  </div>
                  <span className="gd-mc__pill"><i />{m.label}</span>
                </div>

                <div className="gd-mc__body">
                  <h3 className="gd-mc__hl"><Words text={m.head} /></h3>
                  <p className="gd-mc__sample">A sample line of body text, set to show how this mood reads at a normal size.</p>
                  <div className="gd-mc__actions">
                    <span className="gd-mc__btn">Get in touch</span>
                    <span className="gd-mc__btn gd-mc__btn--ghost">View work</span>
                  </div>
                </div>

                <div className="gd-mc__kit">
                  <div className="gd-mc__swatches">
                    {m.hex.map((h, i) => (
                      <div className="gd-mc__swatch" key={h}>
                        <i style={{ background: h }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div className="gd-mc__typebox">
                    <b>Aa</b>
                    <div>
                      <span>{m.fontName}</span>
                      <small>Radius · {m.r}px</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================== WORK ============================== */}
        <section className="gd-section gd-work" id="gd-work" aria-labelledby="gd-work-h">
          <div className="container">
            <Head center eyebrow="Sample directions" lead="Illustrative concepts that show the kind of work we do across each area. They are samples, not client projects.">
              <span id="gd-work-h">A look at the range, <em>filtered your way.</em></span>
            </Head>

            <div className="gd-work__grid">
              {WORK.map((w) => (
                <article
                  className={`gd-work__item${w.span ? ` gd-work__item--${w.span}` : ""}`}
                  key={w.title}
                >
                  <Photo id={w.img} w={720} h={720} sizes="(max-width: 767px) 92vw, (max-width: 1100px) 46vw, 380px" />
                  <div className="gd-work__cap">
                    <span>{w.cat}</span>
                    <b>{w.title}</b>
                    <small>{w.tag}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== PROCESS ============================== */}
        <section className="gd-section gd-proc" id="gd-process" aria-labelledby="gd-proc-h">
          <div className="container">
            <Head center eyebrow="How we work" lead="A clear path from first call to final files, with you in the loop at every stage.">
              <span id="gd-proc-h">Five steps from <em>brief to brand.</em></span>
            </Head>

            <div className="gd-proc__grid">
              <aside className="gd-proc__side">
                <div className="gd-proc__ring" aria-hidden="true">
                  <svg viewBox="0 0 100 100">
                    <circle className="gd-proc__ringbg" cx="50" cy="50" r="46" />
                    <circle className="gd-proc__ringfill" cx="50" cy="50" r="46" />
                  </svg>
                  <b className="gd-proc__num">01</b>
                  <small>of 05</small>
                </div>
                <ol className="gd-proc__toc">
                  {PROC.map((p, i) => (
                    <li key={p.title}>
                      <button
                        type="button"
                        onClick={() => rootRef.current?.querySelectorAll<HTMLElement>(".gd-pcard")[i]?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" })}
                      >
                        <i>{i + 1}</i>{p.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </aside>

              <div className="gd-proc__cards">
                {PROC.map((p, i) => (
                  <article className="gd-pcard" key={p.title}>
                    <span className="gd-pcard__ghost" aria-hidden="true">0{i + 1}</span>
                    <div className="gd-pcard__head">
                      <h3>{p.title}</h3>
                      <span className="gd-pcard__when">{p.when}</span>
                    </div>
                    <p>{p.text}</p>
                    <div className="gd-pcard__cols">
                      <div>
                        <small>You share</small>
                        <ul>{p.you.map((y) => <li key={y}><Check aria-hidden="true" size={13} />{y}</li>)}</ul>
                      </div>
                      <div>
                        <small>You get</small>
                        <ul>{p.get.map((g) => <li key={g}><Check aria-hidden="true" size={13} />{g}</li>)}</ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================= HANDOVER ============================= */}
        <section className="gd-section gd-handover" id="gd-handover" aria-labelledby="gd-ho-h">
          <div className="container">
            <Head center eyebrow="What you get" lead="Everything arrives organised, named clearly and ready to use, so nothing is lost when you hand it to a printer or a developer.">
              <span id="gd-ho-h">A handover you can <em>actually use.</em></span>
            </Head>

            <div className="gd-ho__grid">
              {HANDOVER.map((h, i) => (
                <article className={`gd-ho${h.wide ? " gd-ho--wide" : ""}`} key={h.title}>
                  <div className="gd-ho__top">
                    <span className="gd-ho__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="gd-ho__tag">{h.tag}</span>
                  </div>
                  <div className="gd-viz" aria-hidden="true">
                    {i === 0 && (
                      <div className="gd-viz__logos">
                        <span className="gd-viz__logo"><LogoMark /><small>Primary</small></span>
                        <span className="gd-viz__logo gd-viz__logo--stack"><LogoMark /><b>sipherweb</b><small>Stacked</small></span>
                        <span className="gd-viz__logo gd-viz__logo--mono"><LogoMark /><small>Inverse</small></span>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="gd-viz__sys">
                        <div className="gd-viz__swatches">
                          <span className="gd-viz__swcard"><i style={{ background: "#100563" }} /><b>#100563</b></span>
                          <span className="gd-viz__swcard"><i style={{ background: "#ffe401" }} /><b>#FFE401</b></span>
                          <span className="gd-viz__swcard"><i style={{ background: "#ff6b4a" }} /><b>#FF6B4A</b></span>
                          <span className="gd-viz__swcard"><i style={{ background: "#eceeff" }} /><b>#ECEEFF</b></span>
                        </div>
                        <div className="gd-viz__type">
                          <b className="gd-viz__aa">Aa</b>
                          <span>Heading &amp; Body</span>
                        </div>
                      </div>
                    )}
                    {i === 2 && (
                      <div className="gd-viz__posts">
                        <span className="gd-viz__sq gd-viz__sq--1"><i /><b>1:1</b></span>
                        <span className="gd-viz__sq gd-viz__sq--2"><i /><b>4:5</b></span>
                        <span className="gd-viz__sq gd-viz__sq--3"><i /><b>9:16</b></span>
                      </div>
                    )}
                    {i === 3 && (
                      <span className="gd-viz__page">
                        <span className="gd-viz__bleed"><i /><i /><i /></span>
                        <b>CMYK ? 3 mm bleed</b>
                      </span>
                    )}
                    {i === 4 && (
                      <div className="gd-viz__files">
                        <span className="gd-viz__file"><i style={{ background: "#ff9a00" }} />.AI</span>
                        <span className="gd-viz__file"><i style={{ background: "#31a8ff" }} />.PSD</span>
                        <span className="gd-viz__file"><i style={{ background: "#a259ff" }} />.FIG</span>
                        <span className="gd-viz__file"><i style={{ background: "#100563" }} />.SVG</span>
                      </div>
                    )}
                    {i === 5 && (
                      <div className="gd-viz__doc">
                        <span className="gd-viz__doc-cover"><b>Brand</b><small>v1.0</small></span>
                        <span className="gd-viz__doc-pages"><b /><i /><i /><i /></span>
                      </div>
                    )}
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== TOOLS ============================== */}
        <section className="gd-tech" aria-labelledby="gd-tech-h">
          <div className="container">
            <Head center eyebrow="Our toolkit" lead="The tools we design in, and the principles behind every layout.">
              <span id="gd-tech-h">Tools and thinking behind <em>every design.</em></span>
            </Head>
          </div>
          <div className="gd-tech__rows" aria-hidden="true">
            <div className="gd-tech__a gd-tech__row">
              {[...ROW_A, ...ROW_A, ...ROW_A].map((t, i) => (
                <span className="gd-tech__pill" key={`${t.name}-${i}`}>
                  <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                  {t.name}
                </span>
              ))}
            </div>
            <div className="gd-tech__b gd-tech__row">
              {[...ROW_B, ...ROW_B].map((t, i) => (
                <span className="gd-tech__pill gd-tech__pill--text" key={`${t}-${i}`}>
                  <Layers size={18} />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <p className="gd-sr">
            Tools: {ROW_A.map((t) => t.name).join(", ")}. Principles: {ROW_B.join(", ")}.
          </p>
        </section>

        <RelatedServicesSection
          items={RELATED}
          title={
            <>
              Pair it with <em>what comes next</em>
            </>
          }
          lead="A strong look works hardest when it is paired with the right products. See how these services fit alongside it."
        />
      </div>
    </>
  );
}