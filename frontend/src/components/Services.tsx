import "./Services.css";

const services = [
  {
    title: "Handmade Quality Items",
    icon: "✨",
    description: "Crafted with love and attention to detail",
  },
  {
    title: "Customizing Facility",
    icon: "🎨",
    description: "Personalized designs just for you",
  },
  {
    title: "Islandwide Delivery",
    icon: "🚚",
    description: "Fast and reliable shipping everywhere",
  },
  {
    title: "Useful Various Items",
    icon: "📚",
    description: "A wide range of quality stationery",
  },
  {
    title: "Free Gift with Each Order",
    icon: "🎁",
    description: "A special surprise gift with every purchase",
  },
  {
    title: "Safe & Cute Packing",
    icon: "💝",
    description: "Your items wrapped with care and love",
  },
];

export default function Services() {
  return (
    <section className="services-section" id="services">
      {/* Floating decorative elements */}
      <div className="services-decoration">
        <span className="deco-item deco-1">🌸</span>
        <span className="deco-item deco-2">⭐</span>
        <span className="deco-item deco-3">💫</span>
        <span className="deco-item deco-4">🌿</span>
        <span className="deco-item deco-5">🎀</span>
        <span className="deco-item deco-6">✨</span>
      </div>

      <div className="services-container">
        <div className="services-header">
          <p className="services-eyebrow">What We Offer</p>
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">
            We provide exceptional stationery solutions tailored to your needs
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card card-${index + 1}`}>
              <div className="service-icon-wrapper">
                <span className="service-icon">{service.icon}</span>
                <div className="icon-bg"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
              <div className="service-corner"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
