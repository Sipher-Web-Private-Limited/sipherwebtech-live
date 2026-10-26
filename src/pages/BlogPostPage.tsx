import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUp, Bookmark, BookmarkCheck, Calendar, Check, Clock,
  Link2, MessageCircle, Send, ThumbsDown, ThumbsUp,
} from "lucide-react";
import Seo from "../components/Seo";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useNewsletterSignup } from "../content/useNewsletterSignup";
import { formatContentDate, useContentLibrary, type BlogPost } from "../content/contentLibrary";
import "../styles/blog.css";
import "../styles/blog-post.css";

const FONT_SIZES = [17, 19, 21];
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const readStore = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const writeStore = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } };

export default function BlogPostPage() {
  const { slug } = useParams();
  const { companyProfile } = useCmsContent();
  const { items: posts, loading, error } = useContentLibrary<BlogPost>("blog");
  const post = posts.find((item) => item.slug === slug);
  const sections = Array.isArray(post?.sections) ? post.sections : [];

  const heroRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [showPill, setShowPill] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const [fs, setFs] = useState(1);
  const [saved, setSaved] = useState(false);
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const newsletter = useNewsletterSignup();

  /* restore preferences */
  useEffect(() => {
    setFs(readStore("sw-post-fs", 1));
  }, []);
  useEffect(() => {
    if (post) setSaved(readStore<string[]>("sw-saved-posts", []).includes(post.slug));
    setVote(null);
  }, [post]);

  /* scroll: reading progress, floating pill, hero parallax */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const el = articleRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.45 - r.top) / r.height)));
      }
      setShowPill(y > 460);
      if (!reduceMotion()) heroRef.current?.style.setProperty("--py", `${Math.min(y, 700) * 0.2}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [post]);

  /* active section for the table of contents */
  useEffect(() => {
    if (!post) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)), { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [post, sections]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const changeFont = (n: number) => { const v = Math.min(2, Math.max(0, n)); setFs(v); writeStore("sw-post-fs", v); };
  const toggleSave = useCallback(() => {
    if (!post) return;
    const list = readStore<string[]>("sw-saved-posts", []);
    const next = list.includes(post.slug) ? list.filter((s) => s !== post.slug) : [...list, post.slug];
    writeStore("sw-saved-posts", next);
    setSaved(next.includes(post.slug));
  }, [post]);

  if (!post && loading) {
    return <section className="post-missing container"><p>Loading article…</p></section>;
  }

  if (!post) {
    return (
      <section className="post-missing container">
        <Seo title={`Article not found | ${companyProfile.brandName}`} description="This article could not be found." />
        <h1>Article not found</h1>
        <p>{error || "The article may have been moved or removed. Browse all published posts instead."}</p>
        <Button to="/blog">Back to blog</Button>
      </section>
    );
  }
  const authorName = post.authorName || companyProfile.brandName;
  const authorRole = post.authorRole || "Editorial";
  const authorInitials = authorName.slice(0, 2).toUpperCase();

  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent(url);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* clipboard blocked */ }
  };

  const words = post.title.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  const readTime = Number.isFinite(post.readTime) && post.readTime > 0 ? post.readTime : 1;
  const left = Math.max(1, Math.ceil(readTime * (1 - progress)));
  const percent = Math.round(progress * 100);

  const related = posts.filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category) || b.views - a.views)
    .slice(0, 3);
  const idx = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[idx - 1];
  const older = posts[idx + 1];

  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt,
    image: post.image, datePublished: post.date,
    author: { "@type": "Organization", name: authorName },
    publisher: { "@type": "Organization", name: companyProfile.brandName },
  };

  return (
    <>
      <Seo title={`${post.title} | ${companyProfile.brandName}`} description={post.excerpt} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="post-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>

      {/* IMMERSIVE HERO */}
      <header className="post-hero" ref={heroRef}>
        {post.image && <img className="post-hero__img" src={post.image} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />}
        <div className="post-hero__shade" aria-hidden="true" />
        <div className="post-hero__ring" aria-hidden="true" />
        <div className="container post-hero__inner">
          <nav className="post-crumbs" aria-label="Breadcrumb">
            <Link to="/blog"><ArrowLeft size={14} /> Blog</Link><span>/</span><span>{post.category}</span>
          </nav>
          <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="post-hero__tag">{post.category}</Link>
          <h1>{head} <em>{tail}</em></h1>
          <p className="post-hero__lead">{post.excerpt}</p>
          <div className="post-hero__meta">
            <span className="post-chip post-chip--author"><i>{authorInitials}</i>{authorName}</span>
            <span className="post-chip"><Calendar size={13} />{formatContentDate(post.date)}</span>
            <span className="post-chip"><Clock size={13} />{readTime} min read</span>
          </div>
        </div>
      </header>

      {/* TAKEAWAYS CARD overlapping the hero */}
      <div className="container post-takeaways-wrap">
        <div className="post-takeaways">
          <p className="post-label">What you'll learn</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}><b>{String(i + 1).padStart(2, "0")}</b><span>{s.heading}</span></a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="container post-layout">
        {/* left share rail */}
        <div className="post-rail" aria-label="Share this article">
          <button type="button" onClick={copy} aria-label="Copy link">{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
          <a href={`https://wa.me/?text=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"><MessageCircle size={16} /></a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">in</a>
          <a href={`https://twitter.com/intent/tweet?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">X</a>
          <button type="button" onClick={toggleSave} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save for later"} className={saved ? "is-on" : ""}>
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <article className="post-content" ref={articleRef} style={{ "--fs": `${FONT_SIZES[fs]}px` } as CSSProperties}>
          <details className="post-toc-mobile">
            <summary>In this article</summary>
            <ol>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>)}</ol>
          </details>

          {sections.map((s, i) => (
            <section key={s.id} className="post-section">
              <span className="post-section__no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h2 id={s.id}>{s.heading}</h2>
              {s.body.map((para, j) => <p key={j} className={i === 0 && j === 0 ? "has-dropcap" : undefined}>{para}</p>)}

              {i === 0 && (
                <blockquote className="post-quote">
                  <span aria-hidden="true">“</span>
                  {post.excerpt}
                </blockquote>
              )}

              {i === 1 && (
                <aside className="post-inline-cta">
                  <Send size={22} />
                  <div>
                    <strong>Want this done for your business?</strong>
                    <span>Tell us your goal and we'll suggest the simplest way to reach it.</span>
                  </div>
                  <Button to="/contact">Free consultation</Button>
                </aside>
              )}
            </section>
          ))}

          {/* feedback */}
          <div className="post-vote" role="group" aria-label="Was this article helpful?">
            {vote ? (
              <p role="status"><Check size={16} /> {vote === "yes" ? "Glad it helped. Share it with someone who needs it." : "Thanks for the feedback. We'll keep improving."}</p>
            ) : (
              <>
                <p>Was this article helpful?</p>
                <button type="button" onClick={() => setVote("yes")}><ThumbsUp size={15} /> Yes</button>
                <button type="button" onClick={() => setVote("no")}><ThumbsDown size={15} /> Not really</button>
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
            <i>{authorInitials}</i>
            <div>
              <small>Written by</small>
              <strong>{authorName}</strong>
              <span>{authorRole}</span>
              <p>Practical notes from the people who design, build and support websites, ERP systems and digital growth for businesses.</p>
            </div>
          </div>

          <nav className="post-pager" aria-label="More articles">
            {older ? <Link to={`/blog/${older.slug}`}><small><ArrowLeft size={12} /> Previous</small>{older.title}</Link> : <span />}
            {newer ? <Link to={`/blog/${newer.slug}`} className="is-next"><small>Next <ArrowRight size={12} /></small>{newer.title}</Link> : <span />}
          </nav>
        </article>

        {/* right sticky TOC */}
        <aside className="post-aside">
          <p className="post-label">Contents</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={activeId === s.id ? "is-active" : ""}><b>{String(i + 1).padStart(2, "0")}</b>{s.heading}</a>
              </li>
            ))}
          </ol>
          <div className="post-ring" aria-hidden="true" style={{ "--p": `${percent}%` } as CSSProperties}>
            <span>{percent}%</span>
          </div>
          <p className="post-aside__left">{percent >= 98 ? "You've finished reading" : `About ${left} min left`}</p>
        </aside>
      </div>

      {/* NEWSLETTER */}
      <section className="post-news">
        <div className="container post-news__inner">
          <div>
            <p className="post-label post-label--light">Stay in the loop</p>
            <h2>Get new articles <em>in your inbox</em></h2>
            <p>One practical email when we publish something new. No spam.</p>
          </div>
          {newsletter.status === "done" ? (
            <p className="post-news__ok" role="status">{newsletter.message}</p>
          ) : (
            <form onSubmit={(event) => void newsletter.submit(event)}>
              <input
                type="email" placeholder="Your email address" aria-label="Email address" value={newsletter.email}
                maxLength={255} required aria-invalid={newsletter.status === "error"}
                aria-describedby={newsletter.status === "error" ? "post-news-err" : undefined}
                onChange={(e) => newsletter.onChange(e.target.value)}
              />
              <button type="submit" disabled={newsletter.busy}>{newsletter.busy ? "Subscribing…" : "Subscribe"}</button>
              {newsletter.status === "error" && <small id="post-news-err" role="alert">{newsletter.message}</small>}
            </form>
          )}
        </div>
      </section>

      {/* RELATED */}
      <section className="post-related">
        <div className="container">
          <div className="post-related__head">
            <h2>Keep <em>reading</em></h2>
            <Link to="/blog" className="blog-more">All articles <ArrowRight size={14} /></Link>
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
                    <span className="blog-date"><Clock size={12} />{p.readTime} min read</span>
                  </div>
                  <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
                  <p>{p.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING READER PILL */}
      <div className={`post-pill${showPill ? " is-visible" : ""}`} role="toolbar" aria-label="Reading tools">
        <span className="post-pill__time"><Clock size={13} />{percent >= 98 ? "Done" : `${left} min left`}</span>
        <span className="post-pill__bar" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span>
        <button type="button" onClick={() => changeFont(fs - 1)} disabled={fs === 0} aria-label="Decrease text size">A−</button>
        <button type="button" onClick={() => changeFont(fs + 1)} disabled={fs === 2} aria-label="Increase text size">A+</button>
        <button type="button" onClick={toggleSave} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save for later"}>
          {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" })} aria-label="Back to top"><ArrowUp size={15} /></button>
      </div>
      <div className="sr-only" aria-live="polite">{copied ? "Link copied to clipboard" : ""}</div>
      {copied && <div className="post-toast" aria-hidden="true"><Check size={14} /> Link copied</div>}
    </>
  );
}