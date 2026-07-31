# Design — Luke's site

A locked design system for the four primary landing pages. Preserve their routes,
content, and personal tone; use this system for their visual and interaction layer.

## Genre

Modern-minimal, with a calm technical register.

## Macrostructure family

- About: Split Studio — identity and portrait beside a concise personal brief.
- Projects: Portfolio Grid — work as a searchable-looking technical index, not a card deck.
- Blog: Ecosystem Index — writing as an ordered stream with tag filters.
- Fun: Index-First — personal notes as lightweight field entries.

## Theme

- `--color-paper`: cool near-white
- `--color-ink`: cool charcoal
- `--color-accent`: electric cobalt, used as a small signal only
- `--color-graphite`: the sole dark band and code-surface colour

## Typography

- Display: Space Grotesk, 600, roman
- Body: Inter, 400
- Mono: JetBrains Mono, 500 for labels, dates, shortcuts, and technical metadata

## Spacing

Use the named 4-point scale in `docs/assets/css/tokens.css`; page CSS references
tokens rather than introducing raw spacing values.

## Motion

- One small transform/opacity response for interactive controls.
- No scroll reveals, bounce, parallax, or automatic animation.
- Reduced motion removes spatial transitions.

## Microinteractions stance

- The command palette opens through its button or Cmd/Ctrl+K, filters routes, and closes by Escape or backdrop click.
- Hover states are secondary; keyboard focus and touch interactions remain complete.
- Primary controls use a one-pixel press, not a lift or glow.

## CTA voice

- Primary: compact cobalt rectangular control with a concrete destination label.
- Secondary: plain text link with a cobalt underline.

## Per-page allowances

- About uses the supplied profile photograph only.
- Projects, Blog, and Fun are typography-led; do not invent metrics, testimonials, illustrations, or proof.
- One graphite code/status panel may appear on About as a structural motif, not as a claim about a product.

## What pages must share

- A ruled navigation bar and working command palette.
- Cool paper, cobalt signal, and the Space Grotesk / Inter / JetBrains Mono pairing.
- Six-pixel control corners, visible focus rings, and sparse ruled surfaces.
- A single-line colophon footer.

## What pages may differ on

- Their macrostructure and information density.
- Whether the supplied personal image is present.
- Whether tag filters or detail toggles are necessary to the content.

## Exports

### tokens.css

The source export lives at `docs/assets/css/tokens.css`.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(98.5% 0.004 250);
  --color-ink: oklch(24% 0.02 258);
  --color-accent: oklch(58% 0.20 256);
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --spacing-md: 1.5rem;
}
```

### DTCG `tokens.json`

```json
{
  "color": {
    "paper": { "$value": "oklch(98.5% 0.004 250)", "$type": "color" },
    "ink": { "$value": "oklch(24% 0.02 258)", "$type": "color" },
    "accent": { "$value": "oklch(58% 0.20 256)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Space Grotesk", "$type": "fontFamily" },
    "body": { "$value": "Inter", "$type": "fontFamily" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 98.5% 0.004 250;
  --foreground: 24% 0.02 258;
  --primary: 58% 0.20 256;
  --primary-foreground: 100% 0 0;
  --border: 89% 0.012 250;
  --ring: 58% 0.20 256;
  --radius: 0.375rem;
}
```
