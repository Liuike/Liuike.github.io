# Design — Luke's site

This is the implementation-facing design reference for the **About** and
**Blog** pages. It records the styles actually shipped from
`docs/assets/css/tokens.css`, `main.scss`, and `landing.css`; do not use it to
infer requirements for other routes.

## Design character

Modern-minimal and editorial: a cool, quiet reading surface with thin rules,
restrained cobalt signals, and compact technical metadata. The site should feel
like a maintained personal index, not a card-based product or marketing page.

## Core tokens

### Colour

All primary colour values are OKLCH and live in `docs/assets/css/tokens.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `oklch(98.5% 0.004 250)` | Page background |
| `--color-paper-2` | `oklch(95.5% 0.008 250)` | Hover and low-emphasis fill |
| `--color-surface` | `oklch(99.4% 0.003 250)` | Controls and panels |
| `--color-ink` | `oklch(24% 0.02 258)` | Headings and primary UI text |
| `--color-ink-2` | `oklch(34% 0.018 257)` | Body copy |
| `--color-muted` | `oklch(48% 0.014 257)` | Dates, labels, and secondary text |
| `--color-rule` | `oklch(89% 0.012 250)` | Default one-pixel divider |
| `--color-rule-strong` | `oklch(76% 0.022 252)` | Hovered control border |
| `--color-accent` | `oklch(58% 0.20 256)` | Links, active states, and small signals |
| `--color-focus` | `oklch(52% 0.21 256)` | Focus outline |
| `--color-graphite` | `oklch(22% 0.016 260)` | Reserved dark surface |
| `--color-overlay` | `oklch(18% 0.01 258 / 0.48)` | Dialog backdrop |

Use cobalt sparingly: it identifies destinations and active choices; it is not a
large background or decorative gradient. Surfaces remain flat—no shadows on
the header, rows, portrait, or filter panel.

### Typography

The font import supplies Space Grotesk, Inter, and JetBrains Mono.

- **Display — Space Grotesk.** Headings use 600 weight with tight `-0.045em`
  tracking and roman styling. The brand is 700; the Chinese name is 500.
- **Body — Inter.** Default reading text is 400 at a 1.6 line-height. Blog
  previews and Project descriptions must use this exact body treatment:
  `--text-base` (16px), Inter 400, `1.6` line-height, and
  `--color-ink-2`. About copy uses `--text-md` with 1.62 line-height.
- **Mono — JetBrains Mono.** 500 weight, uppercase, and spaced tracking are
  used for navigation, dates, filter labels, command-palette UI, and compact
  controls.

The type scale is tokenized from `0.75rem` (`--text-xs`) to
`3.052rem` (`--text-3xl`). The general display size is
`clamp(2.75rem, 5vw + 1rem, 5.25rem)`; collection titles instead use a more
contained `--text-2xl` to `--text-3xl` clamp.

### Spacing, rules, and corners

Use the named four-point-derived scale in `tokens.css`:
`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4.5rem`,
and `7rem`. The shared content rail is `min(100%, 78rem)` with `1.5rem`
side padding on desktop. Rules are `1px solid var(--color-rule)`.

Controls use a `0.375rem` radius; larger overlays use `0.625rem`. The visual
language is primarily square, ruled, and flat rather than rounded or elevated.

## Shared shell

- The header is sticky, cool-paper translucent, and separated by one rule. Its
  desktop height is at least `4.25rem`.
- The display-face brand sits beside a mono, uppercase navigation. The active
  and hovered navigation item changes to cobalt.
- The `Find` control and mobile `Menu` control are small outlined mono buttons
  on a surface fill. On hover-capable devices they receive only a quieter fill
  and stronger border.
- The footer is a centered, single-line mono colophon in a `4.5rem` ruled band.
- The command palette is a centered, flat surface dialog with a dim graphite
  overlay. It opens from Find or Cmd/Ctrl+K, filters routes, and closes with
  Escape or a backdrop click.

## About page reference

About is a concise personal brief, not a promotional hero. The display name,
Chinese name, and compact contact controls lead. A rule then separates a
two-column reading area: body copy on the left and an unframed, naturally sized
portrait on the right. The copy is limited to `78ch`; contact buttons are
flat, outlined, mono-labelled controls with no hover lift.

When present, the latest-posts section continues the index language: a heading
above a ruled list with evenly padded rows, display-face titles, and mono dates.

## Blog page reference

Blog begins with a compact collection header: a `7rem` minimum-height title
band, aligned to the same ruled system. The content becomes a two-column index:
the posts occupy the flexible column and a `13rem` filter panel sits alongside.

Each post is a ruled row, not a card. Its title and date share the first line;
the optional excerpt spans below, remains within `62ch`, and uses body colour.
The filter panel is a flat, ruled surface. Its label and filter buttons use
mono type; the active or hovered filter changes only to cobalt.

## Interaction and accessibility

- Links are cobalt with a subtle accent underline; on hover they become ink and
  their underline follows the current text colour.
- Controls press down by one pixel on activation. Do not add lift, glow,
  bounce, scroll reveals, parallax, or automatic animation.
- Interactive controls retain visible focus outlines; the command-palette input
  uses a 2px cobalt focus ring with a 2px offset.
- Disabled buttons use `opacity: 0.55` and a not-allowed cursor.
- Reduced-motion mode removes transitions inside landing-page content.

## Responsive behaviour

At `48rem` and below, the navigation collapses behind Menu, content padding
reduces to `1rem`, and grid layouts become a single column. The Blog filter
panel moves above the results and its vertical controls become wrapped outlined
chips. Post rows stack their metadata below their titles. At `34rem` and below,
About stacks copy above the portrait. The desktop-only no-wrap About heading is
released on mobile.

## Source of truth

- Tokens and font import: `docs/assets/css/tokens.css`
- Shared shell, About, Blog, and responsive rules: `docs/assets/css/landing.css`
- Baseline focus treatment and document defaults: `docs/assets/css/main.scss`
- About template: `docs/_layouts/home.html`
- Blog template: `docs/pages/blog.md`
