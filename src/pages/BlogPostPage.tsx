import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUp, BookOpen, Bookmark, BookmarkCheck, Calendar, Check, Clock,
  Link2, Mail, MessageCircle, Send, Share2, Sparkles, ThumbsDown, ThumbsUp,
} from "lucide-react";
import Seo from "../components/Seo";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useNewsletterSignup } from "../content/useNewsletterSignup";
import { formatContentDate, useContentLibrary, type BlogPost } from "../content/contentLibrary";
import "../styles/blog.css";
import "../styles/blog-post.css";

type Vote = "yes" | "no";

const FONT_SIZES = [17, 19, 21];
const DEFAULT_FONT = 1;

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const readStore = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeStore = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
};


function splitDualHeading(text: string): { head: string; accent: string } {
  const clean = text.trim();
  if (!clean) return { head: "", accent: "" };

  if (clean.includes(":")) {
    const [h, ...rest] = clean.split(":");
    return { head: `${h.trim()}:`, accent: rest.join(":").trim() };
  }
  if (clean.includes(" - ")) {
    const [h, ...rest] = clean.split(" - ");
    return { head: h.trim(), accent: rest.join(" - ").trim() };
  }

  const words = clean.split(/\s+/);
  const n = words.length;
  if (n <= 1) return { head: clean, accent: "" };
  if (n === 2) return { head: words[0], accent: words[1] };
  if (n === 3) return { head: words.slice(0, 2).join(" "), accent: words[2] };

  const minIdx = Math.max(2, Math.floor(n * 0.35));
  const maxIdx = Math.min(n - 2, Math.ceil(n * 0.65));
  const pivots = /^(trends|strategies|best|essentials|guide|tips|future|why|how|what|for|in|to|with|and|&|directly)$/i;

  let splitIdx = -1;
  for (let i = minIdx; i <= maxIdx; i++) {
    if (pivots.test(words[i])) {
      splitIdx = i;
      break;
    }
  }

  if (splitIdx === -1) {
    splitIdx = Math.ceil(n / 2);
  }

  return {
    head: words.slice(0, splitIdx).join(" "),
    accent: words.slice(splitIdx).join(" "),
  };
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { companyProfile } = useCmsContent();
  const { items: posts, loading, error } = useContentLibrary<BlogPost>("blog");
  const post = posts.find((item) => item.slug === slug);
  const postSlug = post?.slug;

  const rawSections = post?.sections;
  const sections = useMemo(() => (Array.isArray(rawSections) ? rawSections : []), [rawSections]);

  const articleRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  const [percent, setPercent] = useState(0);
  const [showPill, setShowPill] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const [fs, setFs] = useState(DEFAULT_FONT);
  const [saved, setSaved] = useState(false);
  const [vote, setVote] = useState<Vote | null>(null);
  const [imgOk, setImgOk] = useState(true);
  const newsletter = useNewsletterSignup();

  /* restore saved text size once */
  useEffect(() => {
    const stored = readStore<number>("sw-post-fs", DEFAULT_FONT);
    setFs(Number.isInteger(stored) && stored >= 0 && stored < FONT_SIZES.length ? stored : DEFAULT_FONT);
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  /* per-article state: saved, vote, hero image */
  useEffect(() => {
    if (!postSlug) return;
    setSaved(readStore<string[]>("sw-saved-posts", []).includes(postSlug));
    setVote(readStore<Record<string, Vote>>("sw-post-votes", {})[postSlug] ?? null);
    setImgOk(true);
  }, [postSlug]);

  /* reading progress + floating toolbar (progress bar is written straight to the DOM: no re-render per frame) */
  useEffect(() => {
    if (!postSlug) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = articleRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.45 - r.top) / Math.max(1, r.height)));
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        setPercent(Math.round(p * 100));
      }
      setShowPill(window.scrollY > 460);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    if (ro && articleRef.current) ro.observe(articleRef.current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [postSlug]);

  /* highlight the section being read in the contents list */
  useEffect(() => {
    if (!postSlug) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [postSlug, sections]);

  /* new article → top of page; shared #section link → that section */
  useEffect(() => {
    if (!postSlug) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [postSlug]);

  const changeFont = (n: number) => {
    const v = Math.min(FONT_SIZES.length - 1, Math.max(0, n));
    setFs(v);
    writeStore("sw-post-fs", v);
  };

  const toggleSave = useCallback(() => {
    if (!postSlug) return;
    const list = readStore<string[]>("sw-saved-posts", []);
    const next = list.includes(postSlug) ? list.filter((s) => s !== postSlug) : [...list, postSlug];
    writeStore("sw-saved-posts", next);
    setSaved(next.includes(postSlug));
  }, [postSlug]);

  if (!post && loading) {
    return (
      <section className="post-skeleton container" aria-busy="true" aria-label="Loading article">
        <i className="post-skeleton__line is-short" />
        <i className="post-skeleton__line is-title" />
        <i className="post-skeleton__line is-title is-half" />
        <i className="post-skeleton__block" />
      </section>
    );
  }

  if (!post) {
    return (
      <section className="post-missing container">
        <Seo title={`Article not found | ${companyProfile.brandName}`} description="This article could not be found." />
        <h1>Article not found</h1>
        <p>{error || "This article may have been moved or removed. Browse all published posts instead."}</p>
        <Button to="/blog">Back to blog</Button>
      </section>
    );
  }

  const authorName = post.authorName || companyProfile.brandName;
  const authorRole = post.authorRole || "Editorial";
  const authorInitials = authorName.slice(0, 2).toUpperCase();

  const url = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  const enc = encodeURIComponent(url);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const flashCopied = () => {
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flashCopied();
      return;
    } catch {
      /* fall through to the legacy path */
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) flashCopied();
    } catch {
      /* clipboard fully blocked */
    }
  };

  const share = async () => {
    if (canShare) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return;
      }
    }
    void copy();
  };

  const castVote = (v: Vote) => {
    setVote(v);
    writeStore("sw-post-votes", { ...readStore<Record<string, Vote>>("sw-post-votes", {}), [post.slug]: v });
  };

  const readTime = Number.isFinite(post.readTime) && post.readTime > 0 ? post.readTime : 1;
  const left = Math.max(1, Math.ceil(readTime * (1 - percent / 100)));
  const finished = percent >= 98;
  const current = activeId || sections[0]?.id;
  const ctaAfter = Math.ceil(sections.length / 2) - 1; // inline CTA lands about halfway

  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category) || b.views - a.views)
    .slice(0, 3);
  const idx = posts.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? posts[idx - 1] : undefined;
  const older = idx >= 0 ? posts[idx + 1] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: authorName },
    publisher: { "@type": "Organization", name: companyProfile.brandName },
  };

  return (
    <div className="post-page">
      <Seo title={`${post.title} | ${companyProfile.brandName}`} description={post.excerpt} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="post-progress" aria-hidden="true"><span ref={barRef} /></div>

      {/* HERO */}
      <header className={`post-hero${sections.length > 1 ? " has-takeaways" : ""}`}>
        <div className="post-hero__bg" aria-hidden="true">
          <span className="post-hero__blob post-hero__blob--a" />
          <span className="post-hero__blob post-hero__blob--b" />
          <span className="post-hero__grid-pattern" />
        </div>

        <div className="container post-hero__inner">
          <div className="post-hero__layout">
            <div className="post-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/blog">Blog</Link>
                <span>/</span>
                <span aria-current="page">{post.category}</span>
              </nav>

              <div className="post-hero__badge-row">
                <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="post-hero__tag">
                  <span className="post-hero__tag-dot" />
                  {post.category}
                </Link>
                <span className="post-hero__reading-time"><Clock size={13} aria-hidden="true" /> {readTime} min read</span>
                <span className="post-hero__status-chip"><Sparkles size={12} aria-hidden="true" /> Verified Insight</span>
              </div>

              {(() => {
                const { head, accent } = splitDualHeading(post.title);
                return (
                  <h1>
                    <span>{head} </span>
                    <em>{accent}</em>
                  </h1>
                );
              })()}

              <p className="post-hero__lead">{post.excerpt}</p>

              <div className="post-hero__meta">
                <div className="post-hero__author-chip">
                  <i className="post-hero__author-avatar" aria-hidden="true">{authorInitials}</i>
                  <div>
                    <strong className="post-hero__author-name">{authorName}</strong>
                    <span className="post-hero__author-role">{authorRole}</span>
                  </div>
                </div>
                <div className="post-hero__date-chip">
                  <Calendar size={14} aria-hidden="true" />
                  <time dateTime={post.date}>{formatContentDate(post.date)}</time>
                </div>
              </div>
            </div>

            {post.image && imgOk && (
              <div className="post-hero__stage">
                <div className="post-hero__stage-glow" aria-hidden="true" />
                <figure className="post-hero__visual">
                  <img className="post-hero__img" src={post.image} alt={post.title} onError={() => setImgOk(false)} />
                  <div className="post-hero__visual-card">
                    <span className="post-hero__visual-card-icon"><BookOpen size={14} aria-hidden="true" /></span>
                    <span>
                      <small>Article Topic</small>
                      <strong>{post.category}</strong>
                    </span>
                  </div>
                </figure>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* WHAT YOU'LL LEARN: overlaps the hero edge (only shown when there is more than one section) */}
      {sections.length > 1 && (
        <div className="container post-takeaways-wrap">
          <nav className="post-takeaways" aria-label="What you'll learn">
            <p className="eyebrow"><span />What you'll learn</p>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}><b>{String(i + 1).padStart(2, "0")}</b><span>{s.heading}</span></a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}

      <div className="container post-layout">
        {/* share rail */}
        <div className="post-rail" role="group" aria-label="Share this article">
          <button type="button" onClick={copy} aria-label="Copy link" data-tip={copied ? "Copied" : "Copy link"}>
            {copied ? <Check size={16} /> : <Link2 size={16} />}
          </button>
          <a href={`https://wa.me/?text=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" data-tip="WhatsApp"><MessageCircle size={16} /></a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" data-tip="LinkedIn">in</a>
          <a href={`https://twitter.com/intent/tweet?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" data-tip="X">X</a>
          <button type="button" onClick={toggleSave} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save for later"} data-tip={saved ? "Saved" : "Save"} className={saved ? "is-on" : ""}>
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <article className="post-content" ref={articleRef} style={{ "--fs": `${FONT_SIZES[fs]}px` } as CSSProperties}>
          {sections.map((s, i) => {
            const body = Array.isArray(s.body) ? s.body : [];
            const { head, accent } = splitDualHeading(s.heading);
            return (
              <section key={s.id} className="post-section" aria-labelledby={s.id}>
                <h2 id={s.id} className="post-section__heading">
                  <span className="post-section__no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="post-section__title">
                    <span>{head} </span>
                    <em>{accent}</em>
                  </span>
                  <a className="post-anchor" href={`#${s.id}`} aria-label={`Link to section: ${s.heading}`}>#</a>
                </h2>
                {body.map((para, j) => (
                  <p key={j} className={i === 0 && j === 0 ? "has-dropcap" : undefined}>{para}</p>
                ))}

                {i === ctaAfter && (
                  <aside className="post-inline-cta">
                    <Send size={22} aria-hidden="true" />
                    <div>
                      <strong>Want this done for your business?</strong>
                      <span>Tell us your goal and we'll suggest the simplest way to reach it.</span>
                    </div>
                    <Link to="/contact" className="post-inline-cta__btn">Free consultation <ArrowRight size={16} aria-hidden="true" /></Link>
                  </aside>
                )}
              </section>
            );
          })}

          {/* feedback */}
          <div className="post-vote" role="group" aria-label="Was this article helpful?">
            {vote ? (
              <p role="status">
                <Check size={16} aria-hidden="true" />
                {vote === "yes" ? "Glad it helped. Share it with someone who needs it." : "Thanks for the feedback. We'll keep improving."}
              </p>
            ) : (
              <>
                <p>Was this article helpful?</p>
                <button type="button" onClick={() => castVote("yes")}><ThumbsUp size={15} aria-hidden="true" /> Yes</button>
                <button type="button" onClick={() => castVote("no")}><ThumbsDown size={15} aria-hidden="true" /> Not really</button>
              </>
            )}
          </div>

          <div className="post-tags">
            <Link to={`/blog?category=${encodeURIComponent(post.category)}`}>#{post.category.replace(/\s+/g, "")}</Link>
            <span>Share:</span>
            <button type="button" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
            <a href={`https://wa.me/?text=${enc}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>

          <div className="post-author">
            <i aria-hidden="true">{authorInitials}</i>
            <div>
              <small>Written by</small>
              <strong>{authorName}</strong>
              <span>{authorRole}</span>
              <p>Practical notes from the people who design, build and support websites, ERP systems and digital growth for businesses.</p>
            </div>
          </div>

          <nav className="post-pager" aria-label="More articles">
            {older ? (
              <Link to={`/blog/${older.slug}`}><small><ArrowLeft size={12} aria-hidden="true" /> Previous</small>{older.title}</Link>
            ) : <span />}
            {newer ? (
              <Link to={`/blog/${newer.slug}`} className="is-next"><small>Next <ArrowRight size={12} aria-hidden="true" /></small>{newer.title}</Link>
            ) : <span />}
          </nav>
        </article>

        {/* sticky contents + progress */}
        {sections.length > 0 && (
          <aside className="post-aside" aria-label="Contents">
            <p className="post-label">Contents</p>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={current === s.id ? "is-active" : ""} aria-current={current === s.id ? "location" : undefined}>{s.heading}</a>
                </li>
              ))}
            </ol>
            <div className="post-progress-card">
              <div className="post-ring" aria-hidden="true" style={{ "--p": `${percent}%` } as CSSProperties}>
                <span>{percent}%</span>
              </div>
              <p>{finished ? "You've finished reading" : `About ${left} min left`}</p>
            </div>
          </aside>
        )}
      </div>

      {/* NEWSLETTER */}
      <section className="post-news">
        <div className="container">
          <div className="post-news__card">
            <div className="post-news__copy">
              <span className="post-news__icon" aria-hidden="true"><Mail size={22} /></span>
              <div>
                <p className="eyebrow eyebrow--light"><span />Stay in the loop</p>
                <h2><span>Get new articles </span><em>in your inbox</em></h2>
                <p>One practical email when we publish something new. No spam.</p>
              </div>
            </div>
            {newsletter.status === "done" ? (
              <p className="post-news__ok" role="status"><Check size={18} aria-hidden="true" />{newsletter.message}</p>
            ) : (
              <form className="post-news__form" onSubmit={(event) => void newsletter.submit(event)}>
                <div className={`post-news__field${newsletter.status === "error" ? " is-error" : ""}`}>
                  <Mail size={16} aria-hidden="true" />
                  <input
                    type="email" placeholder="Enter your email address" aria-label="Email address" autoComplete="email"
                    value={newsletter.email} maxLength={255} required aria-invalid={newsletter.status === "error"}
                    aria-describedby={newsletter.status === "error" ? "post-news-err" : undefined}
                    onChange={(e) => newsletter.onChange(e.target.value)}
                  />
                  <button type="submit" disabled={newsletter.busy}>
                    {newsletter.busy ? "Subscribing…" : <>Subscribe <ArrowRight size={15} aria-hidden="true" /></>}
                  </button>
                </div>
                {newsletter.status === "error" && <small id="post-news-err" role="alert">{newsletter.message}</small>}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="post-related">
          <div className="container">
            <div className="post-related__head">
              <div>
                <p className="eyebrow"><span />Explore More</p>
                <h2><span>Keep </span><em>reading</em></h2>
              </div>
              <Link to="/blog" className="blog-more">All articles <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
            <div className="blog-grid">
              {related.map((p) => (
                <article className="blog-card" key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="blog-card__media" tabIndex={-1} aria-hidden="true">
                    <span className="blog-img is-ready">{p.image && <img src={p.image} alt="" loading="lazy" />}</span>
                  </Link>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span className="blog-tag">{p.category}</span>
                      <span className="blog-date"><Clock size={12} aria-hidden="true" />{p.readTime} min read</span>
                    </div>
                    <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
                    <p>{p.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FLOATING READER TOOLBAR */}
      <div className={`post-pill${showPill ? " is-visible" : ""}`} role="toolbar" aria-label="Reading tools" aria-hidden={!showPill}>
        <span className="post-pill__time"><Clock size={13} aria-hidden="true" />{finished ? "Done" : `${left} min left`}</span>
        <span className="post-pill__bar" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span>
        <button type="button" onClick={() => changeFont(fs - 1)} disabled={fs === 0} aria-label="Decrease text size" title="Smaller font (A-)">A−</button>
        <button type="button" onClick={() => changeFont(fs + 1)} disabled={fs === FONT_SIZES.length - 1} aria-label="Increase text size" title="Larger font (A+)">A+</button>
        <button type="button" onClick={share} aria-label={canShare ? "Share article" : "Copy link"} title={canShare ? "Share article" : "Copy link"}><Share2 size={15} /></button>
        <button type="button" onClick={toggleSave} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save for later"} title={saved ? "Saved to bookmarks" : "Save for later"}>
          {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" })} aria-label="Back to top" title="Scroll to top"><ArrowUp size={15} /></button>
      </div>

      <div className="sr-only" aria-live="polite">{copied ? "Link copied to clipboard" : ""}</div>
      {copied && <div className="post-toast" aria-hidden="true"><Check size={14} /> Link copied</div>}
    </div>
  );
}
