import { useEffect, useState } from "react";
import { useCmsContent } from "../content/CmsContentProvider";

const particles = Array.from({ length: 10 }, (_, index) => index);

export default function Loader({ delay = 150 }: { delay?: number } = {}) {
  const { companyProfile } = useCmsContent();
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="loader" role="status" aria-live="polite" aria-label="Loading Sipher Web">
      <div className="loader__content">
        <div className="loader__mark">
          <span className="loader__ring loader__ring--outer" aria-hidden="true" />
          <span className="loader__ring loader__ring--middle" aria-hidden="true" />
          <span className="loader__ring loader__ring--inner" aria-hidden="true" />
          <div className="loader__logo">
            {companyProfile.loaderImageUrl && (
              <img
                src={companyProfile.loaderImageUrl}
                alt=""
                onError={(e) => {
                  const fallback = "/images/logo/sw_logo.png";
                  if (e.currentTarget.src !== window.location.origin + fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            )}
          </div>
        </div>

        <p className="loader__text">
          Loading
          <span className="loader__dots" aria-hidden="true">
            <i>.</i><i>.</i><i>.</i>
          </span>
        </p>

        <div className="loader__particles" aria-hidden="true">
          {particles.map((particle) => <span key={particle} />)}
        </div>
      </div>
    </div>
  );
}
