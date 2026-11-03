import { ArrowUpRight, Quote, ScanLine, Sparkles, Star } from "lucide-react"
import Seo from "../components/Seo"
import { BrandSocialIcon } from "../components/BrandSocialIcon"
import { useCmsContent } from "../content/CmsContentProvider"
import "../styles/reviews.css"

const googleReviewUrl =
  "https://www.google.com/search?kgmid=/g/11y99bvv23&hl=en-IN&q=Sipher+Web+Pvt+Ltd&shem=epsd1,esd2e,ltae,rimspwouoe,sdpie&shndl=30&source=sh/x/loc/osrp/m5/1&kgs=2ec550db3d31fe80&utm_source=epsd1,esd2e,ltae,rimspwouoe,sdpie,sh/x/loc/osrp/m5/1#lrd=0x4e3148425b12b121:0xf5b167e057ba29c5,3,,,,"

const reviewQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&format=png&data=${encodeURIComponent(googleReviewUrl)}`

export default function Reviews() {
  const { activeCompanySocials, companyProfile } = useCmsContent()

  return (
    <div className="reviews-page">
      <Seo
        title={`Reviews & Social Media | ${companyProfile.brandName}`}
        description={`Share your experience with ${companyProfile.brandName} on Google and connect with us on social media.`}
      />

      <section className="reviews-hero">
        <div className="container reviews-hero__inner">
          <div className="reviews-hero__copy">
            <p className="eyebrow"><span />Your feedback matters</p>
            <h1>Your voice helps us <em>grow.</em></h1>
            <p>
              Have you worked with us? Your honest Google review helps other
              businesses find a team they can trust and helps us keep improving.
            </p>
            <a
              className="button button--primary"
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Write a Google review</span>
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>

          <div className="reviews-hero__visual">
            <img
              className="reviews-hero__image"
              src="/new-images/home/What_we_do_3.webp"
              alt="A designer creating a digital brand experience"
              width="1122"
              height="1500"
            />
            <div className="reviews-hero__quote" aria-hidden="true">
              <Quote size={22} />
              <span>Every perspective helps us get better.</span>
              <Sparkles size={17} />
            </div>
            <div className="reviews-qr-card">
              <div className="reviews-qr-card__image">
                <img
                  src={reviewQrCodeUrl}
                  alt="QR code to open the Sipher Web Google review page"
                  width="280"
                  height="280"
                />
              </div>
              <div className="reviews-qr-card__copy">
                <span>Have a moment?</span>
                <strong>Share your experience</strong>
                <p><ScanLine aria-hidden="true" size={16} /> Scan to review us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-socials section" aria-labelledby="reviews-socials-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow"><span />Stay connected</p>
            <h2 className="section-heading__title" id="reviews-socials-title">
              <span>Follow</span> <em>Sipher Web</em>
            </h2>
            <p className="section-heading__copy">
              Find our latest work, updates and ideas on our social channels.
            </p>
          </div>

          {activeCompanySocials.length > 0 ? (
            <ul className="reviews-socials__list">
              {activeCompanySocials.map(({ label, href, icon }) => (
                <li key={`${label}-${href}`}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <span className="reviews-socials__icon">
                      <BrandSocialIcon name={icon} />
                    </span>
                    <span className="reviews-socials__details">
                      <strong>{label}</strong>
                      <span>{href}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" size={19} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="reviews-socials__empty">
              Our social links are not available right now.
            </p>
          )}

          <div className="reviews-note">
            <Star aria-hidden="true" size={19} />
            <p>
              Reviews make a real difference. If we’ve worked together, we’d
              appreciate you sharing your honest experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
