# zeshannasir.com — Personal Brand & Sovereign Systems Platform

> **"I build the reliability layer AI depends on."**

This repository contains the complete production source code, design token system, documentation case studies, and deployment automation configurations for [zeshannasir.com](https://zeshannasir.com) — the personal brand and engineering portfolio of **Zeshan Nasir**.

---

## 🏛️ Architecture Overview

- **Primary Canonical Domain:** `zeshannasir.com` (Cloudflare Registrar, 5–10 year term)
- **Legacy Migration:** `zeshans.dev` (301 Moved Permanently at Cloudflare Edge)
- **Edge Routing:** Cloudflare Zero Trust Tunnel (`cloudflared`) with Full (Strict) TLS 1.3
- **Origin Server:** Caddy HTTP/3 static web engine (self-hosted inside the sovereign OMEGA Proxmox cluster)
- **Frontend Architecture:** 100% static HTML5, fluid design tokens in native CSS, lightweight vanilla ES2024 (zero tracking, zero heavy frameworks, sub-100ms first contentful paint).

---

## 📁 Repository Structure

```
personal-site/
├── index.html                   # Master production entrypoint
├── 404.html                     # Custom styled 404 error page
├── favicon.svg                  # Minimal architectural monogram (ZN)
├── robots.txt                   # Web crawler directives
├── sitemap.xml                  # Canonical XML sitemap
├── llms.txt                     # Ground truth file for LLMs & AI search
├── resume.pdf                   # Latest curriculum vitae
│
├── assets/
│   ├── diagrams/
│   │   ├── cluster-topology.svg # OMEGA 2-node + QDevice hypervisor map
│   │   └── knowledge-pipeline.svg # Confluence/Workato lifecycle engine
│   ├── icons/                   # Vector marks & icons
│   └── images/                  # Media & social preview graphics
│
├── css/
│   ├── tokens.css               # Design tokens (colors, fluid type, spacing)
│   ├── base.css                 # CSS reset, accessibility skip links, typography
│   └── components.css           # Bento cards, telemetry, ADRs, buttons, toast
│
├── js/
│   └── main.js                  # Theme switcher, scroll spy, clipboard toast
│
├── content/
│   ├── work/
│   │   ├── knowledge-governance.md # Deep case study: Knowledge lifecycle
│   │   ├── hermes-agent.md         # Deep case study: Hermes ops agent
│   │   └── omega-cluster.md        # Deep case study: Sovereign OMEGA cluster
│   ├── career.md                # Full 14-year professional experience record
│   └── contact.md               # Direct contact protocol & colophon
│
├── config/
│   ├── cloudflared/
│   │   └── tunnel.yml           # Cloudflare Tunnel ingress configuration
│   ├── caddy/
│   │   └── Caddyfile            # Caddy HTTP/3 origin server configuration
│   └── systemd/
│       └── cloudflared.service  # Systemd daemon unit file
│
└── docs/
    ├── brand.md                 # Brand positioning & messaging framework
    ├── design-system.md         # Design system & visual specification
    └── deployment.md            # Cloudflare Registrar, DNS, Tunnel & 301 guide
```

---

## 🚀 Local Development & Preview

To preview locally with zero external dependencies:

```bash
# Using Python's built-in HTTP server:
python3 -m http.server 8080

# Then open in your browser:
open http://localhost:8080
```

---

## 🔒 Security & Privacy Posture
- **Zero Third-Party Trackers:** No analytics scripts, no tracking cookies, no external pixel beacons.
- **Strict Headers:** HSTS preloaded (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- **Zero Public Router Ports:** Routed entirely through an outbound encrypted Cloudflare Tunnel.

---

## 📄 License
© 2026 Zeshan Nasir. All rights reserved.
