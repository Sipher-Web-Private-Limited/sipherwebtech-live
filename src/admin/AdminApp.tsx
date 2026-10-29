import {
  ArrowUpRight,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleHelp,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileDown,
  FileText,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { cmsApiBase } from "../content/cmsApi";
import { useCmsContent } from "../content/CmsContentProvider";
import "./admin.css";

type AdminUser = { id: number; name: string; email: string };
type CmsProfile = {
  id: number;
  name: string;
  brand_name: string;
  logo_path: string | null;
  favicon_path: string | null;
  loader_image_path: string | null;
  brochure_path: string | null;
  brochure_name: string | null;
  brochure_enabled: boolean;
  external_leads_enabled: boolean;
  external_leads_url: string | null;
  external_leads_key: string | null;
  tagline: string | null;
  website: string | null;
  email: string;
  phone_country_code: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  business_hours: string | null;
  address: string | null;
  location_label: string | null;
  map_location_url: string | null;
  map_directions_url: string | null;
  latitude: number | null;
  longitude: number | null;
  socials: { label: string; icon: string; href: string }[];
  about_content: Record<string, string>;
  approved_clients?: string[];
};
type Category = {
  id: number;
  name: string;
  slug: string;
  number: string | null;
  statement: string | null;
  description: string | null;
  icon: string | null;
  image_path: string | null;
  sort_order: number;
  is_published: boolean;
  services_count: number;
};
type Service = {
  id: number;
  service_category_id: number;
  title: string;
  slug: string;
  description: string | null;
  intro: string | null;
  icon: string | null;
  hero_image: string | null;
  capabilities: string[];
  deliverables: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  sort_order: number;
  is_published: boolean;
  category?: Category;
};
type Person = {
  id: number;
  profile_type: "team" | "leadership";
  slug: string;
  name: string;
  role: string;
  photo: string | null;
  details: string | null;
  message_title: string | null;
  message: string | null;
  bio: string | null;
  sort_order: number;
  is_published: boolean;
};
type ContactEnquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string | null;
  message: string;
  created_at: string;
};
type NewsletterSubscriber = {
  id: number;
  email: string;
  created_at: string;
};
type CmsLibraryItem = {
  id: number;
  type: "blog" | "portfolio" | "product" | "career";
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  image_path: string | null;
  content: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
};
type Section = "overview" | "profile" | "categories" | "services" | "people" | "careers" | "library" | "enquiries" | "subscribers" | "cache" | "account";
type Envelope<T> = { data: T };
type AdminPayload = Record<string, unknown> | FormData;

const sectionMeta: Record<Section, { label: string; eyebrow: string; title: string; description: string }> = {
  overview: { label: "Overview", eyebrow: "WORKSPACE", title: "Your website at a glance", description: "Your digital presence, thoughtfully managed." },
  profile: { label: "Company profile", eyebrow: "FOUNDATION", title: "Company profile", description: "Keep your brand, contact details and About-page story up to date." },
  categories: { label: "Service categories", eyebrow: "OFFERINGS", title: "Service categories", description: "Organize and publish the ways your team creates value." },
  services: { label: "Services", eyebrow: "OFFERINGS", title: "Services", description: "Shape each service page, from the first introduction to the final FAQ." },
  people: { label: "Team & leadership", eyebrow: "PEOPLE", title: "Team & leadership", description: "Introduce the people and leaders behind your work." },
  careers: { label: "Careers & Jobs", eyebrow: "RECRUITMENT", title: "Career opportunities", description: "Publish and manage open job positions, requirements, and applications." },
  library: { label: "Content library", eyebrow: "PUBLISHING", title: "Content library", description: "Manage published articles, portfolio work and product solutions." },
  enquiries: { label: "Contact enquiries", eyebrow: "INBOX", title: "Contact enquiries", description: "Review project enquiries submitted through your public contact form." },
  subscribers: { label: "Newsletter subscribers", eyebrow: "AUDIENCE", title: "Newsletter subscribers", description: "Review email addresses submitted through the public newsletter form." },
  cache: { label: "Public site cache", eyebrow: "PERFORMANCE", title: "Public site cache", description: "Keep public pages and CMS content fresh without clearing unrelated application data." },
  account: { label: "Account settings", eyebrow: "SECURITY", title: "Account settings", description: "Update the name, email and password you use to sign in." },
};

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Company profile", icon: Building2 },
  { id: "categories", label: "Service categories", icon: Boxes },
  { id: "services", label: "Services", icon: BriefcaseBusiness },
  { id: "people", label: "Team & leadership", icon: UsersRound },
  { id: "careers", label: "Careers & Jobs", icon: BriefcaseBusiness },
  { id: "library", label: "Content library", icon: Sparkles },
  { id: "enquiries", label: "Contact enquiries", icon: Mail },
  { id: "subscribers", label: "Newsletter subscribers", icon: Mail },
  { id: "cache", label: "Public site cache", icon: RotateCcw },
  { id: "account", label: "Account settings", icon: KeyRound },
];

function sectionFromPathname(pathname: string): Section {
  const segment = pathname.split("/").filter(Boolean).at(1);
  return navItems.find(({ id }) => id === segment)?.id ?? "overview";
}

const API_BASE = cmsApiBase;
const fallbackLogo = "/images/logo/sw_logo.png";

class AdminApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function readCsrfToken(): string {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="))
    ?.slice("XSRF-TOKEN=".length);

  return cookie ? decodeURIComponent(cookie) : "";
}

async function refreshCsrfCookie(): Promise<void> {
  if (!API_BASE) throw new AdminApiError("Set VITE_CMS_API_URL to your Laravel API URL.", 0);

  const response = await fetch(`${new URL(API_BASE, window.location.origin).origin}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new AdminApiError(`Could not start a secure session (HTTP ${response.status}).`, response.status);
  }
}

async function apiRequest<T>(
  path: string,
  options: { method?: string; data?: AdminPayload | FormData } = {},
): Promise<T> {
  if (!API_BASE) throw new AdminApiError("Set VITE_CMS_API_URL to your Laravel API URL.", 0);

  const method = options.method ?? "GET";
  const headers = new Headers({ Accept: "application/json", "X-Requested-With": "XMLHttpRequest" });
  let body: BodyInit | undefined;

  if (options.data instanceof FormData) {
    body = options.data;
  } else if (options.data !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.data);
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    if (!readCsrfToken()) await refreshCsrfCookie();
    const csrf = readCsrfToken();
    if (csrf) headers.set("X-XSRF-TOKEN", csrf);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    method,
    headers,
    body,
    credentials: "include",
  });
  const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const fieldErrors = isRecord(payload) && isRecord(payload.errors)
      ? Object.values(payload.errors).find((value) => Array.isArray(value) && value.length > 0)
      : undefined;
    const fieldMessage = Array.isArray(fieldErrors) && typeof fieldErrors[0] === "string"
      ? fieldErrors[0]
      : null;
    const message = isRecord(payload) && typeof payload.message === "string"
      ? fieldMessage ?? payload.message
      : fieldMessage ?? `The request failed (HTTP ${response.status}).`;
    throw new AdminApiError(message, response.status);
  }

  return payload as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap<T>(payload: Envelope<T>): T {
  return payload.data;
}

function makeFormData(data: Record<string, unknown>, fileKey: string | null, file?: File, methodOverride?: string): FormData {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      form.append(key, "");
    } else if (typeof value === "object") {
      form.append(key, JSON.stringify(value));
    } else if (typeof value === "boolean") {
      form.append(key, value ? "1" : "0");
    } else {
      form.append(key, String(value));
    }
  });
  if (file && fileKey) form.append(fileKey, file);
  if (methodOverride) form.append("_method", methodOverride);
  return form;
}

function linesToArray(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function arrayToLines(value: string[] | null | undefined): string {
  return (value ?? []).join("\n");
}

function emptyProfile(): CmsProfile {
  return {
    id: 0, name: "", brand_name: "", logo_path: null, favicon_path: null, loader_image_path: null,
    brochure_path: null, brochure_name: null, brochure_enabled: true,
    external_leads_enabled: false, external_leads_url: "", external_leads_key: "",
    tagline: "", website: "", email: "",
    phone_country_code: "", phone_number: "", whatsapp_number: "", business_hours: "", address: "",
    location_label: "", map_location_url: "", map_directions_url: "", latitude: null,
    longitude: null, socials: [], about_content: {},
  };
}

export default function AdminApp() {
  const location = useLocation();
  const isLogin = location.pathname === "/admin/login/auth";
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const handleSignedOut = useCallback(() => {
    setUser(null);
    navigate("/admin/login/auth", { replace: true });
  }, [navigate]);

  useEffect(() => {
    let active = true;
    if (!API_BASE) {
      setChecking(false);
      return () => { active = false; };
    }
    apiRequest<Envelope<{ user: AdminUser }>>("/admin/me")
      .then((result) => { if (active) setUser(result.data.user); })
      .catch((error: unknown) => {
        if (active && !(error instanceof AdminApiError && error.status === 401)) {
          setAuthError(error instanceof Error ? error.message : "Could not connect to the CMS.");
        }
      })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    try {
      await refreshCsrfCookie();
      const result = await apiRequest<Envelope<{ user: AdminUser }>>("/admin/login", {
        method: "POST",
        data: { email: loginEmail, password: loginPassword, remember },
      });
      setUser(result.data.user);
      setLoginPassword("");
      navigate("/admin/overview", { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  if (checking) return <div className="cms-admin-loading"><LoaderCircle className="spin" /> Checking secure session…</div>;
  if (isLogin && user) return <Navigate to="/admin" replace />;
  if (!isLogin && !user) return <Navigate to="/admin/login/auth" replace />;

  if (isLogin) {
    return (
      <main className="cms-login">
        <div className="cms-login-glow" />
        <Link className="cms-login-brand" to="/"><span className="cms-brand-mark">S</span><span>Sipher Web<span className="cms-brand-light"> &nbsp;Pvt Ltd</span><small>CONTENT WORKSPACE</small></span></Link>
        <section className="cms-login-card">
          <span className="cms-login-icon"><ShieldCheck size={21} /></span>
          <p className="cms-eyebrow">ADMIN SIGN IN</p>
          <h1>Welcome back.</h1>
          <p className="cms-muted">Sign in to manage the content that shapes your website.</p>
          {authError && <div className="cms-alert error" role="alert">{authError}</div>}
          {!API_BASE && <div className="cms-alert error" role="alert">Set <code>VITE_CMS_API_URL</code> and restart the frontend dev server.</div>}
          <form onSubmit={handleLogin} className="cms-form-stack">
            <label>Email address<input type="email" autoComplete="username" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required autoFocus /></label>
            <label>Password<input type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required /></label>
            <label className="cms-check"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Keep me signed in</label>
            <button className="cms-button primary wide" disabled={busy || !API_BASE}>{busy ? <LoaderCircle className="spin" size={17} /> : null} Sign in securely <ArrowUpRight size={17} /></button>
          </form>
          <div className="cms-login-foot"><ShieldCheck size={14} /> Protected workspace · Admin accounts only</div>
        </section>
        <p className="cms-login-copyright">© {new Date().getFullYear()} Sipher Web · Your content, your craft.</p>
      </main>
    );
  }

  return <AdminDashboard user={user!} onSignedOut={handleSignedOut} />;
}

function AdminDashboard({ user, onSignedOut }: { user: AdminUser; onSignedOut: () => void }) {
  const { refreshContent } = useCmsContent();
  const location = useLocation();
  const navigate = useNavigate();
  const onSignedOutRef = useRef(onSignedOut);
  onSignedOutRef.current = onSignedOut;
  const [accountUser, setAccountUser] = useState(user);
  const section = sectionFromPathname(location.pathname);
  const [profile, setProfile] = useState<CmsProfile>(emptyProfile());
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [libraryItems, setLibraryItems] = useState<CmsLibraryItem[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [enquiryError, setEnquiryError] = useState("");
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [newsletterError, setNewsletterError] = useState("");
  const [loadingNewsletterSubscribers, setLoadingNewsletterSubscribers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [clearingPublicCache, setClearingPublicCache] = useState(false);
  const [modal, setModal] = useState<{ type: "category" | "service" | "person"; record?: Category | Service | Person; startInEdit?: boolean } | null>(null);
  const [enquiryModal, setEnquiryModal] = useState<{ record: ContactEnquiry; isEditing: boolean } | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setLoadingEnquiries(true);
    setEnquiryError("");
    try {
      const response = await apiRequest<Envelope<ContactEnquiry[]>>("/admin/contact-enquiries");
      setEnquiries(unwrap(response));
    } catch (cause) {
      if (cause instanceof AdminApiError && cause.status === 401) {
        onSignedOutRef.current();
        return;
      }
      setEnquiryError(cause instanceof Error ? cause.message : "The enquiry inbox could not be loaded.");
    } finally {
      setLoadingEnquiries(false);
    }
  }, []);

  const loadNewsletterSubscribers = useCallback(async () => {
    setLoadingNewsletterSubscribers(true);
    setNewsletterError("");
    try {
      const response = await apiRequest<Envelope<NewsletterSubscriber[]>>("/admin/newsletter-subscribers");
      setNewsletterSubscribers(unwrap(response));
    } catch (cause) {
      if (cause instanceof AdminApiError && cause.status === 401) {
        onSignedOutRef.current();
        return;
      }
      setNewsletterError(cause instanceof Error ? cause.message : "The newsletter subscriber list could not be loaded.");
    } finally {
      setLoadingNewsletterSubscribers(false);
    }
  }, []);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileResponse, categoryResponse, serviceResponse, peopleResponse, libraryResponse] = await Promise.all([
        apiRequest<Envelope<CmsProfile>>("/admin/profile"),
        apiRequest<Envelope<Category[]>>("/admin/categories"),
        apiRequest<Envelope<Service[]>>("/admin/services"),
        apiRequest<Envelope<Person[]>>("/admin/people"),
        apiRequest<Envelope<CmsLibraryItem[]>>("/admin/content-library"),
      ]);
      setProfile(unwrap(profileResponse));
      setCategories(unwrap(categoryResponse));
      setServices(unwrap(serviceResponse));
      setPeople(unwrap(peopleResponse));
      setLibraryItems(unwrap(libraryResponse));
      await loadEnquiries();
      await loadNewsletterSubscribers();
    } catch (cause) {
      if (cause instanceof AdminApiError && cause.status === 401) {
        onSignedOutRef.current();
        return;
      }
      setError(cause instanceof Error ? cause.message : "Unable to load CMS content.");
    } finally {
      setLoading(false);
    }
  }, [loadEnquiries, loadNewsletterSubscribers]);

  useEffect(() => { void loadContent(); }, [loadContent]);
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("/admin/overview", { replace: true });
      return;
    }

    if (sectionFromPathname(location.pathname) === "overview" && !location.pathname.endsWith("/overview")) {
      navigate("/admin/overview", { replace: true });
    }
  }, [location.pathname, navigate]);

  const meta = sectionMeta[section];
  const filteredCategories = useMemo(() => categories.filter((item) => `${item.name} ${item.slug}`.toLowerCase().includes(search.toLowerCase())), [categories, search]);
  const filteredServices = useMemo(() => services.filter((item) => `${item.title} ${item.slug} ${item.category?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [services, search]);
  const filteredPeople = useMemo(() => people.filter((item) => `${item.name} ${item.role} ${item.profile_type}`.toLowerCase().includes(search.toLowerCase())), [people, search]);
  const filteredEnquiries = useMemo(() => enquiries.filter((item) => `${item.name} ${item.email} ${item.phone} ${item.service ?? ""} ${item.message}`.toLowerCase().includes(search.toLowerCase())), [enquiries, search]);
  const filteredNewsletterSubscribers = useMemo(() => newsletterSubscribers.filter((item) => item.email.toLowerCase().includes(search.toLowerCase())), [newsletterSubscribers, search]);

  async function saveProfile(event: FormEvent<HTMLFormElement>): Promise<boolean> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true); setMessage(""); setError("");
    try {
      const payload = profilePayload(form);
      const assetFields = ["logo", "favicon", "loader_image"] as const;
      const brochureFile = form.get("brochure_file");
      const hasBrochureFile = brochureFile instanceof File && brochureFile.size > 0;
      const hasBrochureRemove = stringValue(form, "remove_brochure") === "1";
      const hasAssetChange = assetFields.some((asset) => {
        const file = form.get(`${asset}_file`);
        return (file instanceof File && file.size > 0) || stringValue(form, `remove_${asset}`) === "1";
      }) || hasBrochureFile || hasBrochureRemove;
      let updated: Envelope<CmsProfile>;
      if (hasAssetChange) {
        const uploadData = makeFormData(payload, null, undefined, "PUT");
        assetFields.forEach((asset) => {
          const file = form.get(`${asset}_file`);
          if (file instanceof File && file.size > 0) uploadData.append(`${asset}_file`, file);
          if (stringValue(form, `remove_${asset}`) === "1") uploadData.append(`remove_${asset}`, "1");
        });
        if (hasBrochureFile) uploadData.append("brochure_file", brochureFile);
        if (hasBrochureRemove) uploadData.append("remove_brochure", "1");
        updated = await apiRequest<Envelope<CmsProfile>>("/admin/profile", { method: "POST", data: uploadData });
      } else {
        updated = await apiRequest<Envelope<CmsProfile>>("/admin/profile", { method: "PUT", data: payload });
      }
      setProfile(unwrap(updated));
      const refreshed = await refreshContent();
      setMessage(refreshed
        ? "Company information saved and the public website has been updated."
        : "Company information saved, but the website could not refresh. Reload the page to try again.");
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save company details.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveAccount(event: FormEvent<HTMLFormElement>): Promise<boolean> {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving(true); setMessage(""); setError("");
    try {
      const updated = await apiRequest<Envelope<{ user: AdminUser }>>("/admin/account", {
        method: "PUT",
        data: Object.fromEntries(form.entries()),
      });
      setAccountUser(updated.data.user);
      setMessage("Your admin account details have been updated.");
      formElement.reset();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update your admin account.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function clearPublicCache() {
    setClearingPublicCache(true);
    setError("");
    setMessage("");
    try {
      await apiRequest("/admin/cache/clear", { method: "POST" });
      const refreshed = await refreshContent();
      setMessage(refreshed
        ? "Public website cache cleared. The latest content is now available."
        : "Public website cache cleared. Reload this page if its content does not update.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not clear the public website cache.");
    } finally {
      setClearingPublicCache(false);
    }
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modal) return;
    const form = new FormData(event.currentTarget);
    const formValues = recordPayload(form, modal.type);
    const fileKey = modal.type === "category" ? "image_file" : modal.type === "service" ? "hero_image_file" : "photo_file";
    const file = form.get(fileKey);
    const upload = file instanceof File && file.size > 0 ? file : undefined;
    const endpoint = modal.type === "category" ? "categories" : modal.type === "service" ? "services" : "people";
    const id = modal.record?.id;
    setSaving(true); setError(""); setMessage("");
    try {
      await apiRequest(`/admin/${endpoint}${id ? `/${id}` : ""}`, {
        method: upload && id ? "POST" : id ? "PUT" : "POST",
        data: upload ? makeFormData(formValues, fileKey, upload, id ? "PUT" : undefined) : formValues,
      });
      setModal(null);
      const publicContentRefreshed = await refreshContent();
      await loadContent();
      const recordName = modal.type === "person" ? "Profile" : modal.type[0].toUpperCase() + modal.type.slice(1);
      setMessage(publicContentRefreshed
        ? `${recordName} ${id ? "updated" : "created"} and public pages refreshed.`
        : `${recordName} ${id ? "updated" : "created"} in the CMS, but the public pages could not refresh. Reload the public page to check the saved change.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this item.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(type: "category" | "service" | "person", record: Category | Service | Person) {
    const noun = type === "person" ? "profile" : type;
    if (!window.confirm(`Delete this ${noun}?${type === "category" ? " Its services will also be removed." : ""}`)) return;
    const endpoint = type === "category" ? "categories" : type === "service" ? "services" : "people";
    setError(""); setMessage("");
    try {
      await apiRequest(`/admin/${endpoint}/${record.id}`, { method: "DELETE" });
      setMessage(`${noun[0].toUpperCase() + noun.slice(1)} deleted.`);
      await loadContent();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Could not delete ${noun}.`);
    }
  }

  async function saveEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enquiryModal) return;
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      service: String(form.get("service") ?? "").trim() || null,
      message: String(form.get("message") ?? "").trim(),
    };
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await apiRequest<Envelope<ContactEnquiry>>(`/admin/contact-enquiries/${enquiryModal.record.id}`, {
        method: "PUT",
        data: values,
      });
      const updated = unwrap(response);
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEnquiryModal(null);
      setMessage(`Contact enquiry from ${updated.name} updated.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save contact enquiry.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEnquiry(item: ContactEnquiry) {
    if (!window.confirm(`Delete enquiry from ${item.name}?`)) return;
    setError("");
    setMessage("");
    try {
      await apiRequest(`/admin/contact-enquiries/${item.id}`, { method: "DELETE" });
      setEnquiries((prev) => prev.filter((e) => e.id !== item.id));
      if (enquiryModal?.record.id === item.id) setEnquiryModal(null);
      setMessage(`Contact enquiry from ${item.name} deleted.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete contact enquiry.");
    }
  }

  async function signOut() {
    try { await apiRequest("/admin/logout", { method: "POST" }); }
    finally { onSignedOut(); }
  }

  function selectSection(next: Section) {
    setSearch(""); setMessage(""); setError(""); setSidebarOpen(false);
    navigate(`/admin/${next}`);
  }

  return (
    <div className="cms-admin-shell">
      <aside className={`cms-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link to="/admin" className="cms-sidebar-brand"><span className="cms-brand-mark">S</span><span>Sipher<span className="cms-brand-light">.studio</span><small>CONTENT WORKSPACE</small></span></Link>
        <div className="cms-side-label">WORKSPACE</div>
        <nav className="cms-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? "active" : ""} onClick={() => selectSection(id)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{section === id && <span className="cms-nav-indicator" />}</button>)}</nav>
        <div className="cms-sidebar-bottom">
          <div className="cms-user-card"><span className="cms-avatar">{accountUser.name.slice(0, 1).toUpperCase()}</span><span className="cms-user-copy"><strong>{accountUser.name}</strong><small>Administrator</small></span><button className="cms-icon-button" onClick={() => void signOut()} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button></div>
          <a className="cms-view-site" href="/" target="_blank" rel="noreferrer"><Globe2 size={16} /> View public website <ArrowUpRight size={14} /></a>
        </div>
      </aside>
      {sidebarOpen && <button className="cms-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <main className="cms-admin-main">
        <header className="cms-topbar">
          <button className="cms-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="cms-breadcrumb"><span>Workspace</span><span>/</span><strong>{meta.label}</strong></div>
          <div className="cms-topbar-right"><span className="cms-live-indicator"><i /> CMS connected</span><span className="cms-top-avatar">{accountUser.name.slice(0, 1).toUpperCase()}</span></div>
        </header>
        <div className="cms-content">
          <div className="cms-heading-row"><div><p className="cms-eyebrow">{meta.eyebrow}</p><h1>{meta.title}</h1><p className="cms-heading-description">{meta.description}</p></div>          {section !== "overview" && section !== "profile" && section !== "careers" && section !== "library" && section !== "enquiries" && section !== "subscribers" && section !== "cache" && <button className="cms-button primary" onClick={() => setModal({ type: section === "people" ? "person" : section === "services" ? "service" : "category" })}><Plus size={17} /> Add {section === "people" ? "profile" : section === "services" ? "service" : "category"}</button>}</div>
          {message && <div className="cms-alert success"><Check size={17} />{message}<button onClick={() => setMessage("")} aria-label="Dismiss message"><X size={16} /></button></div>}
          {error && <div className="cms-alert error" role="alert"><CircleHelp size={17} />{error}<button onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div>}
          {loading ? <div className="cms-page-loading"><LoaderCircle className="spin" /> Loading your website content…</div> : (
            <>
              {section === "overview" && <Overview profile={profile} categories={categories} services={services} people={people} libraryItems={libraryItems} onSection={selectSection} />}
              {section === "profile" && <ProfileEditor profile={profile} saving={saving} onSubmit={saveProfile} />}
              {section === "categories" && <CategoryList items={filteredCategories} search={search} onSearch={setSearch} onView={(record) => setModal({ type: "category", record })} onEdit={(record) => setModal({ type: "category", record, startInEdit: true })} onDelete={(record) => void deleteRecord("category", record)} />}
              {section === "services" && <ServiceList items={filteredServices} search={search} onSearch={setSearch} onView={(record) => setModal({ type: "service", record })} onEdit={(record) => setModal({ type: "service", record, startInEdit: true })} onDelete={(record) => void deleteRecord("service", record)} />}
              {section === "people" && <PeopleList items={filteredPeople} search={search} onSearch={setSearch} onView={(record) => setModal({ type: "person", record })} onEdit={(record) => setModal({ type: "person", record, startInEdit: true })} onDelete={(record) => void deleteRecord("person", record)} />}
              {section === "careers" && <CareersManager items={libraryItems.filter((item) => item.type === "career")} onReload={loadContent} />}
              {section === "library" && <ContentLibraryManager items={libraryItems} onReload={loadContent} />}
              {section === "cache" && (
                <section className="cms-card cms-cache-card">
                  <div className="cms-card-heading"><div><p className="cms-eyebrow">CACHE POLICY</p><h2>Fresh content, safely cached</h2></div></div>
                  <p>Public API responses are cached on the server for up to 24 hours. Successful edits to company details, services, people, and published content clear the relevant cache immediately.</p>
                  <div className="cms-cache-facts">
                    <div><span>Maximum cache age</span><strong>24 hours</strong></div>
                    <div><span>Scheduled cache rotation</span><strong>Daily at 02:00</strong></div>
                  </div>
                  <p className="cms-cache-note">The daily rotation uses the server’s local time and requires Laravel’s scheduler cron to be configured on the hosting account.</p>
                  <button className="cms-button primary" type="button" onClick={() => void clearPublicCache()} disabled={clearingPublicCache}>
                    {clearingPublicCache ? <LoaderCircle className="spin" size={16} /> : <RotateCcw size={16} />}
                    {clearingPublicCache ? "Clearing cache…" : "Clear public site cache"}
                  </button>
                </section>
              )}
              {section === "enquiries" && <>
                {enquiryError && <div className="cms-alert error" role="alert"><CircleHelp size={17} /><span>{enquiryError}</span><button className="cms-button secondary" type="button" onClick={() => void loadEnquiries()} disabled={loadingEnquiries}>{loadingEnquiries ? <LoaderCircle className="spin" size={15} /> : "Retry"}</button></div>}
                {loadingEnquiries && enquiries.length === 0 ? (
                  <div className="cms-page-loading"><LoaderCircle className="spin" /> Loading contact enquiries…</div>
                ) : (
                  <EnquiryList
                    items={filteredEnquiries}
                    search={search}
                    onSearch={setSearch}
                    onView={(item) => setEnquiryModal({ record: item, isEditing: false })}
                    onEdit={(item) => setEnquiryModal({ record: item, isEditing: true })}
                    onDelete={(item) => void deleteEnquiry(item)}
                  />
                )}
              </>}
              {section === "subscribers" && <>
                {newsletterError && <div className="cms-alert error" role="alert"><CircleHelp size={17} /><span>{newsletterError}</span><button className="cms-button secondary" type="button" onClick={() => void loadNewsletterSubscribers()} disabled={loadingNewsletterSubscribers}>{loadingNewsletterSubscribers ? <LoaderCircle className="spin" size={15} /> : "Retry"}</button></div>}
                {loadingNewsletterSubscribers && newsletterSubscribers.length === 0 ? <div className="cms-page-loading"><LoaderCircle className="spin" /> Loading newsletter subscribers…</div> : <NewsletterSubscriberList items={filteredNewsletterSubscribers} search={search} onSearch={setSearch} />}
              </>}
              {section === "account" && <AccountSettings user={accountUser} saving={saving} onSubmit={saveAccount} />}
            </>
          )}
          <footer className="cms-page-footer"><span>Made for thoughtful content management.</span><span>Admin workspace <span className="cms-footer-dot">·</span> {new Date().getFullYear()}</span></footer>
        </div>
      </main>
      {modal && <RecordModal modal={modal} categories={categories} saving={saving} onClose={() => setModal(null)} onSubmit={saveRecord} />}
      {enquiryModal && (
        <EnquiryModal
          modal={enquiryModal}
          saving={saving}
          onClose={() => setEnquiryModal(null)}
          onEdit={() => setEnquiryModal((prev) => (prev ? { ...prev, isEditing: true } : null))}
          onSubmit={saveEnquiry}
          onDelete={(item) => void deleteEnquiry(item)}
        />
      )}
    </div>
  );
}

function Overview({ profile, categories, services, people, libraryItems, onSection }: { profile: CmsProfile; categories: Category[]; services: Service[]; people: Person[]; libraryItems: CmsLibraryItem[]; onSection: (section: Section) => void }) {
  const careers = libraryItems.filter((item) => item.type === "career");
  const publishedCount = categories.filter((item) => item.is_published).length + services.filter((item) => item.is_published).length + people.filter((item) => item.is_published).length + careers.filter((item) => item.is_published).length;
  return (
    <div className="cms-overview">
      <div className="cms-welcome-card"><div><span className="cms-welcome-icon"><Sparkles size={18} /></span><p className="cms-eyebrow">YOUR CONTENT STUDIO</p><h2>Good work starts with a good story.</h2><p>Keep the details of your company, offerings and people in one considered place.</p></div><div className="cms-welcome-art"><span /><span /><span /><span /><span /></div></div>
      <div className="cms-stat-grid">
        <StatCard icon={<Boxes />} label="Service categories" count={categories.length} foot={`${categories.filter((item) => item.is_published).length} published`} accent="violet" />
        <StatCard icon={<BriefcaseBusiness />} label="Services" count={services.length} foot={`${services.filter((item) => item.is_published).length} published`} accent="amber" />
        <StatCard icon={<UsersRound />} label="People & leaders" count={people.length} foot={`${people.filter((item) => item.is_published).length} published`} accent="mint" />
        <StatCard icon={<BriefcaseBusiness />} label="Career openings" count={careers.length} foot={`${careers.filter((item) => item.is_published).length} active`} accent="rose" />
        <StatCard icon={<Globe2 />} label="Live on your website" count={publishedCount} foot="Published items" accent="blue" />
      </div>
      <div className="cms-overview-grid">
        <section className="cms-card cms-quick-card"><div className="cms-card-heading"><div><p className="cms-eyebrow">QUICK ACCESS</p><h2>What would you like to update?</h2></div></div><div className="cms-quick-grid">
          <QuickLink icon={<Building2 />} title="Company profile" detail="Brand, contact & About" onClick={() => onSection("profile")} />
          <QuickLink icon={<Boxes />} title="Service categories" detail={`${categories.length} categories`} onClick={() => onSection("categories")} />
          <QuickLink icon={<BriefcaseBusiness />} title="Services" detail={`${services.length} service pages`} onClick={() => onSection("services")} />
          <QuickLink icon={<UsersRound />} title="Team & leadership" detail={`${people.length} profiles`} onClick={() => onSection("people")} />
          <QuickLink icon={<BriefcaseBusiness />} title="Careers & Jobs" detail={`${careers.length} job postings`} onClick={() => onSection("careers")} />
        </div></section>
        <section className="cms-card cms-site-card">
          <p className="cms-eyebrow">BRAND SNAPSHOT</p>
          <div className="cms-brand-preview">
            <img
              className="cms-brand-preview-logo"
              src={profile.logo_path ? publicImage(profile.logo_path) : fallbackLogo}
              alt={`${profile.brand_name || "Company"} logo`}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + fallbackLogo) {
                  e.currentTarget.src = fallbackLogo;
                }
              }}
            />
            <div>
              <strong>{profile.brand_name || "Your brand"}</strong>
              <span>{profile.tagline || "Add your brand tagline"}</span>
            </div>
            <span className="cms-status live"><i /> Active</span>
          </div>
          <div className="cms-site-details">
            <p><Mail size={15} />{profile.email || "Add a contact email"}</p>
            <p><MapPin size={15} />{profile.location_label || profile.address || "Add your business location"}</p>
          </div>
          <button className="cms-text-button" onClick={() => onSection("profile")}>
            Edit company profile <ArrowUpRight size={15} />
          </button>
        </section>
      </div>
      <div className="cms-tip"><span><Sparkles size={16} /></span><p><strong>A small publishing note</strong><br />Draft content stays private. Switch an item to “Published” when it is ready to appear on your website.</p></div>
    </div>
  );
}

function AccountSettings({ user, saving, onSubmit }: { user: AdminUser; saving: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean> }) {
  return (
    <form className="cms-editor-form" onSubmit={(event) => void onSubmit(event)}>
      <EditorSection icon={<KeyRound />} title="Administrator credentials" detail="Update the name and email used for your admin account.">
        <div className="cms-form-grid">
          <TextField label="Administrator name" name="name" value={user.name} required autoComplete="name" />
          <TextField label="Login email" name="email" value={user.email} type="email" required autoComplete="email" />
        </div>
      </EditorSection>
      <EditorSection icon={<ShieldCheck />} title="Change password" detail="Leave these fields empty to keep your current password. Passwords must contain at least 8 characters.">
        <div className="cms-form-grid">
          <TextField label="Current password" name="current_password" value="" type="password" autoComplete="current-password" />
          <TextField label="New password" name="new_password" value="" type="password" minLength={8} autoComplete="new-password" />
          <TextField label="Confirm new password" name="new_password_confirmation" value="" type="password" minLength={8} autoComplete="new-password" />
        </div>
      </EditorSection>
      <div className="cms-save-bar"><span>Your account changes take effect immediately.</span><button className="cms-button primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />} Save account settings</button></div>
    </form>
  );
}

function StatCard({ icon, label, count, foot, accent }: { icon: ReactNode; label: string; count: number; foot: string; accent: string }) {
  return <div className="cms-stat-card"><span className={`cms-stat-icon ${accent}`}>{icon}</span><span className="cms-stat-label">{label}</span><strong>{count.toString().padStart(2, "0")}</strong><span className="cms-stat-foot">{foot}</span></div>;
}

function QuickLink({ icon, title, detail, onClick }: { icon: ReactNode; title: string; detail: string; onClick: () => void }) {
  return <button className="cms-quick-link" onClick={onClick}><span>{icon}</span><span><strong>{title}</strong><small>{detail}</small></span><ArrowUpRight size={16} /></button>;
}

const DEFAULT_APPROVED_CLIENT_NAMES = [
  "ZenMedia",
  "AlphaStudio",
  "BlueForge",
  "CrestGroup",
  "OmniLogic",
  "StellarBrand",
  "VistaCorp",
  "PrimeEdge",
];

function ProfileEditor({ profile, saving, onSubmit }: { profile: CmsProfile; saving: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false);
  const [clientList, setClientList] = useState<string[]>(() => {
    return Array.isArray(profile.approved_clients) && profile.approved_clients.length > 0
      ? profile.approved_clients
      : DEFAULT_APPROVED_CLIENT_NAMES;
  });
  const [newClientInput, setNewClientInput] = useState("");

  useEffect(() => {
    if (Array.isArray(profile.approved_clients) && profile.approved_clients.length > 0) {
      setClientList(profile.approved_clients);
    }
  }, [profile.approved_clients]);

  const socials = JSON.stringify(profile.socials ?? [], null, 2);
  const currentLogo = profile.logo_path ? publicImage(profile.logo_path) : fallbackLogo;

  function cancelEditing() {
    setEditing(false);
    setClientList(
      Array.isArray(profile.approved_clients) && profile.approved_clients.length > 0
        ? profile.approved_clients
        : DEFAULT_APPROVED_CLIENT_NAMES
    );
    setNewClientInput("");
  }

  function handleAddClient() {
    const trimmed = newClientInput.trim();
    if (trimmed && !clientList.includes(trimmed)) {
      setClientList([...clientList, trimmed]);
      setNewClientInput("");
    }
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    const saved = await onSubmit(event);
    if (saved) setEditing(false);
  }
  if (!editing) {
    return (
      <div className="cms-profile-view">
        <div className="cms-profile-view-heading">
          <div><p className="cms-eyebrow">SAVED INFORMATION</p><h2>Company details</h2><p>Review the information currently displayed across your website.</p></div>
          <button className="cms-button primary" type="button" onClick={() => setEditing(true)}><Pencil size={16} /> Edit details</button>
        </div>
        <EditorSection icon={<Building2 />} title="Brand identity" detail="Your company name and website introduction.">
          <div className="cms-detail-grid">
            <DetailField label="Company name" value={profile.name} />
            <DetailField label="Brand name" value={profile.brand_name} />
            <DetailField label="Tagline" value={profile.tagline} />
            <DetailField label="Website" value={profile.website} />
            <DetailField label="Business hours" value={profile.business_hours} />
          </div>
        </EditorSection>
        <EditorSection icon={<Building2 />} title="Company logo" detail="This logo is used in the website navigation, footer and loading screen.">
          <div className="cms-profile-logo-preview">
            <img
              src={currentLogo}
              alt={`${profile.brand_name || "Company"} logo`}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + fallbackLogo) {
                  e.currentTarget.src = fallbackLogo;
                }
              }}
            />
          </div>
        </EditorSection>
        <EditorSection icon={<Globe2 />} title="Browser favicon" detail="The icon shown in browser tabs and bookmarks.">
          <div className="cms-profile-logo-preview cms-profile-favicon-preview">
            <img
              src={profile.favicon_path ? publicImage(profile.favicon_path) : "/favicon.png"}
              alt={`${profile.brand_name || "Company"} favicon`}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + "/favicon.png") {
                  e.currentTarget.src = "/favicon.png";
                }
              }}
            />
          </div>
        </EditorSection>
        <EditorSection icon={<LoaderCircle />} title="Loading screen image" detail="This image appears in the animated page-loading screen.">
          <div className="cms-profile-logo-preview">
            <img
              src={profile.loader_image_path ? publicImage(profile.loader_image_path) : currentLogo}
              alt={`${profile.brand_name || "Company"} loading image`}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + fallbackLogo) {
                  e.currentTarget.src = fallbackLogo;
                }
              }}
            />
          </div>
        </EditorSection>
        <EditorSection icon={<FileDown />} title="Company brochure" detail="The PDF brochure available for download via the floating action dock on the public site.">
          <div className="cms-brochure-view-card">
            <div className="cms-brochure-file-info">
              <span className={`cms-brochure-icon${!profile.brochure_path ? " empty" : ""}`}><FileText size={24} /></span>
              <div className="cms-brochure-details">
                <strong>{profile.brochure_name || (profile.brochure_path ? "Company Brochure" : "No brochure uploaded")}</strong>
                <span>
                  {profile.brochure_path ? (
                    profile.brochure_enabled ? (
                      <span className="cms-status live"><i /> Active & Visible in floating dock</span>
                    ) : (
                      <span className="cms-status draft"><i /> Disabled (Hidden on website)</span>
                    )
                  ) : (
                    <span className="cms-status draft"><i /> No file attached</span>
                  )}
                </span>
              </div>
            </div>
            {profile.brochure_path && (
              <a
                className="cms-button secondary cms-button-sm"
                href={publicImage(profile.brochure_path)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={14} /> View / Download current brochure
              </a>
            )}
          </div>
        </EditorSection>
        <EditorSection icon={<Mail />} title="Contact information" detail="Details used by your website footer, contact page and calls to action.">
          <div className="cms-detail-grid">
            <DetailField label="Contact email" value={profile.email} />
            <DetailField label="Phone" value={[profile.phone_country_code, profile.phone_number].filter(Boolean).join(" ")} />
            <DetailField label="WhatsApp number" value={profile.whatsapp_number} />
            <DetailField label="Location" value={profile.location_label} />
            <DetailField label="Business address" value={profile.address} wide />
            <DetailField label="Google Maps location URL" value={profile.map_location_url} />
            <DetailField label="Directions URL" value={profile.map_directions_url} />
            <DetailField label="Latitude" value={profile.latitude} />
            <DetailField label="Longitude" value={profile.longitude} />
          </div>
        </EditorSection>
        <EditorSection icon={<Globe2 />} title="Social links" detail="Social accounts configured for your website.">
          <DetailField label="Social accounts" value={profile.socials?.length ? profile.socials : null} wide />
        </EditorSection>
        <EditorSection icon={<Sparkles />} title="Approved clients (Home marquee)" detail="Client logo pills displayed in the continuous scrolling marquee on the homepage.">
          <div className="cms-approved-clients-view">
            {clientList.map((client, index) => (
              <span className="cms-approved-client-chip" key={`${client}-${index}`}>
                <span className="cms-chip-abbr">{client.slice(0, 2).toUpperCase()}</span>
                <span className="cms-chip-name">{client}</span>
              </span>
            ))}
          </div>
        </EditorSection>
      </div>
    );
  }
  return (
    <form className="cms-editor-form" onSubmit={(event) => void saveDetails(event)}>
      <div className="cms-profile-view-heading">
        <div><p className="cms-eyebrow">EDITING DETAILS</p><h2>Company details</h2><p>Save your changes to update the public website.</p></div>
        <button className="cms-button secondary" type="button" onClick={cancelEditing} disabled={saving}>Cancel</button>
      </div>
      <EditorSection icon={<Building2 />} title="Company logo" detail="Shown in the website navigation and footer. PNG, JPG, WebP or GIF; up to 5 MB.">
        <ProfileImageField name="logo" label="Company logo" savedPath={profile.logo_path} fallback={fallbackLogo} help="The saved logo stays in place until you save a replacement." />
      </EditorSection>
      <EditorSection icon={<Globe2 />} title="Browser favicon" detail="Shown in browser tabs and bookmarks. Use a square PNG for best results; up to 5 MB.">
        <ProfileImageField name="favicon" label="Browser favicon" savedPath={profile.favicon_path} fallback="/favicon.png" help="A square transparent PNG is recommended for crisp browser-tab display." />
      </EditorSection>
      <EditorSection icon={<LoaderCircle />} title="Loading screen image" detail="Shown in the center of the animated page-loading screen.">
        <ProfileImageField name="loader_image" label="Loading screen image" savedPath={profile.loader_image_path} fallback={currentLogo} help="Choose a transparent image that looks clear on the loading screen." />
      </EditorSection>
      <EditorSection icon={<FileDown />} title="Company brochure" detail="The PDF or document brochure downloadable from the floating dock button on the public site.">
        <ProfileBrochureField
          savedPath={profile.brochure_path}
          savedName={profile.brochure_name}
          enabled={profile.brochure_enabled ?? true}
        />
      </EditorSection>
      <EditorSection icon={<Building2 />} title="Brand identity" detail="The name, brand and introduction used across the website.">
        <div className="cms-form-grid">
          <TextField label="Company name" name="name" value={profile.name} required />
          <TextField label="Brand name" name="brand_name" value={profile.brand_name} required />
          <TextField label="Tagline" name="tagline" value={profile.tagline} wide />
          <TextField label="Website" name="website" value={profile.website} type="url" placeholder="https://example.com" />
          <TextField label="Business hours" name="business_hours" value={profile.business_hours} placeholder="Mon–Fri, 9 AM–6 PM" />
        </div>
      </EditorSection>
      <EditorSection icon={<Mail />} title="Contact information" detail="These details power the website footer, contact page and call-to-action links.">
        <div className="cms-form-grid">
          <TextField label="Contact email" name="email" value={profile.email} type="email" required />
          <TextField label="Phone country code" name="phone_country_code" value={profile.phone_country_code} placeholder="+91" />
          <TextField label="Phone number" name="phone_number" value={profile.phone_number} />
          <TextField label="WhatsApp number (include country code)" name="whatsapp_number" value={profile.whatsapp_number} placeholder="+91 98765 43210" />
          <TextField label="Location label" name="location_label" value={profile.location_label} placeholder="Lucknow, India" />
          <TextAreaField label="Business address" name="address" value={profile.address ?? ""} wide rows={3} />
          <TextField label="Google Maps location URL" name="map_location_url" value={profile.map_location_url} type="url" />
          <TextField label="Directions URL" name="map_directions_url" value={profile.map_directions_url} type="url" />
          <TextField label="Latitude" name="latitude" value={profile.latitude} type="number" step="any" />
          <TextField label="Longitude" name="longitude" value={profile.longitude} type="number" step="any" />
        </div>
      </EditorSection>
      <EditorSection icon={<ExternalLink />} title="External lead forwarding" detail="Automatically forward new contact form submissions to another website, external CRM, or webhook URL.">
        <div className="cms-form-grid">
          <div className="cms-field wide">
            <CheckField label="Enable forwarding leads to external website" name="external_leads_enabled" checked={profile.external_leads_enabled ?? false} />
            <small>When enabled, all valid contact form submissions are automatically sent to your external URL.</small>
          </div>
          <TextField label="External Endpoint URL" name="external_leads_url" value={profile.external_leads_url ?? ""} type="url" placeholder="https://another-website.com/api/leads" wide />
          <TextField label="API Key / Bearer Token (Optional)" name="external_leads_key" value={profile.external_leads_key ?? ""} placeholder="Optional authorization bearer token or API key" wide />
        </div>
      </EditorSection>
      <EditorSection icon={<Globe2 />} title="Social links" detail="Use a JSON array. Each link needs a label, icon name and URL.">
        <TextAreaField label="Social accounts (JSON)" name="socials" value={socials} rows={7} mono wide />
      </EditorSection>
      <EditorSection icon={<Sparkles />} title="Approved clients (Home marquee)" detail="Manage company names displayed in the animated client logo marquee on the homepage.">
        <div className="cms-approved-clients-manager">
          <div className="cms-clients-input-row">
            <input
              type="text"
              className="cms-input"
              placeholder="Enter client company name (e.g. ZenMedia, AcmeCorp)..."
              value={newClientInput}
              onChange={(e) => setNewClientInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddClient();
                }
              }}
            />
            <button
              type="button"
              className="cms-button secondary"
              onClick={handleAddClient}
            >
              <Plus size={16} /> Add client
            </button>
            <button
              type="button"
              className="cms-button secondary cms-button-sm"
              title="Reset list to default companies"
              onClick={() => setClientList(DEFAULT_APPROVED_CLIENT_NAMES)}
            >
              <RotateCcw size={14} /> Reset defaults
            </button>
          </div>

          <div className="cms-approved-clients-chips">
            {clientList.length === 0 ? (
              <p className="cms-text-muted">No client names added yet. Type a company name above and click Add.</p>
            ) : (
              clientList.map((client, index) => (
                <span className="cms-approved-client-chip editing" key={`${client}-${index}`}>
                  <span className="cms-chip-abbr">{client.slice(0, 2).toUpperCase()}</span>
                  <span className="cms-chip-name">{client}</span>
                  <button
                    type="button"
                    className="cms-chip-remove"
                    title={`Remove ${client}`}
                    onClick={() => {
                      setClientList(clientList.filter((_, i) => i !== index));
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
          <input type="hidden" name="approved_clients" value={JSON.stringify(clientList)} />
          <small className="cms-field-help">
            Clients appear in the continuous loop on the homepage. Enter a name and click Add or press Enter. Click (×) to remove.
          </small>
        </div>
      </EditorSection>
      <div className="cms-save-bar"><span>Changes are reflected by the public API as soon as saved.</span><button className="cms-button primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />} Save company profile</button></div>
    </form>
  );
}

function ProfileImageField({
  name,
  label,
  savedPath,
  fallback,
  help,
}: {
  name: "logo" | "favicon" | "loader_image";
  label: string;
  savedPath: string | null;
  fallback: string;
  help: string;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const [preview, setPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const imageSrc = preview || (!removed && savedPath ? publicImage(savedPath) : fallback);

  return (
    <div className="cms-company-logo-editor">
      <div className={`cms-company-logo-preview${name === "favicon" ? " cms-company-favicon-preview" : ""}`}>
        <img
          src={imageSrc}
          alt={`${label} preview`}
          onError={(e) => {
            if (fallback && e.currentTarget.src !== window.location.origin + fallback) {
              e.currentTarget.src = fallback;
            }
          }}
        />
      </div>
      <div className="cms-company-logo-controls">
        <label className="cms-field">
          <span>Upload or replace {label.toLowerCase()}</span>
          <input
            ref={inputRef}
            type="file"
            name={`${name}_file`}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => {
              setSelectedFile(event.target.files?.[0] ?? null);
              setRemoved(false);
            }}
          />
          <small>{help} The current image remains live until you save.</small>
        </label>
        {(savedPath || selectedFile) && (
          <button
            className="cms-text-button"
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setRemoved(true);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Use default image
          </button>
        )}
        <input type="hidden" name={`remove_${name}`} value={removed ? "1" : "0"} />
      </div>
    </div>
  );
}

function ProfileBrochureField({
  savedPath,
  savedName,
  enabled,
}: {
  savedPath: string | null;
  savedName: string | null;
  enabled: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentPath = !removed && savedPath ? savedPath : null;
  const currentName = selectedFile
    ? selectedFile.name
    : !removed
      ? (savedName || (savedPath ? "Company_Brochure.pdf" : null))
      : null;

  return (
    <div className="cms-brochure-editor">
      <div className="cms-brochure-card">
        <div className="cms-brochure-file-info">
          <span className={`cms-brochure-icon${!currentPath && !selectedFile ? " empty" : ""}`}>
            <FileText size={26} />
          </span>
          <div className="cms-brochure-details">
            <strong>{currentName || "No brochure file selected"}</strong>
            <span>
              {selectedFile ? (
                <span className="cms-status live"><i /> Ready to upload ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              ) : currentPath ? (
                isEnabled ? (
                  <span className="cms-status live"><i /> Live & Active</span>
                ) : (
                  <span className="cms-status draft"><i /> Disabled</span>
                )
              ) : (
                <span className="cms-status draft"><i /> No file attached</span>
              )}
            </span>
          </div>
        </div>

        {currentPath && !selectedFile && (
          <a
            className="cms-button secondary cms-button-sm"
            href={publicImage(currentPath)}
            target="_blank"
            rel="noopener noreferrer"
            title="Download/view current file"
          >
            <Download size={14} /> View current
          </a>
        )}
      </div>

      <div className="cms-brochure-controls">
        <label className="cms-field">
          <span>Upload or replace company brochure (PDF / DOC)</span>
          <input
            ref={inputRef}
            type="file"
            name="brochure_file"
            accept=".pdf,.doc,.docx,application/pdf"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
              setRemoved(false);
            }}
          />
          <small>Accepts PDF, DOC, DOCX up to 50 MB. Your file updates on the website when you save.</small>
        </label>

        <div className="cms-brochure-actions-row">
          <label className="cms-toggle">
            <input
              type="checkbox"
              name="brochure_enabled"
              value="1"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
            />
            <span className="cms-toggle-track" />
            <span>Enable brochure download button in floating dock</span>
          </label>

          {(savedPath || selectedFile) && !removed && (
            <button
              className="cms-button danger cms-button-sm"
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setRemoved(true);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <Trash2 size={14} /> Remove brochure
            </button>
          )}

          {removed && (
            <div className="cms-brochure-removed-notice">
              <span>Brochure will be removed upon saving.</span>
              <button
                className="cms-text-button"
                type="button"
                onClick={() => setRemoved(false)}
              >
                Undo
              </button>
            </div>
          )}
        </div>

        <input type="hidden" name="remove_brochure" value={removed ? "1" : "0"} />
      </div>
    </div>
  );
}

function DetailField({ label, value, wide = false }: { label: string; value: unknown; wide?: boolean }) {
  const displayValue = value === null || value === undefined || value === ""
    ? "Not provided"
    : typeof value === "string" || typeof value === "number"
      ? String(value)
      : JSON.stringify(value, null, 2);

  return <div className={`cms-detail-field${wide ? " wide" : ""}`}><span>{label}</span><pre>{displayValue}</pre></div>;
}

function EditorSection({ icon, title, detail, children }: { icon: ReactNode; title: string; detail: string; children: ReactNode }) {
  return <section className="cms-editor-section"><div className="cms-editor-section-heading"><span>{icon}</span><div><h2>{title}</h2><p>{detail}</p></div></div><div className="cms-editor-section-body">{children}</div></section>;
}

function TextField({ label, name, value, type = "text", placeholder, required, step, wide, minLength, autoComplete }: { label: string; name: string; value: unknown; type?: string; placeholder?: string; required?: boolean; step?: string; wide?: boolean; minLength?: number; autoComplete?: string }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputType = type === "password" && passwordVisible ? "text" : type;
  const input = <input id={type === "password" ? name : undefined} name={name} type={inputType} defaultValue={value === null || value === undefined ? "" : String(value)} placeholder={placeholder} required={required} step={step} minLength={minLength} autoComplete={autoComplete} />;

  if (type === "password") {
    return (
      <div className={`cms-field${wide ? " wide" : ""}`}>
        <label htmlFor={name}>{label}{required && <i> *</i>}</label>
        <span className="cms-password-input">
          {input}
          <button type="button" className="cms-password-toggle" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={passwordVisible}>
            {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
      </div>
    );
  }

  return <label className={`cms-field${wide ? " wide" : ""}`}><span>{label}{required && <i> *</i>}</span>{input}</label>;
}

function TextAreaField({ label, name, value, rows = 4, wide, mono, help, required }: { label: string; name: string; value: string; rows?: number; wide?: boolean; mono?: boolean; help?: string; required?: boolean }) {
  return <label className={`cms-field ${wide ? "wide" : ""}`}><span>{label}{required && <i> *</i>}</span>{help && <small>{help}</small>}<textarea name={name} rows={rows} defaultValue={value} className={mono ? "mono" : ""} required={required} /></label>;
}

function CheckField({ label, name, checked }: { label: string; name: string; checked: boolean }) {
  return <label className="cms-toggle"><input type="checkbox" name={name} value="1" defaultChecked={checked} /><span className="cms-toggle-track" /><span>{label}</span></label>;
}

function CategoryList({ items, search, onSearch, onView, onEdit, onDelete }: { items: Category[]; search: string; onSearch: (value: string) => void; onView: (item: Category) => void; onEdit: (item: Category) => void; onDelete: (item: Category) => void }) {
  return <ListCard search={search} onSearch={onSearch} placeholder="Search categories…" count={items.length} noun="categories">
    {items.length === 0 ? <EmptyState title="No service categories found" detail="Create a category to organize the services on your website." /> : items.map((item) => <div className="cms-data-row" key={item.id}><span className="cms-row-symbol violet"><Boxes size={18} /></span><div className="cms-row-primary"><strong>{item.name}</strong><span>/{item.slug} <i>·</i> {item.services_count} services</span></div><StatusBadge published={item.is_published} /><span className="cms-row-order">Order {item.sort_order}</span><RowActions onView={() => onView(item)} onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} /></div>)}
  </ListCard>;
}

function ServiceList({ items, search, onSearch, onView, onEdit, onDelete }: { items: Service[]; search: string; onSearch: (value: string) => void; onView: (item: Service) => void; onEdit: (item: Service) => void; onDelete: (item: Service) => void }) {
  return <ListCard search={search} onSearch={onSearch} placeholder="Search services…" count={items.length} noun="services">
    {items.length === 0 ? <EmptyState title="No services found" detail="Create a service page to tell visitors how your team can help." /> : items.map((item) => <div className="cms-data-row" key={item.id}><span className="cms-row-symbol amber"><BriefcaseBusiness size={18} /></span><div className="cms-row-primary"><strong>{item.title}</strong><span>/{item.slug} <i>·</i> {item.category?.name ?? "No category"}</span></div><StatusBadge published={item.is_published} /><span className="cms-row-order">Order {item.sort_order}</span><RowActions onView={() => onView(item)} onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} /></div>)}
  </ListCard>;
}

function PersonAvatar({ photo, name }: { photo: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!photo || failed) {
    return <span className="cms-person-avatar cms-person-avatar--fallback" aria-label={`${name} photo unavailable`}><UserRound size={17} /></span>;
  }
  return <img className="cms-person-avatar" src={publicImage(photo)} alt={`${name} profile`} onError={() => setFailed(true)} />;
}

function PeopleList({ items, search, onSearch, onView, onEdit, onDelete }: { items: Person[]; search: string; onSearch: (value: string) => void; onView: (item: Person) => void; onEdit: (item: Person) => void; onDelete: (item: Person) => void }) {
  return <ListCard search={search} onSearch={onSearch} placeholder="Search people…" count={items.length} noun="profiles">
    {items.length === 0 ? <EmptyState title="No profiles found" detail="Add people to introduce the team and leadership behind your work." /> : items.map((item) => <div className="cms-data-row" key={item.id}><PersonAvatar photo={item.photo} name={item.name} /><div className="cms-row-primary"><strong>{item.name}</strong><span>{item.role} <i>·</i> {item.profile_type === "team" ? "Team member" : "Leadership"}</span></div><StatusBadge published={item.is_published} /><span className="cms-row-order">Order {item.sort_order}</span><RowActions onView={() => onView(item)} onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} /></div>)}
  </ListCard>;
}

function CareersManager({
  items,
  onReload,
}: {
  items: CmsLibraryItem[];
  onReload: () => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CmsLibraryItem | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filtered = items.filter((item) => {
    const raw = `${item.title} ${item.slug} ${item.category ?? ""} ${item.summary ?? ""} ${JSON.stringify(item.content ?? {})}`.toLowerCase();
    return raw.includes(query.toLowerCase());
  });

  async function submitJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    let slug = String(form.get("slug") ?? "").trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    const category = String(form.get("category") ?? "").trim();
    const summary = String(form.get("summary") ?? "").trim();
    const sortOrder = Number(form.get("sort_order") || 0);
    const isPublished = form.get("is_published") === "1";

    const employmentType = String(form.get("employmentType") ?? "Full-time").trim();
    const location = String(form.get("location") ?? "").trim();
    const experience = String(form.get("experience") ?? "").trim();
    const salary = String(form.get("salary") ?? "").trim();
    const applyEmail = String(form.get("applyEmail") ?? "careers@sipherweb.com").trim();

    const parseLines = (text: string) =>
      text.split("\n").map((l) => l.trim()).filter(Boolean);

    const parseCommaOrLines = (text: string) =>
      text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);

    const skills = parseCommaOrLines(String(form.get("skills") ?? ""));
    const responsibilities = parseLines(String(form.get("responsibilities") ?? ""));
    const requirements = parseLines(String(form.get("requirements") ?? ""));
    const benefits = parseLines(String(form.get("benefits") ?? ""));

    const content: Record<string, unknown> = {
      department: category,
      employmentType,
      location,
      experience,
      salary,
      applyEmail,
      skills,
      responsibilities,
      requirements,
      benefits,
    };

    const values = {
      type: "career",
      slug,
      title,
      summary,
      category,
      image_path: String(form.get("image_path") ?? ""),
      content,
      sort_order: sortOrder,
      is_published: isPublished,
    };

    setBusy(true);
    setError("");
    setMessage("");
    const id = editing?.id;

    try {
      await apiRequest(`/admin/content-library${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        data: values,
      });
      setEditing(undefined);
      await onReload();
      setMessage(`Job position "${title}" saved successfully.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save job position.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublish(item: CmsLibraryItem) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await apiRequest(`/admin/content-library/${item.id}`, {
        method: "PUT",
        data: {
          type: item.type,
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          category: item.category,
          image_path: item.image_path,
          content: item.content,
          sort_order: item.sort_order,
          is_published: !item.is_published,
        },
      });
      await onReload();
      setMessage(`"${item.title}" is now ${!item.is_published ? "published live" : "hidden/draft"}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update publish status.");
    } finally {
      setBusy(false);
    }
  }

  async function removeJob(item: CmsLibraryItem) {
    if (!window.confirm(`Delete job opening "${item.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await apiRequest(`/admin/content-library/${item.id}`, { method: "DELETE" });
      await onReload();
      setMessage(`Job opening "${item.title}" deleted.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete job opening.");
    } finally {
      setBusy(false);
    }
  }

  const jobContent = editing?.content ?? {};
  const currentSkills = Array.isArray(jobContent.skills) ? (jobContent.skills as string[]).join(", ") : "";
  const currentResponsibilities = Array.isArray(jobContent.responsibilities) ? (jobContent.responsibilities as string[]).join("\n") : "";
  const currentRequirements = Array.isArray(jobContent.requirements) ? (jobContent.requirements as string[]).join("\n") : "";
  const currentBenefits = Array.isArray(jobContent.benefits) ? (jobContent.benefits as string[]).join("\n") : "";
  const currentEmpType = String(jobContent.employmentType ?? "Full-time");
  const currentLocation = String(jobContent.location ?? "Lucknow, India (Hybrid)");
  const currentExperience = String(jobContent.experience ?? "");
  const currentSalary = String(jobContent.salary ?? "");
  const currentApplyEmail = String(jobContent.applyEmail ?? "careers@sipherweb.com");

  return (
    <section className="cms-library">
      <div className="cms-library__toolbar">
        <label className="cms-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search job titles, departments, skills..."
          />
        </label>
        <button
          className="cms-button primary"
          type="button"
          onClick={() => {
            setError("");
            setMessage("");
            setEditing(null);
          }}
        >
          <Plus size={16} /> Add job position
        </button>
      </div>

      {message && (
        <div className="cms-alert success">
          <Check size={17} />
          {message}
          <button onClick={() => setMessage("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}
      {error && <div className="cms-alert error" role="alert">{error}</div>}

      <ListCard
        search={query}
        onSearch={setQuery}
        placeholder="Search job openings..."
        count={filtered.length}
        noun="positions"
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="No job openings found"
            detail="Create open roles for engineering, design, marketing or management to attract candidates to Sipher Web."
          />
        ) : (
          filtered.map((item) => {
            const c = item.content ?? {};
            const dept = item.category || String(c.department ?? "General");
            const loc = String(c.location ?? "Lucknow");
            const exp = String(c.experience ?? "");
            const type = String(c.employmentType ?? "Full-time");
            return (
              <div className="cms-data-row" key={item.id}>
                <span className="cms-row-symbol amber">
                  <BriefcaseBusiness size={18} />
                </span>
                <div className="cms-row-primary">
                  <strong>{item.title}</strong>
                  <span>
                    {dept} <i>·</i> {loc} <i>·</i> {type} {exp && <><i>·</i> {exp}</>}
                  </span>
                </div>
                <button
                  type="button"
                  className="cms-status-toggle"
                  onClick={() => void togglePublish(item)}
                  title={item.is_published ? "Click to set Draft / Closed" : "Click to Publish Live"}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <StatusBadge published={item.is_published} />
                </button>
                <span className="cms-row-order">Order {item.sort_order}</span>
                <RowActions
                  onView={() => {
                    setError("");
                    setMessage("");
                    setEditing(item);
                  }}
                  onEdit={() => {
                    setError("");
                    setMessage("");
                    setEditing(item);
                  }}
                  onDelete={() => void removeJob(item)}
                />
              </div>
            );
          })
        )}
      </ListCard>

      {editing !== undefined && (
        <section className="cms-editor-section cms-library__editor">
          <div className="cms-editor-section-heading">
            <span>
              <Pencil size={18} />
            </span>
            <div>
              <h2>{editing ? `Edit: ${editing.title}` : "Create new job opening"}</h2>
              <p>Fill in the details below. Published positions will appear instantly on the public careers page.</p>
            </div>
          </div>
          <form className="cms-editor-section-body" onSubmit={(event) => void submitJob(event)}>
            <div className="cms-form-grid">
              <TextField
                label="Job title"
                name="title"
                value={editing?.title ?? ""}
                required
                placeholder="e.g. Senior Full-Stack Developer"
                wide
              />
              <TextField
                label="URL slug (optional, auto-generated if empty)"
                name="slug"
                value={editing?.slug ?? ""}
                placeholder="senior-full-stack-developer"
              />
              <label className="cms-field">
                <span>Department / Category *</span>
                <input
                  name="category"
                  defaultValue={editing?.category ?? "Engineering"}
                  list="cms-departments-list"
                  required
                  placeholder="e.g. Engineering, Design, Growth & Marketing"
                />
                <datalist id="cms-departments-list">
                  <option value="Engineering" />
                  <option value="Design" />
                  <option value="Growth & Marketing" />
                  <option value="Infrastructure" />
                  <option value="Sales & Operations" />
                  <option value="Product" />
                </datalist>
              </label>

              <label className="cms-field">
                <span>Employment type *</span>
                <select name="employmentType" defaultValue={currentEmpType} required>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </label>

              <TextField
                label="Location"
                name="location"
                value={currentLocation}
                placeholder="e.g. Lucknow, India (Hybrid) or Remote"
              />

              <TextField
                label="Experience required"
                name="experience"
                value={currentExperience}
                placeholder="e.g. 2 - 4 Years or Fresher"
              />

              <TextField
                label="Salary / Package"
                name="salary"
                value={currentSalary}
                placeholder="e.g. ₹6,00,000 - ₹10,00,000 / year"
              />

              <TextField
                label="Application recipient email"
                name="applyEmail"
                value={currentApplyEmail}
                placeholder="careers@sipherweb.com"
              />

              <TextField
                label="Display order"
                name="sort_order"
                type="number"
                value={editing?.sort_order ?? items.length}
                required
              />

              <CheckField
                label="Publish position live on careers page"
                name="is_published"
                checked={editing?.is_published ?? true}
              />

              <TextAreaField
                label="Role summary / excerpt"
                name="summary"
                value={editing?.summary ?? ""}
                rows={3}
                wide
                help="A concise overview of the role shown on the job card."
              />

              <TextAreaField
                label="Required skills (comma or line separated)"
                name="skills"
                value={currentSkills}
                rows={2}
                wide
                help="e.g. React, TypeScript, Next.js, Tailwind CSS, Laravel, MySQL"
              />

              <TextAreaField
                label="Key responsibilities (one per line)"
                name="responsibilities"
                value={currentResponsibilities}
                rows={5}
                wide
                help="List the main day-to-day duties, one point per line."
              />

              <TextAreaField
                label="Requirements & qualifications (one per line)"
                name="requirements"
                value={currentRequirements}
                rows={5}
                wide
                help="List experience, degree, or technical prerequisites, one per line."
              />

              <TextAreaField
                label="Perks & benefits (one per line)"
                name="benefits"
                value={currentBenefits}
                rows={4}
                wide
                help="List perks like health insurance, flexible hours, equipment, one per line."
              />
            </div>

            <div className="cms-modal-actions">
              <button
                className="cms-button secondary"
                type="button"
                onClick={() => setEditing(undefined)}
                disabled={busy}
              >
                Cancel
              </button>
              <button className="cms-button primary" type="submit" disabled={busy}>
                {busy ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}
                {editing ? "Save job changes" : "Create job position"}
              </button>
            </div>
          </form>
        </section>
      )}
    </section>
  );
}

function ContentLibraryManager({ items, onReload }: { items: CmsLibraryItem[]; onReload: () => Promise<void> }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CmsLibraryItem | null | undefined>(undefined);
  const [newType, setNewType] = useState<CmsLibraryItem["type"]>("blog");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const types: { value: CmsLibraryItem["type"]; label: string }[] = [
    { value: "blog", label: "Blog article" },
    { value: "portfolio", label: "Portfolio project" },
    { value: "product", label: "Product solution" },
    { value: "career", label: "Job opening" },
  ];
  const filtered = items.filter((item) =>
    `${item.type} ${item.title} ${item.slug} ${item.category ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let content: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(String(form.get("content") || "{}"));
      if (!isRecord(parsed)) throw new Error("Content must be a JSON object.");
      content = parsed;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Enter valid JSON content.");
      return;
    }

    const values = {
      type: String(form.get("type")),
      slug: String(form.get("slug")),
      title: String(form.get("title")),
      summary: String(form.get("summary") ?? ""),
      category: String(form.get("category") ?? ""),
      image_path: String(form.get("image_path") ?? ""),
      content,
      sort_order: Number(form.get("sort_order") || 0),
      is_published: form.get("is_published") === "1",
    };
    const file = form.get("image_file");
    const upload = file instanceof File && file.size > 0 ? file : undefined;
    const id = editing?.id;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/admin/content-library${id ? `/${id}` : ""}`, {
        method: upload && id ? "POST" : id ? "PUT" : "POST",
        data: upload
          ? makeFormData(values, "image_file", upload, id ? "PUT" : undefined)
          : values,
      });
      setEditing(undefined);
      await onReload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this content.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: CmsLibraryItem) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/admin/content-library/${item.id}`, { method: "DELETE" });
      await onReload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete this content.");
    } finally {
      setBusy(false);
    }
  }

  const currentType = newType;
  const contentHelp = currentType === "blog"
    ? 'Example: {"date":"2026-10-17","views":0,"readTime":5,"featured":false,"sections":[{"id":"intro","heading":"Introduction","body":["Paragraph text"]}]}'
    : currentType === "portfolio"
      ? 'Example: {"tag":"Web Development"}'
      : 'Example: {"icon":"Code2","imageAlt":"Product preview","highlights":["Feature one"],"goal":"Desired outcome","goalDescription":"How this solution helps"}';
  const editItem = (item: CmsLibraryItem) => {
    setNewType(item.type);
    setEditing(item);
  };

  return (
    <section className="cms-library">
      <div className="cms-library__toolbar">
        <label className="cms-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the content library…" /></label>
        <label className="cms-field"><span>New content type</span><select value={newType} onChange={(event) => setNewType(event.target.value as CmsLibraryItem["type"])}>{types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
        <button className="cms-button primary" type="button" onClick={() => { setError(""); setEditing(null); }}><Plus size={16} /> Add content</button>
      </div>
      {error && <div className="cms-alert error" role="alert">{error}</div>}
      <ListCard search={query} onSearch={setQuery} placeholder="Search the content library…" count={filtered.length} noun="items">
        {filtered.length === 0
          ? <EmptyState title="No content found" detail="Add articles, portfolio projects or product solutions. Unpublished entries stay hidden from public pages." />
          : filtered.map((item) => (
            <div className="cms-data-row" key={item.id}>
              <span className="cms-row-symbol violet"><Sparkles size={18} /></span>
              <div className="cms-row-primary"><strong>{item.title}</strong><span>{types.find(({ value }) => value === item.type)?.label} <i>·</i> /{item.slug} {item.category && <> <i>·</i> {item.category}</>}</span></div>
              <StatusBadge published={item.is_published} />
              <span className="cms-row-order">Order {item.sort_order}</span>
              <RowActions onView={() => editItem(item)} onEdit={() => editItem(item)} onDelete={() => void remove(item)} />
            </div>
          ))}
      </ListCard>
      {editing !== undefined && (
        <section className="cms-editor-section cms-library__editor">
          <div className="cms-editor-section-heading"><span><Pencil size={18} /></span><div><h2>{editing ? "Edit content" : "Add content"}</h2><p>Unpublish a record to keep it in the CMS without displaying it publicly.</p></div></div>
          <form className="cms-editor-section-body" onSubmit={(event) => void submit(event)}>
            <div className="cms-form-grid">
              <label className="cms-field"><span>Content type *</span><select name="type" value={currentType} onChange={(event) => setNewType(event.target.value as CmsLibraryItem["type"])} required>{types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
              <TextField label="URL slug" name="slug" value={editing?.slug ?? ""} required placeholder="clear-url-name" />
              <TextField label="Title" name="title" value={editing?.title ?? ""} required wide />
              <TextField label="Category" name="category" value={editing?.category ?? ""} placeholder="Web Development" />
              <TextField label="Image URL or path" name="image_path" value={editing?.image_path ?? ""} />
              <TextAreaField label="Summary / excerpt" name="summary" value={editing?.summary ?? ""} rows={3} wide />
              <label className="cms-field wide"><span>Or upload a cover image</span><input type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif" /><small>JPG, PNG, WebP or GIF; up to 5 MB.</small></label>
              {editing?.image_path && <div className="cms-library__image-preview"><img src={publicImage(editing.image_path)} alt={`Current image for ${editing.title}`} /></div>}
              <TextField label="Display order" name="sort_order" type="number" value={editing?.sort_order ?? items.filter((item) => item.type === currentType).length} required />
              <CheckField label="Publish on website" name="is_published" checked={editing?.is_published ?? false} />
              <TextAreaField label="Type-specific content (JSON object)" name="content" value={JSON.stringify(editing?.content ?? {}, null, 2)} rows={12} mono wide help={contentHelp} />
            </div>
            <div className="cms-modal-actions"><button className="cms-button secondary" type="button" onClick={() => setEditing(undefined)} disabled={busy}>Cancel</button><button className="cms-button primary" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}{editing ? "Save changes" : "Create content"}</button></div>
          </form>
        </section>
      )}
    </section>
  );
}

function EnquiryList({
  items,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
}: {
  items: ContactEnquiry[];
  search: string;
  onSearch: (value: string) => void;
  onView: (item: ContactEnquiry) => void;
  onEdit: (item: ContactEnquiry) => void;
  onDelete: (item: ContactEnquiry) => void;
}) {
  return (
    <section className="cms-card cms-list-card">
      <div className="cms-list-toolbar">
        <label className="cms-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search enquiries by name, email, phone, service, message…"
          />
        </label>
        <span>
          {items.length} {items.length === 1 ? "enquiry" : "enquiries"}
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No contact enquiries found"
          detail="Enquiries submitted through your contact form will appear here."
        />
      ) : (
        <div className="cms-table-responsive">
          <table className="cms-table cms-enquiry-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Name</th>
                <th style={{ width: "18%" }}>Email</th>
                <th style={{ width: "13%" }}>Phone</th>
                <th style={{ width: "13%" }}>Service</th>
                <th style={{ width: "22%" }}>Message</th>
                <th style={{ width: "10%" }}>Date</th>
                <th style={{ width: "8%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="cms-table-row">
                  <td className="cms-col-name">
                    <div className="cms-user-cell">
                      <span className="cms-user-avatar">
                        {item.name.trim().slice(0, 2).toUpperCase()}
                      </span>
                      <strong title={item.name}>{item.name}</strong>
                    </div>
                  </td>
                  <td className="cms-col-email">
                    <a href={`mailto:${item.email}`} className="cms-cell-link" title={`Email ${item.name}`}>
                      <Mail size={13} />
                      <span>{item.email}</span>
                    </a>
                  </td>
                  <td className="cms-col-phone">
                    <a href={`tel:${item.phone}`} className="cms-cell-link" title={`Call ${item.name}`}>
                      <Phone size={13} />
                      <span>{item.phone}</span>
                    </a>
                  </td>
                  <td className="cms-col-service">
                    <span className="cms-enquiry-badge">
                      {item.service || "General enquiry"}
                    </span>
                  </td>
                  <td className="cms-col-message">
                    <p className="cms-table-message" title={item.message}>
                      {item.message}
                    </p>
                  </td>
                  <td className="cms-col-date">
                    <span className="cms-date-main">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="cms-date-sub">
                      {new Date(item.created_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="cms-col-actions" style={{ textAlign: "right" }}>
                    <div className="cms-row-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        title="View details"
                        aria-label="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Edit enquiry"
                        aria-label="Edit enquiry"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="delete"
                        onClick={() => onDelete(item)}
                        title="Delete enquiry"
                        aria-label="Delete enquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EnquiryModal({
  modal,
  saving,
  onClose,
  onEdit,
  onSubmit,
  onDelete,
}: {
  modal: { record: ContactEnquiry; isEditing: boolean };
  saving: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (record: ContactEnquiry) => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function copyMessage(text: string) {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { record, isEditing } = modal;

  return (
    <div
      className="cms-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="cms-modal" role="dialog" aria-modal="true" aria-labelledby="cms-enquiry-modal-title">
        <header className="cms-modal-heading">
          <div>
            <p className="cms-eyebrow">INBOX</p>
            <h2 id="cms-enquiry-modal-title">
              {isEditing ? "Edit Contact Enquiry" : "Enquiry Details"}
            </h2>
            <p>
              {isEditing
                ? "Update enquiry information or contact details."
                : `Submitted by ${record.name} on ${new Date(record.created_at).toLocaleString()}`}
            </p>
          </div>
          <button className="cms-icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </header>

        {!isEditing ? (
          <div className="cms-record-details">
            <div className="cms-detail-grid">
              <DetailField label="Sender Name" value={record.name} />
              <DetailField label="Service Requested" value={record.service || "General enquiry"} />
              <div className="cms-detail-field">
                <span className="cms-detail-label">Email Address</span>
                <div className="cms-detail-value">
                  <a
                    href={`mailto:${record.email}`}
                    className="cms-link"
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#2563eb", fontWeight: 600 }}
                  >
                    <Mail size={14} /> {record.email} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <div className="cms-detail-field">
                <span className="cms-detail-label">Phone Number</span>
                <div className="cms-detail-value">
                  <a
                    href={`tel:${record.phone}`}
                    className="cms-link"
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#2563eb", fontWeight: 600 }}
                  >
                    <Phone size={14} /> {record.phone} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <DetailField
                label="Date Received"
                value={new Date(record.created_at).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              />
              <div className="cms-detail-field wide">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span className="cms-detail-label">Message Content</span>
                  <button
                    type="button"
                    className="cms-button secondary"
                    style={{ padding: "3px 8px", fontSize: 12 }}
                    onClick={() => copyMessage(record.message)}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy message"}</span>
                  </button>
                </div>
                <div className="cms-enquiry-view-message">{record.message}</div>
              </div>
            </div>

            <footer className="cms-modal-actions" style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                className="cms-button secondary"
                style={{ color: "#b91c1c", borderColor: "#fecaca" }}
                onClick={() => onDelete(record)}
              >
                <Trash2 size={15} /> Delete enquiry
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="cms-button secondary" type="button" onClick={onClose}>
                  Close
                </button>
                <button className="cms-button primary" type="button" onClick={onEdit}>
                  <Pencil size={15} /> Edit enquiry
                </button>
              </div>
            </footer>
          </div>
        ) : (
          <form className="cms-record-form" onSubmit={onSubmit}>
            <div className="cms-form-grid">
              <TextField label="Sender Name" name="name" value={record.name} required />
              <TextField label="Service Requested" name="service" value={record.service ?? ""} placeholder="e.g. Web Development" />
              <TextField label="Email Address" name="email" type="email" value={record.email} required />
              <TextField label="Phone Number" name="phone" value={record.phone} required placeholder="+91 9876543210" />
              <TextAreaField label="Enquiry Message" name="message" value={record.message} required wide rows={6} />
            </div>

            <footer className="cms-modal-actions">
              <button className="cms-button secondary" type="button" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button className="cms-button primary" type="submit" disabled={saving}>
                {saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />}
                <span>Save changes</span>
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}

function NewsletterSubscriberList({ items, search, onSearch }: { items: NewsletterSubscriber[]; search: string; onSearch: (value: string) => void }) {
  return <ListCard search={search} onSearch={onSearch} placeholder="Search subscribers…" count={items.length} noun="subscribers">
    {items.length === 0
      ? <EmptyState title="No newsletter subscribers found" detail="Emails submitted through the public newsletter form will appear here." />
      : items.map((item) => <article className="cms-data-row cms-enquiry-row cms-newsletter-row" key={item.id}>
        <span className="cms-row-symbol violet"><Mail size={18} /></span>
        <div className="cms-row-primary">
          <strong><a href={`mailto:${item.email}`}>{item.email}</a></strong>
          <span>Newsletter subscriber</span>
        </div>
        <time className="cms-row-order" dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time>
      </article>)}
  </ListCard>;
}

function ListCard({ search, onSearch, placeholder, count, noun, children }: { search: string; onSearch: (value: string) => void; placeholder: string; count: number; noun: string; children: ReactNode }) {
  return <section className="cms-card cms-list-card"><div className="cms-list-toolbar"><label className="cms-search"><Search size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} /></label><span>{count} {noun}</span></div><div className="cms-list">{children}</div></section>;
}

function StatusBadge({ published }: { published: boolean }) {
  return <span className={`cms-status ${published ? "live" : "draft"}`}><i />{published ? "Published" : "Draft"}</span>;
}

function RowActions({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return <div className="cms-row-actions"><button type="button" onClick={onView} title="View details" aria-label="View details"><Eye size={16} /></button><button type="button" onClick={onEdit} title="Edit" aria-label="Edit"><Pencil size={16} /></button><button type="button" className="delete" onClick={onDelete} title="Delete" aria-label="Delete"><Trash2 size={16} /></button></div>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="cms-empty"><span><Boxes size={20} /></span><strong>{title}</strong><p>{detail}</p></div>;
}

function RecordModal({ modal, categories, saving, onClose, onSubmit }: { modal: { type: "category" | "service" | "person"; record?: Category | Service | Person; startInEdit?: boolean }; categories: Category[]; saving: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [editing, setEditing] = useState(modal.startInEdit ?? !modal.record);
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return <div className="cms-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="cms-modal" role="dialog" aria-modal="true" aria-labelledby="cms-modal-title"><header className="cms-modal-heading"><div><p className="cms-eyebrow">{modal.type === "person" ? "PEOPLE" : "OFFERINGS"}</p><h2 id="cms-modal-title">{modal.record && !editing ? "Details" : modal.record ? "Edit" : "Add"} {modal.type === "person" ? "profile" : modal.type}</h2><p>{editing ? "Keep the details clear, helpful and ready to publish." : "Review the saved information for this item."}</p></div><button className="cms-icon-button" type="button" onClick={onClose} aria-label="Close"><X size={19} /></button></header>
    {!editing && modal.record ? <RecordDetails record={modal.record} type={modal.type} categories={categories} onEdit={() => setEditing(true)} onClose={onClose} /> : <form className="cms-record-form" onSubmit={onSubmit} key={`${modal.type}-${modal.record?.id ?? "new"}`}>
      {modal.type === "category" && <CategoryFields record={modal.record as Category | undefined} />}
      {modal.type === "service" && <ServiceFields record={modal.record as Service | undefined} categories={categories} />}
      {modal.type === "person" && <PersonFields record={modal.record as Person | undefined} />}
      <footer className="cms-modal-actions"><button className="cms-button secondary" type="button" onClick={() => modal.record ? setEditing(false) : onClose()} disabled={saving}>Cancel</button><button className="cms-button primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />} {modal.record ? "Save changes" : "Create"}</button></footer>
    </form>}
  </section></div>;
}

function RecordDetails({ record, type, categories, onEdit, onClose }: { record: Category | Service | Person; type: "category" | "service" | "person"; categories: Category[]; onEdit: () => void; onClose: () => void }) {
  const details: [string, unknown][] = type === "category"
    ? [
      ["Name", (record as Category).name],
      ["URL slug", (record as Category).slug],
      ["Display number", (record as Category).number],
      ["Statement", (record as Category).statement],
      ["Description", (record as Category).description],
      ["Icon", (record as Category).icon],
      ["Image", (record as Category).image_path],
      ["Display order", (record as Category).sort_order],
      ["Publication", (record as Category).is_published ? "Published" : "Draft"],
    ]
    : type === "service"
      ? [
        ["Title", (record as Service).title],
        ["URL slug", (record as Service).slug],
        ["Category", categories.find((category) => category.id === (record as Service).service_category_id)?.name],
        ["Description", (record as Service).description],
        ["Introduction", (record as Service).intro],
        ["Capabilities", (record as Service).capabilities],
        ["Deliverables", (record as Service).deliverables],
        ["Benefits", (record as Service).benefits],
        ["FAQs", (record as Service).faqs],
        ["Publication", (record as Service).is_published ? "Published" : "Draft"],
      ]
      : [
        ["Name", (record as Person).name],
        ["Role", (record as Person).role],
        ["Profile type", (record as Person).profile_type === "team" ? "Team member" : "Leadership"],
        ["URL slug", (record as Person).slug],
        ["Photo", (record as Person).photo],
        ["Details", (record as Person).details],
        ["Biography", (record as Person).bio],
        ["Leadership message title", (record as Person).message_title],
        ["Leadership message", (record as Person).message],
        ["Publication", (record as Person).is_published ? "Published" : "Draft"],
      ];

  return <div className="cms-record-details">
    <div className="cms-detail-grid">{details.map(([label, value]) => <DetailField key={label} label={label} value={value} wide={["Description", "Introduction", "Capabilities", "Deliverables", "Benefits", "FAQs", "Details", "Biography", "Leadership message"].includes(label)} />)}</div>
    <footer className="cms-modal-actions"><button className="cms-button secondary" type="button" onClick={onClose}>Close</button><button className="cms-button primary" type="button" onClick={onEdit}><Pencil size={16} /> Edit details</button></footer>
  </div>;
}

function CategoryFields({ record }: { record?: Category }) {
  return <div className="cms-form-grid">
    <TextField label="Category name" name="name" value={record?.name} required />
    <TextField label="URL slug" name="slug" value={record?.slug} required placeholder="digital-growth" />
    <TextField label="Display number" name="number" value={record?.number} placeholder="01" />
    <TextField label="Icon name" name="icon" value={record?.icon} placeholder="Braces" />
    <TextField label="Statement" name="statement" value={record?.statement} wide />
    <TextAreaField label="Description" name="description" value={record?.description ?? ""} wide rows={3} />
    <TextField label="Image URL or path" name="image_path" value={record?.image_path} wide />
    <label className="cms-field wide"><span>Or upload an image</span><input type="file" name="image_file" accept="image/*" /><small>JPG, PNG, WebP up to 5 MB.</small></label>
    <TextField label="Display order" name="sort_order" type="number" value={record?.sort_order ?? 0} required />
    <CheckField label="Publish on website" name="is_published" checked={record?.is_published ?? false} />
  </div>;
}

function ServiceFields({ record, categories }: { record?: Service; categories: Category[] }) {
  return <div className="cms-form-grid">
    <TextField label="Service title" name="title" value={record?.title} required />
    <TextField label="URL slug" name="slug" value={record?.slug} required placeholder="web-development" />
    <label className="cms-field wide"><span>Service category *</span><select name="service_category_id" defaultValue={record?.service_category_id ?? ""} required><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <TextField label="Icon name" name="icon" value={record?.icon} placeholder="Code2" />
    <TextField label="Hero image URL or path" name="hero_image" value={record?.hero_image} />
    <label className="cms-field wide"><span>Or upload a hero image</span><input type="file" name="hero_image_file" accept="image/*" /><small>JPG, PNG, WebP up to 5 MB.</small></label>
    <TextAreaField label="Short description" name="description" value={record?.description ?? ""} wide rows={3} />
    <TextAreaField label="Introduction" name="intro" value={record?.intro ?? ""} wide rows={4} />
    <TextAreaField label="Capabilities" name="capabilities" value={arrayToLines(record?.capabilities)} help="One item per line." />
    <TextAreaField label="Deliverables" name="deliverables" value={arrayToLines(record?.deliverables)} help="One item per line." />
    <TextAreaField label="Benefits" name="benefits" value={arrayToLines(record?.benefits)} help="One item per line." />
    <TextAreaField label="FAQs (JSON)" name="faqs" value={JSON.stringify(record?.faqs ?? [], null, 2)} help='Array of {"question":"…","answer":"…"} items.' wide rows={6} mono />
    <TextField label="Display order" name="sort_order" type="number" value={record?.sort_order ?? 0} required />
    <CheckField label="Publish on website" name="is_published" checked={record?.is_published ?? false} />
  </div>;
}

function PersonFields({ record }: { record?: Person }) {
  const [photo, setPhoto] = useState(record?.photo ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedPhoto) {
      setUploadPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(selectedPhoto);
    setUploadPreview(objectUrl);
    setPreviewFailed(false);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  const preview = uploadPreview || (photo ? publicImage(photo) : "");

  return <div className="cms-form-grid">
    <TextField label="Full name" name="name" value={record?.name} required />
    <TextField label="Role or title" name="role" value={record?.role} required />
    <TextField label="URL slug" name="slug" value={record?.slug} required placeholder="jane-doe" />
    <label className="cms-field"><span>Profile type *</span><select name="profile_type" defaultValue={record?.profile_type ?? "team"}><option value="team">Team member</option><option value="leadership">Leadership</option></select></label>
    <label className="cms-field wide"><span>Photo URL or storage path</span><input name="photo" value={photo} onChange={(event) => { setPhoto(event.target.value); setSelectedPhoto(null); setPreviewFailed(false); if (photoInput.current) photoInput.current.value = ""; }} placeholder="https://… or cms/people/photo.jpg" /><small>Use a public image URL or select an upload below.</small></label>
    <div className="cms-person-photo-editor">
      <div className="cms-person-photo-preview">
        {preview && !previewFailed ? <img src={preview} alt={`Preview of ${record?.name ?? "profile photo"}`} onError={() => setPreviewFailed(true)} /> : <span><UserRound size={26} /></span>}
      </div>
      <div className="cms-person-photo-controls">
        <label className="cms-field"><span>Upload or replace profile photo</span><input ref={photoInput} type="file" name="photo_file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { setSelectedPhoto(event.target.files?.[0] ?? null); setPreviewFailed(false); }} /><small>JPG, PNG, WebP or GIF, up to 5 MB. The current photo stays until you choose a replacement.</small></label>
        {(photo || selectedPhoto) && <button className="cms-text-button" type="button" onClick={() => { setPhoto(""); setSelectedPhoto(null); setPreviewFailed(false); if (photoInput.current) photoInput.current.value = ""; }}>Remove photo</button>}
      </div>
    </div>
    <TextAreaField label="Details" name="details" value={record?.details ?? ""} wide rows={3} />
    <TextField label="Leadership message title" name="message_title" value={record?.message_title} wide />
    <TextAreaField label="Leadership message" name="message" value={record?.message ?? ""} wide rows={4} />
    <TextAreaField label="Biography" name="bio" value={record?.bio ?? ""} wide rows={5} />
    <TextField label="Display order" name="sort_order" type="number" value={record?.sort_order ?? 0} required />
    <CheckField label="Publish on website" name="is_published" checked={record?.is_published ?? false} />
  </div>;
}

function profilePayload(form: FormData): Record<string, unknown> {
  return {
    name: stringValue(form, "name"),
    brand_name: stringValue(form, "brand_name"),
    tagline: stringValue(form, "tagline"),
    website: stringValue(form, "website"),
    email: stringValue(form, "email"),
    phone_country_code: stringValue(form, "phone_country_code"),
    phone_number: stringValue(form, "phone_number"),
    whatsapp_number: stringValue(form, "whatsapp_number"),
    business_hours: stringValue(form, "business_hours"),
    address: stringValue(form, "address"),
    location_label: stringValue(form, "location_label"),
    map_location_url: stringValue(form, "map_location_url"),
    map_directions_url: stringValue(form, "map_directions_url"),
    latitude: numberOrNull(form.get("latitude")),
    longitude: numberOrNull(form.get("longitude")),
    socials: parseJsonField(form, "socials", []),
    approved_clients: parseJsonField(form, "approved_clients", []),
    brochure_enabled: form.has("brochure_enabled"),
    external_leads_enabled: form.has("external_leads_enabled"),
    external_leads_url: stringValue(form, "external_leads_url"),
    external_leads_key: stringValue(form, "external_leads_key"),
  };
}

function recordPayload(form: FormData, type: "category" | "service" | "person"): Record<string, unknown> {
  const common = {
    name: stringValue(form, "name"),
    slug: stringValue(form, "slug"),
    sort_order: Number(form.get("sort_order") || 0),
    is_published: form.has("is_published"),
  };
  if (type === "category") {
    return { ...common, number: stringValue(form, "number"), statement: stringValue(form, "statement"), description: stringValue(form, "description"), icon: stringValue(form, "icon"), image_path: stringValue(form, "image_path") };
  }
  if (type === "person") {
    return {
      profile_type: stringValue(form, "profile_type"),
      slug: common.slug, name: common.name, sort_order: common.sort_order, is_published: common.is_published,
      role: stringValue(form, "role"), photo: stringValue(form, "photo"), details: stringValue(form, "details"),
      message_title: stringValue(form, "message_title"), message: stringValue(form, "message"), bio: stringValue(form, "bio"),
    };
  }
  return {
    ...common,
    service_category_id: Number(form.get("service_category_id")),
    description: stringValue(form, "description"),
    intro: stringValue(form, "intro"),
    icon: stringValue(form, "icon"),
    hero_image: stringValue(form, "hero_image"),
    capabilities: linesToArray(stringValue(form, "capabilities")),
    deliverables: linesToArray(stringValue(form, "deliverables")),
    benefits: linesToArray(stringValue(form, "benefits")),
    faqs: parseJsonField(form, "faqs", []),
  };
}

function parseJsonField(form: FormData, key: string, fallback: unknown): unknown {
  const value = stringValue(form, key).trim();
  if (!value) return fallback;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error(`${key.split("_").join(" ")} must be valid JSON.`);
  }
}

function stringValue(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numberOrNull(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function publicImage(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
  const baseOrigin = API_BASE ? new URL(API_BASE, window.location.origin).origin : window.location.origin;
  return `${baseOrigin}/storage/${path.replace(/^\/+/, "")}`;
}
