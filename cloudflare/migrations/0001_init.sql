CREATE TABLE IF NOT EXISTS owners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS owner_sessions (
  token TEXT PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  site_slug TEXT NOT NULL UNIQUE,
  admin_slug TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  settings_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sites_site_slug ON sites(site_slug);
CREATE INDEX IF NOT EXISTS idx_sites_admin_slug ON sites(admin_slug);
CREATE INDEX IF NOT EXISTS idx_owner_sessions_expires_at ON owner_sessions(expires_at);
