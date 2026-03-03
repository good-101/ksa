const crypto = require("crypto");
const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  ensureDatabase,
  findSiteByAdminSlug,
  findSiteByCustomDomain,
  findSiteBySiteSlug,
  getDefaultSite,
  listSites,
  updateSiteSettings,
  createSite,
  deleteSite,
  verifyOwner,
  getOwnerPublicProfile,
  updateOwner
} = require("./database");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const OWNER_SESSION_COOKIE = "saas_owner_session";

const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
const sessions = new Map();

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 2 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });

    req.on("end", () => resolve(rawBody));
    req.on("error", reject);
  });
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendNotFound(res);
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(html);
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function sendRedirect(res, location) {
  res.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store"
  });
  res.end();
}

function sendNotFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

function parseCookies(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((accumulator, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) return accumulator;
      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {});
}

function resolveHost(req) {
  // if behind proxy, host header is typically correct; keep simple
  return req.headers.host || `${HOST}:${PORT}`;
}

function normalizeHost(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/:\d+$/, "");
}

function isLocalHost(value) {
  const normalized = normalizeHost(value);
  return normalized === "127.0.0.1" || normalized === "localhost";
}

function getRequestProtocol(req) {
  const host = resolveHost(req);
  if (isLocalHost(host)) return "http";

  // Most reverse proxies set this.
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").toLowerCase();
  if (forwardedProto === "https") return "https";

  // Default for production behind proxy
  return "https";
}

function getOwnerSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[OWNER_SESSION_COOKIE];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  return { token, ...session };
}

function requireOwnerSession(req, res) {
  const session = getOwnerSession(req);
  if (!session) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
  return session;
}

function createOwnerSession(req, res, email) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, {
    email,
    createdAt: new Date().toISOString()
  });

  const protocol = getRequestProtocol(req);
  const secureFlag = protocol === "https" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${OWNER_SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax${secureFlag}`
  );
}

function clearOwnerSession(req, res) {
  const session = getOwnerSession(req);
  if (session) {
    sessions.delete(session.token);
  }

  const protocol = getRequestProtocol(req);
  const secureFlag = protocol === "https" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${OWNER_SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`
  );
}

function isValidAdminRequest(req) {
  return (
    typeof req.headers["x-admin-slug"] === "string" &&
    Boolean(findSiteByAdminSlug(req.headers["x-admin-slug"]))
  );
}

function toSiteSummary(site, req) {
  const host = resolveHost(req);
  const protocol = getRequestProtocol(req);

  const adminPath = `/admin?adminSlug=${encodeURIComponent(site.adminSlug)}`;

  const publicUrl = site.customDomain
    ? `${protocol}://${site.customDomain}`
    : `${protocol}://${host}/s/${site.siteSlug}`;

  return {
    id: site.id,
    name: site.name,
    siteSlug: site.siteSlug,
    adminSlug: site.adminSlug,

    customDomain: site.customDomain,
    customDomainStatus: site.customDomainStatus,

    customerName: site.customerName,
    status: site.status,
    createdAt: site.createdAt,

    publicPath: `/s/${site.siteSlug}`,
    publicUrl,

    adminPath,
    adminUrl: `${protocol}://${host}${adminPath}`
  };
}

function routePublicPage(req, res, pathname) {
  const hostSite = findSiteByCustomDomain(normalizeHost(resolveHost(req)));
  if (pathname === "/" && hostSite) {
    return sendFile(res, path.join(FRONTEND_DIR, "index.html"));
  }

  if (pathname === "/") {
    return sendFile(res, path.join(FRONTEND_DIR, "index.html"));
  }

  const siteMatch = pathname.match(/^\/s\/([a-z0-9-]+)\/?$/i);
  if (siteMatch) {
    const site = findSiteBySiteSlug(siteMatch[1]);
    if (!site) return sendNotFound(res);
    return sendFile(res, path.join(FRONTEND_DIR, "index.html"));
  }

  return null;
}

function routeDashboardPage(req, res, pathname) {
  if (pathname === "/dashboard/login") {
    return sendFile(res, path.join(FRONTEND_DIR, "owner-login.html"));
  }

  if (pathname === "/dashboard") {
    if (!getOwnerSession(req)) {
      return sendRedirect(res, "/dashboard/login");
    }
    return sendFile(res, path.join(FRONTEND_DIR, "dashboard.html"));
  }

  return null;
}

async function routeRequest(req, res) {
  const host = resolveHost(req);
  const protocol = getRequestProtocol(req);

  // IMPORTANT: use protocol-aware base URL for parsing
  const requestUrl = new URL(req.url, `${protocol}://${host}`);
  const pathname = requestUrl.pathname;

  if (req.method === "GET") {
    const ownerPage = routeDashboardPage(req, res, pathname);
    if (ownerPage !== null) return ownerPage;

    const publicPage = routePublicPage(req, res, pathname);
    if (publicPage !== null) return publicPage;

    if (pathname === "/styles.css") return sendFile(res, path.join(FRONTEND_DIR, "styles.css"));
    if (pathname === "/site.js") return sendFile(res, path.join(FRONTEND_DIR, "site.js"));
    if (pathname === "/admin.css") return sendFile(res, path.join(FRONTEND_DIR, "admin.css"));
    if (pathname === "/admin.js") return sendFile(res, path.join(FRONTEND_DIR, "admin.js"));
    if (pathname === "/dashboard.css") return sendFile(res, path.join(FRONTEND_DIR, "dashboard.css"));
    if (pathname === "/dashboard.js") return sendFile(res, path.join(FRONTEND_DIR, "dashboard.js"));
    if (pathname === "/owner-login.css") return sendFile(res, path.join(FRONTEND_DIR, "owner-login.css"));
    if (pathname === "/owner-login.js") return sendFile(res, path.join(FRONTEND_DIR, "owner-login.js"));

    if (pathname === "/admin") {
      const adminSlug = requestUrl.searchParams.get("adminSlug");
      if (adminSlug && findSiteByAdminSlug(adminSlug)) {
        return sendFile(res, path.join(FRONTEND_DIR, "admin.html"));
      }
      return sendHtml(
        res,
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Private Admin Link Required</title>
        </head>
        <body>
          <h1>Use the private admin link</h1>
          <p>Open the client-specific admin URL from the dashboard.</p>
          <code>/admin?adminSlug=client-admin-slug</code>
        </body>
        </html>
      `
      );
    }

    const adminMatch = pathname.match(/^\/admin\/([a-z0-9-]+)$/i);
    if (adminMatch) {
      const site = findSiteByAdminSlug(adminMatch[1]);
      if (!site) return sendNotFound(res);
      return sendFile(res, path.join(FRONTEND_DIR, "admin.html"));
    }

    if (pathname === "/api/admin-link") {
      const defaultSite = getDefaultSite();
      return sendJson(res, 200, { adminPath: `/admin?adminSlug=${encodeURIComponent(defaultSite.adminSlug)}` });
    }

    if (pathname === "/api/site-settings") {
      const adminSlug = requestUrl.searchParams.get("adminSlug");
      const siteSlug = requestUrl.searchParams.get("siteSlug");
      const site = adminSlug
        ? findSiteByAdminSlug(adminSlug)
        : siteSlug
          ? findSiteBySiteSlug(siteSlug)
          : findSiteByCustomDomain(normalizeHost(resolveHost(req))) || getDefaultSite();
      if (!site) return sendNotFound(res);
      return sendJson(res, 200, site.settings);
    }

    if (pathname === "/api/owner/me") {
      const session = requireOwnerSession(req, res);
      if (!session) return;
      return sendJson(res, 200, getOwnerPublicProfile());
    }

    if (pathname === "/api/owner/sites") {
      const session = requireOwnerSession(req, res);
      if (!session) return;
      return sendJson(res, 200, {
        sites: listSites().map((site) => toSiteSummary(site, req)),
        owner: getOwnerPublicProfile()
      });
    }

    return sendNotFound(res);
  }

  if (req.method === "POST" && pathname === "/api/site-settings") {
    if (!isValidAdminRequest(req)) {
      return sendJson(res, 403, { error: "Forbidden" });
    }

    try {
      const rawBody = await readRequestBody(req);
      const parsedBody = JSON.parse(rawBody || "{}");
      const site = updateSiteSettings(req.headers["x-admin-slug"], parsedBody);
      if (!site) return sendNotFound(res);
      return sendJson(res, 200, site.settings);
    } catch (error) {
      return sendJson(res, 400, { error: "Invalid request body" });
    }
  }

  if (req.method === "POST" && pathname === "/api/owner/login") {
    try {
      const rawBody = await readRequestBody(req);
      const parsedBody = JSON.parse(rawBody || "{}");
      const email = typeof parsedBody.email === "string" ? parsedBody.email.trim() : "";
      const password = typeof parsedBody.password === "string" ? parsedBody.password : "";

      if (!verifyOwner(email, password)) {
        return sendJson(res, 401, { error: "Invalid credentials" });
      }

      createOwnerSession(req, res, email);
      return sendJson(res, 200, { ok: true, owner: getOwnerPublicProfile() });
    } catch (error) {
      return sendJson(res, 400, { error: "Invalid request body" });
    }
  }

  if (req.method === "POST" && pathname === "/api/owner/logout") {
    clearOwnerSession(req, res);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/owner/sites") {
    const session = requireOwnerSession(req, res);
    if (!session) return;

    try {
      const rawBody = await readRequestBody(req);
      const parsedBody = JSON.parse(rawBody || "{}");
      const site = createSite(parsedBody || {});
      return sendJson(res, 201, {
        site: toSiteSummary(site, req)
      });
    } catch (error) {
      if (String(error?.message || error) === "INVALID_CUSTOM_DOMAIN") {
        return sendJson(res, 400, { error: "Invalid custom domain" });
      }
      if (String(error?.message || error) === "CUSTOM_DOMAIN_IN_USE") {
        return sendJson(res, 409, { error: "Custom domain already in use" });
      }
      return sendJson(res, 400, { error: "Invalid request body" });
    }
  }

  if (req.method === "POST" && pathname === "/api/owner/sites/delete") {
    const session = requireOwnerSession(req, res);
    if (!session) return;

    try {
      const rawBody = await readRequestBody(req);
      const parsedBody = JSON.parse(rawBody || "{}");
      const siteId = typeof parsedBody.siteId === "string" ? parsedBody.siteId.trim() : "";
      if (!siteId) {
        return sendJson(res, 400, { error: "Missing siteId" });
      }

      const deleted = deleteSite(siteId);
      if (deleted && deleted.error === "last-site") {
        return sendJson(res, 409, { error: "Cannot delete the last remaining site" });
      }
      if (!deleted) {
        return sendNotFound(res);
      }

      return sendJson(res, 200, { ok: true, siteId });
    } catch (error) {
      return sendJson(res, 400, { error: "Invalid request body" });
    }
  }

  if (req.method === "POST" && pathname === "/api/owner/profile") {
    const session = requireOwnerSession(req, res);
    if (!session) return;

    try {
      const rawBody = await readRequestBody(req);
      const parsedBody = JSON.parse(rawBody || "{}");
      const owner = updateOwner(parsedBody);
      return sendJson(res, 200, owner);
    } catch (error) {
      return sendJson(res, 400, { error: "Invalid request body" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
}

ensureDatabase();

const server = http.createServer((req, res) => {
  routeRequest(req, res).catch(() => {
    sendJson(res, 500, { error: "Internal server error" });
  });
});

server.listen(PORT, HOST, () => {
  const defaultSite = getDefaultSite();
  console.log(`Server listening at http://${HOST}:${PORT}`);
  console.log(`Default public site: http://${HOST}:${PORT}/`);
  console.log(`Primary admin: http://${HOST}:${PORT}/admin?adminSlug=${defaultSite.adminSlug}`);
  console.log(`Owner dashboard: http://${HOST}:${PORT}/dashboard/login`);
});