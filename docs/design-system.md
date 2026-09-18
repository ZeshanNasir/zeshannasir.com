# Design System & Visual Specification
**Project:** `zeshannasir.com`  
**Philosophy:** Swiss-Tech Precision · Editorial Restraint · High-Trust Systems Presentation

---

## 1. Color System & Semantic Tokens

The visual system uses a dual-palette architecture designed for long-term readability and technical credibility. Dark mode evokes high-end server room telemetry and Unix workstation restraint; light mode evokes high-grade architectural paper and Swiss editorial typography.

### Dark Theme (Default)
| Token | Hex / HSL | Usage | Contrast vs Background |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#0b0d11` | Root page background | Baseline |
| `--bg-surface` | `#11151c` | Primary cards, panels, headers | Subtle elevation |
| `--bg-surface-raised` | `#171d26` | Hover states, code blocks, active items | Distinct hierarchy |
| `--bg-surface-active` | `#1f2734` | Selected badges, active tabs | High tactile feedback |
| `--border-subtle` | `rgba(255, 255, 255, 0.07)` | Secondary dividers, card inner lines | Low visual noise |
| `--border-strong` | `rgba(255, 255, 255, 0.14)` | Card perimeters, input outlines | Defined structure |
| `--text-primary` | `#f1f5f9` (Slate 100) | Main headlines, body copy | 14.8:1 (AAA) |
| `--text-secondary` | `#94a3b8` (Slate 400) | Subheadlines, narrative descriptions | 7.3:1 (AAA) |
| `--text-muted` | `#64748b` (Slate 500) | Metadata, timestamps, captions | 4.6:1 (AA) |
| `--accent-teal` | `#14b8a6` (Teal 500) | Primary brand accent, live badges, CTAs | 7.9:1 vs canvas |
| `--accent-teal-subtle` | `rgba(20, 184, 166, 0.12)`| Badge background, active glows | - |
| `--accent-emerald` | `#10b981` (Emerald 500) | Verified statuses, quorum health | 8.2:1 vs canvas |
| `--accent-amber` | `#f59e0b` (Amber 500) | Quorum warnings, attention flags | 9.1:1 vs canvas |

### Light Theme (Warm Ivory / Bone)
| Token | Hex / HSL | Usage | Contrast vs Background |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#fbfbf9` | Root page background (Warm ivory) | Baseline |
| `--bg-surface` | `#ffffff` | Primary cards, elevated blocks | Crisp contrast |
| `--bg-surface-raised` | `#f2f2ee` | Code blocks, inset boxes | Subtle warmth |
| `--border-subtle` | `rgba(0, 0, 0, 0.08)` | Divider lines, soft grids | Subtle structure |
| `--border-strong` | `rgba(0, 0, 0, 0.16)` | Card boundaries, borders | Defined edge |
| `--text-primary` | `#0f172a` (Slate 900) | Primary headlines and text | 16.5:1 (AAA) |
| `--text-secondary` | `#334155` (Slate 700) | Descriptions, thesis copy | 9.4:1 (AAA) |
| `--text-muted` | `#64748b` (Slate 500) | Labels, timestamps, mono tags | 4.8:1 (AA) |
| `--accent-teal` | `#0f766e` (Teal 700) | Primary accent in light mode | 6.5:1 vs canvas |
| `--accent-teal-subtle` | `rgba(15, 118, 110, 0.09)`| Badge fills | - |

---

## 2. Typography Hierarchy

### Typefaces
- **Primary Body & Display**: `Inter`, `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Crisp, neutral, highly legible at both micro (11px) and macro (64px) scales.
- **Code & Systems Telemetry**: `JetBrains Mono`, `IBM Plex Mono`, `ui-monospace, SFMono-Regular, Menlo, monospace`
  - High distinctiveness for operational parameters, IP subnets, model weights, and JSON configurations.

### Fluid Type Scale (CSS `clamp()`)
| Level | Font Size Calculation | Mobile | Desktop | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | `clamp(2.5rem, 5vw + 1rem, 4.25rem)` | 40px | 68px | 700 | 1.05 |
| `h1` | `clamp(2rem, 3.5vw + 0.75rem, 3.25rem)` | 32px | 52px | 650 | 1.15 |
| `h2` | `clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)` | 24px | 36px | 600 | 1.25 |
| `h3` | `clamp(1.15rem, 1.2vw + 0.5rem, 1.5rem)` | 18px | 24px | 600 | 1.35 |
| `body-lg` | `clamp(1.05rem, 0.5vw + 0.9rem, 1.2rem)` | 17px | 19px | 400 | 1.65 |
| `body-md` | `1rem` (16px) | 16px | 16px | 400 | 1.60 |
| `body-sm` | `0.875rem` (14px) | 14px | 14px | 400 | 1.50 |
| `mono-xs` | `0.75rem` (12px) | 12px | 12px | 500 | 1.40 |

---

## 3. Spacing, Grid & Layout

- **Base Unit**: `8px` geometric scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`, `128px`).
- **Container Max-Width**: `1200px` with fluid inline padding (`clamp(1.25rem, 4vw, 3rem)`).
- **Asymmetric Grid**:
  - 12-column responsive CSS Grid.
  - Section Headers: 4-column metadata/eyebrow column paired with 8-column narrative/content column.
  - Bento Layouts for telemetry and architecture matrices.

---

## 4. Tactile States & Micro-Interactions

- **Hover Transitions**: `transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;`
- **Focus Rings**: Strict keyboard accessibility with visible, distinct outline: `outline: 2px solid var(--accent-teal); outline-offset: 3px;`
- **Reduced Motion**: All animations wrapped in `@media (prefers-reduced-motion: reduce)` to disable non-essential translations and scale changes.

---

## 5. Architectural Diagramming Rules

1. Diagrams are authored as semantic, responsive SVGs with inline CSS classes matching the design token variables (`stroke: var(--border-strong); fill: var(--bg-surface)`).
2. Clean vector geometry: orthogonal routing, 8px corner radii, legible monospaced port/IP callouts.
3. Interactive hover inspections: hovering a node highlights its dependent pathways and displays operational metadata.
