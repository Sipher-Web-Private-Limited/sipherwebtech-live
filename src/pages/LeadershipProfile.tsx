import { ArrowLeft, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/Leadership.css";

export default function LeadershipProfile() {
  const { slug } = useParams();
  const { leaders, companyProfile } = useCmsContent();
  const leader = leaders.find((person) => person.slug === slug);

  if (!leader) {
    return <Navigate to="/leadership" replace />;
  }

  return (
    <>
      <Seo
        title={`${leader.name} | ${companyProfile.brandName}`}
        description={leader.bio ?? ""}
      />

      <section className="leader-profile">
        <Link className="leader-profile__back" to="/leadership">
          <ArrowLeft size={16} />
          All leadership
        </Link>

        <div className="leader-profile__content">
          <div className="leader-profile__image">
            {leader.photo
              ? <img src={leader.photo} alt={leader.name} onError={(event) => { event.currentTarget.hidden = true; }} />
              : <span className="leader-profile__photo-placeholder"><UserRound size={56} /></span>}
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
                {leader.messageTitle && <h2 id="leader-message-title">{leader.messageTitle}</h2>}
                {leader.message && <blockquote>{leader.message}</blockquote>}
                {leader.bio && <p>{leader.bio}</p>}
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
