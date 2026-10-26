import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  Code2,
  Lightbulb,
  PenTool,
  Rocket,
  Target,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import TechStackRibbons from "../components/TechStackRibbons";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/services.css";

const featureCategories = {
  "digital-growth": {
    title: <>More Visibility.<br />More Opportunities.</>,
    description: "Data-driven strategies to increase your reach, engage the right audience and convert interest into growth.",
  },
  creative: {
    title: <>Ideas. Design.<br />Real Impact.</>,
    description: "Brand identity, UI/UX and visual design that turn complex ideas into meaningful experiences.",
  },
} as const;
const processIcons = [
  Lightbulb,
  Target,
  PenTool,
  Code2,
  CircleCheck,
  Rocket,
  ChartNoAxesColumnIncreasing,
] as const;

export default function Services() {
  const { aboutContent, companyProfile, processSteps, serviceCategories } = useCmsContent();
  const prefersReducedMotion = useReducedMotion();

  const goTo = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  // Cursor-follow spotlight on cards
  const spotlight = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <>
      <Seo
        title="Services | Technology, Digital Growth & Creative"
        description={`Explore ${companyProfile.brandName} services across ${serviceCategories.map(({ title }) => title).join(", ")}.`}
      />

      {/* HERO */}
      <section
        className="page-hero svc-hero"
        style={{
          "--svc-hero-image": aboutContent.servicesHeroImage
            ? `url("${aboutContent.servicesHeroImage}")`
            : "none",
        } as CSSProperties}
      >
        <div className="container svc-hero__content">
          <p className="eyebrow"><span />Our services</p>
          <h1>
            Digital Solutions
            <br />
            <em>for a Better Tomorrow</em>
          </h1>
          <p className="svc-hero__description">
            We craft technology, marketing and creative solutions that help businesses grow, connect and make a
            lasting impact in the digital world.
          </p>
          <a
            className="button button--primary svc-hero__button"
            href="#technology"
            data-cursor="EXPLORE"
            onClick={(event) => {
              event.preventDefault();
              goTo("technology");
            }}
          >
            <span>Explore Our Services</span>
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <TechStackRibbons />

      {/* SERVICE CATEGORIES */}
      <section className="svc-offers" aria-labelledby="svc-offers-title">
        <div className="container svc-offers__layout">
          <div className="svc-offers__intro">
            <p className="eyebrow"><span />What we offer</p>
            <h2 id="svc-offers-title">Service<br />Categories</h2>
            <p>From idea to impact — explore our core services designed to build, grow and elevate your brand.</p>
          </div>
          <div className="svc-offers__cards">
            {serviceCategories.map((category) => {
              const Icon = category.icon;
              const description = {
                technology: "Web, mobile, software and custom solutions.",
                "digital-growth": "SEO, performance marketing and analytics.",
                creative: "Branding, design and visual storytelling.",
              }[category.id];
              return (
                <a
                  className="svc-offer-card"
                  href={`#${category.id}`}
                  key={category.id}
                  style={{ "--offer-image": category.imagePath ? `url("${category.imagePath}")` : "none" } as CSSProperties}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(category.id);
                  }}
                >
                  <span className="svc-offer-card__icon"><Icon aria-hidden="true" /></span>
                  <h3>{category.title}</h3>
                  <p>{description}</p>
                  <span className="svc-offer-card__arrow" aria-hidden="true"><ArrowRight /></span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="svc-index">
        <div className="container">
          {serviceCategories.map((category) => {
            if (category.id === "technology") {
              return (
                <section className="svc-technology svc-technology--technology" id={category.id} key={category.id} aria-labelledby="svc-technology-title">
                  <div className="svc-technology__intro">
                    <p className="eyebrow"><span />Technology</p>
                    <h2 id="svc-technology-title">Build Smart.<br />Scale Faster.</h2>
                    <p>
                      Robust web and mobile solutions, custom software, and seamless integrations to power your
                      business forward.
                    </p>
                    <a
                      className="svc-technology__more"
                      href="#technology-service-list"
                      data-cursor="EXPLORE"
                      onClick={(event) => {
                        event.preventDefault();
                        goTo("technology-service-list");
                      }}
                    >
                      <span>Explore All Services</span>
                      <span className="svc-technology__more-icon" aria-hidden="true"><ArrowRight /></span>
                    </a>
                  </div>

                  <div className="svc-technology__image" aria-hidden="true">
                    {category.imagePath && <img src={category.imagePath} alt="" loading="lazy" />}
                    <span className="svc-technology__image-mark" />
                  </div>

                  <nav
                    className="svc-technology__list"
                    id="technology-service-list"
                    aria-label="All technology services"
                  >
                    {category.services.map((service) => {
                      const ServiceIcon = service.icon;
                      return (
                        <Link to={`/services/${service.slug}`} key={service.slug} data-cursor="OPEN">
                          <span className="svc-technology__service-icon"><ServiceIcon aria-hidden="true" /></span>
                          <span>{service.title}</span>
                          <ArrowRight className="svc-technology__service-arrow" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </nav>
                </section>
              );
            }

            const featureCopy = featureCategories[category.id as keyof typeof featureCategories] ?? {
              title: category.title,
              description: category.description,
            };
            const feature = { ...featureCopy, image: category.imagePath };
            const serviceListId = `${category.id}-service-list`;
            return (
              <section
                className={`svc-technology svc-technology--${category.id}`}
                id={category.id}
                key={category.id}
                aria-labelledby={`${category.id}-title`}
              >
                <div className="svc-technology__intro">
                  <p className="eyebrow"><span />{category.title}</p>
                  <h2 id={`${category.id}-title`}>{feature.title}</h2>
                  <p>{feature.description}</p>
                  <a
                    className="svc-technology__more"
                    href={`#${serviceListId}`}
                    data-cursor="EXPLORE"
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(serviceListId);
                    }}
                  >
                    <span>Explore All Services</span>
                    <span className="svc-technology__more-icon" aria-hidden="true"><ArrowRight /></span>
                  </a>
                </div>

                <div className="svc-technology__image" aria-hidden="true">
                  {feature.image && <img src={feature.image} alt="" loading="lazy" />}
                  <span className="svc-technology__image-mark" />
                </div>

                <nav
                  className="svc-technology__list"
                  id={serviceListId}
                  aria-label={`${category.title} services`}
                >
                  {category.services.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Link to={`/services/${service.slug}`} key={service.slug} data-cursor="OPEN">
                        <span className="svc-technology__service-icon"><ServiceIcon aria-hidden="true" /></span>
                        <span>{service.title}</span>
                        <ArrowRight className="svc-technology__service-arrow" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </nav>
              </section>
            );
          })}
        </div>
      </section>

      {/* PROCESS */}
      <section className="svc-process">
        <div className="container">
          <div className="svc-process__panel">
            <header className="svc-process__head">
              <p className="eyebrow eyebrow--light"><span />Our process</p>
              <h2>A Clear Process.<br />Better Results.</h2>
              <p>Seven thoughtful steps turn your idea into a successful product.</p>
            </header>
            <ol className="svc-process__steps">
              {processSteps.map(([number, title, text], index) => {
                const StepIcon = processIcons[index];
                return (
                  <motion.li
                    key={number}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.07 }}
                  >
                    <span className="svc-process__number">{number}</span>
                    <span className="svc-process__icon"><StepIcon aria-hidden="true" /></span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <div className="container">
          <div className="svc-cta__panel">
            <div className="svc-cta__copy">
              <p className="eyebrow"><span />Let&apos;s work together</p>
              <h2><span>Ready to Bring</span> <em>Your Ideas to Life?</em></h2>
              <p className="svc-cta__description">
                Let&apos;s talk about your project and find the right solution to move your business forward.
              </p>
              <Button to="/contact" className="svc-cta__button" cursorLabel="CONTACT">
                Get in Touch
              </Button>
            </div>
            <div className="svc-cta__image" aria-hidden="true">
              {aboutContent.servicesCtaImage && <img src={aboutContent.servicesCtaImage} alt="" loading="lazy" />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}