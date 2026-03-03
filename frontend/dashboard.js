const sitesList = document.getElementById("sites-list");
const createForm = document.getElementById("create-site-form");
const createStatus = document.getElementById("create-status");
const ownerBadge = document.getElementById("owner-badge");
const logoutButton = document.getElementById("logout-button");
const customDomainInput = document.getElementById("custom-domain-input");

async function loadDashboard() {
  const response = await fetch("/api/owner/sites", { cache: "no-store" });
  if (response.status === 401) {
    window.location.href = "/dashboard/login";
    return;
  }

  const payload = await response.json();
  ownerBadge.textContent = payload.owner.requiresPasswordChange
    ? `Signed in as ${payload.owner.email}. Change the default owner password before selling.`
    : `Signed in as ${payload.owner.email}`;
  renderSites(payload.sites || []);
}

function renderSites(sites) {
  if (!sites.length) {
    sitesList.innerHTML = '<p class="panel-note">No customer sites yet.</p>';
    return;
  }

  sitesList.innerHTML = sites.map((site) => `
    <article class="site-row">
        <div class="site-row-top">
          <div>
            <div class="site-name">${escapeHtml(site.name)}</div>
            <div class="site-meta">Customer: ${escapeHtml(site.customerName || "Unassigned")} | Email: ${escapeHtml(site.customerEmail || "No email")}</div>
            <div class="site-meta">Custom domain: ${escapeHtml(site.customDomain || "Not assigned")}</div>
          </div>
          <div class="site-row-actions">
            <div class="site-meta">${escapeHtml(site.status)}</div>
            <button class="link-action danger-action" type="button" data-delete-site="${escapeAttribute(site.id)}" data-site-name="${escapeAttribute(site.name)}">Delete</button>
        </div>
      </div>
      <div class="site-links">
        <div class="site-link-chip">
          <div class="chip-label">Public site</div>
          <code>${escapeHtml(site.publicUrl)}</code>
          <div class="link-actions">
            <button class="link-action" type="button" data-copy="${escapeAttribute(site.publicUrl)}">Copy</button>
            <button class="link-action" type="button" data-open="${escapeAttribute(site.publicUrl)}">Open</button>
          </div>
        </div>
        <div class="site-link-chip">
          <div class="chip-label">Client admin</div>
          <code>${escapeHtml(site.adminUrl)}</code>
          <div class="link-actions">
            <button class="link-action" type="button" data-copy="${escapeAttribute(site.adminUrl)}">Copy</button>
            <button class="link-action" type="button" data-open="${escapeAttribute(site.adminUrl)}">Open</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  createStatus.textContent = "Creating customer site...";

  const payload = {
    name: document.getElementById("site-name-input").value.trim(),
    customerName: document.getElementById("customer-name-input").value.trim(),
    customerEmail: document.getElementById("customer-email-input").value.trim(),
    customDomain: customDomainInput.value.trim()
  };

  if (payload.customDomain && !isValidCustomDomainInput(payload.customDomain)) {
    createStatus.textContent = "Enter a real domain like client.example.com, not an email address.";
    return;
  }

  try {
    const response = await fetch("/api/owner/sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

      if (response.status === 400) {
        createStatus.textContent = "Invalid custom domain. Use a hostname like client.example.com.";
        return;
      }

      if (response.status === 409) {
        createStatus.textContent = "That custom domain is already assigned to another client.";
        return;
      }

      if (!response.ok) {
        createStatus.textContent = "Failed to create site.";
        return;
      }

    createForm.reset();
    createStatus.textContent = "Customer site created.";
    await loadDashboard();
  } catch (error) {
    createStatus.textContent = "Network error while creating site.";
  }
});

sitesList.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
      copyButton.textContent = "Copied";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1200);
    } catch (error) {
      copyButton.textContent = "Copy failed";
    }
    return;
  }

  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    window.open(openButton.dataset.open, "_blank", "noopener");
    return;
  }

  const deleteButton = event.target.closest("[data-delete-site]");
  if (deleteButton) {
    const siteName = deleteButton.dataset.siteName || "this site";
    const confirmed = window.confirm(`Delete "${siteName}" permanently?`);
    if (!confirmed) return;

    const originalLabel = deleteButton.textContent;
    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    try {
      const response = await fetch("/api/owner/sites/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          siteId: deleteButton.dataset.deleteSite
        })
      });

      if (response.status === 409) {
        createStatus.textContent = "You cannot delete the last remaining site.";
      } else if (!response.ok) {
        createStatus.textContent = "Failed to delete site.";
      } else {
        createStatus.textContent = "Customer site deleted.";
        await loadDashboard();
      }
    } catch (error) {
      createStatus.textContent = "Network error while deleting site.";
    } finally {
      deleteButton.disabled = false;
      deleteButton.textContent = originalLabel;
    }
  }
});

logoutButton.addEventListener("click", async () => {
  await fetch("/api/owner/logout", { method: "POST" });
  window.location.href = "/dashboard/login";
});

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

function isValidCustomDomainInput(value) {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");

  if (!normalized || normalized.includes("@") || !normalized.includes(".")) {
    return false;
  }

  return normalized.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
}

loadDashboard();
