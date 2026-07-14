import { benefits, contactChannels, products, siteConfig } from "./data.js";

const productGrid = document.querySelector("[data-product-grid]");
const benefitGrid = document.querySelector("[data-benefit-grid]");
const contactGrid = document.querySelector("[data-contact-grid]");

const iconMap = {
  compact: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 9.5 12 5l6 4.5v7L12 19l-6-2.5v-7Z"></path>
      <path d="M12 5v14"></path>
    </svg>
  `,
  clean: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 16c2-2 4-2 6 0s4 2 6 0 4-2 4-2"></path>
      <path d="M7 8.5 10 5l4 4-3 3.5z"></path>
      <path d="M17 9.5 19 7l1 2-2 2.5z"></path>
    </svg>
  `,
  collection: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="5" width="7" height="7" rx="1.4"></rect>
      <rect x="13" y="5" width="7" height="7" rx="1.4"></rect>
      <rect x="4" y="14" width="7" height="5" rx="1.4"></rect>
      <rect x="13" y="14" width="7" height="5" rx="1.4"></rect>
    </svg>
  `,
  support: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 12a7.5 7.5 0 0 1 15 0"></path>
      <path d="M5 13.5v2a2 2 0 0 0 2 2h1.3"></path>
      <path d="M19 13.5v2a2 2 0 0 1-2 2h-1.3"></path>
      <path d="M9 19h6"></path>
    </svg>
  `,
  facebook: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.3c0-.8.3-1.4 1.5-1.4h1.4V5.4c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2H8v2.8h2.2v7h3.3Z"></path>
    </svg>
  `,
  messenger: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.5 12a8.4 8.4 0 0 1-8.5 8.3 8.9 8.9 0 0 1-2.6-.4l-4.2 1.1 1.2-3.8A8.4 8.4 0 1 1 20.5 12Z"></path>
      <path d="m8.5 12 2.6 2.3 4.5-4.6"></path>
    </svg>
  `,
  tiktok: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <path d="M14 3v9.4a3.8 3.8 0 1 1-3.2-3.7v2.8a1.2 1.2 0 1 0 1 .8V3h2.2Z"></path>
      <path d="M14 3c.4 2.8 2.3 4.5 5 4.6V10c-2 0-3.5-.7-5-1.9V3Z" opacity=".9"></path>
    </svg>
  `,
  order: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 7h2l1 10h9.5l2-7H8"></path>
      <path d="M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
    </svg>
  `,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProducts() {
  productGrid.innerHTML = products
    .map((product) => {
      const features = product.features
        .map((feature) => `<li>${escapeHtml(feature)}</li>`)
        .join("");

      return `
        <article class="product-card reveal" id="product-${escapeHtml(product.id)}">
          <div class="product-card__media">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt)}" loading="lazy" decoding="async" />
          </div>
          <div class="product-card__body">
            <div class="product-card__header">
              <span class="badge">${escapeHtml(product.badge)}</span>
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.description)}</p>
            </div>

            <details class="product-details">
              <summary class="product-summary">Xem sản phẩm</summary>
              <div class="product-details__content">
                <p>Điểm nổi bật dành cho trang giới thiệu chính thức:</p>
                <ul>
                  ${features}
                </ul>
              </div>
            </details>

            <div class="product-card__actions">
              <a class="button button--secondary" href="${escapeHtml(siteConfig.links.order)}" target="_blank" rel="noopener noreferrer">Đặt hàng</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBenefits() {
  benefitGrid.innerHTML = benefits
    .map(
      (benefit) => `
        <article class="benefit-card reveal">
          <div class="benefit-card__icon" aria-hidden="true">${iconMap[benefit.icon] ?? ""}</div>
          <div>
            <h3>${escapeHtml(benefit.title)}</h3>
            <p>${escapeHtml(benefit.description)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderContacts() {
  contactGrid.innerHTML = contactChannels
    .map(
      (channel) => `
        <a class="contact-card reveal" href="${escapeHtml(channel.href)}" target="_blank" rel="noopener noreferrer">
          <div class="contact-card__icon" aria-hidden="true">${iconMap[channel.icon] ?? ""}</div>
          <div>
            <h3>${escapeHtml(channel.title)}</h3>
            <p>${escapeHtml(channel.description)}</p>
          </div>
          <div class="contact-card__meta">
            <span>Mở kênh</span>
            <span aria-hidden="true">↗</span>
          </div>
        </a>
      `,
    )
    .join("");
}

function setupRevealObserver() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
}

renderProducts();
renderBenefits();
renderContacts();
setupRevealObserver();

document.documentElement.setAttribute("lang", "vi");
document.documentElement.setAttribute("data-brand", siteConfig.brandName);

const orderCtas = document.querySelectorAll("[data-order-link]");
orderCtas.forEach((cta) => {
  cta.setAttribute("href", siteConfig.links.order);
  cta.setAttribute("target", "_blank");
  cta.setAttribute("rel", "noopener noreferrer");
});
