export const DEMO_MODEL_URL =
  "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.glb";

export const MENU_STORAGE_KEY = "ar-menu-custom-items";

/**
 * Validates that a 3D model URL uses either an HTTPS URL or a safe root-relative path.
 * Rejects protocol-relative URLs (//), backslashes, whitespace/control chars, and unsafe schemes.
 *
 * @param {unknown} url
 * @returns {boolean}
 */
export function isSafeModelUrl(url) {
  if (typeof url !== "string") {
    return false;
  }
  const trimmed = url.trim();
  if (!trimmed || /[\s\u0000-\u001F\u007F]/.test(trimmed)) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.includes("\\")) {
      return false;
    }
    return trimmed.length > 1;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return false;
    }
    if (!parsed.hostname || parsed.username || parsed.password) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether a URL's pathname points to a .glb or .gltf 3D asset.
 *
 * @param {unknown} url
 * @returns {boolean}
 */
export function isModelAssetExtension(url) {
  if (!isSafeModelUrl(url)) {
    return false;
  }
  const trimmed = String(url).trim();
  try {
    const parsed = trimmed.startsWith("/")
      ? new URL(trimmed, "https://placeholder.local")
      : new URL(trimmed);
    const pathname = parsed.pathname.toLowerCase();
    return pathname.endsWith(".glb") || pathname.endsWith(".gltf");
  } catch {
    return false;
  }
}

/**
 * Finds a menu item by ID (trimmed exact match).
 *
 * @template {{ id: string }} T
 * @param {readonly T[]} items
 * @param {unknown} id
 * @returns {T | undefined}
 */
export function getMenuItemById(items, id) {
  if (!Array.isArray(items) || typeof id !== "string") {
    return undefined;
  }
  const normalizedId = id.trim();
  if (!normalizedId) {
    return undefined;
  }
  return items.find((item) => item && typeof item.id === "string" && item.id === normalizedId);
}

/**
 * Builds the encoded app path for a menu item detail page.
 *
 * @param {string} id
 * @returns {string}
 */
export function buildMenuItemPath(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Menü öğesi kimliği boş olamaz.");
  }
  return `/menu/${encodeURIComponent(id.trim())}`;
}

/**
 * Builds a full HTTP/HTTPS QR code URL for a menu item using a validated origin.
 * Returns empty string if origin is not ready or invalid.
 *
 * @param {unknown} origin
 * @param {string} id
 * @returns {string}
 */
export function buildMenuQrUrl(origin, id) {
  const path = buildMenuItemPath(id);
  if (typeof origin !== "string" || !origin.trim()) {
    return "";
  }
  const cleaned = origin.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    if (!parsed.origin || parsed.origin === "null") {
      return "";
    }
    return `${parsed.origin}${path}`;
  } catch {
    return "";
  }
}

/**
 * Formats a non-negative finite number as Turkish Lira (TRY).
 *
 * @param {unknown} price
 * @returns {string}
 */
export function formatPriceTRY(price) {
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    throw new RangeError("Fiyat geçerli ve negatif olmayan bir sayı olmalıdır.");
  }
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted} ₺`;
}

/**
 * Validates raw form input for creating a menu item.
 *
 * @param {{ name?: unknown, description?: unknown, price?: unknown, modelUrl?: unknown }} input
 * @returns {{ valid: true, errors: Record<string, never>, item: { name: string, description: string, price: number, modelUrl: string } } | { valid: false, errors: { name?: string, description?: string, price?: string, modelUrl?: string } }}
 */
export function validateMenuItemInput(input) {
  const errors = {};

  const rawName = typeof input?.name === "string" ? input.name.trim() : "";
  if (rawName.length < 2 || rawName.length > 80) {
    errors.name = "Ürün adı 2 ile 80 karakter arasında olmalıdır.";
  }

  const rawDescription = typeof input?.description === "string" ? input.description.trim() : "";
  if (rawDescription.length < 5 || rawDescription.length > 400) {
    errors.description = "Açıklama 5 ile 400 karakter arasında olmalıdır.";
  }

  const parsedPrice =
    typeof input?.price === "number"
      ? input.price
      : typeof input?.price === "string" && input.price.trim() !== ""
        ? Number(input.price.trim().replace(",", "."))
        : NaN;

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || parsedPrice > 100000) {
    errors.price = "Fiyat 0'dan büyük ve en fazla 100.000 olmalıdır.";
  }

  const rawModelUrl = typeof input?.modelUrl === "string" ? input.modelUrl.trim() : "";
  const resolvedModelUrl = rawModelUrl || DEMO_MODEL_URL;
  if (!isSafeModelUrl(resolvedModelUrl) || !isModelAssetExtension(resolvedModelUrl)) {
    errors.modelUrl =
      "Model URL'si yalnızca https:// veya / ile başlayan geçerli bir .glb/.gltf dosyası olmalıdır.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    item: {
      name: rawName,
      description: rawDescription,
      price: Math.round(parsedPrice * 100) / 100,
      modelUrl: resolvedModelUrl,
    },
  };
}

/**
 * Safely merges default menu items with custom items loaded from client storage.
 * Invalid or unsafe stored items are ignored without throwing.
 *
 * @template {{ id: string, name: string, description: string, price: number, modelUrl: string }} T
 * @param {readonly T[]} defaults
 * @param {unknown} stored
 * @returns {T[]}
 */
export function mergeStoredMenuItems(defaults, stored) {
  const base = Array.isArray(defaults) ? [...defaults] : [];
  if (!Array.isArray(stored)) {
    return base;
  }

  const seenIds = new Set(base.map((item) => item.id));
  const merged = [...base];

  for (const candidate of stored) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }
    const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
    const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
    const description =
      typeof candidate.description === "string" ? candidate.description.trim() : "";
    const price = candidate.price;
    const modelUrl = typeof candidate.modelUrl === "string" ? candidate.modelUrl.trim() : "";

    if (
      !id ||
      seenIds.has(id) ||
      name.length < 2 ||
      description.length < 5 ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !isSafeModelUrl(modelUrl)
    ) {
      continue;
    }

    seenIds.add(id);
    merged.push({
      id,
      name,
      description,
      price,
      modelUrl,
    });
  }

  return merged;
}
