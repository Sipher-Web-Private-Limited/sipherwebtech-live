import { Link } from "react-router-dom";
import { Home, Compass, Code2, Globe, Briefcase, MessageSquare } from "lucide-react";
import Seo from "../components/Seo";
import "../styles/error-pages.css";

export default function NotFound() {
  const quickLinks = [
    { title: "Custom Software", path: "/services/software-development", icon: Code2 },
    { title: "Web Development", path: "/services/web-development", icon: Globe },
    { title: "Portfolio", path: "/portfolio", icon: Briefcase },
    { title: "Contact Us", path: "/contact", icon: MessageSquare },
  ];

  return (
    <>
      <Seo
        title="404: Page Not Found | Sipher Web"
        description="The requested page could not be found. Return to our home page or explore our digital services."
      />

      <section className="err-page" aria-labelledby="err-404-title">
        <div className="container">
          {/* Giant Hero 404 Visual */}
          <div className="err-code-wrap">
            <span className="err-glow" aria-hidden="true" />
            <div className="err-code" aria-hidden="true">
              <span>4</span>
              <span className="err-code__accent">0</span>
              <span>4</span>
            </div>
          </div>

          <h1 id="err-404-title" className="err-title">
            Page <em>Not Found.</em>
          </h1>

          <p className="err-copy">
            The page you are looking for doesn&apos;t exist, was renamed, or has been moved.
          </p>

          <div className="err-actions">
            <Link to="/" className="err-btn-primary" data-cursor="HOME">
              <Home aria-hidden="true" size={17} />
              <span>Back to Home</span>
            </Link>

            <Link to="/services" className="err-btn-secondary" data-cursor="EXPLORE">
              <Compass aria-hidden="true" size={17} />
              <span>Explore Services</span>
            </Link>
          </div>

          {/* Quick Destination Navigation Pills */}
          <div className="err-nav-hub">
            <p className="err-nav-hub__label">Popular Destinations</p>
            <ul className="err-pills">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link to={item.path} className="err-pill" data-cursor="GO">
                      <Icon size={14} aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
