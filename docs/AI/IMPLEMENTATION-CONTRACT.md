# zeshannasir.com — Implementation Contract

**Repository:** `/Users/zeshan.nasir/personal-site`
**Produced by:** Pass A (Discover → Reconcile → Design → Architect → Contract)
**Date:** 2026-09-19
**Consumed by:** Pass B. Pass B implements this contract and does not repeat broad discovery.

Classification used throughout: `VERIFIED` · `PROPOSED` · `DEPENDENT` · `UNVERIFIED` · `CONFLICT`.

---

## 1. Verified facts

### 1.1 Repository identity

| Fact | Evidence | Label |
| --- | --- | --- |
| This repository is `/Users/zeshan.nasir/personal-site`, git root confirmed, branch `main`, HEAD `1a23711`, working tree clean, **no remotes**, 6 commits all dated 2026-09-18 | `git rev-parse --show-toplevel`, `status --porcelain`, `remote -v`, `log` | `VERIFIED` |
| `~/Desktop/personal-site` is a copy at the identical HEAD. A recursive diff shows only `.git/index` differing (stat cache). Different inode, not a symlink or hardlink | `diff -rq`, `stat -f %i` | `VERIFIED` |
| `~/portfolio` is the source of the live `zeshans.dev`: remote `git@github.com:ZeshanNasir/zeshans.dev.git`, 144 commits, HEAD `456403c` dated 2026-08-22, clean | `git remote -v`, `log`, `status` | `VERIFIED` |
| Four further trees reference the same identity and are **not** in scope: `~/ZeshanNasir.github.io`, `~/portfolio-build/zeshans-dev-repo`, `~/projects/zeshans-dev-push`, `~/ZeshanNasir_profile` | Git repository sweep to depth 4 | `VERIFIED` |
| This repository has no build step: no `package.json`, no lockfile, no config, no toolchain | Directory listing | `VERIFIED` |
| Tracked content: 32 files — `index.html` (862 lines), `404.html`, three CSS files, one JS file, five Markdown content files, three docs, three edge config templates, five PNGs, two SVG diagrams, `resume.pdf`, `llms.txt`, `robots.txt`, `sitemap.xml`, `favicon.svg` | `git ls-files` | `VERIFIED` |
| `assets/fonts/` exists on disk, is **empty**, and is untracked. Typefaces are loaded from Google Fonts at runtime | Directory listing; `index.html` lines 31–33 | `VERIFIED` |

### 1.2 Live edge, measured 2026-09-19

| Fact | Evidence | Label |
| --- | --- | --- |
| `zeshans.dev` is live: `http` → `301` to `https`, `https` → `200`, HTTP/2, `server: cloudflare`, `cf-ray` present | `curl -sSI` | `VERIFIED` |
| Live response headers on `zeshans.dev`: HSTS `max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP `default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;`, `cache-control: no-cache, no-store, must-revalidate` on HTML | `curl -sSI` | `VERIFIED` |
| `www.zeshans.dev` does **not** exist — NXDOMAIN | `dig`, `curl` | `VERIFIED` |
| `zeshans.dev` A records `104.21.50.247` / `172.67.215.7` (Cloudflare proxy); MX `route1/2/3.mx.cloudflare.net` (Cloudflare Email Routing active) | `dig` from the VPS and via Google DoH | `VERIFIED` |
| **`zeshannasir.com` has zero DNS records.** The zone is delegated to `amos.ns.cloudflare.com` / `desiree.ns.cloudflare.com`, but A, MX and TXT queries return no answer. `www.zeshannasir.com` is NXDOMAIN | `dig` from the VPS resolver and Google DoH (`Status 0`, no `Answer`; `Status 3` for `www`) | `VERIFIED` |
| A `403 Forbidden` from `Server: Cisco Umbrella` for `zeshannasir.com` observed from this workstation is a **local DNS interception artefact**, not edge behaviour. The workstation resolver returned `146.112.61.110` and a redirect to `malware.opendns.com`. Clean resolvers return no record at all | Two independent clean resolvers | `VERIFIED` |
| `zeshannasir.com` is **not** present in `/etc/caddy/Caddyfile` on the VPS | Full file read over read-only SSH | `VERIFIED` |
| The live origin is Caddy `2.6.2` on the VPS `23.94.101.121` (Tailscale `100.84.144.24`), Debian 13.6 trixie, serving `zeshans.dev` from `/var/www/portfolio`. `caddy validate` reports `Valid configuration` | Read-only SSH | `VERIFIED` |
| `/var/www/` contains only `portfolio`. `/var/www/personal-site` and `/var/www/zeshannasir` do not exist | `ls -la /var/www/` | `VERIFIED` |
| The same Caddyfile serves `handle /portal*` → `127.0.0.1:8085` (OMEGA portal, v3.6.10 frozen production baseline) and fifteen `*.home.zeshans.dev` reverse proxies, most gated by an `(internal_only)` Tailscale/LAN snippet | Full file read | `VERIFIED` |

### 1.3 Deployment as it exists today

`~/portfolio/.github/workflows/deploy.yml` triggers on push to `main`, joins the Tailscale mesh, `scp`s nine named files to `root@$RELAY_IP:/var/www/portfolio` with `rm: true`, then runs `systemctl reload caddy`. `VERIFIED`.

Two consequences, both recorded as risks in section 19:

- `/var/www/portfolio/status.json` exists on the server, is owned by `root`, is written continuously (mtime observed advancing to the current minute), and is **not** in the `portfolio` repository. The `rm: true` flag means a deploy can delete it. `VERIFIED`.
- The workflow reloads Caddy on every deploy of a static site, which is unnecessary and couples content deployment to the shared reverse proxy that also fronts `/portal` and fifteen internal services. `VERIFIED`.

### 1.4 Shared infrastructure document

`~/infinity-notes/docs/VPS-Edge-Pipeline.md` was read from the **local copy** (first attempt in the prescribed order; no network fetch required). v3.6.10, "Canonical Architecture Authority (frozen production baseline)", last verified 2026-09-05. Its scope is the `zeshans.dev/portal` telemetry pipeline plus VPS and Caddy identity. It does not describe general site hosting and must not be duplicated into this repository. `VERIFIED`.

---

## 2. Approved scope

Improve the existing single-page site and make it migration-ready for `zeshannasir.com`:

- correct every claim, or remove it;
- remove published private infrastructure detail;
- self-host the typefaces and eliminate all third-party runtime requests;
- strengthen information architecture, hierarchy and mobile behaviour;
- implement application-side migration readiness: canonical, internal links, metadata, sitemap, robots, Open Graph, structured data, and the old-to-new route map;
- write down the edge configuration for the cutover without performing it.

Origin decision (confirmed): the VPS at `23.94.101.121`, the same host that already serves `zeshans.dev`, in a **new, separate Caddy block** with its own webroot. The `zeshans.dev` block is not modified.

---

## 3. Excluded scope

No DNS change. No Cloudflare change. No Caddy change on the live host. No email record change. No domain cutover. No Search Console action. No deploy. No commit or push without approval.

Not built: a CMS, a build pipeline, a framework migration, a blog, a comment system, analytics, cookies, third-party embeds, a contact form with a backend, or any dashboard.

Companion domain registration (`zeshan-nasir.com`, `znasir.com`) proposed in `docs/deployment.md` §1.1 is out of scope and stays a suggestion.

---

## 4. Route map

The site is one page today, navigated by fragment. That is adequate for the content volume and is kept. `PROPOSED`.

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | Everything: hero, thesis, selected systems, lab, decision records, background, contact | Single canonical page |
| `/resume.pdf` | Curriculum vitae | Linked from hero and contact |
| `/404.html` | Error page | Served by `handle_errors` |
| `/llms.txt` | Ground-truth summary | Must be added to the sitemap |
| `/robots.txt`, `/sitemap.xml`, `/favicon.svg` | Machine files | — |

Fragments on `/`: `#hero`, `#main`, `#manifesto`, `#work`, `#lab`, `#decisions`, `#signal`, `#contact`.

`CONFLICT` — the repository carries five Markdown files (`content/career.md`, `content/contact.md`, `content/work/hermes-agent.md`, `content/work/knowledge-governance.md`, `content/work/omega-cluster.md`) that are rendered by nothing and reachable from no route. They are unreferenced source, not content. Pass B resolves this one way or the other: either promote the three case studies to real routes (`/work/omega-cluster` and so on, with the index page linking to them), or move all five under `docs/` as drafting material. Do not leave orphan content in a repository that is described as production source. `PROPOSED`: move them to `docs/source-content/`; the single page already carries the case studies in full, so a second copy is duplication, not depth.

---

## 5. Content model

Sections on `/`, in order, with what each must do after Pass B:

1. **Hero** — positioning line, one-paragraph thesis, a proof strip of four facts, three actions. The proof strip currently reads `Optimizely` / `14+ Years Enterprise IT` / `Stockholm, Sweden` / `Data Reliability for AI`; all four survive the claim ledger.
2. **Manifesto** — four principles. No numbers. Survives unchanged in substance.
3. **Selected systems** — three case studies. Every metric sidebar is re-worked per section 6.
4. **Reliability lab** — currently titled "Live Sovereign Telemetry" with four hardcoded values. This is the fake-dashboard pattern; see section 6 and section 7.2. It is relabelled and re-sourced, or removed.
5. **Architectural decisions** — four ADRs. Qualitative, no unverifiable numbers. Survives with one edit (ADR 02 asserts "under 8ms").
6. **Authority signal** — background and timeline. Three of four career statistics need treatment.
7. **Contact** — four channels. The email address depends on section 20, D3.
8. **Footer colophon** — four blocks. Two of them state things that are not true today; see section 6.

---

## 6. Claim ledger

### 6.1 Claims that pass

| # | Claim | Source | Status | Verified |
| --- | --- | --- | --- | --- |
| C1 | Zeshan Nasir, System Administrator at Optimizely, Stockholm | `content/career.md`, `llms.txt`, live site | CURRENT | `VERIFIED` |
| C2 | 14+ years in enterprise IT; timeline 2012–2020 MicroTech, 2020–2021 Levi Strauss via SV Engineering, 2022–present Optimizely | `content/career.md`, `resume.pdf` | CURRENT | `VERIFIED` |
| C3 | BS Information Technology, Virtual University of Pakistan; 45 of 60 ECTS on the Information Systems master's programme, Uppsala University | `content/career.md` | CURRENT | `VERIFIED` — the partial ECTS is stated honestly and must stay partial |
| C4 | Technologies worked with: Intune, Jamf Pro, Entra ID, M365, Workato, Confluence, Jira, Proxmox VE, Tailscale, Caddy, Qdrant, ik_llama.cpp | Repository and cluster documentation | CURRENT | `VERIFIED` |
| C5 | A 2-node Proxmox cluster with an external Corosync QDevice witness on an off-site VPS | `VPS-Edge-Pipeline.md`, live VPS (`corosync-qnetd` listening on `:5403`) | CURRENT | `VERIFIED` — independently confirmed on the VPS during this pass |
| C6 | Contact channels: GitHub `ZeshanNasir`, LinkedIn `zeshan-nasir` | Live site | CURRENT | `VERIFIED` |

### 6.2 Claims that must change

| # | Claim as published | Problem | Required treatment |
| --- | --- | --- | --- |
| X1 | "Legacy traffic from `zeshans.dev` permanently 301 redirected at Cloudflare Edge" (footer) | **False today.** `zeshans.dev` returns 200 with its own content and `zeshannasir.com` has no DNS record | Remove, or state in the future tense, until the redirect is live | 
| X2 | "Served behind Cloudflare Zero Trust Tunnel (`cloudflared`) with zero public router port forwarding" (footer, `content/contact.md`) | **False today**, and false under the confirmed origin decision — the site will be served by Caddy on a public VPS behind the Cloudflare proxy, not by a tunnel to the homelab | Rewrite to describe the actual architecture once chosen; do not describe an architecture that is not used |
| X3 | "Zero-port forward tunnel to `zeshannasir.com`" (services table, CT 301 row) | Describes a route to a hostname with no DNS record | Remove the row entirely — see X5 |
| X4 | "Zero third-party telemetry" (footer, `content/contact.md`) alongside a runtime `<link>` to `fonts.googleapis.com` and `fonts.gstatic.com` | Self-contradictory. Google Fonts is a third-party request that discloses every visitor's IP address | Self-host the fonts. Then the claim becomes true and the CSP can drop both Google origins |
| X5 | The services table publishing container IDs `CT 401/402/403/404/406/301`, host names `ms02`/`hp260`, IP addresses `192.168.20.21` – `.26` and `.100`, the subnet `192.168.20.0/24`, and service ports `:8080 :6333 :6334 :5678 :8000 :9090 :3000 :9119`. Also `CT402` in ADR 02, and the subnet again in `assets/diagrams/cluster-topology.svg` line 27. **42 matches across two deployable files** (`index.html` and `cluster-topology.svg`), measured with the T2 grep. `knowledge-pipeline.svg` is clean | Publishing a private network map on a public page. The same content boundary the Karvan record enforces ("hostnames, IPs, container IDs, VPN topology, port maps, the CT401 model table") applies here for the same reason | Replace addresses with roles. "Inference node", "vector memory tier", "automation and document pipeline", "observability and secrets", "agent runtime". No IPs, no CT numbers, no subnet, no ports. T2 must return zero matches |
| X6 | "Qwen3.6-35B resident" | `UNVERIFIED` against the current CT401 configuration, and it is an infrastructure disclosure under X5 | Remove the model name, or verify and generalise to a capability statement |
| X7 | "400+ Pages Deprecated", "100% Schema Coverage", "over 40% of indexed documentation was unowned or outdated" | Employer-derived operational statistics about Optimizely, published without stated authorisation | Obtain written employer clearance, or restate qualitatively: what was designed and why, with no figures |
| X8 | "1,000+ Endpoints Governed", "ISO 27001 Audit-Ready Baselines", "zero major non-conformities" | Same class as X7. The audit outcome in particular is the employer's result, not a personal metric | Same treatment |
| X9 | "0 Accidental Mutations", "< 90s Anomaly Correlated", "< 8ms Vector Latency (Qdrant gRPC p95)", "100% Verified bare-metal restoration drills" | Self-measurable, but published with no date, no method and no reproducible source | Either attach a measurement date and method to each, or convert to a qualitative statement. A number with no provenance is weaker than a sentence |
| X10 | Section titled "Live Sovereign Telemetry" containing four hardcoded static values | This is a fake dashboard. The word "live" asserts something the page does not do | Retitle to "Measured baselines", add the measurement date, and drop any styling that reads as a live readout — or remove the section. Nothing on a static page may present itself as live |
| X11 | Status beacon in the header reading `CLUSTER QUORATE` with a coloured dot | Same pattern as X10 at smaller scale: a static string presented as live status | Remove, or make it a dated statement |
| X12 | `README.md`: "This repository contains the complete production source code … for zeshannasir.com" | The site is not in production; the domain has no DNS | Reword to describe intent |
| X13 | `og:image` points at `assets/images/og-legacy.png` | Works, but the filename says "legacy" on the canonical brand | Rename to `assets/images/og.png` and update both meta tags |
| X14 | `jobTitle` is "Systems Administrator & Reliability Engineer" in JSON-LD, "System Administrator" in `career.md`, "Systems Operator & AI Reliability Engineer" in `<title>` | Three different titles for one person across one page's own metadata | Pick one and use it in `<title>`, JSON-LD, `llms.txt` and `career.md` |

Nothing outside section 6.1, as corrected by 6.2, is published.

---

## 7. Design direction

The existing system is coherent and already documented in `docs/design-system.md` and `docs/brand.md`: Swiss modernism, warm ivory light theme, near-black dark theme, teal accent, hairline borders, fluid type. It is kept. This is a refinement pass, not a redesign.

### 7.1 Kept

Token architecture in `css/tokens.css`; the dual palette; the fluid `clamp()` scale; the asymmetric section-header grid; hairline borders over heavy shadow; the documented voice and its banned-cliché list; `prefers-reduced-motion` handling, which is already implemented at `css/base.css:123`.

### 7.2 Corrected

| # | Issue | Fix |
| --- | --- | --- |
| P1 | "Live Sovereign Telemetry" and the `CLUSTER QUORATE` beacon present static text as live instrumentation | Per X10 and X11. This is the single biggest credibility defect on the page |
| P2 | `body { overflow-x: hidden }` in `css/base.css` | Remove it and fix whatever actually overflows. It masks layout bugs at exactly the widths where they matter |
| P3 | Fonts loaded from Google Fonts | Self-host Inter and JetBrains Mono as subset `woff2`, preload the two above-the-fold faces, keep a real system fallback stack |
| P4 | Four full-page screenshots (`desktop-dark.png`, `desktop-dark-verified.png`, `desktop-light.png`, `mobile-dark.png`) are tracked, total roughly 6 MB, 1440 × 10499 and 573 × 16000 pixels | These are QA artefacts, not site assets. Move to `docs/qa/` or remove. They must not be deployed |
| P5 | `og-legacy.png` is 263 KB for a 1200 × 630 image | Re-export under 150 KB |
| P6 | Three CSS files, 1324 lines total, with `components.css` at 1073 | Acceptable, but Pass B should delete any rule with no corresponding markup rather than carrying it forward |
| P7 | Navigation labels — `Systems`, `Manifesto`, `Reliability Lab`, `Decisions`, `Authority`, `Contact` — do not match the section headings they jump to (`Flagship Architectures`, `The Reliability Manifesto`, `Live Sovereign Telemetry`, `Architectural Tradeoffs`, `Operational Background`) | Align each nav label with its destination heading. A reader should recognise where they landed |
| P8 | "Authority signal" as a section name | It names the persuasion technique rather than the content. Call it what it is: background, or experience |

### 7.3 Ruled out

Redesign for its own sake. New colour system. New typeface. Framework adoption. Any animation added during this pass. Any new section that is not required by section 6.

---

## 8. Design tokens

`css/tokens.css` stays the single source. Two changes: verify every documented contrast ratio by measurement rather than trusting the table in `docs/design-system.md`, and align the two files where they disagree — the docs list `--border-subtle` as `rgba(255,255,255,0.07)` while the CSS uses `0.08`, and the docs list a `--bg-surface-raised` of `#f2f2ee` in light mode while the CSS uses `#f3f3ee`. Small, but the documentation is meant to be authoritative.

No `[data-theme]` removal: the theme toggle is existing behaviour, uses `localStorage` rather than a cookie, respects the system default when unset, and is worth keeping.

---

## 9. Component plan

No new components. Existing ones are refined:

`skip-link` · `site-header` with `site-nav` and `header-actions` · `hero` with `proof-strip` · `manifesto-card` · `system-card` with `system-grid` and `metrics-box` · `telemetry-card` (retitled per X10) · `services-table` (redacted per X5) · `adr-card` · `career-panel` with `timeline-item` · `contact-channel` · `site-footer` with `footer-colophon` · `toast`.

`status-beacon` is removed per X11. `metrics-box` survives only where section 6 leaves a publishable number; where it does not, the sidebar becomes a short qualitative statement rather than an empty box.

---

## 10. Asset plan

| Asset | State | Action |
| --- | --- | --- |
| `assets/fonts/` | Empty, untracked | Add subset `woff2` for Inter 400/500/600/700 and JetBrains Mono 400/500, plus the OFL licence text. Ship only weights actually used — audit the CSS first |
| `assets/images/og-legacy.png` | 1200 × 630, 263 KB | Rename to `og.png`, re-export under 150 KB, update both meta tags |
| `assets/images/desktop-*.png`, `mobile-dark.png` | ~6 MB of QA screenshots, tracked | Move out of the deployable tree |
| `assets/diagrams/cluster-topology.svg` | In use. **Renders `SUBNET: 192.168.20.0/24` at line 27** | Redact per X5 |
| `assets/diagrams/knowledge-pipeline.svg` | In use. Clean — no disclosure | Keep. Add `<title>` and `<desc>` per section 12 |
| `assets/icons/favicon.svg` and root `favicon.svg` | Two copies | Keep one, reference it consistently |
| `resume.pdf` | 199 KB, current | Keep. Verify the PDF's own contact details match the new domain before cutover |

---

## 11. SEO and machine readability

- `<title>`, meta description, canonical, Open Graph and Twitter card: already present and already pointing at `https://zeshannasir.com/`. Correct for the target state. `VERIFIED`.
- `sitemap.xml` currently lists `/` and `/resume.pdf` on the new host. Add `/llms.txt`. Drop `changefreq` and `priority`. Keep real `lastmod` values.
- `robots.txt` already names the new-host sitemap. Correct.
- `llms.txt` already declares `zeshannasir.com` canonical and `zeshans.dev` legacy. Correct; update once X14 settles the job title.
- JSON-LD `Person`: fix `jobTitle` per X14; keep `worksFor`, `url`, `sameAs`, `description`. Do not add `Organization` markup — the Karvan entity lives on a different domain and the two identities stay separate.
- Semantic HTML: one `<h1>`, one `<main>`, one `<nav>`, one `<header>`, one `<footer>`, three `<article>`, seven `<section>`. Already correct. `VERIFIED`.
- Both repository intent and public-edge behaviour must be verified. Public-edge verification for `zeshannasir.com` is impossible before cutover; say so rather than substituting a local result.

---

## 12. Accessibility requirements

WCAG 2.2 AA floor. Existing implementation is a good starting point — skip link present, `:focus-visible` ring defined, reduced-motion media query present, eight `aria-` attributes, correct landmarks.

To verify or fix in Pass B:

- measured contrast for every token pair in both themes, rather than the documented values;
- keyboard operation of the theme toggle, the mobile navigation toggle and the click-to-copy email card — the copy card is a `<div>` with `data-copy` and no keyboard affordance, which is a real defect for a primary contact route;
- the `t` keyboard shortcut for the theme toggle: confirm it cannot fire while a modifier is held and does not collide with browser or assistive-technology shortcuts;
- `aria-expanded` on the mobile toggle must track the actual state;
- the services table needs `<caption>` and `<th scope>`;
- both diagram SVGs need `<title>`, `<desc>` and a visible text equivalent;
- target size ≥ 24 × 24 px for every control;
- reflow at 320 px and at 400 % zoom with no horizontal scroll — this must be re-verified **after** `overflow-x: hidden` is removed (P2), because that rule is currently hiding the answer;
- `lang="sv"` on any Swedish term in running text.

---

## 13. Security requirements

- No secrets in the repository. `.gitignore` already covers `*.pem`, `*.key`, `*.token`, `credentials.json`, `tunnel.json`, `.env`. `VERIFIED`. The committed `config/cloudflared/tunnel.yml` uses an all-zero placeholder UUID, not a real one. `VERIFIED`.
- **Infrastructure disclosure is the main security finding on this site.** X5 and X6 are the fix. The current page publishes an accurate internal network map.
- No dependencies, therefore no dependency-vulnerability surface. Keep it that way.
- Zero third-party runtime requests once P3 lands. Then the CSP tightens to:

  ```
  default-src 'self';
  base-uri 'none';
  form-action 'none';
  frame-ancestors 'none';
  img-src 'self' data:;
  style-src 'self';
  font-src 'self';
  script-src 'self';
  connect-src 'none'
  ```

  Note this removes both Google origins and drops `'unsafe-inline'` from `style-src`. `404.html` currently carries an inline `<style>` block; move it into a stylesheet rather than keeping the directive.
- Response headers to add at the origin beyond the current set: `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `Permissions-Policy: geolocation=(), camera=(), microphone=()`.
- Trust boundary, to be stated accurately on the site and in `/privacy` if one is added: Cloudflare terminates TLS and sees visitor IP addresses; Caddy on the VPS is the origin and writes access logs that roll at 50 MB and keep 3; the application stores nothing server-side and sets no cookies. `localStorage` holds one key, `zn_site_theme`, on the visitor's own device.

---

## 14. Performance requirements

Targets LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Not claimed as achieved; measured in Pass B and re-measured in Pass C.

Current state and actions: remove roughly 6 MB of screenshots from the deployable tree (P4); self-host and subset fonts, which removes two DNS lookups, two TLS handshakes and two round trips to Google (P3); re-export the Open Graph image (P5); keep JavaScript at its current 151 lines and add none; give both diagram `<img>` elements explicit `width` and `height`, which they already have; verify CLS empirically after the font change.

Measurement: Lighthouse mobile against the local preview, plus a byte budget. Field measurement is impossible before the site is public — record that rather than substituting a lab number.

---

## 15. Edge integration

**Nothing in this section is applied during Pass A, B or C.**

Origin decision (confirmed): serve `zeshannasir.com` from the existing VPS Caddy in a **new block with its own webroot**, not by extending the `zeshans.dev` block and not via a Cloudflare Tunnel to the homelab.

`CONFLICT` recorded and resolved. `docs/deployment.md` §2.1 and §5, and `config/cloudflared/tunnel.yml`, specify a Cloudflare Tunnel to a homelab origin at `192.168.20.100:8080` with apex CNAMEs to `<UUID>.cfargotunnel.com`. `KARVAN_VPS_CADDY_RUNBOOK.md` §3 instead proposes binding `zeshannasir.com` onto the existing `zeshans.dev` block on the VPS. The live edge matches neither: `zeshannasir.com` has no DNS at all. Resolution: VPS origin, separate block. Rationale — it matches the verified live architecture, adds no daemon, removes the home-ISP and home-hardware dependency from a public identity site, and keeps `zeshans.dev` and its `/portal` untouched so rollback is the deletion of one edge rule. `docs/deployment.md` §2.1, §5.1 and §5.2 and the three files under `config/` must be rewritten to match, or clearly marked as a rejected alternative. Leaving both in the repository unlabelled is how the wrong one gets deployed.

### 15.1 Proposed DNS (Cloudflare zone `zeshannasir.com`)

| Type | Name | Content | Proxy | TTL |
| --- | --- | --- | --- | --- |
| A | `@` | `23.94.101.121` | Proxied | Auto |
| CNAME | `www` | `zeshannasir.com` | Proxied | Auto |
| TXT | `@` | `v=spf1 -all` | DNS only | Auto |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;` | DNS only | Auto |

The two TXT records come from `docs/deployment.md` §2.1 and are correct **only while no mail is sent from the domain**. If `contact@zeshannasir.com` is ever enabled through Cloudflare Email Routing, the SPF record must change before mail flows. See section 20, D3.

### 15.2 Proposed Caddy block

Appended to `/etc/caddy/Caddyfile`, changing nothing above it:

```caddyfile
zeshannasir.com, www.zeshannasir.com {
	root * /var/www/zeshannasir

	@www host www.zeshannasir.com
	redir @www https://zeshannasir.com{uri} permanent

	file_server {
		precompressed zstd gzip
	}

	@hidden {
		path */.*
		path .*
	}
	respond @hidden 404

	encode zstd gzip

	@immutable path /css/* /js/* /assets/*
	header @immutable Cache-Control "public, max-age=31536000, immutable"

	@html not path /css/* /js/* /assets/*
	header @html Cache-Control "public, max-age=0, must-revalidate"

	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "DENY"
		Referrer-Policy "strict-origin-when-cross-origin"
		Cross-Origin-Opener-Policy "same-origin"
		Cross-Origin-Resource-Policy "same-origin"
		Permissions-Policy "geolocation=(), camera=(), microphone=()"
		Content-Security-Policy "default-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'none'"
		-Server
	}

	handle_errors {
		rewrite * /404.html
		file_server
	}

	log {
		output file /var/log/caddy/zeshannasir.access.log {
			roll_size 25mb
			roll_keep 3
		}
		format console
	}
}
```

Note `Cache-Control: immutable` on unhashed filenames is a trap: `css/tokens.css` cached for a year cannot be updated. Either add a content hash to asset filenames in Pass B, or reduce that `max-age` to something survivable such as `86400` with `stale-while-revalidate`. `PROPOSED`: reduce the `max-age`; hashing filenames without a build step means renaming by hand, which will be forgotten.

HSTS is specified **without** `preload` here, deliberately. `zeshans.dev` already asserts `preload`; repeating it on a domain that has never served a byte commits an irreversible decision for no benefit. Add it after the site has run cleanly.

---

## 16. Migration architecture

### 16.1 Policy

| Item | Decision |
| --- | --- |
| Canonical host | `zeshannasir.com` (apex). `www` exists only to 301 to apex |
| Protocol | HTTPS only; HTTP 301 to HTTPS at the edge |
| Trailing slash | Only on the root. No other path has one |
| Case | Lowercase |
| Canonical tag | Absolute, self-referencing, on every page |

### 16.2 URL inventory

**Legacy — `zeshans.dev`, as actually served** (from `/var/www/portfolio` and the live Caddyfile):

`/` · `/resume.pdf` · `/llms.txt` · `/robots.txt` · `/sitemap.xml` · `/favicon.svg` · `/og.png` · `/style.css` · `/main.js` · `/status.json` · `/portal` and `/portal/api/*`

Fragments on `/`: `#hero` `#main` `#work` `#method` `#principles` `#records` `#decisions` `#contact`

**New — `zeshannasir.com`:**

`/` · `/resume.pdf` · `/llms.txt` · `/robots.txt` · `/sitemap.xml` · `/favicon.svg` · `/404.html` · `/assets/**` · `/css/**` · `/js/main.js`

### 16.3 Old to new mapping

| Legacy | New | Method |
| --- | --- | --- |
| `https://zeshans.dev/` | `https://zeshannasir.com/` | 301, path-preserving, one hop |
| `/resume.pdf`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/favicon.svg` | Same path on the new host | Same rule |
| `/og.png` | `/assets/images/og.png` | Explicit 301 — the path changes |
| `/style.css`, `/main.js` | No equivalent | Accepted 404 after migration. Never linked externally; not worth a rule |
| `/status.json` | No equivalent | Not part of the site. See R2 |
| **`/portal`, `/portal/*`** | **Stays on `zeshans.dev`** | **Excluded from the redirect** |
| `#` fragments on `/` | New fragment names | Fragments are not sent to the server and cannot be redirected. Any externally shared fragment link lands on the new home page at the top, which is acceptable. Keep the existing fragment names where possible to reduce even that |

### 16.4 The `/portal` exclusion

`zeshans.dev/portal` fronts `omega-portal.service` on `127.0.0.1:8085`, a frozen production baseline documented as canonical in `VPS-Edge-Pipeline.md`, with QR labels and campaign links in physical circulation. A host-level redirect rule would capture it and break it.

The redirect rule must therefore be path-aware:

```
Expression:
  (http.host in {"zeshans.dev" "www.zeshans.dev"})
  and not starts_with(http.request.uri.path, "/portal")

Then: Dynamic, 301,
  concat("https://zeshannasir.com", http.request.uri.path)
  Preserve query string: on
```

This supersedes `docs/deployment.md` §3.1, whose expression is host-only and would take the portal down. `docs/deployment.md` §2.2 is also superseded: it proposes replacing the `zeshans.dev` apex A record with an `AAAA` of `100::` (a discard address) to force an edge redirect. That would make the origin unreachable for every path including `/portal`, and would break the origin even if the redirect rule were later removed. **Do not apply §2.2.** Keep the real A records and let the path-aware redirect rule do the work.

`*.home.zeshans.dev` is unaffected: the rule matches the apex and `www` only.

### 16.5 Cutover order

Each step is reversible on its own, and `zeshans.dev` keeps serving until the last one.

1. Create `/var/www/zeshannasir` and deploy the site there. Nothing public changes.
2. Append the section 15.2 Caddy block. `caddy validate`, then `systemctl reload caddy`. Nothing public changes — no DNS points at it yet.
3. Add the `zeshannasir.com` A and `www` CNAME records, proxied. Verify: `curl -sI https://zeshannasir.com/` returns 200 with the expected headers; `www` returns a single 301 to apex.
4. Verify `zeshans.dev` and `zeshans.dev/portal` are still 200. They must be — nothing touched them.
5. Add the path-aware redirect rule in the `zeshans.dev` zone.
6. Verify: `zeshans.dev/` → one 301 → `zeshannasir.com/` → 200; `zeshans.dev/resume.pdf` → one 301 → the same path; `zeshans.dev/portal` → still 200; no redirect chain anywhere; no loop.
7. Add the SPF and DMARC TXT records.
8. Search Console: add and verify the `zeshannasir.com` property by DNS TXT, submit the sitemap, then use Change of Address on the `zeshans.dev` property. The Change of Address tool requires the 301 to already be in place, which is why it comes last.
9. Add Uptime Kuma monitors on the existing instance (`hp260:3310`) for `zeshannasir.com` and for the `zeshans.dev` → new-host redirect.

### 16.6 Rollback

| Failure point | Rollback |
| --- | --- |
| After step 5 | Delete the redirect rule. `zeshans.dev` serves its own content again immediately; the origin was never changed |
| After step 3 | Delete the two DNS records. `zeshannasir.com` returns to unresolved |
| After step 2 | Remove the appended Caddy block, `caddy validate`, reload |
| After step 8 | Cancel Change of Address in Search Console, then roll back step 5 |

The `zeshans.dev` Caddy block, `/var/www/portfolio` and `omega-portal.service` are never modified at any step. That is the property that makes this reversible.

### 16.7 Post-migration monitoring

For 30 days: Search Console coverage and the Change of Address status on both properties; the redirect assertion in Uptime Kuma; origin 404 rate in `/var/log/caddy/zeshannasir.access.log`; and a weekly manual check that `zeshans.dev/portal` still answers.

---

## 17. Build and preview

No build step.

```sh
python3 -m http.server 8000     # http://127.0.0.1:8000
```

Deployment, when authorised, is a file copy into `/var/www/zeshannasir`. Do not reuse the `portfolio` workflow's `rm: true` behaviour without first confirming nothing outside the repository lives in the target directory — see R2.

---

## 18. Test plan

| # | Check | Method | Blocking |
| --- | --- | --- | --- |
| T1 | Every claim on the page appears in section 6.1 as corrected by 6.2 | Sentence-by-sentence review | Yes |
| T2 | No internal IP address, subnet, container ID, hostname, port or model name in any deployable file | `grep -rnE '192\.168\.|100\.(6[4-9]\|[7-9][0-9]\|1[01][0-9]\|12[0-7])\.\|CT ?[0-9]{3}\|:[0-9]{4}\b'` across HTML, CSS, JS and SVG | Yes |
| T3 | Zero requests to any third-party origin | Browser network panel filtered by origin | Yes |
| T4 | HTML validity | `html5validator` or the W3C validator | Yes |
| T5 | Every internal link and fragment resolves | Crawl the preview | Yes |
| T6 | Canonical, title, description, OG and JSON-LD present, consistent, and naming one job title | Script | Yes |
| T7 | `sitemap.xml` matches the route set | Script | Yes |
| T8 | Measured contrast ≥ 4.5:1 body and ≥ 3:1 large, both themes | Per token pair | Yes |
| T9 | Keyboard pass: skip link, nav, theme toggle, mobile toggle, copy-email card, every link | Manual | Yes |
| T10 | Screen-reader pass of the page | VoiceOver | Yes |
| T11 | No horizontal scroll at 320 px and at 400 % zoom, **with `overflow-x: hidden` removed** | Manual | Yes |
| T12 | Rendered layout at 1920, 1440, 1024, 768, 414, 320 px | Screenshots | Yes |
| T13 | Deployable tree under 2 MB excluding `resume.pdf` | `du` | Yes |
| T14 | Lighthouse mobile against the preview; LCP, CLS, total bytes recorded | Report saved | Recorded |
| T15 | `caddy validate` passes on a **copy** of the live Caddyfile with the section 15.2 block appended | Against a copy, never the live file | Yes |
| T16 | Redirect logic dry-run: every row of the section 16.3 table produces exactly one hop, and `/portal` produces none | Against the rule expression, on paper and then in Cloudflare's rule tester if available without saving | Yes |
| T17 | Console clean — no errors, no warnings | Browser console | Yes |

No test may be deleted or weakened to make a run pass.

---

## 19. Known risks

| # | Risk | Severity | Mitigation |
| --- | --- | --- | --- |
| R1 | A blanket `zeshans.dev` redirect breaks `zeshans.dev/portal` | **High** | Section 16.4. Explicitly excluded. T16 proves it |
| R2 | `/var/www/portfolio/status.json` is written by root, is not in any repository, and a deploy with `rm: true` deletes it | High | Identify its writer before the next `portfolio` deploy. Do not replicate `rm: true` for the new webroot |
| R3 | Publishing employer-derived metrics without clearance | High | X7, X8. Clearance or qualitative restatement |
| R4 | The published internal network map | High | X5, X6, T2 |
| R5 | Applying `docs/deployment.md` §2.2 (`AAAA 100::` on the `zeshans.dev` apex) would make the origin unreachable for every path, `/portal` included, and is not reversed by deleting the redirect rule | High | Section 16.4 marks it as superseded. Rewrite or delete that section of the doc |
| R6 | The repository contains two mutually exclusive edge architectures with no marker saying which is rejected | High | Section 15. Rewrite `docs/deployment.md` and `config/` or label them clearly |
| R7 | `immutable` caching on unhashed filenames pins a stale stylesheet for a year | Medium | Section 15.2 note. Reduce `max-age` |
| R8 | `zeshannasir.com` cannot be verified at the public edge before cutover, so Pass B and C evidence is local only | Medium | State it. Do not present a lab number as a field number |
| R9 | The Cisco Umbrella resolver on this workstation intercepts `zeshannasir.com` and returns a block page | Medium | Always verify from the VPS or an external DoH resolver. Never from the workstation resolver alone |
| R10 | `contact@zeshannasir.com` is published but no MX record exists for the domain | High | D3 |
| R11 | Three trees for one site invite editing the wrong one | Medium | `CLAUDE.md` boundary table. Consider deleting `~/Desktop/personal-site` once confirmed redundant |
| R12 | This repository has no remote, so six commits of work exist on one machine only | Medium | Founder decision D4 |

---

## 20. Unresolved items

| ID | Decision | Blocks |
| --- | --- | --- |
| **D1** | **Employer clearance** for the metrics in X7 and X8, or acceptance of qualitative restatement | The three case-study sidebars and the career statistics |
| **D2** | **Orphan content**: promote `content/**` to real routes, or move it under `docs/` | Section 4 resolution |
| **D3** | **Contact address.** `zeshannasir.com` has no MX record. Options: enable Cloudflare Email Routing before cutover (a production change, not permitted in these passes); keep `contact@zeshans.dev` until routing exists; or publish LinkedIn as the primary route | The contact section, `llms.txt`, `content/contact.md`, and the SPF record in section 15.1 |
| **D4** | **Remote for this repository.** Six commits exist only on this machine. Push to a new private GitHub repository, to the Gitea instance, or accept local-only | Nothing in Pass B; a durability decision |
| **D5** | **Fate of `~/portfolio` after cutover.** Archive the GitHub repository, disable the deploy workflow, or keep it as the `/portal`-era artefact | Post-migration housekeeping. The workflow must at minimum be disabled, or a future push will overwrite `/var/www/portfolio` while the redirect is live |
| **D6** | **One job title**, for `<title>`, JSON-LD, `llms.txt`, `career.md` and `resume.pdf` | X14 |
| **D7** | **Companion domains** `zeshan-nasir.com` and `znasir.com` — register or drop the suggestion | `docs/deployment.md` §1.1 |

---

## 21. Implementation order

1. Rewrite `docs/deployment.md` and the three files under `config/` to match the confirmed VPS origin, or mark them explicitly as a rejected alternative. Do this first — leaving two live architectures in the repository is how the wrong one ships.
2. Self-host the fonts (P3) and tighten the CSP accordingly. This unblocks the "zero third-party" claim.
3. Move the QA screenshots out of the deployable tree (P4) and re-export the Open Graph image (P5).
4. Apply the section 6.2 claim corrections in `index.html`, `llms.txt`, `README.md`, `content/contact.md` and `content/career.md`. X1 through X6 first — they are the false and disclosing ones.
5. Redact the services table (X5) and audit both diagram SVGs for the same content.
6. Rework the telemetry section and the status beacon (X10, X11).
7. Remove `overflow-x: hidden` (P2) and fix the real overflow that appears.
8. Fix the copy-email keyboard defect, the table semantics, the SVG text equivalents and the remaining section 12 items.
9. Align navigation labels with section headings (P7, P8).
10. Metadata pass: job title (X14), sitemap, `llms.txt`, JSON-LD.
11. Write the migration artefacts into the repository: the section 16 map, the redirect expression, the cutover order, the rollback table.
12. Full test suite T1–T17; rendered QA at all six breakpoints; independent rejection review.
