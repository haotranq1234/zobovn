import { siteConfig } from "../js/data.js";
import { getFirebaseServices } from "../js/firebase.js";

const authPanel = document.querySelector("[data-auth-panel]");
const dashboard = document.querySelector("[data-dashboard]");
const loginForm = document.querySelector("[data-login-form]");
const loginError = document.querySelector("[data-login-error]");
const logoutButton = document.querySelector("[data-signout]");
const adminEmailBadge = document.querySelector("[data-admin-email]");
const productList = document.querySelector("[data-product-list]");
const productListFeedback = document.querySelector("[data-product-list-feedback]");
const productSearch = document.querySelector("[data-product-search]");
const seedButton = document.querySelector("[data-seed-products]");
const productForm = document.querySelector("[data-product-form]");
const formTitle = document.querySelector("[data-form-title]");
const saveButton = document.querySelector("[data-save-product]");
const resetButton = document.querySelector("[data-reset-form]");
const formFeedback = document.querySelector("[data-product-form-feedback]");
const productIdField = document.querySelector("[data-product-id]");
const currentImageUrlField = document.querySelector("[data-current-image-url]");
const currentImagePathField = document.querySelector("[data-current-image-path]");
const nameField = document.querySelector("[data-product-name]");
const priceField = document.querySelector("[data-product-price]");
const categoryField = document.querySelector("[data-product-category]");
const badgeField = document.querySelector("[data-product-badge]");
const descriptionField = document.querySelector("[data-product-description]");
const buyLinkField = document.querySelector("[data-product-buy-link]");
const activeField = document.querySelector("[data-product-active]");
const imageInput = document.querySelector("[data-product-image-input]");
const imagePreview = document.querySelector("[data-image-preview]");
const statTotal = document.querySelector("[data-stat-total]");
const statActive = document.querySelector("[data-stat-active]");
const statEditing = document.querySelector("[data-stat-editing]");

const starterProducts = [
  {
    name: "Đầu lọc thuốc lá Full Size",
    price: "Liên hệ",
    description: "Bộ 5 đầu lọc Full Size, đóng gói gọn và dễ trưng bày.",
    imageSeed: "../assets/products/full-size-pack.png",
    category: "Full Size",
    badge: "Bán chạy",
    buyLink: siteConfig.links.order,
    isActive: true,
  },
  {
    name: "Siêu Combo 5 in 1",
    price: "Liên hệ",
    description: "Bộ ảnh combo 5 mẫu cho nhiều size, bố cục rõ và dễ xem.",
    imageSeed: "../assets/products/combo-5-in-1.png",
    category: "Combo",
    badge: "Combo",
    buyLink: siteConfig.links.order,
    isActive: true,
  },
  {
    name: "Dòng sản phẩm lọc vật lý",
    price: "Liên hệ",
    description: "Mẫu sản phẩm mang phong cách hiện đại, dễ nhận diện theo từng phiên bản.",
    imageSeed: "../assets/products/physical-filter-series.png",
    category: "Signature",
    badge: "Signature",
    buyLink: siteConfig.links.order,
    isActive: true,
  },
  {
    name: "Tẩu lọc Slim nhiều màu",
    price: "Liên hệ",
    description: "Mẫu slim với nhiều phiên bản màu, dễ chọn theo gu cá nhân.",
    imageSeed: "../assets/products/multi-size-physical.png",
    category: "Slim",
    badge: "Slim",
    buyLink: siteConfig.links.order,
    isActive: true,
  },
  {
    name: "Hộp 5 đầu lọc Full Size",
    price: "Liên hệ",
    description: "Phiên bản hộp 5 sản phẩm với bố cục rõ ràng, dễ nhìn.",
    imageSeed: "../assets/products/full-size-5pcs.png",
    category: "5 PCS",
    badge: "5 PCS",
    buyLink: siteConfig.links.order,
    isActive: true,
  },
];

const state = {
  adminEmail: "",
  user: null,
  products: [],
  editingId: "",
  searchQuery: "",
  selectedFile: null,
  previewObjectUrl: "",
  currentImageUrl: "",
  currentImagePath: "",
  db: null,
  auth: null,
  storage: null,
  unsubscribeProducts: null,
  firebaseReady: false,
  revealObserver: null,
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

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") {
    return value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6);
  }
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value) {
  const millis = toMillis(value);
  if (!millis) return "Mới tạo";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(millis));
}

function setFeedback(target, message, tone = "default") {
  if (!target) return;
  target.textContent = message || "";
  target.dataset.tone = tone;
}

function observeRevealElements(scope = document) {
  const revealElements = scope.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if (!state.revealObserver) {
    state.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            state.revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );
  }

  revealElements.forEach((element) => {
    if (!element.classList.contains("is-visible")) {
      state.revealObserver.observe(element);
    }
  });
}

function setPanelVisibility(isAuthenticated) {
  authPanel.hidden = isAuthenticated;
  dashboard.hidden = !isAuthenticated;
  logoutButton.hidden = !isAuthenticated;
}

function setSessionLabel() {
  adminEmailBadge.textContent = state.user?.email || "Chưa đăng nhập";
}

function updateStats() {
  const visibleCount = state.products.filter((product) => product.isActive !== false).length;
  statTotal.textContent = String(state.products.length);
  statActive.textContent = String(visibleCount);

  const editingProduct = state.products.find((product) => product.firestoreId === state.editingId);
  statEditing.textContent = editingProduct ? editingProduct.name : "Chưa có";
}

function clearPreviewObjectUrl() {
  if (state.previewObjectUrl) {
    URL.revokeObjectURL(state.previewObjectUrl);
    state.previewObjectUrl = "";
  }
}

function renderImagePreview(src, alt) {
  if (!src) {
    imagePreview.classList.remove("image-preview--has-image");
    imagePreview.innerHTML = "<span>Preview ảnh sẽ hiển thị ở đây</span>";
    return;
  }

  imagePreview.classList.add("image-preview--has-image");
  imagePreview.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt || "Preview ảnh sản phẩm")}" />`;
}

function resetForm(options = {}) {
  const keepMessage = options.keepMessage === true;
  productForm.reset();
  imageInput.value = "";
  productIdField.value = "";
  currentImageUrlField.value = "";
  currentImagePathField.value = "";
  state.editingId = "";
  state.selectedFile = null;
  clearPreviewObjectUrl();
  renderImagePreview("", "");
  formTitle.textContent = "Thêm sản phẩm mới";
  saveButton.textContent = "Lưu sản phẩm";
  if (!keepMessage) {
    setFeedback(formFeedback, "");
  }
  updateStats();
}

function setFormValues(product) {
  state.editingId = product.firestoreId;
  productIdField.value = product.firestoreId;
  currentImageUrlField.value = normalizeText(product.image, "");
  currentImagePathField.value = normalizeText(product.imagePath, "");
  imageInput.value = "";
  nameField.value = normalizeText(product.name, "");
  priceField.value = normalizeText(product.price, "");
  categoryField.value = normalizeText(product.category, "");
  badgeField.value = normalizeText(product.badge, "");
  descriptionField.value = normalizeText(product.description, "");
  buyLinkField.value = normalizeText(product.buyLink, siteConfig.links.order);
  activeField.checked = product.isActive !== false;
  state.selectedFile = null;
  clearPreviewObjectUrl();
  renderImagePreview(product.image, product.name);
  formTitle.textContent = "Sửa sản phẩm";
  saveButton.textContent = "Cập nhật sản phẩm";
  setFeedback(formFeedback, `Đang chỉnh sửa: ${normalizeText(product.name, "Sản phẩm")}`, "info");
  updateStats();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProductList() {
  const queryText = state.searchQuery.trim().toLowerCase();
  const filtered = state.products.filter((product) => {
    if (!queryText) return true;
    const haystack = [
      product.name,
      product.category,
      product.badge,
      product.price,
      product.description,
    ]
      .map((value) => normalizeText(value, "").toLowerCase())
      .join(" ");
    return haystack.includes(queryText);
  });
  const sorted = [...filtered].sort((first, second) => {
    return toMillis(second.updatedAt || second.createdAt) - toMillis(first.updatedAt || first.createdAt);
  });

  if (!sorted.length) {
    productList.innerHTML = `
      <div class="product-list__empty">
        <strong>Không tìm thấy sản phẩm phù hợp.</strong>
        <p>Thử đổi từ khóa tìm kiếm hoặc thêm sản phẩm mới.</p>
      </div>
    `;
    setFeedback(productListFeedback, "Kết quả trống theo bộ lọc hiện tại.");
    updateStats();
    observeRevealElements(productList);
    return;
  }

  setFeedback(productListFeedback, `${sorted.length} sản phẩm phù hợp.`);

  productList.innerHTML = sorted
    .map((product) => {
      const activeLabel = product.isActive === false ? "Đang ẩn" : "Đang hiển thị";
      const toggleChecked = product.isActive !== false ? "checked" : "";

      return `
        <article class="admin-product-card reveal" data-product-card data-product-id="${escapeHtml(product.firestoreId)}">
          <div class="admin-product-card__top">
            <div class="admin-product-card__media">
              <img src="${escapeHtml(normalizeText(product.image, "../assets/logo.png"))}" alt="${escapeHtml(normalizeText(product.name, "Product preview"))}" loading="lazy" decoding="async" />
            </div>
            <div class="admin-product-card__meta">
              <span class="badge">${escapeHtml(normalizeText(product.badge, "Badge"))}</span>
              <h3>${escapeHtml(normalizeText(product.name, "Tên sản phẩm"))}</h3>
              <p>${escapeHtml(normalizeText(product.description, "Chưa có mô tả"))}</p>
              <div class="admin-product-card__badges">
                <span class="pill">${escapeHtml(normalizeText(product.category, "Danh mục"))}</span>
                <span class="pill">${escapeHtml(normalizeText(product.price, "Liên hệ"))}</span>
                <span class="pill">${escapeHtml(activeLabel)}</span>
              </div>
              <p class="admin-product-card__meta-small">Cập nhật: ${escapeHtml(formatDate(product.updatedAt || product.createdAt))}</p>
            </div>
          </div>

          <div class="admin-product-card__actions">
            <button class="button button--secondary" type="button" data-edit-product="${escapeHtml(product.firestoreId)}">Sửa</button>
            <button class="button button--secondary" type="button" data-delete-product="${escapeHtml(product.firestoreId)}">Xóa</button>
            <label class="switch">
              <input type="checkbox" data-toggle-product="${escapeHtml(product.firestoreId)}" ${toggleChecked} />
              <span class="switch__track" aria-hidden="true"></span>
              <span class="switch__label">Hiển thị</span>
            </label>
          </div>
        </article>
      `;
    })
    .join("");

  updateStats();
  observeRevealElements(productList);
}

async function uploadImageToStorage(file, productId) {
  const { ref, uploadBytes, getDownloadURL } = state.firebase;
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const imagePath = `products/${productId}/${Date.now()}-${sanitizedName}`;
  const storageRef = ref(state.storage, imagePath);

  await uploadBytes(storageRef, file);
  const image = await getDownloadURL(storageRef);

  return { image, imagePath };
}

async function readAssetAsFile(assetPath, fileName) {
  const response = await fetch(assetPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Không đọc được file mẫu: ${assetPath}`);
  }
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || "image/png" });
}

async function seedStarterProducts() {
  if (!window.confirm("Nạp dữ liệu mẫu sẽ thêm 5 sản phẩm mới vào Firestore. Tiếp tục?")) {
    return;
  }

  setFeedback(productListFeedback, "Đang nạp dữ liệu mẫu...", "info");
  seedButton.disabled = true;

  try {
    const { collection, doc, setDoc, serverTimestamp } = state.firebase;

    for (const starter of starterProducts) {
      const productRef = doc(collection(state.db, "products"));
      const file = await readAssetAsFile(starter.imageSeed, `${productRef.id}.png`);
      const uploaded = await uploadImageToStorage(file, productRef.id);

      await setDoc(productRef, {
        id: productRef.id,
        name: starter.name,
        price: starter.price,
        description: starter.description,
        image: uploaded.image,
        imagePath: uploaded.imagePath,
        category: starter.category,
        badge: starter.badge,
        buyLink: starter.buyLink,
        isActive: starter.isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    setFeedback(productListFeedback, "Đã nạp xong dữ liệu mẫu.", "success");
  } catch (error) {
    console.error(error);
    setFeedback(productListFeedback, "Nạp dữ liệu mẫu thất bại. Vui lòng kiểm tra Storage/Firestore.", "error");
  } finally {
    seedButton.disabled = false;
  }
}

async function handleSaveProduct(event) {
  event.preventDefault();
  setFeedback(formFeedback, "");
  saveButton.disabled = true;

  const formData = new FormData(productForm);
  const productId = String(formData.get("productId") || "").trim();
  const name = normalizeText(formData.get("name"), "");
  const price = normalizeText(formData.get("price"), "Liên hệ");
  const category = normalizeText(formData.get("category"), "Sản phẩm");
  const badge = normalizeText(formData.get("badge"), "Mới");
  const description = normalizeText(formData.get("description"), "");
  const buyLink = sanitizeUrl(formData.get("buyLink"), siteConfig.links.order);
  const isActive = activeField.checked;
  const file = imageInput.files?.[0] || null;

  if (!name || !description) {
    setFeedback(formFeedback, "Vui lòng nhập tên và mô tả sản phẩm.", "error");
    saveButton.disabled = false;
    return;
  }

  if (!productId && !file) {
    setFeedback(formFeedback, "Khi tạo sản phẩm mới, vui lòng upload ảnh trước.", "error");
    saveButton.disabled = false;
    return;
  }

  try {
    const { collection, doc, setDoc, updateDoc, serverTimestamp, deleteObject, ref } = state.firebase;
    const isEditing = Boolean(productId);
    const targetRef = isEditing ? doc(state.db, "products", productId) : doc(collection(state.db, "products"));

    const existing = isEditing ? state.products.find((product) => product.firestoreId === productId) : null;
    let image = currentImageUrlField.value;
    let imagePath = currentImagePathField.value;

    if (file) {
      const uploaded = await uploadImageToStorage(file, targetRef.id);
      image = uploaded.image;
      imagePath = uploaded.imagePath;
    }

    const payload = {
      id: targetRef.id,
      name,
      price,
      description,
      image,
      imagePath,
      category,
      badge,
      buyLink,
      isActive,
      updatedAt: serverTimestamp(),
      createdAt: existing?.createdAt || serverTimestamp(),
    };

    if (isEditing) {
      await updateDoc(targetRef, payload);
    } else {
      await setDoc(targetRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }

    if (file && existing?.imagePath && existing.imagePath !== imagePath) {
      try {
        await deleteObject(ref(state.storage, existing.imagePath));
      } catch (cleanupError) {
        console.warn("Không xóa được ảnh cũ:", cleanupError);
      }
    }

    setFeedback(formFeedback, isEditing ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới.", "success");
    resetForm({ keepMessage: true });
    imageInput.value = "";
  } catch (error) {
    console.error(error);
    setFeedback(formFeedback, "Lưu sản phẩm thất bại. Kiểm tra quyền Firestore/Storage.", "error");
  } finally {
    saveButton.disabled = false;
  }
}

async function handleDeleteProduct(productId) {
  const product = state.products.find((item) => item.firestoreId === productId);
  if (!product) return;

  if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) {
    return;
  }

  try {
    const { doc, deleteDoc, deleteObject, ref } = state.firebase;
    await deleteDoc(doc(state.db, "products", productId));

    if (product.imagePath) {
      try {
        await deleteObject(ref(state.storage, product.imagePath));
      } catch (cleanupError) {
        console.warn("Không xóa được file ảnh:", cleanupError);
      }
    }

    setFeedback(productListFeedback, "Đã xóa sản phẩm.", "success");
    if (state.editingId === productId) {
      resetForm();
    }
  } catch (error) {
    console.error(error);
    setFeedback(productListFeedback, "Xóa sản phẩm thất bại.", "error");
  }
}

async function toggleProductVisibility(productId, nextValue) {
  try {
    const { doc, updateDoc, serverTimestamp } = state.firebase;
    await updateDoc(doc(state.db, "products", productId), {
      isActive: nextValue,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
    setFeedback(productListFeedback, "Không cập nhật được trạng thái hiển thị.", "error");
  }
}

function bindProductListEvents() {
  productList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-product]");
    const deleteButton = event.target.closest("[data-delete-product]");

    if (editButton) {
      const productId = editButton.dataset.editProduct;
      const product = state.products.find((item) => item.firestoreId === productId);
      if (product) {
        setFormValues(product);
      }
      return;
    }

    if (deleteButton) {
      handleDeleteProduct(deleteButton.dataset.deleteProduct);
    }
  });

  productList.addEventListener("change", (event) => {
    const toggle = event.target.closest("[data-toggle-product]");
    if (toggle) {
      toggleProductVisibility(toggle.dataset.toggleProduct, toggle.checked);
    }
  });
}

function bindFormEvents() {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback(loginError, "");

    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      await state.firebase.signInWithEmailAndPassword(state.auth, email, password);
    } catch (error) {
      console.error(error);
      setFeedback(loginError, "Đăng nhập thất bại. Kiểm tra email và password.", "error");
    }
  });

  logoutButton.addEventListener("click", async () => {
    await state.firebase.signOut(state.auth);
  });

  seedButton.addEventListener("click", seedStarterProducts);

  productForm.addEventListener("submit", handleSaveProduct);

  resetButton.addEventListener("click", () => {
    resetForm();
  });

  productSearch.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    renderProductList();
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0] || null;
    state.selectedFile = file;
    clearPreviewObjectUrl();

    if (file) {
      state.previewObjectUrl = URL.createObjectURL(file);
      renderImagePreview(state.previewObjectUrl, file.name);
      return;
    }

    const currentUrl = currentImageUrlField.value;
    if (currentUrl) {
      renderImagePreview(currentUrl, nameField.value || "Preview ảnh sản phẩm");
      return;
    }

    renderImagePreview("", "");
  });
}

function handleAuthState(user) {
  state.user = user && user.email === state.adminEmail ? user : null;
  setSessionLabel();

  if (user && !state.user) {
    state.firebase.signOut(state.auth);
    setFeedback(loginError, "Tài khoản này không có quyền admin.", "error");
    setPanelVisibility(false);
    return;
  }

  setPanelVisibility(Boolean(state.user));

  if (state.user) {
    setFeedback(loginError, "");
    if (!state.unsubscribeProducts) {
      const { collection, onSnapshot } = state.firebase;
      state.unsubscribeProducts = onSnapshot(
        collection(state.db, "products"),
        (snapshot) => {
          state.products = snapshot.docs.map((docSnapshot) => ({
            firestoreId: docSnapshot.id,
            ...docSnapshot.data(),
          }));

          renderProductList();
          updateStats();
        },
        (error) => {
          console.error(error);
          setFeedback(productListFeedback, "Không thể tải danh sách sản phẩm.", "error");
        },
      );
    }
  } else if (state.unsubscribeProducts) {
    state.unsubscribeProducts();
    state.unsubscribeProducts = null;
    state.products = [];
    renderProductList();
  }
}

async function bootstrap() {
  const services = await getFirebaseServices();
  state.firebase = services;
  state.adminEmail = services.adminEmail || "haotranq1234@gmail.com";
  state.auth = services.getAuth(services.app);
  state.db = services.getFirestore(services.app);
  state.storage = services.getStorage(services.app);
  state.firebaseReady = true;

  adminEmailBadge.textContent = `Admin: ${state.adminEmail}`;

  try {
    await services.setPersistence(state.auth, services.browserLocalPersistence);
  } catch (error) {
    console.warn("Không set được persistence:", error);
  }

  bindProductListEvents();
  bindFormEvents();

  services.onAuthStateChanged(state.auth, handleAuthState);

  setPanelVisibility(false);
  resetForm();
  observeRevealElements(document);
}

document.documentElement.setAttribute("data-brand", siteConfig.brandName);
bootstrap().catch((error) => {
  console.error(error);
  setFeedback(loginError, "Không khởi tạo được Firebase. Hãy kiểm tra .env và API config.", "error");
});
