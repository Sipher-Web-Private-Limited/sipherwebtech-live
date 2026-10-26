import { ArrowDown, ArrowLeft, ArrowRight, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/Team.css";

export default function Team() {
  const { members, companyProfile, aboutContent } = useCmsContent();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const max = carousel.scrollWidth - carousel.clientWidth;
    setEdge({
      start: carousel.scrollLeft <= 4,
      end: carousel.scrollLeft >= max - 4,
    });
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
  }, [updateEdges]);

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

  return (
    <>
      <Seo
        title={`Our Team | ${companyProfile.brandName}`}
        description={`Meet the people behind ${companyProfile.brandName}.`}
      />

      <main className="team-page">
        <section className="team-hero" aria-labelledby="team-hero-title">
          <nav className="team-hero__breadcrumb" aria-label="Breadcrumb">
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

            <a className="team-hero__chip" href="#team-members">
              <span className="team-hero__chip-dot" aria-hidden="true" />
              Meet the team
              <ArrowDown size={16} aria-hidden="true" />
            </a>
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
              {members.length > 1 && <>
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
              </>}
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
                {members.map((member) => (
                  <article className="team-card" key={member.slug} tabIndex={0}>
                    <div className="team-card__inner">
                      <div className="team-card__face team-card__front">
                        {member.photo
                          ? <img src={member.photo} alt={member.name} onError={(event) => { event.currentTarget.hidden = true; }} />
                          : <span className="team-card__portrait-placeholder"><UserRound size={44} /></span>}
                        <div className="team-card__caption">
                          <p className="team-card__role">{member.role}</p>
                          <h3>{member.name}</h3>
                        </div>
                      </div>

                      <div className="team-card__face team-card__back">
                        <p className="team-card__role" aria-hidden="true">
                          {member.role}
                        </p>
                        <p className="team-card__name" aria-hidden="true">
                          {member.name}
                        </p>
                        <p className="team-card__bio">{member.details || member.bio || member.message}</p>
                        <span className="team-card__back-cue" aria-hidden="true">
                          Back to portrait
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}