import { ArrowUpRight, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
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
      <span className="leader-card__accent">{words.slice(cut).join(" ")}</span>
    </>
  );
}

export default function Leadership() {
  const { leaders, companyProfile } = useCmsContent();

  return (
    <>
      <Seo
        title={`Leadership | ${companyProfile.brandName}`}
        description={`Meet the leadership team at ${companyProfile.brandName}.`}
      />

      <section className="leadership-page">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/about">Company</Link>
            <span>/</span>
            <span>Leadership</span>
          </nav>

          <div className="leadership-page__intro">
            <p className="eyebrow">
            <span />
            The people behind {companyProfile.brandName}
          </p>
          <h1>
            Meet our <em>leadership.</em>
          </h1>
          <p>Get to know the people guiding our work and direction.</p>
        </div>

        <div className="leadership-grid">
          {leaders.map((leader, index) => (
            <Reveal
              className="leader-card"
              delay={index * 0.1}
              key={leader.slug}
            >
              <Link
                className="leader-card__link"
                to={`/leadership/${leader.slug}`}
                data-cursor="VIEW"
              >
                <div className="leader-card__photo-wrap">
                  {leader.photo
                    ? <img className="leader-card__photo" src={leader.photo} alt={leader.name} onError={(event) => { event.currentTarget.hidden = true; }} />
                    : <span className="leader-card__photo-placeholder"><UserRound size={48} /></span>}
                  <span className="leader-card__shade" aria-hidden="true" />
                  <span className="leader-card__chip"><i />Leadership</span>
                </div>

                <div className="leader-card__caption">
                  <div>
                    <h2>{leader.name}</h2>
                    <p>{leader.role}</p>
                  </div>
                  <span data-cursor="VIEW">View profile <ArrowUpRight size={15} aria-hidden="true" /></span>
                </div>
                {(leader.messageTitle || leader.bio) && (
                  <div className="leader-card__summary">
                    {leader.messageTitle && <strong>{renderTwoTone(leader.messageTitle)}</strong>}
                    {leader.bio && <p>{leader.bio}</p>}
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}