import { ArrowUpRight, BriefcaseBusiness, Newspaper, PackageOpen } from "lucide-react";
import Seo from "../components/Seo";
import { Reveal } from "../components/animations/Primitives";
import Button from "../components/ui/Button";
import { useCmsContent } from "../content/CmsContentProvider";

type PageKind = "products" | "blog" | "careers";

const content: Record<PageKind, { eyebrow: string; title: string; accent: string; copy: string; note: string; cta: string }> = {
  products: { eyebrow: "Products", title: "Digital products,", accent: "built with purpose.", copy: "Our product architecture is designed to scale as new platforms become ready for release.", note: "Product announcements are coming soon. We do not publish product concepts before they are ready.", cta: "Discuss a product idea" },
  blog: { eyebrow: "Perspectives", title: "Ideas worth", accent: "thinking through.", copy: "A future editorial space for practical thinking across technology, design, growth and professional learning.", note: "No articles have been published yet. Original perspectives will appear here as they become available.", cta: "Talk to our team" },
  careers: { eyebrow: "Careers", title: "Do meaningful work.", accent: "Keep growing.", copy: "We value curiosity, clarity, collaboration and the desire to turn useful ideas into real outcomes.", note: "There are no published vacancies at this time. You can still introduce yourself for future opportunities.", cta: "Introduce yourself" },
};

const icons = { products: PackageOpen, blog: Newspaper, careers: BriefcaseBusiness };

export default function EditorialPage({ kind }: { kind: PageKind }) {
  const { companyProfile } = useCmsContent();
  const page = content[kind];
  const Icon = icons[kind];
  return (
    <>
      <Seo title={`${page.eyebrow} | ${companyProfile.brandName}`} description={page.copy} />
      <section className="editorial-page">
        <div className="editorial-page__grid" aria-hidden="true" />
        <div className="container editorial-page__content">
          <div><p className="eyebrow"><span />{page.eyebrow}</p><h1>{page.title}<br /><em>{page.accent}</em></h1><p>{page.copy}</p><Button to="/contact">{page.cta}</Button></div>
          <Reveal className="editorial-page__status"><Icon /><span>Current status</span><h2>In preparation</h2><p>{page.note}</p><ArrowUpRight /></Reveal>
        </div>
      </section>
    </>
  );
}
