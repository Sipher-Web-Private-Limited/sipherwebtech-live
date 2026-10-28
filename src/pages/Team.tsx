import { ArrowLeft, ArrowRight, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/Team.css";

export default function Team() {
  const { members, companyProfile, aboutContent } = useCmsContent();
  const carouselRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [open, setOpen] = useState<string | null>(null);
  const lastPointer = useRef<string>("mouse");

  const updateEdges = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const max = carousel.scrollWidth - carousel.clientWidth;
    const start = carousel.scrollLeft <= 4;
    const end = carousel.scrollLeft >= max - 4;

    // only re-render when something actually changed
    setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));

    // progress thumb is updated directly (no re-render on every scroll frame)
    const bar = barRef.current;
    if (bar) {
      const thumb = carousel.scrollWidth
        ? Math.min(1, carousel.clientWidth / carousel.scrollWidth)
        : 1;
      const pos = max > 0 ? carousel.scrollLeft / max : 0;
      bar.style.width = `${thumb * 100}%`;
      bar.style.left = `${pos * (1 - thumb) * 100}%`;
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateEdges();
    carousel.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);

    return () => {
      carousel.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
    // re-run when CMS members arrive after the first render
  }, [updateEdges, members.length]);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector<HTMLElement>(".team-card");
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 28;
    const distance = firstCard ? firstCard.offsetWidth + gap : carousel.clientWidth;
    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  // Mouse-only: a soft light follows the cursor across the hero photo.
  const handleVisualMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const handleVisualLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mx", "50%");
    e.currentTarget.style.setProperty("--my", "40%");
  };

  const toggleCard = (slug: string) =>
    setOpen((current) => (current === slug ? null : slug));

  return (
    <>
      <Seo
        title={`Our Team | ${companyProfile.brandName}`}
        description={`Meet the people behind ${companyProfile.brandName}.`}
      />

      <main className="team-page">
        <section className="team-hero" aria-labelledby="team-hero-title">
          <nav className="breadcrumb team-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/about">Company</Link>
            <span>/</span>
            <span>Team</span>
          </nav>

          <div className="team-hero__content">
            <p className="team-hero__eyebrow">
              <span /> THE PEOPLE BEHIND IT
            </p>
            <h1 id="team-hero-title">
              People who <em>make it happen.</em>
            </h1>
            <p className="team-hero__description">
              Engineers, strategists, designers and technologists building
              meaningful digital experiences together.
            </p>
          </div>

          <div
            className="team-hero__visual"
            onPointerMove={handleVisualMove}
            onPointerLeave={handleVisualLeave}
          >
            <span className="team-hero__ring" aria-hidden="true" />

            <figure className="team-hero__photo-frame" aria-hidden="true">
              {aboutContent.teamHeroImage && (
                <img
                  className="team-hero__image"
                  src={aboutContent.teamHeroImage}
                  alt=""
                  fetchPriority="high"
                />
              )}
              <span className="team-hero__sheen" />
            </figure>
          </div>
        </section>

        <section className="team-section" id="team-members" aria-label="Meet our team">
          <header className="team-section__intro">
            <p className="team-section__eyebrow">THE PEOPLE BEHIND THE WORK</p>
            <h2>
              Meet our <em>team.</em>
            </h2>
          </header>

          <div
            className={`team-carousel${edge.start ? " is-start" : ""}${edge.end ? " is-end" : ""}`}
            role="group"
            aria-label="Team members"
          >
            <div className="team-carousel__controls">
              {members.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous team members"
                    disabled={edge.start}
                    onClick={() => moveCarousel(-1)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next team members"
                    disabled={edge.end}
                    onClick={() => moveCarousel(1)}
                  >
                    <ArrowRight size={20} />
                  </button>
                </>
              )}
            </div>

            {members.length === 0 ? (
              <div className="team-empty">
                <span><UserRound size={24} /></span>
                <h3>Team profiles are being updated.</h3>
                <p>Published team profiles added in the admin workspace will appear here.</p>
                <Link to="/contact">Contact our team</Link>
              </div>
            ) : (
              <div className="team-grid" ref={carouselRef}>
                {members.map((member, index) => {
                  const isOpen = open === member.slug;
                  const bio =
                    member.details || member.bio || member.message ||
                    "Profile details are coming soon.";

                  return (
                    <article
                      className={`team-card${isOpen ? " is-open" : ""}`}
                      key={member.slug}
                      style={{ "--i": index } as CSSProperties}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isOpen}
                      aria-label={`${member.name}, ${member.role}`}
                      /* mouse: hover opens / leaves closes */
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") setOpen(member.slug);
                      }}
                      onPointerLeave={(e) => {
                        if (e.pointerType === "mouse") {
                          setOpen((current) => (current === member.slug ? null : current));
                        }
                      }}
                      /* touch / pen: tap toggles */
                      onPointerDown={(e) => {
                        lastPointer.current = e.pointerType;
                      }}
                      onClick={() => {
                        if (lastPointer.current === "mouse") return;
                        toggleCard(member.slug);
                      }}
                      /* keyboard */
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleCard(member.slug);
                        } else if (e.key === "Escape") {
                          setOpen(null);
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                          setOpen((current) => (current === member.slug ? null : current));
                        }
                      }}
                    >
                      <div className="team-card__media">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.hidden = true;
                            }}
                          />
                        ) : (
                          <span className="team-card__portrait-placeholder">
                            <UserRound size={56} strokeWidth={1.4} />
                          </span>
                        )}
                      </div>

                      <div className="team-card__panel">
                        <p className="team-card__role">{member.role}</p>
                        <h3 className="team-card__name">{member.name}</h3>

                        <div className="team-card__reveal">
                          <div className="team-card__reveal-inner">
                            <p className="team-card__bio">{bio}</p>
                          </div>
                        </div>

                        <span className="team-card__hint" aria-hidden="true">
                          {isOpen ? "Tap to close" : "Tap to read more"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {members.length > 1 && (
            <div className="team-progress" aria-hidden="true">
              <span ref={barRef} />
            </div>
          )}
        </section>

        <section className="team-cta-section" aria-label="Contact us">
          <div className="team-cta">
            <div className="team-cta__text">
              <h3>Have a project in mind?</h3>
              <p>
                Tell us what you are building and we will get back to you with
                a clear plan.
              </p>
            </div>
            <div className="team-cta__actions">
              <Link className="team-cta__btn team-cta__btn--primary" to="/contact">
                Start a conversation <ArrowRight size={18} />
              </Link>
              <Link className="team-cta__btn" to="/about">
                About {companyProfile.brandName}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}