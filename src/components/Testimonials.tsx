import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Star } from "lucide-react"
import { SectionHeading } from "./animations/Primitives"
import "./Testimonials.css"

/* ---------------------------------------------------------------
   PLACEHOLDER CONTENT
   The names, roles and quotes below are sample copy written to
   design the section. Replace every entry with real, permitted
   client feedback before launch. Add `source: "Google"` only to
   reviews that really come from Google; the G badge shows only then.
---------------------------------------------------------------- */
const STORIES = [
  {
    name: "Anjali Srivastava",
    role: "Founder",
    org: "Retail brand",
    service: "Website development",
    rating: 5,
    quote:
      "Our new website loads fast, looks sharp on mobile, and we now get steady enquiries every single week.",
  },
  {
    name: "Rajesh Mishra",
    role: "Operations Head",
    org: "Manufacturing",
    service: "ERP software",
    rating: 5,
    quote:
      "The ERP brought stock, billing and purchase into one place. Month-end closing no longer needs three spreadsheets.",
  },
  {
    name: "Neha Agarwal",
    role: "Sales Manager",
    org: "Real estate",
    service: "CRM software",
    rating: 5,
    quote:
      "Every lead is tracked with follow-up reminders now. We stopped losing enquiries between calls and WhatsApp.",
  },
  {
    name: "Vivek Tripathi",
    role: "Director",
    org: "Training institute",
    service: "LMS platform",
    rating: 5,
    quote:
      "Students attend, submit work and get certificates online. The LMS saves our staff hours of manual effort every week.",
  },
  {
    name: "Sandeep Kapoor",
    role: "Finance Controller",
    org: "Distribution",
    service: "MIS dashboards",
    rating: 5,
    quote:
      "Reports that took days now arrive on one dashboard. Decisions are faster because everyone trusts the numbers.",
  },
  {
    name: "Pooja Singh",
    role: "Marketing Lead",
    org: "Healthcare",
    service: "Social media",
    rating: 5,
    quote:
      "Consistent posts, clean creatives and clear monthly reports. Our social pages finally look like one brand.",
  },
  {
    name: "Amit Khanna",
    role: "Co-founder",
    org: "Logistics startup",
    service: "Custom software",
    rating: 5,
    quote:
      "They understood our workflow before writing any code, then delivered on time with honest updates throughout.",
  },
] as const

const AVATAR_COLORS = ["#4285f4", "#ea4335", "#f9a825", "#34a853"] as const
const AUTOPLAY_MS = 5500

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[parts.length - 1][0] ?? "")).toUpperCase()
}

function GoogleG() {
  return (
    <svg
      className="testimonial-card__source"
      viewBox="0 0 24 24"
      aria-label="Google review"
      role="img"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

function getPosition(index: number, activeIndex: number) {
  const midpoint = Math.floor(STORIES.length / 2)
  let position = index - activeIndex
  if (position > midpoint) position -= STORIES.length
  if (position < -midpoint) position += STORIES.length
  return position
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hovered, setHovered] = useState(false)

  const sectionRef = useRef<HTMLElement | null>(null)
  const inView = useInView(sectionRef, { amount: 0.4 })
  const prefersReducedMotion = useReducedMotion()

  const touchStartX = useRef<number | null>(null)
  const didSwipe = useRef(false)

  const paused = hovered || !inView || !!prefersReducedMotion

  /* Autoplay pauses while hovered, off-screen, or when reduced motion is requested. */
  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(
      () => setActiveIndex((i) => (i + 1) % STORIES.length),
      AUTOPLAY_MS,
    )
    return () => window.clearTimeout(id)
  }, [activeIndex, paused])

  const showStory = (index: number) => {
    setActiveIndex((index + STORIES.length) % STORIES.length)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return
    didSwipe.current = false
    touchStartX.current = event.clientX
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const distance = event.clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 40) return
    didSwipe.current = true
    showStory(activeIndex + (distance < 0 ? 1 : -1))
  }

  const onCardClick = (index: number) => {
    if (didSwipe.current) {
      didSwipe.current = false
      return
    }
    showStory(index)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") showStory(activeIndex - 1)
    if (event.key === "ArrowRight") showStory(activeIndex + 1)
  }

  return (
    <section
      ref={sectionRef}
      className="testimonials"
      aria-labelledby="testimonials-title"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="testimonials__inner">
        <div className="testimonials__header">
          <SectionHeading
            eyebrow="Small steps. Meaningful shifts."
            title={
              <>
                <span>Different stories.</span>
                <em>A shared way forward.</em>
              </>
            }
            copy="More clarity. More connection. More room to be yourself."
          />
        </div>

        <div
          className="testimonials__stage"
          role="group"
          aria-roledescription="carousel"
          aria-label="Client reviews. Swipe horizontally, use the left and right arrow keys, or select a card."
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
          onPointerCancel={() => {
            touchStartX.current = null
            didSwipe.current = false
          }}
        >
          {STORIES.map((story, index) => {
            const position = getPosition(index, activeIndex)
            const isVisible = Math.abs(position) <= 3
            const source = "source" in story ? story.source : undefined

            return (
              <motion.button
                key={story.name}
                type="button"
                className="testimonial-card"
                data-position={position}
                style={
                  {
                    "--avatar": AVATAR_COLORS[index % AVATAR_COLORS.length],
                  } as CSSProperties
                }
                aria-label={`Show review ${index + 1} of ${STORIES.length}: ${story.name}, ${story.service}`}
                aria-pressed={position === 0}
                aria-hidden={!isVisible}
                tabIndex={isVisible && Math.abs(position) <= 1 ? 0 : -1}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.32 }}
                onClick={() => onCardClick(index)}
              >
                <span className="testimonial-card__head">
                  <span className="testimonial-card__avatar" aria-hidden="true">
                    {initials(story.name)}
                  </span>
                  <span className="testimonial-card__attribution">
                    <strong>{story.name}</strong>
                    <small>
                      {story.role} · {story.org}
                    </small>
                  </span>
                  {source === "Google" && <GoogleG />}
                </span>

                <span className="testimonial-card__rating">
                  <span
                    className="testimonial-card__stars"
                    role="img"
                    aria-label={`${story.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={15}
                        strokeWidth={0}
                        fill="currentColor"
                        aria-hidden="true"
                        className={i < story.rating ? "is-on" : "is-off"}
                      />
                    ))}
                  </span>
                </span>

                <span className="testimonial-card__quote">{story.quote}</span>

                <span className="testimonial-card__footer">
                  <span className="testimonial-card__tag">{story.service}</span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <div
          className={`testimonials__controls${paused ? " is-paused" : ""}`}
          style={{ "--autoplay": `${AUTOPLAY_MS}ms` } as CSSProperties}
        >
          <div className="testimonials__dots">
            {STORIES.map((story, index) => (
              <button
                key={story.name}
                type="button"
                className="testimonials__dot"
                aria-label={`Show review ${index + 1}: ${story.name}`}
                aria-current={index === activeIndex}
                onClick={() => showStory(index)}
              >
                <span className="testimonials__dot-bar">
                  <span className="testimonials__dot-fill" />
                </span>
              </button>
            ))}
          </div>

        </div>

        <p className="testimonials__live" aria-live={paused ? "polite" : "off"}>
          {`Review ${activeIndex + 1} of ${STORIES.length}: ${STORIES[activeIndex].name}`}
        </p>
      </div>
    </section>
  )
}