import * as React from "react";
import { Link } from "react-router-dom";
import "../../styles/expanding-cards.css";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  linkHref: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className = "", items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(
      items.length > 0 && defaultActiveIndex >= 0 && defaultActiveIndex < items.length
        ? defaultActiveIndex
        : null,
    );
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 768px)");
      const updateViewport = () => setIsDesktop(mediaQuery.matches);
      updateViewport();
      mediaQuery.addEventListener("change", updateViewport);
      return () => mediaQuery.removeEventListener("change", updateViewport);
    }, []);

    const gridStyle = React.useMemo<React.CSSProperties>(() => {
      if (activeIndex === null) return {};
      const tracks = items.map((_, index) => index === activeIndex ? "5fr" : "1fr").join(" ");
      return isDesktop
        ? { gridTemplateColumns: tracks, gridTemplateRows: "minmax(0, 1fr)" }
        : { gridTemplateRows: tracks, gridTemplateColumns: "minmax(0, 1fr)" };
    }, [activeIndex, items, isDesktop]);

    return (
      <ul
        className={`expanding-cards${className ? ` ${className}` : ""}`}
        style={gridStyle}
        ref={ref}
        {...props}
      >
        {items.map((item, index) => (
          <li
            className="expanding-cards__item"
            key={item.id}
            data-active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <Link
              className="expanding-cards__link"
              to={item.linkHref}
              onFocus={() => setActiveIndex(index)}
              aria-label={`${item.title}: ${item.description}`}
            >
              <img
                className="expanding-cards__image"
                src={item.imgSrc}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className="expanding-cards__shade" aria-hidden="true" />
              <span className="expanding-cards__rail-title" aria-hidden="true">{item.title}</span>
              <span className="expanding-cards__content">
                <span className="expanding-cards__icon" aria-hidden="true">{item.icon}</span>
                <span className="expanding-cards__title">{item.title}</span>
                <span className="expanding-cards__description">{item.description}</span>
                <span className="expanding-cards__action">Explore solution <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  },
);

ExpandingCards.displayName = "ExpandingCards";
