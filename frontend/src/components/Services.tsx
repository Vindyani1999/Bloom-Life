import { useTranslation } from "react-i18next";
import "./Services.css";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      titleKey: "services.handmadeTitle",
      icon: "✨",
      descKey: "services.handmadeDesc",
    },
    {
      titleKey: "services.customTitle",
      icon: "🎨",
      descKey: "services.customDesc",
    },
    {
      titleKey: "services.deliveryTitle",
      icon: "🚚",
      descKey: "services.deliveryDesc",
    },
    {
      titleKey: "services.varietyTitle",
      icon: "📚",
      descKey: "services.varietyDesc",
    },
    {
      titleKey: "services.giftTitle",
      icon: "🎁",
      descKey: "services.giftDesc",
    },
    {
      titleKey: "services.packingTitle",
      icon: "💝",
      descKey: "services.packingDesc",
    },
  ];
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
          <p className="services-eyebrow">{t("services.eyebrow")}</p>
          <h2 className="services-title">{t("services.title")}</h2>
          <p className="services-subtitle">{t("services.subtitle")}</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card card-${index + 1}`}>
              <div className="service-icon-wrapper">
                <span className="service-icon">{service.icon}</span>
                <div className="icon-bg"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title">{t(service.titleKey)}</h3>
                <p className="service-description">{t(service.descKey)}</p>
              </div>
              <div className="service-corner"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
