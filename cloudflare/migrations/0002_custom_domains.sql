ALTER TABLE sites ADD COLUMN custom_domain TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_custom_domain
ON sites(custom_domain)
WHERE custom_domain IS NOT NULL AND custom_domain != '';
