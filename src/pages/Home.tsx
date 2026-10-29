import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"

import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Cable,
  Code2,
  Database,
  Eye,
  FileText,
  Heart,
  Lightbulb,
  LifeBuoy,
  Megaphone,
  Search,
  Server,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Users,
  Workflow,
} from "lucide-react"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import { Link } from "react-router-dom"

import Seo from "../components/Seo"

import {
  ImageReveal,
  Reveal,
  SectionHeading,
} from "../components/animations/Primitives"

import ProcessSection from "../components/ProcessSection/ProcessSection"

import TrustedBy from "../components/TrustedBy"

import TechStackRibbons from "../components/TechStackRibbons"

import Testimonials from "../components/Testimonials"

import Button from "../components/ui/Button"

import ViewportSection from "../components/ui/ViewportSection"

import { resolveCmsText, useCmsContent } from "../content/CmsContentProvider"

const heroStories = [
  {
    name: "Technology",

    line: "Engineering products and systems that move organizations forward.",
  },

  {
    name: "Digital Growth",

    line: "Connecting strategy, media and analytics to create real impact.",
  },

  {
    name: "Creative",

    line: "Turning complex ideas into useful, memorable brand experiences.",
  },
] as const

const heroServiceDuration = 5200

const growthChannels = [
  {
    label: "Search",

    y: 80,

    icon: Search,

    tone: "lavender",

    description:
      "Help the right people discover your business with a clear, useful search presence.",
  },

  {
    label: "Paid media",

    y: 140,

    icon: Megaphone,

    tone: "gold",

    description:
      "Put focused campaigns in front of relevant audiences across paid channels.",
  },

  {
    label: "Content",

    y: 200,

    icon: FileText,

    tone: "sage",

    description:
      "Build trust with content that answers questions and supports each step of the journey.",
  },

  {
    label: "Lead generation",

    y: 260,

    icon: Users,

    tone: "peach",

    description:
      "Turn interest into meaningful conversations with a considered lead journey.",
  },

  {
    label: "Analytics",

    y: 320,

    icon: BarChart3,

    tone: "lavender",

    description: "Use clear measurement to understand what is working ",
  },
] as const

const growthOutcomes = [
  {
    number: "01",

    count: 1_000_000,

    y: 108,

    title: "Visibility",

    copy: "Be easier to find.",
  },

  {
    number: "02",

    count: 500_000,

    y: 200,

    title: "Engagement",

    copy: "Make every interaction count.",
  },

  {
    number: "03",

    count: 100_000,

    y: 292,

    title: "Action",

    copy: "Create a clear next step.",
  },
] as const

const growthCountFormatter = new Intl.NumberFormat("en", {
  notation: "compact",

  maximumFractionDigits: 0,
})

const commitments = [
  {
    number: "01",

    title: "Quality",

    copy: "Care in the work and the details.",

    note: "Reviewed before it ships",

    tone: "lavender",

    video: "/images/home/quality.mp4",

    icon: ShieldCheck,
  },

  {
    number: "02",

    title: "Transparency",

    copy: "Clear communication throughout the journey.",

    note: "No surprises along the way",

    tone: "gold",

    video: "/images/home/transparency.mp4",

    icon: Eye,
  },

  {
    number: "03",

    title: "Innovation",

    copy: "Better ways to solve meaningful problems.",

    note: "Built for what comes next",

    tone: "sage",

    video: "/images/home/innovation.mp4",

    icon: Lightbulb,
  },

  {
    number: "04",

    title: "Support",

    copy: "A relationship that continues after launch.",

    note: "Here for the long run",

    tone: "peach",

    video: "/images/home/transparency.mp4",

    icon: LifeBuoy,
  },
] as const

export default function Home() {
  const { companyProfile } = useCmsContent()

  return (
    <>
      <Seo
        title={`${companyProfile.brandName} | We Build Digital Futures`}
        description={`Technology, digital growth, creative services, and AI automation from ${companyProfile.name}.`}
      />
      <Hero />
      <TrustedBy />
      <CoreAreas />
      <TechStackRibbons />
      <Technology />
      <DigitalGrowth />
      <PortfolioPreview />
      <ProcessSection />
      <WhySipher />
      <Testimonials />
      <ClosingCta />
    </>
  )
}

function Hero() {
  const { aboutContent, companyProfile, serviceCategories } = useCmsContent()
  const categories = serviceCategories.length > 0
    ? serviceCategories
    : heroStories.map((story) => ({
      title: story.name,
      statement: story.line,
      description: story.line,
      services: [],
    }))
  const [active, setActive] = useState(0)
  const storyCount = categories.length
  const activeIndex = storyCount > 0 ? active % storyCount : 0
  const activeCategory = categories[activeIndex]

  const [paused, setPaused] = useState(false)

  const reduced = useReducedMotion()

  const section = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: section,

    offset: ["start start", "end start"],
  })

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  useEffect(() => {
    if (paused || reduced || storyCount === 0) return

    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % storyCount),

      heroServiceDuration,
    )

    return () => {
      window.clearInterval(timer)
    }
  }, [active, paused, reduced, storyCount])

  return (
    <section
      className="hero"
      ref={section}
      data-paused={paused}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <motion.div
        className="hero__photo-wrap"
        style={{ scale: reduced ? 1 : backgroundScale }}
        aria-hidden="true"
      >
        <video
          autoPlay={!reduced}
          loop={!reduced}
          muted
          playsInline
          preload="metadata"
          poster={aboutContent.homeArchitectureImage || undefined}
          tabIndex={-1}
        >
          <source src="/videos/home/herobg_video.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__spotlight" aria-hidden="true" />
      <div className="hero__glows" aria-hidden="true">
        {categories.map((category, index) => (
          <span
            className={`hero__glow hero__glow--${index}${
              index === activeIndex ? " is-active" : ""
            }`}
            key={category.title}
          />
        ))}
      </div>
      {!reduced && (
        <>
          <motion.div
            className="hero__bar hero__bar--top"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
          <motion.div
            className="hero__bar hero__bar--bottom"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="hero__content">
        <div className="hero__parallax">
          <div className="hero__title-stage">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                className="hero__service-copy"
                key={activeCategory.title}
                initial={
                  reduced
                    ? false
                    : { opacity: 0, scale: 0.92, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduced
                    ? undefined
                    : { opacity: 0, scale: 1.06, filter: "blur(8px)" }
                }
                transition={{
                  duration: reduced ? 0 : 0.45,

                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="eyebrow eyebrow--light">
                  <span />
                  {resolveCmsText(aboutContent.homeHeroEyebrow, `${companyProfile.brandName} • ${activeCategory.title}`, companyProfile)}
                </p>
                <h1 className="hero__title" aria-live="off">
                  <span className="sr-only">{activeCategory.title}</span>
                  <span aria-hidden="true">{activeCategory.title}</span>
                </h1>
                <span className="hero__title-accent" aria-hidden="true" />
                <p className="hero__service-description">
                  {activeCategory.statement || activeCategory.description || heroStories[activeIndex]?.line}
                </p>
                <div className="hero__offering-stage">
                  <div
                    className="hero__offering-grid"
                    role="list"
                    aria-label={`${activeCategory.title} specialties`}
                  >
                    {activeCategory.services

                      .slice(0, 3)

                      .map((service, index) => (
                        <motion.article
                          className="hero__offering-card"
                          key={service.slug}
                          role="listitem"
                          initial={reduced ? false : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: reduced ? 0 : 0.35,

                            delay: reduced ? 0 : 0.12 + index * 0.07,
                          }}
                        >
                          <span
                            className="hero__offering-mark"
                            aria-hidden="true"
                          >
                            0{index + 1}
                          </span>
                          <span className="hero__offering-copy">
                            <span className="hero__offering-title">
                              {service.title}
                            </span>
                            <span className="hero__offering-detail">
                              {service.description}
                            </span>
                          </span>
                        </motion.article>
                      ))}
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="hero__cta"
                  data-cursor="START PROJECT"
                >
                  <span className="hero__cta-label">{resolveCmsText(aboutContent.homeHeroButton, "Start Your Project", companyProfile)}</span>
                  <span className="hero__cta-icon">
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="hero__footer">
        <div className="hero__tabs" role="group" aria-label="Choose a service">
          {categories.map((category, index) => (
            <button
              className={`hero__tab${index === activeIndex ? " is-active" : ""}`}
              type="button"
              key={category.title}
              onClick={() => setActive(index)}
              aria-pressed={index === activeIndex}
              aria-label={`Show ${category.title}`}
            >
              <span className="hero__tab-track" aria-hidden="true">
                {index === activeIndex && (
                  <span
                    className={`hero__tab-fill${reduced ? " is-static" : ""}`}
                    key={activeIndex}
                    style={{ animationDuration: `${heroServiceDuration}ms` }}
                  />
                )}
              </span>
              <span className="hero__tab-number">0{index + 1}</span>
              <span className="hero__tab-label">{category.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoreAreas() {
  const { aboutContent, companyProfile, serviceCategories } = useCmsContent()
  const [active, setActive] = useState(0)

  const [isHovered, setIsHovered] = useState(false)
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.25 })

  const isPaused = !isInView || isHovered || isKeyboardFocused

  const reduced = useReducedMotion()

  const activeIndex = serviceCategories.length > 0 ? active % serviceCategories.length : 0
  const activeCategory = serviceCategories[activeIndex]

  useEffect(() => {
    // Only auto-expand / collapse cycle when user is actively in this section
    if (isPaused || reduced || serviceCategories.length === 0) return

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % serviceCategories.length)
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [active, isPaused, reduced, serviceCategories.length])

  if (!activeCategory) return null

  const ActiveIcon = activeCategory.icon

  return (
    <ViewportSection ref={sectionRef} className="core">
      <div className="container">
        <SectionHeading
          eyebrow={resolveCmsText(aboutContent.homeServicesEyebrow, "What we do", companyProfile)}
          title={
            <>
              <span>{resolveCmsText(aboutContent.homeServicesTitle, "Three disciplines.", companyProfile)}</span>
              <em>{resolveCmsText(aboutContent.homeServicesTitleAccent, "One connected future.", companyProfile)}</em>
            </>
          }
          copy={resolveCmsText(aboutContent.homeServicesDescription, "We bring engineering, design and digital growth together to help organizations establish, improve and scale their digital presence.", companyProfile)}
        />
        <div
          className="core__layout"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerUp={() => setIsKeyboardFocused(false)}
          onFocusCapture={(event) => {
            setIsKeyboardFocused(
              event.target instanceof HTMLElement &&
                event.target.matches(":focus-visible"),
            )
          }}
          onBlurCapture={(event) => {
            const nextTarget = event.relatedTarget

            setIsKeyboardFocused(
              nextTarget instanceof HTMLElement &&
                event.currentTarget.contains(nextTarget) &&
                nextTarget.matches(":focus-visible"),
            )
          }}
        >
          <Reveal className="core__list" direction="left">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon

              return (
                <article
                  className={activeIndex === index ? "is-active" : ""}
                  onMouseEnter={() => setActive(index)}
                  key={category.id}
                >
                  <button
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    aria-expanded={activeIndex === index}
                    aria-controls={`core-panel-${category.id}`}
                  >
                    <Icon size={22} />
                    <h3>{category.title}</h3>
                    <ArrowUpRight />
                  </button>
                  <motion.div
                    id={`core-panel-${category.id}`}
                    aria-hidden={activeIndex !== index}
                    inert={activeIndex !== index}
                    animate={{
                      height: activeIndex === index ? "auto" : 0,

                      opacity: activeIndex === index ? 1 : 0,
                    }}
                    transition={{
                      duration: reduced ? 0 : 0.38,

                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <p>{category.description}</p>
                    <div>
                      {category.services
                        .filter(
                          (service) =>
                            category.id !== "technology" ||
                            !["saas", "api-integration", "ai-automation"].includes(
                              service.slug,
                            ),
                        )
                        .map((service) => (
                        <Link
                          key={service.slug}
                          to={`/services/${service.slug}`}
                        >
                          {service.title}
                        </Link>
                        ))}
                    </div>
                  </motion.div>
                </article>
              )
            })}
          </Reveal>
          <Reveal className="core__visual" direction="right">
            <AnimatePresence initial={false}>
              {activeCategory.imagePath && (
                <motion.img
                  key={activeCategory.id}
                  className="core__visual-image"
                  src={activeCategory.imagePath}
                  alt=""
                  aria-hidden="true"
                  initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )}
            </AnimatePresence>
            <motion.div
              key={activeIndex}
              initial={
                reduced
                  ? false
                  : { opacity: 0, x: 35, clipPath: "inset(0 0 0 30%)" }
              }
              animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: reduced ? 0 : 0.45 }}
            >
              <span className="core__visual-kicker">
                {companyProfile.brandName} / {activeCategory.title}
              </span>
              <h3>{activeCategory.statement}</h3>
              <div className={`core-graphic core-graphic--${activeIndex}`}>
                <ActiveIcon aria-hidden="true" strokeWidth={1} />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </ViewportSection>
  )
}

const technologyCapabilities = [
  { label: "Websites", icon: Code2, tone: "lavender", side: "left" },

  { label: "Custom Software", icon: Database, tone: "gold", side: "left" },

  { label: "SaaS", icon: Workflow, tone: "sage", side: "left" },

  { label: "Business Systems", icon: Server, tone: "peach", side: "left" },

  { label: "E-Commerce", icon: ShoppingCart, tone: "lavender", side: "right" },

  { label: "Mobile Apps", icon: Smartphone, tone: "gold", side: "right" },

  { label: "API Integration", icon: Cable, tone: "sage", side: "right" },

  { label: "AI & Automation", icon: Bot, tone: "peach", side: "right" },
] as const

function TechnologyCapabilityList({
  side,

  prefersReducedMotion,
}: {
  side: "left" | "right"

  prefersReducedMotion: boolean | null
}) {
  return (
    <ul
      className={`technology__capabilities technology__capabilities--${side}`}
    >
      {technologyCapabilities

        .filter((capability) => capability.side === side)

        .map(({ label, icon: Icon, tone }, index) => (
          <motion.li
            className={`technology__capability technology__capability--${tone}`}
            key={label}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: side === "left" ? -14 : 14, y: 8 }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            whileHover={
              prefersReducedMotion ? undefined : { y: -4, scale: 1.025 }
            }
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.45,

              delay: prefersReducedMotion
                ? 0
                : index * 0.1 + (side === "right" ? 0.12 : 0),

              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="technology__capability-icon" aria-hidden="true">
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <span>{label}</span>
          </motion.li>
        ))}
    </ul>
  )
}

function Technology() {
  const { companyProfile } = useCmsContent()

  const prefersReducedMotion = useReducedMotion()

  return (
    <ViewportSection className="technology" variant="visual">
      <div className="container">
        <SectionHeading
          eyebrow="Technology"
          title={
            <>
              <span>Engineering ideas</span>
              <em>into reality.</em>
            </>
          }
          copy="We design and develop digital products that solve real business problems—from high-performance websites to complex business platforms."
        />
        <div className="technology__showcase">
          <TechnologyCapabilityList
            side="left"
            prefersReducedMotion={prefersReducedMotion}
          />
          <motion.figure
            className="technology__portrait"
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.97 }
            }
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.65,

              delay: prefersReducedMotion ? 0 : 0.08,

              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <img
              src="/images/home/technology.webp"
              alt={`${companyProfile.brandName} technology services`}
              className="technology__portrait-image"
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
          <TechnologyCapabilityList
            side="right"
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
        <motion.div
          className="technology__foot"
          initial={
            prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }
          }
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.55,

            delay: prefersReducedMotion ? 0 : 0.12,

            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="technology__foot-copy">
            <span className="technology__foot-mark" aria-hidden="true">
              <Sparkles size={20} strokeWidth={1.8} />
            </span>
            <div>
              <span className="technology__foot-kicker">
                Built for your next move
              </span>
              <p>
                Built around your goals, users and operations—not around a
                template.
              </p>
            </div>
          </div>
          <Button
            to="/services"
            variant="ghost"
            className="technology__cta-link"
          >
            Explore technology services
          </Button>
        </motion.div>
      </div>
    </ViewportSection>
  )
}

function DigitalGrowth() {
  const { companyProfile } = useCmsContent()
  const [activeChannel, setActiveChannel] = useState(0)

  const [liked, setLiked] = useState(false)

  const [loved, setLoved] = useState(false)

  const [shareMessage, setShareMessage] = useState("")

  const [growthCounts, setGrowthCounts] = useState([0, 0, 0])

  const growthOutcomesRef = useRef<HTMLUListElement>(null)

  const prefersReducedMotion = useReducedMotion()

  const active = growthChannels[activeChannel]

  const ActiveIcon = active.icon

  const shareGrowth = async () => {
    const shareData = {
      title: "Connected digital growth",

      text: "Search, paid media, content, lead generation and analytics working together.",

      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)

        setShareMessage("Shared")

        return
      }

      await navigator.clipboard.writeText(shareData.url)

      setShareMessage("Link copied")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return

      setShareMessage("Unable to share right now")
    }
  }

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = window.setInterval(() => {
      setActiveChannel((current) => (current + 1) % growthChannels.length)
    }, 1500)

    return () => window.clearInterval(interval)
  }, [prefersReducedMotion])

  useEffect(() => {
    const outcomesElement = growthOutcomesRef.current

    if (!outcomesElement) return

    const targets = growthOutcomes.map((outcome) => outcome.count)

    const duration = 12000

    let animationFrame = 0

    let startTime: number | null = null

    const resetCounts = () => {
      window.cancelAnimationFrame(animationFrame)

      startTime = null

      setGrowthCounts([0, 0, 0])
    }

    const animateCounts = (timestamp: number) => {
      startTime ??= timestamp

      const progress = Math.min((timestamp - startTime) / duration, 1)

      const easedProgress = 1 - (1 - progress) ** 3

      setGrowthCounts(
        targets.map((target) => Math.floor(target * easedProgress)),
      )

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animateCounts)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          resetCounts()

          return
        }

        window.cancelAnimationFrame(animationFrame)

        startTime = null

        if (prefersReducedMotion) {
          setGrowthCounts(targets)
        } else {
          animationFrame = window.requestAnimationFrame(animateCounts)
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(outcomesElement)

    return () => {
      observer.disconnect()

      window.cancelAnimationFrame(animationFrame)
    }
  }, [prefersReducedMotion])

  return (
    <ViewportSection className="growth">
      <div className="container">
        <div className="growth__intro">
          <SectionHeading
            eyebrow="Digital growth"
            title={
              <>
                <span>Strategies that create</span>
                <em>real impact.</em>
              </>
            }
            copy="Search, paid media, content, lead generation and analytics become more useful when they work as one connected system."
          />
        </div>
        <div className="growth__board">
          <div className="growth__map">
            <svg
              className="growth__svg"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {growthChannels.map((channel, index) => {
                const y = channel.y

                return (
                  <path
                    key={channel.label}
                    className={`growth__path${
                      index === activeChannel ? " is-active" : ""
                    }`}
                    d={`M 220 ${y} C 320 ${y}, 350 200, 428 200`}
                  />
                )
              })}
              {growthOutcomes.map((outcome, index) => {
                const y = outcome.y

                return (
                  <path
                    key={outcome.number}
                    className={`growth__path growth__path--out${
                      index === 1 ? " is-active" : ""
                    }`}
                    d={`M 572 200 C 650 200, 680 ${y}, 780 ${y}`}
                  />
                )
              })}
              <circle className="growth__dot" cx="500" cy="200" r="8" />
            </svg>

            <ul className="growth__channels" aria-label="Growth channels">
              {growthChannels.map((channel, index) => {
                const Icon = channel.icon

                return (
                  <li
                    className="growth__channel-item"
                    key={channel.label}
                    style={
                      {
                        "--y": `${(channel.y / 400) * 100}%`,
                      } as CSSProperties & { "--y": string }
                    }
                  >
                    <button
                      className={`growth__channel growth__channel--${channel.tone}${
                        index === activeChannel ? " is-active" : ""
                      }`}
                      type="button"
                      aria-pressed={index === activeChannel}
                      onClick={() => setActiveChannel(index)}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{channel.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div
              className="growth__hub"
              role="img"
              aria-label="Connected growth system"
            >
              <span className="growth__hub-social-orbit" aria-hidden="true">
                <span className="growth__social-icon growth__social-icon--linkedin">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.4 18H5.7v-8h2.7v8ZM7 9a1.55 1.55 0 1 1 0-3.1A1.55 1.55 0 0 1 7 9Zm11.3 9h-2.7v-4.3c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V18H10v-8h2.6v1.1h.04a2.85 2.85 0 0 1 2.56-1.4c2.74 0 3.1 1.8 3.1 4.1V18Z" />
                  </svg>
                </span>
                <span className="growth__social-icon growth__social-icon--instagram">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <defs>
                      <linearGradient
                        id="growth-instagram-gradient"
                        x1="3"
                        y1="21"
                        x2="21"
                        y2="3"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#feda75" />
                        <stop offset=".5" stopColor="#d62976" />
                        <stop offset="1" stopColor="#4f5bd5" />
                      </linearGradient>
                    </defs>
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      className="growth__social-dot"
                      cx="17.7"
                      cy="6.6"
                      r="1"
                    />
                  </svg>
                </span>
                <span className="growth__social-icon growth__social-icon--facebook">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.5 21v-8.2h2.8l.42-3.2H13.5V7.55c0-.93.26-1.56 1.6-1.56h1.71V3.12A22.8 22.8 0 0 0 14.32 3c-2.47 0-4.16 1.5-4.16 4.27V9.6H7.37v3.2h2.79V21h3.34Z" />
                  </svg>
                </span>
                <span className="growth__social-icon growth__social-icon--youtube">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21.2 7.2a2.6 2.6 0 0 0-1.8-1.8C17.8 5 12 5 12 5s-5.8 0-7.4.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2.4 12c0 1.6.1 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C6.2 19 12 19 12 19s5.8 0 7.4-.4a2.6 2.6 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
                  </svg>
                </span>
                <span className="growth__social-icon growth__social-icon--x">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.8 5.7 22H2.5l7.3-8.4L1.8 2h6.5l4.4 6.6L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
                  </svg>
                </span>
                <span className="growth__social-icon growth__social-icon--pinterest">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-3.64 19.31c-.02-.78 0-1.72.19-2.57l1.37-5.8s-.34-.68-.34-1.68c0-1.58.92-2.76 2.07-2.76.98 0 1.45.74 1.45 1.62 0 .99-.63 2.47-.96 3.85-.28 1.15.58 2.09 1.72 2.09 2.06 0 3.65-2.17 3.65-5.3 0-2.77-1.99-4.7-4.82-4.7-3.28 0-5.2 2.46-5.2 5 0 .99.38 2.05.86 2.63a.35.35 0 0 1 .08.33l-.32 1.3c-.05.21-.17.26-.39.16-1.45-.68-2.35-2.8-2.35-4.5 0-3.66 2.66-7.02 7.68-7.02 4.03 0 7.16 2.87 7.16 6.7 0 4-2.52 7.23-6.02 7.23-1.18 0-2.3-.62-2.68-1.35l-.73 2.78c-.26 1.02-.98 2.3-1.46 3.08A10 10 0 1 0 12 2Z" />
                  </svg>
                </span>
              </span>
              <span
                className="growth__hub-orbit growth__hub-orbit--yellow"
                aria-hidden="true"
              />
              <span
                className="growth__hub-orbit growth__hub-orbit--navy"
                aria-hidden="true"
              />
              <span className="growth__hub-ring" aria-hidden="true" />
              <div className="growth__hub-core">
                <div className="growth__hub-inner">
                  <span className="growth__hub-logo">
                    {companyProfile.logoUrl && (
                      <img
                        src={companyProfile.logoUrl}
                        alt=""
                        onError={(e) => {
                          const fallback = "/images/logo/sw_logo.png";
                          if (e.currentTarget.src !== window.location.origin + fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <ul
              className="growth__outcomes"
              aria-label="Growth outcomes"
              ref={growthOutcomesRef}
            >
              {growthOutcomes.map((outcome, index) => (
                <li
                  className="growth__outcome"
                  key={outcome.number}
                  style={
                    {
                      "--y": `${(outcome.y / 400) * 100}%`,
                    } as CSSProperties & { "--y": string }
                  }
                >
                  <div className="growth__outcome-heading">
                    <strong
                      className="growth__outcome-number"
                      aria-label={`${growthCountFormatter.format(outcome.count)} ${outcome.title}`}
                      aria-live="off"
                    >
                      {growthCounts[index] === 0
                        ? "0000"
                        : growthCountFormatter.format(growthCounts[index])}
                    </strong>
                    {index === 0 && (
                      <button
                        className={`growth__action growth__action--like${
                          liked ? " is-active" : ""
                        }`}
                        type="button"
                        aria-label={
                          liked ? "Unlike visibility" : "Like visibility"
                        }
                        aria-pressed={liked}
                        onClick={() => setLiked((current) => !current)}
                      >
                        <ThumbsUp size={18} aria-hidden="true" />
                      </button>
                    )}
                    {index === 1 && (
                      <button
                        className={`growth__action growth__action--love${
                          loved ? " is-active" : ""
                        }`}
                        type="button"
                        aria-label={
                          loved
                            ? "Remove love from engagement"
                            : "Love engagement"
                        }
                        aria-pressed={loved}
                        onClick={() => setLoved((current) => !current)}
                      >
                        <Heart size={18} aria-hidden="true" />
                      </button>
                    )}
                    {index === 2 && (
                      <button
                        className="growth__action growth__action--share"
                        type="button"
                        aria-label="Share growth action"
                        onClick={shareGrowth}
                      >
                        <Share2 size={18} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <div className="growth__outcome-line">
                    <h4>{outcome.title}</h4>
                    <span aria-hidden="true">:</span>
                    <p>{outcome.copy}</p>
                  </div>
                  {index === 2 && shareMessage && (
                    <span className="growth__share-status" role="status">
                      {shareMessage}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="growth__callout" aria-live="polite">
            <div className="growth__callout-main">
              <span className="growth__callout-icon">
                <ActiveIcon size={28} aria-hidden="true" />
              </span>
              <div className="growth__callout-copy">
                <h3 className="growth__callout-title">
                  {active.label} <em>in the system</em>
                </h3>
                <p className="growth__callout-description">
                  {active.description} One connected approach. Clearer next
                  steps.
                </p>
              </div>
            </div>
            <Link
              className="growth__link"
              to="/services/digital-marketing"
              data-cursor="OPEN"
            >
              <span>Explore digital growth</span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </ViewportSection>
  )
}

function PortfolioPreview() {
  const { aboutContent } = useCmsContent()

  return (
    <ViewportSection className="portfolio-preview" variant="visual">
      <div className="container portfolio-preview__layout">
        <Reveal className="portfolio-preview__copy" direction="left">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                <span>The work should speak.</span>
                <em>Case studies are coming.</em>
              </>
            }
            copy="We are preparing a considered portfolio presentation. Until then, tell us what you want to build and we will start with the right questions."
          />
          <div className="portfolio-preview__footnote">
            <span aria-hidden="true" />
            <p>Every great case study starts with a conversation.</p>
          </div>
          <Button
            to="/portfolio"
            variant="primary"
            className="portfolio-preview__cta"
          >
            Visit portfolio
          </Button>
        </Reveal>
        <Reveal
          className="portfolio-preview__stage"
          direction="right"
          delay={0.12}
        >
          <div className="portfolio-preview__orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <figure className="portfolio-preview__shot portfolio-preview__shot--main">
            <img
              src={aboutContent.homeCreativeImage || undefined}
              alt="Creative design in progress"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>03 / Creative</span>
              <strong>Make it meaningful.</strong>
            </figcaption>
          </figure>
          <figure className="portfolio-preview__shot portfolio-preview__shot--growth">
            <img
              src={aboutContent.homeGrowthImage || undefined}
              alt="Digital growth analytics in progress"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>02 / Growth</span>
              <strong>Make it matter.</strong>
            </figcaption>
          </figure>
          <figure className="portfolio-preview__shot portfolio-preview__shot--tech">
            <img
              src={aboutContent.homeTechnologyImage || undefined}
              alt="Technology being built"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>01 / Technology</span>
              <strong>Make it work.</strong>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </ViewportSection>
  )
}

function WhySipher() {
  const { aboutContent, companyProfile } = useCmsContent()
  const prefersReducedMotion = useReducedMotion()

  return (
    <ViewportSection className="why">
      <div className="container why__layout">
        <SectionHeading
          eyebrow={resolveCmsText(aboutContent.homeCommitmentEyebrow, "Our commitment", companyProfile)}
          title={
            <>
              <span>{resolveCmsText(aboutContent.homeCommitmentTitle, "We don’t just", companyProfile)}</span>
              <em>{resolveCmsText(aboutContent.homeCommitmentTitleAccent, "deliver a project.", companyProfile)}</em>
            </>
          }
          copy={resolveCmsText(aboutContent.homeCommitmentDescription, "We build something you can grow with.", companyProfile)}
        />
        <div className="why__values">
          {commitments.map((commitment, index) => {
            const Icon = commitment.icon

            return (
              <Reveal
                className={`why__card why__card--${commitment.tone}`}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 0.07}
                key={commitment.number}
              >
                <article
                  className="why__card-surface"
                  data-cursor={commitment.title.toUpperCase()}
                >
                  <video
                    className="why__card-video"
                    src={commitment.video}
                    autoPlay={!prefersReducedMotion}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                  />
                  <span className="why__card-number" aria-hidden="true">
                    {commitment.number}
                  </span>
                  <span className="why__card-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <h3>{commitment.title}</h3>
                  <p>{commitment.copy}</p>
                  <span className="why__card-note">{commitment.note}</span>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </ViewportSection>
  )
}

function ClosingCta() {
  const { aboutContent, companyProfile } = useCmsContent()
  const prefersReducedMotion = useReducedMotion()
  const ctaText = resolveCmsText(aboutContent.homeCtaTitle, "Let’s build what’s next.", companyProfile)
  const ctaWords = ctaText.split(/\s+/)
  const ctaLead = ctaWords.slice(0, -2).join(" ")
  const nextText = ctaWords.slice(-2).join(" ")

  return (
    <ViewportSection className="closing-cta" variant="closing">
      <div className="container">
        <motion.p
          className="closing-cta__tagline"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          {resolveCmsText(aboutContent.homeCtaEyebrow, "Think. Build. Grow.", companyProfile)}
        </motion.p>
        <h2>
          <motion.span
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 18, filter: "blur(5px)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.65,
              delay: prefersReducedMotion ? 0 : 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {ctaLead}
          </motion.span>
          <motion.em
            aria-label={nextText}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: prefersReducedMotion ? 0 : 0.35,
                  staggerChildren: prefersReducedMotion ? 0 : 0.055,
                },
              },
            }}
          >
            {Array.from(nextText).map((character, index) => (
              <motion.span
                key={`${character}-${index}`}
                aria-hidden="true"
                className="closing-cta__character"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: "0.3em",
                    filter: "blur(5px)",
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: prefersReducedMotion ? 0 : 0.28,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                {character}
              </motion.span>
            ))}
          </motion.em>
        </h2>
        <Button to="/contact">{resolveCmsText(aboutContent.homeCtaButton, "Start the conversation", companyProfile)}</Button>
      </div>
    </ViewportSection>
  )
}
