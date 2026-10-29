import {
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react"

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import "./ProcessSection.css"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/*  `outcome` and `tags` are new — edit the copy to match your real offer.    */
/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    id: "discover",
    title: "Discover",
    description: "Understand your goals, users and current reality.",
    outcome: "A shared understanding of the problem and what success means.",
    tags: ["Goals", "Users", "Audit"],
  },
  {
    id: "strategize",
    title: "Strategize",
    description: "Define priorities, direction and the right approach.",
    outcome: "A clear roadmap, scope and plan everyone agrees on.",
    tags: ["Priorities", "Roadmap", "Scope"],
  },
  {
    id: "design",
    title: "Design",
    description: "Create journeys, systems and visual experiences.",
    outcome: "Approved screens and a design system ready for development.",
    tags: ["Journeys", "UI system", "Prototype"],
  },
  {
    id: "build",
    title: "Build",
    description: "Develop with the appropriate technology stack.",
    outcome: "A working, maintainable product built on the right foundation.",
    tags: ["Frontend", "Backend", "Integrations"],
  },
  {
    id: "test",
    title: "Test",
    description: "Validate function, performance, responsiveness and security.",
    outcome: "A verified, release-ready build you can trust.",
    tags: ["QA", "Performance", "Security"],
  },
  {
    id: "launch",
    title: "Launch",
    description: "Deploy the final product and make it ready for users.",
    outcome: "Your product live, monitored and in your users' hands.",
    tags: ["Deploy", "Monitoring", "Handover"],
  },
  {
    id: "grow",
    title: "Grow",
    description: "Maintain, optimize and improve the solution over time.",
    outcome: "Steady improvement driven by real usage and data.",
    tags: ["Support", "Analytics", "Iteration"],
  },
] as const

const COUNT = STEPS.length

/* Colour used for the check badge / icons that sit on top of the accent. */
const ON_ACCENT = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#100563",
  "#100563",
] as const

/* -------------------------------------------------------------------------- */
/*  Geometry                                                                  */
/* -------------------------------------------------------------------------- */

const WAVE_W = 1200
const WAVE_H = 340
const RING_RADIUS = 46
const DISC_RADIUS = 34
const HALO_RADIUS = 62
const ARC_SWEEP = 98

const nodeX = (i: number) => 110 + i * ((WAVE_W - 220) / (COUNT - 1))
const nodeY = (i: number) => (i % 2 === 0 ? 192 : 118)

/* Desktop scroll budget: how much scrolling each stage "costs" (in % of vh). */
const SCROLL_PER_STEP = 50

const DESKTOP_QUERY = "(min-width: 1100px) and (min-height: 720px)"

function getArcPath(radius: number, startAngle: number, sweepAngle: number) {
  const point = (angle: number) => {
    const rad = (angle * Math.PI) / 180
    return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) }
  }
  const start = point(startAngle)
  const end = point(startAngle + sweepAngle)
  const largeArc = sweepAngle > 180 ? 1 : 0
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

/* Three ribbons per ring (light / base / dark), separated by even gaps. */
const ARC_PATHS = [0, 1, 2].map((k) =>
  getArcPath(RING_RADIUS, -90 + k * 120 + (120 - ARC_SWEEP) / 2, ARC_SWEEP),
)

function segmentPath(i: number) {
  const x1 = nodeX(i)
  const y1 = nodeY(i)
  const x2 = nodeX(i + 1)
  const y2 = nodeY(i + 1)
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

function stepStyle(i: number): CSSProperties {
  const n = i + 1
  return {
    "--step": `var(--accent-${n})`,
    "--step-a": `var(--accent-${n}-a)`,
    "--step-b": `var(--accent-${n}-b)`,
    "--step-c": `var(--accent-${n}-c)`,
    "--step-on": ON_ACCENT[i],
  } as CSSProperties
}

type RingState = "done" | "active" | "todo"

const pad = (n: number) => String(n).padStart(2, "0")
const clamp = (n: number) => Math.max(0, Math.min(COUNT - 1, n))

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function RingGraphic({
  index,
  state,
  hovered = false,
  uid,
}: {
  index: number
  state: RingState
  hovered?: boolean
  uid: string
}) {
  const gradId = `${uid}-disc`

  return (
    <g
      className="ps-ring"
      data-state={state}
      data-hover={hovered ? "true" : undefined}
      style={stepStyle(index)}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="85%">
          <stop offset="0" style={{ stopColor: "var(--ps-white)" }} />
          <stop offset="1" style={{ stopColor: "var(--ps-surface-deep)" }} />
        </radialGradient>
      </defs>

      <circle className="ps-ring__halo" r={HALO_RADIUS} />

      <g className="ps-ring__spin">
        {ARC_PATHS.map((d, k) => (
          <path
            key={k}
            className={`ps-ribbon ps-ribbon--${"abc"[k]}`}
            d={d}
            pathLength={1}
          />
        ))}
      </g>

      <circle className="ps-ring__disc" r={DISC_RADIUS} fill={`url(#${gradId})`} />
      <text className="ps-ring__step" y={-9}>
        STEP
      </text>
      <text className="ps-ring__num" y={20}>
        {pad(index + 1)}
      </text>

      <g className="ps-ring__badge">
        <circle cx={33} cy={-33} r={10} />
        <path d="M 28.4 -33 L 31.7 -29.6 L 37.8 -36.4" />
      </g>
    </g>
  )
}

function Tags({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="ps-tags">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d={dir === "right" ? "M4 10h11M10.5 5.5 15 10l-4.5 4.5" : "M16 10H5M9.5 5.5 5 10l4.5 4.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const pinRef = useRef<ScrollTrigger | null>(null)
  const dirRef = useRef<1 | -1>(1)
  const firstRun = useRef(true)

  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  const uid = useId().replace(/:/g, "")

  const setActiveIndex = useCallback((next: number) => {
    setActive((prev) => {
      if (prev === next) return prev
      dirRef.current = next > prev ? 1 : -1
      return next
    })
  }, [])

  /* Go to a stage. When the section is pinned we scroll to the matching
     position (the scroll handler then updates the state); otherwise we set
     the state directly. */
  const goTo = useCallback(
    (index: number, focus = false) => {
      const next = clamp(index)
      const pin = pinRef.current

      if (pin) {
        const progress = (next + 0.5) / COUNT
        window.scrollTo({
          top: pin.start + progress * (pin.end - pin.start),
          behavior: "smooth",
        })
      } else {
        setActiveIndex(next)
      }

      if (focus) {
        requestAnimationFrame(() =>
          tabRefs.current[next]?.focus({ preventScroll: true }),
        )
      }
    },
    [setActiveIndex],
  )

  const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: COUNT - 1,
    }
    if (event.key in map) {
      event.preventDefault()
      goTo(map[event.key], true)
    }
  }

  /* ------------------------------ Animation ------------------------------ */

  useGSAP(
    () => {
      const container = containerRef.current
      const stage = stageRef.current
      if (!container || !stage) return

      let mounted = true
      const all = <T extends Element>(selector: string) =>
        gsap.utils.toArray<T>(selector, container)

      const mm = gsap.matchMedia(container)

      mm.add(
        {
          isDesktop: DESKTOP_QUERY,
          reduce: "(prefers-reduced-motion: reduce)",
          /* gsap.matchMedia only runs when at least one query matches, so
             this always-true query guarantees the setup runs on every device. */
          always: "(min-width: 0px)",
        },
        (context) => {
          const { isDesktop, reduce } = context.conditions as {
            isDesktop: boolean
            reduce: boolean
          }

          /* Heading reveal ------------------------------------------------ */
          if (!reduce) {
            gsap.from(all(".ps-intro > *"), {
              autoAlpha: 0,
              y: 26,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: ".ps-intro", start: "top 90%", once: true },
            })
          }

          /* Mobile / tablet: vertical timeline ---------------------------- */
          if (!isDesktop) {
            container.dataset.mode = "timeline"

            const items = all<HTMLElement>(".ps-tl__item")
            const rings = all<SVGElement>(".ps-tl__ring")
            const list = container.querySelector<HTMLElement>(".ps-timeline")
            const spine = container.querySelector<HTMLElement>(".ps-tl__spine")
            const fill = container.querySelector<HTMLElement>(".ps-tl__spine-fill")
            const head = container.querySelector<HTMLElement>(".ps-tl__head")

            const proxy = { p: 0 }
            const apply = () => {
              if (fill) fill.style.clipPath = `inset(0 0 ${(1 - proxy.p) * 100}% 0)`
              if (head) head.style.top = `${proxy.p * 100}%`
            }
            let lastBg = ""

            /* The spine runs from the first ring centre to the last one and
               fills continuously as the reading line (60% of the viewport)
               travels down the page. Rings switch on as the line reaches them. */
            let raf = 0
            const measure = () => {
              raf = 0
              if (!list || !spine || rings.length === 0) return

              const listTop = list.getBoundingClientRect().top
              const centers = rings.map((ring) => {
                const b = ring.getBoundingClientRect()
                return b.top + b.height / 2
              })
              const first = centers[0]
              const total = Math.max(1, centers[centers.length - 1] - first)

              spine.style.top = `${first - listTop}px`
              spine.style.height = `${total}px`

              const stops = centers
                .map((c, i) => `var(--accent-${i + 1}) ${(((c - first) / total) * 100).toFixed(2)}%`)
                .join(", ")
              const bg = `linear-gradient(to bottom, ${stops})`
              if (fill && bg !== lastBg) {
                fill.style.background = bg
                lastBg = bg
              }

              const line = window.innerHeight * 0.6
              const progress = Math.min(1, Math.max(0, (line - first) / total))

              let idx = 0
              centers.forEach((c, i) => {
                if (c <= line) idx = i
              })
              setActiveIndex(idx)

              gsap.to(proxy, {
                p: progress,
                duration: reduce ? 0 : 0.35,
                ease: "power2.out",
                overwrite: true,
                onUpdate: apply,
              })
              if (reduce) {
                proxy.p = progress
                apply()
              }
            }
            let isSectionInView = false
            const sectionObserver = new IntersectionObserver(
              ([entry]) => {
                isSectionInView = entry.isIntersecting
                if (isSectionInView) {
                  schedule()
                }
              },
              { rootMargin: "800px 0px 800px 0px" },
            )
            sectionObserver.observe(container)

            const schedule = () => {
              if (!isSectionInView) return
              if (!raf) raf = requestAnimationFrame(measure)
            }

            window.addEventListener("scroll", schedule, { passive: true, capture: true })
            window.addEventListener("resize", schedule)
            measure()

            if (!reduce) {
              items.forEach((item) => {
                gsap.from(item, {
                  autoAlpha: 0,
                  y: 40,
                  duration: 0.8,
                  ease: "power3.out",
                  scrollTrigger: { trigger: item, start: "top 92%", once: true },
                })
              })
            }

            return () => {
              sectionObserver.disconnect()
              window.removeEventListener("scroll", schedule, true)
              window.removeEventListener("resize", schedule)
              if (raf) cancelAnimationFrame(raf)
              delete container.dataset.mode
            }
          }

          /* Desktop, reduced motion: static layout, click to explore ------ */
          if (reduce) {
            container.dataset.mode = "static"
            return () => {
              delete container.dataset.mode
            }
          }

          /* Desktop: pinned, scroll-driven journey ------------------------ */
          container.dataset.mode = "pinned"

          const pin = ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: `+=${COUNT * SCROLL_PER_STEP}%`,
            pin: true,
            anticipatePin: 0,
            onUpdate: (self) => {
              setActiveIndex(clamp(Math.floor(self.progress * COUNT)))
            },
          })
          pinRef.current = pin

          const nodes = all(".ps-node__pop")
          const ribbons = all(".ps-wave .ps-ribbon")
          const labels = all(".ps-node-btn__label")
          const tracks = all(".ps-seg__track")
          const panel = all(".ps-panel")

          gsap.set(nodes, { scale: 0.3, autoAlpha: 0 })
          gsap.set(ribbons, { strokeDashoffset: 1 })
          gsap.set([...labels, ...tracks], { autoAlpha: 0 })
          gsap.set(panel, { autoAlpha: 0, y: 36 })

          const intro = gsap.timeline({ paused: true })
          intro
            .to(
              nodes,
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.7,
                stagger: 0.09,
                ease: "back.out(1.7)",
              },
              0,
            )
            .to(
              ribbons,
              {
                strokeDashoffset: 0,
                duration: 0.9,
                stagger: 0.03,
                ease: "power2.inOut",
              },
              0.05,
            )
            .to(tracks, { autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.2)
            .to(labels, { autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 0.3)
            .to(panel, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.55)

          let played = false
          const playIntro = () => {
            if (played) return
            played = true
            intro.play()
          }

          const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top 78%",
            once: true,
            onEnter: playIntro,
          })
          if (trigger.progress > 0) playIntro()

          return () => {
            pinRef.current = null
            delete container.dataset.mode
          }
        },
      )

      let refreshTimer: number | null = null
      const refresh = () => {
        if (!mounted) return
        if (refreshTimer) window.clearTimeout(refreshTimer)
        refreshTimer = window.setTimeout(() => {
          if (mounted) ScrollTrigger.refresh()
        }, 80)
      }

      void document.fonts.ready.then(refresh)
      window.addEventListener("load", refresh)
      window.addEventListener("resize", refresh)

      const imgs = document.querySelectorAll("img")
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", refresh, { once: true })
          img.addEventListener("error", refresh, { once: true })
        }
      })

      let ro: ResizeObserver | null = null
      if (typeof ResizeObserver !== "undefined" && container.parentElement) {
        ro = new ResizeObserver(refresh)
        ro.observe(container.parentElement)
      }

      return () => {
        mounted = false
        if (refreshTimer) window.clearTimeout(refreshTimer)
        window.removeEventListener("load", refresh)
        window.removeEventListener("resize", refresh)
        if (ro) ro.disconnect()
        mm.revert()
      }
    },
    { scope: containerRef },
  )

  /* Re-animate the detail panel whenever the active stage changes. */
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      const container = containerRef.current
      if (!container || container.dataset.mode === "timeline") return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      gsap.fromTo(
        gsap.utils.toArray(".ps-swap", container),
        { autoAlpha: 0, x: dirRef.current * 28 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: "transform",
        },
      )
    },
    { dependencies: [active], scope: containerRef, revertOnUpdate: false },
  )

  /* -------------------------------- Render -------------------------------- */

  const current = STEPS[active]
  const next = STEPS[active + 1]
  const stateOf = (i: number): RingState =>
    i < active ? "done" : i === active ? "active" : "todo"

  return (
    <section
      className="process-section"
      ref={containerRef}
      aria-labelledby={`${uid}-heading`}
      data-started={active > 0 ? "true" : "false"}
    >
      <div className="ps-stage" ref={stageRef}>
        <header className="ps-intro">
          <p className="ps-eyebrow">
            <span />
            Our process
          </p>
          <h2 id={`${uid}-heading`}>
            <span>From idea to</span>
            <em>real digital solution.</em>
          </h2>
          <p className="ps-subheading">
            A clear seven-stage journey built around collaboration, quality and
            long-term growth.
          </p>
        </header>

        {/* ------------------------- Desktop experience ------------------------- */}
        <div className="ps-desktop">
          <div className="ps-wave">
            <svg
              className="ps-wave__svg"
              viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                {STEPS.slice(0, -1).map((_, i) => (
                  <linearGradient
                    key={i}
                    id={`${uid}-seg-${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={nodeX(i)}
                    y1={0}
                    x2={nodeX(i + 1)}
                    y2={0}
                  >
                    <stop offset="0" style={{ stopColor: `var(--accent-${i + 1})` }} />
                    <stop offset="1" style={{ stopColor: `var(--accent-${i + 2})` }} />
                  </linearGradient>
                ))}
              </defs>

              {STEPS.slice(0, -1).map((_, i) => (
                <g className="ps-seg" key={i} data-done={i < active ? "true" : "false"}>
                  <path className="ps-seg__track" d={segmentPath(i)} />
                  <path
                    className="ps-seg__fill"
                    d={segmentPath(i)}
                    pathLength={1}
                    stroke={`url(#${uid}-seg-${i})`}
                  />
                </g>
              ))}

              {STEPS.map((step, i) => (
                <g
                  className="ps-node"
                  key={step.id}
                  transform={`translate(${nodeX(i)} ${nodeY(i)})`}
                >
                  <g className="ps-node__pop">
                    <RingGraphic
                      index={i}
                      state={stateOf(i)}
                      hovered={hovered === i}
                      uid={`${uid}-d${i}`}
                    />
                  </g>
                </g>
              ))}
            </svg>

            <div
              className="ps-wave__tabs"
              role="tablist"
              aria-label="Process stages"
              onKeyDown={onTabsKeyDown}
            >
              {STEPS.map((step, i) => (
                <button
                  key={step.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls={`${uid}-panel`}
                  tabIndex={i === active ? 0 : -1}
                  className="ps-node-btn"
                  data-state={stateOf(i)}
                  data-cursor={step.title.toUpperCase()}
                  style={
                    {
                      "--x": (nodeX(i) / WAVE_W) * 100,
                      "--y": (nodeY(i) / WAVE_H) * 100,
                      ...stepStyle(i),
                    } as CSSProperties
                  }
                  onClick={() => goTo(i)}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered((h) => (h === i ? null : h))}
                >
                  <span className="ps-node-btn__label">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="ps-panel"
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${active}`}
            style={stepStyle(active)}
          >
            <div className="ps-panel__num" aria-hidden="true">
              <span className="ps-swap ps-panel__kicker">Stage</span>
              <strong className="ps-swap">{pad(active + 1)}</strong>
              <span className="ps-swap ps-panel__of">of {pad(COUNT)}</span>
            </div>

            <div className="ps-panel__body">
              <h3 className="ps-swap">{current.title}</h3>
              <p className="ps-swap ps-panel__desc">{current.description}</p>
              <div className="ps-swap">
                <Tags tags={current.tags} />
              </div>
            </div>

            <div className="ps-panel__side">
              <div className="ps-swap ps-outcome">
                <span>What you get</span>
                <p>{current.outcome}</p>
              </div>

              <div className="ps-controls">
                <button
                  type="button"
                  className="ps-btn ps-btn--round"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous stage"
                >
                  <Arrow dir="left" />
                </button>
                <button
                  type="button"
                  className="ps-btn ps-btn--next"
                  onClick={() => goTo(active + 1)}
                  disabled={!next}
                >
                  <span>{next ? `Next: ${next.title}` : "Journey complete"}</span>
                  {next && <Arrow dir="right" />}
                </button>
              </div>
            </div>
          </div>

          <p className="ps-hint" aria-hidden="true">
            <span />
            Scroll to travel through the journey, or pick a stage
          </p>
        </div>

        {/* ----------------------- Mobile / tablet experience ----------------------- */}
        <ol
          className="ps-timeline"
          style={{ "--head": `var(--accent-${active + 1})` } as CSSProperties}
        >
          <span className="ps-tl__spine" aria-hidden="true">
            <span className="ps-tl__spine-fill" />
            <span className="ps-tl__head" />
          </span>
          {STEPS.map((step, i) => (
            <li
              className="ps-tl__item"
              key={step.id}
              data-state={stateOf(i)}
              data-done={i < active ? "true" : "false"}
              aria-current={i === active ? "step" : undefined}
              style={stepStyle(i)}
            >
              <svg
                className="ps-tl__ring"
                viewBox="-72 -72 144 144"
                aria-hidden="true"
                focusable="false"
              >
                <RingGraphic index={i} state={stateOf(i)} uid={`${uid}-m${i}`} />
              </svg>

              <div className="ps-tl__card">
                <p className="ps-tl__kicker">
                  Stage {pad(i + 1)} / {pad(COUNT)}
                </p>
                <h3>{step.title}</h3>
                <p className="ps-tl__desc">{step.description}</p>
                <Tags tags={step.tags} />
                <p className="ps-tl__outcome">
                  <span>You get</span>
                  {step.outcome}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}