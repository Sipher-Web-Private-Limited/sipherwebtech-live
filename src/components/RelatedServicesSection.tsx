import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCmsContent } from "../content/CmsContentProvider";
import "../styles/components/related-services.css";

export interface RelatedServiceItem {
  to: string;
  title: string;
  text: string;
  img: string;
}

interface RelatedServicesSectionProps {
  items: RelatedServiceItem[];
  eyebrow?: string;
  title?: ReactNode;
  lead?: string;
  showViewAll?: boolean;
  viewAllTo?: string;
  viewAllLabel?: string;
  className?: string;
}

/** Extract service slug from a `/services/:slug` path. */
function slugFromPath(path: string): string {
  return path.replace(/^\/services\//, "").replace(/\/+$/, "");
}

/**
 * Reusable "Explore other services" section with numbered floating-pill cards,
 * dynamic CMS hero image/SVG resolution, and an optional "View all services" CTA.
 */
export default function RelatedServicesSection({
  items,
  eyebrow = "Explore other services",
  title = (
    <>
      Explore more ways to <em>grow online</em>
    </>
  ),
  lead = "A great website works best with the right partners around it. Pick a service below and see how it helps you get found, look sharper and sell more.",
  showViewAll = true,
  viewAllTo = "/services",
  viewAllLabel = "View all services",
  className = "",
}: RelatedServicesSectionProps) {
  const { serviceDetails } = useCmsContent();

  return (
    <section className={`srv-related${className ? ` ${className}` : ""}`}>
      <div className="container">
        <header className="srv-related__head">
          <p className="srv-related__eyebrow">{eyebrow}</p>
          <h2 className="srv-related__title">{title}</h2>
          {lead ? <p className="srv-related__lead">{lead}</p> : null}
        </header>

        <div className="srv-rel-grid">
          {items.map(({ to, title: itemTitle, text, img }, index) => {
            const slug = slugFromPath(to);
            const cmsImage = serviceDetails[slug]?.heroImage;
            const resolvedImg = cmsImage || img;

            return (
              <Link className="srv-rel" to={to} key={to} data-cursor="EXPLORE">
                <img
                  className="srv-rel__bg"
                  src={resolvedImg}
                  alt={itemTitle}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    if (event.currentTarget.src !== img && img) {
                      event.currentTarget.src = img;
                    }
                  }}
                />
                <div className="srv-rel__pill">
                  <span className="srv-rel__no" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="srv-rel__info">
                    <h3>{itemTitle}</h3>
                    <p>{text}</p>
                  </div>
                  <span className="srv-rel__more">
                    <span>Explore</span>
                    <ArrowRight aria-hidden="true" size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {showViewAll ? (
          <div className="srv-rel-all">
            <Link className="srv-rel-all__link" to={viewAllTo} data-cursor="VIEW ALL">
              <span className="srv-rel-all__label">{viewAllLabel}</span>
              <span className="srv-rel-all__icon" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
