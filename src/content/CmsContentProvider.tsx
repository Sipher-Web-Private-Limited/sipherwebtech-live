import {
  AppWindow,
  BarChart3,
  Bot,
  Braces,
  Code2,
  LayoutTemplate,
  Megaphone,
  Palette,
  PenTool,
  Search,
  ServerCog,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import "./CmsContentProvider.css";
import { cmsApiBase } from "./cmsApi";

type SocialLink = { label: string; icon: string; href: string };
type ProcessStep = [string, string, string];
type CompanyProfile = {
  name: string;
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  loaderImageUrl: string;
  brochureUrl: string;
  brochureName: string;
  brochureEnabled: boolean;
  tagline: string;
  website: string;
  email: string;
  businessHours: string;
  phone: { display: string; telUrl: string; whatsappUrl: string };
  whatsapp: { display: string; url: string };
  address: string;
  locationLabel: string;
  maps: {
    locationUrl: string;
    directionsUrl: string;
    coordinates: { latitude: number | null; longitude: number | null };
  };
  socials: Record<string, SocialLink>;
  approvedClients: string[];
};
type ServiceSummary = {
  title: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  category: string;
};
type ServiceCategory = {
  id: string;
  number: string;
  title: string;
  statement: string;
  description: string;
  icon: LucideIcon;
  imagePath?: string;
  services: ServiceSummary[];
};
type ServiceDetail = {
  title: string;
  category: string;
  intro: string;
  heroImage?: string;
  capabilities: string[];
  deliverables: string[];
  benefits?: string[];
  faqs?: { q: string; a: string }[];
};
type Person = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  details: string;
  messageTitle?: string;
  message?: string;
  bio?: string;
};
type CmsContent = {
  companyProfile: CompanyProfile;
  activeCompanySocials: SocialLink[];
  companyMapEmbedUrl: string;
  serviceCategories: ServiceCategory[];
  allServices: ServiceSummary[];
  serviceDetails: Record<string, ServiceDetail>;
  processSteps: ProcessStep[];
  members: Person[];
  leaders: Person[];
  aboutContent: Record<string, string>;
  approvedClients: string[];
};
type CmsContentContextValue = CmsContent & {
  refreshContent: () => Promise<boolean>;
};

type ApiProfile = {
  name: string;
  brandName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  loaderImageUrl: string | null;
  brochureUrl?: string | null;
  brochureName?: string | null;
  brochureEnabled?: boolean;
  tagline: string | null;
  website: string | null;
  email: string;
  businessHours: string | null;
  phone: { display: string; telUrl: string; whatsappUrl: string | null };
  whatsapp: { display: string | null; url: string | null };
  address: string | null;
  locationLabel: string | null;
  maps: {
    locationUrl: string | null;
    directionsUrl: string | null;
    coordinates: { latitude: number | null; longitude: number | null };
  };
  socials: SocialLink[];
  about: Record<string, string>;
  approvedClients?: string[];
};
type ApiService = {
  title: string;
  slug: string;
  description: string | null;
  intro: string | null;
  icon: string | null;
  heroImage: string | null;
  capabilities: string[];
  deliverables: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
};
type ApiCategory = {
  name: string;
  title: string;
  slug: string;
  number: string | null;
  statement: string | null;
  description: string | null;
  icon: string | null;
  imagePath: string | null;
  services: ApiService[];
};
type ApiPerson = {
  profileType: "team" | "leadership";
  slug: string;
  name: string;
  role: string;
  photo: string | null;
  details: string | null;
  messageTitle: string | null;
  message: string | null;
  bio: string | null;
};
type ApiPublicContent = {
  profile: ApiProfile;
  categories: ApiCategory[];
  people: ApiPerson[];
};
type ApiEnvelope<T> = { data: T };

const iconMap: Record<string, LucideIcon> = {
  AppWindow,
  BarChart3,
  Bot,
  Braces,
  Code2,
  LayoutTemplate,
  Megaphone,
  Palette,
  PenTool,
  Search,
  ServerCog,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
};

const initialProfile: CompanyProfile = {
  name: "Sipher Web Pvt. Ltd.",
  brandName: "Sipher Web",
  logoUrl: "/new-images/logo/sw_logo.webp",
  faviconUrl: "/favicon.png",
  loaderImageUrl: "/new-images/logo/sw_logo.webp",
  brochureUrl: "/Sipher_Web_Brochure.pdf",
  brochureName: "Sipher_Web_Brochure.pdf",
  brochureEnabled: true,
  tagline: "Committed to Excellence",
  website: "https://www.sipherwebtech.com",
  email: "director@sipherwebtech.com",
  businessHours: "Mon - Fri, 9AM - 6PM",
  phone: {
    display: "+91 83182 30713",
    telUrl: "tel:+918318230713",
    whatsappUrl: "https://wa.me/918318230713",
  },
  whatsapp: { display: "+91 83182 30713", url: "https://wa.me/918318230713" },
  address: "C-1/364, Near Muglai Hutz, Tedhi Pulia, Sector G, Uttar Pradesh, 226022",
  locationLabel: "Lucknow, India",
  maps: {
    locationUrl: "https://maps.app.goo.gl/yyLV3AHJABcUZ6BJ7",
    directionsUrl: "https://maps.app.goo.gl/ZtCU8u1FNPbCCMxp6so",
    coordinates: { latitude: 26.9094535, longitude: 80.9580952 },
  },
  socials: {
    whatsapp: { label: "WhatsApp", icon: "WhatsApp", href: "https://wa.me/918318230713" },
    linkedin: {
      label: "LinkedIn",
      icon: "LinkedIn",
      href: "https://www.linkedin.com/company/sipher-web-private-limited/posts/",
    },
    facebook: {
      label: "Facebook",
      icon: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61558093163571",
    },
    instagram: { label: "Instagram", icon: "Instagram", href: "https://www.instagram.com/sipherwebit/" },
  },
  approvedClients: [
    "ZenMedia",
    "AlphaStudio",
    "BlueForge",
    "CrestGroup",
    "OmniLogic",
    "StellarBrand",
    "VistaCorp",
    "PrimeEdge",
  ],
};

const initialAboutContent: Record<string, string> = {
<<<<<<< HEAD
  visionImage: "/new-images/home/technology.webp",
  creativeImage: "/new-images/services/sec-creative.webp",
  homeArchitectureImage: "/new-images/home/technology.webp",
  homeCreativeImage: "/new-images/home/What_we_do_3.webp",
  homeGrowthImage: "/new-images/home/What_we_do_1.webp",
  homeTechnologyImage: "/new-images/home/What_we_do_2.webp",
  teamHeroImage: "/new-images/team/team-hero.webp",
  contactHeroImage: "/new-images/contact/contact-hero.webp",
  contactOfficeImage: "/new-images/contact/contact-form.webp",
  contactBuildingImage: "/new-images/contact/contact-office.webp",
  contactCard1Image: "/new-images/contact/card1.webp",
  contactCard2Image: "/new-images/contact/card2.webp",
  contactCard3Image: "/new-images/contact/card3.webp",
  contactCard4Image: "/new-images/contact/card4.webp",
  servicesHeroImage: "/new-images/services/service-hero.webp",
  servicesCtaImage: "/new-images/services/cta-section.webp",
=======
  headline: "Empowering Your Digital Future",
  intro: "At Sipher Web, we empower businesses to turn ideas into meaningful digital experiences through technology, creativity and connected thinking.",
  vision: "Our vision is to be a catalyst for digital transformation, helping businesses adapt, grow and thrive through thoughtful technology and exceptional digital experiences.",
  mission: "We look beyond the immediate task to understand the people, goals and opportunities behind every challenge.",
  visionImage: "/images/home/technology.png",
  creativeImage: "/images/services/sec-creative.png",
  homeArchitectureImage: "/images/home/technology.png",
  homeCreativeImage: "/images/home/What_we_do_3.png",
  homeGrowthImage: "/images/home/What_we_do_1.png",
  homeTechnologyImage: "/images/home/What_we_do_2.png",
  teamHeroImage: "/images/team/team-hero.png",
  contactHeroImage: "/images/contact/contact-hero.png",
  contactOfficeImage: "/images/contact/contact-form.png",
  contactBuildingImage: "/images/contact/contact-office.png",
  contactCard1Image: "/images/contact/card1.png",
  contactCard2Image: "/images/contact/card2.png",
  contactCard3Image: "/images/contact/card3.png",
  contactCard4Image: "/images/contact/card4.png",
  servicesHeroImage: "/images/services/service-hero.png",
  servicesCtaImage: "/images/services/cta-section.png",
  processStep1Number: "01",
  processStep1Title: "Discover",
  processStep1Copy: "Understand your goals, users and current reality.",
  processStep2Number: "02",
  processStep2Title: "Strategize",
  processStep2Copy: "Define priorities, direction and the right approach.",
  processStep3Number: "03",
  processStep3Title: "Design",
  processStep3Copy: "Create journeys, systems and visual experiences.",
  processStep4Number: "04",
  processStep4Title: "Build",
  processStep4Copy: "Develop with the appropriate technology stack.",
  processStep5Number: "05",
  processStep5Title: "Test",
  processStep5Copy: "Validate function, performance, responsiveness and security.",
  processStep6Number: "06",
  processStep6Title: "Launch",
  processStep6Copy: "Deploy the final product and make it ready for users.",
  processStep7Number: "07",
  processStep7Title: "Grow",
  processStep7Copy: "Maintain, optimize and improve the solution over time.",
>>>>>>> 4ba69e735e57c72ad816cd43bc7207b108d0d861
};

const initialProcessSteps: ProcessStep[] = [
  ["01", "Discover", "Understand your goals, users and current reality."],
  ["02", "Strategize", "Define priorities, direction and the right approach."],
  ["03", "Design", "Create journeys, systems and visual experiences."],
  ["04", "Build", "Develop with the appropriate technology stack."],
  ["05", "Test", "Validate function, performance, responsiveness and security."],
  ["06", "Launch", "Deploy the final product and make it ready for users."],
  ["07", "Grow", "Maintain, optimize and improve the solution over time."],
];

const initialContent: CmsContent = {
  companyProfile: initialProfile,
  activeCompanySocials: Object.values(initialProfile.socials),
  companyMapEmbedUrl: "https://www.google.com/maps?q=26.9094535%2C80.9580952&z=17&output=embed",
  serviceCategories: [],
  allServices: [],
  serviceDetails: {},
  processSteps: initialProcessSteps,
  members: [],
  leaders: [],
  aboutContent: initialAboutContent,
  approvedClients: initialProfile.approvedClients,
};

const CmsContentContext = createContext<CmsContentContextValue>({
  ...initialContent,
  refreshContent: async () => false,
});

export function resolveCmsText(
  value: string | undefined,
  fallback: string,
  profile: Pick<CompanyProfile, "brandName" | "name">,
): string {
  return (value?.trim() || fallback)
    .split("{{brandName}}").join(profile.brandName)
    .split("{{companyName}}").join(profile.name);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getData<T>(baseUrl: string, path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`CMS request ${path} failed with HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !("data" in payload)) {
    throw new Error(`CMS request ${path} returned an invalid response.`);
  }

  return payload.data as T;
}

function profileFromApi(api: ApiProfile): {
  companyProfile: CompanyProfile;
  activeCompanySocials: SocialLink[];
  companyMapEmbedUrl: string;
} {
  const socials = Object.fromEntries(
    api.socials.map((social) => [
      social.label.toLowerCase().replace(/[^a-z0-9]+/g, ""),
      social,
    ]),
  );
  const latitude = api.maps.coordinates.latitude;
  const longitude = api.maps.coordinates.longitude;
  const mapQuery = latitude !== null && longitude !== null
    ? `${latitude},${longitude}`
    : [api.locationLabel, api.address].filter(Boolean).join(", ") || api.name;
  const encodedMapQuery = encodeURIComponent(mapQuery);
  const mapLocationUrl = api.maps.locationUrl
    ?? `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`;
  const companyProfile: CompanyProfile = {
    name: api.name,
    brandName: api.brandName,
    logoUrl: api.logoUrl ?? "",
    faviconUrl: api.faviconUrl ?? "",
    loaderImageUrl: api.loaderImageUrl ?? api.logoUrl ?? "",
    brochureUrl: api.brochureUrl ?? "",
    brochureName: api.brochureName ?? "Sipher_Web_Brochure.pdf",
    brochureEnabled: api.brochureEnabled ?? false,
    tagline: api.tagline ?? "",
    website: api.website ?? "",
    email: api.email,
    businessHours: api.businessHours ?? "",
    phone: {
      display: api.phone.display,
      telUrl: api.phone.telUrl,
      whatsappUrl: api.phone.whatsappUrl ?? "",
    },
    whatsapp: {
      display: api.whatsapp.display ?? "",
      url: api.whatsapp.url ?? "",
    },
    address: api.address ?? "",
    locationLabel: api.locationLabel ?? "",
    maps: {
      locationUrl: mapLocationUrl,
      directionsUrl: api.maps.directionsUrl
        ?? `https://www.google.com/maps/dir/?api=1&destination=${encodedMapQuery}`,
      coordinates: { latitude, longitude },
    },
    socials,
    approvedClients: Array.isArray(api.approvedClients) && api.approvedClients.length > 0
      ? api.approvedClients
      : initialProfile.approvedClients,
  };

  return {
    companyProfile,
    activeCompanySocials: api.socials,
    companyMapEmbedUrl: `https://www.google.com/maps?q=${encodedMapQuery}&z=17&output=embed`,
  };
}

function contentFromApi(
  profile: ApiProfile,
  categories: ApiCategory[],
  people: ApiPerson[],
): CmsContent {
  const normalizedCategories: ServiceCategory[] = categories.map((category, categoryIndex) => ({
    id: category.slug,
    number: category.number ?? String(categoryIndex + 1).padStart(2, "0"),
    title: category.title || category.name,
    statement: category.statement ?? "",
    description: category.description ?? "",
    icon: iconMap[category.icon ?? ""] ?? Braces,
    imagePath: category.imagePath ?? undefined,
    services: category.services.map((service) => ({
      title: service.title,
      slug: service.slug,
      icon: iconMap[service.icon ?? ""] ?? Code2,
      description: service.description ?? "",
      category: category.title || category.name,
    })),
  }));
  const details: Record<string, ServiceDetail> = {};

  for (const category of categories) {
    for (const service of category.services) {
      details[service.slug] = {
        title: service.title,
        category: category.title || category.name,
        intro: service.intro ?? service.description ?? "",
        heroImage: service.heroImage ?? undefined,
        capabilities: service.capabilities ?? [],
        deliverables: service.deliverables ?? [],
        benefits: service.benefits ?? [],
        faqs: service.faqs.map(({ question, answer }) => ({ q: question, a: answer })),
      };
    }
  }

  const normalizedPeople = (person: ApiPerson): Person => ({
    slug: person.slug,
    name: person.name,
    role: person.role,
    photo: person.photo ?? "",
    details: person.details ?? person.bio ?? "",
    messageTitle: person.messageTitle ?? "",
    message: person.message ?? "",
    bio: person.bio ?? "",
  });
  const profileContent = profileFromApi(profile);
  const processStepIndexes = Object.keys(profile.about)
    .map((key) => /^processStep(\d+)Title$/.exec(key)?.[1])
    .filter((index): index is string => index !== undefined)
    .map(Number)
    .sort((a, b) => a - b);
  const liveProcessSteps = processStepIndexes.flatMap((index): ProcessStep[] => {
    const title = profile.about[`processStep${index}Title`]?.trim();
    const description = profile.about[`processStep${index}Copy`]?.trim();
    if (!title || !description) return [];
    return [[profile.about[`processStep${index}Number`]?.trim() || String(index).padStart(2, "0"), title, description]];
  });

  return {
    ...profileContent,
    serviceCategories: normalizedCategories,
    allServices: normalizedCategories.flatMap((category) =>
      category.services.map((service) => ({ ...service })),
    ),
    serviceDetails: details,
    processSteps: liveProcessSteps.length > 0 ? liveProcessSteps : initialProcessSteps,
    members: people.filter((person) => person.profileType === "team").map(normalizedPeople),
    leaders: people.filter((person) => person.profileType === "leadership").map(normalizedPeople),
    approvedClients: profileContent.companyProfile.approvedClients,
    aboutContent: {
      ...initialAboutContent,
      ...Object.fromEntries(
        Object.entries(profile.about).filter(([, value]) => value.trim() !== ""),
      ),
    },
  };
}

export function CmsContentProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const lastLoggedError = useRef<string | null>(null);
  const loadContent = useCallback(async (signal?: AbortSignal): Promise<boolean> => {
    if (!cmsApiBase) return false;

    try {
      const requestSignal = signal ?? new AbortController().signal;
      const { profile, categories, people } = await getData<ApiPublicContent>(cmsApiBase, "/content", requestSignal);
      if (signal?.aborted) return false;
      setContent(contentFromApi(profile, categories, people));
      setError(null);
      lastLoggedError.current = null;
      return true;
    } catch (cause: unknown) {
      if (signal?.aborted) return false;
      const message = cause instanceof Error ? cause.message : "Unknown API error.";
      if (lastLoggedError.current !== message) {
        console.error("Unable to load live CMS content.", cause);
        lastLoggedError.current = message;
      }
      setError(`Live site content could not be loaded or refreshed. ${message}`);
      return false;
    }
  }, []);

  const refreshContent = useCallback(() => loadContent(), [loadContent]);

  useEffect(() => {
    if (!cmsApiBase) return;

    const controller = new AbortController();
    void loadContent(controller.signal);

    return () => controller.abort();
  }, [loadContent]);

  useEffect(() => {
    if (!cmsApiBase) return;

    let wasHidden = document.visibilityState === "hidden";
    const refreshWhenVisible = () => {
      const isVisible = document.visibilityState === "visible";
      if (wasHidden && isVisible) void loadContent();
      wasHidden = !isVisible;
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => document.removeEventListener("visibilitychange", refreshWhenVisible);
  }, [loadContent]);

  const value = useMemo(() => ({ ...content, refreshContent }), [content, refreshContent]);
  const isAdminPage = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  useEffect(() => {
    const rawUrl = content.companyProfile.faviconUrl;
    if (!rawUrl) return;

    try {
      const targetUrl = new URL(rawUrl, window.location.origin).href;
      const testImg = new Image();
      testImg.onload = () => {
        const iconLinks = document.querySelectorAll<HTMLLinkElement>(
          'link[rel="icon"], link[rel="shortcut icon"]',
        );
        if (iconLinks.length === 0) {
          const newIcon = document.createElement("link");
          newIcon.rel = "icon";
          newIcon.href = targetUrl;
          document.head.appendChild(newIcon);
        } else {
          iconLinks.forEach((link) => {
            link.href = targetUrl;
          });
        }
      };
      testImg.src = targetUrl;
    } catch {
      // Ignore invalid URL, keep default icons from index.html
    }
  }, [content.companyProfile.faviconUrl]);

  return (
    <CmsContentContext.Provider value={value}>
      {error && isAdminPage && (
        <div className="cms-api-error" role="alert">
          {error}
        </div>
      )}
      {children}
    </CmsContentContext.Provider>
  );
}

export function useCmsContent(): CmsContentContextValue {
  return useContext(CmsContentContext);
}
