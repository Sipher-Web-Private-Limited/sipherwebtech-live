import {
  ArrowUpRight, Briefcase, CheckCircle2, Clock, Compass,
  Code2, MapPin, MessageCircle, Search, Sparkles, X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useContentLibrary, type CareerJob } from "../content/contentLibrary";
import "../styles/careers.css";

const FALLBACK_ROLES = ["Django Developer", "Laravel Developer", "React Developer", "UI/UX Designer", "Python Developer", "Digital Marketing Executive"];

function HiringBadge({ roleNames }: { roleNames: string[] }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(badgeRef, { amount: 0.1 });

  useEffect(() => {
    if (!isInView || roleNames.length < 2) return;
    const id = window.setInterval(() => setRoleIdx((i) => (i + 1) % roleNames.length), 2600);
    return () => window.clearInterval(id);
  }, [isInView, roleNames]);

  return (
    <p ref={badgeRef} className="careers-now" aria-live="polite">
      <span className="careers-now__dot" /> Now hiring <b>{roleNames[roleIdx % roleNames.length]}</b>
    </p>
  );
}

function ModalSectionList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items?: string[];
  icon: typeof Sparkles;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="career-modal__section">
      <h4>{title}</h4>
      <ul className="career-modal__list">
        {items.map((t, i) => (
          <li key={`${title}-${i}`}>
            <Icon size={16} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Careers() {
  const { companyProfile } = useCmsContent();
  const { items: jobs, loading, error } = useContentLibrary<CareerJob>("career");

  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJob, setActiveJob] = useState<CareerJob | null>(null);

  const liveRoles = useMemo(() => Array.from(new Set(jobs.map((j) => j.title).filter(Boolean))), [jobs]);
  const roleNames = liveRoles.length ? liveRoles : FALLBACK_ROLES;
  const tickerHalf = useMemo(
    () => Array.from({ length: Math.max(1, Math.ceil(8 / roleNames.length)) }).flatMap(() => roleNames),
    [roleNames]
  );
  const boardRows = (liveRoles.length ? jobs : []).slice(0, 3);

  const brand = companyProfile.brandName?.toUpperCase() || "SIPHER WEB";

  const departments = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean)));
    return ["All", ...list];
  }, [jobs]);

  const deptCount = (d: string) => (d === "All" ? jobs.length : jobs.filter((j) => j.category === d).length);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return jobs.filter((job) => {
      const matchDept = selectedDept === "All" || job.category === selectedDept;
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.excerpt.toLowerCase().includes(q) ||
        job.skills?.some((s) => s.toLowerCase().includes(q)) ||
        job.category.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [jobs, selectedDept, searchQuery]);

  // Drawer: Esc to close + lock body scroll
  useEffect(() => {
    if (!activeJob) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveJob(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeJob]);

  return (
    <>
      <Seo
        title={`Careers | Work With Us at ${companyProfile.brandName}`}
        description={`Join ${companyProfile.name}. Discover open career opportunities in web development, design, cloud engineering, and digital growth.`}
      />

      <div className="careers-page">
        {/* ---------------- Hero ---------------- */}
        <section className="careers-hero">
          <nav className="breadcrumb team-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/about">Company</Link><span>/</span><span>Careers</span>
          </nav>

          <div className="careers-hero__wrap">
            <div>
              <p className="eyebrow"><span />CAREERS AT {brand}</p>
              <h1>
                <span className="line"><span>Build the future of</span></span>
                <span className="line"><span><em>digital products</em> with us.</span></span>
              </h1>
              <p className="careers-hero__copy">
                We are a dedicated team of engineers, designers, and growth strategists solving complex
                challenges for forward-thinking brands worldwide.
              </p>
              <HiringBadge roleNames={roleNames} />
            </div>

            <div className="careers-visual">
              <div className="careers-visual__arc" aria-hidden="true" />
              <div className="careers-visual__blob" aria-hidden="true" />
              <div className="careers-visual__dots" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</div>

              <div className="careers-note" aria-hidden="true">
                <b>We're hiring!</b>
                <p>Join our Lucknow hub or work hybrid with a team that ships.</p>
              </div>
              <span className="careers-chip careers-chip--a" aria-hidden="true"><i />Hybrid</span>
              <span className="careers-chip careers-chip--b" aria-hidden="true"><i />Full-time</span>

              <div className="careers-board">
                <div className="careers-board__head">
                  <span><i /> Live openings</span>
                  {!loading && liveRoles.length > 0 && <small>{jobs.length} open</small>}
                </div>
                {(boardRows.length ? boardRows : FALLBACK_ROLES.slice(0, 3).map((title, i) => ({ id: `f${i}`, title, category: "Engineering", location: "Lucknow, India" }))).map((j, i) => (
                  <a href="#open-roles" className="careers-board__row" style={{ ["--i" as string]: i }} key={j.id}>
                    <span className="careers-board__icon"><Code2 size={18} /></span>
                    <div>
                      <strong>{j.title}</strong>
                      <small>{[j.category, j.location].filter(Boolean).join(" • ")}</small>
                    </div>
                    <ArrowUpRight size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Slanted ticker of live job names */}
        <div className="careers-marquee" aria-label="Open job roles">
          <div className="careers-marquee__track">
            {[...tickerHalf, ...tickerHalf].map((name, i) => (
              <a href="#open-roles" key={i} onClick={() => liveRoles.length && setSearchQuery(name)}>{name}</a>
            ))}
          </div>
        </div>

        {/* ---------------- Jobs ---------------- */}
        <section className="careers-jobs" id="open-roles">
          <div className="container">
            <div className="careers-section-head">
              <p className="eyebrow"><span />OPEN POSITIONS</p>
              <h2><span>Current </span><em>job opportunities.</em></h2>
              <p>Explore our active roles and apply to become part of our growing team.</p>
            </div>

            <div className="careers-filters-bar">
              <div className="careers-dept-tabs" role="tablist" aria-label="Job Departments">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    role="tab"
                    aria-selected={selectedDept === dept}
                    className={`careers-dept-tab${selectedDept === dept ? " is-active" : ""}`}
                    onClick={() => setSelectedDept(dept)}
                  >
                    {dept} <small>{deptCount(dept)}</small>
                  </button>
                ))}
              </div>

              <div className="careers-search-wrap">
                <Search size={18} />
                <input
                  type="text"
                  className="careers-search-input"
                  placeholder="Search by role or skill (e.g. React, UI/UX)..."
                  aria-label="Search jobs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="careers-search-clear" aria-label="Clear search" onClick={() => setSearchQuery("")}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="careers-jobs-count" aria-live="polite">
              {loading ? "Loading active opportunities..." : `${filteredJobs.length} open position${filteredJobs.length === 1 ? "" : "s"}`}
            </div>

            {loading ? (
              <div className="careers-jobs-grid" aria-busy="true">
                {[0, 1, 2, 3].map((n) => <div className="career-skeleton" key={n} />)}
              </div>
            ) : error ? (
              <div className="careers-error">Unable to load job listings right now. Please check back shortly.</div>
            ) : filteredJobs.length === 0 ? (
              <div className="careers-empty">
                <Compass size={42} />
                <h3>No open roles matching your search</h3>
                <p>Try another department or clear your search term.</p>
                <button type="button" className="career-view-btn" onClick={() => { setSelectedDept("All"); setSearchQuery(""); }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="careers-jobs-grid">
                {filteredJobs.map((job, idx) => (
                  <Reveal className="career-card" delay={Math.min(idx, 5) * 0.05} key={job.id}>
                    <div className="career-card__body">
                      <div className="career-card__top">
                        {job.category && <span className="career-badge career-badge--dept">{job.category}</span>}
                        {job.employmentType && (
                          <span className="career-badge career-badge--type"><Clock size={11} /> {job.employmentType}</span>
                        )}
                      </div>
                      <h3 className="career-card__title">{job.title}</h3>
                      <ul className="career-card__facts">
                        {job.location && <li><MapPin size={14} /> <span>{job.location}</span></li>}
                        {job.experience && <li><Briefcase size={14} /> <span>{job.experience}</span></li>}
                      </ul>
                      <p className="career-card__excerpt">{job.excerpt}</p>
                      {job.skills && job.skills.length > 0 && (
                        <div className="career-card__skills">
                          {job.skills.slice(0, 4).map((skill) => <span className="career-skill-tag" key={skill}>{skill}</span>)}
                          {job.skills.length > 4 && <span className="career-skill-tag">+{job.skills.length - 4} more</span>}
                        </div>
                      )}
                    </div>
                    <div className="career-card__actions">
                      <div className="career-card__pay">
                        <small>Package</small>
                        <span className="career-card__salary">{job.salary || "Competitive"}</span>
                      </div>
                      <button type="button" className="career-view-btn" onClick={() => setActiveJob(job)}>
                        View details <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal className="careers-spontaneous">
              <div className="careers-spontaneous__text">
                <h3><span>Don't see your </span><em>specific role?</em></h3>
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

        {/* ---------------- Job drawer (portal: always above floating dock) ---------------- */}
        {activeJob &&
          createPortal(
            <div className="career-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setActiveJob(null)}>
              <div className="career-modal" role="dialog" aria-modal="true" aria-labelledby="modal-job-title">
                <button type="button" className="career-modal__close" onClick={() => setActiveJob(null)} aria-label="Close details" autoFocus>
                  <X size={20} />
                </button>

                <div className="career-modal__header">
                  <div className="career-modal__tags">
                    {activeJob.category && <span className="career-badge career-badge--dept">{activeJob.category}</span>}
                    {activeJob.employmentType && (
                      <span className="career-badge career-badge--type"><Clock size={11} /> {activeJob.employmentType}</span>
                    )}
                  </div>
                  <h2 className="career-modal__title" id="modal-job-title">{activeJob.title}</h2>
                  {activeJob.salary && (
                    <div className="career-modal__salary-box"><span>Package</span> <strong>{activeJob.salary}</strong></div>
                  )}
                </div>

                {(activeJob.location || activeJob.experience || activeJob.employmentType) && (
                  <div className="career-modal__facts">
                    {activeJob.location && (
                      <div className="career-fact"><span className="career-fact__icon"><MapPin size={17} /></span><div><small>Location</small><strong>{activeJob.location}</strong></div></div>
                    )}
                    {activeJob.experience && (
                      <div className="career-fact"><span className="career-fact__icon"><Briefcase size={17} /></span><div><small>Experience</small><strong>{activeJob.experience}</strong></div></div>
                    )}
                    {activeJob.employmentType && (
                      <div className="career-fact"><span className="career-fact__icon"><Clock size={17} /></span><div><small>Job type</small><strong>{activeJob.employmentType}</strong></div></div>
                    )}
                  </div>
                )}

                <div className="career-modal__content">
                  <div className="career-modal__section">
                    <h4>Role Overview</h4>
                    <p>{activeJob.excerpt}</p>
                  </div>

                  {activeJob.skills && activeJob.skills.length > 0 && (
                    <div className="career-modal__section">
                      <h4>Required Tech & Skills</h4>
                      <div className="career-card__skills" style={{ marginBottom: 0 }}>
                        {activeJob.skills.map((s) => <span className="career-skill-tag" key={s}>{s}</span>)}
                      </div>
                    </div>
                  )}

                  <ModalSectionList title="Key Responsibilities" items={activeJob.responsibilities} icon={CheckCircle2} />
                  <ModalSectionList title="Requirements & Qualifications" items={activeJob.requirements} icon={CheckCircle2} />
                  <ModalSectionList title="Perks & Benefits" items={activeJob.benefits} icon={Sparkles} />
                </div>

                <div className="career-modal__footer">
                  <a
                    className="career-apply-btn"
                    href={`mailto:${activeJob.applyEmail || "careers@sipherweb.com"}?subject=${encodeURIComponent(
                      `Application for ${activeJob.title} - ${companyProfile.brandName || "Sipher Web"}`
                    )}&body=${encodeURIComponent(
                      `Hi Team,\n\nI am interested in applying for the ${activeJob.title} position at ${
                        companyProfile.name || "Sipher Web Private Limited"
                      }.\n\nPlease find my resume and relevant work portfolio attached.\n\nName:\nPhone:\nLinkedIn / GitHub Portfolio:\n\nLooking forward to hearing from you.`
                    )}`}
                  >
                    Apply for this position <ArrowUpRight size={17} />
                  </a>
                  <Link to="/contact" className="career-modal__alt" onClick={() => setActiveJob(null)}>
                    <MessageCircle size={17} />
                    <span>Have a question? Contact us</span>
                  </Link>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </>
  );
}