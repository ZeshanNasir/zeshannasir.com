# zeshannasir.com

Source for the personal site of **Zeshan Nasir** — system administrator in Stockholm,
working on infrastructure reliability, enterprise knowledge governance and self-hosted AI.

> **Status: prepared, not live.**
> The site currently served at `zeshans.dev` is built from a different repository
> (`~/portfolio`). This repository holds the rebuilt site and the migration plan that
> moves the identity to `zeshannasir.com`. That cutover has **not** been performed:
> `zeshannasir.com` has no DNS records yet.

## Architecture

- Static HTML, CSS and ~150 lines of vanilla JavaScript. No framework, no build step,
  no dependencies, no lockfile.
- Self-hosted variable fonts. Zero third-party requests at runtime, zero cookies,
  zero analytics.
- Intended origin: Caddy on the existing edge VPS, in its own server block with its own
  web root, behind Cloudflare. See `docs/deployment.md`.

## Layout

```
index.html              the site — a single page
404.html                error page
css/                    tokens.css, base.css, components.css
js/main.js              theme toggle, scroll spy, clipboard copy
assets/fonts/           self-hosted woff2 + SIL OFL licences
assets/diagrams/        two hand-authored SVG diagrams
assets/images/og.png    social card, 1200x630
docs/deployment.md      origin, edge and DNS plan (not applied)
docs/migration.md       zeshans.dev -> zeshannasir.com URL map and cutover
docs/brand.md           positioning and voice
docs/design-system.md   tokens, type scale, layout rules
docs/AI/                the Pass A implementation contract
docs/qa/                rendered QA screenshots — evidence, never deployed
docs/source-content/    long-form drafting source; the site itself is index.html
```

## Preview

```sh
python3 -m http.server 8000     # http://127.0.0.1:8000
```

## What is deliberately not in this repository or on the site

Employer-internal metrics and audit outcomes, private network addresses, host names,
container identifiers, service ports, and resident model names.
