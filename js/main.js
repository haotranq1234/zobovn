import { benefits, contactChannels, siteConfig } from "./data.js";

const productGrid = document.querySelector("[data-product-grid]");
const benefitGrid = document.querySelector("[data-benefit-grid]");
const contactGrid = document.querySelector("[data-contact-grid]");
const heroPrimary = document.querySelector("[data-hero-primary]");
const heroSecondary = document.querySelector("[data-hero-secondary]");

let revealObserver;

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
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text.length ? text : fallback;
}

function sanitizeUrl(value, fallback) {
  try {
    const candidate = new URL(normalizeText(value, fallback), window.location.origin);
    return ["http:", "https:"].includes(candidate.protocol) ? candidate.href : fallback;
  } catch {
    return fallback;
  }
}

function normalizeImage(value) {
  const image = normalizeText(value, "assets/logo.png");
  if (image.startsWith("http") || image.startsWith("/")) {
    return image;
  }
  return image;
}

function formatPrice(value) {
  const raw = normalizeText(value);
  if (!raw) return "Liên hệ";
  if (/đ|vnd|vnđ|liên hệ/i.test(raw)) return raw;

  const numeric = Number(raw);
  if (Number.isFinite(numeric)) {
    return `${new Intl.NumberFormat("vi-VN").format(numeric)}đ`;
  }

  return raw;
}

function timestampToMillis(value) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortProducts(items) {
  return [...items].sort((first, second) => {
    const right = timestampToMillis(second.updatedAt) || timestampToMillis(second.createdAt);
    const left = timestampToMillis(first.updatedAt) || timestampToMillis(first.createdAt);
    return right - left;
  });
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

function renderLoadingState() {
  productGrid.innerHTML = Array.from({ length: 4 })
    .map(
      () => `
        <article class="skeleton-card">
          <div class="skeleton-card__media"></div>
          <div class="skeleton-bar skeleton-bar--wide"></div>
          <div class="skeleton-bar skeleton-bar--mid"></div>
          <div class="skeleton-bar skeleton-bar--short"></div>
        </article>
      `,
    )
    .join("");
}

function renderEmptyState() {
  productGrid.innerHTML = `
    <article class="empty-state reveal">
      <span class="badge">Chờ cập nhật</span>
      <h3>Chưa có sản phẩm đang hiển thị</h3>
      <p>Vào /admin để thêm sản phẩm đầu tiên. Sau khi Netlify deploy xong, website sẽ cập nhật theo dữ liệu mới.</p>
      <div class="empty-state__actions">
        <a class="button button--primary" href="/admin">Mở trang quản trị</a>
        <a class="button button--secondary" href="${escapeHtml(siteConfig.links.messenger)}" target="_blank" rel="noopener noreferrer">Liên hệ Messenger</a>
      </div>
    </article>
  `;
  observeRevealElements(productGrid);
}

function renderHeroProducts(items) {
  const primary = items[0];
  const secondary = items[1] || items[0];
  const fallback = {
    badge: "Đang cập nhật",
    name: "Sản phẩm nổi bật",
    image: "assets/logo.png",
  };

  const heroItems = [
    { card: heroPrimary, product: primary || fallback, defaultTitle: "Sản phẩm nổi bật" },
    { card: heroSecondary, product: secondary || fallback, defaultTitle: "Bộ sưu tập mới" },
  ];

  heroItems.forEach(({ card, product, defaultTitle }) => {
    if (!card) return;

    const badge = card.querySelector("[data-hero-primary-badge], [data-hero-secondary-badge]");
    const image = card.querySelector("[data-hero-primary-image], [data-hero-secondary-image]");
    const title = card.querySelector("[data-hero-primary-title], [data-hero-secondary-title]");

    if (badge) badge.textContent = normalizeText(product.badge, fallback.badge);
    if (image) {
      image.src = normalizeImage(product.image);
      image.alt = normalizeText(product.name, defaultTitle);
    }
    if (title) title.textContent = normalizeText(product.name, defaultTitle);
  });
}

function renderProductCards(items) {
  if (!items.length) {
    renderEmptyState();
    return;
  }

  productGrid.innerHTML = items
    .map((product) => {
      const productId = escapeHtml(product.id || "");
      const category = normalizeText(product.category, "Sản phẩm");
      const badge = normalizeText(product.badge, "Mới");
      const price = formatPrice(product.price);
      const buyLink = sanitizeUrl(product.buyLink, siteConfig.links.order);
      const description = normalizeText(product.description, "Sản phẩm đang được cập nhật.");
      const image = normalizeImage(product.image);
      const name = normalizeText(product.name, "Tên sản phẩm");

      return `
        <article class="product-card reveal" id="product-${productId}">
          <div class="product-card__media">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async" />
          </div>
          <div class="product-card__body">
            <div class="product-card__header">
              <span class="badge">${escapeHtml(badge)}</span>
              <h3>${escapeHtml(name)}</h3>
              <div class="product-card__meta">
                <span class="product-card__category">${escapeHtml(category)}</span>
                <span class="product-card__price">${escapeHtml(price)}</span>
              </div>
              <p>${escapeHtml(description)}</p>
            </div>

            <div class="product-card__actions">
              <a class="button button--secondary" href="${escapeHtml(buyLink)}" target="_blank" rel="noopener noreferrer">Xem sản phẩm</a>
              <a class="button button--primary" href="${escapeHtml(buyLink)}" target="_blank" rel="noopener noreferrer">Đặt hàng</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  observeRevealElements(productGrid);
}

function observeRevealElements(scope = document) {
  const revealElements = scope.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );
  }

  revealElements.forEach((element) => {
    if (!element.classList.contains("is-visible")) {
      revealObserver.observe(element);
    }
  });
}

async function loadProducts() {
  const response = await fetch("/data/products.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Không tải được data/products.json.");
  }

  const data = await response.json();
  const products = Array.isArray(data) ? data : data.products || [];
  return sortProducts(products.filter((product) => product.isActive !== false));
}

function setupOrderCtas() {
  const orderCtas = document.querySelectorAll("[data-order-link]");
  orderCtas.forEach((cta) => {
    cta.setAttribute("href", siteConfig.links.order);
    cta.setAttribute("target", "_blank");
    cta.setAttribute("rel", "noopener noreferrer");
  });
}

function setupNetlifyIdentity() {
  if (!window.netlifyIdentity) return;

  window.netlifyIdentity.on("init", (user) => {
    if (!user && window.location.hash.includes("invite_token")) {
      window.netlifyIdentity.open("signup");
    }
    if (!user && window.location.hash.includes("recovery_token")) {
      window.netlifyIdentity.open("recovery");
    }
  });
}

async function bootstrap() {
  renderBenefits();
  renderContacts();
  setupOrderCtas();
  setupNetlifyIdentity();
  renderLoadingState();
  observeRevealElements();

  try {
    const products = await loadProducts();
    renderHeroProducts(products);
    renderProductCards(products);
  } catch (error) {
    console.error(error);
    productGrid.innerHTML = `
      <article class="empty-state reveal">
        <span class="badge">Cần dữ liệu</span>
        <h3>Website chưa tải được sản phẩm</h3>
        <p>Kiểm tra file data/products.json hoặc cấu hình publish trên Netlify.</p>
        <div class="empty-state__actions">
          <a class="button button--secondary" href="/admin">Mở trang quản trị</a>
        </div>
      </article>
    `;
    observeRevealElements(productGrid);
  }
}

document.documentElement.setAttribute("data-brand", siteConfig.brandName);
bootstrap();
