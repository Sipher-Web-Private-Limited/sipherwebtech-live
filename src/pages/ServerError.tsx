import { Link } from "react-router-dom";
import { RefreshCw, Home, MessageSquare, LifeBuoy, Briefcase, ShieldCheck } from "lucide-react";
import Seo from "../components/Seo";
import "../styles/error-pages.css";

interface ServerErrorProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

export default function ServerError({ resetErrorBoundary }: ServerErrorProps) {
  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const quickLinks = [
    { title: "Contact Support", path: "/contact", icon: MessageSquare },
    { title: "Explore Services", path: "/services", icon: LifeBuoy },
    { title: "Portfolio", path: "/portfolio", icon: Briefcase },
    { title: "About Us", path: "/about", icon: ShieldCheck },
  ];

  return (
    <>
      <Seo
        title="500: Server Error | Sipher Web"
        description="We are experiencing an internal server issue. Please try refreshing or return home."
      />

      <section className="err-page" aria-labelledby="err-500-title">
        <div className="container">
          {/* Giant Hero 500 Visual */}
          <div className="err-code-wrap">
            <span className="err-glow" aria-hidden="true" />
            <div className="err-code" aria-hidden="true">
              <span>5</span>
              <span className="err-code__accent">0</span>
              <span>0</span>
            </div>
          </div>

          <h1 id="err-500-title" className="err-title">
            Server <em>Error.</em>
          </h1>

          <p className="err-copy">
            We are experiencing an unexpected server issue. Please try refreshing the page or return to the home page.
          </p>

          <div className="err-actions">
            <button
              type="button"
              onClick={handleRetry}
              className="err-btn-primary"
              data-cursor="RETRY"
            >
              <RefreshCw aria-hidden="true" size={17} />
              <span>Try Refreshing</span>
            </button>

            <Link to="/" className="err-btn-secondary" data-cursor="HOME">
              <Home aria-hidden="true" size={17} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Quick Destination Navigation Pills */}
          <div className="err-nav-hub">
            <p className="err-nav-hub__label">Quick Help &amp; Links</p>
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
