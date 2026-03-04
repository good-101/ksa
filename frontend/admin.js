const SOCIAL_TYPE_OPTIONS = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "snapchat", label: "Snapchat" },
  { id: "youtube", label: "YouTube" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "tiktok", label: "TikTok" },
  { id: "x", label: "X" },
  { id: "link", label: "Website" }
];

const BUTTON_ICON_OPTIONS = [
  { id: "store", label: "Store" },
  { id: "bag", label: "Bag" },
  { id: "cart", label: "Cart" },
  { id: "globe", label: "Globe" },
  { id: "link", label: "Link" },
  { id: "phone", label: "Phone" },
  { id: "mail", label: "Mail" },
  { id: "location", label: "Location" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "snapchat", label: "Snapchat" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "tiktok", label: "TikTok" },
  { id: "x", label: "X" },
  { id: "bookmark", label: "Bookmark" },
  { id: "bell", label: "Bell" },
  { id: "calendar", label: "Calendar" },
  { id: "chat", label: "Chat" },
  { id: "clock", label: "Clock" },
  { id: "cloud", label: "Cloud" },
  { id: "download", label: "Download" },
  { id: "edit", label: "Edit" },
  { id: "file", label: "File" },
  { id: "film", label: "Film" },
  { id: "flag", label: "Flag" },
  { id: "gamepad", label: "Gamepad" },
  { id: "headset", label: "Headset" },
  { id: "image", label: "Image" },
  { id: "info", label: "Info" },
  { id: "laptop", label: "Laptop" },
  { id: "lock", label: "Lock" },
  { id: "message", label: "Message" },
  { id: "search", label: "Search" },
  { id: "settings", label: "Settings" },
  { id: "shield", label: "Shield" },
  { id: "shopping", label: "Shopping" },
  { id: "thumbsup", label: "Thumbs Up" },
  { id: "user", label: "User" },
  { id: "video", label: "Video" },
  { id: "camera", label: "Camera" },
  { id: "play", label: "Play" },
  { id: "music", label: "Music" },
  { id: "heart", label: "Heart" },
  { id: "star", label: "Star" },
  { id: "gift", label: "Gift" },
  { id: "bolt", label: "Bolt" },
  { id: "home", label: "Home" }
];

const DEFAULT_THEME_PRESETS = [
  { id: "aurora", name: "Aurora Glass", colors: { backgroundStart: "#0b0e14", backgroundEnd: "#151d2d", accent: "#62d0ff", accentWarm: "#ffb86f", textStrong: "#f5f7fb", textSoft: "#c1cada", surface: "rgba(14, 17, 26, 0.58)" } },
  { id: "ember", name: "Ember Pulse", colors: { backgroundStart: "#17090a", backgroundEnd: "#3a1011", accent: "#ff6b57", accentWarm: "#ffc145", textStrong: "#fff4ef", textSoft: "#ffcfbf", surface: "rgba(44, 14, 16, 0.64)" } },
  { id: "verdant", name: "Verdant Night", colors: { backgroundStart: "#07130d", backgroundEnd: "#11261a", accent: "#3ddc84", accentWarm: "#d8c325", textStrong: "#f4fff7", textSoft: "#b9d9c5", surface: "rgba(10, 31, 20, 0.62)" } },
  { id: "mono", name: "Monolith", colors: { backgroundStart: "#101010", backgroundEnd: "#2a2a2a", accent: "#f2f2f2", accentWarm: "#9f9f9f", textStrong: "#ffffff", textSoft: "#d7d7d7", surface: "rgba(32, 32, 32, 0.66)" } },
  { id: "candy", name: "Candy Pop", colors: { backgroundStart: "#170b24", backgroundEnd: "#2a1340", accent: "#ff67c8", accentWarm: "#73d8ff", textStrong: "#fff7ff", textSoft: "#e6c6ef", surface: "rgba(44, 21, 63, 0.62)" } }
];

const DEFAULT_SETTINGS = {
  profileTitle: "KSA",
  profileDescription: "اجمع كل روابطك في صفحة واحدة بتجربة أنيقة وسريعة.",
  profileImage: "",
  activeThemeId: "aurora",
  themePresets: DEFAULT_THEME_PRESETS,
  colors: DEFAULT_THEME_PRESETS[0].colors,
  buttonLayout: "icon-right",
  socialLinks: [],
  buttons: []
};

const LEGACY_BUTTON_ICON_MAP = {
  cart: "store",
  instagram: "instagram",
  telegram: "telegram",
  whatsapp: "whatsapp",
  tiktok: "tiktok",
  link: "link"
};

const ICON_USE_MAP = {
  instagram: "instagram",
  facebook: "facebook",
  snapchat: "snapchat",
  youtube: "youtube",
  telegram: "telegram",
  whatsapp: "whatsapp",
  tiktok: "tiktok",
  x: "x",
  website: "globe",
  link: "link",
  store: "store",
  bag: "bag",
  cart: "cart",
  globe: "globe",
  phone: "phone",
  mail: "mail",
  location: "location",
  linkedin: "linkedin",
  bookmark: "bookmark",
  bell: "bell",
  calendar: "calendar",
  chat: "chat",
  clock: "clock",
  cloud: "cloud",
  download: "download",
  edit: "edit",
  file: "file",
  film: "film",
  flag: "flag",
  gamepad: "gamepad",
  headset: "headset",
  image: "image",
  info: "info",
  laptop: "laptop",
  lock: "lock",
  message: "message",
  search: "search",
  settings: "settings",
  shield: "shield",
  shopping: "shopping",
  thumbsup: "thumbsup",
  user: "user",
  video: "video",
  camera: "camera",
  play: "play",
  music: "music",
  heart: "heart",
  star: "star",
  gift: "gift",
  bolt: "bolt",
  home: "home"
};

const form = document.getElementById("settings-form");
const statusText = document.getElementById("status-text");
const themeGrid = document.getElementById("theme-grid");
const socialList = document.getElementById("social-list");
const buttonList = document.getElementById("button-list");
const addSocialButton = document.getElementById("add-social-button");
const addButtonButton = document.getElementById("add-button-button");
const imageUrlInput = document.getElementById("profile-image-input");
const imageFileInput = document.getElementById("profile-image-file");

const fields = {
  profileTitle: document.getElementById("profile-title-input"),
  profileDescription: document.getElementById("profile-description-input"),
  profileImage: imageUrlInput,
  backgroundStart: document.getElementById("background-start-input"),
  backgroundEnd: document.getElementById("background-end-input"),
  accent: document.getElementById("accent-input"),
  accentWarm: document.getElementById("accent-warm-input"),
  textStrong: document.getElementById("text-strong-input"),
  textSoft: document.getElementById("text-soft-input"),
  surfaceColor: document.getElementById("surface-color-input"),
  surfaceOpacity: document.getElementById("surface-opacity-input")
};

const surfaceOpacityValue = document.getElementById("surface-opacity-value");

const preview = {
  card: document.getElementById("preview-card"),
  title: document.getElementById("preview-title"),
  description: document.getElementById("preview-description"),
  image: document.getElementById("preview-image"),
  fallback: document.getElementById("preview-fallback"),
  socials: document.getElementById("preview-socials"),
  buttons: document.getElementById("preview-buttons")
};

const state = {
  settings: null
};

async function loadAdminSettings() {
  if (!window.ADMIN_SLUG) {
    statusText.textContent = "Open the private client admin link from the dashboard.";
    form.querySelectorAll("input, textarea, select, button").forEach((element) => {
      element.disabled = true;
    });
    return;
  }

  try {
    const response = await fetch(`/api/site-settings?adminSlug=${encodeURIComponent(window.ADMIN_SLUG)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load settings");
    state.settings = normalizeSettings(await response.json());
    populateBaseFields();
    renderThemeGrid();
    renderSocialRows();
    renderButtonRows();
    syncPreview();
  } catch (error) {
    statusText.textContent = "تعذر تحميل الإعدادات";
  }
}

function normalizeSettings(settings) {
  const themePresets = Array.isArray(settings?.themePresets) && settings.themePresets.length
    ? settings.themePresets.map((theme, index) => ({
      id: typeof theme?.id === "string" && theme.id.trim() ? theme.id : DEFAULT_THEME_PRESETS[index]?.id || `theme-${index + 1}`,
      name: typeof theme?.name === "string" && theme.name.trim() ? theme.name : DEFAULT_THEME_PRESETS[index]?.name || `Theme ${index + 1}`,
      colors: normalizeThemeColors(theme?.colors, DEFAULT_THEME_PRESETS[index]?.colors || DEFAULT_THEME_PRESETS[0].colors)
    }))
    : DEFAULT_THEME_PRESETS.map((theme) => ({ ...theme, colors: { ...theme.colors } }));

  const activeThemeId = typeof settings?.activeThemeId === "string" && themePresets.some((theme) => theme.id === settings.activeThemeId)
    ? settings.activeThemeId
    : themePresets[0].id;
  const activeTheme = themePresets.find((theme) => theme.id === activeThemeId) || themePresets[0];

  return {
    profileTitle: typeof settings?.profileTitle === "string" && settings.profileTitle.trim() ? settings.profileTitle : DEFAULT_SETTINGS.profileTitle,
    profileDescription: typeof settings?.profileDescription === "string" ? settings.profileDescription : DEFAULT_SETTINGS.profileDescription,
    profileImage: typeof settings?.profileImage === "string" ? settings.profileImage : "",
    activeThemeId,
    themePresets,
    colors: normalizeThemeColors(settings?.colors, activeTheme.colors),
    buttonLayout: settings?.buttonLayout === "icon-left" ? "icon-left" : "icon-right",
    socialLinks: Array.isArray(settings?.socialLinks)
      ? settings.socialLinks.map((item, index) => ({
        id: typeof item?.id === "string" && item.id.trim() ? item.id : "instagram",
        label: typeof item?.label === "string" && item.label.trim() ? item.label : `رابط ${index + 1}`,
        url: typeof item?.url === "string" ? item.url : "",
        enabled: Boolean(item?.enabled)
      }))
      : [],
    buttons: Array.isArray(settings?.buttons)
      ? settings.buttons.map(normalizeButtonState)
      : []
  };
}

function normalizeThemeColors(colors, fallback) {
  return {
    backgroundStart: typeof colors?.backgroundStart === "string" ? colors.backgroundStart : fallback.backgroundStart,
    backgroundEnd: typeof colors?.backgroundEnd === "string" ? colors.backgroundEnd : fallback.backgroundEnd,
    accent: typeof colors?.accent === "string" ? colors.accent : fallback.accent,
    accentWarm: typeof colors?.accentWarm === "string" ? colors.accentWarm : fallback.accentWarm,
    textStrong: typeof colors?.textStrong === "string" ? colors.textStrong : fallback.textStrong,
    textSoft: typeof colors?.textSoft === "string" ? colors.textSoft : fallback.textSoft,
    surface: typeof colors?.surface === "string" ? colors.surface : fallback.surface
  };
}

function normalizeButtonState(button) {
  const mappedIcon = LEGACY_BUTTON_ICON_MAP[button.icon] || button.icon || "link";
  return {
    ...button,
    mediaType: button.mediaType === "image" ? "image" : "icon",
    icon: mappedIcon,
    imageUrl: button.imageUrl || ""
  };
}

function populateBaseFields() {
  const settings = state.settings;
  fields.profileTitle.value = settings.profileTitle || "";
  fields.profileDescription.value = settings.profileDescription || "";
  fields.profileImage.value = settings.profileImage || "";
  loadCurrentThemeColors();

  const radio = form.querySelector(`input[name="buttonLayout"][value="${settings.buttonLayout || "icon-right"}"]`);
  if (radio) radio.checked = true;
}

function getActiveTheme() {
  return state.settings.themePresets.find((theme) => theme.id === state.settings.activeThemeId) || state.settings.themePresets[0];
}

function loadCurrentThemeColors() {
  const theme = getActiveTheme();
  fields.backgroundStart.value = theme.colors.backgroundStart;
  fields.backgroundEnd.value = theme.colors.backgroundEnd;
  fields.accent.value = theme.colors.accent;
  fields.accentWarm.value = theme.colors.accentWarm;
  fields.textStrong.value = theme.colors.textStrong;
  fields.textSoft.value = theme.colors.textSoft;
  const surfaceColor = parseSurfaceColor(theme.colors.surface);
  fields.surfaceColor.value = surfaceColor.hex;
  fields.surfaceOpacity.value = String(surfaceColor.opacity);
  surfaceOpacityValue.textContent = `${surfaceColor.opacity}%`;
  state.settings.colors = { ...theme.colors };
}

function syncCurrentThemeFromFields() {
  const theme = getActiveTheme();
  const nextColors = {
    backgroundStart: fields.backgroundStart.value,
    backgroundEnd: fields.backgroundEnd.value,
    accent: fields.accent.value,
    accentWarm: fields.accentWarm.value,
    textStrong: fields.textStrong.value,
    textSoft: fields.textSoft.value,
    surface: buildSurfaceRgba(fields.surfaceColor.value, Number(fields.surfaceOpacity.value))
  };

  theme.colors = nextColors;
  state.settings.colors = { ...nextColors };
}

function renderThemeGrid() {
  themeGrid.innerHTML = state.settings.themePresets
    .map((theme) => `
      <button type="button" class="theme-card ${theme.id === state.settings.activeThemeId ? "active" : ""}" data-theme-id="${escapeHtml(theme.id)}">
        <span class="theme-swatch">
          <span style="background:${escapeHtml(theme.colors.backgroundStart)}"></span>
          <span style="background:${escapeHtml(theme.colors.backgroundEnd)}"></span>
          <span style="background:${escapeHtml(theme.colors.accent)}"></span>
          <span style="background:${escapeHtml(theme.colors.accentWarm)}"></span>
        </span>
        <strong>${escapeHtml(theme.name)}</strong>
        <small>${escapeHtml(theme.id)}</small>
      </button>
    `)
    .join("");
}

function renderSocialRows() {
  socialList.innerHTML = state.settings.socialLinks
    .map((item, index) => `
      <div class="inline-card" data-social-index="${index}">
        <div class="inline-grid three">
          <label class="field">
            <span>المنصة</span>
            <select data-social-field="id">
              ${SOCIAL_TYPE_OPTIONS.map((option) => `<option value="${option.id}" ${option.id === item.id ? "selected" : ""}>${option.label}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>الاسم الظاهر</span>
            <input type="text" value="${escapeAttribute(item.label)}" data-social-field="label">
          </label>
          <button type="button" class="danger-action" data-remove-social="${index}">حذف</button>
        </div>
        <label class="field">
          <span>الرابط</span>
          <input type="url" value="${escapeAttribute(item.url)}" data-social-field="url" placeholder="https://example.com/account">
        </label>
        <label class="toggle-row">
          <input type="checkbox" ${item.enabled ? "checked" : ""} data-social-field="enabled">
          <span>إظهار الأيقونة في الموقع</span>
        </label>
      </div>
    `)
    .join("");
}

function renderButtonRows() {
  buttonList.innerHTML = state.settings.buttons
    .map((item, index) => `
      <div class="inline-card" data-button-index="${index}">
        <div class="inline-grid three">
          <label class="field">
            <span>عنوان الزر</span>
            <input type="text" value="${escapeAttribute(item.label)}" data-button-field="label">
          </label>
          <label class="field">
            <span>النوع</span>
            <select data-button-field="mediaType">
              <option value="icon" ${item.mediaType === "icon" ? "selected" : ""}>أيقونة</option>
              <option value="image" ${item.mediaType === "image" ? "selected" : ""}>صورة</option>
            </select>
          </label>
          <button type="button" class="danger-action" data-remove-button="${index}">حذف</button>
        </div>
        <label class="field">
          <span>رابط الزر</span>
          <input type="url" value="${escapeAttribute(item.url)}" data-button-field="url" placeholder="https://example.com/page">
        </label>
        <div class="inline-grid">
          <label class="field">
            <span>الأيقونة الحالية</span>
            <input type="text" value="${escapeAttribute(item.icon)}" readonly>
          </label>
          <label class="field">
            <span>رابط الصورة</span>
            <input type="url" value="${escapeAttribute(item.imageUrl)}" data-button-field="imageUrl" placeholder="https://example.com/image.png">
          </label>
        </div>
        <label class="field">
          <span>رفع صورة للزر</span>
          <input type="file" accept="image/*" data-button-file="${index}">
        </label>
        <label class="field">
          <span>اختيار أيقونة</span>
          <div class="glyph-picker" data-icon-picker="${index}">
            ${BUTTON_ICON_OPTIONS.map((option) => `<button type="button" class="glyph-chip ${item.icon === option.id ? "active" : ""}" data-button-icon="${option.id}" data-button-icon-index="${index}" title="${option.label}"><svg viewBox="0 0 24 24"><use href="#icon-${ICON_USE_MAP[option.id] || "link"}"></use></svg></button>`).join("")}
          </div>
        </label>
        <label class="toggle-row">
          <input type="checkbox" ${item.enabled ? "checked" : ""} data-button-field="enabled">
          <span>إظهار الزر في الموقع</span>
        </label>
      </div>
    `)
    .join("");
}

function collectSettings() {
  state.settings.profileTitle = fields.profileTitle.value.trim();
  state.settings.profileDescription = fields.profileDescription.value.trim();
  state.settings.profileImage = fields.profileImage.value.trim();
  state.settings.buttonLayout = form.querySelector('input[name="buttonLayout"]:checked')?.value || "icon-right";
  syncCurrentThemeFromFields();
  return state.settings;
}

function syncPreview() {
  syncCurrentThemeFromFields();
  const settings = collectSettings();

  preview.title.textContent = settings.profileTitle || "KSA";
  preview.description.textContent = settings.profileDescription || "";
  preview.card.dataset.layout = settings.buttonLayout;
  preview.card.dataset.theme = settings.activeThemeId;
  preview.card.style.background = `radial-gradient(circle at top left, ${hexToRgba(settings.colors.accent, 0.18)}, transparent 30%), linear-gradient(180deg, ${hexToRgba(settings.colors.backgroundStart, 0.94)}, ${hexToRgba(settings.colors.backgroundEnd, 0.94)})`;
  preview.card.style.color = settings.colors.textStrong;
  preview.description.style.color = settings.colors.textSoft;

  if (settings.profileImage) {
    preview.image.src = settings.profileImage;
    preview.image.classList.remove("is-hidden");
    preview.fallback.classList.add("is-hidden");
  } else {
    preview.image.removeAttribute("src");
    preview.image.classList.add("is-hidden");
    preview.fallback.classList.remove("is-hidden");
  }

  renderPreviewSocials(settings.socialLinks, settings.colors.accent);
  renderPreviewButtons(settings.buttons, settings.colors.accent);
}

function renderPreviewSocials(links, accentColor) {
  preview.socials.innerHTML = links
    .filter((item) => item.enabled)
    .map((item) => {
      const iconId = ICON_USE_MAP[item.id] || "link";
      return `<span class="preview-social" style="color:${escapeHtml(accentColor)}"><svg viewBox="0 0 24 24"><use href="#icon-${iconId}"></use></svg></span>`;
    })
    .join("");
}

function renderPreviewButtons(buttons, accentColor) {
  preview.buttons.innerHTML = buttons
    .filter((item) => item.enabled)
    .map((item) => `
      <div class="preview-button">
        <span class="preview-main">
          ${renderPreviewButtonMedia(item, accentColor)}
          <span>${escapeHtml(item.label)}</span>
        </span>
        <i class="preview-arrow"></i>
      </div>
    `)
    .join("");
}

function renderPreviewButtonMedia(item, accentColor) {
  if (item.mediaType === "image" && item.imageUrl) {
    return `<span class="preview-icon-chip"><img src="${escapeHtml(item.imageUrl)}" alt=""></span>`;
  }

  const iconId = ICON_USE_MAP[item.icon] || "link";
  return `<span class="preview-icon-chip" style="background:${hexToRgba(accentColor, 0.24)}"><svg viewBox="0 0 24 24"><use href="#icon-${iconId}"></use></svg></span>`;
}

function handleButtonListInput(event) {
  const card = event.target.closest("[data-button-index]");
  if (!card) return;

  const index = Number(card.dataset.buttonIndex);
  const field = event.target.dataset.buttonField;
  if (!field) return;

  state.settings.buttons[index][field] =
    field === "enabled" ? event.target.checked : event.target.value;

  // مهم: لا تعيد رسم القائمة أثناء الكتابة لأن الجوال يفقد الـ focus والكيبورد يختفي
  // نعيد الرسم فقط عند تغيير mediaType لأن الواجهة تتغير (صورة/أيقونة)
  if (field === "mediaType") {
    renderButtonRows();
  }

  syncPreview();
}

function handleSocialListInput(event) {
  const card = event.target.closest("[data-social-index]");
  if (!card) return;
  const index = Number(card.dataset.socialIndex);
  const field = event.target.dataset.socialField;
  if (!field) return;
  state.settings.socialLinks[index][field] = field === "enabled" ? event.target.checked : event.target.value;
  syncPreview();
}

function handleSocialListClick(event) {
  const removeButton = event.target.closest("[data-remove-social]");
  if (!removeButton) return;
  const index = Number(removeButton.dataset.removeSocial);
  state.settings.socialLinks.splice(index, 1);
  renderSocialRows();
  syncPreview();
}

function handleButtonListInput(event) {
  const card = event.target.closest("[data-button-index]");
  if (!card) return;
  const index = Number(card.dataset.buttonIndex);
  const field = event.target.dataset.buttonField;
  if (!field) return;
  state.settings.buttons[index][field] = field === "enabled" ? event.target.checked : event.target.value;
  renderButtonRows();
  syncPreview();
}

function handleButtonListClick(event) {
  const removeButton = event.target.closest("[data-remove-button]");
  if (removeButton) {
    const index = Number(removeButton.dataset.removeButton);
    state.settings.buttons.splice(index, 1);
    renderButtonRows();
    syncPreview();
    return;
  }

  const iconButton = event.target.closest("[data-button-icon-index]");
  if (!iconButton) return;
  const index = Number(iconButton.dataset.buttonIconIndex);
  state.settings.buttons[index].icon = iconButton.dataset.buttonIcon;
  state.settings.buttons[index].mediaType = "icon";
  renderButtonRows();
  syncPreview();
}

function handleButtonFileChange(event) {
  const index = event.target.dataset.buttonFile;
  if (index === undefined) return;
  const [file] = event.target.files || [];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    state.settings.buttons[Number(index)].imageUrl = typeof reader.result === "string" ? reader.result : "";
    state.settings.buttons[Number(index)].mediaType = "image";
    renderButtonRows();
    syncPreview();
  };
  reader.readAsDataURL(file);
}

function addSocialRow() {
  state.settings.socialLinks.push({ id: "instagram", label: "حساب جديد", url: "", enabled: true });
  renderSocialRows();
  syncPreview();
}

function addButtonRow() {
  state.settings.buttons.push({
    id: `button-${Date.now()}`,
    label: "زر جديد",
    url: "#",
    mediaType: "icon",
    icon: "link",
    imageUrl: "",
    enabled: true
  });
  renderButtonRows();
  syncPreview();
}

async function saveSettings(event) {
  event.preventDefault();
  statusText.textContent = "جارٍ الحفظ...";

  try {
    const payload = collectSettings();
    const response = await fetch("/api/site-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-slug": window.ADMIN_SLUG
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Save failed");
    state.settings = normalizeSettings(await response.json());
    populateBaseFields();
    renderThemeGrid();
    renderSocialRows();
    renderButtonRows();
    syncPreview();
    statusText.textContent = "تم الحفظ";
  } catch (error) {
    statusText.textContent = "فشل حفظ التغييرات";
  }
}

function handleImageFileChange(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imageUrlInput.value = typeof reader.result === "string" ? reader.result : "";
    syncPreview();
  };
  reader.readAsDataURL(file);
}

function parseSurfaceColor(value) {
  const normalized = String(value || "").trim();
  const rgbaMatch = normalized.match(/rgba?\(([^)]+)\)/i);
  if (rgbaMatch) {
    const parts = rgbaMatch[1].split(",").map((part) => part.trim());
    const red = clampColor(parts[0]);
    const green = clampColor(parts[1]);
    const blue = clampColor(parts[2]);
    const alpha = parts[3] === undefined ? 1 : clampAlpha(parts[3]);
    return {
      hex: rgbToHex(red, green, blue),
      opacity: Math.round(alpha * 100)
    };
  }

  if (/^#([0-9a-f]{6})$/i.test(normalized)) {
    return { hex: normalized, opacity: 100 };
  }

  return { hex: "#0e111a", opacity: 58 };
}

function buildSurfaceRgba(hex, opacityPercent) {
  const rgb = hexToRgb(hex);
  const alpha = Math.max(0, Math.min(100, Number(opacityPercent) || 0)) / 100;
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${alpha.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    red: Number.parseInt(value.slice(0, 2), 16),
    green: Number.parseInt(value.slice(2, 4), 16),
    blue: Number.parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex(red, green, blue) {
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function toHex(value) {
  return Math.max(0, Math.min(255, Number(value) || 0)).toString(16).padStart(2, "0");
}

function clampColor(value) {
  return Math.max(0, Math.min(255, Number.parseInt(value, 10) || 0));
}

function clampAlpha(value) {
  return Math.max(0, Math.min(1, Number.parseFloat(value) || 0));
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return `rgba(98, 208, 255, ${alpha})`;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

themeGrid.addEventListener("click", handleThemeClick);
socialList.addEventListener("input", handleSocialListInput);
socialList.addEventListener("click", handleSocialListClick);
buttonList.addEventListener("input", handleButtonListInput);
buttonList.addEventListener("click", handleButtonListClick);
buttonList.addEventListener("change", handleButtonFileChange);
addSocialButton.addEventListener("click", addSocialRow);
addButtonButton.addEventListener("click", addButtonRow);
imageFileInput.addEventListener("change", handleImageFileChange);
fields.surfaceOpacity.addEventListener("input", () => {
  surfaceOpacityValue.textContent = `${fields.surfaceOpacity.value}%`;
});
form.addEventListener("input", syncPreview);
form.addEventListener("submit", saveSettings);

loadAdminSettings();
