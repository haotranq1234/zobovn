const BRANCH = "main";
const GIT_CONTENTS_ENDPOINT = "/.netlify/git/github/contents";

const paths = {
  products: "data/products.json",
  content: "data/content.json",
  settings: "data/settings.json",
  social: "data/social.json",
  banners: "data/banners.json",
  vouchers: "data/vouchers.json",
  popup: "data/popup.json",
  seo: "data/seo.json",
};

const state = {
  user: null,
  data: {},
  activeView: "dashboard",
  activeProductId: "",
  pendingCoverFile: null,
  pendingGalleryFiles: new Map(),
  isSaving: false,
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const loginScreen = $("[data-login-screen]");
const appShell = $("[data-app-shell]");
const saveState = $("[data-save-state]");

function text(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return text(value, "san-pham")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "san-pham";
}

function safeUrl(value, fallback = "../assets/logo.png") {
  const url = text(value, fallback);
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("../")) return url;
  return `../${url}`;
}

function setStatus(message, tone = "neutral") {
  saveState.textContent = message;
  saveState.dataset.tone = tone;
}

function encodeJson(data) {
  return btoa(unescape(encodeURIComponent(`${JSON.stringify(data, null, 2)}\n`)));
}

function endpointFor(path) {
  return `${GIT_CONTENTS_ENDPOINT}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

async function getToken() {
  if (!state.user) throw new Error("Bạn cần đăng nhập lại.");
  return state.user.jwt(true);
}

async function gitRequest(path, options = {}) {
  const token = await getToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Git Gateway lỗi ${response.status}`);
  }

  return response.json();
}

async function readPublicJson(path, fallback) {
  try {
    const response = await fetch(`../${path}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    return response.json();
  } catch {
    return fallback;
  }
}

async function getFileSha(path) {
  try {
    const data = await gitRequest(`${endpointFor(path)}?ref=${BRANCH}`);
    return data.sha;
  } catch {
    return "";
  }
}

async function saveJsonFile(path, data, message) {
  const sha = await getFileSha(path);
  return gitRequest(endpointFor(path), {
    method: "PUT",
    body: JSON.stringify({
      branch: BRANCH,
      message,
      content: encodeJson(data),
      ...(sha ? { sha } : {}),
    }),
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function uploadFile(file, prefix = "media") {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const name = `${Date.now()}-${prefix}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const path = `assets/uploads/${name}`;
  const content = await fileToBase64(file);

  await gitRequest(endpointFor(path), {
    method: "PUT",
    body: JSON.stringify({
      branch: BRANCH,
      message: `Upload ${name}`,
      content,
    }),
  });

  return path;
}

function emptyProduct() {
  const now = new Date().toISOString();
  return {
    id: `san-pham-${Date.now()}`,
    name: "Sản phẩm mới",
    price: "Liên hệ",
    description: "",
    image: "assets/logo.png",
    gallery: [],
    category: "",
    badge: "",
    isBestSeller: false,
    buyLink: state.data.social?.orderLink || "",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

function products() {
  return state.data.products?.products || [];
}

function activeProduct() {
  return products().find((product) => product.id === state.activeProductId) || products()[0] || null;
}

async function loadData() {
  setStatus("Đang tải dữ liệu...");
  const entries = await Promise.all(
    Object.entries(paths).map(async ([key, path]) => [key, await readPublicJson(path, key === "products" ? { products: [] } : {})]),
  );
  state.data = Object.fromEntries(entries);
  state.activeProductId = products()[0]?.id || "";
  renderAll();
  setStatus("Đã sẵn sàng");
}

function showAuthedApp(user) {
  state.user = user;
  loginScreen.classList.add("is-hidden");
  appShell.classList.remove("is-hidden");
  $("[data-user-email]").textContent = user.email || "Admin";
  loadData();
}

function showLogin() {
  state.user = null;
  appShell.classList.add("is-hidden");
  loginScreen.classList.remove("is-hidden");
}

function switchView(view) {
  state.activeView = view;
  $$("[data-view-button]").forEach((button) => button.classList.toggle("is-active", button.dataset.viewButton === view));
  $$("[data-view]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.view === view));

  const labels = {
    dashboard: ["Dashboard", "Tổng quan ZOBO VN"],
    products: ["Sản phẩm", "Quản lý sản phẩm"],
    content: ["Nội dung", "Sửa nội dung trang chủ"],
    marketing: ["Marketing", "Banner, voucher và popup"],
    settings: ["Cài đặt", "Thông tin website"],
    accounts: ["Tài khoản", "Quản lý admin"],
  };
  const [eyebrow, title] = labels[view] || labels.dashboard;
  $("[data-view-eyebrow]").textContent = eyebrow;
  $("[data-view-title]").textContent = title;
}

function renderStats() {
  const items = products();
  const active = items.filter((product) => product.isActive !== false);
  const best = items.filter((product) => product.isBestSeller);
  const marketingCount = [
    ...(state.data.banners?.banners || []).filter((item) => item.isActive !== false),
    ...(state.data.vouchers?.vouchers || []).filter((item) => item.isActive !== false),
    ...(state.data.popup?.isActive ? [state.data.popup] : []),
  ].length;

  $("[data-stat-products]").textContent = items.length;
  $("[data-stat-active]").textContent = active.length;
  $("[data-stat-best]").textContent = best.length;
  $("[data-stat-marketing]").textContent = marketingCount;
}

function renderProductList() {
  const query = text($("[data-product-search]").value).toLowerCase();
  const list = $("[data-product-list]");
  const filtered = products().filter((product) => text(product.name).toLowerCase().includes(query));
  $("[data-product-count]").textContent = `${products().length} sản phẩm`;

  list.innerHTML = filtered
    .map(
      (product) => `
        <button class="product-item ${product.id === state.activeProductId ? "is-active" : ""}" type="button" data-product-id="${product.id}">
          <strong>${escapeHtml(product.name || "Chưa đặt tên")}</strong>
          <small>${escapeHtml(product.category || "Chưa có danh mục")} · ${product.isActive === false ? "Đang ẩn" : "Đang hiện"}</small>
        </button>
      `,
    )
    .join("");
}

function setFormValue(form, name, value) {
  const field = form.elements[name];
  if (!field) return;
  if (field.type === "checkbox") field.checked = Boolean(value);
  else field.value = value ?? "";
}

function getFormValue(form, name) {
  const field = form.elements[name];
  if (!field) return "";
  return field.type === "checkbox" ? field.checked : field.value;
}

function renderProductForm() {
  const form = $("[data-product-form]");
  const product = activeProduct();
  form.classList.toggle("is-hidden", !product);
  if (!product) return;

  $("[data-product-editor-title]").textContent = product.name || "Sản phẩm";
  ["name", "price", "category", "badge", "description", "buyLink", "image"].forEach((name) => setFormValue(form, name, product[name]));
  setFormValue(form, "imagePath", product.image);
  setFormValue(form, "isActive", product.isActive !== false);
  setFormValue(form, "isBestSeller", product.isBestSeller);
  $("[data-cover-preview]").src = safeUrl(product.image);
  renderGallery(product.gallery || []);
}

function renderGallery(gallery) {
  const root = $("[data-gallery-list]");
  root.innerHTML = gallery
    .map(
      (item, index) => `
        <div class="gallery-row" data-gallery-index="${index}">
          <select data-gallery-type>
            <option value="image" ${item.type !== "video" ? "selected" : ""}>Ảnh</option>
            <option value="video" ${item.type === "video" ? "selected" : ""}>Video</option>
          </select>
          <div>
            <input data-gallery-title type="text" value="${escapeHtml(item.title || "")}" placeholder="Tiêu đề media" />
            <input data-gallery-url type="text" value="${escapeHtml(item.url || "")}" placeholder="assets/uploads/..." />
            <input data-gallery-file type="file" accept="image/*,video/*" />
          </div>
          <button class="danger-btn" type="button" data-remove-gallery>Xóa</button>
        </div>
      `,
    )
    .join("");
}

function syncProductFromForm() {
  const product = activeProduct();
  if (!product) return null;
  const form = $("[data-product-form]");
  product.name = getFormValue(form, "name");
  product.price = getFormValue(form, "price");
  product.category = getFormValue(form, "category");
  product.badge = getFormValue(form, "badge");
  product.description = getFormValue(form, "description");
  product.buyLink = getFormValue(form, "buyLink");
  product.image = getFormValue(form, "imagePath") || getFormValue(form, "image");
  product.isActive = getFormValue(form, "isActive");
  product.isBestSeller = getFormValue(form, "isBestSeller");
  product.updatedAt = new Date().toISOString();
  product.gallery = $$(".gallery-row").map((row) => ({
    type: $("[data-gallery-type]", row).value,
    title: $("[data-gallery-title]", row).value,
    url: $("[data-gallery-url]", row).value,
    poster: "",
  }));
  return product;
}

function fillObjectForm(form, source, fields) {
  fields.forEach(([field, path]) => {
    const value = path.split(".").reduce((target, part) => target?.[part], source);
    setFormValue(form, field, value);
  });
}

function writePath(target, path, value) {
  const parts = path.split(".");
  let cursor = target;
  parts.slice(0, -1).forEach((part) => {
    cursor[part] ||= {};
    cursor = cursor[part];
  });
  cursor[parts.at(-1)] = value;
}

function readObjectForm(form, target, fields) {
  fields.forEach(([field, path]) => writePath(target, path, getFormValue(form, field)));
}

function renderOtherForms() {
  fillObjectForm($("[data-content-form]"), state.data.content || {}, [
    ["hero.eyebrow", "hero.eyebrow"],
    ["hero.title", "hero.title"],
    ["hero.lead", "hero.lead"],
    ["productsSection.title", "productsSection.title"],
    ["contactSection.title", "contactSection.title"],
  ]);

  const banner = state.data.banners?.banners?.[0] || {};
  fillObjectForm($("[data-banner-form]"), banner, [["isActive", "isActive"], ["title", "title"], ["description", "description"]]);
  fillObjectForm($("[data-popup-form]"), state.data.popup || {}, [["isActive", "isActive"], ["title", "title"], ["description", "description"]]);
  const voucher = state.data.vouchers?.vouchers?.[0] || {};
  fillObjectForm($("[data-voucher-form]"), voucher, [["isActive", "isActive"], ["code", "code"], ["title", "title"]]);
  fillObjectForm($("[data-settings-form]"), state.data.settings || {}, [["brandName", "brandName"], ["location", "location"], ["domain", "domain"]]);
  fillObjectForm($("[data-social-form]"), {
    orderLink: state.data.social?.orderLink,
    facebook: state.data.social?.channels?.find((channel) => channel.icon === "facebook")?.href,
    tiktok: state.data.social?.channels?.find((channel) => channel.icon === "tiktok")?.href,
  }, [["orderLink", "orderLink"], ["facebook", "facebook"], ["tiktok", "tiktok"]]);
  fillObjectForm($("[data-seo-form]"), state.data.seo || {}, [["title", "title"], ["description", "description"]]);
}

function syncOtherForms() {
  readObjectForm($("[data-content-form]"), state.data.content, [
    ["hero.eyebrow", "hero.eyebrow"],
    ["hero.title", "hero.title"],
    ["hero.lead", "hero.lead"],
    ["productsSection.title", "productsSection.title"],
    ["contactSection.title", "contactSection.title"],
  ]);

  state.data.banners.banners ||= [{}];
  readObjectForm($("[data-banner-form]"), state.data.banners.banners[0], [["isActive", "isActive"], ["title", "title"], ["description", "description"]]);
  readObjectForm($("[data-popup-form]"), state.data.popup, [["isActive", "isActive"], ["title", "title"], ["description", "description"]]);
  state.data.vouchers.vouchers ||= [{}];
  readObjectForm($("[data-voucher-form]"), state.data.vouchers.vouchers[0], [["isActive", "isActive"], ["code", "code"], ["title", "title"]]);
  readObjectForm($("[data-settings-form]"), state.data.settings, [["brandName", "brandName"], ["location", "location"], ["domain", "domain"]]);
  readObjectForm($("[data-seo-form]"), state.data.seo, [["title", "title"], ["description", "description"]]);

  const socialForm = $("[data-social-form]");
  state.data.social.orderLink = getFormValue(socialForm, "orderLink");
  const channels = state.data.social.channels || [];
  const facebook = channels.find((channel) => channel.icon === "facebook");
  const tiktok = channels.find((channel) => channel.icon === "tiktok");
  if (facebook) facebook.href = getFormValue(socialForm, "facebook");
  if (tiktok) tiktok.href = getFormValue(socialForm, "tiktok");
}

function renderAll() {
  renderStats();
  renderProductList();
  renderProductForm();
  renderOtherForms();
}

async function saveCurrentState() {
  if (state.isSaving) return;
  state.isSaving = true;
  setStatus("Đang upload và lưu...", "busy");

  try {
    const product = syncProductFromForm();
    syncOtherForms();

    if (state.activeView === "products" || state.activeView === "dashboard") {
      if (product && state.pendingCoverFile) {
        product.image = await uploadFile(state.pendingCoverFile, "cover");
        state.pendingCoverFile = null;
      }

      if (product) {
        for (const [index, file] of state.pendingGalleryFiles.entries()) {
          if (product.gallery[index]) {
            product.gallery[index].url = await uploadFile(file, `gallery-${index + 1}`);
          }
        }
        state.pendingGalleryFiles.clear();
      }

      await saveJsonFile(paths.products, state.data.products, "Update products from ZOBO CMS");
    }

    if (state.activeView === "content" || state.activeView === "dashboard") {
      await saveJsonFile(paths.content, state.data.content, "Update content from ZOBO CMS");
    }

    if (state.activeView === "marketing" || state.activeView === "dashboard") {
      await saveJsonFile(paths.banners, state.data.banners, "Update banners from ZOBO CMS");
      await saveJsonFile(paths.popup, state.data.popup, "Update popup from ZOBO CMS");
      await saveJsonFile(paths.vouchers, state.data.vouchers, "Update vouchers from ZOBO CMS");
    }

    if (state.activeView === "settings" || state.activeView === "dashboard") {
      await saveJsonFile(paths.settings, state.data.settings, "Update settings from ZOBO CMS");
      await saveJsonFile(paths.social, state.data.social, "Update social links from ZOBO CMS");
      await saveJsonFile(paths.seo, state.data.seo, "Update SEO from ZOBO CMS");
    }

    renderAll();
    setStatus("Đã lưu. Netlify đang deploy...", "success");
  } catch (error) {
    console.error(error);
    setStatus("Lưu lỗi. Kiểm tra Git Gateway.", "error");
    alert(`Không lưu được: ${error.message}`);
  } finally {
    state.isSaving = false;
  }
}

function bindEvents() {
  $("[data-login-button]").addEventListener("click", () => window.netlifyIdentity?.open("login"));
  $$("[data-logout-button]").forEach((button) => button.addEventListener("click", () => window.netlifyIdentity?.logout()));
  $$("[data-view-button]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.viewButton)));
  $$("[data-shortcut]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.shortcut)));
  $("[data-refresh-button]").addEventListener("click", loadData);
  $("[data-save-button]").addEventListener("click", saveCurrentState);
  $("[data-product-search]").addEventListener("input", renderProductList);

  $("[data-product-list]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-id]");
    if (!button) return;
    syncProductFromForm();
    state.activeProductId = button.dataset.productId;
    state.pendingCoverFile = null;
    state.pendingGalleryFiles.clear();
    renderProductList();
    renderProductForm();
  });

  $("[data-new-product]").addEventListener("click", () => {
    const item = emptyProduct();
    state.data.products.products.unshift(item);
    state.activeProductId = item.id;
    renderAll();
  });

  $("[data-delete-product]").addEventListener("click", () => {
    const product = activeProduct();
    if (!product || !confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    state.data.products.products = products().filter((item) => item.id !== product.id);
    state.activeProductId = products()[0]?.id || "";
    renderAll();
  });

  $("[data-cover-upload]").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.pendingCoverFile = file;
    $("[data-cover-preview]").src = URL.createObjectURL(file);
    setStatus("Ảnh mới sẽ được upload khi bấm Lưu");
  });

  $("[data-product-form]").addEventListener("input", (event) => {
    if (event.target.name === "imagePath") {
      $("[data-cover-preview]").src = safeUrl(event.target.value);
    }
  });

  $("[data-add-gallery]").addEventListener("click", () => {
    const product = syncProductFromForm();
    if (!product) return;
    product.gallery.push({ type: "image", title: "", url: "", poster: "" });
    renderGallery(product.gallery);
  });

  $("[data-gallery-list]").addEventListener("click", (event) => {
    if (!event.target.closest("[data-remove-gallery]")) return;
    const row = event.target.closest("[data-gallery-index]");
    const index = Number(row.dataset.galleryIndex);
    const product = syncProductFromForm();
    product.gallery.splice(index, 1);
    state.pendingGalleryFiles.delete(index);
    renderGallery(product.gallery);
  });

  $("[data-gallery-list]").addEventListener("change", (event) => {
    if (!event.target.matches("[data-gallery-file]")) return;
    const row = event.target.closest("[data-gallery-index]");
    const index = Number(row.dataset.galleryIndex);
    const file = event.target.files?.[0];
    if (file) {
      state.pendingGalleryFiles.set(index, file);
      $("[data-gallery-url]", row).value = `Sẽ upload: ${file.name}`;
      setStatus("Media mới sẽ được upload khi bấm Lưu");
    }
  });
}

function initIdentity() {
  window.netlifyIdentity?.on("init", (user) => {
    if (user) showAuthedApp(user);
    else showLogin();
  });
  window.netlifyIdentity?.on("login", (user) => {
    window.netlifyIdentity.close();
    showAuthedApp(user);
  });
  window.netlifyIdentity?.on("logout", showLogin);
  window.netlifyIdentity?.init();
}

bindEvents();
switchView("dashboard");
initIdentity();
