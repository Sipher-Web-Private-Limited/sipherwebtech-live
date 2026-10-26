import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight, Bookmark, BookmarkCheck, Briefcase, Calendar, ChevronLeft, ChevronRight, Clock,
  Code2, Cpu, Mail, Megaphone, Palette, Search, Send, ShoppingCart, X,
} from "lucide-react";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";
import { useNewsletterSignup } from "../content/useNewsletterSignup";
import { formatContentDate, useContentLibrary, type BlogPost } from "../content/contentLibrary";
import "../styles/blog.css";

const PAGE_SIZE = 9;
type Sort = "newest" | "popular" | "oldest";
const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "oldest", label: "Oldest first" },
];
const ICONS: Record<string, typeof Code2> = {
  "Web Development": Code2, "Digital Marketing": Megaphone, Design: Palette,
  Technology: Cpu, Business: Briefcase, "E-Commerce": ShoppingCart,
};

/* ---------- small helpers ---------- */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    <>
      {text.split(new RegExp(`(${safe})`, "i")).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

function Thumb({ src, alt = "", priority = false }: { src: string | null; alt?: string; priority?: boolean }) {
  const [state, setState] = useState<"loading" | "ready" | "error">(src ? "loading" : "error");
  return (
    <span className={`blog-img is-${state}`}>
      {src && state !== "error" && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
        />
      )}
    </span>
  );
}

function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem("sw-saved-posts") || "[]")); } catch { /* storage unavailable */ }
  }, []);
  const toggle = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try { localStorage.setItem("sw-saved-posts", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);
  return { saved, toggle };
}

function SaveButton({ slug, saved, onToggle }: { slug: string; saved: boolean; onToggle: (s: string) => void }) {
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <button
      type="button"
      className={`blog-save${saved ? " is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved articles" : "Save article for later"}
      onClick={() => onToggle(slug)}
    >
      <Icon size={16} />
    </button>
  );
}

/* ---------- page ---------- */
export default function BlogPage() {
  const { companyProfile } = useCmsContent();
  const { items: posts, loading, error } = useContentLibrary<BlogPost>("blog");
  const newsletter = useNewsletterSignup();
  const [params, setParams] = useSearchParams();
  const { saved, toggle } = useSaved();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const rawCategory = params.get("category");
  const categories = useMemo(() => [...new Set(posts.map((post) => post.category).filter(Boolean))], [posts]);
  const category = categories.includes(rawCategory ?? "") ? rawCategory! : "All";
  const q = (params.get("q") ?? "").trim();
  const sort: Sort = (["newest", "popular", "oldest"] as const).includes(params.get("sort") as Sort) ? (params.get("sort") as Sort) : "newest";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const update = useCallback((next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    if (!("page" in next)) p.delete("page");
    setParams(p, { replace: true });
  }, [params, setParams]);

  /* debounced search that stays in sync with the URL */
  const [term, setTerm] = useState(q);
  useEffect(() => setTerm(q), [q]);
  useEffect(() => {
    if (term.trim() === q) return;
    const t = setTimeout(() => update({ q: term.trim() || null }), 250);
    return () => clearTimeout(t);
  }, [term, q, update]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    posts.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    const list = posts.filter(
      (p) => (category === "All" || p.category === category) &&
        (!needle || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(needle)),
    );
    return [...list].sort((a, b) =>
      sort === "popular" ? b.views - a.views : sort === "oldest" ? +new Date(a.date) - +new Date(b.date) : +new Date(b.date) - +new Date(a.date));
  }, [category, posts, q, sort]);

  const featured: BlogPost | undefined =
    page === 1 && category === "All" && !q && sort === "newest" ? posts.find((p) => p.featured) : undefined;
  const list = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const popular = useMemo(() => [...posts].sort((a, b) => b.views - a.views).slice(0, 5), [posts]);
  const hasFilters = category !== "All" || !!q || sort !== "newest";

  const goPage = (n: number) => {
    update({ page: n > 1 ? String(n) : null });
    toolbarRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  const clearAll = () => { setTerm(""); setParams(new URLSearchParams(), { replace: true }); };

  return (
    <>
      <Seo
        title={`Blog | ${companyProfile.brandName}`}
        description="Insights, ideas and practical tips on web development, digital marketing, design and technology."
      />

      {/* HERO */}
      <section className="blog-hero">
        <div className="blog-hero__bg" aria-hidden="true" />
        <div className="container blog-hero__content">
          <p className="eyebrow"><span />Our Blog</p>
          <h1>Insights, Ideas &amp;<br /><em>Digital Growth</em></h1>
          <p className="blog-hero__copy">
            Stay updated with the latest trends, tips and insights in web development, digital marketing,
            design and technology. Explore our blog and grow with us.
          </p>
        </div>
      </section>

      <section className="blog-main">
        {/* TOOLBAR */}
        <div className="blog-toolbar" ref={toolbarRef}>
          <div className="container blog-toolbar__inner">
            <div className="blog-filters" role="group" aria-label="Filter posts by category">
              {(["All", ...categories]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  className={`blog-chip${category === c ? " is-active" : ""}`}
                  onClick={() => update({ category: c === "All" ? null : c })}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="blog-sort">
              <span className="sr-only">Sort articles</span>
              <select value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="container blog-layout">
          <div className="blog-feed">
            <div className="blog-status" aria-live="polite">
              <p>
                <strong>{filtered.length}</strong> {filtered.length === 1 ? "article" : "articles"}
                {category !== "All" && <> in <strong>{category}</strong></>}
                {q && <> for “<strong>{q}</strong>”</>}
              </p>
              {hasFilters && (
                <button type="button" className="blog-clear" onClick={clearAll}><X size={13} /> Clear filters</button>
              )}
            </div>

            {/* FEATURED */}
            {featured && (
              <article className="blog-featured">
                <Link to={`/blog/${featured.slug}`} className="blog-featured__media" tabIndex={-1} aria-hidden="true">
                  <Thumb src={featured.image} priority />
                  <span className="blog-featured__badge">Featured</span>
                </Link>
                <div className="blog-featured__body">
                  <div className="blog-card__meta">
                    <span className="blog-tag">{featured.category}</span>
                    <span className="blog-date"><Clock size={12} />{featured.readTime} min read</span>
                  </div>
                  <h2><Link to={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
                  <p>{featured.excerpt}</p>
                  <div className="blog-featured__foot">
                    <span className="blog-author"><i>{companyProfile.brandName.slice(0, 2).toUpperCase()}</i>{featured.authorName || companyProfile.brandName} · {formatContentDate(featured.date)}</span>
                    <Link to={`/blog/${featured.slug}`} className="blog-more">Read article <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </article>
            )}

            {/* GRID */}
            {loading ? (
              <div className="blog-empty"><p>Loading articles…</p></div>
            ) : error ? (
              <div className="blog-empty" role="alert"><h3>Articles could not be loaded</h3><p>{error}</p></div>
            ) : visible.length === 0 ? (
              <div className="blog-empty">
                <Search size={32} />
                <h3>{posts.length ? "No articles match your search" : "No articles published yet"}</h3>
                <p>{posts.length ? "Check the spelling, try a broader keyword or browse another category." : "New articles will appear here when they are published."}</p>
                {posts.length > 0 && <button type="button" className="blog-chip is-active" onClick={clearAll}>Show all articles</button>}
              </div>
            ) : (
              <div className="blog-grid">
                {visible.map((post) => (
                  <article className="blog-card" key={post.slug}>
                    <Link to={`/blog/${post.slug}`} className="blog-card__media" tabIndex={-1} aria-hidden="true">
                      <Thumb src={post.image} />
                    </Link>
                    <SaveButton slug={post.slug} saved={saved.includes(post.slug)} onToggle={toggle} />
                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        <span className="blog-tag">{post.category}</span>
                        <span className="blog-date"><Clock size={12} />{post.readTime} min read</span>
                      </div>
                      <h3><Link to={`/blog/${post.slug}`}><Highlight text={post.title} q={q} /></Link></h3>
                      <p><Highlight text={post.excerpt} q={q} /></p>
                      <div className="blog-card__foot">
                        <span className="blog-date"><Calendar size={12} />{formatContentDate(post.date)}</span>
                        <Link to={`/blog/${post.slug}`} className="blog-more" aria-label={`Read more: ${post.title}`}>
                          Read More <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {pages > 1 && (
              <nav className="blog-pagination" aria-label="Blog pages">
                <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => goPage(current - 1)}><ChevronLeft size={16} /></button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button" className={n === current ? "is-active" : ""} aria-current={n === current ? "page" : undefined} onClick={() => goPage(n)}>{n}</button>
                ))}
                <button type="button" aria-label="Next page" disabled={current === pages} onClick={() => goPage(current + 1)}><ChevronRight size={16} /></button>
              </nav>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="blog-sidebar">
            <label className="blog-search">
              <Search size={16} />
              <input type="search" placeholder="Search blogs..." value={term} onChange={(e) => setTerm(e.target.value)} aria-label="Search blogs" />
              {term && <button type="button" aria-label="Clear search" onClick={() => setTerm("")}><X size={14} /></button>}
            </label>

            <div className="blog-widget">
              <h4>Popular Posts</h4>
              <ul className="blog-popular">
                {popular.map((p, i) => (
                  <li key={p.slug}>
                    <span className="blog-popular__no">{i + 1}</span>
                    <Link to={`/blog/${p.slug}`} className="blog-popular__thumb" tabIndex={-1} aria-hidden="true"><Thumb src={p.image} /></Link>
                    <div>
                      <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                      <small><Calendar size={11} />{formatContentDate(p.date)}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="blog-widget">
              <h4>Categories</h4>
              <ul className="blog-cats">
                {categories.map((name) => {
                  const Icon = ICONS[name] ?? Code2;
                  return (
                    <li key={name}>
                      <button type="button" className={category === name ? "is-active" : ""} onClick={() => update({ category: name })}>
                        <Icon size={15} /><span>{name}</span><b>{counts.get(name) ?? 0}</b>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {saved.length > 0 && (
              <div className="blog-widget">
                <h4>Saved for later</h4>
                <ul className="blog-saved">
                  {posts.filter((p) => saved.includes(p.slug)).map((p) => (
                    <li key={p.slug}><Link to={`/blog/${p.slug}`}>{p.title}</Link></li>
                  ))}
                </ul>
              </div>
            )}

            <div className="blog-newsletter">
              <Mail size={26} />
              <h4>Subscribe to Our Newsletter</h4>
              <p>Get the latest articles, news and insights delivered to your inbox.</p>
              {newsletter.status === "done" ? (
                <p className="blog-newsletter__ok" role="status">{newsletter.message}</p>
              ) : (
                <form onSubmit={(event) => void newsletter.submit(event)}>
                  <input
                    type="email" placeholder="Your email address" value={newsletter.email} maxLength={255} required aria-label="Email address"
                    aria-invalid={newsletter.status === "error"} aria-describedby={newsletter.status === "error" ? "news-err" : undefined}
                    onChange={(e) => newsletter.onChange(e.target.value)}
                  />
                  {newsletter.status === "error" && <small id="news-err" role="alert">{newsletter.message}</small>}
                  <button type="submit" disabled={newsletter.busy}>{newsletter.busy ? "Subscribing…" : "Subscribe"}</button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="blog-cta-wrap">
        <div className="container">
          <Reveal className="blog-cta">
            <Send size={34} />
            <div>
              <h2>Have a Project in Mind?</h2>
              <p>Let's turn your ideas into powerful digital solutions. Get in touch with our team today.</p>
            </div>
            <Button to="/contact">Get a Free Consultation</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}