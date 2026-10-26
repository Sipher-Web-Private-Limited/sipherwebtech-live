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

const Home = lazy(() => import("../pages/Home"))

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
