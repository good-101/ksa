const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const LEGACY_SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");
const SAAS_DB_FILE = path.join(DATA_DIR, "saas-db.json");

const THEME_PRESETS = [
  { id: "aurora", name: "Aurora Glass", colors: { backgroundStart: "#0b0e14", backgroundEnd: "#151d2d", accent: "#62d0ff", accentWarm: "#ffb86f", textStrong: "#f5f7fb", textSoft: "#c1cada", surface: "rgba(14, 17, 26, 0.58)" } },
  { id: "ember", name: "Ember Pulse", colors: { backgroundStart: "#17090a", backgroundEnd: "#3a1011", accent: "#ff6b57", accentWarm: "#ffc145", textStrong: "#fff4ef", textSoft: "#ffcfbf", surface: "rgba(44, 14, 16, 0.64)" } },
  { id: "verdant", name: "Verdant Night", colors: { backgroundStart: "#07130d", backgroundEnd: "#11261a", accent: "#3ddc84", accentWarm: "#d8c325", textStrong: "#f4fff7", textSoft: "#b9d9c5", surface: "rgba(10, 31, 20, 0.62)" } },
  { id: "mono", name: "Monolith", colors: { backgroundStart: "#101010", backgroundEnd: "#2a2a2a", accent: "#f2f2f2", accentWarm: "#9f9f9f", textStrong: "#ffffff", textSoft: "#d7d7d7", surface: "rgba(32, 32, 32, 0.66)" } },
  { id: "candy", name: "Candy Pop", colors: { backgroundStart: "#170b24", backgroundEnd: "#2a1340", accent: "#ff67c8", accentWarm: "#73d8ff", textStrong: "#fff7ff", textSoft: "#e6c6ef", surface: "rgba(44, 21, 63, 0.62)" } }
];

const DEFAULT_SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", url: "", enabled: true },
  { id: "telegram", label: "Telegram", url: "", enabled: true },
  { id: "whatsapp", label: "WhatsApp", url: "", enabled: true },
  { id: "tiktok", label: "TikTok", url: "", enabled: true }
];

const DEFAULT_BUTTONS = [
  { id: "btn-store", label: "المتجر الإلكتروني", url: "#", mediaType: "icon", icon: "store", imageUrl: "", enabled: true },
  { id: "btn-tiktok", label: "تيك توك", url: "#", mediaType: "icon", icon: "tiktok", imageUrl: "", enabled: true },
  { id: "btn-whatsapp", label: "واتس أب", url: "#", mediaType: "icon", icon: "whatsapp", imageUrl: "", enabled: true },
  { id: "btn-telegram", label: "تيليجرام", url: "#", mediaType: "icon", icon: "telegram", imageUrl: "", enabled: true },
  { id: "btn-instagram", label: "إنستقرام", url: "#", mediaType: "icon", icon: "instagram", imageUrl: "", enabled: true }
];

const DEFAULT_SETTINGS = {
  profileTitle: "KSA",
  profileDescription: "اجمع كل روابطك في صفحة واحدة بتجربة أنيقة وسريعة.",
  profileImage: "",
  activeThemeId: "aurora",
  themePresets: THEME_PRESETS,
  colors: THEME_PRESETS[0].colors,
  buttonLayout: "icon-right",
  socialLinks: DEFAULT_SOCIAL_LINKS,
  buttons: DEFAULT_BUTTONS
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function normalizeColors(input, fallback = THEME_PRESETS[0].colors) {
  const incoming = input || {};
  return {
    backgroundStart: typeof incoming.backgroundStart === "string" ? incoming.backgroundStart : fallback.backgroundStart,
    backgroundEnd: typeof incoming.backgroundEnd === "string" ? incoming.backgroundEnd : fallback.backgroundEnd,
    accent: typeof incoming.accent === "string" ? incoming.accent : fallback.accent,
    accentWarm: typeof incoming.accentWarm === "string" ? incoming.accentWarm : fallback.accentWarm,
    textStrong: typeof incoming.textStrong === "string" ? incoming.textStrong : fallback.textStrong,
    textSoft: typeof incoming.textSoft === "string" ? incoming.textSoft : fallback.textSoft,
    surface: typeof incoming.surface === "string" ? incoming.surface : fallback.surface
  };
}

function normalizeThemePresets(input) {
  if (!Array.isArray(input) || input.length !== 5) {
    return clone(THEME_PRESETS);
  }

  return input.map((theme, index) => ({
    id: typeof theme.id === "string" && theme.id.trim() ? theme.id.trim() : THEME_PRESETS[index].id,
    name: typeof theme.name === "string" && theme.name.trim() ? theme.name.trim() : THEME_PRESETS[index].name,
    colors: normalizeColors(theme.colors, THEME_PRESETS[index].colors)
  }));
}

function normalizeSocialLinks(input) {
  if (!Array.isArray(input)) {
    return clone(DEFAULT_SOCIAL_LINKS);
  }

  return input.map((item, index) => ({
    id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `social-${index + 1}`,
    label: typeof item.label === "string" && item.label.trim() ? item.label.trim() : "رابط",
    url: typeof item.url === "string" ? item.url.trim() : "",
    enabled: Boolean(item.enabled)
  }));
}

function normalizeButtons(input) {
  if (!Array.isArray(input)) {
    return clone(DEFAULT_BUTTONS);
  }

  return input.map((item, index) => ({
    id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `button-${index + 1}`,
    label: typeof item.label === "string" && item.label.trim() ? item.label.trim() : `زر ${index + 1}`,
    url: typeof item.url === "string" && item.url.trim() ? item.url.trim() : "#",
    mediaType: item.mediaType === "image" ? "image" : "icon",
    icon: typeof item.icon === "string" && item.icon.trim() ? item.icon.trim() : "link",
    imageUrl: typeof item.imageUrl === "string" ? item.imageUrl.trim() : "",
    enabled: Boolean(item.enabled)
  }));
}

function sanitizeSettings(input) {
  const parsed = input || {};
  const themePresets = normalizeThemePresets(parsed.themePresets);
  const activeThemeId = typeof parsed.activeThemeId === "string" && themePresets.some((theme) => theme.id === parsed.activeThemeId)
    ? parsed.activeThemeId
    : themePresets[0].id;
  const activeTheme = themePresets.find((theme) => theme.id === activeThemeId) || themePresets[0];

  return {
    profileTitle: typeof parsed.profileTitle === "string" && parsed.profileTitle.trim() ? parsed.profileTitle.trim() : DEFAULT_SETTINGS.profileTitle,
    profileDescription: typeof parsed.profileDescription === "string" && parsed.profileDescription.trim() ? parsed.profileDescription.trim() : DEFAULT_SETTINGS.profileDescription,
    profileImage: typeof parsed.profileImage === "string" ? parsed.profileImage.trim() : "",
    activeThemeId,
    themePresets,
    colors: normalizeColors(parsed.colors, activeTheme.colors),
    buttonLayout: parsed.buttonLayout === "icon-left" ? "icon-left" : "icon-right",
    socialLinks: normalizeSocialLinks(parsed.socialLinks),
    buttons: normalizeButtons(parsed.buttons)
  };
}

function slugify(value, fallback) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || fallback;
}

function randomChunk() {
  return Math.random().toString(36).slice(2, 8);
}

function buildUniqueSlug(base, existing) {
  let candidate = slugify(base, "site");
  while (existing.has(candidate)) {
    candidate = `${slugify(base, "site")}-${randomChunk()}`;
  }
  return candidate;
}

function buildUniqueAdminSlug(existing) {
  let candidate = `admin-${randomChunk()}${randomChunk().slice(0, 2)}`;
  while (existing.has(candidate)) {
    candidate = `admin-${randomChunk()}${randomChunk().slice(0, 2)}`;
  }
  return candidate;
}

function normalizeCustomDomain(value) {
  if (typeof value !== "string") return "";
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  if (!normalized || normalized === "127.0.0.1" || normalized === "localhost") {
    return "";
  }
  if (!isValidCustomDomain(normalized)) {
    return "";
  }
  return normalized;
}

function isValidCustomDomain(value) {
  if (!value || value.includes("@") || value.length > 253 || !value.includes(".")) {
    return false;
  }

  const labels = value.split(".");
  return labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
}

function createSiteRecord(data = {}) {
  return {
    id: data.id || `site-${Date.now()}-${randomChunk()}`,
    name: typeof data.name === "string" && data.name.trim() ? data.name.trim() : "New Site",
    siteSlug: typeof data.siteSlug === "string" && data.siteSlug.trim() ? data.siteSlug.trim() : `site-${randomChunk()}`,
    adminSlug: typeof data.adminSlug === "string" && data.adminSlug.trim() ? data.adminSlug.trim() : `admin-${randomChunk()}`,
    customDomain: normalizeCustomDomain(data.customDomain),
    customerName: typeof data.customerName === "string" ? data.customerName.trim() : "",
    customerEmail: typeof data.customerEmail === "string" ? data.customerEmail.trim() : "",
    status: data.status === "paused" ? "paused" : "active",
    createdAt: data.createdAt || new Date().toISOString(),
    settings: sanitizeSettings(data.settings || DEFAULT_SETTINGS)
  };
}

function createInitialDatabase() {
  let initialSettings = clone(DEFAULT_SETTINGS);

  if (fs.existsSync(LEGACY_SETTINGS_FILE)) {
    try {
      initialSettings = sanitizeSettings(JSON.parse(fs.readFileSync(LEGACY_SETTINGS_FILE, "utf8")));
    } catch (error) {
      initialSettings = clone(DEFAULT_SETTINGS);
    }
  }

  return {
    owner: {
      name: "Owner",
      email: "owner@example.com",
      password: "change-me-now"
    },
    sites: [
      createSiteRecord({
        id: "site-primary",
        name: "Primary Demo",
        siteSlug: "primary-demo",
        adminSlug: "studio-a9k3m7x2",
        customerName: "Default Customer",
        customerEmail: "",
        createdAt: new Date().toISOString(),
        settings: initialSettings
      })
    ]
  };
}

function ensureDatabase() {
  ensureDataDir();

  if (!fs.existsSync(SAAS_DB_FILE)) {
    fs.writeFileSync(SAAS_DB_FILE, JSON.stringify(createInitialDatabase(), null, 2));
  }
}

function readDatabase() {
  ensureDatabase();

  try {
    const parsed = JSON.parse(fs.readFileSync(SAAS_DB_FILE, "utf8"));
    const owner = parsed.owner || {};
    const sites = Array.isArray(parsed.sites) && parsed.sites.length > 0
      ? parsed.sites.map((site) => createSiteRecord(site))
      : createInitialDatabase().sites;

    return {
      owner: {
        name: typeof owner.name === "string" && owner.name.trim() ? owner.name.trim() : "Owner",
        email: typeof owner.email === "string" && owner.email.trim() ? owner.email.trim() : "owner@example.com",
        password: typeof owner.password === "string" && owner.password.trim() ? owner.password : "change-me-now"
      },
      sites
    };
  } catch (error) {
    return createInitialDatabase();
  }
}

function writeDatabase(database) {
  ensureDatabase();
  fs.writeFileSync(SAAS_DB_FILE, JSON.stringify(database, null, 2));
}

function listSites() {
  return readDatabase().sites;
}

function getDefaultSite() {
  return listSites()[0] || createSiteRecord({ settings: DEFAULT_SETTINGS });
}

function findSiteBySiteSlug(siteSlug) {
  if (!siteSlug) return getDefaultSite();
  return listSites().find((site) => site.siteSlug === siteSlug) || null;
}

function findSiteByAdminSlug(adminSlug) {
  return listSites().find((site) => site.adminSlug === adminSlug) || null;
}

function findSiteByCustomDomain(customDomain) {
  const normalizedDomain = normalizeCustomDomain(customDomain);
  if (!normalizedDomain) return null;
  return listSites().find((site) => site.customDomain === normalizedDomain) || null;
}

function updateSiteSettings(adminSlug, settings) {
  const database = readDatabase();
  const site = database.sites.find((item) => item.adminSlug === adminSlug);
  if (!site) return null;
  site.settings = sanitizeSettings(settings);
  writeDatabase(database);
  return site;
}

function createSite(input) {
  const database = readDatabase();
  const existingSiteSlugs = new Set(database.sites.map((site) => site.siteSlug));
  const existingAdminSlugs = new Set(database.sites.map((site) => site.adminSlug));
  const baseName = typeof input.name === "string" && input.name.trim() ? input.name.trim() : "New Site";
  const rawCustomDomain = typeof input.customDomain === "string" ? input.customDomain.trim() : "";
  const customDomain = normalizeCustomDomain(rawCustomDomain);

  if (rawCustomDomain && !customDomain) {
    throw new Error("INVALID_CUSTOM_DOMAIN");
  }

  if (customDomain && database.sites.some((site) => site.customDomain === customDomain)) {
    throw new Error("CUSTOM_DOMAIN_IN_USE");
  }

  const site = createSiteRecord({
    name: baseName,
    siteSlug: buildUniqueSlug(input.siteSlug || baseName, existingSiteSlugs),
    adminSlug: buildUniqueAdminSlug(existingAdminSlugs),
    customDomain,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    settings: DEFAULT_SETTINGS
  });

  database.sites.push(site);
  writeDatabase(database);
  return site;
}

function deleteSite(siteId) {
  const database = readDatabase();
  if (database.sites.length <= 1) {
    return { error: "last-site" };
  }

  const siteIndex = database.sites.findIndex((site) => site.id === siteId);
  if (siteIndex === -1) {
    return null;
  }

  const [deletedSite] = database.sites.splice(siteIndex, 1);
  writeDatabase(database);
  return deletedSite;
}

function updateOwner(input) {
  const database = readDatabase();
  if (typeof input.name === "string" && input.name.trim()) database.owner.name = input.name.trim();
  if (typeof input.email === "string" && input.email.trim()) database.owner.email = input.email.trim();
  if (typeof input.password === "string" && input.password.trim()) database.owner.password = input.password;
  writeDatabase(database);
  return { ...database.owner, password: undefined };
}

function verifyOwner(email, password) {
  const database = readDatabase();
  return database.owner.email === email && database.owner.password === password;
}

function getOwnerPublicProfile() {
  const owner = readDatabase().owner;
  return {
    name: owner.name,
    email: owner.email,
    requiresPasswordChange: owner.password === "change-me-now"
  };
}

module.exports = {
  SAAS_DB_FILE,
  sanitizeSettings,
  ensureDatabase,
  readDatabase,
  writeDatabase,
  listSites,
  getDefaultSite,
  findSiteBySiteSlug,
  findSiteByAdminSlug,
  findSiteByCustomDomain,
  updateSiteSettings,
  createSite,
  deleteSite,
  verifyOwner,
  getOwnerPublicProfile,
  updateOwner
};
