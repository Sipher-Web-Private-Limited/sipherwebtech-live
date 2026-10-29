import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useCmsContent } from "../content/CmsContentProvider";
import { useContentLibrary, type PortfolioProject } from "../content/contentLibrary";
import "../styles/portfolio.css";

export default function PortfolioPage() {
  const { companyProfile } = useCmsContent();
  const { items: projects, loading, error } = useContentLibrary<PortfolioProject>("portfolio");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects],
  );
  const visibleProjects = category === "All"
    ? projects
    : projects.filter((project) => project.category === category);

  return (
    <main className="portfolio-page">
      <Seo
        title={`Our Work | ${companyProfile.brandName}`}
        description={`Explore published projects by ${companyProfile.brandName}.`}
      />
      <section className="pf-hero">
        <div className="pf-hero__bg" aria-hidden="true">
          <img src="/new-images/portfolio/portfolio-hero.webp" alt="" />
        </div>
        <div className="container pf-hero__content">
          <p className="eyebrow"><span />Portfolio</p>
          <h1>Work that moves <em>business forward.</em></h1>
          <p className="pf-hero__copy">Explore selected projects and solutions delivered by our team.</p>
        </div>
      </section>

      <section className="pf-work container" aria-label="Published projects">
        <div className="pf-work__head">
          <div>
            <p className="eyebrow"><span />Selected work</p>
            <h2>Projects <em>in focus</em></h2>
          </div>
          <div className="pf-filters" role="group" aria-label="Filter projects by category">
            {["All", ...categories].map((name) => (
              <button
                className={`pf-chip${category === name ? " is-active" : ""}`}
                key={name}
                type="button"
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="pf-empty"><p>Loading projects…</p></div>
        ) : error ? (
          <div className="pf-empty" role="alert"><p>{error}</p></div>
        ) : visibleProjects.length ? (
          <div className="pf-grid">
            {visibleProjects.map((project) => (
              <article className="pf-card" key={project.id}>
                <div className="pf-card__media">
                  {project.image ? (
                    <span className="pf-img is-ready"><img src={project.image} alt={project.title} loading="lazy" /></span>
                  ) : (
                    <span className="pf-img pf-img--empty" aria-hidden="true"><BriefcaseBusiness /></span>
                  )}
                </div>
                <div className="pf-card__body">
                  <span className="pf-tag pf-tag--blue"><i />{project.category || "Project"}</span>
                  <h3>{project.title}</h3>
                  <p>{project.excerpt}</p>
                  {project.tag && <p className="pf-card__detail">{project.tag}</p>}
                  <div className="pf-card__foot">
                    <Link className="pf-link" to="/contact">Discuss a similar project <ArrowRight size={15} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="pf-empty">
            <Search aria-hidden="true" />
            <h3>{projects.length ? "No projects in this category" : "Projects coming soon"}</h3>
            <p>{projects.length ? "Choose another category to see more work." : "Published portfolio projects will appear here."}</p>
            {projects.length > 0 && category !== "All" && (
              <button type="button" className="pf-chip is-active" onClick={() => setCategory("All")}>View all projects</button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
