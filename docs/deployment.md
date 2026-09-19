# Infrastructure & Deployment Specification
**Target Production Domain:** `zeshannasir.com`  
**Legacy Domain Redirect:** `zeshans.dev` (301 Permanent)  
**Approved Production Architecture:** VPS Caddy Origin behind Cloudflare Proxy (per `IMPLEMENTATION-CONTRACT.md` §8)  
**Alternative Homelab Architecture (Reference Only):** Cloudflare Tunnel (`cloudflared`) to local hypervisor origin  

> **Architecture Status Note:** Per `IMPLEMENTATION-CONTRACT.md` section 8, the approved production target binds `zeshannasir.com` onto a dedicated Caddy block on the edge VPS, matching the live edge infrastructure without introducing daemon dependencies or homelab uptime requirements. The tunnel configuration below is preserved for reference as a future self-hosted alternative.

---

## 1. Cloudflare Registrar & Multi-Year Domain Portfolio

To secure long-term brand equity, eliminate the awkwardness of the old `zeshans.dev` name, and achieve a maintenance-free 5-to-10-year horizon, execute the following domain registration plan in Cloudflare Registrar.

### 1.1 Target Domains
| Domain | Priority | Role | Target Registration Duration |
| :--- | :--- | :--- | :--- |
| **`zeshannasir.com`** | **P0 (Critical)** | **Canonical Primary Identity** | **5 – 10 Years** (At-cost renewal) |
| **`zeshan-nasir.com`** | P1 (Recommended) | Brand Protection (Hyphenated typo defense) | 5 – 10 Years (Redirects to primary) |
| **`znasir.com`** | P2 (Optional) | Short-form utility / high-signal email | 5 Years (Redirects to primary) |

### 1.2 Registration & Hardening Steps (Cloudflare Registrar)
1. **Navigate**: Cloudflare Dashboard → **Domain Registration** → **Register Domains**.
2. **Search & Add to Cart**: Enter `zeshannasir.com` (and companion domains).
3. **Select Term**: Select the maximum available term (up to 10 years for `.com`). Cloudflare Registrar charges wholesale registry pricing with zero markup.
4. **Mandatory Security Settings**:
   - **WHOIS Privacy**: *Enabled* (Included free on Cloudflare).
   - **Auto-Renew**: *Enabled* (Eliminates risk of domain hijacking or inadvertent expiration).
   - **Registrar Lock**: *Enabled* (Prevents unauthorized domain transfer requests).
   - **DNSSEC**: *Enabled* with 1-click in the DNS tab (signs DNS zone with cryptographic signatures).

---

## 2. Cloudflare DNS Architecture & Zone Records

Cloudflare manages authoritative DNS with proxying (`Orange Cloud` / CDN + WAF enabled).

### 2.1 Zone: `zeshannasir.com` (Primary Zone)
| Type | Name | Content / Target | Proxy Status | TTL | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` | `<TUNNEL_UUID>.cfargotunnel.com` | **Proxied (Orange)** | Auto | Apex mapped to Cloudflare Tunnel |
| **CNAME** | `www` | `zeshannasir.com` | **Proxied (Orange)** | Auto | Canonical www alias |
| **CNAME** | `lab` | `<TUNNEL_UUID>.cfargotunnel.com` | **Proxied (Orange)** | Auto | Future: Sovereign cluster telemetry |
| **CNAME** | `notes` | `<TUNNEL_UUID>.cfargotunnel.com` | **Proxied (Orange)** | Auto | Future: Public knowledge garden |
| **CNAME** | `status` | `<TUNNEL_UUID>.cfargotunnel.com` | **Proxied (Orange)** | Auto | Future: Uptime Kuma public status |
| **TXT** | `@` | `v=spf1 -all` | DNS Only | Auto | Hardened SPF (prevents email spoofing) |
| **TXT** | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;` | DNS Only | Auto | Strict DMARC enforcement |

### 2.2 Zone: `zeshans.dev` (Legacy Zone - 301 Permanent Redirect)
| Type | Name | Content / Target | Proxy Status | TTL | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AAAA** | `@` | `100::` (Dummy IPv6 / discard) | **Proxied (Orange)** | Auto | Triggers Cloudflare Edge Redirect |
| **CNAME** | `www` | `zeshans.dev` | **Proxied (Orange)** | Auto | Triggers Cloudflare Edge Redirect |

---

## 3. Permanent 301 Redirect Rules (Edge Redirection)

To migrate all incoming traffic, search engine link equity, and legacy bookmarks from `zeshans.dev` to `zeshannasir.com`:

### 3.1 Cloudflare Ruleset / Single Redirect for `zeshans.dev` (Preserving `/portal`)
In the Cloudflare dashboard for zone `zeshans.dev`:
1. Navigate to **Rules** → **Redirect Rules** → **Create Rule**.
2. **Rule Name**: `Legacy Migration to zeshannasir.com (Excluding /portal)`
3. **If incoming requests match**:
   - Expression: `(http.host eq "zeshans.dev" or http.host eq "www.zeshans.dev") and not starts_with(http.request.uri.path, "/portal")`
4. **Then**:
   - **Type**: `Dynamic`
   - **Status code**: `301 Moved Permanently`
   - **Target URL Expression**: `concat("https://zeshannasir.com", http.request.uri.path)`
   - **Preserve query string**: *Checked*

> [!IMPORTANT]
> **CRITICAL PRESERVATION OF `/portal`**  
> `zeshans.dev/portal` is an active OMEGA telemetry production endpoint with physical QR labels in active circulation.  
> It is **strictly excluded** from all migration rules, redirects, and rewrites. It remains hosted unchanged on `zeshans.dev/portal`.

### 3.2 Companion Domain Redirects (`zeshan-nasir.com`, `znasir.com`)
Repeat the single redirect rule in their respective zones:
- Expression: `(http.host eq "zeshan-nasir.com" or http.host eq "www.zeshan-nasir.com")`
- Target: `concat("https://zeshannasir.com", http.request.uri.path)` (301 Permanent)

---

## 4. Edge Security & SSL/TLS Configuration

In Cloudflare Dashboard for `zeshannasir.com`:
- **SSL/TLS Encryption Mode**: **Full (Strict)**
- **Always Use HTTPS**: *On*
- **Minimum TLS Version**: *TLS 1.2* (or TLS 1.3 recommended)
- **Automatic HTTPS Rewrites**: *On*
- **Brotli Compression**: *On*
- **Early Hints**: *On*
- **Security Headers (Transform Rules or Origin Caddy)**:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; script-src 'self';`

---

## 5. Origin Ingress & Webserver Configuration

Origin ingress is served securely via internal web services. **No router ports (80/443) are ever opened to the public internet.**

### 5.1 File: `config/cloudflared/tunnel.yml`
```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /etc/cloudflared/<TUNNEL_UUID>.json
metrics: 127.0.0.1:2000
no-autoupdate: true

ingress:
  # Primary Personal Site (Apex)
  - hostname: zeshannasir.com
    service: http://127.0.0.1:8080
    originRequest:
      connectTimeout: 10s
      noTLSVerify: false
      httpHostHeader: zeshannasir.com

  # Canonical WWW
  - hostname: www.zeshannasir.com
    service: http://127.0.0.1:8080
    originRequest:
      connectTimeout: 10s
      httpHostHeader: zeshannasir.com

  # Catch-all 404
  - service: http_status:404
```

### 5.2 Local Origin Webserver (Caddy)
On the local host or container (listening on local port `8080`):
```caddyfile
# config/caddy/Caddyfile
:8080 {
    root * /var/www/personal-site
    file_server {
        precompressed zstd gzip
    }

    # Hide hidden files
    @hidden path */.* .*
    respond @hidden 404

    # Cache control: Immutable assets for 1 year, HTML dynamic
    @static path *.css *.js *.svg *.png *.jpg *.webp *.woff2 *.pdf
    header @static Cache-Control "public, max-age=31536000, immutable"

    @dynamic not path *.css *.js *.svg *.png *.jpg *.webp *.woff2 *.pdf
    header @dynamic Cache-Control "public, max-age=0, must-revalidate"

    # Strict Security Headers
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # Clean custom 404
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

### 5.3 Systemd Service (`/etc/systemd/system/cloudflared.service`)
```ini
[Unit]
Description=Cloudflare Tunnel Daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
ExecStart=/usr/local/bin/cloudflared --config /etc/cloudflared/tunnel.yml run
Restart=on-failure
RestartSec=5s
LimitNOFILE=65536
User=cloudflared
Group=cloudflared

[Install]
WantedBy=multi-user.target
```

---

## 6. Execution Checklist

- [ ] **Step 1: Domain Registration**
  - Register `zeshannasir.com` in Cloudflare Registrar for 5–10 years.
  - Verify WHOIS privacy, Registrar lock, and auto-renew are active.
  - (Optional) Register `zeshan-nasir.com` and `znasir.com`.
- [ ] **Step 2: Create Cloudflare Tunnel**
  - In Cloudflare Zero Trust dashboard (or CLI `cloudflared tunnel create omega-web`).
  - Retrieve `<TUNNEL_UUID>` and save credentials JSON.
- [ ] **Step 3: Deploy Origin & Cloudflared**
  - Deploy personal site files to `/var/www/personal-site`.
  - Start Caddy listening on internal port `8080`.
  - Start `cloudflared` service pointing to `127.0.0.1:8080`.
- [ ] **Step 4: Configure DNS Records**
  - Route `zeshannasir.com` CNAME $\to$ `<TUNNEL_UUID>.cfargotunnel.com`.
  - Route `www.zeshannasir.com` CNAME $\to$ `zeshannasir.com`.
- [ ] **Step 5: Configure 301 Edge Redirect (Preserving `/portal`)**
  - In `zeshans.dev` zone: Create Redirect Rule sending all paths **EXCEPT `/portal`** to `https://zeshannasir.com/$1` (ensuring `zeshans.dev/portal` continues routing directly to OMEGA telemetry).
- [ ] **Step 6: Validation**
  - Test `curl -I https://zeshans.dev` → Verify `301 Moved Permanently` to `https://zeshannasir.com/`.
  - Test `curl -I https://zeshannasir.com` → Verify `200 OK`, HTTP/2 or HTTP/3, and security headers.
