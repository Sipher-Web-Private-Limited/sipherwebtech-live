import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  HeartHandshake,
  Laptop,
  MapPin,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useContentLibrary, type CareerJob } from "../content/contentLibrary";
import "../styles/careers.css";

const PERKS = [
  {
    icon: Rocket,
    title: "High-Impact Engineering",
    description:
      "Work on real enterprise applications, scalable platforms, and modern digital products for ambitious global clients.",
  },
  {
    icon: Laptop,
    title: "Modern Tech Stack",
    description:
      "Build with React, TypeScript, Tailwind, Next.js, Laravel, Docker, and AWS. No legacy dead-end codebases.",
  },
  {
    icon: HeartHandshake,
    title: "Hybrid Flexibility",
    description:
      "We believe in outcomes over desk hours. Enjoy flexible schedules and hybrid work support from our Lucknow hub.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Mentorship",
    description:
      "Continuous access to technical courses, books, developer conferences, and direct guidance from seasoned leadership.",
  },
  {
    icon: ShieldCheck,
    title: "Health & Wellness",
    description:
      "Comprehensive medical coverage, annual wellness checkups, and generous paid time off to recharge.",
  },
  {
    icon: Sparkles,
    title: "Competitive Compensation",
    description:
      "Top-tier compensation packages, performance-based appraisals, and transparent appraisal milestones.",
  },
];

export default function Careers() {
  const { companyProfile } = useCmsContent();
  const { items: jobs, loading, error } = useContentLibrary<CareerJob>("career");

  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeJob, setActiveJob] = useState<CareerJob | null>(null);

  // Extract unique departments
  const departments = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean)));
    return ["All", ...list];
  }, [jobs]);

  // Filter jobs based on department and search query
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchDept = selectedDept === "All" || job.category === selectedDept;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.excerpt.toLowerCase().includes(q) ||
        job.skills?.some((s) => s.toLowerCase().includes(q)) ||
        job.category.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [jobs, selectedDept, searchQuery]);

  return (
    <>
      <Seo
        title={`Careers | Work With Us at ${companyProfile.brandName}`}
        description={`Join ${companyProfile.name}. Discover open career opportunities in web development, design, cloud engineering, and digital growth.`}
      />

      <div className="careers-page">
        {/* ---------------- Hero ---------------- */}
        <section className="careers-hero">
          <div className="container">
            <div className="careers-hero__inner">
              <p className="eyebrow">
                <span />
                CAREERS AT {companyProfile.brandName?.toUpperCase() || "SIPHER WEB"}
              </p>
              <h1>
                Build the future of <em>digital products</em> with us.
              </h1>
              <p className="careers-hero__copy">
                We are a dedicated team of engineers, designers, and growth strategists solving complex
                challenges for forward-thinking brands worldwide.
              </p>
              <div className="careers-hero__pills">
                <span className="careers-hero__pill">
                  <Sparkles size={15} /> Modern Tech Stack
                </span>
                <span className="careers-hero__pill">
                  <Building2 size={15} /> Lucknow HQ & Hybrid
                </span>
                <span className="careers-hero__pill">
                  <Rocket size={15} /> High-Growth Culture
                </span>
                <span className="careers-hero__pill">
                  <ShieldCheck size={15} /> Great Benefits
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Perks Section ---------------- */}
        <section className="careers-perks">
          <div className="container">
            <div className="careers-section-head">
              <p className="eyebrow">
                <span />
                LIFE AT {companyProfile.brandName?.toUpperCase() || "SIPHER WEB"}
              </p>
              <h2>Why you will love working here</h2>
              <p>
                We foster a culture of craftsmanship, intellectual curiosity, mutual respect, and continuous career
                progression.
              </p>
            </div>

            <div className="careers-perks__grid">
              {PERKS.map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <Reveal className="careers-perk-card" delay={idx * 0.06} key={perk.title}>
                    <div className="careers-perk-card__icon">
                      <Icon size={24} />
                    </div>
                    <h3>{perk.title}</h3>
                    <p>{perk.description}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- Jobs Section ---------------- */}
        <section className="careers-jobs" id="open-roles">
          <div className="container">
            <div className="careers-section-head">
              <p className="eyebrow">
                <span />
                OPEN POSITIONS
              </p>
              <h2>Current job opportunities</h2>
              <p>Explore our active roles and apply to become part of our growing team.</p>
            </div>

            {/* Filter and Search Bar */}
            <div className="careers-filters-bar">
              <div className="careers-dept-tabs" role="tablist" aria-label="Job Departments">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    className={`careers-dept-tab${selectedDept === dept ? " is-active" : ""}`}
                    onClick={() => setSelectedDept(dept)}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div className="careers-search-wrap">
                <Search size={18} />
                <input
                  type="text"
                  className="careers-search-input"
                  placeholder="Search by role or skill (e.g. React, UI/UX)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="careers-jobs-count">
              {loading
                ? "Loading active opportunities..."
                : `${filteredJobs.length} open position${filteredJobs.length === 1 ? "" : "s"}`}
            </div>

            {/* Jobs List */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                Fetching current job openings...
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#a82020" }}>
                Unable to load job listings right now. Please check back shortly.
              </div>
            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  background: "var(--white)",
                  borderRadius: "20px",
                  border: "1px solid var(--border)",
                }}
              >
                <Compass size={40} style={{ margin: "0 auto 16px", color: "var(--muted)" }} />
                <h3 style={{ margin: "0 0 8px", color: "var(--navy)" }}>No open roles matching your search</h3>
                <p style={{ margin: "0 0 20px", color: "var(--muted)", fontSize: "15px" }}>
                  Try selecting another department or clearing your search term.
                </p>
                <button
                  type="button"
                  className="career-view-btn"
                  onClick={() => {
                    setSelectedDept("All");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="careers-jobs-grid">
                {filteredJobs.map((job, idx) => (
                  <Reveal className="career-card" delay={idx * 0.05} key={job.id}>
                    <div>
                      <div className="career-card__meta-row">
                        {job.category && (
                          <span className="career-badge career-badge--dept">{job.category}</span>
                        )}
                        {job.employmentType && (
                          <span className="career-badge career-badge--type">
                            <Clock size={11} /> {job.employmentType}
                          </span>
                        )}
                        {job.location && (
                          <span className="career-badge career-badge--location">
                            <MapPin size={11} /> {job.location}
                          </span>
                        )}
                        {job.experience && (
                          <span className="career-badge career-badge--exp">
                            <Briefcase size={11} /> {job.experience}
                          </span>
                        )}
                      </div>

                      <h3 className="career-card__title">{job.title}</h3>
                      <p className="career-card__excerpt">{job.excerpt}</p>

                      {job.skills && job.skills.length > 0 && (
                        <div className="career-card__skills">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span className="career-skill-tag" key={skill}>
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="career-skill-tag">+{job.skills.length - 5} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="career-card__actions">
                      <span className="career-card__salary">
                        {job.salary || "Competitive Compensation"}
                      </span>
                      <button
                        type="button"
                        className="career-view-btn"
                        onClick={() => setActiveJob(job)}
                      >
                        View Details <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Spontaneous Application Banner */}
            <Reveal className="careers-spontaneous">
              <div className="careers-spontaneous__text">
                <h3>Don't see your specific role?</h3>
                <p>
                  We are always eager to connect with brilliant developers, UI/UX designers, and growth
                  visionaries. Drop us your portfolio or CV, and let's start a conversation.
                </p>
              </div>
              <div className="careers-spontaneous__action">
                <Button to="/contact">Introduce Yourself</Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Job Details Modal ---------------- */}
        {activeJob && (
          <div
            className="career-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveJob(null);
            }}
          >
            <div className="career-modal" role="dialog" aria-modal="true" aria-labelledby="modal-job-title">
              <button
                type="button"
                className="career-modal__close"
                onClick={() => setActiveJob(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              <div className="career-modal__header">
                <div className="career-card__meta-row">
                  {activeJob.category && (
                    <span className="career-badge career-badge--dept">{activeJob.category}</span>
                  )}
                  {activeJob.employmentType && (
                    <span className="career-badge career-badge--type">
                      <Clock size={11} /> {activeJob.employmentType}
                    </span>
                  )}
                  {activeJob.location && (
                    <span className="career-badge career-badge--location">
                      <MapPin size={11} /> {activeJob.location}
                    </span>
                  )}
                  {activeJob.experience && (
                    <span className="career-badge career-badge--exp">
                      <Briefcase size={11} /> {activeJob.experience}
                    </span>
                  )}
                </div>

                <h2 className="career-modal__title" id="modal-job-title">
                  {activeJob.title}
                </h2>

                {activeJob.salary && (
                  <div className="career-modal__salary-box">
                    <span>Package:</span> <strong>{activeJob.salary}</strong>
                  </div>
                )}
              </div>

              <div className="career-modal__content">
                {/* Summary */}
                <div className="career-modal__section">
                  <h4>Role Overview</h4>
                  <p>{activeJob.excerpt}</p>
                </div>

                {/* Skills */}
                {activeJob.skills && activeJob.skills.length > 0 && (
                  <div className="career-modal__section">
                    <h4>Required Tech & Skills</h4>
                    <div className="career-card__skills">
                      {activeJob.skills.map((s) => (
                        <span className="career-skill-tag" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
                  <div className="career-modal__section">
                    <h4>Key Responsibilities</h4>
                    <ul className="career-modal__list">
                      {activeJob.responsibilities.map((resp, i) => (
                        <li key={i}>
                          <CheckCircle2 size={16} />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {activeJob.requirements && activeJob.requirements.length > 0 && (
                  <div className="career-modal__section">
                    <h4>Requirements & Qualifications</h4>
                    <ul className="career-modal__list">
                      {activeJob.requirements.map((req, i) => (
                        <li key={i}>
                          <CheckCircle2 size={16} />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {activeJob.benefits && activeJob.benefits.length > 0 && (
                  <div className="career-modal__section">
                    <h4>Perks & Benefits</h4>
                    <ul className="career-modal__list">
                      {activeJob.benefits.map((benefit, i) => (
                        <li key={i}>
                          <Sparkles size={16} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="career-modal__footer">
                <a
                  className="career-apply-btn"
                  href={`mailto:${
                    activeJob.applyEmail || "careers@sipherweb.com"
                  }?subject=${encodeURIComponent(
                    `Application for ${activeJob.title} - ${companyProfile.brandName || "Sipher Web"}`
                  )}&body=${encodeURIComponent(
                    `Hi Team,\n\nI am interested in applying for the ${activeJob.title} position at ${
                      companyProfile.name || "Sipher Web Private Limited"
                    }.\n\nPlease find my resume and relevant work portfolio attached.\n\nName:\nPhone:\nLinkedIn / GitHub Portfolio:\n\nLooking forward to hearing from you.`
                  )}`}
                >
                  Apply For This Position <ArrowUpRight size={17} />
                </a>

                <Link
                  to="/contact"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--navy)",
                    textDecoration: "underline",
                  }}
                >
                  Or send enquiry via Contact Page
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
