import { ArrowUpRight, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/Leadership.css";

export default function Leadership() {
  const { leaders, companyProfile } = useCmsContent();

  return (
    <>
      <Seo
        title={`Leadership | ${companyProfile.brandName}`}
        description={`Meet the leadership team at ${companyProfile.brandName}.`}
      />

      <section className="leadership-page">
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
              >
                <div className="leader-card__photo-wrap">
                  {leader.photo
                    ? <img className="leader-card__photo" src={leader.photo} alt={leader.name} onError={(event) => { event.currentTarget.hidden = true; }} />
                    : <span className="leader-card__photo-placeholder"><UserRound size={48} /></span>}
                  <span className="leader-card__arrow" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>

                <div className="leader-card__caption">
                  <div>
                    <h2>{leader.name}</h2>
                    <p>{leader.role}</p>
                  </div>
                  <span>View profile</span>
                </div>
                {(leader.messageTitle || leader.bio) && (
                  <div className="leader-card__summary">
                    {leader.messageTitle && <strong>{leader.messageTitle}</strong>}
                    {leader.bio && <p>{leader.bio}</p>}
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
