const SOCIAL_ICON_MAP = {
  instagram: "instagram",
  facebook: "facebook",
  snapchat: "snapchat",
  youtube: "youtube",
  telegram: "telegram",
  whatsapp: "whatsapp",
  tiktok: "tiktok",
  x: "x",
  link: "link",
  website: "globe"
};

const BUTTON_ICON_MAP = {
  store: "store",
  bag: "bag",
  cart: "cart",
  globe: "globe",
  website: "globe",
  link: "link",
  phone: "phone",
  mail: "mail",
  location: "location",
  youtube: "youtube",
  linkedin: "linkedin",
  instagram: "instagram",
  facebook: "facebook",
  snapchat: "snapchat",
  telegram: "telegram",
  whatsapp: "whatsapp",
  tiktok: "tiktok",
  x: "x",
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

async function loadSiteSettings() {
  try {
    const siteSlug = getSiteSlugFromPath();
    const endpoint = siteSlug ? `/api/site-settings?siteSlug=${encodeURIComponent(siteSlug)}` : "/api/site-settings";
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) return;
    const settings = await response.json();
    applySiteSettings(settings);
  } catch (error) {
    console.error("Failed to load site settings.", error);
  }
}

function getSiteSlugFromPath() {
  const match = window.location.pathname.match(/^\/s\/([a-z0-9-]+)$/i);
  return match ? match[1] : "";
}

function applySiteSettings(settings) {
  const root = document.documentElement;
  const title = document.getElementById("profile-title");
  const description = document.getElementById("profile-description");
  const profileImage = document.getElementById("profile-image");
  const avatarFallback = document.getElementById("avatar-fallback");

  title.textContent = settings.profileTitle || "KSA";
  description.textContent = settings.profileDescription || "";
  root.style.setProperty("--bg-base", settings.colors.backgroundStart);
  root.style.setProperty("--bg-deep", settings.colors.backgroundEnd);
  root.style.setProperty("--accent", settings.colors.accent);
  root.style.setProperty("--accent-warm", settings.colors.accentWarm);
  root.style.setProperty("--text-strong", settings.colors.textStrong);
  root.style.setProperty("--text-soft", settings.colors.textSoft);
  root.style.setProperty("--surface", settings.colors.surface);
  document.body.dataset.buttonLayout = settings.buttonLayout || "icon-right";
  document.body.dataset.theme = settings.activeThemeId || "aurora";

  if (settings.profileImage) {
    profileImage.src = settings.profileImage;
    profileImage.classList.remove("is-hidden");
    avatarFallback.classList.add("is-hidden");
  } else {
    profileImage.removeAttribute("src");
    profileImage.classList.add("is-hidden");
    avatarFallback.classList.remove("is-hidden");
  }

  renderSocialLinks(settings.socialLinks || []);
  renderButtons(settings.buttons || []);
}

function renderSocialLinks(links) {
  const container = document.getElementById("social-links");
  const activeLinks = links.filter((item) => item.enabled);

  container.innerHTML = activeLinks
    .map((item) => {
      const iconId = SOCIAL_ICON_MAP[item.id] || "link";
      const href = item.url || "#";
      return `<a href="${escapeHtml(href)}" aria-label="${escapeHtml(item.label)}" ${href === "#" ? "" : 'target="_blank" rel="noreferrer"'}><svg viewBox="0 0 24 24"><use href="#icon-${iconId}"></use></svg></a>`;
    })
    .join("");
}

function renderButtons(buttons) {
  const container = document.getElementById("links-list");
  const activeButtons = buttons.filter((item) => item.enabled);

  container.innerHTML = activeButtons
    .map((item) => {
      const href = item.url || "#";
      return `<a class="link-pill" href="${escapeHtml(href)}" ${href === "#" ? "" : 'target="_blank" rel="noreferrer"'}><span class="pill-main">${renderButtonMedia(item)}<span class="link-label">${escapeHtml(item.label)}</span></span><span class="link-trail"><svg viewBox="0 0 24 24"><use href="#icon-arrow"></use></svg></span></a>`;
    })
    .join("");
}

function renderButtonMedia(item) {
  if (item.mediaType === "image" && item.imageUrl) {
    return `<span class="link-icon link-image-wrap"><img class="link-image" src="${escapeHtml(item.imageUrl)}" alt=""></span>`;
  }

  const iconId = BUTTON_ICON_MAP[item.icon] || "link";
  return `<span class="link-icon"><svg viewBox="0 0 24 24"><use href="#icon-${iconId}"></use></svg></span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

loadSiteSettings();
