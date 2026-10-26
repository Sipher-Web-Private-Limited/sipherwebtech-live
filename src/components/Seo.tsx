import { useEffect } from "react";
import { useCmsContent } from "../content/CmsContentProvider";

export default function Seo({ title, description }: { title: string; description: string }) {
  const { companyProfile } = useCmsContent();

  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, attr: string, value: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        const [key, name] = attr.split("=");
        element.setAttribute(key, name);
        document.head.appendChild(element);
      }
      element.content = value;
    };
    setMeta('meta[name="description"]', "name=description", description);
    setMeta('meta[property="og:title"]', "property=og:title", title);
    setMeta('meta[property="og:description"]', "property=og:description", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = new URL(
      window.location.pathname,
      companyProfile.website || window.location.origin,
    ).href;
  }, [companyProfile.website, description, title]);
  return null;
}
