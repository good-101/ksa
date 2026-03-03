const OWNER_SESSION_COOKIE = "saas_owner_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

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

let bootstrapPromise = null;

export default {
  async fetch(request, env) {
    await ensureBootstrap(env);

    const url = new URL(request.url);

    if (request.method === "GET") {
      const dashboardResponse = await routeDashboardPage(request, env, url.pathname);
      if (dashboardResponse) return dashboardResponse;

      const publicResponse = await routePublicPage(request, env, url);
      if (publicResponse) return publicResponse;

      const apiResponse = await routeGetApi(request, env, url);
      if (apiResponse) return apiResponse;

      const assetResponse = await maybeServeAsset(request, env, url.pathname);
      if (assetResponse) return assetResponse;
    }

    if (request.method === "POST") {
      const apiResponse = await routePostApi(request, env, url);
      if (apiResponse) return apiResponse;
    }

    return jsonResponse({ error: "Not found" }, 404);
  }
};

async function routeDashboardPage(request, env, pathname) {
  if (pathname === "/dashboard/login") {
    return fetchAsset(request, env, "/owner-login.html");
  }

  if (pathname === "/dashboard") {
    const session = await requireOwnerSession(request, env);
    if (!session) {
      return redirectResponse("/dashboard/login");
    }
    return fetchAsset(request, env, "/dashboard.html");
  }

  return null;
}

async function routePublicPage(request, env, url) {
  const pathname = url.pathname;
  const host = normalizeRequestHost(url);
  const hostSite = await findSiteByCustomDomain(env, host);

  if (pathname === "/" && hostSite) {
    return fetchAsset(request, env, "/index.html");
  }

  if (pathname === "/") {
    return fetchAsset(request, env, "/index.html");
  }

  if (pathname === "/admin") {
    const adminSlug = url.searchParams.get("adminSlug");
    if (adminSlug) {
      const site = await findSiteByAdminSlug(env, adminSlug);
      if (!site) return jsonResponse({ error: "Not found" }, 404);
      return fetchAsset(request, env, "/admin.html");
    }

    return htmlResponse(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Private Admin Link Required</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: linear-gradient(135deg, #07101d, #111d33);
            color: #f5f7fb;
            font-family: system-ui, sans-serif;
          }
          .card {
            max-width: 560px;
            padding: 28px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          h1 { margin: 0 0 12px; }
          p { margin: 0; line-height: 1.7; color: #c7d3ea; }
          code {
            display: inline-block;
            margin-top: 12px;
            padding: 6px 10px;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.25);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Use the private admin link</h1>
          <p>This page is not a shared admin panel. Open the client-specific admin URL from the dashboard instead.</p>
          <code>/admin?adminSlug=client-admin-slug</code>
        </div>
      </body>
      </html>
    `);
  }

  const siteMatch = pathname.match(/^\/s\/([a-z0-9-]+)$/i);
  if (siteMatch) {
    const site = await findSiteBySiteSlug(env, siteMatch[1]);
    if (!site) return jsonResponse({ error: "Not found" }, 404);
    return fetchAsset(request, env, "/index.html");
  }

  const adminMatch = pathname.match(/^\/admin\/([a-z0-9-]+)$/i);
  if (adminMatch) {
    const site = await findSiteByAdminSlug(env, adminMatch[1]);
    if (!site) return jsonResponse({ error: "Not found" }, 404);
    return fetchAsset(request, env, "/admin.html");
  }

  return null;
}

async function routeGetApi(request, env, url) {
  const pathname = url.pathname;

  if (pathname === "/api/admin-link") {
    const defaultSite = await getDefaultSite(env);
    return jsonResponse({ adminPath: `/admin?adminSlug=${encodeURIComponent(defaultSite.adminSlug)}` });
  }

  if (pathname === "/api/site-settings") {
    const adminSlug = url.searchParams.get("adminSlug");
    const siteSlug = url.searchParams.get("siteSlug");
    const site = adminSlug
      ? await findSiteByAdminSlug(env, adminSlug)
      : siteSlug
        ? await findSiteBySiteSlug(env, siteSlug)
        : await findSiteByCustomDomain(env, normalizeRequestHost(url))
          || await getDefaultSite(env);
    if (!site) return jsonResponse({ error: "Not found" }, 404);
    return jsonResponse(site.settings);
  }

  if (pathname === "/api/owner/me") {
    const session = await requireOwnerSession(request, env);
    if (!session) return jsonResponse({ error: "Unauthorized" }, 401);
    return jsonResponse(await getOwnerPublicProfile(env));
  }

  if (pathname === "/api/owner/sites") {
    const session = await requireOwnerSession(request, env);
    if (!session) return jsonResponse({ error: "Unauthorized" }, 401);
    const sites = await listSites(env);
    return jsonResponse({
      sites: sites.map((site) => toSiteSummary(site, url.origin)),
      owner: await getOwnerPublicProfile(env)
    });
  }

  return null;
}

async function routePostApi(request, env, url) {
  const pathname = url.pathname;

  if (pathname === "/api/site-settings") {
    const adminSlug = request.headers.get("x-admin-slug");
    if (!adminSlug) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    const site = await findSiteByAdminSlug(env, adminSlug);
    if (!site) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    const body = await safeJson(request);
    if (body === null) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const updated = await updateSiteSettings(env, adminSlug, body);
    if (!updated) return jsonResponse({ error: "Not found" }, 404);
    return jsonResponse(updated.settings);
  }

  if (pathname === "/api/owner/login") {
    const body = await safeJson(request);
    if (body === null) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const owner = await verifyOwner(env, email, password);
    if (!owner) {
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }

    const token = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

    await env.DB.prepare(
      "INSERT INTO owner_sessions (token, owner_id, created_at, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(token, owner.id, now.toISOString(), expiresAt.toISOString()).run();

    return jsonResponse(
      { ok: true, owner: await getOwnerPublicProfile(env) },
      200,
      {
        "Set-Cookie": buildSessionCookie(request, token, expiresAt)
      }
    );
  }

  if (pathname === "/api/owner/logout") {
    const token = getCookie(request, OWNER_SESSION_COOKIE);
    if (token) {
      await env.DB.prepare("DELETE FROM owner_sessions WHERE token = ?").bind(token).run();
    }
    return jsonResponse({ ok: true }, 200, { "Set-Cookie": clearSessionCookie(request) });
  }

  if (pathname === "/api/owner/sites") {
    const session = await requireOwnerSession(request, env);
    if (!session) return jsonResponse({ error: "Unauthorized" }, 401);

    const body = await safeJson(request);
    if (body === null) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    try {
      const site = await createSite(env, body || {});
      return jsonResponse({ site: toSiteSummary(site, url.origin) }, 201);
    } catch (error) {
      if (String(error?.message || error) === "CUSTOM_DOMAIN_IN_USE") {
        return jsonResponse({ error: "Custom domain already in use" }, 409);
      }
      if (String(error?.message || error) === "INVALID_CUSTOM_DOMAIN") {
        return jsonResponse({ error: "Invalid custom domain" }, 400);
      }
      throw error;
    }
  }

  if (pathname === "/api/owner/sites/delete") {
    const session = await requireOwnerSession(request, env);
    if (!session) return jsonResponse({ error: "Unauthorized" }, 401);

    const body = await safeJson(request);
    if (body === null) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";
    if (!siteId) {
      return jsonResponse({ error: "Missing siteId" }, 400);
    }

    const deleted = await deleteSite(env, siteId);
    if (deleted === "last-site") {
      return jsonResponse({ error: "Cannot delete the last remaining site" }, 409);
    }
    if (!deleted) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    return jsonResponse({ ok: true, siteId });
  }

  if (pathname === "/api/owner/profile") {
    const session = await requireOwnerSession(request, env);
    if (!session) return jsonResponse({ error: "Unauthorized" }, 401);

    const body = await safeJson(request);
    if (body === null) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const owner = await updateOwner(env, body);
    return jsonResponse(owner);
  }

  return null;
}

async function maybeServeAsset(request, env, pathname) {
  if (pathname === "/favicon.ico") {
    return new Response(null, { status: 204 });
  }

  if (pathname.includes(".") || pathname === "/styles.css" || pathname.endsWith(".js")) {
    return fetchAsset(request, env, pathname);
  }

  return null;
}

function fetchAsset(request, env, assetPath) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
}

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}

function redirectResponse(location) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "no-store"
    }
  });
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";
  for (const entry of cookieHeader.split(";")) {
    const [key, ...rest] = entry.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return "";
}

function buildSessionCookie(request, token, expiresAt) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${OWNER_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly${secure}; SameSite=Lax; Expires=${expiresAt.toUTCString()}`;
}

function clearSessionCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${OWNER_SESSION_COOKIE}=; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=0`;
}

async function requireOwnerSession(request, env) {
  const token = getCookie(request, OWNER_SESSION_COOKIE);
  if (!token) return null;

  const now = new Date().toISOString();
  const row = await env.DB.prepare(`
    SELECT owner_sessions.token, owners.id AS owner_id, owners.email
    FROM owner_sessions
    JOIN owners ON owners.id = owner_sessions.owner_id
    WHERE owner_sessions.token = ? AND owner_sessions.expires_at > ?
    LIMIT 1
  `).bind(token, now).first();

  if (!row) return null;
  return {
    token: row.token,
    ownerId: row.owner_id,
    email: row.email
  };
}

async function hashPassword(value) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const bytes = Array.from(new Uint8Array(buffer));
  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureBootstrap(env) {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrapDatabase(env).catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }
  await bootstrapPromise;
}

async function bootstrapDatabase(env) {
  await ensureSitesCustomDomainColumn(env);

  const ownerCountRow = await env.DB.prepare("SELECT COUNT(*) AS count FROM owners").first();
  if (Number(ownerCountRow?.count || 0) === 0) {
    const now = new Date().toISOString();
    const passwordHash = await hashPassword("change-me-now");
    await env.DB.prepare(
      "INSERT INTO owners (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)"
    ).bind("Owner", "owner@example.com", passwordHash, now).run();
  }

  const siteCountRow = await env.DB.prepare("SELECT COUNT(*) AS count FROM sites").first();
  if (Number(siteCountRow?.count || 0) === 0) {
    const now = new Date().toISOString();
    await env.DB.prepare(`
      INSERT INTO sites (id, name, site_slug, admin_slug, custom_domain, customer_name, customer_email, status, created_at, settings_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      "site-primary",
      "Primary Demo",
      "primary-demo",
      "studio-a9k3m7x2",
      null,
      "Default Customer",
      "",
      "active",
      now,
      JSON.stringify(sanitizeSettings(DEFAULT_SETTINGS))
    ).run();
  }
}

async function ensureSitesCustomDomainColumn(env) {
  try {
    await env.DB.prepare("ALTER TABLE sites ADD COLUMN custom_domain TEXT").run();
  } catch (error) {
    if (!String(error?.message || error).includes("duplicate column name")) {
      throw error;
    }
  }

  await env.DB.prepare(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_custom_domain
    ON sites(custom_domain)
    WHERE custom_domain IS NOT NULL AND custom_domain != ''
  `).run();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

async function buildUniqueSiteSlug(env, base) {
  let candidate = slugify(base, "site");
  while (await findSiteBySiteSlug(env, candidate)) {
    candidate = `${slugify(base, "site")}-${randomChunk()}`;
  }
  return candidate;
}

async function buildUniqueAdminSlug(env) {
  let candidate = `admin-${randomChunk()}${randomChunk().slice(0, 2)}`;
  while (await findSiteByAdminSlug(env, candidate)) {
    candidate = `admin-${randomChunk()}${randomChunk().slice(0, 2)}`;
  }
  return candidate;
}

function normalizeSiteRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    siteSlug: row.site_slug,
    adminSlug: row.admin_slug,
    customDomain: row.custom_domain || "",
    customerName: row.customer_name || "",
    customerEmail: row.customer_email || "",
    status: row.status || "active",
    createdAt: row.created_at,
    settings: sanitizeSettings(JSON.parse(row.settings_json || "{}"))
  };
}

function toSiteSummary(site, origin) {
  const adminPath = `/admin?adminSlug=${encodeURIComponent(site.adminSlug)}`;
  const publicProtocol = site.customDomain ? resolvePublicProtocol(origin) : "";
  const publicUrl = site.customDomain ? `${publicProtocol}://${site.customDomain}` : `${origin}/s/${site.siteSlug}`;
  return {
    id: site.id,
    name: site.name,
    siteSlug: site.siteSlug,
    adminSlug: site.adminSlug,
    customDomain: site.customDomain,
    customerName: site.customerName,
    customerEmail: site.customerEmail,
    status: site.status,
    createdAt: site.createdAt,
    publicPath: `/s/${site.siteSlug}`,
    adminPath,
    publicUrl,
    adminUrl: `${origin}${adminPath}`
  };
}

function resolvePublicProtocol(origin) {
  try {
    const url = new URL(origin);
    return isLocalHostname(url.hostname) ? "http" : "https";
  } catch {
    return "https";
  }
}

async function listSites(env) {
  const result = await env.DB.prepare("SELECT * FROM sites ORDER BY created_at ASC").all();
  return (result.results || []).map(normalizeSiteRow);
}

async function getDefaultSite(env) {
  const row = await env.DB.prepare("SELECT * FROM sites ORDER BY created_at ASC LIMIT 1").first();
  return normalizeSiteRow(row);
}

async function findSiteBySiteSlug(env, siteSlug) {
  if (!siteSlug) return getDefaultSite(env);
  const row = await env.DB.prepare("SELECT * FROM sites WHERE site_slug = ? LIMIT 1").bind(siteSlug).first();
  return normalizeSiteRow(row);
}

async function findSiteByCustomDomain(env, customDomain) {
  const normalizedDomain = normalizeCustomDomain(customDomain);
  if (!normalizedDomain) return null;
  const row = await env.DB.prepare("SELECT * FROM sites WHERE lower(custom_domain) = ? LIMIT 1").bind(normalizedDomain).first();
  return normalizeSiteRow(row);
}

async function findSiteByAdminSlug(env, adminSlug) {
  const row = await env.DB.prepare("SELECT * FROM sites WHERE admin_slug = ? LIMIT 1").bind(adminSlug).first();
  return normalizeSiteRow(row);
}

async function updateSiteSettings(env, adminSlug, settings) {
  const site = await findSiteByAdminSlug(env, adminSlug);
  if (!site) return null;
  const sanitized = sanitizeSettings(settings);
  await env.DB.prepare("UPDATE sites SET settings_json = ? WHERE admin_slug = ?")
    .bind(JSON.stringify(sanitized), adminSlug)
    .run();
  return {
    ...site,
    settings: sanitized
  };
}

async function createSite(env, input) {
  const baseName = typeof input.name === "string" && input.name.trim() ? input.name.trim() : "New Site";
  const rawCustomDomain = typeof input.customDomain === "string" ? input.customDomain.trim() : "";
  const customDomain = normalizeCustomDomain(rawCustomDomain);
  if (rawCustomDomain && !customDomain) {
    throw new Error("INVALID_CUSTOM_DOMAIN");
  }
  if (customDomain && await findSiteByCustomDomain(env, customDomain)) {
    throw new Error("CUSTOM_DOMAIN_IN_USE");
  }
  const site = {
    id: `site-${Date.now()}-${randomChunk()}`,
    name: baseName,
    siteSlug: await buildUniqueSiteSlug(env, input.siteSlug || baseName),
    adminSlug: await buildUniqueAdminSlug(env),
    customDomain,
    customerName: typeof input.customerName === "string" ? input.customerName.trim() : "",
    customerEmail: typeof input.customerEmail === "string" ? input.customerEmail.trim() : "",
    status: input.status === "paused" ? "paused" : "active",
    createdAt: new Date().toISOString(),
    settings: sanitizeSettings(DEFAULT_SETTINGS)
  };

  await env.DB.prepare(`
    INSERT INTO sites (id, name, site_slug, admin_slug, custom_domain, customer_name, customer_email, status, created_at, settings_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    site.id,
    site.name,
    site.siteSlug,
    site.adminSlug,
    site.customDomain || null,
    site.customerName,
    site.customerEmail,
    site.status,
    site.createdAt,
    JSON.stringify(site.settings)
  ).run();

  return site;
}

function normalizeRequestHost(url) {
  return normalizeCustomDomain(url.hostname);
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

function isLocalHostname(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "127.0.0.1" || normalized === "localhost";
}

async function deleteSite(env, siteId) {
  const countRow = await env.DB.prepare("SELECT COUNT(*) AS count FROM sites").first();
  if (Number(countRow?.count || 0) <= 1) {
    return "last-site";
  }

  const site = await env.DB.prepare("SELECT id FROM sites WHERE id = ? LIMIT 1").bind(siteId).first();
  if (!site) return null;

  await env.DB.prepare("DELETE FROM sites WHERE id = ?").bind(siteId).run();
  return true;
}

async function verifyOwner(env, email, password) {
  const row = await env.DB.prepare("SELECT * FROM owners WHERE email = ? LIMIT 1").bind(email).first();
  if (!row) return null;
  const passwordHash = await hashPassword(password);
  if (row.password_hash !== passwordHash) return null;
  return row;
}

async function getOwnerPublicProfile(env) {
  const row = await env.DB.prepare("SELECT name, email, password_hash FROM owners ORDER BY id ASC LIMIT 1").first();
  if (!row) {
    return { name: "Owner", email: "owner@example.com", requiresPasswordChange: true };
  }
  return {
    name: row.name,
    email: row.email,
    requiresPasswordChange: row.password_hash === await hashPassword("change-me-now")
  };
}

async function updateOwner(env, input) {
  const current = await env.DB.prepare("SELECT * FROM owners ORDER BY id ASC LIMIT 1").first();
  if (!current) {
    return getOwnerPublicProfile(env);
  }

  const name = typeof input.name === "string" && input.name.trim() ? input.name.trim() : current.name;
  const email = typeof input.email === "string" && input.email.trim() ? input.email.trim() : current.email;
  const passwordHash = typeof input.password === "string" && input.password.trim()
    ? await hashPassword(input.password)
    : current.password_hash;

  await env.DB.prepare("UPDATE owners SET name = ?, email = ?, password_hash = ? WHERE id = ?")
    .bind(name, email, passwordHash, current.id)
    .run();

  return {
    name,
    email,
    requiresPasswordChange: passwordHash === await hashPassword("change-me-now")
  };
}
