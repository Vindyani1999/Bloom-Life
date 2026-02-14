import "./Services.css";

const services: string[] = [
  "Handmade Quality Items",
  "Customizing Facility",
  "Islandwide Delivery",
  "Useful Various Items",
];

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">
            We provide exceptional stationery solutions tailored to your needs
          </p>
        </div>
        <div className="services-grid">
          <ul className="services-list left-column">
            {services.slice(0, 2).map((service, index) => (
              <li key={index} className="service-item">
                <span className="check-icon">✓</span>
                <span className="service-text">{service}</span>
              </li>
            ))}
          </ul>
          <ul className="services-list right-column">
            {services.slice(2).map((service, index) => (
              <li key={index} className="service-item">
                <span className="check-icon">✓</span>
                <span className="service-text">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
