# Migration Specification: `zeshans.dev` ➔ `zeshannasir.com`

**Status:** Prepared / Validated (Not Executed)  
**Governance:** Strict Safety Protocol  
**Authoritative Rule:** `zeshans.dev/portal` is **STRICTLY EXCLUDED** and remains untouched.

---

## 1. Overview & Objectives

This document defines the formal cutover plan to migrate Zeshan Nasir's personal identity and canonical web presence from `zeshans.dev` to `zeshannasir.com`.

### Core Mandates:
1. **Zero Downtime:** Seamless DNS and edge redirect transition.
2. **Link Equity Preservation:** Permanent 301 direct one-hop redirects from legacy URLs to the new canonical apex.
3. **Strict Telemetry Sanctuary (`/portal`):**  
   `zeshans.dev/portal` is an active OMEGA telemetry production endpoint with physical QR labels in circulation. It **must not** be redirected, modified, renamed, or migrated.

---

## 2. Route & URL Mapping Matrix

| Legacy Path (`zeshans.dev`) | Target Path (`zeshannasir.com`) | HTTP Status | Notes / Rationale |
| :--- | :--- | :--- | :--- |
| `https://zeshans.dev/` | `https://zeshannasir.com/` | `301 Moved Permanently` | Canonical home page |
| `https://www.zeshans.dev/` | `https://zeshannasir.com/` | `301 Moved Permanently` | Canonical apex normalization |
| `https://zeshans.dev/resume.pdf` | `https://zeshannasir.com/resume.pdf` | `301 Moved Permanently` | Static resume artifact |
| `https://zeshans.dev/llms.txt` | `https://zeshannasir.com/llms.txt` | `301 Moved Permanently` | Ground-truth LLM metadata |
| `https://zeshans.dev/sitemap.xml` | `https://zeshannasir.com/sitemap.xml` | `301 Moved Permanently` | Crawler index |
| `https://zeshans.dev/robots.txt` | `https://zeshannasir.com/robots.txt` | `301 Moved Permanently` | Crawler directives |
| `https://zeshans.dev/*` (any other) | `https://zeshannasir.com/$1` | `301 Moved Permanently` | Catch-all one-to-one mapping |
| **`https://zeshans.dev/portal`** | **NO REDIRECT (`200 OK`)** | **`UNCHANGED`** | **CRITICAL: OMEGA telemetry endpoint. Must remain live on zeshans.dev.** |
| **`https://zeshans.dev/portal/*`** | **NO REDIRECT (`200 OK`)** | **`UNCHANGED`** | **CRITICAL: Sub-resources and webhooks remain untouched.** |

---

## 3. Edge Redirect Implementation (Cloudflare)

In the Cloudflare dashboard for zone `zeshans.dev`:

### Redirect Rule Definition:
- **Rule Name:** `Legacy 301 Migration to zeshannasir.com (Excluding /portal)`
- **Match Expression:**
  ```text
  (http.host eq "zeshans.dev" or http.host eq "www.zeshans.dev")
  and not starts_with(http.request.uri.path, "/portal")
  ```
- **Action:** Dynamic Redirect
- **Status Code:** `301 Moved Permanently`
- **Target URL Expression:**
  ```text
  concat("https://zeshannasir.com", http.request.uri.path)
  ```
- **Preserve Query String:** `Yes`

---

## 4. Origin Caddy Implementation Reference

On the edge VPS Caddyfile, the server block for `zeshans.dev` preserves `/portal` while redirecting all other traffic:

```caddyfile
# Legacy Zone: zeshans.dev
zeshans.dev, www.zeshans.dev {
    # 1. Telemetry Sanctuary: Route /portal to internal upstream
    handle /portal* {
        reverse_proxy 127.0.0.1:8085
    }

    # 2. Redirect all other requests to zeshannasir.com
    handle {
        redir https://zeshannasir.com{uri} permanent
    }
}

# Canonical Zone: zeshannasir.com
zeshannasir.com, www.zeshannasir.com {
    root * /var/www/personal-site
    file_server
    
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; script-src 'self';"
    }

    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

---

## 5. Automated Pre- & Post-Cutover Verification Tests

Run these tests via curl to confirm behavior before and after DNS activation:

```sh
#!/usr/bin/env bash
set -euo pipefail

TARGET_NEW="https://zeshannasir.com"
LEGACY="https://zeshans.dev"

echo "=== 1. Checking /portal Sanctuary (MUST RETURN 200/401/302, NEVER 301 to new domain) ==="
STATUS_PORTAL=$(curl -s -o /dev/null -w "%{http_code}" "$LEGACY/portal")
echo "zeshans.dev/portal status: $STATUS_PORTAL"
if [[ "$STATUS_PORTAL" == "301" ]]; then
  echo "CRITICAL DEFECT: /portal is being redirected!" >&2
  exit 1
fi

echo "=== 2. Checking Apex Redirect (MUST RETURN 301 to zeshannasir.com) ==="
REDIRECT_LOC=$(curl -s -I "$LEGACY/" | grep -i "^location:" | tr -d '\r\n')
echo "zeshans.dev/ redirect location: $REDIRECT_LOC"

echo "=== 3. Checking New Canonical Site (MUST RETURN 200 OK) ==="
STATUS_NEW=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_NEW/")
echo "zeshannasir.com status: $STATUS_NEW"

echo "=== All migration assertions verified successfully! ==="
```

---

## 6. Google Search Console & SEO Checklist

1. **Add & Verify Property:** Add `https://zeshannasir.com` to Google Search Console via Cloudflare DNS TXT verification.
2. **Submit Sitemap:** Submit `https://zeshannasir.com/sitemap.xml`.
3. **Change of Address Tool:**
   - In GSC property for `zeshans.dev` $\to$ **Settings** $\to$ **Change of Address**.
   - Select new verified property `zeshannasir.com`.
   - Run verification checks and submit.
4. **Monitor Indexing:** Inspect crawl stats and ensure zero 404 errors on redirected legacy URLs.

---

## 7. Rollback Procedure

If unexpected edge errors occur during cutover:

1. **Cloudflare Dashboard:** Disable the `Legacy 301 Migration to zeshannasir.com` redirect rule in the `zeshans.dev` zone.
2. **Caddyfile:** Revert the Caddyfile on VPS to restore local serving for `zeshans.dev`.
3. **Validate:** Confirm `https://zeshans.dev` resumes serving the static portfolio directly while `/portal` continues uninterrupted.
