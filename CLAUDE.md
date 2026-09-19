# personal-site

Personal website for Zeshan Nasir. Target canonical domain `zeshannasir.com`; legacy domain `zeshans.dev`. Static HTML, CSS and vanilla JavaScript. No framework, no build step.

## Boundary

This is the **verified** personal website repository. Two other trees exist and are not it:

| Path | What it is | Rule |
| --- | --- | --- |
| `~/personal-site` | This repository. `main`, no remote | Write here |
| `~/Desktop/personal-site` | Byte-identical copy at the same HEAD (`1a23711`); only `.git/index` differs | Never write. Do not treat as a fork |
| `~/portfolio` | Source of the **live** `zeshans.dev`. Remote `git@github.com:ZeshanNasir/zeshans.dev.git`, deployed by GitHub Actions | Read-only reference for legacy content and URL inventory |

Do not write into `~/karvan-site`, `~/Desktop/crossborder-enterprise`, `~/infinity-notes`, or any shared infrastructure (Cloudflare, Caddy, DNS, VPS, email). Do not commit, push, tag, merge, rebase, reset or amend without explicit approval.

## Source hierarchy

| Question | Authority |
| --- | --- |
| Identity, biography, projects, current implementation | This repository |
| What is live today, legacy URL inventory | `~/portfolio` and the live edge (read-only) |
| Shared edge architecture | `~/infinity-notes/docs/VPS-Edge-Pipeline.md` (read-only) |
| What this site must contain and how the migration works | `docs/AI/IMPLEMENTATION-CONTRACT.md` (this repo) |

Never invent employers, titles, certifications, awards, project outcomes, clients, testimonials or technical achievements. If two sources disagree, record the conflict rather than silently reconciling.

## Claim rule

Every number on this site is a claim. Three classes, and they are treated differently:

1. **Employer-derived metrics** (anything measured inside Optimizely) — do not publish a figure without written employer clearance. Restate qualitatively instead.
2. **Self-measurable metrics** (the OMEGA cluster) — publish only with a measurement date and method, and only if the measurement can be reproduced.
3. **Future-tense infrastructure claims** — nothing may be described in the present tense until it is actually true at the public edge.

## Infrastructure disclosure rule

Do not publish internal IP addresses, subnets, container identifiers, hostnames, port numbers, VPN topology or resident model names. Describe roles, not addresses.

## Preview

No build step.

```sh
python3 -m http.server 8000     # http://127.0.0.1:8000
```
