import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./TopBanner.css";

export default function TopBanner() {
  const { t } = useTranslation();

  return (
    <section className="top-banner" id="home">
      <div className="floating-items" aria-hidden="true">
        <span className="floating-item item-1" />
        <span className="floating-item item-2" />
        <span className="floating-item item-3" />
        <span className="floating-item item-4" />
        <span className="floating-item item-5" />
        <span className="floating-item item-6" />
      </div>
      <div className="top-banner-container">
        <p className="top-banner-eyebrow">{t("topBanner.eyebrow")}</p>
        <h1 className="top-banner-title">
          {t("topBanner.title")}
        </h1>
        <p className="top-banner-description">
          {t("topBanner.description")}
        </p>
        <div className="top-banner-actions">
          <Link to="/products" className="top-banner-btn primary">
            {t("topBanner.shopItems")}
          </Link>
          <Link to="/products" className="top-banner-btn secondary">
            {t("topBanner.customizeItem")}
          </Link>
        </div>
        {/* <div className="top-banner-features">
          <span>Student-friendly formats</span>
          <span>Customizable covers</span>
          <span>Nationwide delivery</span>
        </div> */}
      </div>
      {/* <img
        src="https://res.cloudinary.com/dlago1qei/image/upload/v1771070380/Bloom_11_ekmyha.png"
        alt="Bloom decoration"
        className="bloom-decoration"
      /> */}
      <img
        src="https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_900/Bloom_11_ekmyha.png"
        srcSet="
    https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_600/Bloom_11_ekmyha.png 600w,
    https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_900/Bloom_11_ekmyha.png 900w,
    https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_1200/Bloom_11_ekmyha.png 1200w,
    https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_1600/Bloom_11_ekmyha.png 1600w,
    https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_2000/Bloom_11_ekmyha.png 2000w
  "
        sizes="(max-width: 768px) 70vw, (max-width: 1200px) 70vw, (max-width: 1600px) 45vw, 40vw"
        alt="Bloom decoration"
        className="bloom-decoration"
        decoding="async"
        fetchPriority="high"
      />
    </section>
  );
}
