import { lazy } from "react"

import { Route, Routes } from "react-router-dom"

import MainLayout from "../layouts/MainLayout"

const About = lazy(() => import("../pages/About"))

const Blog = lazy(() => import("../pages/Blog"))

const BlogPostPage = lazy(() => import("../pages/BlogPostPage"))

const PortfolioPage = lazy(() => import("../pages/PortfolioPage"))

const ProductsPage = lazy(() => import("../pages/products"))

const Contact = lazy(() => import("../pages/Contact"))

const EditorialPage = lazy(() => import("../pages/EditorialPages"))

import Home from "../pages/Home"

const ServiceDetail = lazy(() => import("../pages/ServiceDetail"))

const Services = lazy(() => import("../pages/Services"))

const WebDevelopment = lazy(() => import("../pages/services/WebDevelopment"))

const SoftwareDevelopment = lazy(() => import("../pages/services/software-development"))

const MobileAppDevelopment = lazy(() => import("../pages/services/mobile-app-development"))

const Ecommerce = lazy(() => import("../pages/services/ecommerce"))

const ErpCrm = lazy(() => import("../pages/services/erp-crm"))

const ApiIntegration = lazy(() => import("../pages/services/api-integration"))

const Saas = lazy(() => import("../pages/services/saas"))

const SocialMedia = lazy(() => import("../pages/services/social-media"))

const SeoService = lazy(() => import("../pages/services/seo"))

const Leadership = lazy(() => import("../pages/Leadership"))

const Team = lazy(() => import("../pages/Team"))

const LeadershipProfile = lazy(() => import("../pages/LeadershipProfile"))

const AdminApp = lazy(() => import("../admin/AdminApp"))

const NotFound = lazy(() => import("../pages/NotFound"))

import ServerError from "../pages/ServerError"

const routePrefetchMap: Record<string, () => Promise<unknown>> = {
  "/about": () => import("../pages/About"),
  "/services": () => import("../pages/Services"),
  "/products": () => import("../pages/products"),
  "/portfolio": () => import("../pages/PortfolioPage"),
  "/blog": () => import("../pages/Blog"),
  "/contact": () => import("../pages/Contact"),
  "/leadership": () => import("../pages/Leadership"),
  "/team": () => import("../pages/Team"),
  "/services/web-development": () => import("../pages/services/WebDevelopment"),
  "/services/software-development": () => import("../pages/services/software-development"),
  "/services/mobile-app-development": () => import("../pages/services/mobile-app-development"),
  "/services/ecommerce": () => import("../pages/services/ecommerce"),
  "/services/erp-crm": () => import("../pages/services/erp-crm"),
  "/services/api-integration": () => import("../pages/services/api-integration"),
  "/services/saas": () => import("../pages/services/saas"),
  "/services/social-media": () => import("../pages/services/social-media"),
  "/services/seo": () => import("../pages/services/seo"),
}

export function prefetchRoute(to: string) {
  const cleanPath = to.split("?")[0].split("#")[0]
  const prefetcher = routePrefetchMap[cleanPath]
  if (prefetcher) {
    void prefetcher()
  }
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="admin/login/auth" element={<AdminApp />} />
      <Route path="admin/*" element={<AdminApp />} />
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="leadership/:slug" element={<LeadershipProfile />} />
        <Route path="team" element={<Team />} />
        <Route path="about" element={<About />} />
        <Route path="leadership" element={<Leadership />} />
        <Route path="services" element={<Services />} />
        <Route path="services/web-development" element={<WebDevelopment />} />
        <Route path="services/software-development" element={<SoftwareDevelopment />} />
        <Route path="services/mobile-app-development" element={<MobileAppDevelopment />} />
        <Route path="services/ecommerce" element={<Ecommerce />} />
        <Route path="services/erp-crm" element={<ErpCrm />} />
        <Route path="services/api-integration" element={<ApiIntegration />} />
        <Route path="services/saas" element={<Saas />} />
        <Route path="services/social-media" element={<SocialMedia />} />
        <Route path="services/seo" element={<SeoService />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="careers" element={<EditorialPage kind="careers" />} />
        <Route path="contact" element={<Contact />} />
        <Route path="404" element={<NotFound />} />
        <Route path="500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
