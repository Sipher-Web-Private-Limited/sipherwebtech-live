import { ArrowUpRight, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/Leadership.css";

/* Two-tone heading: last two words get the accent colour */
function renderTwoTone(title) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return title;
  const cut = Math.max(1, words.length - 2);
  return (
    <>
      {words.slice(0, cut).join(" ")}{" "}
      <span className="leader-profile__accent">{words.slice(cut).join(" ")}</span>
    </>
  );
}

export default function LeadershipProfile() {
  const { slug } = useParams();
  const { leaders, companyProfile } = useCmsContent();
  const leader = leaders.find((person) => person.slug === slug);

  if (!leader) {
    return <Navigate to="/leadership" replace />;
  }

  const others = leaders.filter((person) => person.slug !== leader.slug);

  return (
    <>
      <Seo
        title={`${leader.name} | ${companyProfile.brandName}`}
        description={leader.bio ?? ""}
      />

      <section className="leader-profile">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/about">Company</Link>
            <span>/</span>
            <Link to="/leadership">Leadership</Link>
            <span>/</span>
            <span>{leader.name}</span>
          </nav>


        <div className="leader-profile__content">
          <div className="leader-profile__image">
            {leader.photo
              ? <img src={leader.photo} alt={leader.name} onError={(event) => { event.currentTarget.hidden = true; }} />
              : <span className="leader-profile__photo-placeholder"><UserRound size={56} /></span>}
            <span className="leader-profile__badge"><i />Leadership</span>
          </div>

          <div className="leader-profile__copy">
            <p className="eyebrow">{companyProfile.brandName} Leadership</p>
            <h1
              className={
                leader.slug === "director"
                  ? "leader-profile__name leader-profile__name--nowrap"
                  : "leader-profile__name"
              }
            >
              {leader.name}
            </h1>
            <p className="leader-profile__role">{leader.role}</p>
            {(leader.messageTitle || leader.message || leader.bio) && (
              <section className="leader-profile__message" aria-labelledby="leader-message-title">
                {leader.messageTitle && <h2 id="leader-message-title">{renderTwoTone(leader.messageTitle)}</h2>}
                {leader.message && <blockquote>{leader.message}</blockquote>}
                {leader.bio && <p>{leader.bio}</p>}
              </section>
            )}

            <div className="leader-profile__actions">
              <Link className="leader-profile__cta" to="/contact" data-cursor="CONTACT">
                Get in touch <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <div className="leader-profile__more">
            <p className="leader-profile__more-title">More from the team</p>
            <div className="leader-profile__more-grid">
              {others.map((person) => (
                <Link
                  className="leader-profile__more-card"
                  data-cursor="VIEW"
                  to={`/leadership/${person.slug}`}
                  key={person.slug}
                >
                  <span className="leader-profile__more-thumb">
                    {person.photo
                      ? <img src={person.photo} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />
                      : <UserRound size={24} />}
                  </span>
                  <span className="leader-profile__more-text">
                    <strong>{person.name}</strong>
                    <em>{person.role}</em>
                  </span>
                  <span className="leader-profile__more-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </>
  );
}
