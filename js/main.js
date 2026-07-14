import { benefits as defaultBenefits, contactChannels as defaultContactChannels, siteConfig as defaultSiteConfig } from "./data.js";

const productGrid = document.querySelector("[data-product-grid]");
const benefitGrid = document.querySelector("[data-benefit-grid]");
const contactGrid = document.querySelector("[data-contact-grid]");
const heroPrimary = document.querySelector("[data-hero-primary]");
const heroSecondary = document.querySelector("[data-hero-secondary]");
const bannerZone = document.querySelector("[data-banner-zone]");
const voucherStrip = document.querySelector("[data-voucher-strip]");
const popupRoot = document.querySelector("[data-popup-root]");

let siteConfig = { ...defaultSiteConfig };

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
  youtube: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <path d="M21.4 7.1a3 3 0 0 0-2.1-2.1C17.5 4.5 12 4.5 12 4.5s-5.5 0-7.3.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2.1 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.8.5 7.3.5 7.3.5s5.5 0 7.3-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM10 15.4V8.6l5.8 3.4L10 15.4Z"></path>
    </svg>
  `,
  zalo: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 5.5h14v10.2H9.4L5 19v-3.3H5z"></path>
      <path d="M8.2 9h3.2l-3.2 4h3.5"></path>
      <path d="M14 13V9h2.3c1 0 1.7.8 1.7 2s-.7 2-1.7 2z"></path>
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

async function fetchJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
}

function setText(selector, value, fallback = "") {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = normalizeText(value, fallback);
  });
}

function setMeta(selector, value) {
  const element = document.querySelector(selector);
  if (element && normalizeText(value)) {
    element.setAttribute("content", normalizeText(value));
  }
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

function normalizeMediaUrl(value, fallback = "assets/logo.png") {
  const mediaUrl = normalizeText(value, fallback);
  if (mediaUrl.startsWith("http") || mediaUrl.startsWith("/")) {
    return mediaUrl;
  }
  return mediaUrl;
}

function inferMediaType(item) {
  const explicitType = normalizeText(item?.type).toLowerCase();
  if (explicitType === "video") return "video";
  if (explicitType === "image") return "image";

  const url = normalizeText(item?.url || item?.image || item?.src).toLowerCase();
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url) ? "video" : "image";
}

function normalizeGalleryItem(item, fallbackTitle) {
  const media = typeof item === "string" ? { url: item } : item || {};
  const url = normalizeMediaUrl(media.url || media.image || media.src, "");
  if (!url) return null;

  return {
    type: inferMediaType(media),
    url,
    poster: normalizeMediaUrl(media.poster, ""),
    title: normalizeText(media.title, fallbackTitle),
  };
}

function getProductMedia(product) {
  const name = normalizeText(product.name, "Sản phẩm");
  const cover = normalizeGalleryItem({ type: "image", url: product.image, title: name }, name);
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.map((item) => normalizeGalleryItem(item, name)).filter(Boolean)
    : [];

  const seen = new Set();
  const mediaItems = [cover, ...gallery].filter(Boolean).filter((item) => {
    const key = `${item.type}:${item.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return mediaItems.length
    ? mediaItems
    : [{ type: "image", url: "assets/logo.png", poster: "", title: name }];
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
    if (first.isBestSeller !== second.isBestSeller) {
      return second.isBestSeller ? 1 : -1;
    }

    const right = timestampToMillis(second.updatedAt) || timestampToMillis(second.createdAt);
    const left = timestampToMillis(first.updatedAt) || timestampToMillis(first.createdAt);
    return right - left;
  });
}

function renderBenefits(items = defaultBenefits) {
  benefitGrid.innerHTML = items
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

function renderContacts(channels = defaultContactChannels) {
  contactGrid.innerHTML = channels
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
      const heroImage = getProductMedia(product).find((item) => item.type === "image") || getProductMedia(product)[0];
      image.src = normalizeImage(heroImage.url);
      image.alt = normalizeText(product.name, defaultTitle);
    }
    if (title) title.textContent = normalizeText(product.name, defaultTitle);
  });
}

function renderMainMedia(media, name) {
  if (media.type === "video") {
    const poster = media.poster ? ` poster="${escapeHtml(media.poster)}"` : "";
    return `
      <video src="${escapeHtml(media.url)}"${poster} controls preload="metadata" playsinline aria-label="${escapeHtml(media.title || name)}">
        Trình duyệt của bạn chưa hỗ trợ video.
      </video>
    `;
  }

  return `<img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.title || name)}" loading="lazy" decoding="async" />`;
}

function renderProductMedia(product, name) {
  const mediaItems = getProductMedia(product);
  const mainMedia = mediaItems[0];
  const thumbs = mediaItems.length > 1
    ? `
      <div class="product-card__thumbs" data-product-media-thumbs aria-label="Thư viện ảnh và video">
        ${mediaItems
          .map((media, index) => {
            const isActive = index === 0 ? " is-active" : "";
            const label = media.type === "video" ? "Video" : "Ảnh";
            const preview = media.type === "video"
              ? media.poster
                ? `<img src="${escapeHtml(media.poster)}" alt="${escapeHtml(media.title || name)}" loading="lazy" decoding="async" />`
                : `<span class="product-card__thumb-label">Video</span>`
              : `<img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.title || name)}" loading="lazy" decoding="async" />`;

            return `
              <button
                class="product-card__thumb${isActive}"
                type="button"
                data-product-media-thumb
                data-media-type="${escapeHtml(media.type)}"
                data-media-url="${escapeHtml(media.url)}"
                data-media-poster="${escapeHtml(media.poster)}"
                data-media-title="${escapeHtml(media.title || name)}"
                aria-label="${escapeHtml(`${label}: ${media.title || name}`)}"
              >
                ${preview}
              </button>
            `;
          })
          .join("")}
      </div>
    `
    : "";

  return `
    <div class="product-card__media" data-product-media>
      <div class="product-card__media-stage" data-product-media-stage>
        ${renderMainMedia(mainMedia, name)}
      </div>
      ${thumbs}
    </div>
  `;
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
      const badge = product.isBestSeller ? normalizeText(product.badge, "Bán chạy") : normalizeText(product.badge, "Mới");
      const price = formatPrice(product.price);
      const buyLink = sanitizeUrl(product.buyLink, siteConfig.links.order);
      const description = normalizeText(product.description, "Sản phẩm đang được cập nhật.");
      const name = normalizeText(product.name, "Tên sản phẩm");

      return `
        <article class="product-card reveal" id="product-${productId}">
          ${renderProductMedia(product, name)}
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

function renderBanners(items = []) {
  if (!bannerZone) return;
  const activeBanners = items.filter((banner) => banner.isActive !== false);
  if (!activeBanners.length) {
    bannerZone.innerHTML = "";
    bannerZone.hidden = true;
    return;
  }

  bannerZone.hidden = false;
  bannerZone.innerHTML = activeBanners
    .slice(0, 2)
    .map((banner) => {
      const title = normalizeText(banner.title, "Thông báo ZOBO VN");
      const description = normalizeText(banner.description);
      const image = normalizeImage(banner.image);
      const ctaLabel = normalizeText(banner.ctaLabel);
      const ctaLink = sanitizeUrl(banner.ctaLink, "#products");

      return `
        <article class="promo-banner">
          <div class="promo-banner__copy">
            <span class="badge">Banner</span>
            <h2>${escapeHtml(title)}</h2>
            ${description ? `<p>${escapeHtml(description)}</p>` : ""}
            ${ctaLabel ? `<a class="button button--secondary" href="${escapeHtml(ctaLink)}">${escapeHtml(ctaLabel)}</a>` : ""}
          </div>
          <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" />
        </article>
      `;
    })
    .join("");
}

function renderVouchers(items = []) {
  if (!voucherStrip) return;
  const activeVouchers = items.filter((voucher) => voucher.isActive !== false);
  if (!activeVouchers.length) {
    voucherStrip.innerHTML = "";
    voucherStrip.hidden = true;
    return;
  }

  voucherStrip.hidden = false;
  voucherStrip.innerHTML = activeVouchers
    .slice(0, 3)
    .map((voucher) => {
      const code = normalizeText(voucher.code, "ZOBO");
      const title = normalizeText(voucher.title, "Ưu đãi ZOBO VN");
      const description = normalizeText(voucher.description);

      return `
        <article class="voucher-card">
          <span>${escapeHtml(code)}</span>
          <div>
            <strong>${escapeHtml(title)}</strong>
            ${description ? `<p>${escapeHtml(description)}</p>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPopup(popup) {
  if (!popupRoot || !popup?.isActive) {
    if (popupRoot) popupRoot.innerHTML = "";
    return;
  }

  const title = normalizeText(popup.title, "Khuyến mãi ZOBO VN");
  const description = normalizeText(popup.description);
  const image = normalizeImage(popup.image);
  const ctaLabel = normalizeText(popup.ctaLabel, "Xem ngay");
  const ctaLink = sanitizeUrl(popup.ctaLink, siteConfig.links.order);

  popupRoot.innerHTML = `
    <div class="promo-popup" data-promo-popup>
      <div class="promo-popup__panel" role="dialog" aria-modal="false" aria-label="${escapeHtml(title)}">
        <button class="promo-popup__close" type="button" data-popup-close aria-label="Đóng popup">×</button>
        <img src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async" />
        <div>
          <span class="badge">Khuyến mãi</span>
          <h2>${escapeHtml(title)}</h2>
          ${description ? `<p>${escapeHtml(description)}</p>` : ""}
          <a class="button button--primary" href="${escapeHtml(ctaLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ctaLabel)}</a>
        </div>
      </div>
    </div>
  `;
}

function setupPopupControls() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-popup-close]")) return;
    const popup = event.target.closest("[data-promo-popup]");
    if (popup) popup.remove();
  });
}

function setupProductMediaSwitcher() {
  productGrid.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-product-media-thumb]");
    if (!thumb) return;

    const mediaRoot = thumb.closest("[data-product-media]");
    const stage = mediaRoot?.querySelector("[data-product-media-stage]");
    if (!stage) return;

    const media = {
      type: thumb.dataset.mediaType || "image",
      url: thumb.dataset.mediaUrl || "",
      poster: thumb.dataset.mediaPoster || "",
      title: thumb.dataset.mediaTitle || "Sản phẩm",
    };

    stage.innerHTML = renderMainMedia(media, media.title);
    mediaRoot.querySelectorAll("[data-product-media-thumb]").forEach((button) => {
      button.classList.toggle("is-active", button === thumb);
    });
  });
}

function hydrateSeo(seo = {}, settings = {}) {
  const title = normalizeText(seo.title, document.title);
  document.title = title;
  setMeta('meta[name="description"]', seo.description);
  setMeta('meta[property="og:title"]', seo.ogTitle || seo.title);
  setMeta('meta[property="og:description"]', seo.ogDescription || seo.description);
  setMeta('meta[property="og:image"]', seo.ogImage);
  setMeta('meta[property="og:url"]', settings.canonicalUrl);

  const canonical = document.querySelector("[data-canonical-url]");
  if (canonical && normalizeText(settings.canonicalUrl)) {
    canonical.setAttribute("href", normalizeText(settings.canonicalUrl));
  }
}

function hydrateSiteSettings(settings = {}) {
  siteConfig = {
    ...siteConfig,
    ...settings,
    links: { ...siteConfig.links },
  };

  setText("[data-brand-name]", siteConfig.brandName, defaultSiteConfig.brandName);
  document.documentElement.setAttribute("data-brand", siteConfig.brandName || defaultSiteConfig.brandName);
  setText("[data-brand-location]", siteConfig.location, defaultSiteConfig.location);
  setText("[data-footer-domain]", siteConfig.domain, defaultSiteConfig.domain);
  setText("[data-footer-copy]", `© ${siteConfig.year || defaultSiteConfig.year} ${siteConfig.brandName || defaultSiteConfig.brandName}`);

  document.querySelectorAll("[data-site-logo]").forEach((logo) => {
    logo.src = normalizeImage(settings.logo || "assets/logo.png");
  });

  const brandCopy = document.querySelector("[data-brand-card-copy]");
  if (brandCopy) {
    brandCopy.textContent = `${siteConfig.brandName || defaultSiteConfig.brandName} là thương hiệu phụ kiện lọc phong cách hiện đại, tập trung vào trải nghiệm gọn nhẹ và dễ tiếp cận trên mobile.`;
  }
}

function hydrateContent(content = {}) {
  const hero = content.hero || {};
  const productsSection = content.productsSection || {};
  const benefitsSection = content.benefitsSection || {};
  const contactSection = content.contactSection || {};

  setText("[data-hero-eyebrow]", hero.eyebrow, "Premium bio commerce landing page");
  setText("[data-hero-title]", hero.title, "Giải pháp phụ kiện lọc nhỏ gọn cho trải nghiệm tiện lợi hơn.");
  setText("[data-hero-lead]", hero.lead);
  setText("[data-hero-primary-cta]", hero.primaryCtaLabel, "Xem sản phẩm");
  setText("[data-hero-secondary-cta]", hero.secondaryCtaLabel, "Đặt hàng ngay");
  setText("[data-products-eyebrow]", productsSection.eyebrow, "Sản phẩm nổi bật");
  setText("[data-products-title]", productsSection.title, "Dòng sản phẩm được sắp xếp để khách xem và đặt hàng thật nhanh.");
  setText("[data-products-description]", productsSection.description);
  setText("[data-benefits-eyebrow]", benefitsSection.eyebrow, "Why ZOBO");
  setText("[data-benefits-title]", benefitsSection.title, "Lý do thương hiệu tạo cảm giác gọn gàng, đáng tin và dễ mua.");
  setText("[data-contact-eyebrow]", contactSection.eyebrow, "Liên hệ");
  setText("[data-contact-title]", contactSection.title, "Kết nối qua kênh phù hợp nhất với khách của bạn.");
  setText("[data-contact-description]", contactSection.description);

  const chips = Array.isArray(hero.chips) ? hero.chips : [];
  const chipsRoot = document.querySelector("[data-hero-chips]");
  if (chipsRoot && chips.length) {
    chipsRoot.innerHTML = chips.map((chip) => `<li>${escapeHtml(chip)}</li>`).join("");
  }
}

function hydrateSocial(social = {}) {
  const orderLink = normalizeText(social.orderLink, siteConfig.links.order);
  siteConfig = {
    ...siteConfig,
    links: {
      ...siteConfig.links,
      order: orderLink,
    },
  };
}

async function loadCmsData() {
  const [
    content,
    settings,
    social,
    banners,
    vouchers,
    popup,
    seo,
  ] = await Promise.all([
    fetchJson("/data/content.json", {}),
    fetchJson("/data/settings.json", {}),
    fetchJson("/data/social.json", {}),
    fetchJson("/data/banners.json", { banners: [] }),
    fetchJson("/data/vouchers.json", { vouchers: [] }),
    fetchJson("/data/popup.json", {}),
    fetchJson("/data/seo.json", {}),
  ]);

  return { content, settings, social, banners, vouchers, popup, seo };
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
  const cmsData = await loadCmsData();

  hydrateSiteSettings(cmsData.settings);
  hydrateSocial(cmsData.social);
  hydrateSeo(cmsData.seo, cmsData.settings);
  hydrateContent(cmsData.content);
  renderBanners(cmsData.banners?.banners || []);
  renderVouchers(cmsData.vouchers?.vouchers || []);
  renderPopup(cmsData.popup);
  renderBenefits(cmsData.content?.benefitsSection?.items || defaultBenefits);
  renderContacts((cmsData.social?.channels || defaultContactChannels).filter((channel) => channel.isActive !== false));
  setupOrderCtas();
  setupNetlifyIdentity();
  setupProductMediaSwitcher();
  setupPopupControls();
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
