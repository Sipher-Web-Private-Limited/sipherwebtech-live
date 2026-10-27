import { useEffect, useState } from "react";
import { cmsApiBase } from "./cmsApi";

export type ContentType = "blog" | "portfolio" | "product" | "career";

export type ContentItem = {
  id: number;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string | null;
  sortOrder: number;
};

export type BlogSection = { id: string; heading: string; body: string[] };
export type BlogPost = ContentItem & {
  date: string;
  views: number;
  readTime: number;
  featured: boolean;
  sections: BlogSection[];
  authorName?: string;
  authorRole?: string;
};

export type PortfolioProject = ContentItem & { tag: string };

export type CareerJob = ContentItem & {
  department?: string;
  employmentType?: string;
  location?: string;
  experience?: string;
  salary?: string;
  applyEmail?: string;
  skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
};
export type Product = ContentItem & {
  icon: string;
  imageAlt: string;
  highlights: string[];
  goal: string;
  goalDescription: string;
};

type State<T> = { items: T[]; loading: boolean; error: string };

export function useContentLibrary<T extends ContentItem>(type: ContentType): State<T> {
  const [state, setState] = useState<State<T>>({ items: [], loading: true, error: "" });

  useEffect(() => {
    if (!cmsApiBase) {
      setState({ items: [], loading: false, error: "Content is not configured." });
      return;
    }

    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: "" }));
    fetch(`${cmsApiBase}/content-library/${type}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Content request failed (HTTP ${response.status}).`);
        const payload: unknown = await response.json();
        if (typeof payload !== "object" || payload === null || !("data" in payload) || !Array.isArray(payload.data)) {
          throw new Error("The content service returned an invalid response.");
        }
        setState({ items: payload.data as T[], loading: false, error: "" });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          items: [],
          loading: false,
          error: cause instanceof Error ? cause.message : "Could not load content.",
        });
      });

    return () => controller.abort();
  }, [type]);

  return state;
}

export function formatContentDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
