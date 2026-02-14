import { Link } from "react-router-dom";
import "./TopBanner.css";

export default function TopBanner() {
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
        <p className="top-banner-eyebrow">STATIONERY YOU WILL LOVE</p>
        <h1 className="top-banner-title">
          Bloom Life stationery for brighter plans and softer days.
        </h1>
        <p className="top-banner-description">
          Thoughtful writing pads, planners, and bundles made for students,
          teams, and creatives who want their day to bloom.
        </p>
        <div className="top-banner-actions">
          <Link to="/products" className="top-banner-btn primary">
            Shop items
          </Link>
          <Link to="/products" className="top-banner-btn secondary">
            Customize an item
          </Link>
        </div>
        {/* <div className="top-banner-features">
          <span>Student-friendly formats</span>
          <span>Customizable covers</span>
          <span>Nationwide delivery</span>
        </div> */}
      </div>
      <img
        src="/Bloom.png"
        alt="Bloom decoration"
        className="bloom-decoration"
      />
    </section>
  );
}
